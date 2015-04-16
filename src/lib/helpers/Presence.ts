/// <reference path="../../typings/externals.d.ts" />

import context = require('../core/Context');
import helper = require('../core/Helper');
import subscription = require('../core/Subscription');
import extension = require('./Extension');

export class Presence extends helper.Helper {

    private extension:extension.Extension;

    constructor(context:context.Context) {
        super(context);
        this.extension = extension.$get(context);
    }

    createUrl(options?:IPresenceOptions, id?:string) {

        options = options || {};

        return '/account/~/extension/' + (id || '~') + '/presence' + (options.detailed ? '?detailedTelephonyState=true' : '');

    }

    getId(presence:IPresence) {
        return presence && (this.extension.getId(presence.extension) || presence.extensionId);
    }

    isAvailable(presence:IPresence) {
        return presence && presence.presenceStatus == 'Available';
    }

    getSubscription(options?:IPresenceOptions, id?:string):subscription.Subscription {

        return subscription.$get(this.context).setEvents([this.createUrl(options, id)]);

    }

    updateSubscription(subscription:subscription.Subscription,
                       presences:IPresence[],
                       options?:IPresenceOptions):subscription.Subscription {

        var events = presences.map(this.getId, this).map((id) => {
            return this.createUrl(options, id);
        }, this);

        subscription.addEvents(events);

        return subscription;

    }

    attachToExtensions(extensions:extension.IExtension[], presences:IPresence[], merge?:boolean) {

        var index = this.index(presences);

        extensions.forEach((ex:extension.IExtension) => {

            var presence = index[this.extension.getId(ex)];

            if (presence) {
                if ('presence' in ex && merge) {
                    this.utils.extend(ex.presence, presence);
                } else {
                    ex.presence = presence;
                }
            }

        }, this);

        return this;

    }

    isCallInProgress(presenceCall:IPresenceCall) {
        return (presenceCall && presenceCall.telephonyStatus != 'NoCall');
    }


}

export function $get(context:context.Context):Presence {
    return context.createSingleton('Presence', ()=> {
        return new Presence(context);
    });
}

export interface IPresence extends helper.IHelperObject {
    extension?:extension.IExtension;
    activeCalls?:IPresenceCall[];
    presenceStatus?:string; // Offline, Busy, Available
    telephonyStatus?:string; // NoCall, CallConnected, Ringing, OnHold
    userStatus?:string; // Offline, Busy, Available
    dndStatus?:string; // TakeAllCalls, DoNotAcceptAnyCalls, DoNotAcceptDepartmentCalls, TakeDepartmentCallsOnly
    allowSeeMyPresence?:boolean;
    ringOnMonitoredCall?:boolean;
    pickUpCallsOnHold?:boolean;
    extensionId?:string;
    sequence?:number;
}

export interface IPresenceCall {
    direction?:string;
    from?:string;
    to?:string;
    sessionId?:string;
    id?:string;
    telephonyStatus?:string;
}

export interface IPresenceOptions {
    detailed?:boolean;
}
