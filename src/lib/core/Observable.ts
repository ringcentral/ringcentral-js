/// <reference path="../../typings/externals.d.ts" />

import utils = require('./Utils');
import log = require('./Log');
import context = require('./Context');

/**
 * @see https://github.com/Microsoft/TypeScript/issues/275
 */
export class Observable<T extends Observable<any>> {

    protected context:context.Context;
    protected utils:utils.Utils;
    protected log:log.Log;

    private listeners:any;
    private oneTimeEvents:any;
    private oneTimeArguments:any;

    constructor(context:context.Context) {
        if (!(this instanceof Observable)) throw new Error('Observable(): New operator was omitted');
        Object.defineProperty(this, 'listeners', {value: {}, enumerable: false, writable: true});
        Object.defineProperty(this, 'oneTimeEvents', {value: {}, enumerable: false, writable: true});
        Object.defineProperty(this, 'oneTimeArguments', {value: {}, enumerable: false, writable: true});
        this.context = context;
        this.utils = utils.$get(context);
        this.log = log.$get(context);
    }

    hasListeners(event) {
        return (event in this.listeners);
    }

    /**
     * @deprecated
     * @param {string} event
     */
    registerOneTimeEvent(event:string) {
        this.oneTimeEvents[event] = false;
        this.oneTimeArguments[event] = [];
    }

    on(events:any, callback:(...args)=>any):T {

        if (typeof events == 'string') events = [events];
        if (!events) throw new Error('No events to subscribe to');
        if (typeof callback !== 'function') throw new Error('Callback must be a function');

        var self = this;

        (<string[]>events).forEach((event) => {

            if (!self.hasListeners(event)) self.listeners[event] = [];

            self.listeners[event].push(callback);

            if (self.isOneTimeEventFired(event)) { // Fire listener immediately if is inited already
                this.log.debug('Observable.on(%s): One-time event has been fired already, executing callback', event);
                callback.apply(self, self.getOneTimeEventArgumens(event));
            }

        });

        return <any>this;

    }

    emit(event:string, ...args):any {

        if (this.isOneTimeEventFired(event)) {
            this.log.debug('Observable.emit(%s): One-time event has been fired already', event);
            return null;
        }

        var result = null;

        if (this.isOneTimeEvent(event)) {
            this.setOneTimeEventFired(event);
            this.setOneTimeEventArgumens(event, args);
        }

        if (!this.hasListeners(event)) return null;

        this.listeners[event].some((callback:()=>any) => {

            result = callback.apply(this, args);
            return (result === false);

        });

        return result;

    }

    off(event?:string, callback?):T {
        if (!event) {
            this.listeners = {};
            this.oneTimeEvents = {};
            this.oneTimeArguments = {};
        } else {
            if (!callback) {
                delete this.listeners[event];
            } else {
                if (!this.hasListeners(event)) return <any>this;
                this.listeners[event].forEach((cb, i) => {

                    if (cb === callback) delete this.listeners[event][i];

                });
            }
        }
        return <any>this;
    }

    /**
     * @deprecated
     * @param event
     * @returns {boolean}
     */
    isOneTimeEvent(event:string) {
        return (event in this.oneTimeEvents);
    }

    /**
     * @deprecated
     * @param {string} event
     * @returns {boolean}
     */
    isOneTimeEventFired(event:string):boolean {
        if (!this.isOneTimeEvent(event)) return false;
        return (this.oneTimeEvents[event]);
    }

    /**
     * @deprecated
     * @param event
     */
    setOneTimeEventFired(event) {
        this.oneTimeEvents[event] = true;
    }

    /**
     * @deprecated
     * @param {string} event
     * @param args
     */
    setOneTimeEventArgumens(event:string, args) {
        this.oneTimeArguments[event] = args;
    }

    /**
     * @deprecated
     * @param {string} event
     * @returns {any}
     */
    getOneTimeEventArgumens(event:string) {
        return this.oneTimeArguments[event];
    }

    /**
     * @deprecated
     * @returns {T}
     */
    offAll():T {
        return this.off();
    }

    destroy():T {
        this.off();
        this.log.debug('Observable.destroy(): Listeners were destroyed');
        return <T>this;
    }

    emitAndCallback(event, args?, callback?):T {
        args = this.utils.argumentsToArray(args);
        if (event) this.emit.apply(this, [event].concat(args));
        if (callback) callback.apply(this, args);
        return <any>this;
    }

}

export function $get(context:context.Context):Observable<any> {
    return new Observable<any>(context);
}