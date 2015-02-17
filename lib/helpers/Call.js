define(function(require, exports, module) {

    'use strict';

    var Helper = require('../core/Helper').Class,
        Utils = require('../core/Utils'),
        List = require('../core/List');

    /**
     * @extends Helper
     * @constructor
     */
    function CallHelper(context) {
        Helper.call(this, context);
        this.presence = require('./Presence').$get(context);
        this.contact = require('./Contact').$get(context);
    }

    CallHelper.prototype = Object.create(Helper.prototype);


    /**
     * @param {ICallOptions} [options]
     * @param {string} [id]
     * @returns {string}
     */
    CallHelper.prototype.createUrl = function(options, id) {

        options = options || {};

        if (!('personal' in options) && !('extensionId' in options)) options.personal = true;

        return '/account/~/' +
               (options.personal || options.extensionId ? ('extension/' + (options.extensionId || '~') + '/') : '') +
               (options.active ? 'active-calls' : 'call-log') +
               (id ? '/' + id : '');

    };

    CallHelper.prototype.getSessionId = function(call) {
        return (call && call.sessionId);
    };

    CallHelper.prototype.isInProgress = function(call) {
        return (call && call.result == 'In Progress');
    };

    CallHelper.prototype.isAlive = function(call) {
        return (call && call.availability == 'Alive');
    };

    /**
     * @param {ICall} call
     * @returns {boolean}
     */
    CallHelper.prototype.isInbound = function(call) {
        return (call && call.direction == 'Inbound');
    };

    /**
     * @param {ICall} call
     * @returns {boolean}
     */
    CallHelper.prototype.isOutbound = function(call) {
        return !this.isInbound(call);
    };

    /**
     * @param {ICall} call
     * @returns {boolean}
     */
    CallHelper.prototype.isMissed = function(call) {
        return (call && call.result == 'Missed');
    };

    /**
     * @param {ICall} call
     * @returns {boolean}
     */
    CallHelper.prototype.isFindMe = function(call) {
        return (call && call.action == 'FindMe');
    };

    /**
     * @param {ICall} call
     * @returns {ICallerInfo}
     */
    CallHelper.prototype.getCallerInfo = function(call) {
        return this.isInbound(call) ? call.from : call.to;
    };

    /**
     * @param {ICall} call
     * @returns {ICallerInfo[]}
     */
    CallHelper.prototype.getAllCallerInfos = function(call) {
        return [this.getCallerInfo(call)].concat(this.isInbound(call) ? call.to : call.from);
    };

    CallHelper.prototype.formatDuration = function(call) {

        function addZero(v) {
            return (v < 10) ? '0' + v : v;
        }

        var duration = parseInt(call.duration),
            hours = Math.floor(duration / (60 * 60)),
            mins = Math.floor((duration % (60 * 60)) / 60),
            secs = Math.floor(duration % 60);

        return (hours ? hours + ':' : '') + addZero(mins) + ':' + addZero(secs);

    };

    /**
     * @param {ICallFilterOptions} [options]
     * @returns {function(ICall)}
     */
    CallHelper.prototype.filter = function(options) {

        options = Utils.extend({
            alive: true,
            direction: '',
            type: ''
        }, options);

        return List.filter([
            //{condition: options.alive, filterFn: this.isAlive},
            {filterBy: 'direction', condition: options.direction},
            {filterBy: 'type', condition: options.type}
        ]);

    };

    /**
     * TODO Compare as dates
     * @param {IListComparatorOptions} [options]
     * @returns {function(object, object)}
     */
    CallHelper.prototype.comparator = function(options) {

        return List.comparator(Utils.extend({
            sortBy: 'startTime'
        }, options));

    };

    /**
     * Injects contact field with appropriate {IContact} data structure into all callerInfos found in
     * all calls Warning, this function may be performance-consuming, reduce the amount of items passed to contacts
     * and calls
     * @param {IContact[]} contacts
     * @param {ICall[]} calls
     * @param {IContactMatchOptions} [options]
     */
    CallHelper.prototype.attachContacts = function(contacts, calls, options) {

        var self = this;

        // Flatten all caller infos from all messages
        var callerInfos = calls.reduce(function(callerInfos, call) {

            return callerInfos.concat(self.getAllCallerInfos(call));

        }, []);

        this.contact.attachToCallerInfos(callerInfos, contacts, options);

    };

    /**
     * Check whether pair of calls are two legs of RingOut
     * @param {ICall} outboundRingOutCall
     * @param {ICall} inboundCall
     * @param {ICallProcessingOptions} options
     * @returns {boolean}
     */
    CallHelper.prototype.checkMergeability = function(outboundRingOutCall, inboundCall, options) {

        function getTime(dateString) {
            return (new Date(dateString)).getTime();
        }

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

    };

    /**
     * @param {ICall} outboundRingOutCall
     * @param {ICall} inboundCall
     * @param {ICallProcessingOptions} [options]
     * @returns {Array}
     */
    CallHelper.prototype.combineCalls = function(outboundRingOutCall, inboundCall, options) {

        options = options || {};

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

    };

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
     *
     * @param {ICall[]} calls
     * @param {ICallProcessingOptions} options
     * @returns {ICall[]}
     */
    CallHelper.prototype.processCalls = function(calls, options) {

        var processedCalls = [],
            callsToMerge = [],
            self = this;

        // Iterate through calls
        calls.forEach(function(call) {

            var merged = false;

            call.subsequent = false;
            call.hasSubsequent = false;

            // Second cycle to find other leg
            // It is assumed that call is the outbound, secondCall is inbound
            calls.some(function(secondCall) {

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
        calls.forEach(function(call) {

            if (callsToMerge.indexOf(call) == -1) processedCalls.push(call);

        });

        return processedCalls;

    };

    /**
     * Converts Presence's ActiveCall array into regular Calls array
     * @param {IPresenceCall[]} activeCalls
     * @returns {ICall[]}
     */
    CallHelper.prototype.parsePresenceCalls = function(activeCalls) {

        return activeCalls.map(function(activeCall) {

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

        }, this);

    };

    /**
     * @param {ICall} call
     * @returns {string}
     */
    CallHelper.prototype.getSignature = function(call) {

        function cleanup(phoneNumber) {
            return (phoneNumber || '').toString().replace(/[^0-9]/ig, '');
        }

        return call.direction + '|' + (call.from && cleanup(call.from.phoneNumber)) + '|' + (call.to && cleanup(call.to.phoneNumber));

    };

    /**
     * @param {ICall[]} presenceCalls
     * @param {IPresence} presence
     * @returns {ICall[]}
     */
    CallHelper.prototype.mergePresenceCalls = function(presenceCalls, presence) {

        var currentDate = new Date(),

            activeCalls = this
                .parsePresenceCalls(presence && presence.activeCalls || [])
                .map(function(call) {
                    // delete property to make sure it is skipped during merge
                    delete call.startTime;
                    return call;
                });

        presenceCalls = this.merge(presenceCalls || [], activeCalls, this.getSessionId, true);

        presenceCalls.forEach(function(call) {
            if (!call.startTime) call.startTime = currentDate.toISOString();
        });

        return presenceCalls;

    };

    /**
     * @param {ICall[]} presenceCalls
     * @param {ICall[]} calls
     * @param {ICall[]} activeCalls
     * @returns {ICall[]}
     */
    CallHelper.prototype.mergeAll = function(presenceCalls, calls, activeCalls) {

        // First, merge calls into presence calls
        var presenceAndCalls = this.merge(presenceCalls || [], calls || [], this.getSessionId, true);

        // Second, merge activeCalls into previous result
        return this.merge(presenceAndCalls, activeCalls || [], this.getSessionId, true);

    };

    module.exports = {
        Class: CallHelper,
        /**
         * @param {Context} context
         * @returns {CallHelper}
         */
        $get: function(context) {

            return context.createSingleton('CallHelper', function() {
                return new CallHelper(context);
            });

        }
    };

    /**
     * @typedef {object} ICall
     * @property {string} id
     * @property {string} uri
     * @property {string} sessionId
     * @property {string} startTime
     * @property {string} duration
     * @property {string} type
     * @property {string} direction
     * @property {string} action
     * @property {string} result
     * @property {ICallerInfo} to
     * @property {ICallerInfo} from
     */

    /**
     * @typedef {object} ICallOptions
     * @property {string} extensionId
     * @property {boolean} active
     * @property {boolean} personal
     */

    /**
     * @typedef {object} ICallProcessingOptions
     * @property {boolean} strict
     * @property {boolean} merge
     * @property {number} maxStartTimeDiscrepancy
     */

    /**
     * @typedef {object} ICallFilterOptions
     * @property {string} extensionId
     * @property {string} direction
     * @property {string} type
     */

    /**
     * @see http://platform-dev.dins.ru/artifacts/documentation/latest/webhelp/dev_guide_advanced/CallerInfo.html
     * @typedef {Object} ICallerInfo
     * @property {string} phoneNumber
     * @property {string} extensionNumber
     * @property {string} name
     * @property {string} location
     * @property {IContact} [contact] - corresponding contact (added by attachContacts methods)
     * @property {string} [contactPhone] - contact's phone as written in contact (added by attachContacts methods)
     */

});
