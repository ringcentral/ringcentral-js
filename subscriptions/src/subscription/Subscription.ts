import PubNubDefault from 'pubnub';
import {SDK, EventEmitter} from '@ringcentral/sdk';

// detect ISO 8601 format string with +00[:00] timezone notations
const ISO_REG_EXP = /(\+[\d]{2}):?([\d]{2})?$/;

const buildIEFriendlyString = (match, $1, $2) => `${$1}:${$2 || '00'}`;

const parseISOString = (time: string | number) => {
    time = time || 0;
    if (typeof time === 'string') {
        return Date.parse(time.replace(ISO_REG_EXP, buildIEFriendlyString));
    }
    return time;
};

declare class ActualPubNub extends PubNubDefault {
    removeAllListeners: any;

    decrypt: any;
}

export default class Subscription extends EventEmitter {
    events = {
        notification: 'notification',
        removeSuccess: 'removeSuccess',
        removeError: 'removeError',
        renewSuccess: 'renewSuccess',
        renewError: 'renewError',
        subscribeSuccess: 'subscribeSuccess',
        subscribeError: 'subscribeError',
        automaticRenewSuccess: 'automaticRenewSuccess',
        automaticRenewError: 'automaticRenewError'
    };

    protected _sdk: SDK;

    protected _PubNub: typeof ActualPubNub;

    protected _pollInterval: number;

    protected _renewHandicapMs: number;

    protected _pubnub: ActualPubNub = null;

    protected _pubnubLastChannel: string = null;

    protected _pubnubLastSubscribeKey: string = null;

    protected _timeout: any = null;

    protected _subscription: SubscriptionData = null;

    constructor({
        sdk,
        PubNub,
        pollInterval = 10 * 1000,
        renewHandicapMs = 2 * 60 * 1000
    }: SubscriptionOptionsConstructor) {
        super();

        this._sdk = sdk;
        this._PubNub = PubNub;
        this._pollInterval = pollInterval;
        this._renewHandicapMs = renewHandicapMs;
    }

    subscribed() {
        const subscription = this.subscription();

        return !!(
            subscription.id &&
            subscription.deliveryMode &&
            subscription.deliveryMode.subscriberKey &&
            subscription.deliveryMode.address
        );
    }

    alive() {
        return this.subscribed() && Date.now() < this.expirationTime();
    }

    expired() {
        if (!this.subscribed()) return true;
        return !this.subscribed() || Date.now() > parseISOString(this.subscription().expirationTime);
    }

    expirationTime() {
        return parseISOString(this.subscription().expirationTime) - this._renewHandicapMs;
    }

    setSubscription(subscription: SubscriptionData) {
        subscription = subscription || {};

        this._clearTimeout();
        this._setSubscription(subscription);
        this._subscribeAtPubNub();
        this._setTimeout();

        return this;
    }

    subscription() {
        return this._subscription || {};
    }

    /**
     * Creates or updates subscription if there is an active one
     */
    register(): Promise<Response> {
        if (this.alive()) {
            return this.renew();
        }
        return this.subscribe();
    }

    eventFilters() {
        return this.subscription().eventFilters || [];
    }

    addEventFilters(events: string[]) {
        this.setEventFilters(this.eventFilters().concat(events));
        return this;
    }

    /**
     * @param {string[]} events
     * @return {Subscription}
     */
    setEventFilters(events) {
        const subscription = this.subscription();
        subscription.eventFilters = events;
        this._setSubscription(subscription);
        return this;
    }

    async subscribe(): Promise<Response> {
        try {
            this._clearTimeout();

            if (!this.eventFilters().length) throw new Error('Events are undefined');

            const response = await this._sdk.platform().post('/restapi/v1.0/subscription', {
                eventFilters: this._getFullEventFilters(),
                deliveryMode: {
                    transportType: 'PubNub'
                }
            });

            const json = await response.json();

            this.setSubscription(json).emit(this.events.subscribeSuccess, response);

            return response;
        } catch (e) {
            // `reset` will remove pubnub instance.
            // so if network is broken for a long time, pubnub will be removed. And client can not receive notification anymore.
            this.reset().emit(this.events.subscribeError, e);

            throw e;
        }
    }

    async renew(): Promise<Response> {
        try {
            this._clearTimeout();

            if (!this.subscribed()) throw new Error('No subscription');

            if (!this.eventFilters().length) throw new Error('Events are undefined');

            const response = await this._sdk.platform().put(`/restapi/v1.0/subscription/${this.subscription().id}`, {
                eventFilters: this._getFullEventFilters()
            });

            const json = await response.json();

            this.setSubscription(json).emit(this.events.renewSuccess, response);

            return response;
        } catch (e) {
            // `reset` will remove pubnub instance.
            // so if network is broken for a long time, pubnub will be removed. And client can not receive notification anymore.
            this.reset().emit(this.events.renewError, e);

            throw e;
        }
    }

