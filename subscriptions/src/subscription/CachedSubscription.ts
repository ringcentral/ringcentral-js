import Subscription, {SubscriptionOptions, SubscriptionOptionsConstructor} from "./Subscription";
import {Cache} from "@ringcentral/sdk";

export default class CachedSubscription extends Subscription {

    private _cacheKey:string;
    private _cache:Cache;

    constructor({sdk, PubNub, cacheKey, pollInterval, renewHandicapMs}:CachedSubscriptionOptionsConstructor) {

        super({sdk, PubNub, pollInterval, renewHandicapMs});

        if (!cacheKey) throw new Error('Cached Subscription requires cacheKey parameter to be defined');

        this._cacheKey = cacheKey;
        this._cache = sdk.cache();

    }

    subscription() {
        return this._cache.getItem(this._cacheKey) || {};
    };

    protected _setSubscription(subscription) {
        return this._cache.setItem(this._cacheKey, subscription);
    };

    /**
     * This function checks whether there are any pre-defined eventFilters in cache and if not -- uses provided as defaults
     */
    restore(events:string[]) {

        if (!this.eventFilters().length) {
            this.setEventFilters(events);
        }

        return this;

    };


}

export interface CachedSubscriptionOptions extends SubscriptionOptions {
    cacheKey:string;
}

export interface CachedSubscriptionOptionsConstructor extends SubscriptionOptionsConstructor, CachedSubscriptionOptions {}
