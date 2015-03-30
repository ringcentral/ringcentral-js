define(function(require, exports, module) {

    'use strict';

    var Observable = require('./Observable').Class,
        Log = require('./Log'),
        Utils = require('./Utils'),
        renewHandicapMs = 60 * 1000;

    /**
     * @constructor
     * @extends Observable
     * @alias RCSDK.core.Subscription
     * @param {Context} context
     */
    function Subscription(context) {
        Observable.call(this);
        this.eventFilters = [];
        this.timeout = null;
        this.subscription = {
            eventFilters: [],
            expirationTime: '', // 2014-03-12T19:54:35.613Z
            expiresIn: 0,
            deliveryMode: {
                transportType: 'PubNub',
                encryption: false,
                address: '',
                subscriberKey: '',
                secretKey: ''
            },
            id: '',
            creationTime: '', // 2014-03-12T19:54:35.613Z
            status: '', // Active
            uri: ''
        };
        /** @type {PUBNUB} */
        this.pubnub = null;
        this.context = context;
    }

    Subscription.prototype = Object.create(Observable.prototype);
    Object.defineProperty(Subscription.prototype, 'constructor', {value: Subscription, enumerable: false});

    Subscription.prototype.events = {
        notification: 'notification',
        removeSuccess: 'removeSuccess',
        removeError: 'removeError',
        renewSuccess: 'renewSuccess',
        renewError: 'renewError',
        subscribeSuccess: 'subscribeSuccess',
        subscribeError: 'subscribeError'
    };

    /**
     * @returns {PUBNUB}
     */
    Subscription.prototype.getPubnub = function() {

        return this.context.getPubnub();

    };

    Subscription.prototype.getCrypto = function() {

        return this.context.getCryptoJS();

    };

    Subscription.prototype.getPlatform = function() {

        return require('./Platform').$get(this.context);

    };

    /**
     * Creates or updates subscription if there is an active one
     * @param {{events?:string[]}} [options] New array of events
     * @returns {Promise}
     */
    Subscription.prototype.register = function(options) {

        if (this.isSubscribed()) {
            return this.renew(options);
        } else {
            return this.subscribe(options);
        }

    };

    Subscription.prototype.addEvents = function(events) {
        this.eventFilters = this.eventFilters.concat(events);
        return this;
    };

    Subscription.prototype.setEvents = function(events) {
        this.eventFilters = events;
        return this;
    };

    Subscription.prototype.getFullEventFilters = function() {

        return this.eventFilters.map(function(event) {
            return this.getPlatform().apiUrl(event);
        }.bind(this));

    };

    /**
     * @private
     * @param {Array} [options.events] New array of events
     * @returns {Promise}
     */
    Subscription.prototype.subscribe = function(options) {

        options = options || {};
        if (options.events) this.eventFilters = options.events;

        this.clearTimeout();

        return new (this.context.getPromise())(
            function(resolve, reject) {

                if (!this.eventFilters || !this.eventFilters.length) throw new Error('Events are undefined');

                resolve(this.getPlatform().apiCall({
                    method: 'POST',
                    url: '/restapi/v1.0/subscription',
                    post: {
                        eventFilters: this.getFullEventFilters(),
                        deliveryMode: {
                            transportType: 'PubNub'
                        }
                    }
                }));

            }.bind(this))
            .then(function(ajax) {

                this.updateSubscription(ajax.data)
                    .subscribeAtPubnub()
                    .emit(this.events.subscribeSuccess, ajax.data);

                return ajax;

            }.bind(this))
            .catch(function(e) {

                this.unsubscribe()
                    .emit(this.events.subscribeError, e);

                throw e;

            }.bind(this));

    };

    /**
     * @private
     * @param {Array} [options.events] New array of events
     * @returns {Promise}
     */
    Subscription.prototype.renew = function(options) {

        options = options || {};
        if (options.events) this.eventFilters = options.events;

        this.clearTimeout();

        return new (this.context.getPromise())(
            function(resolve, reject) {

                if (!this.subscription || !this.subscription.id) throw new Error('Subscription ID is required');
                if (!this.eventFilters || !this.eventFilters.length) throw new Error('Events are undefined');

                resolve();

            }.bind(this))
            .then(function() {

                return this.getPlatform().apiCall({
                    method: 'PUT',
                    url: '/restapi/v1.0/subscription/' + this.subscription.id,
                    post: {
                        eventFilters: this.getFullEventFilters()
                    }
                });

            }.bind(this))
            .then(function(ajax) {

                this.updateSubscription(ajax.data)
                    .emit(this.events.renewSuccess, ajax.data);

                return ajax;

            }.bind(this))
            .catch(function(e) {

                this.unsubscribe()
                    .emit(this.events.renewError, e);

                throw e;

            }.bind(this));

    };

    /**
     * @param {boolean} [options.async]
     * @returns {Promise}
     */
    Subscription.prototype.remove = function(options) {

        options = Utils.extend({
            async: true
        }, options);

        return new (this.context.getPromise())(
            function(resolve, reject) {

                if (!this.subscription || !this.subscription.id) throw new Error('Subscription ID is required');

                resolve(this.getPlatform().apiCall({
                    async: !!options.async, // Warning! This is necessary because this method is used in beforeunload hook and has to be synchronous
                    method: 'DELETE',
                    url: '/restapi/v1.0/subscription/' + this.subscription.id
                }));

            }.bind(this))
            .then(function(ajax) {

                this.unsubscribe()
                    .emit(this.events.removeSuccess, ajax);

                return ajax;

            }.bind(this))
            .catch(function(e) {

                this.emit(this.events.removeError, e);

                throw e;

            }.bind(this));

    };

    Subscription.prototype.destroy = function() {

        this.unsubscribe();

        Log.info('RC.core.Subscription: Destroyed');

        return Observable.prototype.destroy.call(this);

    };

    Subscription.prototype.isSubscribed = function() {

        return this.subscription &&
               this.subscription.deliveryMode &&
               this.subscription.deliveryMode.subscriberKey &&
               this.subscription.deliveryMode.address;

    };

    /**
     * @protected
     */
    Subscription.prototype.setTimeout = function() {

        var timeToExpiration = (this.subscription.expiresIn * 1000) - renewHandicapMs;

        this.timeout = setTimeout(function() {

            this.renew({});

        }.bind(this), timeToExpiration);

    };

    /**
     * @protected
     */
    Subscription.prototype.clearTimeout = function() {

        clearTimeout(this.timeout);

    };

    /**
     * Set new subscription info and re-create timeout
     * @protected
     * @param subscription
     * @returns {Subscription}
     */
    Subscription.prototype.updateSubscription = function(subscription) {

        this.clearTimeout();
        this.subscription = subscription;
        this.setTimeout();
        return this;

    };

    /**
     * Remove subscription and disconnect from PUBNUB
     * @protected
     * @returns {Subscription}
     */
    Subscription.prototype.unsubscribe = function() {
        this.clearTimeout();
        if (this.pubnub && this.isSubscribed()) this.pubnub.unsubscribe({channel: this.subscription.deliveryMode.address});
        this.subscription = null;
        return this;
    };

    /**
     * @abstract
     * @param {Object} message
     * @returns {Subscription}
     */
    Subscription.prototype.notify = function(message) {

        if (this.isSubscribed() && this.subscription.deliveryMode.encryptionKey) {

            var CryptoJS = this.getCrypto();

            var key = CryptoJS.enc.Base64.parse(this.subscription.deliveryMode.encryptionKey);
            var data = CryptoJS.enc.Base64.parse(message);
            var decrypted = CryptoJS.AES.decrypt({ciphertext: data}, key, {mode: CryptoJS.mode.ECB, padding: CryptoJS.pad.Pkcs7}).toString(CryptoJS.enc.Utf8);
            message = JSON.parse(decrypted);

        }

        this.emit(this.events.notification, message);

        return this;

    };

    /**
     * @returns {Subscription}
     */
    Subscription.prototype.subscribeAtPubnub = function() {

        if (!this.isSubscribed()) return this;

        var PUBNUB = this.getPubnub();

        this.pubnub = PUBNUB.init({
            ssl: true,
            subscribe_key: this.subscription.deliveryMode.subscriberKey
        });

        this.pubnub.ready();

        this.pubnub.subscribe({
            channel: this.subscription.deliveryMode.address,
            message: function(message, env, channel) {

                Log.info('RC.core.Subscription: Incoming message', message);
                this.notify(message);

            }.bind(this),
            connect: function() {
                Log.info('RC.core.Subscription: PUBNUB connected');
            }.bind(this)
        });

        return this;

    };

    module.exports = {
        Class: Subscription,
        /**
         * @param {Context} context
         * @returns {Subscription}
         */
        $get: function(context) {
            return new Subscription(context);
        }
    };

});
