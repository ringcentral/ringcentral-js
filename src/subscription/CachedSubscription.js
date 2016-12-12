var Subscription = require("./Subscription");

/**
 * @param {Platform} options.platform
 * @param {Externals} options.externals
 * @param {Cache} options.cache
 * @param {string} options.cacheKey
 * @param {int} [options.pollInterval]
 * @param {int} [options.renewHandicapMs]
 * @return {CachedSubscription}
 * @constructor
 * @property {Cache} _cache
 * @extends Subscription
 */
function CachedSubscription(options) {

    options = options || {};

    if (!options.cacheKey) throw new Error('Cached Subscription requires cacheKey parameter to be defined');

    /** @private */
    this._cacheKey = options.cacheKey;

    Subscription.call(this, options);

    /** @private */
    this._cache = options.cache;

    // This is not used in this class
    this._subscription = undefined;

}

CachedSubscription.prototype = Object.create(Subscription.prototype);

CachedSubscription.prototype.subscription = function() {
    return this._cache.getItem(this._cacheKey) || {};
};

CachedSubscription.prototype._setSubscription = function(subscription) {
    return this._cache.setItem(this._cacheKey, subscription);
};

/**
 * This function checks whether there are any pre-defined eventFilters in cache and if not -- uses provided as defaults
 * @param {string[]} events
 * @return {CachedSubscription}
 */
CachedSubscription.prototype.restore = function(events) {

    if (!this.eventFilters().length) {
        this.setEventFilters(events);
    }

    return this;

};

module.exports = CachedSubscription;