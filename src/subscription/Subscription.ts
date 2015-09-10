/// <reference path="../externals.d.ts" />
/// <reference path="../core/Utils.ts" />
/// <reference path="../core/Log.ts" />
/// <reference path="../platform/Platform.ts" />
/// <reference path="../http/ApiResponse.ts" />
/// <reference path="../externals/Externals.ts" />

module RingCentral.sdk.subscription {


    export class Subscription extends core.Observable<Subscription> {

        protected _renewHandicapMs = 2 * 60 * 1000;

        protected _subscription:ISubscription|any;
        protected _timeout;
        protected _eventFilters:string[];
        protected _pubnub:PUBNUBInstance;

        protected _platform:platform.Platform;
        protected _pubnubFactory:pubnub.PubnubFactory;

        public events = {
            notification: 'notification',
            removeSuccess: 'removeSuccess',
            removeError: 'removeError',
            renewSuccess: 'renewSuccess',
            renewError: 'renewError',
            subscribeSuccess: 'subscribeSuccess',
            subscribeError: 'subscribeError'
        };

        constructor(pubnubFactory:pubnub.PubnubFactory, platform:platform.Platform) {

            super();

            this._pubnubFactory = pubnubFactory;
            this._platform = platform;

            this._pubnub = null;
            this._eventFilters = [];
            this._timeout = null;
            this._subscription = null;

        }

        alive() {

            return this._subscription &&
                   this._subscription.id &&
                   this._subscription.deliveryMode &&
                   this._subscription.deliveryMode.subscriberKey &&
                   this._subscription.deliveryMode.address;

        }

        setSubscription(subscription) {

            this._clearTimeout();

            this._subscription = subscription;

            if (!this._pubnub) this._subscribeAtPubnub();

            this._setTimeout();

            return this;

        }

        subscription():ISubscription {
            return this._subscription;
        }

        /**
         * Creates or updates subscription if there is an active one
         * @param {{events?:string[]}} [options] New array of events
         * @returns {Promise}
         */
        register(options?:{events?:string[]}):Promise<http.ApiResponse> {

            if (this.alive()) {
                return this.renew(options);
            } else {
                return this.subscribe(options);
            }

        }

        addEvents(events:string[]) {
            this._eventFilters = this._eventFilters.concat(events);
            return this;
        }

        setEvents(events:string[]) {
            this._eventFilters = events;
            return this;
        }

        subscribe(options?:{events?:string[]}):Promise<http.ApiResponse> {

            options = options || {};

            if (options.events) this.setEvents(options.events);

            this._clearTimeout();

            return <Promise<http.ApiResponse>>new externals._Promise((resolve, reject) => {

                if (!this._eventFilters || !this._eventFilters.length) throw new Error('Events are undefined');

                resolve(this._platform.post('/restapi/v1.0/subscription', {
                    body: {
                        eventFilters: this._getFullEventFilters(),
                        deliveryMode: {
                            transportType: 'PubNub'
                        }
                    }
                }));

            }).then((ajax:http.ApiResponse) => {

                    this.setSubscription(ajax.json())
                        .emit(this.events.subscribeSuccess, ajax);

                    return ajax;

                }).catch((e):any => {

                    e = http.Client.makeError(e);

                    this.reset()
                        .emit(this.events.subscribeError, e);

                    throw e;

                });

        }

        renew(options?:{events?:string[]}):Promise<http.ApiResponse> {

            options = options || {};

            if (options.events) this.setEvents(options.events);

            this._clearTimeout();

            return <Promise<http.ApiResponse>>new externals._Promise((resolve, reject) => {

                if (!this.alive()) throw new Error('Subscription is not alive');

                if (!this._eventFilters || !this._eventFilters.length) throw new Error('Events are undefined');

                return this._platform.put('/restapi/v1.0/subscription/' + this._subscription.id, {
                    body: {
                        eventFilters: this._getFullEventFilters()
                    }
                });

            })
                .then((ajax:http.ApiResponse) => {

                    this.setSubscription(ajax.json())
                        .emit(this.events.renewSuccess, ajax.json());

                    return ajax;

                })
                .catch((e):any => {

                    e = http.Client.makeError(e);

                    this.reset()
                        .emit(this.events.renewError, e);

                    throw e;

                });

        }

