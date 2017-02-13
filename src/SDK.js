/**
 * @namespace RingCentral
 */
var objectAssign = require('object-assign');
var Cache = require("./core/Cache");
var Client = require("./http/Client");
var Externals = require("./core/Externals");
var Platform = require("./platform/Platform");
var Subscription = require("./subscription/Subscription");
var CachedSubscription = require("./subscription/CachedSubscription");
var Constants = require("./core/Constants");

/**
 * @constructor
 * @param {string} options.server
 * @param {string} options.appSecret
 * @param {string} options.appKey
 * @param {string} [options.cachePrefix]
 * @param {string} [options.appName]
 * @param {string} [options.appVersion]
 * @param {string} [options.redirectUri]
 * @param {PubNub} [options.PubNub]
 * @param {function(new:Promise)} [options.Promise]
 * @param {Storage} [options.localStorage]
 * @param {fetch} [options.fetch]
 * @param {function(new:Request)} [options.Request]
 * @param {function(new:Response)} [options.Response]
 * @param {function(new:Headers)} [options.Headers]
 * @param {int} [options.refreshDelayMs]
 * @param {int} [options.refreshHandicapMs]
 * @param {boolean} [options.clearCacheOnRefreshError]
 * @property {Externals} _externals
 * @property {Cache} _cache
 * @property {Client} _client
 * @property {Platform} _platform
 */
function SDK(options) {

    /** @private */
    this._externals = new Externals(options);

    /** @private */
    this._cache = new Cache({
        externals: this._externals,
        prefix: options.cachePrefix
    });

    /** @private */
    this._client = new Client(this._externals);

    /** @private */
    this._platform = new Platform(objectAssign({}, options, {
        externals: this._externals,
        client: this._client,
        cache: this._cache
    }));

}

SDK.version = Constants.version;

SDK.server = {
    sandbox: 'https://platform.devtest.ringcentral.com',
    production: 'https://platform.ringcentral.com'
};

/**
 * @return {Platform}
 */
SDK.prototype.platform = function() {
    return this._platform;
};

/**
 * @return {Cache}
 */
SDK.prototype.cache = function() {
    return this._cache;
};

/**
 * @param {int} [options.pollInterval]
 * @param {int} [options.renewHandicapMs]
 * @return {Subscription}
 */
SDK.prototype.createSubscription = function(options) {
    return new Subscription(objectAssign({}, options, {
        externals: this._externals,
        platform: this._platform
    }));
};

/**
 * @param {string} options.cacheKey
 * @param {int} [options.pollInterval]
 * @param {int} [options.renewHandicapMs]
 * @return {CachedSubscription}
 */
SDK.prototype.createCachedSubscription = function(options) {

    if (typeof arguments[0] === 'string') {
        options = {cacheKey: arguments[0].toString()};
    } else {
        options = options || {};
    }

    return new CachedSubscription(objectAssign({}, options, {
        externals: this._externals,
        platform: this._platform,
        cache: this._cache
    }));

};

SDK.handleLoginRedirect = function(origin) {

    var response = window.location.hash ? window.location.hash : window.location.search;
    var msg = {};
    msg[Constants.authResponseProperty] = response;
    window.opener.postMessage(msg, origin || window.location.origin);

};

module.exports = SDK;