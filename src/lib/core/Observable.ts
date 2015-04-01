/// <reference path="../../typings/tsd.d.ts" />

import utils = require('./Utils');
import log = require('./Log');
import context = require('./Context');

export class Observable {

    protected context:context.Context;
    protected utils:utils.Utils;
    protected log:log.Log;

    private listeners:any;
    private oneTimeEvents:any;
    private oneTimeArguments:any;

    /**
     * @constructor
     * @alias RCSDK.core.Observable
     */
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

    registerOneTimeEvent(event) {
        this.oneTimeEvents[event] = false;
        this.oneTimeArguments[event] = [];
    }

    on(events, callback) {

        if (typeof events == 'string') events = [events];
        if (!events) throw new Error('No events to subscribe to');
        if (typeof callback !== 'function') throw new Error('Callback must be a function');

        var self = this;

        events.forEach((event) => {

            if (!self.hasListeners(event)) self.listeners[event] = [];

            self.listeners[event].push(callback);

            if (self.isOneTimeEventFired(event)) { // Fire listener immediately if is inited already
                this.log.debug('Observable.on(%s): One-time event has been fired already, executing callback', event);
                callback.apply(self, self.getOneTimeEventArgumens(event));
            }

        });

        return this;

    }

    emit(event, ...args) {

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

        this.listeners[event].some((callback) => {

            result = callback.apply(this, args);
            return (result === false);

        });

        return result;

    }

    off(event, callback?) {
        var self = this;
        if (!callback) {
            delete this.listeners[event];
        } else {
            if (!this.hasListeners(event)) return this;
            this.listeners[event].forEach((cb, i) => {

                if (cb === callback) delete this.listeners[event][i];

            });
        }
        return this;
    }

    isOneTimeEvent(event) {
        return (event in this.oneTimeEvents);
    }

    isOneTimeEventFired(event) {
        if (!this.isOneTimeEvent(event)) return false;
        return (this.oneTimeEvents[event]);
    }

    setOneTimeEventFired(event) {
        this.oneTimeEvents[event] = true;
    }

    setOneTimeEventArgumens(event, args) {
        this.oneTimeArguments[event] = args;
    }

    getOneTimeEventArgumens(event) {
        return this.oneTimeArguments[event];
    }

    offAll() {
        this.listeners = {};
        this.oneTimeEvents = {};
        this.oneTimeArguments = {};
        return this;
    }

    destroy() {
        this.offAll();
        this.log.debug('Observable.destroy(): Listeners were destroyed');
        return this;
    }

    emitAndCallback(event, args?, callback?) {
        args = this.utils.argumentsToArray(args);
        if (event) this.emit.apply(this, [event].concat(args));
        if (callback) callback.apply(this, args);
        return this;
    }

}

export function $get(context:context.Context):Observable {
    return new Observable(context);
}