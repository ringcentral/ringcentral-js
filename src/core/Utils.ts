module RingCentral.sdk.core.utils {

    var hasOwn = Object.prototype.hasOwnProperty,
        toString = Object.prototype.toString,
        rdigit = /\d/,
        class2type = {};

    // Populate the class2type map
    'Boolean Number String Function Array Date RegExp Object'.split(' ').forEach((name) => {
        class2type["[object " + name + "]"] = name.toLowerCase();
    });

    /**
     * Ported from jQuery.fn.extend
     * Optional first parameter makes deep copy
     */
    export function extend(targetObject:any, sourceObject:any, ...args) {

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
        if (typeof target !== "object" && !isFunction(target)) {
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
                    if (deep && copy && (isPlainObject(copy) || (copyIsArray = isArray(copy)))) {

                        if (copyIsArray) {
                            copyIsArray = false;
                            clone = src && isArray(src) ? src : [];
                        } else {
                            clone = src && isPlainObject(src) ? src : {};
                        }

                        // Never move original objects, clone them
                        target[name] = extend(deep, clone, copy);

                        // Don't bring in undefined values
                    } else if (copy !== undefined) {

                        target[name] = copy;

                    }
                }
            }
        }

        // Return the modified object
        return target;

    }

    export function forEach(object, cb) {

        for (var i in object) {

            if (!object.hasOwnProperty(i)) continue;

            var res = cb(object[i], i);

            if (res === false) break;

        }

    }

    /**
     * TODO Replace with something better
     * @see https://github.com/joyent/node/blob/master/lib/querystring.js
     * @param {object} parameters
     * @returns {string}
     */
    export function queryStringify(parameters) {

        var array = [];

        forEach(parameters, (v, i) => {

            if (isArray(v)) {
                v.forEach((vv) => {
                    array.push(encodeURIComponent(i) + '=' + encodeURIComponent(vv));
                });
            } else {
                array.push(encodeURIComponent(i) + '=' + encodeURIComponent(v));
            }

        });

        return array.join('&');

    }

    /**
     * TODO Replace with something better
     * @see https://github.com/joyent/node/blob/master/lib/querystring.js
     * @param {string} queryString
     * @returns {object}
     */
    export function parseQueryString(queryString:string):any {

        var argsParsed = {},
            self = this;

        queryString.split('&').forEach((arg) => {

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

    }

    /**
     * Returns true if the passed value is valid email address.
     * Checks multiple comma separated emails according to RFC 2822 if parameter `multiple` is `true`
     */
    export function isEmail(v:string, multiple:boolean):boolean {
        if (!!multiple) {
            //this Regexp is also suitable for multiple emails (comma separated)
            return /^(?:[a-z0-9!#$%&'*+\/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+\/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?[ ,;]*)+$/i.test(v);
        } else {
            return /^[a-z0-9!#$%&'*+\/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+\/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/i.test(v);
        }

    }

    export function isPhoneNumber(v:string):boolean {
        return (/\+?1[0-9]{3}[0-9a-z]{7}/im.test(v.toString().split(/[^0-9a-z\+]/im).join('')));
    }

    /**
     * @param args
     * @returns {Array}
     */
    export function argumentsToArray(args:any) {
        return Array.prototype.slice.call(args || [], 0);
    }

    export function isDate(obj:any):boolean {
        return type(obj) === "date";
    }

    export function isFunction(obj:any):boolean {
        return type(obj) === "function";
    }

    export function isArray(obj:any):boolean {
        return Array.isArray ? Array.isArray(obj) : type(obj) === "array";
    }

    // A crude way of determining if an object is a window
    export function isWindow(obj:any):boolean {
        return obj && typeof obj === "object" && "setInterval" in obj;
    }

    export function isNan(obj:any):boolean {
        return obj === null || !rdigit.test(obj) || isNaN(obj);
    }

    export function type(obj:any):string {
        return obj === null
            ? String(obj)
            : class2type[toString.call(obj)] || "object";
    }

    export function isPlainObject(obj:any):boolean {

        // Must be an Object.
        // Because of IE, we also have to check the presence of the constructor property.
        // Make sure that DOM nodes and window objects don't pass through, as well
        if (!obj || type(obj) !== "object" || obj.nodeType || isWindow(obj)) {
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

    }

    export function getProperty(obj:any, property:string):any {

        return property
            .split(/[.[\]]/)
            .reduce((res, part) => {
                if (!res) return undefined;
                return part ? res[part] : res;
            }, obj);

    }

    export function poll(fn, interval?:number, timeout?:any):any { //NodeJS.Timer|number

        stopPolling(timeout);

        interval = interval || 1000;

        var next = (delay?:number):any => {

            delay = delay || interval;

            interval = delay;

            return setTimeout(() => {

                fn(next, delay);

            }, delay);

        };

        return next();

    }

    export function stopPolling(timeout) {
        if (timeout) clearTimeout(timeout);
    }

    export function parseString(s:any):string {
        return s ? s.toString() : '';
    }

    export function parseNumber(n:any):number {
        if (!n) return 0;
        n = parseFloat(n);
        return isNan(n) ? 0 : n;
    }

    export function isNodeJS():boolean {
        return (typeof process !== 'undefined');
    }

    export function isBrowser():boolean {
        return (typeof window !== 'undefined');
    }

}