        remove():Promise<http.ApiResponse> {

            return <Promise<http.ApiResponse>>new externals._Promise((resolve, reject)  => {

                if (!this._subscription || !this._subscription.id) throw new Error('Subscription ID is required');

                resolve(this._platform.delete('/restapi/v1.0/subscription/' + this._subscription.id));

            }).then((ajax:http.ApiResponse) => {

                    this.reset()
                        .emit(this.events.removeSuccess, ajax);

                    return ajax;

                }).catch((e):any => {

                    e = http.Client.makeError(e);

                    this.emit(this.events.removeError, e);

                    throw e;

                });

        }

        /**
         * Remove subscription and disconnect from PUBNUB
         * This method resets subscription at client side but backend is not notified
         */
        reset() {
            this._clearTimeout();
            if (this.alive() && this._pubnub) this._pubnub.unsubscribe({channel: this._subscription.deliveryMode.address});
            this._subscription = null;
            return this;
        }

        destroy():Subscription {

            this.reset();

            core.log.info('RC.subscription.Subscription: Destroyed');

            return super.destroy();

        }

        protected _getFullEventFilters() {

            return this._eventFilters.map((event) => {
                return this._platform.createUrl(event);
            });

        }

        protected _setTimeout() {

            this._clearTimeout();

            if (!this.alive()) throw new Error('Subscription is not alive');

            var timeToExpiration = (this._subscription.expiresIn * 1000) - this._renewHandicapMs;

            this._timeout = setTimeout(() => {

                this.renew({});

            }, timeToExpiration);

            return this;

        }

        protected _clearTimeout() {

            clearTimeout(this._timeout);

            return this;

        }

        protected _decrypt(message:any) {

            if (!this.alive()) throw new Error('Subscription is not alive');

            if (this._subscription.deliveryMode.encryptionKey) {

                var PUBNUB = this._pubnubFactory.getPubnub();

                message = PUBNUB.crypto_obj.decrypt(message, this._subscription.deliveryMode.encryptionKey, {
                    encryptKey: false,
                    keyEncoding: 'base64',
                    keyLength: 128,
                    mode: 'ecb'
                });

            }

            return message;

        }

        protected _notify(message:any) {

            this.emit(this.events.notification, this._decrypt(message));

            return this;

        }

        protected _subscribeAtPubnub():Subscription {

            if (!this.alive()) throw new Error('Subscription is not alive');

            var PUBNUB = this._pubnubFactory.getPubnub();

            this._pubnub = PUBNUB.init({
                ssl: true,
                subscribe_key: this._subscription.deliveryMode.subscriberKey
            });

            this._pubnub.ready();

            this._pubnub.subscribe({
                channel: this._subscription.deliveryMode.address,
                message: (message, env, channel) => {

                    core.log.info('RC.core.Subscription: Incoming message', message);
                    this._notify(message);

                },
                connect: () => {
                    core.log.info('RC.core.Subscription: PUBNUB connected');
                }
            });

            return this;

        }

    }

    export interface ISubscription {
        id?:string;
        uri?: string;
        eventFilters?:string[];
        expirationTime?:string; // 2014-03-12T19:54:35.613Z
        expiresIn?:number;
        deliveryMode?: {
            transportType?:string;
            encryption?:boolean;
            address?:string;
            subscriberKey?:string;
            encryptionKey?:string;
            secretKey?:string;
        };
        creationTime?:string; // 2014-03-12T19:54:35.613Z
        status?:string; // Active
    }

}