    async remove(): Promise<Response> {
        try {
            if (!this.subscribed()) throw new Error('No subscription');

            const response = await this._sdk.platform().delete(`/restapi/v1.0/subscription/${this.subscription().id}`);

            this.reset().emit(this.events.removeSuccess, response);

            return response;
        } catch (e) {
            this.emit(this.events.removeError, e);

            throw e;
        }
    }

    resubscribe(): Promise<Response> {
        const filters = this.eventFilters();
        return this.reset()
            .setEventFilters(filters)
            .subscribe();
    }

    /**
     * Remove subscription and disconnect from PubNub
     * This method resets subscription at client side but backend is not notified
     */
    reset() {
        this._clearTimeout();
        this._unsubscribeAtPubNub();
        this._setSubscription(null);
        return this;
    }

    /**
     * @param subscription
     * @private
     */
    protected _setSubscription(subscription: SubscriptionData) {
        this._subscription = subscription;
        return this;
    }

    /**
     * @return {string[]}
     * @private
     */
    _getFullEventFilters() {
        return this.eventFilters().map(event => this._sdk.platform().createUrl(event));
    }

    /**
     * @return {Subscription}
     * @private
     */
    _setTimeout() {
        this._clearTimeout();

        if (!this.alive()) throw new Error('Subscription is not alive');

        this._timeout = setInterval(async () => {
            try {
                if (this.alive()) return;

                this._clearTimeout();

                const res = await (this.expired() ? this.subscribe() : this.renew());

                this.emit(this.events.automaticRenewSuccess, res);
            } catch (e) {
                this.emit(this.events.automaticRenewError, e);
            }
        }, this._pollInterval);

        return this;
    }

    /**
     * @return {Subscription}
     * @private
     */
    _clearTimeout() {
        clearInterval(this._timeout);
        return this;
    }

    _decrypt(message) {
        if (!this.subscribed()) throw new Error('No subscription');

        if (this.subscription().deliveryMode.encryptionKey) {
            //FIXME decrypt is not described in DTS
            message = this._pubnub.decrypt(message, this.subscription().deliveryMode.encryptionKey, {
                encryptKey: false,
                keyEncoding: 'base64',
                keyLength: 128,
                mode: 'ecb'
            });
        }

        return message;
    }

    private _notify(message) {
        this.emit(this.events.notification, this._decrypt(message));
        return this;
    }

    private _subscribeAtPubNub() {
        if (!this.alive()) throw new Error('Subscription is not alive');

        const {address, subscriberKey} = this.subscription().deliveryMode;

        if (this._pubnub) {
            if (this._pubnubLastChannel === address) {
                // Nothing to update, keep listening to same channel
                return this;
            }
            if (this._pubnubLastSubscribeKey && this._pubnubLastSubscribeKey !== subscriberKey) {
                // Subscribe key changed, need to reset everything
                this._unsubscribeAtPubNub();
            } else if (this._pubnubLastChannel) {
                // Need to subscribe to new channel
                this._pubnub.unsubscribeAll();
            }
        }

        if (!this._pubnub) {
            this._pubnubLastSubscribeKey = subscriberKey;

            const PubNub: any = this._PubNub;

            this._pubnub = new PubNub({
                ssl: true,
                restore: true,
                subscribeKey: subscriberKey
            });

            this._pubnub.addListener({
                status: statusEvent => {},
                message: m => this._notify(m.message)
            });
        }

        this._pubnubLastChannel = address;
        this._pubnub.subscribe({channels: [address]});

        return this;
    }

    private _unsubscribeAtPubNub() {
        if (!this.subscribed() || !this._pubnub) return this;

        this._pubnub.unsubscribeAll();
        this._pubnub.removeAllListeners();

        this._pubnubLastSubscribeKey = null;
        this._pubnubLastChannel = null;
        this._pubnub = null;

        return this;
    }
}

export interface SubscriptionOptions {
    pollInterval?: number;
    renewHandicapMs?: number;
}

export interface SubscriptionOptionsConstructor extends SubscriptionOptions {
    sdk: SDK;
    PubNub: typeof ActualPubNub;
}

export interface DeliveryMode {
    transportType?: string;
    encryption?: string;
    address?: string;
    subscriberKey?: string;
    encryptionKey?: string;
    secretKey?: string;
}

export interface SubscriptionData {
    id?: string;
    uri?: string;
    eventFilters?: string[];
    expirationTime?: string; // Format: 2014-03-12T19:54:35.613+0000
    expiresIn?: number;
    deliveryMode?: DeliveryMode;
    creationTime?: string;
    status?: string; //eslint-disable-line
}
