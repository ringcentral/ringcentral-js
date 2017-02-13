var EventEmitter = require("events").EventEmitter;

/**
 * @param {Platform} options.platform
 * @param {Externals} options.externals
 * @param {int} [options.pollInterval]
 * @param {int} [options.renewHandicapMs]
 * @property {Externals} _externals
 * @property {Platform} _platform
 * @property {int} _pollInterval
 * @property {int} _renewHandicapMs
 * @property {PubNub} _pubnub
 * @property {string} _pubnubLastChannel
 * @property {int} _timeout
 * @property {ISubscription} _subscription
 * @constructor
 */
function Subscription(options) {

    EventEmitter.call(this);

    options = options || {};

    this.events = {
        notification: 'notification',
        removeSuccess: 'removeSuccess',
        removeError: 'removeError',
        renewSuccess: 'renewSuccess',
        renewError: 'renewError',
        subscribeSuccess: 'subscribeSuccess',
        subscribeError: 'subscribeError'
    };

    /** @private */
    this._externals = options.externals;

    /** @private */
    this._platform = options.platform;

    /** @private */
    this._pollInterval = options.pollInterval || 10 * 1000;

    /** @private */
    this._renewHandicapMs = options.renewHandicapMs || 2 * 60 * 1000;

    /** @private */
    this._pubnub = null;

    /** @private */
    this._pubnubLastChannel = null;

    /** @private */
    this._pubnubLastSubscribeKey = null;

    /** @private */
    this._timeout = null;

    /** @private */
    this._subscription = null;

}

Subscription.prototype = Object.create(EventEmitter.prototype);

Subscription.prototype.subscribed = function() {

    var subscription = this.subscription();

    return !!(subscription.id &&
              subscription.deliveryMode &&
              subscription.deliveryMode.subscriberKey &&
              subscription.deliveryMode.address);

};

/**
 * @return {boolean}
 */
Subscription.prototype.alive = function() {
    return this.subscribed() && Date.now() < this.expirationTime();
};

/**
 * @return {boolean}
 */
Subscription.prototype.expired = function() {
    if (!this.subscribed()) return true;
    return !this.subscribed() || Date.now() > this.subscription().expirationTime;
};

Subscription.prototype.expirationTime = function() {
    return new Date(this.subscription().expirationTime || 0).getTime() - this._renewHandicapMs;
};

/**
 * @param {ISubscription} subscription
 * @return {Subscription}
 */
Subscription.prototype.setSubscription = function(subscription) {

    subscription = subscription || {};

    this._clearTimeout();
    this._setSubscription(subscription);
    this._subscribeAtPubnub();
    this._setTimeout();

    return this;

};

/**
 * @return {ISubscription}
 */
Subscription.prototype.subscription = function() {
    return this._subscription || {};
};

/**
 * Creates or updates subscription if there is an active one
 * @returns {Promise<ApiResponse>}
 */
Subscription.prototype.register = function() {

    if (this.alive()) {
        return this.renew();
    } else {
        return this.subscribe();
    }

};

/**
 * @return {string[]}
 */
Subscription.prototype.eventFilters = function() {
    return this.subscription().eventFilters || [];
};

/**
 * @param {string[]} events
 * @return {Subscription}
 */
Subscription.prototype.addEventFilters = function(events) {
    this.setEventFilters(this.eventFilters().concat(events));
    return this;
};

/**
 * @param {string[]} events
 * @return {Subscription}
 */
Subscription.prototype.setEventFilters = function(events) {
    var subscription = this.subscription();
    subscription.eventFilters = events;
    this._setSubscription(subscription);
    return this;
};

/**
 * @returns {Promise<ApiResponse>}
 */
Subscription.prototype.subscribe = function() {

    return (new this._externals.Promise(function(resolve) {

        this._clearTimeout();

        if (!this.eventFilters().length) throw new Error('Events are undefined');

        resolve(this._platform.post('/subscription', {
            eventFilters: this._getFullEventFilters(),
            deliveryMode: {
                transportType: 'PubNub'
            }
        }));

    }.bind(this))).then(function(response) {

        var json = response.json();

        this.setSubscription(json)
            .emit(this.events.subscribeSuccess, response);

        return response;

    }.bind(this)).catch(function(e) {

        e = this._platform.client().makeError(e);

        this.reset()
            .emit(this.events.subscribeError, e);

        throw e;

    }.bind(this));

};

/**
 * @returns {Promise<ApiResponse>}
 */
Subscription.prototype.renew = function() {

    return (new this._externals.Promise(function(resolve) {

        this._clearTimeout();

        if (!this.subscribed()) throw new Error('No subscription');

        if (!this.eventFilters().length) throw new Error('Events are undefined');

        resolve(this._platform.put('/subscription/' + this.subscription().id, {
            eventFilters: this._getFullEventFilters()
        }));

    }.bind(this))).then(function(response) {

        var json = response.json();

        this.setSubscription(json)
            .emit(this.events.renewSuccess, response);

        return response;

    }.bind(this)).catch(function(e) {

        e = this._platform.client().makeError(e);

        this.reset()
            .emit(this.events.renewError, e);

        throw e;

    }.bind(this));

};

