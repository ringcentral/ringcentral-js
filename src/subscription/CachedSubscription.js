import Subscription from "./Subscription";

export default class CachedSubscription extends Subscription {

    constructor(pubnubFactory, platform, cache, cacheKey) {

        super(pubnubFactory, platform);

        /** @type {Cache} */
        this._cache = cache;
        this._cacheKey = cacheKey;

    }

    subscription() {
        return this._cache.getItem(this._cacheKey) || {};
    }

    _setSubscription(subscription) {
        return this._cache.setItem(this._cacheKey, subscription);
    }

    /**
     * This function checks whether there are any pre-defined eventFilters in cache and if not -- uses provided as defaults
     * @param {string[]} events
     * @return {CachedSubscription}
     */
    restore(events) {

        if (!this.eventFilters().length) {
            this.setEventFilters(events);
        }

        return this;

    }

}