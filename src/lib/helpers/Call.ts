/// <reference path="../../typings/externals.d.ts" />

import context = require('../core/Context');
import helper = require('../core/Helper');
import validator = require('../core/Validator');
import list = require('../core/List');
import presence = require('./Presence');
import contact = require('./Contact');

export class Call extends helper.Helper {

    private list:list.List;
    private presence:presence.Presence;
    private contact:contact.Contact;

    constructor(context:context.Context) {
        super(context);
        this.list = list.$get(context);
        this.contact = contact.$get(context);
        this.presence = presence.$get(context);
    }

    createUrl(options?:ICallOptions, id?:string) {

        options = options || {};

        if (!('personal' in options) && !('extensionId' in options)) options.personal = true;

        return '/account/~/' +
               (options.personal || options.extensionId ? ('extension/' + (options.extensionId || '~') + '/') : '') +
               (options.active ? 'active-calls' : 'call-log') +
               (id ? '/' + id : '');

    }

    getSessionId(call:ICall) {
        return (call && call.sessionId);
    }

    isInProgress(call:ICall) {
        return (call && call.result == 'In Progress');
    }

    isAlive(call:ICall) {
        return (call && call.availability == 'Alive');
    }

    isInbound(call:ICall) {
        return (call && call.direction == 'Inbound');
    }

    isOutbound(call:ICall) {
        return !this.isInbound(call);
    }

    isMissed(call:ICall) {
        return (call && call.result == 'Missed');
    }

    isFindMe(call:ICall) {
        return (call && call.action == 'FindMe');
    }

    getCallerInfo(call:ICall):ICallerInfo {
        return this.isInbound(call) ? call.from : call.to;
    }

    getAllCallerInfos(call:ICall):ICallerInfo[] {
        return [this.getCallerInfo(call)].concat(this.isInbound(call) ? call.to : call.from);
    }

    formatDuration(call:ICall) {

        function addZero(v) {
            return (v < 10) ? '0' + v : v;
        }

        var duration = parseInt(<any>call.duration),
            hours = Math.floor(duration / (60 * 60)),
            mins = Math.floor((duration % (60 * 60)) / 60),
            secs = Math.floor(duration % 60);

        return (hours ? hours + ':' : '') + addZero(mins) + ':' + addZero(secs);

    }

    filter(options?:ICallFilterOptions):(call:ICall)=>boolean {

        options = this.utils.extend({
            alive: true,
            direction: '',
            type: ''
        }, options);

        return this.list.filter([
            //{condition: options.alive, filterFn: this.isAlive},
            {filterBy: 'direction', condition: options.direction},
            {filterBy: 'type', condition: options.type}
        ]);

    }

    comparator(options?:list.IListComparatorOptions) {

        return this.list.comparator(this.utils.extend({
            sortBy: 'startTime'
        }, options));

    }

    /**
     * Injects contact field with appropriate {IContact} data structure into all callerInfos found in
     * all calls Warning, this function may be performance-consuming, reduce the amount of items passed to contacts
     * and calls
     */
    attachContacts(contacts:contact.IContact[], calls:ICall[], options?:contact.IContactMatchOptions) {

        // Flatten all caller infos from all messages
        var callerInfos = calls.reduce((callerInfos, call) => {

            return callerInfos.concat(this.getAllCallerInfos(call));

        }, []);

        this.contact.attachToCallerInfos(callerInfos, contacts, options);

    }

    /**
     * Check whether pair of calls are two legs of RingOut
     */
    checkMergeability(outboundRingOutCall:ICall, inboundCall:ICall, options?:ICallProcessingOptions):boolean {

        var getTime = (dateString) => {
            return (new Date(dateString)).getTime();
        };

        return (
        (!options.strict || outboundRingOutCall.action && outboundRingOutCall.action.toLowerCase().indexOf('ringout') != -1) &&
        // Check directions
        outboundRingOutCall.direction == 'Outbound' &&
        inboundCall.direction == 'Inbound' &&
        // Check that start times are equal or close enough
        ((!inboundCall.startTime && !outboundRingOutCall.startTime) || Math.abs(getTime(inboundCall.startTime) - getTime(outboundRingOutCall.startTime)) < (options.maxStartTimeDiscrepancy || 5000)) &&
        // Check that numbers match
        inboundCall.from.phoneNumber == outboundRingOutCall.to.phoneNumber &&
        (inboundCall.to.phoneNumber == outboundRingOutCall.from.phoneNumber || inboundCall.to.name == outboundRingOutCall.from.name) //TODO Maybe name check is not required
        );

    }

    combineCalls(outboundRingOutCall:ICall, inboundCall:ICall, options?:ICallProcessingOptions):ICall[] {

        options = options || <any>{};

        var result = [];

        outboundRingOutCall.hasSubsequent = true;

        if (options.merge) {

            outboundRingOutCall.duration = (outboundRingOutCall.duration > inboundCall.duration) ? outboundRingOutCall.duration : inboundCall.duration;

            // TODO Usually information from inbound call is more accurate for unknown reason
            outboundRingOutCall.from = inboundCall.to;
            outboundRingOutCall.to = inboundCall.from;

            // Push only one "merged" outbound call
            result.push(outboundRingOutCall);

        } else {

            // Mark next call as subsequent
            inboundCall.subsequent = true;

            inboundCall.startTime = outboundRingOutCall.startTime; // Needed for sort

            // Push both calls, first outbound then inbound
            result.push(outboundRingOutCall);
            result.push(inboundCall);

        }

        return result;

    }