/**
 * @returns {Promise<ApiResponse>}
 */
Subscription.prototype.remove = function() {

    return (new this._externals.Promise(function(resolve) {

        if (!this.subscribed()) throw new Error('No subscription');

        resolve(this._platform.delete('/subscription/' + this.subscription().id));

    }.bind(this))).then(function(response) {

        this.reset()
            .emit(this.events.removeSuccess, response);

        return response;

    }.bind(this)).catch(function(e) {

        e = this._platform.client().makeError(e);

        this.emit(this.events.removeError, e);

        throw e;

    }.bind(this));

};

/**
 * @returns {Promise<ApiResponse>}
 */
Subscription.prototype.resubscribe = function() {
    var filters = this.eventFilters();
    return this.reset().setEventFilters(filters).subscribe();
};

/**
 * Remove subscription and disconnect from PubNub
 * This method resets subscription at client side but backend is not notified
 * @return {Subscription}
 */
Subscription.prototype.reset = function() {
    this._clearTimeout();
    this._unsubscribeAtPubnub();
    this._setSubscription(null);
    return this;
};

/**
 * @param subscription
 * @private
 */
Subscription.prototype._setSubscription = function(subscription) {
    this._subscription = subscription;
};

/**
 * @return {string[]}
 * @private
 */
Subscription.prototype._getFullEventFilters = function() {

    return this.eventFilters().map(function(event) {
        return this._platform.createUrl(event);
    }.bind(this));

};

/**
 * @return {Subscription}
 * @private
 */
Subscription.prototype._setTimeout = function() {

    this._clearTimeout();

    if (!this.alive()) throw new Error('Subscription is not alive');

    this._timeout = setInterval(function() {

        if (this.alive()) return;

        if (this.expired()) {
            this.subscribe();
        } else {
            this.renew();
        }

    }.bind(this), this._pollInterval);

    return this;

};

/**
 * @return {Subscription}
 * @private
 */
Subscription.prototype._clearTimeout = function() {
    clearInterval(this._timeout);
    return this;
};

Subscription.prototype._decrypt = function(message) {

    if (!this.subscribed()) throw new Error('No subscription');

    if (this.subscription().deliveryMode.encryptionKey) {

        message = this._pubnub.decrypt(message, this.subscription().deliveryMode.encryptionKey, {
            encryptKey: false,
            keyEncoding: 'base64',
            keyLength: 128,
            mode: 'ecb'
        });

    }

    return message;

};

/**
 * @param message
 * @return {Subscription}
 * @private
 */
Subscription.prototype._notify = function(message) {
    this.emit(this.events.notification, this._decrypt(message));
    return this;
};

/**
 * @return {Subscription}
 * @private
 */
Subscription.prototype._subscribeAtPubnub = function() {

    if (!this.alive()) throw new Error('Subscription is not alive');

    var deliveryMode = this.subscription().deliveryMode;

    if (this._pubnub) {

        if (this._pubnubLastChannel === deliveryMode.address) {

            // Nothing to update, keep listening to same channel
            return this;

        } else if (this._pubnubLastSubscribeKey && this._pubnubLastSubscribeKey !== deliveryMode.subscriberKey) {

            // Subscribe key changed, need to reset everything
            this._unsubscribeAtPubnub();

        } else if (this._pubnubLastChannel) {

            // Need to subscribe to new channel
            this._pubnub.unsubscribeAll();

        }

    }

    if (!this._pubnub) {

        this._pubnubLastSubscribeKey = deliveryMode.subscriberKey;

        var PubNub = this._externals.PubNub;

        this._pubnub = new PubNub({
            ssl: true,
            subscribeKey: deliveryMode.subscriberKey
        });

        this._pubnub.addListener({
            status: function(statusEvent) {},
            message: function(m) {
                this._notify(m.message); // all other props are ignored
            }.bind(this)
        });

    }

    this._pubnubLastChannel = deliveryMode.address;
    this._pubnub.subscribe({channels: [deliveryMode.address]});

    return this;

};

/**
 * @return {Subscription}
 * @private
 */
Subscription.prototype._unsubscribeAtPubnub = function() {

    if (!this.subscribed() || this._pubnub) return this;

    this._pubnub.removeAllListeners();
    this._pubnub.destroy(); // this will unsubscribe from all

    this._pubnubLastSubscribeKey = null;
    this._pubnubLastChannel = null;
    this._pubnub = null;

    return this;

};

module.exports = Subscription;

/**
 * The complete Triforce, or one or more components of the Triforce.
 * @typedef {Object} ISubscription
 * @property {string} [id]
 * @property {string} [uri]
 * @property {string[]} [eventFilters]
 * @property {string} [expirationTime] Format: 2014-03-12T19:54:35.613Z
 * @property {int} [expiresIn]
 * @property {string} [deliveryMode.transportType]
 * @property {boolean} [deliveryMode.encryption]
 * @property {string} [deliveryMode.address]
 * @property {string} [deliveryMode.subscriberKey]
 * @property {string} [deliveryMode.encryptionKey]
 * @property {string} [deliveryMode.secretKey]
 * @property {string} [creationTime]
 * @property {string} [status] Active
 */