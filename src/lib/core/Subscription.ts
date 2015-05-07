/// <reference path="../../typings/externals.d.ts" />

import observable = require('./Observable');
import utils = require('./Utils');
import log = require('./Log');
import context = require('./Context');
import platform = require('./Platform');
import r = require('./http/Response');

export class Subscription extends observable.Observable<Subscription> {

    static renewHandicapMs = 60 * 1000;

    public subscription;
    public timeout;
    public eventFilters:string[];
    public pubnub:PUBNUB.PubnubInstance;

    public events = {
        notification: 'notification',
        removeSuccess: 'removeSuccess',
        removeError: 'removeError',
        renewSuccess: 'renewSuccess',
        renewError: 'renewError',
        subscribeSuccess: 'subscribeSuccess',
        subscribeError: 'subscribeError'
    };

    constructor(context:context.Context) {

        super(context);

        this.pubnub = null;
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

    }

    getPubnub() {

        return this.context.getPubnub();

    }

    getPlatform() {

        return platform.$get(this.context);

    }

    /**
     * Creates or updates subscription if there is an active one
     * @param {{events?:string[]}} [options] New array of events
     * @returns {Promise}
     */
    register(options?:{events?:string[]}):Promise<r.Response> {

        if (this.isSubscribed()) {
            return this.renew(options);
        } else {
            return this.subscribe(options);
        }

    }

    addEvents(events:string[]) {
        this.eventFilters = this.eventFilters.concat(events);
        return this;
    }

    setEvents(events:string[]) {
        this.eventFilters = events;
        return this;
    }

    getFullEventFilters() {

        return this.eventFilters.map((event) => {
            return this.getPlatform().apiUrl(event);
        });

    }

    subscribe(options?:{events?:string[]}):Promise<r.Response> {

        options = options || {};
        if (options.events) this.eventFilters = options.events;

        this.clearTimeout();

        return <any>new (this.context.getPromise())((resolve, reject) => {

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

        }).then((ajax:r.Response) => {

                this.updateSubscription(ajax.data)
                    .subscribeAtPubnub()
                    .emit(this.events.subscribeSuccess, ajax.data);

                return ajax;

            }).catch((e) => {

                this.unsubscribe()
                    .emit(this.events.subscribeError, e);

                throw e;

            });

    }

    renew(options?:{events?:string[]}):Promise<r.Response> {

        options = options || {};
        if (options.events) this.eventFilters = options.events;

        this.clearTimeout();

        return <any>new (this.context.getPromise())((resolve, reject) => {

            if (!this.subscription || !this.subscription.id) throw new Error('Subscription ID is required');
            if (!this.eventFilters || !this.eventFilters.length) throw new Error('Events are undefined');

            resolve();

        }).then(():Promise<r.Response> => {

                return this.getPlatform().apiCall({
                    method: 'PUT',
                    url: '/restapi/v1.0/subscription/' + this.subscription.id,
                    post: {
                        eventFilters: this.getFullEventFilters()
                    }
                });

            })
            .then((ajax:any) => {

                this.updateSubscription(ajax.data)
                    .emit(this.events.renewSuccess, ajax.data);

                return ajax;

            })
            .catch((e):any => {

                this.unsubscribe()
                    .emit(this.events.renewError, e);

                throw e;

            });

    }

    remove(options?:{async?:boolean}):Promise<r.Response> {

        options = this.utils.extend({
            async: true
        }, options);

        return <any>new (this.context.getPromise())((resolve, reject)  => {

            if (!this.subscription || !this.subscription.id) throw new Error('Subscription ID is required');

            resolve(this.getPlatform().apiCall({
                async: !!options.async, // Warning! This is necessary because this method is used in beforeunload
                                        // hook and has to be synchronous
                method: 'DELETE',
                url: '/restapi/v1.0/subscription/' + this.subscription.id
            }));

        }).then((ajax:r.Response) => {

                this.unsubscribe()
                    .emit(this.events.removeSuccess, ajax);

                return ajax;

            }).catch((e) => {

                this.emit(this.events.removeError, e);

                throw e;

            });

    }

    destroy():any { //TODO Fix any

        this.unsubscribe();

        this.log.info('RC.core.Subscription: Destroyed');

        return super.destroy();

    }

    isSubscribed() {

        return this.subscription &&
               this.subscription.deliveryMode &&
               this.subscription.deliveryMode.subscriberKey &&
               this.subscription.deliveryMode.address;

    }

    protected setTimeout() {

        var timeToExpiration = (this.subscription.expiresIn * 1000) - Subscription.renewHandicapMs;

        this.timeout = setTimeout(() => {

            this.renew({});

        }, timeToExpiration);

    }

    protected clearTimeout() {

        clearTimeout(this.timeout);

    }

    protected updateSubscription(subscription) {

        this.clearTimeout();
        this.subscription = subscription;
        this.setTimeout();
        return this;

    }

    /**
     * Remove subscription and disconnect from PUBNUB
     */
    protected unsubscribe() {
        this.clearTimeout();
        if (this.pubnub && this.isSubscribed()) this.pubnub.unsubscribe({channel: this.subscription.deliveryMode.address});
        this.subscription = null;
        return this;
    }

    /**
     * Do not use this method! Internal use only
     */
    decrypt(message:any) {

        if (this.isSubscribed() && this.subscription.deliveryMode.encryptionKey) {

            var PUBNUB = this.getPubnub();

            message = PUBNUB.crypto_obj.decrypt(message, this.subscription.deliveryMode.encryptionKey, {
                encryptKey: false,
                keyEncoding: 'base64',
                keyLength: 128,
                mode: 'ecb'
            });

        }

        return message;

    }

    /**
     * Do not use this method! Internal use only
     */
    notify(message:any) {

        this.emit(this.events.notification, this.decrypt(message));

        return this;

    }

    /**
     * Do not use this method! Internal use only
     */
    subscribeAtPubnub():Subscription {

        if (!this.isSubscribed()) return this;

        var PUBNUB = this.getPubnub();

        this.pubnub = PUBNUB.init({
            ssl: true,
            subscribe_key: this.subscription.deliveryMode.subscriberKey
        });

        this.pubnub.ready();

        this.pubnub.subscribe({
            channel: this.subscription.deliveryMode.address,
            message: (message, env, channel) => {

                this.log.info('RC.core.Subscription: Incoming message', message);
                this.notify(message);

            },
            connect: () => {
                this.log.info('RC.core.Subscription: PUBNUB connected');
            }
        });

        return this;

    }

}

export function $get(context:context.Context):Subscription {
    return new Subscription(context);
}

export interface ISubscription {
    eventFilters:string[];
    expirationTime:string; // 2014-03-12T19:54:35.613Z
    expiresIn:number;
    deliveryMode: {
        transportType:string;
        encryption:boolean;
        address:string;
        subscriberKey:string;
        secretKey:string;
    };
    id:string;
    creationTime:string; // 2014-03-12T19:54:35.613Z
    status:string; // Active
    uri: string;
}
