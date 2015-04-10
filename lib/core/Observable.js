var define = typeof define === 'function' && define.amd ? define : function (factory) {
    factory(require, exports, module);
};
define(function (require, exports, module) {
    var utils = require('./Utils');
    var log = require('./Log');
    /**
 * @see https://github.com/Microsoft/TypeScript/issues/275
 */
    var Observable = function () {
        function Observable(context) {
            if (!(this instanceof Observable))
                throw new Error('Observable(): New operator was omitted');
            Object.defineProperty(this, 'listeners', {
                value: {},
                enumerable: false,
                writable: true
            });
            Object.defineProperty(this, 'oneTimeEvents', {
                value: {},
                enumerable: false,
                writable: true
            });
            Object.defineProperty(this, 'oneTimeArguments', {
                value: {},
                enumerable: false,
                writable: true
            });
            this.context = context;
            this.utils = utils.$get(context);
            this.log = log.$get(context);
        }
        Observable.prototype.hasListeners = function (event) {
            return event in this.listeners;
        };
        /**
     * @deprecated
     * @param {string} event
     */
        Observable.prototype.registerOneTimeEvent = function (event) {
            this.oneTimeEvents[event] = false;
            this.oneTimeArguments[event] = [];
        };
        Observable.prototype.on = function (events, callback) {
            var _this = this;
            if (typeof events == 'string')
                events = [events];
            if (!events)
                throw new Error('No events to subscribe to');
            if (typeof callback !== 'function')
                throw new Error('Callback must be a function');
            var self = this;
            events.forEach(function (event) {
                if (!self.hasListeners(event))
                    self.listeners[event] = [];
                self.listeners[event].push(callback);
                if (self.isOneTimeEventFired(event)) {
                    _this.log.debug('Observable.on(%s): One-time event has been fired already, executing callback', event);
                    callback.apply(self, self.getOneTimeEventArgumens(event));
                }
            });
            return this;
        };
        Observable.prototype.emit = function (event) {
            var _this = this;
            var args = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                args[_i - 1] = arguments[_i];
            }
            if (this.isOneTimeEventFired(event)) {
                this.log.debug('Observable.emit(%s): One-time event has been fired already', event);
                return null;
            }
            var result = null;
            if (this.isOneTimeEvent(event)) {
                this.setOneTimeEventFired(event);
                this.setOneTimeEventArgumens(event, args);
            }
            if (!this.hasListeners(event))
                return null;
            this.listeners[event].some(function (callback) {
                result = callback.apply(_this, args);
                return result === false;
            });
            return result;
        };
        Observable.prototype.off = function (event, callback) {
            var _this = this;
            if (!event) {
                this.listeners = {};
                this.oneTimeEvents = {};
                this.oneTimeArguments = {};
            } else {
                if (!callback) {
                    delete this.listeners[event];
                } else {
                    if (!this.hasListeners(event))
                        return this;
                    this.listeners[event].forEach(function (cb, i) {
                        if (cb === callback)
                            delete _this.listeners[event][i];
                    });
                }
            }
            return this;
        };
        /**
     * @deprecated
     * @param event
     * @returns {boolean}
     */
        Observable.prototype.isOneTimeEvent = function (event) {
            return event in this.oneTimeEvents;
        };
        /**
     * @deprecated
     * @param {string} event
     * @returns {boolean}
     */
        Observable.prototype.isOneTimeEventFired = function (event) {
            if (!this.isOneTimeEvent(event))
                return false;
            return this.oneTimeEvents[event];
        };
        /**
     * @deprecated
     * @param event
     */
        Observable.prototype.setOneTimeEventFired = function (event) {
            this.oneTimeEvents[event] = true;
        };
        /**
     * @deprecated
     * @param {string} event
     * @param args
     */
        Observable.prototype.setOneTimeEventArgumens = function (event, args) {
            this.oneTimeArguments[event] = args;
        };
        /**
     * @deprecated
     * @param {string} event
     * @returns {any}
     */
        Observable.prototype.getOneTimeEventArgumens = function (event) {
            return this.oneTimeArguments[event];
        };
        /**
     * @deprecated
     * @returns {T}
     */
        Observable.prototype.offAll = function () {
            return this.off();
        };
        Observable.prototype.destroy = function () {
            this.off();
            this.log.debug('Observable.destroy(): Listeners were destroyed');
            return this;
        };
        Observable.prototype.emitAndCallback = function (event, args, callback) {
            args = this.utils.argumentsToArray(args);
            if (event)
                this.emit.apply(this, [event].concat(args));
            if (callback)
                callback.apply(this, args);
            return this;
        };
        return Observable;
    }();
    exports.Observable = Observable;
    function $get(context) {
        return new Observable(context);
    }
    exports.$get = $get;
});