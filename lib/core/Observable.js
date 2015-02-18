define(function(require, exports, module) {

    var Utils = require('./Utils'),
        Log = require('./Log');

    /**
     * @constructor
     * @alias RCSDK.core.Observable
     */
    function Observable() {
        if (!(this instanceof Observable)) throw new Error('Observable(): New operator was omitted');
        Object.defineProperty(this, 'listeners', {value: {}, enumerable: false, writable: true});
        Object.defineProperty(this, 'oneTimeEvents', {value: {}, enumerable: false, writable: true});
        Object.defineProperty(this, 'oneTimeArguments', {value: {}, enumerable: false, writable: true});
    }

    // Object.create({}) is not needed
    // Do not put Object or Function.prototype instead of {}, otherwise all instances will get non-writable 'name' property
    // Observable.prototype = {};
    Object.defineProperty(Observable.prototype, 'constructor', {value: Observable, enumerable: false});

    Observable.prototype.hasListeners = function(event) {
        return (event in this.listeners);
    };

    Observable.prototype.registerOneTimeEvent = function(event) {
        this.oneTimeEvents[event] = false;
        this.oneTimeArguments[event] = [];
    };

    Observable.prototype.on = function(events, callback) {

        if (typeof events == 'string') events = [events];
        if (!events) throw new Error('No events to subscribe to');
        if (typeof callback !== 'function') throw new Error('Callback must be a function');

        var self = this;

        events.forEach(function(event) {

            if (!self.hasListeners(event)) self.listeners[event] = [];

            self.listeners[event].push(callback);

            if (self.isOneTimeEventFired(event)) { // Fire listener immediately if is inited already
                Log.debug('Observable.on(%s): One-time event has been fired already, executing callback', event);
                callback.apply(self, self.getOneTimeEventArgumens(event));
            }

        });

        return this;

    };

    Observable.prototype.emit = function(event) {

        if (this.isOneTimeEventFired(event)) {
            Log.debug('Observable.emit(%s): One-time event has been fired already', event);
            return null;
        }

        var self = this,
            args = Utils.argumentsToArray(arguments).splice(1),
            result = null;

        if (this.isOneTimeEvent(event)) {
            this.setOneTimeEventFired(event);
            this.setOneTimeEventArgumens(event, args);
        }

        if (!this.hasListeners(event)) return null;

        this.listeners[event].some(function(callback) {

            result = callback.apply(self, args);
            return (result === false);

        });

        return result;

    };

    Observable.prototype.off = function(event, callback) {
        var self = this;
        if (!callback) {
            delete this.listeners[event];
        } else {
            if (!this.hasListeners(event)) return this;
            this.listeners[event].forEach(function(cb, i) {

                if (cb === callback) delete self.listeners[event][i];

            });
        }
        return this;
    };

    Observable.prototype.isOneTimeEvent = function(event) {
        return (event in this.oneTimeEvents);
    };

    Observable.prototype.isOneTimeEventFired = function(event) {
        if (!this.isOneTimeEvent(event)) return false;
        return (this.oneTimeEvents[event]);
    };

    Observable.prototype.setOneTimeEventFired = function(event) {
        this.oneTimeEvents[event] = true;
    };

    Observable.prototype.setOneTimeEventArgumens = function(event, args) {
        this.oneTimeArguments[event] = args;
    };

    Observable.prototype.getOneTimeEventArgumens = function(event) {
        return this.oneTimeArguments[event];
    };

    Observable.prototype.offAll = function() {
        this.listeners = {};
        this.oneTimeEvents = {};
        this.oneTimeArguments = {};
    };

    Observable.prototype.destroy = function() {
        this.offAll();
        Log.debug('Observable.destroy(): Listeners were destroyed');
        return this;
    };

    /**
     * @param {string} event
     * @param {Array} args
     * @param {function} [callback]
     */
    Observable.prototype.emitAndCallback = function(event, args, callback) {
        args = Utils.argumentsToArray(args);
        if (event) this.emit.apply(this, [event].concat(args));
        if (callback) callback.apply(this, args);
        return this;
    };

    module.exports = {
        Class: Observable,
        /**
         * @param {Context} context
         * @returns {Observable}
         */
        $get: function(context) {
            return new Observable(context);
        }
    };

});
