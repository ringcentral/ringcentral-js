import EventEmitter from "events";

export default class Subscription extends EventEmitter {

    static _renewHandicapMs = 2 * 60 * 1000;
    static _pollInterval = 10 * 1000;

    events = {
        notification: 'notification',
        removeSuccess: 'removeSuccess',
        removeError: 'removeError',
        renewSuccess: 'renewSuccess',
        renewError: 'renewError',
        subscribeSuccess: 'subscribeSuccess',
        subscribeError: 'subscribeError'
    };

    constructor(pubnubFactory, platform) {

        super();

        this._pubnubFactory = pubnubFactory;
        this._platform = platform;
        this._pubnub = null;
        this._pubnubLastChannel = null;
        this._timeout = null;
        this._subscription = null;

    }

    subscribed() {

        var subscription = this.subscription();

        return !!(subscription.id &&
                  subscription.deliveryMode &&
                  subscription.deliveryMode.subscriberKey &&
                  subscription.deliveryMode.address);

    }

    /**
     * @return {boolean}
     */
    alive() {
        return this.subscribed() && Date.now() < this.expirationTime();
    }

    /**
     * @return {boolean}
     */
    expired() {
        if (!this.subscribed()) return true;
        return !this.subscribed() || Date.now() > this.subscription().expirationTime;
    }

    expirationTime() {
        return new Date(this.subscription().expirationTime || 0).getTime() - Subscription._renewHandicapMs;
    }

    setSubscription(subscription) {

        subscription = subscription || {};

        this._clearTimeout();
        this._setSubscription(subscription);
        this._subscribeAtPubnub();
        this._setTimeout();

        return this;

    }

    subscription() {
        return this._subscription || {};
    }

    /**
     * Creates or updates subscription if there is an active one
     * @returns {Promise<ApiResponse>}
     */
    async register() {

        if (this.alive()) {
            return await this.renew();
        } else {
            return await this.subscribe();
        }

    }

    eventFilters() {
        return this.subscription().eventFilters || [];
    }

    /**
     * @param {string[]} events
     * @return {Subscription}
     */
    addEventFilters(events) {
        this.setEventFilters(this.eventFilters().concat(events));
        return this;
    }

    /**
     * @param {string[]} events
     * @return {Subscription}
     */
    setEventFilters(events) {
        var subscription = this.subscription();
        subscription.eventFilters = events;
        this._setSubscription(subscription);
        return this;
    }

    /**
     * @returns {Promise<ApiResponse>}
     */
    async subscribe() {

        try {

            this._clearTimeout();

            if (!this.eventFilters().length) throw new Error('Events are undefined');

            var response = await this._platform.post('/subscription', {
                    eventFilters: this._getFullEventFilters(),
                    deliveryMode: {
                        transportType: 'PubNub'
                    }
                }),
                json = response.json();

            this.setSubscription(json)
                .emit(this.events.subscribeSuccess, response);

            return response;


        } catch (e) {

            e = this._platform.client().makeError(e);

            this.reset()
                .emit(this.events.subscribeError, e);

            throw e;

        }

    }

    /**
     * @returns {Promise<ApiResponse>}
     */
    async renew() {

        try {

            this._clearTimeout();

            if (!this.subscribed()) throw new Error('No subscription');

            if (!this.eventFilters().length) throw new Error('Events are undefined');

            var response = await this._platform.put('/subscription/' + this.subscription().id, {
                eventFilters: this._getFullEventFilters()
            });

            var json = response.json();

            this.setSubscription(json)
                .emit(this.events.renewSuccess, response);

            return response;

        } catch (e) {

            e = this._platform.client().makeError(e);

            this.reset()
                .emit(this.events.renewError, e);

            throw e;

        }

    }

    /**
     * @returns {Promise<ApiResponse>}
     */
    async remove() {

        try {

            if (!this.subscribed()) throw new Error('No subscription');

            var response = await this._platform.delete('/subscription/' + this.subscription().id);

            this.reset()
                .emit(this.events.removeSuccess, response);

            return response;

        } catch (e) {

            e = this._platform.client().makeError(e);

            this.emit(this.events.removeError, e);

            throw e;

        }

    }

    /**
     * @returns {Promise<ApiResponse>}
     */
    resubscribe() {
        var filters = this.eventFilters();
        return this.reset().setEventFilters(filters).subscribe();
    }

    /**
     * Remove subscription and disconnect from PUBNUB
     * This method resets subscription at client side but backend is not notified
     */
    reset() {
        this._clearTimeout();
        if (this.subscribed() && this._pubnub) this._pubnub.unsubscribe({channel: this.subscription().deliveryMode.address});
        this._setSubscription(null);
        return this;
    }

    _setSubscription(subscription) {
        this._subscription = subscription;
    }

    _getFullEventFilters() {

        return this.eventFilters().map((event) => {
            return this._platform.createUrl(event);
        });

    }

    _setTimeout() {

        this._clearTimeout();

        if (!this.alive()) throw new Error('Subscription is not alive');

        this._timeout = setInterval(()=> {

            if (this.alive()) return;

            if (this.expired()) {
                this.subscribe();
            } else {
                this.renew();
            }

        }, Subscription._pollInterval);

        return this;

    }

    _clearTimeout() {
        clearInterval(this._timeout);
        return this;
    }

    _decrypt(message) {

        if (!this.subscribed()) throw new Error('No subscription');

        if (this.subscription().deliveryMode.encryptionKey) {

            message = this._pubnubFactory.crypto_obj.decrypt(message, this.subscription().deliveryMode.encryptionKey, {
                encryptKey: false,
                keyEncoding: 'base64',
                keyLength: 128,
                mode: 'ecb'
            });

        }

        return message;

    }

    _notify(message) {
        this.emit(this.events.notification, this._decrypt(message));
        return this;
    }

    _subscribeAtPubnub() {

        if (!this.alive()) throw new Error('Subscription is not alive');

        var deliveryMode = this.subscription().deliveryMode;

        if (this._pubnub) {

            if (this._pubnubLastChannel == deliveryMode.address) { // Nothing to update, keep listening to same channel
                return this;
            } else if (this._pubnubLastChannel) { // Need to subscribe to new channel
                this._pubnub.unsubscribe({channel: this._pubnubLastChannel});
            }

            // Re-init for new data
            this._pubnub = this._pubnub.init({
                ssl: true,
                subscribe_key: deliveryMode.subscriberKey
            });

        } else {

            // Init from scratch
            this._pubnub = this._pubnubFactory.init({
                ssl: true,
                subscribe_key: deliveryMode.subscriberKey
            });

            this._pubnub.ready(); //TODO This may be not needed anymore

        }

        this._pubnubLastChannel = deliveryMode.address;

        this._pubnub.subscribe({
            channel: deliveryMode.address,
            message: this._notify.bind(this),
            connect: () => {}
        });

        return this;

    }

}

//export interface ISubscription {
//    id?:string;
//    uri?: string;
//    eventFilters?:string[];
//    expirationTime?:string; // 2014-03-12T19:54:35.613Z
//    expiresIn?:number;
//    deliveryMode?: {
//        transportType?:string;
//        encryption?:boolean;
//        address?:string;
//        subscriberKey?:string;
//        encryptionKey?:string;
//        secretKey?:string;
//    };
//    creationTime?:string; // 2014-03-12T19:54:35.613Z
//    status?:string; // Active
//}