    /**
     * (!) Experimental (!)
     *
     * Calls in Recent Calls (Call Log) or Active Calls arrays can be combined if they are, for example, two legs of
     * one RingOut. The logic that stands behind this process is simple:
     *
     * - Calls must have opposite directions
     * - Must have been started within a certain limited time frame
     * - Must have same phone numbers in their Caller Info sections (from/to)
     *
     * ```js
     * var processedCalls = Call.processCalls(callsArray, {strict: false, merge: true});
     * ```
     *
     * Flags:
     *
     * - if `strict` is `true` then only calls with RingOut in `action` property will be affected
     * - `merge` &mdash; controls whether to merge calls (reducing the length of array) or give them `subsequent`
     *     and `hasSubsequent` properties
     */
    processCalls(calls:ICall[], options?:ICallProcessingOptions):ICall[] {

        var processedCalls = [],
            callsToMerge = [],
            self = this;

        // Iterate through calls
        calls.forEach((call:ICall) => {

            var merged = false;

            call.subsequent = false;
            call.hasSubsequent = false;

            // Second cycle to find other leg
            // It is assumed that call is the outbound, secondCall is inbound
            calls.some((secondCall:ICall) => {

                if (call === secondCall) return false;

                if (self.checkMergeability(call, secondCall, options)) {

                    // Push to result array merged call
                    processedCalls = processedCalls.concat(self.combineCalls(call, secondCall, options));

                    // Push to array calls that are merged
                    callsToMerge.push(call);
                    callsToMerge.push(secondCall);

                    merged = true;

                }

                return merged;

            });

        });

        // After all calls are merged, add non-merged calls
        calls.forEach((call:ICall) => {

            if (callsToMerge.indexOf(call) == -1) processedCalls.push(call);

        });

        return processedCalls;

    }

    /**
     * Converts Presence's ActiveCall array into regular Calls array
     */
    parsePresenceCalls(activeCalls:presence.IPresenceCall[]):ICall[] {

        return activeCalls.map((activeCall:presence.IPresenceCall):ICall => {

            return {
                id: activeCall.id,
                uri: '',
                sessionId: activeCall.sessionId,
                from: {phoneNumber: activeCall.from},
                to: {phoneNumber: activeCall.to},
                direction: activeCall.direction,
                startTime: '',
                duration: 0,
                type: '',
                action: '',
                result: this.presence.isCallInProgress(activeCall) ? 'In Progress' : activeCall.telephonyStatus,
                telephonyStatus: activeCall.telephonyStatus // non-standard property for compatibility
            };

        });

    }

    getSignature(call:ICall) {

        var cleanup = (phoneNumber) => {
            return (phoneNumber || '').toString().replace(/[^0-9]/ig, '');
        };

        return call.direction + '|' + (call.from && cleanup(call.from.phoneNumber)) + '|' + (call.to && cleanup(call.to.phoneNumber));

    }

    mergePresenceCalls(presenceCalls:ICall[], presence:presence.IPresence):ICall[] {

        var currentDate = new Date(),

            activeCalls = this
                .parsePresenceCalls(presence && presence.activeCalls || [])
                .map((call:ICall) => {
                    // delete property to make sure it is skipped during merge
                    delete call.startTime;
                    return call;
                });

        presenceCalls = this.merge(presenceCalls || [], activeCalls, this.getSessionId, true);

        presenceCalls.forEach((call:ICall) => {
            if (!call.startTime) call.startTime = currentDate.toISOString();
        });

        return presenceCalls;

    }

    mergeAll(presenceCalls:ICall[], calls:ICall[], activeCalls:ICall[]):ICall[] {

        // First, merge calls into presence calls
        var presenceAndCalls = this.merge(presenceCalls || [], calls || [], this.getSessionId, true);

        // Second, merge activeCalls into previous result
        return this.merge(presenceAndCalls, activeCalls || [], this.getSessionId, true);

    }

}

export function $get(context:context.Context):Call {
    return context.createSingleton('Call', ()=> {
        return new Call(context);
    });
}

export interface ICall extends helper.IHelperObject {
    sessionId?:string;
    availability?:string;
    startTime?:string;
    duration?:number;
    type?:string;
    direction?:string;
    action?:string;
    result?:string;
    to?:ICallerInfo;
    from?:ICallerInfo;
    subsequent?:boolean; // added during processing
    hasSubsequent?:boolean; // added during processing
    telephonyStatus?:string; // added during processing
}

export interface ICallOptions {
    extensionId?:string;
    active?:boolean;
    personal?:boolean;
}

export interface ICallProcessingOptions {
    maxStartTimeDiscrepancy?:number;
    strict?:boolean;
    merge?:boolean;
}

export interface ICallFilterOptions {
    extensionId?:string;
    direction?:string;
    type?:string;
}

/**
 * @see http://platform-dev.dins.ru/artifacts/documentation/latest/webhelp/dev_guide_advanced/CallerInfo.html
 */
export interface ICallerInfo {
    phoneNumber?:string;
    extensionNumber?:string;
    name?:string;
    location?:string;
    contact?:contact.IContact; // corresponding contact (added by attachContacts methods)
    contactPhone?:string; // contact's phone as written in contact (added by attachContacts methods)
}