import PubNubDefault from "pubnub";
import {SDK} from "@ringcentral/sdk";
import Subscription, {SubscriptionOptions} from "./subscription/Subscription";
import CachedSubscription, {CachedSubscriptionOptions} from "./subscription/CachedSubscription";

declare const window: any; //FIXME TS Crap

export {
    SubscriptionOptions,
    CachedSubscriptionOptions
}

export class Subscriptions {

    private _sdk: SDK;
    private _PubNub: any; // typeof PubNub;

    constructor({sdk, PubNub = PubNubDefault}: SubscriptionsOptions) {
        this._sdk = sdk;
        this._PubNub = PubNub;
    }

    createSubscription({pollInterval, renewHandicapMs}: SubscriptionOptions) {
        return new Subscription({
            pollInterval,
            renewHandicapMs,
            sdk: this._sdk,
            PubNub: this._PubNub
        });
    }

    createCachedSubscription({cacheKey, pollInterval, renewHandicapMs}: CachedSubscriptionOptions) {

        return new CachedSubscription({
            cacheKey,
            pollInterval,
            renewHandicapMs,
            sdk: this._sdk,
            PubNub: this._PubNub
        });

    }

    getPubNub() {
        return this._PubNub;
    }

}

export interface SubscriptionsOptions {
    sdk: SDK;
    PubNub?: typeof PubNubDefault;
}

export default Subscriptions;

namespace RingCentral.subscriptions {
    declare const Subscriptions;
}