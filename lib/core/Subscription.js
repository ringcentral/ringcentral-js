var define = typeof define === 'function' && define.amd ? define : function (factory) {
    factory(require, exports, module);
};
define(function (require, exports, module) {
    var __extends = this.__extends || function (d, b) {
        for (var p in b)
            if (b.hasOwnProperty(p))
                d[p] = b[p];
        function __() {
            this.constructor = d;
        }
        __.prototype = b.prototype;
        d.prototype = new __();
    };
    var observable = require('./Observable');
    var platform = require('./Platform');
    var Subscription = function (_super) {
        __extends(Subscription, _super);
        function Subscription(context) {
            _super.call(this, context);
            this.events = {
                notification: 'notification',
                removeSuccess: 'removeSuccess',
                removeError: 'removeError',
                renewSuccess: 'renewSuccess',
                renewError: 'renewError',
                subscribeSuccess: 'subscribeSuccess',
                subscribeError: 'subscribeError'
            };
            this.pubnub = null;
            this.eventFilters = [];
            this.timeout = null;
            this.subscription = {
                eventFilters: [],
                expirationTime: '',
                expiresIn: 0,
                deliveryMode: {
                    transportType: 'PubNub',
                    encryption: false,
                    address: '',
                    subscriberKey: '',
                    secretKey: ''
                },
                id: '',
                creationTime: '',
                status: '',
                uri: ''
            };
        }
        Subscription.prototype.getPubnub = function () {
            return this.context.getPubnub();
        };
        Subscription.prototype.getCrypto = function () {
            return this.context.getCryptoJS();
        };
        Subscription.prototype.getPlatform = function () {
            return platform.$get(this.context);
        };
        /**
     * Creates or updates subscription if there is an active one
     * @param {{events?:string[]}} [options] New array of events
     * @returns {Promise}
     */
        Subscription.prototype.register = function (options) {
            if (this.isSubscribed()) {
                return this.renew(options);
            } else {
                return this.subscribe(options);
            }
        };
        Subscription.prototype.addEvents = function (events) {
            this.eventFilters = this.eventFilters.concat(events);
            return this;
        };
        Subscription.prototype.setEvents = function (events) {
            this.eventFilters = events;
            return this;
        };
        Subscription.prototype.getFullEventFilters = function () {
            var _this = this;
            return this.eventFilters.map(function (event) {
                return _this.getPlatform().apiUrl(event);
            });
        };
        Subscription.prototype.subscribe = function (options) {
            var _this = this;
            options = options || {};
            if (options.events)
                this.eventFilters = options.events;
            this.clearTimeout();
            return new (this.context.getPromise())(function (resolve, reject) {
                if (!_this.eventFilters || !_this.eventFilters.length)
                    throw new Error('Events are undefined');
                resolve(_this.getPlatform().apiCall({
                    method: 'POST',
                    url: '/restapi/v1.0/subscription',
                    post: {
                        eventFilters: _this.getFullEventFilters(),
                        deliveryMode: { transportType: 'PubNub' }
                    }
                }));
            }).then(function (ajax) {
                _this.updateSubscription(ajax.data).subscribeAtPubnub().emit(_this.events.subscribeSuccess, ajax.data);
                return ajax;
            }).catch(function (e) {
                _this.unsubscribe().emit(_this.events.subscribeError, e);
                throw e;
            });
        };
        Subscription.prototype.renew = function (options) {
            var _this = this;
            options = options || {};
            if (options.events)
                this.eventFilters = options.events;
            this.clearTimeout();
            return new (this.context.getPromise())(function (resolve, reject) {
                if (!_this.subscription || !_this.subscription.id)
                    throw new Error('Subscription ID is required');
                if (!_this.eventFilters || !_this.eventFilters.length)
                    throw new Error('Events are undefined');
                resolve();
            }).then(function () {
                return _this.getPlatform().apiCall({
                    method: 'PUT',
                    url: '/restapi/v1.0/subscription/' + _this.subscription.id,
                    post: { eventFilters: _this.getFullEventFilters() }
                });
            }).then(function (ajax) {
                _this.updateSubscription(ajax.data).emit(_this.events.renewSuccess, ajax.data);
                return ajax;
            }).catch(function (e) {
                _this.unsubscribe().emit(_this.events.renewError, e);
                throw e;
            });
        };
        Subscription.prototype.remove = function (options) {
            var _this = this;
            options = this.utils.extend({ async: true }, options);
            return new (this.context.getPromise())(function (resolve, reject) {
                if (!_this.subscription || !_this.subscription.id)
                    throw new Error('Subscription ID is required');
                resolve(_this.getPlatform().apiCall({
                    async: !!options.async,
                    // hook and has to be synchronous
                    method: 'DELETE',
                    url: '/restapi/v1.0/subscription/' + _this.subscription.id
                }));
            }).then(function (ajax) {
                _this.unsubscribe().emit(_this.events.removeSuccess, ajax);
                return ajax;
            }).catch(function (e) {
                _this.emit(_this.events.removeError, e);
                throw e;
            });
        };
        Subscription.prototype.destroy = function () {
            this.unsubscribe();
            this.log.info('RC.core.Subscription: Destroyed');
            return _super.prototype.destroy.call(this);
        };
        Subscription.prototype.isSubscribed = function () {
            return this.subscription && this.subscription.deliveryMode && this.subscription.deliveryMode.subscriberKey && this.subscription.deliveryMode.address;
        };
        Subscription.prototype.setTimeout = function () {
            var _this = this;
            var timeToExpiration = this.subscription.expiresIn * 1000 - Subscription.renewHandicapMs;
            this.timeout = setTimeout(function () {
                _this.renew({});
            }, timeToExpiration);
        };
        Subscription.prototype.clearTimeout = function () {
            clearTimeout(this.timeout);
        };
        Subscription.prototype.updateSubscription = function (subscription) {
            this.clearTimeout();
            this.subscription = subscription;
            this.setTimeout();
            return this;
        };
        /**
     * Remove subscription and disconnect from PUBNUB
     */
        Subscription.prototype.unsubscribe = function () {
            this.clearTimeout();
            if (this.pubnub && this.isSubscribed())
                this.pubnub.unsubscribe({ channel: this.subscription.deliveryMode.address });
            this.subscription = null;
            return this;
        };
        /**
     * Do not use this method! Internal use only
     * @param message
     * @returns {Subscription}
     */
        Subscription.prototype.notify = function (message) {
            if (this.isSubscribed() && this.subscription.deliveryMode.encryptionKey) {
                var CryptoJS = this.getCrypto();
                var key = CryptoJS.enc.Base64.parse(this.subscription.deliveryMode.encryptionKey);
                var data = CryptoJS.enc.Base64.parse(message);
                var decrypted = CryptoJS.AES.decrypt({ ciphertext: data }, key, {
                    mode: CryptoJS.mode.ECB,
                    padding: CryptoJS.pad.Pkcs7
                }).toString(CryptoJS.enc.Utf8);
                message = JSON.parse(decrypted);
            }
            this.emit(this.events.notification, message);
            return this;
        };
        /**
     * Do not use this method! Internal use only
     * @returns {Subscription}
     */
        Subscription.prototype.subscribeAtPubnub = function () {
            var _this = this;
            if (!this.isSubscribed())
                return this;
            var PUBNUB = this.getPubnub();
            this.pubnub = PUBNUB.init({
                ssl: true,
                subscribe_key: this.subscription.deliveryMode.subscriberKey
            });
            this.pubnub.ready();
            this.pubnub.subscribe({
                channel: this.subscription.deliveryMode.address,
                message: function (message, env, channel) {
                    _this.log.info('RC.core.Subscription: Incoming message', message);
                    _this.notify(message);
                },
                connect: function () {
                    _this.log.info('RC.core.Subscription: PUBNUB connected');
                }
            });
            return this;
        };
        Subscription.prototype.on = function (events, callback) {
            _super.prototype.on.call(this, events, callback);
            return this;
        };
        Subscription.prototype.off = function (events, callback) {
            _super.prototype.on.call(this, events, callback);
            return this;
        };
        Subscription.prototype.emitAndCallback = function (event, args, callback) {
            _super.prototype.emitAndCallback.call(this, event, args, callback);
            return this;
        };
        Subscription.renewHandicapMs = 60 * 1000;
        return Subscription;
    }(observable.Observable);
    exports.Subscription = Subscription;
    function $get(context) {
        return new Subscription(context);
    }
    exports.$get = $get;
});