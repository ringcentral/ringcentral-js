define(function(require, exports, module) {

    'use strict';

    var hasOwn = Object.prototype.hasOwnProperty,
        toString = Object.prototype.toString,
        rdigit = /\d/,
        class2type = {};

    // Populate the class2type map
    'Boolean Number String Function Array Date RegExp Object'.split(' ').forEach(function(name) {
        class2type["[object " + name + "]"] = name.toLowerCase();
    });

    /**
     * @alias RCSDK.core.Utils
     * @name Utils
     */
    var Utils = module.exports = {

        /**
         * Ported from jQuery.fn.extend
         * Optional first parameter makes deep copy
         * @param {object} targetObject
         * @param {object} sourceObject
         * @returns {object}
         */
        extend: function extend(targetObject, sourceObject) {

            var options, name, src, copy, copyIsArray, clone,
                target = arguments[0] || {},
                i = 1,
                length = arguments.length,
                deep = false;

            // Handle a deep copy situation
            if (typeof target === "boolean") {
                deep = target;

                // skip the boolean and the target
                target = arguments[i] || {};
                i++;
            }

            // Handle case when target is a string or something (possible in deep copy)
            if (typeof target !== "object" && !this.isFunction(target)) {
                target = {};
            }

            for (; i < length; i++) {

                // Only deal with non-null/undefined values
                if ((options = arguments[i]) !== null) {

                    // Extend the base object
                    for (name in options) {

                        src = target[name];
                        copy = options[name];

                        // Prevent never-ending loop
                        if (target === copy) {
                            continue;
                        }

                        // Recurse if we're merging plain objects or arrays
                        if (deep && copy && (this.isPlainObject(copy) || (copyIsArray = this.isArray(copy)))) {

                            if (copyIsArray) {
                                copyIsArray = false;
                                clone = src && this.isArray(src) ? src : [];
                            } else {
                                clone = src && this.isPlainObject(src) ? src : {};
                            }

                            // Never move original objects, clone them
                            target[name] = this.extend(deep, clone, copy);

                            // Don't bring in undefined values
                        } else if (copy !== undefined) {

                            target[name] = copy;

                        }
                    }
                }
            }

            // Return the modified object
            return target;

        },

        forEach: function(object, cb) {

            for (var i in object) {

                if (!object.hasOwnProperty(i)) continue;

                var res = cb(object[i], i);

                if (res === false) break;

            }

        },

        /**
         * TODO Replace with something better
         * @see https://github.com/joyent/node/blob/master/lib/querystring.js
         * @param {object} parameters
         * @returns {string}
         */
        queryStringify: function(parameters) {

            var array = [],
                self = this;

            this.forEach(parameters, function(v, i) {

                if (self.isArray(v)) {
                    v.forEach(function(vv) {
                        array.push(encodeURIComponent(i) + '=' + encodeURIComponent(vv));
                    });
                } else {
                    array.push(encodeURIComponent(i) + '=' + encodeURIComponent(v));
                }

            });

            return array.join('&');

        },

        /**
         * TODO Replace with something better
         * @see https://github.com/joyent/node/blob/master/lib/querystring.js
         * @param {string} queryString
         * @returns {object}
         */
        parseQueryString: function(queryString) {

            var argsParsed = {},
                self = this;

            queryString.split('&').forEach(function(arg) {

                arg = decodeURIComponent(arg);

                if (arg.indexOf('=') == -1) {

                    argsParsed[arg.trim()] = true;

                } else {

                    var pair = arg.split('='),
                        key = pair[0].trim(),
                        value = pair[1].trim();

                    if (key in argsParsed) {
                        if (key in argsParsed && !self.isArray(argsParsed[key])) argsParsed[key] = [argsParsed[key]];
                        argsParsed[key].push(value);
                    } else {
                        argsParsed[key] = value;
                    }

                }

            });

            return argsParsed;

        },

        /**
         * Returns true if the passed value is valid email address.
         * @param {string} v
         * @param {boolean} multiple Checks multiple comma separated emails according to RFC 2822
         * @returns {boolean}
         */
        isEmail: function(v, multiple) {
            if (!!multiple) {
                //this Regexp is also suitable for multiple emails (comma separated)
                return /^(?:[a-z0-9!#$%&'*+\/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+\/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?[ ,;]*)+$/i.test(v);
            } else {
                return /^[a-z0-9!#$%&'*+\/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+\/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/i.test(v);
            }

        },

        isPhoneNumber: function(v) {
            return (/\+?1[0-9]{3}[0-9a-z]{7}/im.test(v.toString().split(/[^0-9a-z\+]/im).join('')));
        },

        /**
         * @param args
         * @returns {Array}
         */
        argumentsToArray: function(args) {
            return Array.prototype.slice.call(args || [], 0);
        },

        isDate: function(obj) {
            return this.type(obj) === "date";
        },

        isFunction: function(obj) {
            return this.type(obj) === "function";
        },

        isArray: Array.isArray || function(obj) {
            return this.type(obj) === "array";
        },

        // A crude way of determining if an object is a window
        isWindow: function(obj) {
            return obj && typeof obj === "object" && "setInterval" in obj;
        },

        isNaN: function(obj) {
            return obj === null || !rdigit.test(obj) || isNaN(obj);
        },

        type: function(obj) {
            return obj === null ?
                   String(obj) :
                   class2type[toString.call(obj)] || "object";
        },

        isPlainObject: function(obj) {
            // Must be an Object.
            // Because of IE, we also have to check the presence of the constructor property.
            // Make sure that DOM nodes and window objects don't pass through, as well
            if (!obj || this.type(obj) !== "object" || obj.nodeType || this.isWindow(obj)) {
                return false;
            }

            // Not own constructor property must be Object
            if (obj.constructor && !hasOwn.call(obj, "constructor") && !hasOwn.call(obj.constructor.prototype, "isPrototypeOf")) {
                return false;
            }

            // Own properties are enumerated firstly, so to speed up,
            // if last one is own, then all properties are own.

            var key;
            for (key in obj) {}

            return key === undefined || hasOwn.call(obj, key);
        },

        getProperty: function(obj, property) {

            return property
                .split(/[.[\]]/)
                .reduce(function(res, part) {
                    if (!res) return undefined;
                    return part ? res[part] : res;
                }, obj);

        },

        poll: function(fn, interval, timeout) {

            this.stopPolling(timeout);

            interval = interval || 1000;

            var next = function(delay) {

                delay = delay || interval;

                interval = delay;

                return setTimeout(function() {

                    fn(next, delay);

                }, delay);

            };

            return next();

        },

        stopPolling: function(timeout) {
            if (timeout) clearTimeout(timeout);
        },

        parseString: function(s) {
            return s ? s.toString() : '';
        },

        parseNumber: function(n) {
            if (!n) return 0;
            n = parseFloat(n);
            return isNaN(n) ? 0 : n;
        },

        $get: function(context) {
            return Utils;
        }

    };

});