var RingCentral;
(function (RingCentral) {
    var sdk;
    (function (sdk) {
        var core;
        (function (core) {
            var Cache = (function () {
                function Cache(storage, prefix) {
                    this.setPrefix(prefix);
                    this._storage = storage;
                }
                Cache.prototype.setPrefix = function (prefix) {
                    this._prefix = prefix || 'rc-';
                    return this;
                };
                Cache.prototype.setItem = function (key, data) {
                    this._storage[this._prefixKey(key)] = JSON.stringify(data);
                    return this;
                };
                Cache.prototype.removeItem = function (key) {
                    delete this._storage[this._prefixKey(key)];
                    return this;
                };
                Cache.prototype.getItem = function (key) {
                    var item = this._storage[this._prefixKey(key)];
                    if (!item)
                        return null;
                    return JSON.parse(item);
                };
                Cache.prototype.clean = function () {
                    for (var key in this._storage) {
                        if (!this._storage.hasOwnProperty(key))
                            continue;
                        if (key.indexOf(this._prefix) === 0) {
                            delete this._storage[key];
                        }
                    }
                    return this;
                };
                Cache.prototype._prefixKey = function (key) {
                    return this._prefix + key;
                };
                return Cache;
            })();
            core.Cache = Cache;
        })(core = sdk.core || (sdk.core = {}));
    })(sdk = RingCentral.sdk || (RingCentral.sdk = {}));
})(RingCentral || (RingCentral = {}));
var RingCentral;
(function (RingCentral) {
    var sdk;
    (function (sdk) {
        var core;
        (function (core) {
            /**
             * TODO Fix public vars
             */
            var Log = (function () {
                function Log(console) {
                    if (!console) {
                        console = {
                            log: function () { },
                            warn: function () { },
                            info: function () { },
                            error: function () { }
                        };
                    }
                    this._console = console;
                    this.logDebug = false;
                    this.logInfo = false;
                    this.logWarnings = false;
                    this.logErrors = false;
                    this.addTimestamps = false;
                }
                Log.prototype.disableAll = function () {
                    this.logDebug = false;
                    this.logInfo = false;
                    this.logWarnings = false;
                    this.logErrors = false;
                };
                Log.prototype.enableAll = function () {
                    this.logDebug = true;
                    this.logInfo = true;
                    this.logWarnings = true;
                    this.logErrors = true;
                };
                Log.prototype.debug = function () {
                    var args = [];
                    for (var _i = 0; _i < arguments.length; _i++) {
                        args[_i - 0] = arguments[_i];
                    }
                    if (this.logDebug)
                        this._console.log.apply(this._console, this._parseArguments(arguments));
                };
                Log.prototype.info = function () {
                    var args = [];
                    for (var _i = 0; _i < arguments.length; _i++) {
                        args[_i - 0] = arguments[_i];
                    }
                    if (this.logInfo)
                        this._console.info.apply(this._console, this._parseArguments(arguments));
                };
                Log.prototype.warn = function () {
                    var args = [];
                    for (var _i = 0; _i < arguments.length; _i++) {
                        args[_i - 0] = arguments[_i];
                    }
                    if (this.logWarnings)
                        this._console.warn.apply(this._console, this._parseArguments(arguments));
                };
                Log.prototype.error = function () {
                    var args = [];
                    for (var _i = 0; _i < arguments.length; _i++) {
                        args[_i - 0] = arguments[_i];
                    }
                    if (this.logErrors)
                        this._console.error.apply(this._console, this._parseArguments(arguments));
                };
                Log.prototype.stack = function () {
                    var e = new Error();
                    if (e.hasOwnProperty('stack')) {
                        return e.stack.replace('Error\n', 'Stack Trace\n');
                    }
                };
                Log.prototype._parseArguments = function (args) {
                    args = core.utils.argumentsToArray(args);
                    if (this.addTimestamps)
                        args.unshift(new Date().toLocaleString(), '-');
                    return args;
                };
                return Log;
            })();
            core.Log = Log;
            core.log = new Log();
        })(core = sdk.core || (sdk.core = {}));
    })(sdk = RingCentral.sdk || (RingCentral.sdk = {}));
})(RingCentral || (RingCentral = {}));
var RingCentral;
(function (RingCentral) {
    var sdk;
    (function (sdk) {
        var core;
        (function (core) {
            var utils;
            (function (utils) {
                var hasOwn = Object.prototype.hasOwnProperty, toString = Object.prototype.toString, rdigit = /\d/, class2type = {};
                // Populate the class2type map
                'Boolean Number String Function Array Date RegExp Object'.split(' ').forEach(function (name) {
                    class2type["[object " + name + "]"] = name.toLowerCase();
                });
                /**
                 * Ported from jQuery.fn.extend
                 * Optional first parameter makes deep copy
                 */
                function extend(targetObject, sourceObject) {
                    var args = [];
                    for (var _i = 2; _i < arguments.length; _i++) {
                        args[_i - 2] = arguments[_i];
                    }
                    var options, name, src, copy, copyIsArray, clone, target = arguments[0] || {}, i = 1, length = arguments.length, deep = false;
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
                                    }
                                    else {
                                        clone = src && isPlainObject(src) ? src : {};
                                    }
                                    // Never move original objects, clone them
                                    target[name] = extend(deep, clone, copy);
                                }
                                else if (copy !== undefined) {
                                    target[name] = copy;
                                }
                            }
                        }
                    }
                    // Return the modified object
                    return target;
                }
                utils.extend = extend;
                function forEach(object, cb) {
                    for (var i in object) {
                        if (!object.hasOwnProperty(i))
                            continue;
                        var res = cb(object[i], i);
                        if (res === false)
                            break;
                    }
                }
                utils.forEach = forEach;
                /**
                 * TODO Replace with something better
                 * @see https://github.com/joyent/node/blob/master/lib/querystring.js
                 * @param {object} parameters
                 * @returns {string}
                 */
                function queryStringify(parameters) {
                    var array = [];
                    forEach(parameters, function (v, i) {
                        if (isArray(v)) {
                            v.forEach(function (vv) {
                                array.push(encodeURIComponent(i) + '=' + encodeURIComponent(vv));
                            });
                        }
                        else {
                            array.push(encodeURIComponent(i) + '=' + encodeURIComponent(v));
                        }
                    });
                    return array.join('&');
                }
                utils.queryStringify = queryStringify;
                /**
                 * TODO Replace with something better
                 * @see https://github.com/joyent/node/blob/master/lib/querystring.js
                 * @param {string} queryString
                 * @returns {object}
                 */
                function parseQueryString(queryString) {
                    var argsParsed = {}, self = this;
                    queryString.split('&').forEach(function (arg) {
                        arg = decodeURIComponent(arg);
                        if (arg.indexOf('=') == -1) {
                            argsParsed[arg.trim()] = true;
                        }
                        else {
                            var pair = arg.split('='), key = pair[0].trim(), value = pair[1].trim();
                            if (key in argsParsed) {
                                if (key in argsParsed && !self.isArray(argsParsed[key]))
                                    argsParsed[key] = [argsParsed[key]];
                                argsParsed[key].push(value);
                            }
                            else {
                                argsParsed[key] = value;
                            }
                        }
                    });
                    return argsParsed;
                }
                utils.parseQueryString = parseQueryString;
                /**
                 * Returns true if the passed value is valid email address.
                 * Checks multiple comma separated emails according to RFC 2822 if parameter `multiple` is `true`
                 */
                function isEmail(v, multiple) {
                    if (!!multiple) {
                        //this Regexp is also suitable for multiple emails (comma separated)
                        return /^(?:[a-z0-9!#$%&'*+\/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+\/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?[ ,;]*)+$/i.test(v);
                    }
                    else {
                        return /^[a-z0-9!#$%&'*+\/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+\/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/i.test(v);
                    }
                }
                utils.isEmail = isEmail;
                function isPhoneNumber(v) {
                    return (/\+?1[0-9]{3}[0-9a-z]{7}/im.test(v.toString().split(/[^0-9a-z\+]/im).join('')));
                }
                utils.isPhoneNumber = isPhoneNumber;
                /**
                 * @param args
                 * @returns {Array}
                 */
                function argumentsToArray(args) {
                    return Array.prototype.slice.call(args || [], 0);
                }
                utils.argumentsToArray = argumentsToArray;
                function isDate(obj) {
                    return type(obj) === "date";
                }
                utils.isDate = isDate;
                function isFunction(obj) {
                    return type(obj) === "function";
                }
                utils.isFunction = isFunction;
                function isArray(obj) {
                    return Array.isArray ? Array.isArray(obj) : type(obj) === "array";
                }
                utils.isArray = isArray;
                // A crude way of determining if an object is a window
                function isWindow(obj) {
                    return obj && typeof obj === "object" && "setInterval" in obj;
                }
                utils.isWindow = isWindow;
                function isNan(obj) {
                    return obj === null || !rdigit.test(obj) || isNaN(obj);
                }
                utils.isNan = isNan;
                function type(obj) {
                    return obj === null
                        ? String(obj)
                        : class2type[toString.call(obj)] || "object";
                }
                utils.type = type;
                function isPlainObject(obj) {
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
                    for (key in obj) { }
                    return key === undefined || hasOwn.call(obj, key);
                }
                utils.isPlainObject = isPlainObject;
                function getProperty(obj, property) {
                    return property
                        .split(/[.[\]]/)
                        .reduce(function (res, part) {
                        if (!res)
                            return undefined;
                        return part ? res[part] : res;
                    }, obj);
                }
                utils.getProperty = getProperty;
                function poll(fn, interval, timeout) {
                    stopPolling(timeout);
                    interval = interval || 1000;
                    var next = function (delay) {
                        delay = delay || interval;
                        interval = delay;
                        return setTimeout(function () {
                            fn(next, delay);
                        }, delay);
                    };
                    return next();
                }
                utils.poll = poll;
                function stopPolling(timeout) {
                    if (timeout)
                        clearTimeout(timeout);
                }
                utils.stopPolling = stopPolling;
                function parseString(s) {
                    return s ? s.toString() : '';
                }
                utils.parseString = parseString;
                function parseNumber(n) {
                    if (!n)
                        return 0;
                    n = parseFloat(n);
                    return isNan(n) ? 0 : n;
                }
                utils.parseNumber = parseNumber;
                function isNodeJS() {
                    return (typeof process !== 'undefined');
                }
                utils.isNodeJS = isNodeJS;
                function isBrowser() {
                    return (typeof window !== 'undefined');
                }
                utils.isBrowser = isBrowser;
            })(utils = core.utils || (core.utils = {}));
        })(core = sdk.core || (sdk.core = {}));
    })(sdk = RingCentral.sdk || (RingCentral.sdk = {}));
})(RingCentral || (RingCentral = {}));
/// <reference path="./Log.ts" />
/// <reference path="./Utils.ts" />
var RingCentral;
(function (RingCentral) {
    var sdk;
    (function (sdk) {
        var core;
        (function (core) {
            /**
             * @see https://github.com/Microsoft/TypeScript/issues/275
             */
            var Observable = (function () {
                function Observable() {
                    if (!(this instanceof Observable))
                        throw new Error('Observable(): New operator was omitted');
                    this.off();
                }
                Observable.prototype.hasListeners = function (event) {
                    return (event in this._listeners);
                };
                Observable.prototype.on = function (events, callback) {
                    var _this = this;
                    if (typeof events == 'string')
                        events = [events];
                    if (!events)
                        throw new Error('No events to subscribe to');
                    if (typeof callback !== 'function')
                        throw new Error('Callback must be a function');
                    events.forEach(function (event) {
                        if (!_this.hasListeners(event))
                            _this._listeners[event] = [];
                        _this._listeners[event].push(callback);
                    });
                    return this;
                };
                Observable.prototype.emit = function (event) {
                    var _this = this;
                    var args = [];
                    for (var _i = 1; _i < arguments.length; _i++) {
                        args[_i - 1] = arguments[_i];
                    }
                    var result = null;
                    if (!this.hasListeners(event))
                        return null;
                    this._listeners[event].some(function (callback) {
                        result = callback.apply(_this, args);
                        return (result === false);
                    });
                    return result;
                };
                Observable.prototype.off = function (event, callback) {
                    var _this = this;
                    if (!event) {
                        this._listeners = {};
                    }
                    else {
                        if (!callback) {
                            delete this._listeners[event];
                        }
                        else {
                            if (!this.hasListeners(event))
                                return this;
                            this._listeners[event].forEach(function (cb, i) {
                                if (cb === callback)
                                    delete _this._listeners[event][i];
                            });
                        }
                    }
                    return this;
                };
                Observable.prototype.destroy = function () {
                    this.off();
                    core.log.debug('Observable.destroy(): Listeners were destroyed');
                    return this;
                };
                return Observable;
            })();
            core.Observable = Observable;
        })(core = sdk.core || (sdk.core = {}));
    })(sdk = RingCentral.sdk || (RingCentral.sdk = {}));
})(RingCentral || (RingCentral = {}));
/// <reference path="./Observable.ts" />
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var RingCentral;
(function (RingCentral) {
    var sdk;
    (function (sdk) {
        var core;
        (function (core) {
            var PageVisibility = (function (_super) {
                __extends(PageVisibility, _super);
                function PageVisibility() {
                    var _this = this;
                    _super.call(this);
                    this.events = {
                        change: 'change'
                    };
                    var hidden = "hidden", onchange = function (evt) {
                        evt = evt || window.event;
                        var v = 'visible', h = 'hidden', evtMap = {
                            focus: v, focusin: v, pageshow: v, blur: h, focusout: h, pagehide: h
                        };
                        _this._visible = (evt.type in evtMap) ? evtMap[evt.type] == v : !document[hidden];
                        _this.emit(_this.events.change, _this._visible);
                    };
                    this._visible = true;
                    if (typeof document == 'undefined' || typeof window == 'undefined')
                        return;
                    // Standards:
                    if (hidden in document)
                        document.addEventListener("visibilitychange", onchange);
                    else if ((hidden = "mozHidden") in document)
                        document.addEventListener("mozvisibilitychange", onchange);
                    else if ((hidden = "webkitHidden") in document)
                        document.addEventListener("webkitvisibilitychange", onchange);
                    else if ((hidden = "msHidden") in document)
                        document.addEventListener("msvisibilitychange", onchange);
                    else if ('onfocusin' in document)
                        document.onfocusin = document.onfocusout = onchange;
                    else
                        window.onpageshow = window.onpagehide = window.onfocus = window.onblur = onchange;
                }
                PageVisibility.prototype.visible = function () {
                    return this._visible;
                };
                return PageVisibility;
            })(core.Observable);
            core.PageVisibility = PageVisibility;
        })(core = sdk.core || (sdk.core = {}));
    })(sdk = RingCentral.sdk || (RingCentral.sdk = {}));
})(RingCentral || (RingCentral = {}));
/// <reference path="../externals.d.ts" />
/// <reference path="../core/Observable.ts" />
var RingCentral;
(function (RingCentral) {
    var sdk;
    (function (sdk) {
        var mocks;
        (function (mocks) {
            var Mock = (function () {
                function Mock(method, path, json, status, statusText, delay) {
                    this._method = method.toUpperCase();
                    this._path = path;
                    this._json = json || {};
                    this._delay = delay || 10;
                    this._status = status || 200;
                    this._statusText = statusText || 'OK';
                }
                Mock.prototype.path = function () {
                    return this._path;
                };
                Mock.prototype.method = function () {
                    return this._method;
                };
                Mock.prototype.test = function (request) {
                    return request.url.indexOf(this._path) > -1 &&
                        request.method.toUpperCase() == this._method;
                };
                Mock.prototype.getResponse = function (request) {
                    var _this = this;
                    return new sdk.externals._Promise(function (resolve, reject) {
                        setTimeout(function () {
                            resolve(_this.createResponse(_this._json));
                        }, _this._delay);
                    });
                };
                Mock.prototype.createResponse = function (json, init) {
                    init = init || {};
                    init.status = init.status || this._status;
                    init.statusText = init.statusText || this._statusText;
                    var str = JSON.stringify(json), res = sdk.http.Client.createResponse(str, init);
                    res.headers.set(sdk.http.ApiResponse.contentType, sdk.http.ApiResponse.jsonContentType);
                    return res;
                };
                return Mock;
            })();
            mocks.Mock = Mock;
        })(mocks = sdk.mocks || (sdk.mocks = {}));
    })(sdk = RingCentral.sdk || (RingCentral.sdk = {}));
})(RingCentral || (RingCentral = {}));
/// <reference path="./Mock.ts" />
var RingCentral;
(function (RingCentral) {
    var sdk;
    (function (sdk) {
        var mocks;
        (function (mocks) {
            var Registry = (function () {
                function Registry() {
                    this._mocks = [];
                }
                Registry.prototype.add = function (mock) {
                    this._mocks.push(mock);
                    return this;
                };
                Registry.prototype.clear = function () {
                    this._mocks = [];
                    return this;
                };
                Registry.prototype.find = function (request) {
                    //console.log('Registry is looking for', request);
                    var mock = this._mocks.shift();
                    if (!mock)
                        throw new Error('No mock in registry for request ' + request.method + ' ' + request.url);
                    if (!mock.test(request))
                        throw new Error('Wrong request ' + request.method + ' ' + request.url +
                            ' for expected mock ' + mock.method() + ' ' + mock.path());
                    return mock;
                };
                Registry.prototype.apiCall = function (method, path, response, status, statusText) {
                    this.add(new mocks.Mock(method, path, response, status, statusText));
                    return this;
                };
                Registry.prototype.authentication = function () {
                    this.apiCall('POST', '/restapi/oauth/token', {
                        'access_token': 'ACCESS_TOKEN',
                        'token_type': 'bearer',
                        'expires_in': 3600,
                        'refresh_token': 'REFRESH_TOKEN',
                        'refresh_token_expires_in': 60480,
                        'scope': 'SMS RCM Foo Boo',
                        'expireTime': new Date().getTime() + 3600000
                    });
                    return this;
                };
                Registry.prototype.logout = function () {
                    this.apiCall('POST', '/restapi/oauth/revoke', {});
                    return this;
                };
                Registry.prototype.presenceLoad = function (id) {
                    this.apiCall('GET', '/restapi/v1.0/account/~/extension/' + id + '/presence', {
                        "uri": "https://platform.ringcentral.com/restapi/v1.0/account/123/extension/" + id + "/presence",
                        "extension": {
                            "uri": "https://platform.ringcentral.com/restapi/v1.0/account/123/extension/" + id,
                            "id": id,
                            "extensionNumber": "101"
                        },
                        "activeCalls": [],
                        "presenceStatus": "Available",
                        "telephonyStatus": "Ringing",
                        "userStatus": "Available",
                        "dndStatus": "TakeAllCalls",
                        "extensionId": id
                    });
                    return this;
                };
                Registry.prototype.subscribeGeneric = function (expiresIn) {
                    expiresIn = expiresIn || 15 * 60 * 60;
                    var date = new Date();
                    this.apiCall('POST', '/restapi/v1.0/subscription', {
                        'eventFilters': [
                            '/restapi/v1.0/account/~/extension/~/presence'
                        ],
                        'expirationTime': new Date(date.getTime() + (expiresIn * 1000)).toISOString(),
                        'expiresIn': expiresIn,
                        'deliveryMode': {
                            'transportType': 'PubNub',
                            'encryption': false,
                            'address': '123_foo',
                            'subscriberKey': 'sub-c-foo',
                            'secretKey': 'sec-c-bar'
                        },
                        'id': 'foo-bar-baz',
                        'creationTime': date.toISOString(),
                        'status': 'Active',
                        'uri': 'https://platform.ringcentral.com/restapi/v1.0/subscription/foo-bar-baz'
                    });
                    return this;
                };
                Registry.prototype.subscribeOnPresence = function (id, detailed) {
                    id = id || '1';
                    var date = new Date();
                    this.apiCall('POST', '/restapi/v1.0/subscription', {
                        'eventFilters': ['/restapi/v1.0/account/~/extension/' + id + '/presence' + (detailed ? '?detailedTelephonyState=true' : '')],
                        'expirationTime': new Date(date.getTime() + (15 * 60 * 60 * 1000)).toISOString(),
                        'deliveryMode': {
                            'transportType': 'PubNub',
                            'encryption': true,
                            'address': '123_foo',
                            'subscriberKey': 'sub-c-foo',
                            'secretKey': 'sec-c-bar',
                            'encryptionAlgorithm': 'AES',
                            'encryptionKey': 'VQwb6EVNcQPBhE/JgFZ2zw=='
                        },
                        'creationTime': date.toISOString(),
                        'id': 'foo-bar-baz',
                        'status': 'Active',
                        'uri': 'https://platform.ringcentral.com/restapi/v1.0/subscription/foo-bar-baz'
                    });
                    return this;
                };
                Registry.prototype.tokenRefresh = function (failure) {
                    if (!failure) {
                        this.apiCall('POST', '/restapi/oauth/token', {
                            'access_token': 'ACCESS_TOKEN_FROM_REFRESH',
                            'token_type': 'bearer',
                            'expires_in': 3600,
                            'refresh_token': 'REFRESH_TOKEN_FROM_REFRESH',
                            'refresh_token_expires_in': 60480,
                            'scope': 'SMS RCM Foo Boo'
                        });
                    }
                    else {
                        this.apiCall('POST', '/restapi/oauth/token', {
                            'message': 'Wrong token',
                            'error_description': 'Wrong token',
                            'description': 'Wrong token'
                        }, 400);
                    }
                    return this;
                };
                return Registry;
            })();
            mocks.Registry = Registry;
        })(mocks = sdk.mocks || (sdk.mocks = {}));
    })(sdk = RingCentral.sdk || (RingCentral.sdk = {}));
})(RingCentral || (RingCentral = {}));
/// <reference path="../externals.d.ts" />
var RingCentral;
(function (RingCentral) {
    var sdk;
    (function (sdk) {
        var externals;
        (function (externals) {
            externals._Promise;
            externals._fetch;
            externals._Response;
            externals._Request;
            externals._Headers;
            externals._PUBNUB;
            function get() {
                var root = Function('return this')();
                if (!externals._PUBNUB)
                    externals._PUBNUB = root.PUBNUB;
                if (!externals._Promise)
                    externals._Promise = root.Promise;
                if (!externals._fetch)
                    externals._fetch = root.fetch;
                if (!externals._Headers)
                    externals._Headers = root.Headers;
                if (!externals._Request)
                    externals._Request = root.Request;
                if (!externals._Response)
                    externals._Response = root.Response;
                return externals;
            }
            externals.get = get;
        })(externals = sdk.externals || (sdk.externals = {}));
    })(sdk = RingCentral.sdk || (RingCentral.sdk = {}));
})(RingCentral || (RingCentral = {}));
/// <reference path="../externals.d.ts" />
/// <reference path="../core/Utils.ts" />
/// <reference path="../core/Observable.ts" />
var RingCentral;
(function (RingCentral) {
    var sdk;
    (function (sdk) {
        var http;
        (function (http) {
            /**
             * @TODO Bring back tests
             */
            var ApiResponse = (function () {
                function ApiResponse(request, response, responseText) {
                    this._text = responseText;
                    this._request = request;
                    this._response = response;
                    this._json = null;
                    this._multipartTransactions = null;
                }
                ApiResponse.prototype.response = function () {
                    return this._response;
                };
                ApiResponse.prototype.request = function () {
                    return this._request;
                };
                ApiResponse.prototype.ok = function () {
                    return this._response && this._response.ok;
                };
                ApiResponse.prototype.text = function () {
                    return this._text;
                };
                ApiResponse.prototype.json = function () {
                    if (!this._isJson())
                        throw new Error('Response is not JSON');
                    if (!this._json) {
                        this._json = this._text ? JSON.parse(this._text) : null;
                    }
                    return this._json;
                };
                ApiResponse.prototype.error = function (skipOKCheck) {
                    if (this.ok() && !skipOKCheck)
                        return null;
                    var message = (this._response && this._response.status ? this._response.status + ' ' : '') +
                        (this._response && this._response.statusText ? this._response.statusText : '');
                    try {
                        var json = this.json();
                        if (json.message)
                            message = json.message;
                        if (json.error_description)
                            message = json.error_description;
                        if (json.description)
                            message = json.description;
                    }
                    catch (ex) { }
                    return message;
                };
                ApiResponse.prototype.multipart = function () {
                    if (!this._isMultipart())
                        throw new Error('Response is not multipart');
                    if (null === this._multipartTransactions) {
                        // Step 1. Split multipart response
                        if (!this._text)
                            throw new Error('No response body');
                        var boundary = this._response.headers.get('Content-Type').match(/boundary=([^;]+)/i)[1];
                        if (!boundary)
                            throw new Error('Cannot find boundary');
                        var parts = this._text.toString().split(ApiResponse.boundarySeparator + boundary);
                        if (parts[0].trim() === '')
                            parts.shift();
                        if (parts[parts.length - 1].trim() == ApiResponse.boundarySeparator)
                            parts.pop();
                        if (parts.length < 1)
                            throw new Error('No parts in body');
                        // Step 2. Parse status info
                        var statusInfo = ApiResponse.create(parts.shift(), this._response.status, this._response.statusText);
                        // Step 3. Parse all other parts
                        this._multipartTransactions = parts.map(function (part, i) {
                            var status = statusInfo.json().response[i].status;
                            return ApiResponse.create(part, status);
                        });
                    }
                    return this._multipartTransactions;
                };
                /**
                 * Short-hand method to get only JSON content of responses
                 */
                ApiResponse.prototype.multipartJson = function () {
                    return this.multipart().map(function (res) {
                        return res.json();
                    });
                };
                ApiResponse.prototype._isContentType = function (contentType) {
                    return this._getContentType().indexOf(contentType) > -1;
                };
                ApiResponse.prototype._getContentType = function () {
                    return this._response.headers.get(ApiResponse.contentType) || '';
                };
                ApiResponse.prototype._isMultipart = function () {
                    return this._isContentType(ApiResponse.multipartContentType);
                };
                ApiResponse.prototype._isUrlEncoded = function () {
                    return this._isContentType(ApiResponse.urlencodedContentType);
                };
                ApiResponse.prototype._isJson = function () {
                    return this._isContentType(ApiResponse.jsonContentType);
                };
                /**
                 * Method is used to create Transaction objects from string parts of multipart/mixed response
                 * @param text
                 * @param status
                 * @param statusText
                 * @return {ApiResponse}
                 */
                ApiResponse.create = function (text, status, statusText) {
                    status = status || 200;
                    statusText = statusText || 'OK';
                    text = text.replace(/\r/g, '');
                    var headers = new sdk.externals._Headers(), headersAndBody = text.split(ApiResponse.bodySeparator), headersText = (headersAndBody.length > 1) ? headersAndBody.shift() : '';
                    text = headersAndBody.join(ApiResponse.bodySeparator);
                    (headersText || '')
                        .split('\n')
                        .forEach(function (header) {
                        var split = header.trim().split(ApiResponse.headerSeparator), key = split.shift().trim(), value = split.join(ApiResponse.headerSeparator).trim();
                        if (key)
                            headers.append(key, value);
                    });
                    return new ApiResponse(null, http.Client.createResponse(text, {
                        headers: headers,
                        status: status,
                        statusText: statusText
                    }), text);
                };
                ApiResponse.contentType = 'Content-Type';
                ApiResponse.jsonContentType = 'application/json';
                ApiResponse.multipartContentType = 'multipart/mixed';
                ApiResponse.urlencodedContentType = 'application/x-www-form-urlencoded';
                ApiResponse.headerSeparator = ':';
                ApiResponse.bodySeparator = '\n\n';
                ApiResponse.boundarySeparator = '--';
                return ApiResponse;
            })();
            http.ApiResponse = ApiResponse;
        })(http = sdk.http || (sdk.http = {}));
    })(sdk = RingCentral.sdk || (RingCentral.sdk = {}));
})(RingCentral || (RingCentral = {}));
/// <reference path="../externals.d.ts" />
/// <reference path="../core/Utils.ts" />
/// <reference path="../core/Observable.ts" />
/// <reference path="../mocks/Registry.ts" />
/// <reference path="../externals/Externals.ts" />
/// <reference path="./ApiResponse.ts" />
var RingCentral;
(function (RingCentral) {
    var sdk;
    (function (sdk) {
        var http;
        (function (http) {
            var allowedMethods = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS', 'HEAD'];
            var Client = (function (_super) {
                __extends(Client, _super);
                function Client() {
                    _super.apply(this, arguments);
                    this.events = {
                        beforeRequest: 'beforeRequest',
                        requestSuccess: 'requestSuccess',
                        requestError: 'requestError' // means that request failed completely
                    };
                }
                Client.prototype.sendRequest = function (request) {
                    var _this = this;
                    var res = new http.ApiResponse(request); //FIXME Potential leak
                    return new sdk.externals._Promise(function (resolve) {
                        //TODO Stop request if listeners return false
                        _this.emit(_this.events.beforeRequest, res);
                        resolve(_this._loadResponse(request));
                    })
                        .then(function (response) {
                        res['_response'] = Client.cloneResponse(response);
                        return response.text();
                    })
                        .then(function (text) {
                        res['_text'] = text;
                        if (!res.ok())
                            throw Client.makeError(new Error('Response has unsuccessful status'), res);
                        _this.emit(_this.events.requestSuccess, res);
                        return res;
                    })
                        .catch(function (e) {
                        if (!e.apiResponse) {
                            // we don't pass response since most likely it's parsing caused an error
                            e = Client.makeError(e, res);
                        }
                        _this.emit(_this.events.requestError, e);
                        throw e;
                    });
                };
                Client.prototype._loadResponse = function (request) {
                    return sdk.externals._fetch.call(null, request);
                };
                /**
                 * Wraps the JS Error object with transaction information
                 * @param {Error} e
                 * @param {ApiResponse} apiResponse
                 * @return {IApiError}
                 */
                Client.makeError = function (e, apiResponse) {
                    var error = e;
                    // Wrap only if regular error
                    if (!error.hasOwnProperty('apiResponse') && !error.hasOwnProperty('originalMessage')) {
                        error.apiResponse = apiResponse;
                        error.originalMessage = error.message;
                        error.message = (apiResponse && apiResponse.error(true)) || error.originalMessage;
                    }
                    return error;
                };
                /**
                 * TODO Wait for
                 *   - https://github.com/github/fetch/issues/185
                 *   - https://github.com/bitinn/node-fetch/issues/34
                 * @param {Response} response
                 * @return {Response}
                 */
                Client.cloneResponse = function (response) {
                    if (sdk.core.utils.isFunction(response.clone))
                        return response.clone();
                    var body = '';
                    if (response.hasOwnProperty('_bodyInit'))
                        body = response['_bodyInit'];
                    if (response.hasOwnProperty('_bodyText'))
                        body = response['_bodyText'];
                    if (response.hasOwnProperty('_bodyBlob'))
                        body = response['_bodyBlob'].slice();
                    if (response.hasOwnProperty('_bodyFormData'))
                        body = response['_bodyFormData'];
                    if (response.hasOwnProperty('_raw'))
                        body = response['_raw'].join('');
                    var clone = new sdk.externals._Response(body, response);
                    if (response.hasOwnProperty('body'))
                        clone['body'] = response['body']; // accessing non-standard properties
                    return clone;
                };
                /**
                 * Creates a response
                 * @param stringBody
                 * @param init
                 * @return {Response}
                 */
                Client.createResponse = function (stringBody, init) {
                    init = init || {};
                    return new sdk.externals._Response(stringBody, init);
                };
                Client.createRequest = function (input, init) {
                    init = init || {};
                    var body = init.body;
                    // Assign request with empty body, Github's fetch throws errors if it cannot recognize the body type
                    var req = new sdk.externals._Request(input, sdk.core.utils.extend({}, init, { body: null }));
                    if (!req.url)
                        throw new Error('Url is not defined');
                    if (!req.method)
                        req.method = 'GET';
                    if (req.method && allowedMethods.indexOf(req.method) < 0)
                        throw new Error('Method has wrong value: ' + req.method);
                    if (!req.headers.has('Accept'))
                        req.headers.set('Accept', 'application/json');
                    // Serialize body
                    if (sdk.core.utils.isPlainObject(init.body) || !init.body) {
                        if (!req.headers.has('Content-Type'))
                            req.headers.set('Content-Type', 'application/json');
                        var contentType = req.headers.get('Content-Type');
                        if (contentType.indexOf('application/json') > -1) {
                            body = JSON.stringify(init.body);
                        }
                        else if (contentType.indexOf('application/x-www-form-urlencoded') > -1) {
                            body = sdk.core.utils.queryStringify(init.body);
                        }
                    }
                    req.credentials = 'include';
                    req.mode = 'cors';
                    if (init.query) {
                        req.url = req.url + (req.url.indexOf('?') > -1 ? '&' : '?') + sdk.core.utils.queryStringify(init.query);
                    }
                    // Create another request with encoded body
                    req = new sdk.externals._Request(req.url, sdk.core.utils.extend(req, { body: body }));
                    // Keep the original body accessible directly (for mocks)
                    req.body = init.body;
                    return req;
                };
                return Client;
            })(sdk.core.Observable);
            http.Client = Client;
        })(http = sdk.http || (sdk.http = {}));
    })(sdk = RingCentral.sdk || (RingCentral.sdk = {}));
})(RingCentral || (RingCentral = {}));
/// <reference path="../externals.d.ts" />
/// <reference path="../core/Utils.ts" />
/// <reference path="../core/Utils.ts" />
/// <reference path="../externals/Externals.ts" />
var RingCentral;
(function (RingCentral) {
    var sdk;
    (function (sdk) {
        var platform;
        (function (platform) {
            var Queue = (function () {
                function Queue(cache, cacheId) {
                    this._cache = cache;
                    this._cacheId = cacheId;
                    this.setPollInterval(250);
                    this.setReleaseTimeout(5000); // If queue was not released then force it to do so after some timeout
                }
                Queue.prototype.isPaused = function () {
                    var storage = this._cache, cacheId = this._cacheId, time = storage.getItem(cacheId);
                    return !!time && Date.now() - parseInt(time) < this._releaseTimeout;
                };
                Queue.prototype.pause = function () {
                    this._cache.setItem(this._cacheId, Date.now());
                    return this;
                };
                Queue.prototype.resume = function () {
                    this._cache.removeItem(this._cacheId);
                    return this;
                };
                Queue.prototype.poll = function () {
                    var _this = this;
                    if (this._promise)
                        return this._promise;
                    this._promise = new sdk.externals._Promise(function (resolve, reject) {
                        sdk.core.utils.poll(function (next) {
                            if (_this.isPaused())
                                return next();
                            _this._promise = null;
                            _this.resume(); // this is actually not needed but why not
                            resolve(null);
                        }, _this._pollInterval);
                    });
                    return this._promise;
                };
                Queue.prototype.releaseTimeout = function () {
                    return this._releaseTimeout;
                };
                Queue.prototype.pollInterval = function () {
                    return this._pollInterval;
                };
                Queue.prototype.setReleaseTimeout = function (releaseTimeout) {
                    this._releaseTimeout = releaseTimeout;
                    return this;
                };
                Queue.prototype.setPollInterval = function (pollInterval) {
                    this._pollInterval = pollInterval;
                    return this;
                };
                return Queue;
            })();
            platform.Queue = Queue;
        })(platform = sdk.platform || (sdk.platform = {}));
    })(sdk = RingCentral.sdk || (RingCentral.sdk = {}));
})(RingCentral || (RingCentral = {}));
/// <reference path="../externals.d.ts" />
/// <reference path="../core/Utils.ts" />
/// <reference path="../core/Observable.ts" />
/// <reference path="../core/Cache.ts" />
/// <reference path="../core/Log" />
/// <reference path="../http/Client.ts" />
/// <reference path="../http/ApiResponse.ts" />
/// <reference path="../externals/Externals.ts" />
/// <reference path="./Queue.ts" />
var RingCentral;
(function (RingCentral) {
    var sdk;
    (function (sdk) {
        var platform;
        (function (platform) {
            var Platform = (function (_super) {
                __extends(Platform, _super);
                function Platform(client, cache, server, appKey, appSecret) {
                    _super.call(this);
                    this._refreshDelayMs = 100;
                    this._clearCacheOnRefreshError = true;
                    this._cacheId = 'platform';
                    this.events = {
                        accessViolation: 'accessViolation',
                        logoutSuccess: 'logoutSuccess',
                        logoutError: 'logoutError',
                        authorizeSuccess: 'authorizeSuccess',
                        authorizeError: 'authorizeError',
                        refreshSuccess: 'refreshSuccess',
                        refreshError: 'refreshError'
                    };
                    this._server = server;
                    this._appKey = appKey;
                    this._appSecret = appSecret;
                    this._cache = cache;
                    this._client = client;
                    this._queue = new platform.Queue(this._cache, this._cacheId + '-refresh');
                    this._auth = new platform.Auth(this._cache, this._cacheId);
                }
                Platform.prototype.auth = function () {
                    return this._auth;
                };
                Platform.prototype.createUrl = function (path, options) {
                    path = path || '';
                    options = options || {};
                    var builtUrl = '', hasHttp = path.indexOf('http://') != -1 || path.indexOf('https://') != -1;
                    if (options.addServer && !hasHttp)
                        builtUrl += this._server;
                    if (path.indexOf(Platform._urlPrefix) == -1 && !hasHttp)
                        builtUrl += Platform._urlPrefix + '/' + Platform._apiVersion;
                    builtUrl += path;
                    if (options.addMethod || options.addToken)
                        builtUrl += (path.indexOf('?') > -1 ? '&' : '?');
                    if (options.addMethod)
                        builtUrl += '_method=' + options.addMethod;
                    if (options.addToken)
                        builtUrl += (options.addMethod ? '&' : '') + 'access_token=' + this._auth.accessToken();
                    return builtUrl;
                };
                Platform.prototype.authUrl = function (options) {
                    options = options || {};
                    return this.createUrl(Platform._authorizeEndpoint + '?' + sdk.core.utils.queryStringify({
                        'response_type': 'code',
                        'redirect_uri': options.redirectUri || '',
                        'client_id': this._appKey,
                        'state': options.state || '',
                        'brand_id': options.brandId || '',
                        'display': options.display || '',
                        'prompt': options.prompt || ''
                    }), { addServer: true });
                };
                Platform.prototype.parseAuthRedirectUrl = function (url) {
                    var qs = sdk.core.utils.parseQueryString(url.split('?').reverse()[0]), error = qs.error_description || qs.error;
                    if (error) {
                        var e = new Error(error);
                        e.error = qs.error;
                        throw e;
                    }
                    return qs;
                };
                Platform.prototype.loggedIn = function () {
                    return this._ensureAuthentication()
                        .then(function () {
                        return true;
                    })
                        .catch(function () {
                        return false;
                    });
                };
                Platform.prototype.login = function (options) {
                    var _this = this;
                    options = options || {};
                    options.remember = options.remember || false;
                    var body = {
                        "access_token_ttl": Platform._accessTokenTtl,
                        "refresh_token_ttl": options.remember ? Platform._refreshTokenTtlRemember : Platform._refreshTokenTtl
                    };
                    if (!options.code) {
                        body.grant_type = 'password';
                        body.username = options.username;
                        body.password = options.password;
                        body.extension = options.extension || '';
                    }
                    else if (options.code) {
                        body.grant_type = 'authorization_code';
                        body.code = options.code;
                        body.redirect_uri = options.redirectUri;
                    }
                    if (options.endpointId)
                        body.endpoint_id = options.endpointId;
                    return this._tokenRequest(Platform._tokenEndpoint, body).then(function (res) {
                        _this._auth
                            .setData(res.json())
                            .setRemember(options.remember);
                        _this.emit(_this.events.authorizeSuccess, res);
                        return res;
                    }).catch(function (e) {
                        _this._cache.clean();
                        _this.emit(_this.events.authorizeError, e);
                        throw e;
                    });
                };
                Platform.prototype.refresh = function () {
                    var _this = this;
                    var refresh = new sdk.externals._Promise(function (resolve, reject) {
                        if (_this._queue.isPaused()) {
                            return resolve(_this._refreshPolling());
                        }
                        _this._queue.pause();
                        // Make sure all existing AJAX calls had a chance to reach the server
                        setTimeout(function () {
                            sdk.core.log.debug('Platform.refresh(): Performing token refresh (access token', _this._auth.accessToken(), ', refresh token', _this._auth.refreshToken(), ')');
                            // Perform sanity checks
                            if (!_this._auth.refreshToken())
                                return reject(new Error('Refresh token is missing'));
                            if (!_this._auth.refreshTokenValid())
                                return reject(new Error('Refresh token has expired'));
                            if (!_this._queue.isPaused())
                                return reject(new Error('Queue was resumed before refresh call'));
                            resolve(_this._tokenRequest(Platform._tokenEndpoint, {
                                "grant_type": "refresh_token",
                                "refresh_token": _this._auth.refreshToken(),
                                "access_token_ttl": Platform._accessTokenTtl,
                                "refresh_token_ttl": _this._auth.remember() ? Platform._refreshTokenTtlRemember : Platform._refreshTokenTtl
                            }));
                        }, _this._refreshDelayMs);
                    });
                    return refresh.then(function (res) {
                        // This means refresh has happened elsewhere and we are here because of timeout
                        if (res && res.json && res.json()) {
                            var json = res.json();
                            sdk.core.log.info('Platform.refresh(): Token was refreshed', res);
                            if (!json.refresh_token || !json.access_token) {
                                throw sdk.http.Client.makeError(new Error('Malformed OAuth response'), res);
                            }
                            _this._auth.setData(json);
                            _this._queue.resume();
                        }
                        _this.emit(_this.events.refreshSuccess, res);
                        return res;
                    }).catch(function (e) {
                        e = sdk.http.Client.makeError(e);
                        if (_this._clearCacheOnRefreshError) {
                            _this._cache.clean();
                        }
                        _this.emit(_this.events.accessViolation, e);
                        _this.emit(_this.events.refreshError, e);
                        throw e;
                    });
                };
                /**
                 * @returns {Promise}
                 */
                Platform.prototype.logout = function () {
                    var _this = this;
                    this._queue.pause();
                    return this._tokenRequest(Platform._revokeEndpoint, {
                        token: this._auth.accessToken()
                    }).then(function (res) {
                        _this._queue.resume();
                        _this._cache.clean();
                        _this.emit(_this.events.logoutSuccess, res);
                        return res;
                    }).catch(function (e) {
                        _this._queue.resume();
                        _this.emit(_this.events.accessViolation, e);
                        _this.emit(_this.events.logoutError, e);
                        throw e;
                    });
                };
                Platform.prototype.inflateRequest = function (request, options) {
                    var _this = this;
                    options = options || {};
                    if (options.skipAuthCheck)
                        return sdk.externals._Promise.resolve(request);
                    return this
                        ._ensureAuthentication()
                        .then(function () {
                        request.headers.set('Authorization', _this._authHeader());
                        request.url = _this.createUrl(request.url, { addServer: true });
                        //TODO Add User-Agent here
                        return request;
                    });
                };
                Platform.prototype.sendRequest = function (request, options) {
                    var _this = this;
                    return this
                        .inflateRequest(request, options)
                        .then(function (req) {
                        return _this._client.sendRequest(req);
                    })
                        .catch(function (e) {
                        // Guard is for errors that come from polling
                        if (!e.apiResponse || !e.apiResponse.response() || (e.apiResponse.response().status != 401))
                            throw e;
                        _this._auth.cancelAccessToken();
                        return _this.sendRequest(request, options);
                    });
                };
                /**
                 * General purpose function to send anything to server
                 */
                Platform.prototype.send = function (url, options) {
                    try {
                        //FIXME https://github.com/bitinn/node-fetch/issues/43
                        url = this.createUrl(url, { addServer: true });
                        return this.sendRequest(sdk.http.Client.createRequest(url, options), options);
                    }
                    catch (e) {
                        return sdk.externals._Promise.reject(e);
                    }
                };
                Platform.prototype.get = function (url, options) {
                    options = options || {};
                    options.method = 'GET';
                    return this.send(url, options);
                };
                Platform.prototype.post = function (url, options) {
                    options = options || {};
                    options.method = 'POST';
                    return this.send(url, options);
                };
                Platform.prototype.put = function (url, options) {
                    options = options || {};
                    options.method = 'PUT';
                    return this.send(url, options);
                };
                Platform.prototype['delete'] = function (url, options) {
                    options = options || {};
                    options.method = 'DELETE';
                    return this.send(url, options);
                };
                Platform.prototype._tokenRequest = function (path, body) {
                    return this.send(path, {
                        skipAuthCheck: true,
                        body: body,
                        method: 'POST',
                        headers: {
                            'Authorization': 'Basic ' + this._apiKey(),
                            'Content-Type': 'application/x-www-form-urlencoded'
                        }
                    });
                };
                Platform.prototype._ensureAuthentication = function () {
                    if (this._isAccessTokenValid())
                        return sdk.externals._Promise.resolve(null);
                    return this.refresh();
                };
                Platform.prototype._isAccessTokenValid = function () {
                    return (this._auth.accessTokenValid() && !this._queue.isPaused());
                };
                Platform.prototype._refreshPolling = function () {
                    var _this = this;
                    sdk.core.log.warn('Platform.refresh(): Refresh is already in progress, polling started');
                    return this._queue.poll().then(function () {
                        if (!_this._isAccessTokenValid()) {
                            throw new Error('Automatic authentification timeout');
                        }
                        return null;
                    });
                };
                Platform.prototype._apiKey = function () {
                    var apiKey = this._appKey + ':' + this._appSecret;
                    return (typeof btoa == 'function') ? btoa(apiKey) : new Buffer(apiKey).toString('base64');
                };
                Platform.prototype._authHeader = function () {
                    var token = this._auth.accessToken();
                    return this._auth.tokenType() + (token ? ' ' + token : '');
                };
                Platform._urlPrefix = '/restapi';
                Platform._apiVersion = 'v1.0';
                Platform._accessTokenTtl = null; // Platform server by default sets it to 60 * 60 = 1 hour
                Platform._refreshTokenTtl = 10 * 60 * 60; // 10 hours
                Platform._refreshTokenTtlRemember = 7 * 24 * 60 * 60; // 1 week
                Platform._tokenEndpoint = '/restapi/oauth/token';
                Platform._revokeEndpoint = '/restapi/oauth/revoke';
                Platform._authorizeEndpoint = '/restapi/oauth/authorize';
                return Platform;
            })(sdk.core.Observable);
            platform.Platform = Platform;
        })(platform = sdk.platform || (sdk.platform = {}));
    })(sdk = RingCentral.sdk || (RingCentral.sdk = {}));
})(RingCentral || (RingCentral = {}));
/// <reference path="../externals.d.ts" />
/// <reference path="../core/Utils.ts" />
/// <reference path="../core/Log.ts" />
/// <reference path="../platform/Platform.ts" />
/// <reference path="../http/ApiResponse.ts" />
/// <reference path="../externals/Externals.ts" />
var RingCentral;
(function (RingCentral) {
    var sdk;
    (function (sdk) {
        var subscription;
        (function (subscription_1) {
            var Subscription = (function (_super) {
                __extends(Subscription, _super);
                function Subscription(pubnubFactory, platform) {
                    _super.call(this);
                    this._renewHandicapMs = 2 * 60 * 1000;
                    this.events = {
                        notification: 'notification',
                        removeSuccess: 'removeSuccess',
                        removeError: 'removeError',
                        renewSuccess: 'renewSuccess',
                        renewError: 'renewError',
                        subscribeSuccess: 'subscribeSuccess',
                        subscribeError: 'subscribeError'
                    };
                    this._pubnubFactory = pubnubFactory;
                    this._platform = platform;
                    this._pubnub = null;
                    this._eventFilters = [];
                    this._timeout = null;
                    this._subscription = null;
                }
                Subscription.prototype.alive = function () {
                    return this._subscription &&
                        this._subscription.id &&
                        this._subscription.deliveryMode &&
                        this._subscription.deliveryMode.subscriberKey &&
                        this._subscription.deliveryMode.address;
                };
                Subscription.prototype.setSubscription = function (subscription) {
                    this._clearTimeout();
                    this._subscription = subscription;
                    if (!this._pubnub)
                        this._subscribeAtPubnub();
                    this._setTimeout();
                    return this;
                };
                Subscription.prototype.subscription = function () {
                    return this._subscription;
                };
                /**
                 * Creates or updates subscription if there is an active one
                 * @param {{events?:string[]}} [options] New array of events
                 * @returns {Promise}
                 */
                Subscription.prototype.register = function (options) {
                    if (this.alive()) {
                        return this.renew(options);
                    }
                    else {
                        return this.subscribe(options);
                    }
                };
                Subscription.prototype.addEvents = function (events) {
                    this._eventFilters = this._eventFilters.concat(events);
                    return this;
                };
                Subscription.prototype.setEvents = function (events) {
                    this._eventFilters = events;
                    return this;
                };
                Subscription.prototype.subscribe = function (options) {
                    var _this = this;
                    options = options || {};
                    if (options.events)
                        this.setEvents(options.events);
                    this._clearTimeout();
                    return new sdk.externals._Promise(function (resolve, reject) {
                        if (!_this._eventFilters || !_this._eventFilters.length)
                            throw new Error('Events are undefined');
                        resolve(_this._platform.post('/restapi/v1.0/subscription', {
                            body: {
                                eventFilters: _this._getFullEventFilters(),
                                deliveryMode: {
                                    transportType: 'PubNub'
                                }
                            }
                        }));
                    }).then(function (ajax) {
                        _this.setSubscription(ajax.json())
                            .emit(_this.events.subscribeSuccess, ajax);
                        return ajax;
                    }).catch(function (e) {
                        e = sdk.http.Client.makeError(e);
                        _this.reset()
                            .emit(_this.events.subscribeError, e);
                        throw e;
                    });
                };
                Subscription.prototype.renew = function (options) {
                    var _this = this;
                    options = options || {};
                    if (options.events)
                        this.setEvents(options.events);
                    this._clearTimeout();
                    return new sdk.externals._Promise(function (resolve, reject) {
                        if (!_this.alive())
                            throw new Error('Subscription is not alive');
                        if (!_this._eventFilters || !_this._eventFilters.length)
                            throw new Error('Events are undefined');
                        return _this._platform.put('/restapi/v1.0/subscription/' + _this._subscription.id, {
                            body: {
                                eventFilters: _this._getFullEventFilters()
                            }
                        });
                    })
                        .then(function (ajax) {
                        _this.setSubscription(ajax.json())
                            .emit(_this.events.renewSuccess, ajax.json());
                        return ajax;
                    })
                        .catch(function (e) {
                        e = sdk.http.Client.makeError(e);
                        _this.reset()
                            .emit(_this.events.renewError, e);
                        throw e;
                    });
                };
                Subscription.prototype.remove = function () {
                    var _this = this;
                    return new sdk.externals._Promise(function (resolve, reject) {
                        if (!_this._subscription || !_this._subscription.id)
                            throw new Error('Subscription ID is required');
                        resolve(_this._platform.delete('/restapi/v1.0/subscription/' + _this._subscription.id));
                    }).then(function (ajax) {
                        _this.reset()
                            .emit(_this.events.removeSuccess, ajax);
                        return ajax;
                    }).catch(function (e) {
                        e = sdk.http.Client.makeError(e);
                        _this.emit(_this.events.removeError, e);
                        throw e;
                    });
                };
                /**
                 * Remove subscription and disconnect from PUBNUB
                 * This method resets subscription at client side but backend is not notified
                 */
                Subscription.prototype.reset = function () {
                    this._clearTimeout();
                    if (this.alive() && this._pubnub)
                        this._pubnub.unsubscribe({ channel: this._subscription.deliveryMode.address });
                    this._subscription = null;
                    return this;
                };
                Subscription.prototype.destroy = function () {
                    this.reset();
                    sdk.core.log.info('RC.subscription.Subscription: Destroyed');
                    return _super.prototype.destroy.call(this);
                };
                Subscription.prototype._getFullEventFilters = function () {
                    var _this = this;
                    return this._eventFilters.map(function (event) {
                        return _this._platform.createUrl(event);
                    });
                };
                Subscription.prototype._setTimeout = function () {
                    var _this = this;
                    this._clearTimeout();
                    if (!this.alive())
                        throw new Error('Subscription is not alive');
                    var timeToExpiration = (this._subscription.expiresIn * 1000) - this._renewHandicapMs;
                    this._timeout = setTimeout(function () {
                        _this.renew({});
                    }, timeToExpiration);
                    return this;
                };
                Subscription.prototype._clearTimeout = function () {
                    clearTimeout(this._timeout);
                    return this;
                };
                Subscription.prototype._decrypt = function (message) {
                    if (!this.alive())
                        throw new Error('Subscription is not alive');
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
                };
                Subscription.prototype._notify = function (message) {
                    this.emit(this.events.notification, this._decrypt(message));
                    return this;
                };
                Subscription.prototype._subscribeAtPubnub = function () {
                    var _this = this;
                    if (!this.alive())
                        throw new Error('Subscription is not alive');
                    var PUBNUB = this._pubnubFactory.getPubnub();
                    this._pubnub = PUBNUB.init({
                        ssl: true,
                        subscribe_key: this._subscription.deliveryMode.subscriberKey
                    });
                    this._pubnub.ready();
                    this._pubnub.subscribe({
                        channel: this._subscription.deliveryMode.address,
                        message: function (message, env, channel) {
                            sdk.core.log.info('RC.core.Subscription: Incoming message', message);
                            _this._notify(message);
                        },
                        connect: function () {
                            sdk.core.log.info('RC.core.Subscription: PUBNUB connected');
                        }
                    });
                    return this;
                };
                return Subscription;
            })(sdk.core.Observable);
            subscription_1.Subscription = Subscription;
        })(subscription = sdk.subscription || (sdk.subscription = {}));
    })(sdk = RingCentral.sdk || (RingCentral.sdk = {}));
})(RingCentral || (RingCentral = {}));
/// <reference path="../externals.d.ts" />
/// <reference path="../core/Observable.ts" />
/// <reference path="../externals/Externals.ts" />
var RingCentral;
(function (RingCentral) {
    var sdk;
    (function (sdk) {
        var pubnub;
        (function (pubnub) {
            var PubnubMock = (function (_super) {
                __extends(PubnubMock, _super);
                function PubnubMock(options) {
                    _super.call(this);
                    this.options = options;
                    this.crypto_obj = sdk.externals._PUBNUB.crypto_obj;
                }
                PubnubMock.prototype.ready = function () { };
                PubnubMock.prototype.subscribe = function (options) {
                    this.on('message-' + options.channel, options.message);
                };
                PubnubMock.prototype.unsubscribe = function (options) {
                    this.off('message-' + options.channel);
                };
                PubnubMock.prototype.receiveMessage = function (msg, channel) {
                    this.emit('message-' + channel, msg, 'env', channel);
                };
                return PubnubMock;
            })(sdk.core.Observable);
            pubnub.PubnubMock = PubnubMock;
            var PubnubMockFactory = (function () {
                function PubnubMockFactory() {
                    this.crypto_obj = sdk.externals._PUBNUB.crypto_obj;
                }
                PubnubMockFactory.prototype.init = function (options) {
                    return new PubnubMock(options);
                };
                return PubnubMockFactory;
            })();
            pubnub.PubnubMockFactory = PubnubMockFactory;
        })(pubnub = sdk.pubnub || (sdk.pubnub = {}));
    })(sdk = RingCentral.sdk || (RingCentral.sdk = {}));
})(RingCentral || (RingCentral = {}));
/// <reference path="../pubnub/PubnubMock.ts" />
/// <reference path="../externals/Externals.ts" />
var RingCentral;
(function (RingCentral) {
    var sdk;
    (function (sdk) {
        var pubnub;
        (function (pubnub) {
            var PubnubFactory = (function () {
                function PubnubFactory(flag) {
                    this._useMock = false;
                    this._useMock = !!flag;
                    this._mock = new pubnub.PubnubMockFactory();
                }
                PubnubFactory.prototype.getPubnub = function () {
                    return this._useMock ? this._mock : sdk.externals._PUBNUB;
                };
                return PubnubFactory;
            })();
            pubnub.PubnubFactory = PubnubFactory;
        })(pubnub = sdk.pubnub || (sdk.pubnub = {}));
    })(sdk = RingCentral.sdk || (RingCentral.sdk = {}));
})(RingCentral || (RingCentral = {}));
/// <reference path="./externals.d.ts" />
/// <reference path="./core/Cache.ts" />
/// <reference path="./core/Log.ts" />
/// <reference path="./core/Observable.ts" />
/// <reference path="./core/PageVisibility.ts" />
/// <reference path="./core/Utils.ts" />
/// <reference path="./http/Client.ts" />
/// <reference path="./platform/Platform.ts" />
/// <reference path="./platform/Queue.ts" />
/// <reference path="./subscription/Subscription.ts" />
/// <reference path="./pubnub/PubnubFactory.ts" />
/// <reference path="./externals/Externals.ts" />
var RingCentral;
(function (RingCentral) {
    var sdk;
    (function (sdk) {
        var SDK = (function () {
            function SDK(options) {
                options = options || {};
                sdk.externals.get();
                this._mockRegistry = new sdk.mocks.Registry();
                this._cache = new sdk.core.Cache(typeof localStorage !== 'undefined' ? localStorage : {}, options.cachePrefix);
                this._client = options.useHttpMock ? new sdk.http.ClientMock(this._mockRegistry) : new sdk.http.Client();
                this._platform = new sdk.platform.Platform(this._client, this._cache, options.server, options.appKey, options.appSecret);
                this._pubnubFactory = new sdk.pubnub.PubnubFactory(options.usePubnubMock);
                //TODO Link Platform events with Subscriptions and the rest
            }
            SDK.prototype.platform = function () {
                return this._platform;
            };
            SDK.prototype.cache = function () {
                return this._cache;
            };
            SDK.prototype.createSubscription = function () {
                return new sdk.subscription.Subscription(this._pubnubFactory, this._platform);
            };
            SDK.prototype.createPageVisibility = function () {
                return new sdk.core.PageVisibility();
            };
            SDK.prototype.createObservable = function () {
                return new sdk.core.Observable();
            };
            SDK.prototype.log = function () {
                return sdk.core.log;
            };
            SDK.prototype.utils = function () {
                return sdk.core.utils;
            };
            SDK.prototype.mockRegistry = function () { return this._mockRegistry; };
            SDK.version = '2.0.0';
            SDK.server = {
                sandbox: 'https://platform.devtest.ringcentral.com',
                production: 'https://platform.ringcentral.com'
            };
            return SDK;
        })();
        sdk.SDK = SDK;
    })(sdk = RingCentral.sdk || (RingCentral.sdk = {}));
})(RingCentral || (RingCentral = {}));
var e = RingCentral.sdk.externals.get();
if (typeof define === 'function' && define.amd) {
    define(['pubnub'], function (PUBNUB) {
        e._PUBNUB = PUBNUB;
        return RingCentral.sdk;
    });
}
else if (typeof module === 'object' && module.exports) {
    e._PUBNUB = require('pubnub');
    e._Promise = typeof (Promise) !== 'undefined' ? Promise : require('es6-promise').Promise;
    e._fetch = require('node-fetch');
    e._Request = e._fetch['Request'];
    e._Response = e._fetch['Response'];
    e._Headers = e._fetch['Headers'];
    module.exports = RingCentral.sdk;
}
else {
}
/// <reference path="../externals.d.ts" />
/// <reference path="../core/Utils.ts" />
/// <reference path="../core/Observable.ts" />
/// <reference path="../mocks/Registry.ts" />
/// <reference path="../externals/Externals.ts" />
/// <reference path="./ApiResponse.ts" />
var RingCentral;
(function (RingCentral) {
    var sdk;
    (function (sdk) {
        var http;
        (function (http) {
            var ClientMock = (function (_super) {
                __extends(ClientMock, _super);
                function ClientMock(registry) {
                    _super.call(this);
                    this._registry = registry;
                }
                ClientMock.prototype._loadResponse = function (request) {
                    var _this = this;
                    return new sdk.externals._Promise(function (resolve) {
                        sdk.core.log.debug('API REQUEST', request.method, request.url);
                        var mock = _this._registry.find(request);
                        resolve(mock.getResponse(request));
                    });
                };
                return ClientMock;
            })(http.Client);
            http.ClientMock = ClientMock;
        })(http = sdk.http || (sdk.http = {}));
    })(sdk = RingCentral.sdk || (RingCentral.sdk = {}));
})(RingCentral || (RingCentral = {}));
/// <reference path="../externals.d.ts" />
/// <reference path="../core/Utils.ts" />
/// <reference path="../core/Observable.ts" />
/// <reference path="../core/Cache.ts" />
/// <reference path="../core/Log" />
/// <reference path="../http/Client.ts" />
/// <reference path="../http/ApiResponse.ts" />
/// <reference path="../externals/Externals.ts" />
/// <reference path="./Queue.ts" />
var RingCentral;
(function (RingCentral) {
    var sdk;
    (function (sdk) {
        var platform;
        (function (platform) {
            var Auth = (function () {
                function Auth(cache, cacheId) {
                    this._cache = cache;
                    this._cacheId = cacheId;
                }
                Auth.prototype.accessToken = function () {
                    return this.data().access_token;
                };
                Auth.prototype.refreshToken = function () {
                    return this.data().refresh_token;
                };
                Auth.prototype.tokenType = function () {
                    return this.data().token_type;
                };
                Auth.prototype.data = function () {
                    return this._cache.getItem(this._cacheId) || {
                        token_type: '',
                        access_token: '',
                        expires_in: 0,
                        refresh_token: '',
                        refresh_token_expires_in: 0
                    };
                };
                Auth.prototype.setData = function (authData) {
                    var oldAuthData = this.data();
                    authData = sdk.core.utils.extend({}, oldAuthData, authData);
                    authData.expire_time = Date.now() + (authData.expires_in * 1000);
                    authData.refresh_token_expire_time = Date.now() + (authData.refresh_token_expires_in * 1000);
                    sdk.core.log.info('Auth.setData(): Tokens were updated, new:', authData, ', old:', oldAuthData);
                    this._cache.setItem(this._cacheId, authData);
                    return this;
                };
                /**
                 * Check if there is a valid (not expired) access token
                 */
                Auth.prototype.accessTokenValid = function () {
                    var authData = this.data();
                    return (authData.token_type === Auth.forcedTokenType || (authData.expire_time - Auth.refreshHandicapMs > Date.now()));
                };
                /**
                 * Check if there is a valid (not expired) access token
                 */
                Auth.prototype.refreshTokenValid = function () {
                    return (this.data().refresh_token_expire_time > Date.now());
                };
                Auth.prototype.cancelAccessToken = function () {
                    return this.setData({
                        access_token: '',
                        expires_in: 0
                    });
                };
                /**
                 * This method sets a special authentication mode used in Service Web
                 * @return {Platform}
                 */
                Auth.prototype.forceAuthentication = function () {
                    this.setData({
                        token_type: Auth.forcedTokenType,
                        access_token: '',
                        expires_in: 0,
                        refresh_token: '',
                        refresh_token_expires_in: 0
                    });
                    return this;
                };
                Auth.prototype.setRemember = function (remember) {
                    return this.setData({ remember: remember });
                };
                Auth.prototype.remember = function () {
                    return !!this.data().remember;
                };
                Auth.refreshHandicapMs = 60 * 1000; // 1 minute
                Auth.forcedTokenType = 'forced';
                return Auth;
            })();
            platform.Auth = Auth;
        })(platform = sdk.platform || (sdk.platform = {}));
    })(sdk = RingCentral.sdk || (RingCentral.sdk = {}));
})(RingCentral || (RingCentral = {}));

/*!
 * @overview es6-promise - a tiny implementation of Promises/A+.
 * @copyright Copyright (c) 2014 Yehuda Katz, Tom Dale, Stefan Penner and contributors (Conversion to ES6 API by Jake Archibald)
 * @license   Licensed under MIT license
 *            See https://raw.githubusercontent.com/jakearchibald/es6-promise/master/LICENSE
 * @version   2.2.0
 */

(function() {
    "use strict";
    function lib$es6$promise$utils$$objectOrFunction(x) {
      return typeof x === 'function' || (typeof x === 'object' && x !== null);
    }

    function lib$es6$promise$utils$$isFunction(x) {
      return typeof x === 'function';
    }

    function lib$es6$promise$utils$$isMaybeThenable(x) {
      return typeof x === 'object' && x !== null;
    }

    var lib$es6$promise$utils$$_isArray;
    if (!Array.isArray) {
      lib$es6$promise$utils$$_isArray = function (x) {
        return Object.prototype.toString.call(x) === '[object Array]';
      };
    } else {
      lib$es6$promise$utils$$_isArray = Array.isArray;
    }

    var lib$es6$promise$utils$$isArray = lib$es6$promise$utils$$_isArray;
    var lib$es6$promise$asap$$len = 0;
    var lib$es6$promise$asap$$toString = {}.toString;
    var lib$es6$promise$asap$$vertxNext;
    var lib$es6$promise$asap$$customSchedulerFn;

    function lib$es6$promise$asap$$asap(callback, arg) {
      lib$es6$promise$asap$$queue[lib$es6$promise$asap$$len] = callback;
      lib$es6$promise$asap$$queue[lib$es6$promise$asap$$len + 1] = arg;
      lib$es6$promise$asap$$len += 2;
      if (lib$es6$promise$asap$$len === 2) {
        // If len is 2, that means that we need to schedule an async flush.
        // If additional callbacks are queued before the queue is flushed, they
        // will be processed by this flush that we are scheduling.
        if (lib$es6$promise$asap$$customSchedulerFn) {
          lib$es6$promise$asap$$customSchedulerFn(lib$es6$promise$asap$$flush);
        } else {
          lib$es6$promise$asap$$scheduleFlush();
        }
      }
    }

    var lib$es6$promise$asap$$default = lib$es6$promise$asap$$asap;
    function lib$es6$promise$asap$$setScheduler(scheduleFn) {
      lib$es6$promise$asap$$customSchedulerFn = scheduleFn;
    }

    var lib$es6$promise$asap$$browserWindow = (typeof window !== 'undefined') ? window : undefined;
    var lib$es6$promise$asap$$browserGlobal = lib$es6$promise$asap$$browserWindow || {};
    var lib$es6$promise$asap$$BrowserMutationObserver = lib$es6$promise$asap$$browserGlobal.MutationObserver || lib$es6$promise$asap$$browserGlobal.WebKitMutationObserver;
    var lib$es6$promise$asap$$isNode = typeof process !== 'undefined' && {}.toString.call(process) === '[object process]';

    // test for web worker but not in IE10
    var lib$es6$promise$asap$$isWorker = typeof Uint8ClampedArray !== 'undefined' &&
      typeof importScripts !== 'undefined' &&
      typeof MessageChannel !== 'undefined';

    // node
    function lib$es6$promise$asap$$useNextTick() {
      var nextTick = process.nextTick;
      // node version 0.10.x displays a deprecation warning when nextTick is used recursively
      // setImmediate should be used instead instead
      var version = process.versions.node.match(/^(?:(\d+)\.)?(?:(\d+)\.)?(\*|\d+)$/);
      if (Array.isArray(version) && version[1] === '0' && version[2] === '10') {
        nextTick = setImmediate;
      }
      return function() {
        nextTick(lib$es6$promise$asap$$flush);
      };
    }

    // vertx
    function lib$es6$promise$asap$$useVertxTimer() {
      return function() {
        lib$es6$promise$asap$$vertxNext(lib$es6$promise$asap$$flush);
      };
    }

    function lib$es6$promise$asap$$useMutationObserver() {
      var iterations = 0;
      var observer = new lib$es6$promise$asap$$BrowserMutationObserver(lib$es6$promise$asap$$flush);
      var node = document.createTextNode('');
      observer.observe(node, { characterData: true });

      return function() {
        node.data = (iterations = ++iterations % 2);
      };
    }

    // web worker
    function lib$es6$promise$asap$$useMessageChannel() {
      var channel = new MessageChannel();
      channel.port1.onmessage = lib$es6$promise$asap$$flush;
      return function () {
        channel.port2.postMessage(0);
      };
    }

    function lib$es6$promise$asap$$useSetTimeout() {
      return function() {
        setTimeout(lib$es6$promise$asap$$flush, 1);
      };
    }

    var lib$es6$promise$asap$$queue = new Array(1000);
    function lib$es6$promise$asap$$flush() {
      for (var i = 0; i < lib$es6$promise$asap$$len; i+=2) {
        var callback = lib$es6$promise$asap$$queue[i];
        var arg = lib$es6$promise$asap$$queue[i+1];

        callback(arg);

        lib$es6$promise$asap$$queue[i] = undefined;
        lib$es6$promise$asap$$queue[i+1] = undefined;
      }

      lib$es6$promise$asap$$len = 0;
    }

    function lib$es6$promise$asap$$attemptVertex() {
      try {
        var r = require;
        var vertx = r('vertx');
        lib$es6$promise$asap$$vertxNext = vertx.runOnLoop || vertx.runOnContext;
        return lib$es6$promise$asap$$useVertxTimer();
      } catch(e) {
        return lib$es6$promise$asap$$useSetTimeout();
      }
    }

    var lib$es6$promise$asap$$scheduleFlush;
    // Decide what async method to use to triggering processing of queued callbacks:
    if (lib$es6$promise$asap$$isNode) {
      lib$es6$promise$asap$$scheduleFlush = lib$es6$promise$asap$$useNextTick();
    } else if (lib$es6$promise$asap$$BrowserMutationObserver) {
      lib$es6$promise$asap$$scheduleFlush = lib$es6$promise$asap$$useMutationObserver();
    } else if (lib$es6$promise$asap$$isWorker) {
      lib$es6$promise$asap$$scheduleFlush = lib$es6$promise$asap$$useMessageChannel();
    } else if (lib$es6$promise$asap$$browserWindow === undefined && typeof require === 'function') {
      lib$es6$promise$asap$$scheduleFlush = lib$es6$promise$asap$$attemptVertex();
    } else {
      lib$es6$promise$asap$$scheduleFlush = lib$es6$promise$asap$$useSetTimeout();
    }

    function lib$es6$promise$$internal$$noop() {}

    var lib$es6$promise$$internal$$PENDING   = void 0;
    var lib$es6$promise$$internal$$FULFILLED = 1;
    var lib$es6$promise$$internal$$REJECTED  = 2;

    var lib$es6$promise$$internal$$GET_THEN_ERROR = new lib$es6$promise$$internal$$ErrorObject();

    function lib$es6$promise$$internal$$selfFullfillment() {
      return new TypeError("You cannot resolve a promise with itself");
    }

    function lib$es6$promise$$internal$$cannotReturnOwn() {
      return new TypeError('A promises callback cannot return that same promise.');
    }

    function lib$es6$promise$$internal$$getThen(promise) {
      try {
        return promise.then;
      } catch(error) {
        lib$es6$promise$$internal$$GET_THEN_ERROR.error = error;
        return lib$es6$promise$$internal$$GET_THEN_ERROR;
      }
    }

    function lib$es6$promise$$internal$$tryThen(then, value, fulfillmentHandler, rejectionHandler) {
      try {
        then.call(value, fulfillmentHandler, rejectionHandler);
      } catch(e) {
        return e;
      }
    }

    function lib$es6$promise$$internal$$handleForeignThenable(promise, thenable, then) {
       lib$es6$promise$asap$$default(function(promise) {
        var sealed = false;
        var error = lib$es6$promise$$internal$$tryThen(then, thenable, function(value) {
          if (sealed) { return; }
          sealed = true;
          if (thenable !== value) {
            lib$es6$promise$$internal$$resolve(promise, value);
          } else {
            lib$es6$promise$$internal$$fulfill(promise, value);
          }
        }, function(reason) {
          if (sealed) { return; }
          sealed = true;

          lib$es6$promise$$internal$$reject(promise, reason);
        }, 'Settle: ' + (promise._label || ' unknown promise'));

        if (!sealed && error) {
          sealed = true;
          lib$es6$promise$$internal$$reject(promise, error);
        }
      }, promise);
    }

    function lib$es6$promise$$internal$$handleOwnThenable(promise, thenable) {
      if (thenable._state === lib$es6$promise$$internal$$FULFILLED) {
        lib$es6$promise$$internal$$fulfill(promise, thenable._result);
      } else if (thenable._state === lib$es6$promise$$internal$$REJECTED) {
        lib$es6$promise$$internal$$reject(promise, thenable._result);
      } else {
        lib$es6$promise$$internal$$subscribe(thenable, undefined, function(value) {
          lib$es6$promise$$internal$$resolve(promise, value);
        }, function(reason) {
          lib$es6$promise$$internal$$reject(promise, reason);
        });
      }
    }

    function lib$es6$promise$$internal$$handleMaybeThenable(promise, maybeThenable) {
      if (maybeThenable.constructor === promise.constructor) {
        lib$es6$promise$$internal$$handleOwnThenable(promise, maybeThenable);
      } else {
        var then = lib$es6$promise$$internal$$getThen(maybeThenable);

        if (then === lib$es6$promise$$internal$$GET_THEN_ERROR) {
          lib$es6$promise$$internal$$reject(promise, lib$es6$promise$$internal$$GET_THEN_ERROR.error);
        } else if (then === undefined) {
          lib$es6$promise$$internal$$fulfill(promise, maybeThenable);
        } else if (lib$es6$promise$utils$$isFunction(then)) {
          lib$es6$promise$$internal$$handleForeignThenable(promise, maybeThenable, then);
        } else {
          lib$es6$promise$$internal$$fulfill(promise, maybeThenable);
        }
      }
    }

    function lib$es6$promise$$internal$$resolve(promise, value) {
      if (promise === value) {
        lib$es6$promise$$internal$$reject(promise, lib$es6$promise$$internal$$selfFullfillment());
      } else if (lib$es6$promise$utils$$objectOrFunction(value)) {
        lib$es6$promise$$internal$$handleMaybeThenable(promise, value);
      } else {
        lib$es6$promise$$internal$$fulfill(promise, value);
      }
    }

    function lib$es6$promise$$internal$$publishRejection(promise) {
      if (promise._onerror) {
        promise._onerror(promise._result);
      }

      lib$es6$promise$$internal$$publish(promise);
    }

    function lib$es6$promise$$internal$$fulfill(promise, value) {
      if (promise._state !== lib$es6$promise$$internal$$PENDING) { return; }

      promise._result = value;
      promise._state = lib$es6$promise$$internal$$FULFILLED;

      if (promise._subscribers.length !== 0) {
        lib$es6$promise$asap$$default(lib$es6$promise$$internal$$publish, promise);
      }
    }

    function lib$es6$promise$$internal$$reject(promise, reason) {
      if (promise._state !== lib$es6$promise$$internal$$PENDING) { return; }
      promise._state = lib$es6$promise$$internal$$REJECTED;
      promise._result = reason;

      lib$es6$promise$asap$$default(lib$es6$promise$$internal$$publishRejection, promise);
    }

    function lib$es6$promise$$internal$$subscribe(parent, child, onFulfillment, onRejection) {
      var subscribers = parent._subscribers;
      var length = subscribers.length;

      parent._onerror = null;

      subscribers[length] = child;
      subscribers[length + lib$es6$promise$$internal$$FULFILLED] = onFulfillment;
      subscribers[length + lib$es6$promise$$internal$$REJECTED]  = onRejection;

      if (length === 0 && parent._state) {
        lib$es6$promise$asap$$default(lib$es6$promise$$internal$$publish, parent);
      }
    }

    function lib$es6$promise$$internal$$publish(promise) {
      var subscribers = promise._subscribers;
      var settled = promise._state;

      if (subscribers.length === 0) { return; }

      var child, callback, detail = promise._result;

      for (var i = 0; i < subscribers.length; i += 3) {
        child = subscribers[i];
        callback = subscribers[i + settled];

        if (child) {
          lib$es6$promise$$internal$$invokeCallback(settled, child, callback, detail);
        } else {
          callback(detail);
        }
      }

      promise._subscribers.length = 0;
    }

    function lib$es6$promise$$internal$$ErrorObject() {
      this.error = null;
    }

    var lib$es6$promise$$internal$$TRY_CATCH_ERROR = new lib$es6$promise$$internal$$ErrorObject();

    function lib$es6$promise$$internal$$tryCatch(callback, detail) {
      try {
        return callback(detail);
      } catch(e) {
        lib$es6$promise$$internal$$TRY_CATCH_ERROR.error = e;
        return lib$es6$promise$$internal$$TRY_CATCH_ERROR;
      }
    }

    function lib$es6$promise$$internal$$invokeCallback(settled, promise, callback, detail) {
      var hasCallback = lib$es6$promise$utils$$isFunction(callback),
          value, error, succeeded, failed;

      if (hasCallback) {
        value = lib$es6$promise$$internal$$tryCatch(callback, detail);

        if (value === lib$es6$promise$$internal$$TRY_CATCH_ERROR) {
          failed = true;
          error = value.error;
          value = null;
        } else {
          succeeded = true;
        }

        if (promise === value) {
          lib$es6$promise$$internal$$reject(promise, lib$es6$promise$$internal$$cannotReturnOwn());
          return;
        }

      } else {
        value = detail;
        succeeded = true;
      }

      if (promise._state !== lib$es6$promise$$internal$$PENDING) {
        // noop
      } else if (hasCallback && succeeded) {
        lib$es6$promise$$internal$$resolve(promise, value);
      } else if (failed) {
        lib$es6$promise$$internal$$reject(promise, error);
      } else if (settled === lib$es6$promise$$internal$$FULFILLED) {
        lib$es6$promise$$internal$$fulfill(promise, value);
      } else if (settled === lib$es6$promise$$internal$$REJECTED) {
        lib$es6$promise$$internal$$reject(promise, value);
      }
    }

    function lib$es6$promise$$internal$$initializePromise(promise, resolver) {
      try {
        resolver(function resolvePromise(value){
          lib$es6$promise$$internal$$resolve(promise, value);
        }, function rejectPromise(reason) {
          lib$es6$promise$$internal$$reject(promise, reason);
        });
      } catch(e) {
        lib$es6$promise$$internal$$reject(promise, e);
      }
    }

    function lib$es6$promise$enumerator$$Enumerator(Constructor, input) {
      var enumerator = this;

      enumerator._instanceConstructor = Constructor;
      enumerator.promise = new Constructor(lib$es6$promise$$internal$$noop);

      if (enumerator._validateInput(input)) {
        enumerator._input     = input;
        enumerator.length     = input.length;
        enumerator._remaining = input.length;

        enumerator._init();

        if (enumerator.length === 0) {
          lib$es6$promise$$internal$$fulfill(enumerator.promise, enumerator._result);
        } else {
          enumerator.length = enumerator.length || 0;
          enumerator._enumerate();
          if (enumerator._remaining === 0) {
            lib$es6$promise$$internal$$fulfill(enumerator.promise, enumerator._result);
          }
        }
      } else {
        lib$es6$promise$$internal$$reject(enumerator.promise, enumerator._validationError());
      }
    }

    lib$es6$promise$enumerator$$Enumerator.prototype._validateInput = function(input) {
      return lib$es6$promise$utils$$isArray(input);
    };

    lib$es6$promise$enumerator$$Enumerator.prototype._validationError = function() {
      return new Error('Array Methods must be provided an Array');
    };

    lib$es6$promise$enumerator$$Enumerator.prototype._init = function() {
      this._result = new Array(this.length);
    };

    var lib$es6$promise$enumerator$$default = lib$es6$promise$enumerator$$Enumerator;

    lib$es6$promise$enumerator$$Enumerator.prototype._enumerate = function() {
      var enumerator = this;

      var length  = enumerator.length;
      var promise = enumerator.promise;
      var input   = enumerator._input;

      for (var i = 0; promise._state === lib$es6$promise$$internal$$PENDING && i < length; i++) {
        enumerator._eachEntry(input[i], i);
      }
    };

    lib$es6$promise$enumerator$$Enumerator.prototype._eachEntry = function(entry, i) {
      var enumerator = this;
      var c = enumerator._instanceConstructor;

      if (lib$es6$promise$utils$$isMaybeThenable(entry)) {
        if (entry.constructor === c && entry._state !== lib$es6$promise$$internal$$PENDING) {
          entry._onerror = null;
          enumerator._settledAt(entry._state, i, entry._result);
        } else {
          enumerator._willSettleAt(c.resolve(entry), i);
        }
      } else {
        enumerator._remaining--;
        enumerator._result[i] = entry;
      }
    };

    lib$es6$promise$enumerator$$Enumerator.prototype._settledAt = function(state, i, value) {
      var enumerator = this;
      var promise = enumerator.promise;

      if (promise._state === lib$es6$promise$$internal$$PENDING) {
        enumerator._remaining--;

        if (state === lib$es6$promise$$internal$$REJECTED) {
          lib$es6$promise$$internal$$reject(promise, value);
        } else {
          enumerator._result[i] = value;
        }
      }

      if (enumerator._remaining === 0) {
        lib$es6$promise$$internal$$fulfill(promise, enumerator._result);
      }
    };

    lib$es6$promise$enumerator$$Enumerator.prototype._willSettleAt = function(promise, i) {
      var enumerator = this;

      lib$es6$promise$$internal$$subscribe(promise, undefined, function(value) {
        enumerator._settledAt(lib$es6$promise$$internal$$FULFILLED, i, value);
      }, function(reason) {
        enumerator._settledAt(lib$es6$promise$$internal$$REJECTED, i, reason);
      });
    };
    function lib$es6$promise$promise$all$$all(entries) {
      return new lib$es6$promise$enumerator$$default(this, entries).promise;
    }
    var lib$es6$promise$promise$all$$default = lib$es6$promise$promise$all$$all;
    function lib$es6$promise$promise$race$$race(entries) {
      /*jshint validthis:true */
      var Constructor = this;

      var promise = new Constructor(lib$es6$promise$$internal$$noop);

      if (!lib$es6$promise$utils$$isArray(entries)) {
        lib$es6$promise$$internal$$reject(promise, new TypeError('You must pass an array to race.'));
        return promise;
      }

      var length = entries.length;

      function onFulfillment(value) {
        lib$es6$promise$$internal$$resolve(promise, value);
      }

      function onRejection(reason) {
        lib$es6$promise$$internal$$reject(promise, reason);
      }

      for (var i = 0; promise._state === lib$es6$promise$$internal$$PENDING && i < length; i++) {
        lib$es6$promise$$internal$$subscribe(Constructor.resolve(entries[i]), undefined, onFulfillment, onRejection);
      }

      return promise;
    }
    var lib$es6$promise$promise$race$$default = lib$es6$promise$promise$race$$race;
    function lib$es6$promise$promise$resolve$$resolve(object) {
      /*jshint validthis:true */
      var Constructor = this;

      if (object && typeof object === 'object' && object.constructor === Constructor) {
        return object;
      }

      var promise = new Constructor(lib$es6$promise$$internal$$noop);
      lib$es6$promise$$internal$$resolve(promise, object);
      return promise;
    }
    var lib$es6$promise$promise$resolve$$default = lib$es6$promise$promise$resolve$$resolve;
    function lib$es6$promise$promise$reject$$reject(reason) {
      /*jshint validthis:true */
      var Constructor = this;
      var promise = new Constructor(lib$es6$promise$$internal$$noop);
      lib$es6$promise$$internal$$reject(promise, reason);
      return promise;
    }
    var lib$es6$promise$promise$reject$$default = lib$es6$promise$promise$reject$$reject;

    var lib$es6$promise$promise$$counter = 0;

    function lib$es6$promise$promise$$needsResolver() {
      throw new TypeError('You must pass a resolver function as the first argument to the promise constructor');
    }

    function lib$es6$promise$promise$$needsNew() {
      throw new TypeError("Failed to construct 'Promise': Please use the 'new' operator, this object constructor cannot be called as a function.");
    }

    var lib$es6$promise$promise$$default = lib$es6$promise$promise$$Promise;
    /**
      Promise objects represent the eventual result of an asynchronous operation. The
      primary way of interacting with a promise is through its `then` method, which
      registers callbacks to receive either a promise’s eventual value or the reason
      why the promise cannot be fulfilled.

      Terminology
      -----------

      - `promise` is an object or function with a `then` method whose behavior conforms to this specification.
      - `thenable` is an object or function that defines a `then` method.
      - `value` is any legal JavaScript value (including undefined, a thenable, or a promise).
      - `exception` is a value that is thrown using the throw statement.
      - `reason` is a value that indicates why a promise was rejected.
      - `settled` the final resting state of a promise, fulfilled or rejected.

      A promise can be in one of three states: pending, fulfilled, or rejected.

      Promises that are fulfilled have a fulfillment value and are in the fulfilled
      state.  Promises that are rejected have a rejection reason and are in the
      rejected state.  A fulfillment value is never a thenable.

      Promises can also be said to *resolve* a value.  If this value is also a
      promise, then the original promise's settled state will match the value's
      settled state.  So a promise that *resolves* a promise that rejects will
      itself reject, and a promise that *resolves* a promise that fulfills will
      itself fulfill.


      Basic Usage:
      ------------

      ```js
      var promise = new Promise(function(resolve, reject) {
        // on success
        resolve(value);

        // on failure
        reject(reason);
      });

      promise.then(function(value) {
        // on fulfillment
      }, function(reason) {
        // on rejection
      });
      ```

      Advanced Usage:
      ---------------

      Promises shine when abstracting away asynchronous interactions such as
      `XMLHttpRequest`s.

      ```js
      function getJSON(url) {
        return new Promise(function(resolve, reject){
          var xhr = new XMLHttpRequest();

          xhr.open('GET', url);
          xhr.onreadystatechange = handler;
          xhr.responseType = 'json';
          xhr.setRequestHeader('Accept', 'application/json');
          xhr.send();

          function handler() {
            if (this.readyState === this.DONE) {
              if (this.status === 200) {
                resolve(this.response);
              } else {
                reject(new Error('getJSON: `' + url + '` failed with status: [' + this.status + ']'));
              }
            }
          };
        });
      }

      getJSON('/posts.json').then(function(json) {
        // on fulfillment
      }, function(reason) {
        // on rejection
      });
      ```

      Unlike callbacks, promises are great composable primitives.

      ```js
      Promise.all([
        getJSON('/posts'),
        getJSON('/comments')
      ]).then(function(values){
        values[0] // => postsJSON
        values[1] // => commentsJSON

        return values;
      });
      ```

      @class Promise
      @param {function} resolver
      Useful for tooling.
      @constructor
    */
    function lib$es6$promise$promise$$Promise(resolver) {
      this._id = lib$es6$promise$promise$$counter++;
      this._state = undefined;
      this._result = undefined;
      this._subscribers = [];

      if (lib$es6$promise$$internal$$noop !== resolver) {
        if (!lib$es6$promise$utils$$isFunction(resolver)) {
          lib$es6$promise$promise$$needsResolver();
        }

        if (!(this instanceof lib$es6$promise$promise$$Promise)) {
          lib$es6$promise$promise$$needsNew();
        }

        lib$es6$promise$$internal$$initializePromise(this, resolver);
      }
    }

    lib$es6$promise$promise$$Promise.all = lib$es6$promise$promise$all$$default;
    lib$es6$promise$promise$$Promise.race = lib$es6$promise$promise$race$$default;
    lib$es6$promise$promise$$Promise.resolve = lib$es6$promise$promise$resolve$$default;
    lib$es6$promise$promise$$Promise.reject = lib$es6$promise$promise$reject$$default;
    lib$es6$promise$promise$$Promise._setScheduler = lib$es6$promise$asap$$setScheduler;
    lib$es6$promise$promise$$Promise._asap = lib$es6$promise$asap$$default;

    lib$es6$promise$promise$$Promise.prototype = {
      constructor: lib$es6$promise$promise$$Promise,

    /**
      The primary way of interacting with a promise is through its `then` method,
      which registers callbacks to receive either a promise's eventual value or the
      reason why the promise cannot be fulfilled.

      ```js
      findUser().then(function(user){
        // user is available
      }, function(reason){
        // user is unavailable, and you are given the reason why
      });
      ```

      Chaining
      --------

      The return value of `then` is itself a promise.  This second, 'downstream'
      promise is resolved with the return value of the first promise's fulfillment
      or rejection handler, or rejected if the handler throws an exception.

      ```js
      findUser().then(function (user) {
        return user.name;
      }, function (reason) {
        return 'default name';
      }).then(function (userName) {
        // If `findUser` fulfilled, `userName` will be the user's name, otherwise it
        // will be `'default name'`
      });

      findUser().then(function (user) {
        throw new Error('Found user, but still unhappy');
      }, function (reason) {
        throw new Error('`findUser` rejected and we're unhappy');
      }).then(function (value) {
        // never reached
      }, function (reason) {
        // if `findUser` fulfilled, `reason` will be 'Found user, but still unhappy'.
        // If `findUser` rejected, `reason` will be '`findUser` rejected and we're unhappy'.
      });
      ```
      If the downstream promise does not specify a rejection handler, rejection reasons will be propagated further downstream.

      ```js
      findUser().then(function (user) {
        throw new PedagogicalException('Upstream error');
      }).then(function (value) {
        // never reached
      }).then(function (value) {
        // never reached
      }, function (reason) {
        // The `PedgagocialException` is propagated all the way down to here
      });
      ```

      Assimilation
      ------------

      Sometimes the value you want to propagate to a downstream promise can only be
      retrieved asynchronously. This can be achieved by returning a promise in the
      fulfillment or rejection handler. The downstream promise will then be pending
      until the returned promise is settled. This is called *assimilation*.

      ```js
      findUser().then(function (user) {
        return findCommentsByAuthor(user);
      }).then(function (comments) {
        // The user's comments are now available
      });
      ```

      If the assimliated promise rejects, then the downstream promise will also reject.

      ```js
      findUser().then(function (user) {
        return findCommentsByAuthor(user);
      }).then(function (comments) {
        // If `findCommentsByAuthor` fulfills, we'll have the value here
      }, function (reason) {
        // If `findCommentsByAuthor` rejects, we'll have the reason here
      });
      ```

      Simple Example
      --------------

      Synchronous Example

      ```javascript
      var result;

      try {
        result = findResult();
        // success
      } catch(reason) {
        // failure
      }
      ```

      Errback Example

      ```js
      findResult(function(result, err){
        if (err) {
          // failure
        } else {
          // success
        }
      });
      ```

      Promise Example;

      ```javascript
      findResult().then(function(result){
        // success
      }, function(reason){
        // failure
      });
      ```

      Advanced Example
      --------------

      Synchronous Example

      ```javascript
      var author, books;

      try {
        author = findAuthor();
        books  = findBooksByAuthor(author);
        // success
      } catch(reason) {
        // failure
      }
      ```

      Errback Example

      ```js

      function foundBooks(books) {

      }

      function failure(reason) {

      }

      findAuthor(function(author, err){
        if (err) {
          failure(err);
          // failure
        } else {
          try {
            findBoooksByAuthor(author, function(books, err) {
              if (err) {
                failure(err);
              } else {
                try {
                  foundBooks(books);
                } catch(reason) {
                  failure(reason);
                }
              }
            });
          } catch(error) {
            failure(err);
          }
          // success
        }
      });
      ```

      Promise Example;

      ```javascript
      findAuthor().
        then(findBooksByAuthor).
        then(function(books){
          // found books
      }).catch(function(reason){
        // something went wrong
      });
      ```

      @method then
      @param {Function} onFulfilled
      @param {Function} onRejected
      Useful for tooling.
      @return {Promise}
    */
      then: function(onFulfillment, onRejection) {
        var parent = this;
        var state = parent._state;

        if (state === lib$es6$promise$$internal$$FULFILLED && !onFulfillment || state === lib$es6$promise$$internal$$REJECTED && !onRejection) {
          return this;
        }

        var child = new this.constructor(lib$es6$promise$$internal$$noop);
        var result = parent._result;

        if (state) {
          var callback = arguments[state - 1];
          lib$es6$promise$asap$$default(function(){
            lib$es6$promise$$internal$$invokeCallback(state, child, callback, result);
          });
        } else {
          lib$es6$promise$$internal$$subscribe(parent, child, onFulfillment, onRejection);
        }

        return child;
      },

    /**
      `catch` is simply sugar for `then(undefined, onRejection)` which makes it the same
      as the catch block of a try/catch statement.

      ```js
      function findAuthor(){
        throw new Error('couldn't find that author');
      }

      // synchronous
      try {
        findAuthor();
      } catch(reason) {
        // something went wrong
      }

      // async with promises
      findAuthor().catch(function(reason){
        // something went wrong
      });
      ```

      @method catch
      @param {Function} onRejection
      Useful for tooling.
      @return {Promise}
    */
      'catch': function(onRejection) {
        return this.then(null, onRejection);
      }
    };
    function lib$es6$promise$polyfill$$polyfill() {
      var local;

      if (typeof global !== 'undefined') {
          local = global;
      } else if (typeof self !== 'undefined') {
          local = self;
      } else {
          try {
              local = Function('return this')();
          } catch (e) {
              throw new Error('polyfill failed because global object is unavailable in this environment');
          }
      }

      var P = local.Promise;

      if (P && Object.prototype.toString.call(P.resolve()) === '[object Promise]' && !P.cast) {
        return;
      }

      local.Promise = lib$es6$promise$promise$$default;
    }
    var lib$es6$promise$polyfill$$default = lib$es6$promise$polyfill$$polyfill;

    var lib$es6$promise$umd$$ES6Promise = {
      'Promise': lib$es6$promise$promise$$default,
      'polyfill': lib$es6$promise$polyfill$$default
    };

    /* global define:true module:true window: true */
    if (typeof define === 'function' && define['amd']) {
      define(function() { return lib$es6$promise$umd$$ES6Promise; });
    } else if (typeof module !== 'undefined' && module['exports']) {
      module['exports'] = lib$es6$promise$umd$$ES6Promise;
    } else if (typeof this !== 'undefined') {
      this['ES6Promise'] = lib$es6$promise$umd$$ES6Promise;
    }

    lib$es6$promise$polyfill$$default();
}).call(this);


(function() {
  'use strict';

  if (self.fetch) {
    return
  }

  function normalizeName(name) {
    if (typeof name !== 'string') {
      name = String(name)
    }
    if (/[^a-z0-9\-#$%&'*+.\^_`|~]/i.test(name)) {
      throw new TypeError('Invalid character in header field name')
    }
    return name.toLowerCase()
  }

  function normalizeValue(value) {
    if (typeof value !== 'string') {
      value = String(value)
    }
    return value
  }

  function Headers(headers) {
    this.map = {}

    if (headers instanceof Headers) {
      headers.forEach(function(value, name) {
        this.append(name, value)
      }, this)

    } else if (headers) {
      Object.getOwnPropertyNames(headers).forEach(function(name) {
        this.append(name, headers[name])
      }, this)
    }
  }

  Headers.prototype.append = function(name, value) {
    name = normalizeName(name)
    value = normalizeValue(value)
    var list = this.map[name]
    if (!list) {
      list = []
      this.map[name] = list
    }
    list.push(value)
  }

  Headers.prototype['delete'] = function(name) {
    delete this.map[normalizeName(name)]
  }

  Headers.prototype.get = function(name) {
    var values = this.map[normalizeName(name)]
    return values ? values[0] : null
  }

  Headers.prototype.getAll = function(name) {
    return this.map[normalizeName(name)] || []
  }

  Headers.prototype.has = function(name) {
    return this.map.hasOwnProperty(normalizeName(name))
  }

  Headers.prototype.set = function(name, value) {
    this.map[normalizeName(name)] = [normalizeValue(value)]
  }

  Headers.prototype.forEach = function(callback, thisArg) {
    Object.getOwnPropertyNames(this.map).forEach(function(name) {
      this.map[name].forEach(function(value) {
        callback.call(thisArg, value, name, this)
      }, this)
    }, this)
  }

  function consumed(body) {
    if (body.bodyUsed) {
      return Promise.reject(new TypeError('Already read'))
    }
    body.bodyUsed = true
  }

  function fileReaderReady(reader) {
    return new Promise(function(resolve, reject) {
      reader.onload = function() {
        resolve(reader.result)
      }
      reader.onerror = function() {
        reject(reader.error)
      }
    })
  }

  function readBlobAsArrayBuffer(blob) {
    var reader = new FileReader()
    reader.readAsArrayBuffer(blob)
    return fileReaderReady(reader)
  }

  function readBlobAsText(blob) {
    var reader = new FileReader()
    reader.readAsText(blob)
    return fileReaderReady(reader)
  }

  var support = {
    blob: 'FileReader' in self && 'Blob' in self && (function() {
      try {
        new Blob();
        return true
      } catch(e) {
        return false
      }
    })(),
    formData: 'FormData' in self
  }

  function Body() {
    this.bodyUsed = false


    this._initBody = function(body) {
      this._bodyInit = body
      if (typeof body === 'string') {
        this._bodyText = body
      } else if (support.blob && Blob.prototype.isPrototypeOf(body)) {
        this._bodyBlob = body
      } else if (support.formData && FormData.prototype.isPrototypeOf(body)) {
        this._bodyFormData = body
      } else if (!body) {
        this._bodyText = ''
      } else {
        throw new Error('unsupported BodyInit type')
      }
    }

    if (support.blob) {
      this.blob = function() {
        var rejected = consumed(this)
        if (rejected) {
          return rejected
        }

        if (this._bodyBlob) {
          return Promise.resolve(this._bodyBlob)
        } else if (this._bodyFormData) {
          throw new Error('could not read FormData body as blob')
        } else {
          return Promise.resolve(new Blob([this._bodyText]))
        }
      }

      this.arrayBuffer = function() {
        return this.blob().then(readBlobAsArrayBuffer)
      }

      this.text = function() {
        var rejected = consumed(this)
        if (rejected) {
          return rejected
        }

        if (this._bodyBlob) {
          return readBlobAsText(this._bodyBlob)
        } else if (this._bodyFormData) {
          throw new Error('could not read FormData body as text')
        } else {
          return Promise.resolve(this._bodyText)
        }
      }
    } else {
      this.text = function() {
        var rejected = consumed(this)
        return rejected ? rejected : Promise.resolve(this._bodyText)
      }
    }

    if (support.formData) {
      this.formData = function() {
        return this.text().then(decode)
      }
    }

    this.json = function() {
      return this.text().then(JSON.parse)
    }

    return this
  }

  // HTTP methods whose capitalization should be normalized
  var methods = ['DELETE', 'GET', 'HEAD', 'OPTIONS', 'POST', 'PUT']

  function normalizeMethod(method) {
    var upcased = method.toUpperCase()
    return (methods.indexOf(upcased) > -1) ? upcased : method
  }

  function Request(input, options) {
    options = options || {}
    var body = options.body
    if (Request.prototype.isPrototypeOf(input)) {
      if (input.bodyUsed) {
        throw new TypeError('Already read')
      }
      this.url = input.url
      this.credentials = input.credentials
      if (!options.headers) {
        this.headers = new Headers(input.headers)
      }
      this.method = input.method
      this.mode = input.mode
      if (!body) {
        body = input._bodyInit
        input.bodyUsed = true
      }
    } else {
      this.url = input
    }

    this.credentials = options.credentials || this.credentials || 'omit'
    if (options.headers || !this.headers) {
      this.headers = new Headers(options.headers)
    }
    this.method = normalizeMethod(options.method || this.method || 'GET')
    this.mode = options.mode || this.mode || null
    this.referrer = null

    if ((this.method === 'GET' || this.method === 'HEAD') && body) {
      throw new TypeError('Body not allowed for GET or HEAD requests')
    }
    this._initBody(body)
  }

  function decode(body) {
    var form = new FormData()
    body.trim().split('&').forEach(function(bytes) {
      if (bytes) {
        var split = bytes.split('=')
        var name = split.shift().replace(/\+/g, ' ')
        var value = split.join('=').replace(/\+/g, ' ')
        form.append(decodeURIComponent(name), decodeURIComponent(value))
      }
    })
    return form
  }

  function headers(xhr) {
    var head = new Headers()
    var pairs = xhr.getAllResponseHeaders().trim().split('\n')
    pairs.forEach(function(header) {
      var split = header.trim().split(':')
      var key = split.shift().trim()
      var value = split.join(':').trim()
      head.append(key, value)
    })
    return head
  }

  Body.call(Request.prototype)

  function Response(bodyInit, options) {
    if (!options) {
      options = {}
    }

    this._initBody(bodyInit)
    this.type = 'default'
    this.url = null
    this.status = options.status
    this.ok = this.status >= 200 && this.status < 300
    this.statusText = options.statusText
    this.headers = options.headers instanceof Headers ? options.headers : new Headers(options.headers)
    this.url = options.url || ''
  }

  Body.call(Response.prototype)

  self.Headers = Headers;
  self.Request = Request;
  self.Response = Response;

  self.fetch = function(input, init) {
    var request
    if (Request.prototype.isPrototypeOf(input) && !init) {
      request = input
    } else {
      request = new Request(input, init)
    }

    return new Promise(function(resolve, reject) {
      var xhr = new XMLHttpRequest()

      function responseURL() {
        if ('responseURL' in xhr) {
          return xhr.responseURL
        }

        // Avoid security warnings on getResponseHeader when not allowed by CORS
        if (/^X-Request-URL:/m.test(xhr.getAllResponseHeaders())) {
          return xhr.getResponseHeader('X-Request-URL')
        }

        return;
      }

      xhr.onload = function() {
        var status = (xhr.status === 1223) ? 204 : xhr.status
        if (status < 100 || status > 599) {
          reject(new TypeError('Network request failed'))
          return
        }
        var options = {
          status: status,
          statusText: xhr.statusText,
          headers: headers(xhr),
          url: responseURL()
        }
        var body = 'response' in xhr ? xhr.response : xhr.responseText;
        resolve(new Response(body, options))
      }

      xhr.onerror = function() {
        reject(new TypeError('Network request failed'))
      }

      xhr.open(request.method, request.url, true)

      if (request.credentials === 'include') {
        xhr.withCredentials = true
      }

      if ('responseType' in xhr && support.blob) {
        xhr.responseType = 'blob'
      }

      request.headers.forEach(function(value, name) {
        xhr.setRequestHeader(name, value)
      })

      xhr.send(typeof request._bodyInit === 'undefined' ? null : request._bodyInit)
    })
  }
  self.fetch.polyfill = true
})();

// Version: 3.7.13
/* =-====================================================================-= */
/* =-====================================================================-= */
/* =-=========================     JSON     =============================-= */
/* =-====================================================================-= */
/* =-====================================================================-= */

(window['JSON'] && window['JSON']['stringify']) || (function () {
    window['JSON'] || (window['JSON'] = {});

    function toJSON(key) {
        try      { return this.valueOf() }
        catch(e) { return null }
    }

    var cx = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
        escapable = /[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
        gap,
        indent,
        meta = {    // table of character substitutions
            '\b': '\\b',
            '\t': '\\t',
            '\n': '\\n',
            '\f': '\\f',
            '\r': '\\r',
            '"' : '\\"',
            '\\': '\\\\'
        },
        rep;

    function quote(string) {
        escapable.lastIndex = 0;
        return escapable.test(string) ?
            '"' + string.replace(escapable, function (a) {
                var c = meta[a];
                return typeof c === 'string' ? c :
                    '\\u' + ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
            }) + '"' :
            '"' + string + '"';
    }

    function str(key, holder) {
        var i,          // The loop counter.
            k,          // The member key.
            v,          // The member value.
            length,
            partial,
            mind  = gap,
            value = holder[key];

        if (value && typeof value === 'object') {
            value = toJSON.call( value, key );
        }

        if (typeof rep === 'function') {
            value = rep.call(holder, key, value);
        }

        switch (typeof value) {
        case 'string':
            return quote(value);

        case 'number':
            return isFinite(value) ? String(value) : 'null';

        case 'boolean':
        case 'null':
            return String(value);

        case 'object':

            if (!value) {
                return 'null';
            }

            gap += indent;
            partial = [];

            if (Object.prototype.toString.apply(value) === '[object Array]') {

                length = value.length;
                for (i = 0; i < length; i += 1) {
                    partial[i] = str(i, value) || 'null';
                }

                v = partial.length === 0 ? '[]' :
                    gap ? '[\n' + gap +
                            partial.join(',\n' + gap) + '\n' +
                                mind + ']' :
                          '[' + partial.join(',') + ']';
                gap = mind;
                return v;
            }
            if (rep && typeof rep === 'object') {
                length = rep.length;
                for (i = 0; i < length; i += 1) {
                    k = rep[i];
                    if (typeof k === 'string') {
                        v = str(k, value);
                        if (v) {
                            partial.push(quote(k) + (gap ? ': ' : ':') + v);
                        }
                    }
                }
            } else {
                for (k in value) {
                    if (Object.hasOwnProperty.call(value, k)) {
                        v = str(k, value);
                        if (v) {
                            partial.push(quote(k) + (gap ? ': ' : ':') + v);
                        }
                    }
                }
            }

            v = partial.length === 0 ? '{}' :
                gap ? '{\n' + gap + partial.join(',\n' + gap) + '\n' +
                        mind + '}' : '{' + partial.join(',') + '}';
            gap = mind;
            return v;
        }
    }

    if (typeof JSON['stringify'] !== 'function') {
        JSON['stringify'] = function (value, replacer, space) {
            var i;
            gap = '';
            indent = '';

            if (typeof space === 'number') {
                for (i = 0; i < space; i += 1) {
                    indent += ' ';
                }
            } else if (typeof space === 'string') {
                indent = space;
            }
            rep = replacer;
            if (replacer && typeof replacer !== 'function' &&
                    (typeof replacer !== 'object' ||
                     typeof replacer.length !== 'number')) {
                throw new Error('JSON.stringify');
            }
            return str('', {'': value});
        };
    }

    if (typeof JSON['parse'] !== 'function') {
        // JSON is parsed on the server for security.
        JSON['parse'] = function (text) {return eval('('+text+')')};
    }
}());
var NOW             = 1
,   READY           = false
,   READY_BUFFER    = []
,   PRESENCE_SUFFIX = '-pnpres'
,   DEF_WINDOWING   = 10     // MILLISECONDS.
,   DEF_TIMEOUT     = 10000  // MILLISECONDS.
,   DEF_SUB_TIMEOUT = 310    // SECONDS.
,   DEF_KEEPALIVE   = 60     // SECONDS (FOR TIMESYNC).
,   SECOND          = 1000   // A THOUSAND MILLISECONDS.
,   URLBIT          = '/'
,   PARAMSBIT       = '&'
,   PRESENCE_HB_THRESHOLD = 5
,   PRESENCE_HB_DEFAULT  = 30
,   SDK_VER         = '3.7.13'
,   REPL            = /{([\w\-]+)}/g;

/**
 * UTILITIES
 */
function unique() { return'x'+ ++NOW+''+(+new Date) }
function rnow()   { return+new Date }

/**
 * NEXTORIGIN
 * ==========
 * var next_origin = nextorigin();
 */
var nextorigin = (function() {
    var max = 20
    ,   ori = Math.floor(Math.random() * max);
    return function( origin, failover ) {
        return origin.indexOf('pubsub.') > 0
            && origin.replace(
             'pubsub', 'ps' + (
                failover ? generate_uuid().split('-')[0] :
                (++ori < max? ori : ori=1)
            ) ) || origin;
    }
})();


/**
 * Build Url
 * =======
 *
 */
function build_url( url_components, url_params ) {
    var url    = url_components.join(URLBIT)
    ,   params = [];

    if (!url_params) return url;

    each( url_params, function( key, value ) {
        var value_str = (typeof value == 'object')?JSON['stringify'](value):value;
        (typeof value != 'undefined' &&
            value != null && encode(value_str).length > 0
        ) && params.push(key + "=" + encode(value_str));
    } );

    url += "?" + params.join(PARAMSBIT);
    return url;
}

/**
 * UPDATER
 * =======
 * var timestamp = unique();
 */
function updater( fun, rate ) {
    var timeout
    ,   last   = 0
    ,   runnit = function() {
        if (last + rate > rnow()) {
            clearTimeout(timeout);
            timeout = setTimeout( runnit, rate );
        }
        else {
            last = rnow();
            fun();
        }
    };

    return runnit;
}

/**
 * GREP
 * ====
 * var list = grep( [1,2,3], function(item) { return item % 2 } )
 */
function grep( list, fun ) {
    var fin = [];
    each( list || [], function(l) { fun(l) && fin.push(l) } );
    return fin
}

/**
 * SUPPLANT
 * ========
 * var text = supplant( 'Hello {name}!', { name : 'John' } )
 */
function supplant( str, values ) {
    return str.replace( REPL, function( _, match ) {
        return values[match] || _
    } );
}

/**
 * timeout
 * =======
 * timeout( function(){}, 100 );
 */
function timeout( fun, wait ) {
    return setTimeout( fun, wait );
}

/**
 * uuid
 * ====
 * var my_uuid = generate_uuid();
 */
function generate_uuid(callback) {
    var u = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g,
    function(c) {
        var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
        return v.toString(16);
    });
    if (callback) callback(u);
    return u;
}

function isArray(arg) {
  return !!arg && typeof arg !== 'string' && (Array.isArray && Array.isArray(arg) || typeof(arg.length) === "number")
  //return !!arg && (Array.isArray && Array.isArray(arg) || typeof(arg.length) === "number")
}

/**
 * EACH
 * ====
 * each( [1,2,3], function(item) { } )
 */
function each( o, f) {
    if ( !o || !f ) return;

    if ( isArray(o) )
        for ( var i = 0, l = o.length; i < l; )
            f.call( o[i], o[i], i++ );
    else
        for ( var i in o )
            o.hasOwnProperty    &&
            o.hasOwnProperty(i) &&
            f.call( o[i], i, o[i] );
}

/**
 * MAP
 * ===
 * var list = map( [1,2,3], function(item) { return item + 1 } )
 */
function map( list, fun ) {
    var fin = [];
    each( list || [], function( k, v ) { fin.push(fun( k, v )) } );
    return fin;
}


function pam_encode(str) {
  return encodeURIComponent(str).replace(/[!'()*~]/g, function(c) {
    return '%' + c.charCodeAt(0).toString(16).toUpperCase();
  });
}

/**
 * ENCODE
 * ======
 * var encoded_data = encode('path');
 */
function encode(path) { return encodeURIComponent(path) }

/**
 * Generate Subscription Channel List
 * ==================================
 * generate_channel_list(channels_object);
 */
function generate_channel_list(channels, nopresence) {
    var list = [];
    each( channels, function( channel, status ) {
        if (nopresence) {
            if(channel.search('-pnpres') < 0) {
                if (status.subscribed) list.push(channel);
            }
        } else {
            if (status.subscribed) list.push(channel);
        }
    });
    return list.sort();
}

/**
 * Generate Subscription Channel Groups List
 * ==================================
 * generate_channel_group_list(channels_groups object);
 */
function generate_channel_group_list(channel_groups, nopresence) {
    var list = [];
    each(channel_groups, function( channel_group, status ) {
        if (nopresence) {
            if(channel_group.search('-pnpres') < 0) {
                if (status.subscribed) list.push(channel_group);
            }
        } else {
            if (status.subscribed) list.push(channel_group);
        }
    });
    return list.sort();
}

// PUBNUB READY TO CONNECT
function ready() { timeout( function() {
    if (READY) return;
    READY = 1;
    each( READY_BUFFER, function(connect) { connect() } );
}, SECOND ); }

function PNmessage(args) {
    msg = args || {'apns' : {}},
    msg['getPubnubMessage'] = function() {
        var m = {};

        if (Object.keys(msg['apns']).length) {
            m['pn_apns'] = {
                    'aps' : {
                        'alert' : msg['apns']['alert'] ,
                        'badge' : msg['apns']['badge']
                    }
            }
            for (var k in msg['apns']) {
                m['pn_apns'][k] = msg['apns'][k];
            }
            var exclude1 = ['badge','alert'];
            for (var k in exclude1) {
                delete m['pn_apns'][exclude1[k]];
            }
        }



        if (msg['gcm']) {
            m['pn_gcm'] = {
                'data' : msg['gcm']
            }
        }

        for (var k in msg) {
            m[k] = msg[k];
        }
        var exclude = ['apns','gcm','publish', 'channel','callback','error'];
        for (var k in exclude) {
            delete m[exclude[k]];
        }

        return m;
    };
    msg['publish'] = function() {

        var m = msg.getPubnubMessage();

        if (msg['pubnub'] && msg['channel']) {
            msg['pubnub'].publish({
                'message' : m,
                'channel' : msg['channel'],
                'callback' : msg['callback'],
                'error' : msg['error']
            })
        }
    };
    return msg;
}

function PN_API(setup) {
    var SUB_WINDOWING =  +setup['windowing']   || DEF_WINDOWING
    ,   SUB_TIMEOUT   = (+setup['timeout']     || DEF_SUB_TIMEOUT) * SECOND
    ,   KEEPALIVE     = (+setup['keepalive']   || DEF_KEEPALIVE)   * SECOND
    ,   TIME_CHECK    = setup['timecheck']     || 0
    ,   NOLEAVE       = setup['noleave']       || 0
    ,   PUBLISH_KEY   = setup['publish_key']   || 'demo'
    ,   SUBSCRIBE_KEY = setup['subscribe_key'] || 'demo'
    ,   AUTH_KEY      = setup['auth_key']      || ''
    ,   SECRET_KEY    = setup['secret_key']    || ''
    ,   hmac_SHA256   = setup['hmac_SHA256']
    ,   SSL           = setup['ssl']            ? 's' : ''
    ,   ORIGIN        = 'http'+SSL+'://'+(setup['origin']||'pubsub.pubnub.com')
    ,   STD_ORIGIN    = nextorigin(ORIGIN)
    ,   SUB_ORIGIN    = nextorigin(ORIGIN)
    ,   CONNECT       = function(){}
    ,   PUB_QUEUE     = []
    ,   CLOAK         = true
    ,   TIME_DRIFT    = 0
    ,   SUB_CALLBACK  = 0
    ,   SUB_CHANNEL   = 0
    ,   SUB_RECEIVER  = 0
    ,   SUB_RESTORE   = setup['restore'] || 0
    ,   SUB_BUFF_WAIT = 0
    ,   TIMETOKEN     = 0
    ,   RESUMED       = false
    ,   CHANNELS      = {}
    ,   CHANNEL_GROUPS       = {}
    ,   SUB_ERROR     = function(){}
    ,   STATE         = {}
    ,   PRESENCE_HB_TIMEOUT  = null
    ,   PRESENCE_HB          = validate_presence_heartbeat(
        setup['heartbeat'] || setup['pnexpires'] || 0, setup['error']
    )
    ,   PRESENCE_HB_INTERVAL = setup['heartbeat_interval'] || (PRESENCE_HB / 2) -1
    ,   PRESENCE_HB_RUNNING  = false
    ,   NO_WAIT_FOR_PENDING  = setup['no_wait_for_pending']
    ,   COMPATIBLE_35 = setup['compatible_3.5']  || false
    ,   xdr           = setup['xdr']
    ,   params        = setup['params'] || {}
    ,   error         = setup['error']      || function() {}
    ,   _is_online    = setup['_is_online'] || function() { return 1 }
    ,   jsonp_cb      = setup['jsonp_cb']   || function() { return 0 }
    ,   db            = setup['db']         || {'get': function(){}, 'set': function(){}}
    ,   CIPHER_KEY    = setup['cipher_key']
    ,   UUID          = setup['uuid'] || ( !setup['unique_uuid'] && db && db['get'](SUBSCRIBE_KEY+'uuid') || '')
    ,   USE_INSTANCEID = setup['instance_id'] || false
    ,   INSTANCEID     = ''
    ,   _poll_timer
    ,   _poll_timer2;

    if (PRESENCE_HB === 2) PRESENCE_HB_INTERVAL = 1;

    var crypto_obj    = setup['crypto_obj'] ||
        {
            'encrypt' : function(a,key){ return a},
            'decrypt' : function(b,key){return b}
        };

    function _get_url_params(data) {
        if (!data) data = {};
        each( params , function( key, value ) {
            if (!(key in data)) data[key] = value;
        });
        return data;
    }

    function _object_to_key_list(o) {
        var l = []
        each( o , function( key, value ) {
            l.push(key);
        });
        return l;
    }
    function _object_to_key_list_sorted(o) {
        return _object_to_key_list(o).sort();
    }

    function _get_pam_sign_input_from_params(params) {
        var si = "";
        var l = _object_to_key_list_sorted(params);

        for (var i in l) {
            var k = l[i]
            si += k + "=" + pam_encode(params[k]) ;
            if (i != l.length - 1) si += "&"
        }
        return si;
    }

    function validate_presence_heartbeat(heartbeat, cur_heartbeat, error) {
        var err = false;

        if (typeof heartbeat === 'undefined') {
            return cur_heartbeat;
        }

        if (typeof heartbeat === 'number') {
            if (heartbeat > PRESENCE_HB_THRESHOLD || heartbeat == 0)
                err = false;
            else
                err = true;
        } else if(typeof heartbeat === 'boolean'){
            if (!heartbeat) {
                return 0;
            } else {
                return PRESENCE_HB_DEFAULT;
            }
        } else {
            err = true;
        }

        if (err) {
            error && error("Presence Heartbeat value invalid. Valid range ( x > " + PRESENCE_HB_THRESHOLD + " or x = 0). Current Value : " + (cur_heartbeat || PRESENCE_HB_THRESHOLD));
            return cur_heartbeat || PRESENCE_HB_THRESHOLD;
        } else return heartbeat;
    }

    function encrypt(input, key) {
        return crypto_obj['encrypt'](input, key || CIPHER_KEY) || input;
    }
    function decrypt(input, key) {
        return crypto_obj['decrypt'](input, key || CIPHER_KEY) ||
               crypto_obj['decrypt'](input, CIPHER_KEY) ||
               input;
    }

    function error_common(message, callback) {
        callback && callback({ 'error' : message || "error occurred"});
        error && error(message);
    }
    function _presence_heartbeat() {

        clearTimeout(PRESENCE_HB_TIMEOUT);

        if (!PRESENCE_HB_INTERVAL || PRESENCE_HB_INTERVAL >= 500 ||
            PRESENCE_HB_INTERVAL < 1 ||
            (!generate_channel_list(CHANNELS,true).length  && !generate_channel_group_list(CHANNEL_GROUPS, true).length ) )
        {
            PRESENCE_HB_RUNNING = false;
            return;
        }

        PRESENCE_HB_RUNNING = true;
        SELF['presence_heartbeat']({
            'callback' : function(r) {
                PRESENCE_HB_TIMEOUT = timeout( _presence_heartbeat, (PRESENCE_HB_INTERVAL) * SECOND );
            },
            'error' : function(e) {
                error && error("Presence Heartbeat unable to reach Pubnub servers." + JSON.stringify(e));
                PRESENCE_HB_TIMEOUT = timeout( _presence_heartbeat, (PRESENCE_HB_INTERVAL) * SECOND );
            }
        });
    }

    function start_presence_heartbeat() {
        !PRESENCE_HB_RUNNING && _presence_heartbeat();
    }

    function publish(next) {

        if (NO_WAIT_FOR_PENDING) {
            if (!PUB_QUEUE.length) return;
        } else {
            if (next) PUB_QUEUE.sending = 0;
            if ( PUB_QUEUE.sending || !PUB_QUEUE.length ) return;
            PUB_QUEUE.sending = 1;
        }

        xdr(PUB_QUEUE.shift());
    }
    function each_channel_group(callback) {
        var count = 0;

        each( generate_channel_group_list(CHANNEL_GROUPS), function(channel_group) {
            var chang = CHANNEL_GROUPS[channel_group];

            if (!chang) return;

            count++;
            (callback||function(){})(chang);
        } );

        return count;
    }

    function each_channel(callback) {
        var count = 0;

        each( generate_channel_list(CHANNELS), function(channel) {
            var chan = CHANNELS[channel];

            if (!chan) return;

            count++;
            (callback||function(){})(chan);
        } );

        return count;
    }
    function _invoke_callback(response, callback, err) {
        if (typeof response == 'object') {
            if (response['error']) {
                var callback_data = {};

                if (response['message']) {
                    callback_data['message'] = response['message'];
                }

                if (response['payload']) {
                    callback_data['payload'] = response['payload'];
                }

                err && err(callback_data);
                return;

            }
            if (response['payload']) {
                if (response['next_page'])
                    callback && callback(response['payload'], response['next_page']);
                else
                    callback && callback(response['payload']);
                return;
            }
        }
        callback && callback(response);
    }

    function _invoke_error(response,err) {

        if (typeof response == 'object' && response['error']) {
                var callback_data = {};

                if (response['message']) {
                    callback_data['message'] = response['message'];
                }

                if (response['payload']) {
                    callback_data['payload'] = response['payload'];
                }
                
                err && err(callback_data);
                return;
        } else {
            err && err(response);
        }
    }
    function CR(args, callback, url1, data) {
            var callback        = args['callback']      || callback
            ,   err             = args['error']         || error
            ,   jsonp           = jsonp_cb();

            data = data || {};
            
            if (!data['auth']) {
                data['auth'] = args['auth_key'] || AUTH_KEY;
            }
            
            var url = [
                    STD_ORIGIN, 'v1', 'channel-registration',
                    'sub-key', SUBSCRIBE_KEY
                ];

            url.push.apply(url,url1);
            
            if (jsonp) data['callback']              = jsonp;
            
            xdr({
                callback : jsonp,
                data     : _get_url_params(data),
                success  : function(response) {
                    _invoke_callback(response, callback, err);
                },
                fail     : function(response) {
                    _invoke_error(response, err);
                },
                url      : url
            });

    }

    // Announce Leave Event
    var SELF = {
        'LEAVE' : function( channel, blocking, auth_key, callback, error ) {

            var data   = { 'uuid' : UUID, 'auth' : auth_key || AUTH_KEY }
            ,   origin = nextorigin(ORIGIN)
            ,   callback = callback || function(){}
            ,   err      = error    || function(){}
            ,   jsonp  = jsonp_cb();

            // Prevent Leaving a Presence Channel
            if (channel.indexOf(PRESENCE_SUFFIX) > 0) return true;

            if (COMPATIBLE_35) {
                if (!SSL)         return false;
                if (jsonp == '0') return false;
            }

            if (NOLEAVE)  return false;

            if (jsonp != '0') data['callback'] = jsonp;

            if (USE_INSTANCEID) data['instanceid'] = INSTANCEID;

            xdr({
                blocking : blocking || SSL,
                timeout  : 2000,
                callback : jsonp,
                data     : _get_url_params(data),
                success  : function(response) {
                    _invoke_callback(response, callback, err);
                },
                fail     : function(response) {
                    _invoke_error(response, err);
                },
                url      : [
                    origin, 'v2', 'presence', 'sub_key',
                    SUBSCRIBE_KEY, 'channel', encode(channel), 'leave'
                ]
            });
            return true;
        },
        'LEAVE_GROUP' : function( channel_group, blocking, auth_key, callback, error ) {

            var data   = { 'uuid' : UUID, 'auth' : auth_key || AUTH_KEY }
            ,   origin = nextorigin(ORIGIN)
            ,   callback = callback || function(){}
            ,   err      = error    || function(){}
            ,   jsonp  = jsonp_cb();

            // Prevent Leaving a Presence Channel Group
            if (channel_group.indexOf(PRESENCE_SUFFIX) > 0) return true;

            if (COMPATIBLE_35) {
                if (!SSL)         return false;
                if (jsonp == '0') return false;
            }

            if (NOLEAVE)  return false;

            if (jsonp != '0') data['callback'] = jsonp;

            if (channel_group && channel_group.length > 0) data['channel-group'] = channel_group;

            if (USE_INSTANCEID) data['instanceid'] = INSTANCEID;

            xdr({
                blocking : blocking || SSL,
                timeout  : 5000,
                callback : jsonp,
                data     : _get_url_params(data),
                success  : function(response) {
                    _invoke_callback(response, callback, err);
                },
                fail     : function(response) {
                    _invoke_error(response, err);
                },
                url      : [
                    origin, 'v2', 'presence', 'sub_key',
                    SUBSCRIBE_KEY, 'channel', encode(','), 'leave'
                ]
            });
            return true;
        },
        'set_resumed' : function(resumed) {
                RESUMED = resumed;
        },
        'get_cipher_key' : function() {
            return CIPHER_KEY;
        },
        'set_cipher_key' : function(key) {
            CIPHER_KEY = key;
        },
        'raw_encrypt' : function(input, key) {
            return encrypt(input, key);
        },
        'raw_decrypt' : function(input, key) {
            return decrypt(input, key);
        },
        'get_heartbeat' : function() {
            return PRESENCE_HB;
        },
        
        'set_heartbeat' : function(heartbeat, heartbeat_interval) {
            PRESENCE_HB = validate_presence_heartbeat(heartbeat, PRESENCE_HB, error);
            PRESENCE_HB_INTERVAL = heartbeat_interval || (PRESENCE_HB / 2) - 1;
            if (PRESENCE_HB == 2) {
                PRESENCE_HB_INTERVAL = 1;
            }
            CONNECT();
            _presence_heartbeat();
        },
        
        'get_heartbeat_interval' : function() {
            return PRESENCE_HB_INTERVAL;
        },
        
        'set_heartbeat_interval' : function(heartbeat_interval) {
            PRESENCE_HB_INTERVAL = heartbeat_interval;
            _presence_heartbeat();
        },
        
        'get_version' : function() {
            return SDK_VER;
        },
        'getGcmMessageObject' : function(obj) {
            return {
                'data' : obj
            }
        },
        'getApnsMessageObject' : function(obj) {
            var x =  {
                'aps' : { 'badge' : 1, 'alert' : ''}
            }
            for (k in obj) {
                k[x] = obj[k];
            }
            return x;
        },
        'newPnMessage' : function() {
            var x = {};
            if (gcm) x['pn_gcm'] = gcm;
            if (apns) x['pn_apns'] = apns;
            for ( k in n ) {
                x[k] = n[k];
            }
            return x;
        },

        '_add_param' : function(key,val) {
            params[key] = val;
        },

        'channel_group' : function(args, callback) {
            var ns_ch       = args['channel_group']
            ,   callback    = callback         || args['callback']
            ,   channels    = args['channels'] || args['channel']
            ,   cloak       = args['cloak']
            ,   namespace
            ,   channel_group
            ,   url = []
            ,   data = {}
            ,   mode = args['mode'] || 'add';


            if (ns_ch) {
                var ns_ch_a = ns_ch.split(':');

                if (ns_ch_a.length > 1) {
                    namespace = (ns_ch_a[0] === '*')?null:ns_ch_a[0];

                    channel_group = ns_ch_a[1];
                } else {
                    channel_group = ns_ch_a[0];
                }
            }

            namespace && url.push('namespace') && url.push(encode(namespace));

            url.push('channel-group');

            if (channel_group && channel_group !== '*') {
                url.push(channel_group);
            }

            if (channels ) {
                if (isArray(channels)) {
                    channels = channels.join(',');
                }
                data[mode] = channels;
                data['cloak'] = (CLOAK)?'true':'false';
            } else {
                if (mode === 'remove') url.push('remove');
            }

            if (typeof cloak != 'undefined') data['cloak'] = (cloak)?'true':'false';

            CR(args, callback, url, data);
        },

        'channel_group_list_groups' : function(args, callback) {
            var namespace;

            namespace = args['namespace'] || args['ns'] || args['channel_group'] || null;
            if (namespace) {
                args["channel_group"] = namespace + ":*";
            }

            SELF['channel_group'](args, callback);
        },

        'channel_group_list_channels' : function(args, callback) {
            if (!args['channel_group']) return error('Missing Channel Group');
            SELF['channel_group'](args, callback);
        },

        'channel_group_remove_channel' : function(args, callback) {
            if (!args['channel_group']) return error('Missing Channel Group');
            if (!args['channel'] && !args['channels'] ) return error('Missing Channel');

            args['mode'] = 'remove';
            SELF['channel_group'](args,callback);
        },

        'channel_group_remove_group' : function(args, callback) {
            if (!args['channel_group']) return error('Missing Channel Group');
            if (args['channel']) return error('Use channel_group_remove_channel if you want to remove a channel from a group.');

            args['mode'] = 'remove';
            SELF['channel_group'](args,callback);
        },

        'channel_group_add_channel' : function(args, callback) {
           if (!args['channel_group']) return error('Missing Channel Group');
           if (!args['channel'] && !args['channels'] ) return error('Missing Channel');
            SELF['channel_group'](args,callback);
        },

        'channel_group_cloak' : function(args, callback) {
            if (typeof args['cloak'] == 'undefined') {
                callback(CLOAK);
                return;
            }
            CLOAK = args['cloak'];
            SELF['channel_group'](args,callback);
        },

        'channel_group_list_namespaces' : function(args, callback) {
            var url = ['namespace'];
            CR(args, callback, url);
        },
        'channel_group_remove_namespace' : function(args, callback) {
            var url = ['namespace',args['namespace'],'remove'];
            CR(args, callback, url);
        },

        /*
            PUBNUB.history({
                channel  : 'my_chat_channel',
                limit    : 100,
                callback : function(history) { }
            });
        */
        'history' : function( args, callback ) {
            var callback         = args['callback'] || callback
            ,   count            = args['count']    || args['limit'] || 100
            ,   reverse          = args['reverse']  || "false"
            ,   err              = args['error']    || function(){}
            ,   auth_key         = args['auth_key'] || AUTH_KEY
            ,   cipher_key       = args['cipher_key']
            ,   channel          = args['channel']
            ,   channel_group    = args['channel_group']
            ,   start            = args['start']
            ,   end              = args['end']
            ,   include_token    = args['include_token']
            ,   params           = {}
            ,   jsonp            = jsonp_cb();

            // Make sure we have a Channel
            if (!channel && !channel_group) return error('Missing Channel');
            if (!callback)      return error('Missing Callback');
            if (!SUBSCRIBE_KEY) return error('Missing Subscribe Key');

            params['stringtoken'] = 'true';
            params['count']       = count;
            params['reverse']     = reverse;
            params['auth']        = auth_key;

            if (channel_group) {
                params['channel-group'] = channel_group;
                if (!channel) {
                    channel = ','; 
                }
            }
            if (jsonp) params['callback']              = jsonp;
            if (start) params['start']                 = start;
            if (end)   params['end']                   = end;
            if (include_token) params['include_token'] = 'true';

            // Send Message
            xdr({
                callback : jsonp,
                data     : _get_url_params(params),
                success  : function(response) {
                    if (typeof response == 'object' && response['error']) {
                        err({'message' : response['message'], 'payload' : response['payload']});
                        return;
                    }
                    var messages = response[0];
                    var decrypted_messages = [];
                    for (var a = 0; a < messages.length; a++) {
                        var new_message = decrypt(messages[a],cipher_key);
                        try {
                            decrypted_messages['push'](JSON['parse'](new_message));
                        } catch (e) {
                            decrypted_messages['push']((new_message));
                        }
                    }
                    callback([decrypted_messages, response[1], response[2]]);
                },
                fail     : function(response) {
                    _invoke_error(response, err);
                },
                url      : [
                    STD_ORIGIN, 'v2', 'history', 'sub-key',
                    SUBSCRIBE_KEY, 'channel', encode(channel)
                ]
            });
        },

        /*
            PUBNUB.replay({
                source      : 'my_channel',
                destination : 'new_channel'
            });
        */
        'replay' : function(args, callback) {
            var callback    = callback || args['callback'] || function(){}
            ,   auth_key    = args['auth_key'] || AUTH_KEY
            ,   source      = args['source']
            ,   destination = args['destination']
            ,   stop        = args['stop']
            ,   start       = args['start']
            ,   end         = args['end']
            ,   reverse     = args['reverse']
            ,   limit       = args['limit']
            ,   jsonp       = jsonp_cb()
            ,   data        = {}
            ,   url;

            // Check User Input
            if (!source)        return error('Missing Source Channel');
            if (!destination)   return error('Missing Destination Channel');
            if (!PUBLISH_KEY)   return error('Missing Publish Key');
            if (!SUBSCRIBE_KEY) return error('Missing Subscribe Key');

            // Setup URL Params
            if (jsonp != '0') data['callback'] = jsonp;
            if (stop)         data['stop']     = 'all';
            if (reverse)      data['reverse']  = 'true';
            if (start)        data['start']    = start;
            if (end)          data['end']      = end;
            if (limit)        data['count']    = limit;

            data['auth'] = auth_key;

            // Compose URL Parts
            url = [
                STD_ORIGIN, 'v1', 'replay',
                PUBLISH_KEY, SUBSCRIBE_KEY,
                source, destination
            ];

            // Start (or Stop) Replay!
            xdr({
                callback : jsonp,
                success  : function(response) {
                    _invoke_callback(response, callback, err);
                },
                fail     : function() { callback([ 0, 'Disconnected' ]) },
                url      : url,
                data     : _get_url_params(data)
            });
        },

        /*
            PUBNUB.auth('AJFLKAJSDKLA');
        */
        'auth' : function(auth) {
            AUTH_KEY = auth;
            CONNECT();
        },

        /*
            PUBNUB.time(function(time){ });
        */
        'time' : function(callback) {
            var jsonp = jsonp_cb();

            var data = { 'uuid' : UUID, 'auth' : AUTH_KEY }

            if (USE_INSTANCEID) data['instanceid'] = INSTANCEID;

            xdr({
                callback : jsonp,
                data     : _get_url_params(data),
                timeout  : SECOND * 5,
                url      : [STD_ORIGIN, 'time', jsonp],
                success  : function(response) { callback(response[0]) },
                fail     : function() { callback(0) }
            });
        },

        /*
            PUBNUB.publish({
                channel : 'my_chat_channel',
                message : 'hello!'
            });
        */
        'publish' : function( args, callback ) {
            var msg      = args['message'];
            if (!msg) return error('Missing Message');

            var callback = callback || args['callback'] || msg['callback'] || function(){}
            ,   channel  = args['channel'] || msg['channel']
            ,   auth_key = args['auth_key'] || AUTH_KEY
            ,   cipher_key = args['cipher_key']
            ,   err      = args['error'] || msg['error'] || function() {}
            ,   post     = args['post'] || false
            ,   store    = ('store_in_history' in args) ? args['store_in_history']: true
            ,   jsonp    = jsonp_cb()
            ,   add_msg  = 'push'
            ,   params
            ,   url;

            if (args['prepend']) add_msg = 'unshift'

            if (!channel)       return error('Missing Channel');
            if (!PUBLISH_KEY)   return error('Missing Publish Key');
            if (!SUBSCRIBE_KEY) return error('Missing Subscribe Key');

            if (msg['getPubnubMessage']) {
                msg = msg['getPubnubMessage']();
            }

            // If trying to send Object
            msg = JSON['stringify'](encrypt(msg, cipher_key));

            // Create URL
            url = [
                STD_ORIGIN, 'publish',
                PUBLISH_KEY, SUBSCRIBE_KEY,
                0, encode(channel),
                jsonp, encode(msg)
            ];

            params = { 'uuid' : UUID, 'auth' : auth_key }

            if (!store) params['store'] ="0"

            if (USE_INSTANCEID) params['instanceid'] = INSTANCEID;

            // Queue Message Send
            PUB_QUEUE[add_msg]({
                callback : jsonp,
                timeout  : SECOND * 5,
                url      : url,
                data     : _get_url_params(params),
                fail     : function(response){
                    _invoke_error(response, err);
                    publish(1);
                },
                success  : function(response) {
                    _invoke_callback(response, callback, err);
                    publish(1);
                },
                mode     : (post)?'POST':'GET'
            });

            // Send Message
            publish();
        },

        /*
            PUBNUB.unsubscribe({ channel : 'my_chat' });
        */
        'unsubscribe' : function(args, callback) {
            var channel       = args['channel']
            ,   channel_group = args['channel_group']
            ,   auth_key      = args['auth_key']    || AUTH_KEY
            ,   callback      = callback            || args['callback'] || function(){}
            ,   err           = args['error']       || function(){};

            TIMETOKEN   = 0;
            //SUB_RESTORE = 1;    REVISIT !!!!

            if (channel) {
                // Prepare Channel(s)
                channel = map( (
                    channel.join ? channel.join(',') : ''+channel
                ).split(','), function(channel) {
                    if (!CHANNELS[channel]) return;
                    return channel + ',' + channel + PRESENCE_SUFFIX;
                } ).join(',');

                // Iterate over Channels
                each( channel.split(','), function(ch) {
                    var CB_CALLED = true;
                    if (!ch) return;
                    CHANNELS[ch] = 0;
                    if (ch in STATE) delete STATE[ch];
                    if (READY) {
                        CB_CALLED = SELF['LEAVE']( ch, 0 , auth_key, callback, err);
                    }
                    if (!CB_CALLED) callback({action : "leave"});

                    
                } );
            }

            if (channel_group) {
                // Prepare channel group(s)
                channel_group = map( (
                    channel_group.join ? channel_group.join(',') : ''+channel_group
                ).split(','), function(channel_group) {
                    if (!CHANNEL_GROUPS[channel_group]) return;
                    return channel_group + ',' + channel_group + PRESENCE_SUFFIX;
                } ).join(',');

                // Iterate over channel groups
                each( channel_group.split(','), function(chg) {
                    var CB_CALLED = true;
                    if (!chg) return;
                    CHANNEL_GROUPS[chg] = 0;
                    if (chg in STATE) delete STATE[chg];
                    if (READY) {
                        CB_CALLED = SELF['LEAVE_GROUP']( chg, 0 , auth_key, callback, err);
                    }
                    if (!CB_CALLED) callback({action : "leave"});

                } );
            }

            // Reset Connection if Count Less
            CONNECT();
        },

        /*
            PUBNUB.subscribe({
                channel  : 'my_chat'
                callback : function(message) { }
            });
        */
        'subscribe' : function( args, callback ) {
            var channel         = args['channel']
            ,   channel_group   = args['channel_group']
            ,   callback        = callback            || args['callback']
            ,   callback        = callback            || args['message']
            ,   connect         = args['connect']     || function(){}
            ,   reconnect       = args['reconnect']   || function(){}
            ,   disconnect      = args['disconnect']  || function(){}
            ,   SUB_ERROR       = args['error']       || SUB_ERROR || function(){}
            ,   idlecb          = args['idle']        || function(){}
            ,   presence        = args['presence']    || 0
            ,   noheresync      = args['noheresync']  || 0
            ,   backfill        = args['backfill']    || 0
            ,   timetoken       = args['timetoken']   || 0
            ,   sub_timeout     = args['timeout']     || SUB_TIMEOUT
            ,   windowing       = args['windowing']   || SUB_WINDOWING
            ,   state           = args['state']
            ,   heartbeat       = args['heartbeat'] || args['pnexpires']
            ,   heartbeat_interval = args['heartbeat_interval']
            ,   restore         = args['restore'] || SUB_RESTORE;

            AUTH_KEY            = args['auth_key']    || AUTH_KEY;

            // Restore Enabled?
            SUB_RESTORE = restore;

            // Always Reset the TT
            TIMETOKEN = timetoken;

            // Make sure we have a Channel
            if (!channel && !channel_group) {
                return error('Missing Channel');
            }

            if (!callback)      return error('Missing Callback');
            if (!SUBSCRIBE_KEY) return error('Missing Subscribe Key');

            if (heartbeat || heartbeat === 0 || heartbeat_interval || heartbeat_interval === 0) {
                SELF['set_heartbeat'](heartbeat, heartbeat_interval);
            }

            // Setup Channel(s)
            if (channel) {
                each( (channel.join ? channel.join(',') : ''+channel).split(','),
                function(channel) {
                    var settings = CHANNELS[channel] || {};

                    // Store Channel State
                    CHANNELS[SUB_CHANNEL = channel] = {
                        name         : channel,
                        connected    : settings.connected,
                        disconnected : settings.disconnected,
                        subscribed   : 1,
                        callback     : SUB_CALLBACK = callback,
                        'cipher_key' : args['cipher_key'],
                        connect      : connect,
                        disconnect   : disconnect,
                        reconnect    : reconnect
                    };

                    if (state) {
                        if (channel in state) {
                            STATE[channel] = state[channel];
                        } else {
                            STATE[channel] = state;
                        }
                    }

                    // Presence Enabled?
                    if (!presence) return;

                    // Subscribe Presence Channel
                    SELF['subscribe']({
                        'channel'  : channel + PRESENCE_SUFFIX,
                        'callback' : presence,
                        'restore'  : restore
                    });

                    // Presence Subscribed?
                    if (settings.subscribed) return;

                    // See Who's Here Now?
                    if (noheresync) return;
                    SELF['here_now']({
                        'channel'  : channel,
                        'data'     : _get_url_params({ 'uuid' : UUID, 'auth' : AUTH_KEY }),
                        'callback' : function(here) {
                            each( 'uuids' in here ? here['uuids'] : [],
                            function(uid) { presence( {
                                'action'    : 'join',
                                'uuid'      : uid,
                                'timestamp' : Math.floor(rnow() / 1000),
                                'occupancy' : here['occupancy'] || 1
                            }, here, channel ); } );
                        }
                    });
                } );
            }

            // Setup Channel Groups
            if (channel_group) {
                each( (channel_group.join ? channel_group.join(',') : ''+channel_group).split(','),
                function(channel_group) {
                    var settings = CHANNEL_GROUPS[channel_group] || {};

                    CHANNEL_GROUPS[channel_group] = {
                        name         : channel_group,
                        connected    : settings.connected,
                        disconnected : settings.disconnected,
                        subscribed   : 1,
                        callback     : SUB_CALLBACK = callback,
                        'cipher_key' : args['cipher_key'],
                        connect      : connect,
                        disconnect   : disconnect,
                        reconnect    : reconnect
                    };

                    // Presence Enabled?
                    if (!presence) return;

                    // Subscribe Presence Channel
                    SELF['subscribe']({
                        'channel_group'  : channel_group + PRESENCE_SUFFIX,
                        'callback' : presence,
                        'restore'  : restore,
                        'auth_key' : AUTH_KEY
                    });

                    // Presence Subscribed?
                    if (settings.subscribed) return;

                    // See Who's Here Now?
                    if (noheresync) return;
                    SELF['here_now']({
                        'channel_group'  : channel_group,
                        'data'           : _get_url_params({ 'uuid' : UUID, 'auth' : AUTH_KEY }),
                        'callback' : function(here) {
                            each( 'uuids' in here ? here['uuids'] : [],
                            function(uid) { presence( {
                                'action'    : 'join',
                                'uuid'      : uid,
                                'timestamp' : Math.floor(rnow() / 1000),
                                'occupancy' : here['occupancy'] || 1
                            }, here, channel_group ); } );
                        }
                    });
                } );
            }


            // Test Network Connection
            function _test_connection(success) {
                if (success) {
                    // Begin Next Socket Connection
                    timeout( CONNECT, windowing);
                }
                else {
                    // New Origin on Failed Connection
                    STD_ORIGIN = nextorigin( ORIGIN, 1 );
                    SUB_ORIGIN = nextorigin( ORIGIN, 1 );

                    // Re-test Connection
                    timeout( function() {
                        SELF['time'](_test_connection);
                    }, SECOND );
                }

                // Disconnect & Reconnect
                each_channel(function(channel){
                    // Reconnect
                    if (success && channel.disconnected) {
                        channel.disconnected = 0;
                        return channel.reconnect(channel.name);
                    }

                    // Disconnect
                    if (!success && !channel.disconnected) {
                        channel.disconnected = 1;
                        channel.disconnect(channel.name);
                    }
                });
                
                // Disconnect & Reconnect for channel groups
                each_channel_group(function(channel_group){
                    // Reconnect
                    if (success && channel_group.disconnected) {
                        channel_group.disconnected = 0;
                        return channel_group.reconnect(channel_group.name);
                    }

                    // Disconnect
                    if (!success && !channel_group.disconnected) {
                        channel_group.disconnected = 1;
                        channel_group.disconnect(channel_group.name);
                    }
                });
            }

            // Evented Subscribe
            function _connect() {
                var jsonp           = jsonp_cb()
                ,   channels        = generate_channel_list(CHANNELS).join(',')
                ,   channel_groups  = generate_channel_group_list(CHANNEL_GROUPS).join(',');

                // Stop Connection
                if (!channels && !channel_groups) return;

                if (!channels) channels = ',';

                // Connect to PubNub Subscribe Servers
                _reset_offline();

                var data = _get_url_params({ 'uuid' : UUID, 'auth' : AUTH_KEY });

                if (channel_groups) {
                    data['channel-group'] = channel_groups;
                }


                var st = JSON.stringify(STATE);
                if (st.length > 2) data['state'] = JSON.stringify(STATE);

                if (PRESENCE_HB) data['heartbeat'] = PRESENCE_HB;

                if (USE_INSTANCEID) data['instanceid'] = INSTANCEID;

                start_presence_heartbeat();
                SUB_RECEIVER = xdr({
                    timeout  : sub_timeout,
                    callback : jsonp,
                    fail     : function(response) {
                        if (response && response['error'] && response['service']) {
                            _invoke_error(response, SUB_ERROR);
                            _test_connection(1);
                        } else {
                            SELF['time'](function(success){
                                !success && ( _invoke_error(response, SUB_ERROR));
                                _test_connection(success);
                            });
                        }
                    },
                    data     : _get_url_params(data),
                    url      : [
                        SUB_ORIGIN, 'subscribe',
                        SUBSCRIBE_KEY, encode(channels),
                        jsonp, TIMETOKEN
                    ],
                    success : function(messages) {

                        // Check for Errors
                        if (!messages || (
                            typeof messages == 'object' &&
                            'error' in messages         &&
                            messages['error']
                        )) {
                            SUB_ERROR(messages['error']);
                            return timeout( CONNECT, SECOND );
                        }

                        // User Idle Callback
                        idlecb(messages[1]);

                        // Restore Previous Connection Point if Needed
                        TIMETOKEN = !TIMETOKEN               &&
                                    SUB_RESTORE              &&
                                    db['get'](SUBSCRIBE_KEY) || messages[1];

                        /*
                        // Connect
                        each_channel_registry(function(registry){
                            if (registry.connected) return;
                            registry.connected = 1;
                            registry.connect(channel.name);
                        });
                        */

                        // Connect
                        each_channel(function(channel){
                            if (channel.connected) return;
                            channel.connected = 1;
                            channel.connect(channel.name);
                        });

                        // Connect for channel groups
                        each_channel_group(function(channel_group){
                            if (channel_group.connected) return;
                            channel_group.connected = 1;
                            channel_group.connect(channel_group.name);
                        });

                        if (RESUMED && !SUB_RESTORE) {
                                TIMETOKEN = 0;
                                RESUMED = false;
                                // Update Saved Timetoken
                                db['set']( SUBSCRIBE_KEY, 0 );
                                timeout( _connect, windowing );
                                return;
                        }

                        // Invoke Memory Catchup and Receive Up to 100
                        // Previous Messages from the Queue.
                        if (backfill) {
                            TIMETOKEN = 10000;
                            backfill  = 0;
                        }

                        // Update Saved Timetoken
                        db['set']( SUBSCRIBE_KEY, messages[1] );

                        // Route Channel <---> Callback for Message
                        var next_callback = (function() {
                            var channels = '';
                            var channels2 = '';

                            if (messages.length > 3) {
                                channels  = messages[3];
                                channels2 = messages[2];
                            } else if (messages.length > 2) {
                                channels = messages[2];
                            } else {
                                channels =  map(
                                    generate_channel_list(CHANNELS), function(chan) { return map(
                                        Array(messages[0].length)
                                        .join(',').split(','),
                                        function() { return chan; }
                                    ) }).join(',')
                            }

                            var list  = channels.split(',');
                            var list2 = (channels2)?channels2.split(','):[];

                            return function() {
                                var channel  = list.shift()||SUB_CHANNEL;
                                var channel2 = list2.shift();

                                var chobj = {};

                                if (channel2) {
                                    if (channel && channel.indexOf('-pnpres') >= 0 
                                        && channel2.indexOf('-pnpres') < 0) {
                                        channel2 += '-pnpres';
                                    }
                                    chobj = CHANNEL_GROUPS[channel2] || CHANNELS[channel2] || {'callback' : function(){}};
                                } else {
                                    chobj = CHANNELS[channel];
                                }

                                var r = [
                                    chobj
                                    .callback||SUB_CALLBACK,
                                    channel.split(PRESENCE_SUFFIX)[0]
                                ];
                                channel2 && r.push(channel2.split(PRESENCE_SUFFIX)[0]);
                                return r;
                            };
                        })();

                        var latency = detect_latency(+messages[1]);
                        each( messages[0], function(msg) {
                            var next = next_callback();
                            var decrypted_msg = decrypt(msg,
                                (CHANNELS[next[1]])?CHANNELS[next[1]]['cipher_key']:null);
                            next[0] && next[0]( decrypted_msg, messages, next[2] || next[1], latency, next[1]);
                        });

                        timeout( _connect, windowing );
                    }
                });
            }

            CONNECT = function() {
                _reset_offline();
                timeout( _connect, windowing );
            };

            // Reduce Status Flicker
            if (!READY) return READY_BUFFER.push(CONNECT);

            // Connect Now
            CONNECT();
        },

        /*
            PUBNUB.here_now({ channel : 'my_chat', callback : fun });
        */
        'here_now' : function( args, callback ) {
            var callback = args['callback'] || callback
            ,   err      = args['error']    || function(){}
            ,   auth_key = args['auth_key'] || AUTH_KEY
            ,   channel  = args['channel']
            ,   channel_group = args['channel_group']
            ,   jsonp    = jsonp_cb()
            ,   uuids    = ('uuids' in args) ? args['uuids'] : true
            ,   state    = args['state']
            ,   data     = { 'uuid' : UUID, 'auth' : auth_key };

            if (!uuids) data['disable_uuids'] = 1;
            if (state) data['state'] = 1;

            // Make sure we have a Channel
            if (!callback)      return error('Missing Callback');
            if (!SUBSCRIBE_KEY) return error('Missing Subscribe Key');

            var url = [
                    STD_ORIGIN, 'v2', 'presence',
                    'sub_key', SUBSCRIBE_KEY
                ];

            channel && url.push('channel') && url.push(encode(channel));

            if (jsonp != '0') { data['callback'] = jsonp; }

            if (channel_group) {
                data['channel-group'] = channel_group;
                !channel && url.push('channel') && url.push(','); 
            }

            if (USE_INSTANCEID) data['instanceid'] = INSTANCEID;

            xdr({
                callback : jsonp,
                data     : _get_url_params(data),
                success  : function(response) {
                    _invoke_callback(response, callback, err);
                },
                fail     : function(response) {
                    _invoke_error(response, err);
                },
                url      : url
            });
        },

        /*
            PUBNUB.current_channels_by_uuid({ channel : 'my_chat', callback : fun });
        */
        'where_now' : function( args, callback ) {
            var callback = args['callback'] || callback
            ,   err      = args['error']    || function(){}
            ,   auth_key = args['auth_key'] || AUTH_KEY
            ,   jsonp    = jsonp_cb()
            ,   uuid     = args['uuid']     || UUID
            ,   data     = { 'auth' : auth_key };

            // Make sure we have a Channel
            if (!callback)      return error('Missing Callback');
            if (!SUBSCRIBE_KEY) return error('Missing Subscribe Key');

            if (jsonp != '0') { data['callback'] = jsonp; }

            if (USE_INSTANCEID) data['instanceid'] = INSTANCEID;

            xdr({
                callback : jsonp,
                data     : _get_url_params(data),
                success  : function(response) {
                    _invoke_callback(response, callback, err);
                },
                fail     : function(response) {
                    _invoke_error(response, err);
                },
                url      : [
                    STD_ORIGIN, 'v2', 'presence',
                    'sub_key', SUBSCRIBE_KEY,
                    'uuid', encode(uuid)
                ]
            });
        },

        'state' : function(args, callback) {
            var callback = args['callback'] || callback || function(r) {}
            ,   err      = args['error']    || function(){}
            ,   auth_key = args['auth_key'] || AUTH_KEY
            ,   jsonp    = jsonp_cb()
            ,   state    = args['state']
            ,   uuid     = args['uuid'] || UUID
            ,   channel  = args['channel']
            ,   channel_group = args['channel_group']
            ,   url
            ,   data     = _get_url_params({ 'auth' : auth_key });

            // Make sure we have a Channel
            if (!SUBSCRIBE_KEY) return error('Missing Subscribe Key');
            if (!uuid) return error('Missing UUID');
            if (!channel && !channel_group) return error('Missing Channel');

            if (jsonp != '0') { data['callback'] = jsonp; }

            if (typeof channel != 'undefined'
                && CHANNELS[channel] && CHANNELS[channel].subscribed ) {
                if (state) STATE[channel] = state;
            }

            if (typeof channel_group != 'undefined'
                && CHANNEL_GROUPS[channel_group]
                && CHANNEL_GROUPS[channel_group].subscribed
                ) {
                if (state) STATE[channel_group] = state;
                data['channel-group'] = channel_group;

                if (!channel) {
                    channel = ',';
                }
            }

            data['state'] = JSON.stringify(state);

            if (USE_INSTANCEID) data['instanceid'] = INSTANCEID;

            if (state) {
                url      = [
                    STD_ORIGIN, 'v2', 'presence',
                    'sub-key', SUBSCRIBE_KEY,
                    'channel', channel,
                    'uuid', uuid, 'data'
                ]
            } else {
                url      = [
                    STD_ORIGIN, 'v2', 'presence',
                    'sub-key', SUBSCRIBE_KEY,
                    'channel', channel,
                    'uuid', encode(uuid)
                ]
            }

            xdr({
                callback : jsonp,
                data     : _get_url_params(data),
                success  : function(response) {
                    _invoke_callback(response, callback, err);
                },
                fail     : function(response) {
                    _invoke_error(response, err);
                },
                url      : url

            });

        },

        /*
            PUBNUB.grant({
                channel  : 'my_chat',
                callback : fun,
                error    : fun,
                ttl      : 24 * 60, // Minutes
                read     : true,
                write    : true,
                auth_key : '3y8uiajdklytowsj'
            });
        */
        'grant' : function( args, callback ) {
            var callback        = args['callback'] || callback
            ,   err             = args['error']    || function(){}
            ,   channel         = args['channel']  || args['channels']
            ,   channel_group   = args['channel_group']
            ,   jsonp           = jsonp_cb()
            ,   ttl             = args['ttl']
            ,   r               = (args['read'] )?"1":"0"
            ,   w               = (args['write'])?"1":"0"
            ,   m               = (args['manage'])?"1":"0"
            ,   auth_key        = args['auth_key'] || args['auth_keys'];

            if (!callback)      return error('Missing Callback');
            if (!SUBSCRIBE_KEY) return error('Missing Subscribe Key');
            if (!PUBLISH_KEY)   return error('Missing Publish Key');
            if (!SECRET_KEY)    return error('Missing Secret Key');

            var timestamp  = Math.floor(new Date().getTime() / 1000)
            ,   sign_input = SUBSCRIBE_KEY + "\n" + PUBLISH_KEY + "\n"
                    + "grant" + "\n";

            var data = {
                'w'         : w,
                'r'         : r,
                'timestamp' : timestamp
            };
            if (args['manage']) {
                data['m'] = m;
            }
            if (isArray(channel)) {
                channel = channel['join'](',');
            }
            if (isArray(auth_key)) {
                auth_key = auth_key['join'](',');
            }
            if (typeof channel != 'undefined' && channel != null && channel.length > 0) data['channel'] = channel;
            if (typeof channel_group != 'undefined' && channel_group != null && channel_group.length > 0) {
                data['channel-group'] = channel_group;
            }
            if (jsonp != '0') { data['callback'] = jsonp; }
            if (ttl || ttl === 0) data['ttl'] = ttl;

            if (auth_key) data['auth'] = auth_key;

            data = _get_url_params(data)

            if (!auth_key) delete data['auth'];

            sign_input += _get_pam_sign_input_from_params(data);

            var signature = hmac_SHA256( sign_input, SECRET_KEY );

            signature = signature.replace( /\+/g, "-" );
            signature = signature.replace( /\//g, "_" );

            data['signature'] = signature;

            xdr({
                callback : jsonp,
                data     : data,
                success  : function(response) {
                    _invoke_callback(response, callback, err);
                },
                fail     : function(response) {
                    _invoke_error(response, err);
                },
                url      : [
                    STD_ORIGIN, 'v1', 'auth', 'grant' ,
                    'sub-key', SUBSCRIBE_KEY
                ]
            });
        },

        /*
         PUBNUB.mobile_gw_provision ({
         device_id: 'A655FBA9931AB',
         op       : 'add' | 'remove',
         gw_type  : 'apns' | 'gcm',
         channel  : 'my_chat',
         callback : fun,
         error    : fun,
         });
         */

        'mobile_gw_provision' : function( args ) {

            var callback = args['callback'] || function(){}
                ,   auth_key       = args['auth_key'] || AUTH_KEY
                ,   err            = args['error'] || function() {}
                ,   jsonp          = jsonp_cb()
                ,   channel        = args['channel']
                ,   op             = args['op']
                ,   gw_type        = args['gw_type']
                ,   device_id      = args['device_id']
                ,   params
                ,   url;

            if (!device_id)     return error('Missing Device ID (device_id)');
            if (!gw_type)       return error('Missing GW Type (gw_type: gcm or apns)');
            if (!op)            return error('Missing GW Operation (op: add or remove)');
            if (!channel)       return error('Missing gw destination Channel (channel)');
            if (!PUBLISH_KEY)   return error('Missing Publish Key');
            if (!SUBSCRIBE_KEY) return error('Missing Subscribe Key');

            // Create URL
            url = [
                STD_ORIGIN, 'v1/push/sub-key',
                SUBSCRIBE_KEY, 'devices', device_id
            ];

            params = { 'uuid' : UUID, 'auth' : auth_key, 'type': gw_type};

            if (op == "add") {
                params['add'] = channel;
            } else if (op == "remove") {
                params['remove'] = channel;
            }

            if (USE_INSTANCEID) data['instanceid'] = INSTANCEID;

            xdr({
                callback : jsonp,
                data     : params,
                success  : function(response) {
                    _invoke_callback(response, callback, err);
                },
                fail     : function(response) {
                    _invoke_error(response, err);
                },
                url      : url
            });

        },

        /*
            PUBNUB.audit({
                channel  : 'my_chat',
                callback : fun,
                error    : fun,
                read     : true,
                write    : true,
                auth_key : '3y8uiajdklytowsj'
            });
        */
        'audit' : function( args, callback ) {
            var callback        = args['callback'] || callback
            ,   err             = args['error']    || function(){}
            ,   channel         = args['channel']
            ,   channel_group   = args['channel_group']
            ,   auth_key        = args['auth_key']
            ,   jsonp           = jsonp_cb();

            // Make sure we have a Channel
            if (!callback)      return error('Missing Callback');
            if (!SUBSCRIBE_KEY) return error('Missing Subscribe Key');
            if (!PUBLISH_KEY)   return error('Missing Publish Key');
            if (!SECRET_KEY)    return error('Missing Secret Key');

            var timestamp  = Math.floor(new Date().getTime() / 1000)
            ,   sign_input = SUBSCRIBE_KEY + "\n"
                + PUBLISH_KEY + "\n"
                + "audit" + "\n";

            var data = {'timestamp' : timestamp };
            if (jsonp != '0') { data['callback'] = jsonp; }
            if (typeof channel != 'undefined' && channel != null && channel.length > 0) data['channel'] = channel;
            if (typeof channel_group != 'undefined' && channel_group != null && channel_group.length > 0) {
                data['channel-group'] = channel_group;
            }
            if (auth_key) data['auth']    = auth_key;

            data = _get_url_params(data);

            if (!auth_key) delete data['auth'];

            sign_input += _get_pam_sign_input_from_params(data);

            var signature = hmac_SHA256( sign_input, SECRET_KEY );

            signature = signature.replace( /\+/g, "-" );
            signature = signature.replace( /\//g, "_" );

            data['signature'] = signature;
            xdr({
                callback : jsonp,
                data     : data,
                success  : function(response) {
                    _invoke_callback(response, callback, err);
                },
                fail     : function(response) {
                    _invoke_error(response, err);
                },
                url      : [
                    STD_ORIGIN, 'v1', 'auth', 'audit' ,
                    'sub-key', SUBSCRIBE_KEY
                ]
            });
        },

        /*
            PUBNUB.revoke({
                channel  : 'my_chat',
                callback : fun,
                error    : fun,
                auth_key : '3y8uiajdklytowsj'
            });
        */
        'revoke' : function( args, callback ) {
            args['read']  = false;
            args['write'] = false;
            SELF['grant']( args, callback );
        },
        'set_uuid' : function(uuid) {
            UUID = uuid;
            CONNECT();
        },
        'get_uuid' : function() {
            return UUID;
        },
        'isArray'  : function(arg) {
            return isArray(arg);
        },
        'get_subscibed_channels' : function() {
            return generate_channel_list(CHANNELS, true);
        },
        'presence_heartbeat' : function(args) {
            var callback = args['callback'] || function() {}
            var err      = args['error']    || function() {}
            var jsonp    = jsonp_cb();
            var data     = { 'uuid' : UUID, 'auth' : AUTH_KEY };

            var st = JSON['stringify'](STATE);
            if (st.length > 2) data['state'] = JSON['stringify'](STATE);

            if (PRESENCE_HB > 0 && PRESENCE_HB < 320) data['heartbeat'] = PRESENCE_HB;

            if (jsonp != '0') { data['callback'] = jsonp; }

            var channels        = encode(generate_channel_list(CHANNELS, true)['join'](','));
            var channel_groups  = generate_channel_group_list(CHANNEL_GROUPS, true)['join'](',');

            if (!channels) channels = ',';
            if (channel_groups) data['channel-group'] = channel_groups;

            if (USE_INSTANCEID) data['instanceid'] = INSTANCEID;

            xdr({
                callback : jsonp,
                data     : _get_url_params(data),
                timeout  : SECOND * 5,
                url      : [
                    STD_ORIGIN, 'v2', 'presence',
                    'sub-key', SUBSCRIBE_KEY,
                    'channel' , channels,
                    'heartbeat'
                ],
                success  : function(response) {
                    _invoke_callback(response, callback, err);
                },
                fail     : function(response) { _invoke_error(response, err); }
            });
        },
        'stop_timers': function () {
            clearTimeout(_poll_timer);
            clearTimeout(_poll_timer2);
        },

        // Expose PUBNUB Functions
        'xdr'           : xdr,
        'ready'         : ready,
        'db'            : db,
        'uuid'          : generate_uuid,
        'map'           : map,
        'each'          : each,
        'each-channel'  : each_channel,
        'grep'          : grep,
        'offline'       : function(){ _reset_offline(
            1, { "message" : "Offline. Please check your network settings." })
        },
        'supplant'      : supplant,
        'now'           : rnow,
        'unique'        : unique,
        'updater'       : updater
    };

    function _poll_online() {
        _is_online() || _reset_offline( 1, {
            "error" : "Offline. Please check your network settings. "
        });
        _poll_timer && clearTimeout(_poll_timer);
        _poll_timer = timeout( _poll_online, SECOND );
    }

    function _poll_online2() {
        if (!TIME_CHECK) return;
        SELF['time'](function(success){
            detect_time_detla( function(){}, success );
            success || _reset_offline( 1, {
                "error" : "Heartbeat failed to connect to Pubnub Servers." +
                    "Please check your network settings."
                });
            _poll_timer2 && clearTimeout(_poll_timer2);
            _poll_timer2 = timeout( _poll_online2, KEEPALIVE );
        });
    }

    function _reset_offline(err, msg) {
        SUB_RECEIVER && SUB_RECEIVER(err, msg);
        SUB_RECEIVER = null;

        clearTimeout(_poll_timer);
        clearTimeout(_poll_timer2);
    }
    
    if (!UUID) UUID = SELF['uuid']();
    if (!INSTANCEID) INSTANCEID = SELF['uuid']();
    db['set']( SUBSCRIBE_KEY + 'uuid', UUID );

    _poll_timer  = timeout( _poll_online,  SECOND    );
    _poll_timer2 = timeout( _poll_online2, KEEPALIVE );
    PRESENCE_HB_TIMEOUT = timeout(
        start_presence_heartbeat,
        ( PRESENCE_HB_INTERVAL - 3 ) * SECOND
    );

    // Detect Age of Message
    function detect_latency(tt) {
        var adjusted_time = rnow() - TIME_DRIFT;
        return adjusted_time - tt / 10000;
    }

    detect_time_detla();
    function detect_time_detla( cb, time ) {
        var stime = rnow();

        time && calculate(time) || SELF['time'](calculate);

        function calculate(time) {
            if (!time) return;
            var ptime   = time / 10000
            ,   latency = (rnow() - stime) / 2;
            TIME_DRIFT = rnow() - (ptime + latency);
            cb && cb(TIME_DRIFT);
        }
    }

    return SELF;
}
function crypto_obj() {

    function SHA256(s) {
        return CryptoJS['SHA256'](s)['toString'](CryptoJS['enc']['Hex']);
    }

    var iv = "0123456789012345";

    var allowedKeyEncodings = ['hex', 'utf8', 'base64', 'binary'];
    var allowedKeyLengths = [128, 256];
    var allowedModes = ['ecb', 'cbc'];

    var defaultOptions = {
        'encryptKey': true,
        'keyEncoding': 'utf8',
        'keyLength': 256,
        'mode': 'cbc'
    };

    function parse_options(options) {

        // Defaults
        options = options || {};
        if (!options['hasOwnProperty']('encryptKey')) options['encryptKey'] = defaultOptions['encryptKey'];
        if (!options['hasOwnProperty']('keyEncoding')) options['keyEncoding'] = defaultOptions['keyEncoding'];
        if (!options['hasOwnProperty']('keyLength')) options['keyLength'] = defaultOptions['keyLength'];
        if (!options['hasOwnProperty']('mode')) options['mode'] = defaultOptions['mode'];

        // Validation
        if (allowedKeyEncodings['indexOf'](options['keyEncoding']['toLowerCase']()) == -1) options['keyEncoding'] = defaultOptions['keyEncoding'];
        if (allowedKeyLengths['indexOf'](parseInt(options['keyLength'], 10)) == -1) options['keyLength'] = defaultOptions['keyLength'];
        if (allowedModes['indexOf'](options['mode']['toLowerCase']()) == -1) options['mode'] = defaultOptions['mode'];

        return options;

    }

    function decode_key(key, options) {
        if (options['keyEncoding'] == 'base64') {
            return CryptoJS['enc']['Base64']['parse'](key);
        } else if (options['keyEncoding'] == 'hex') {
            return CryptoJS['enc']['Hex']['parse'](key);
        } else {
            return key;
        }
    }

    function get_padded_key(key, options) {
        key = decode_key(key, options);
        if (options['encryptKey']) {
            return CryptoJS['enc']['Utf8']['parse'](SHA256(key)['slice'](0, 32));
        } else {
            return key;
        }
    }

    function get_mode(options) {
        if (options['mode'] == 'ecb') {
            return CryptoJS['mode']['ECB'];
        } else {
            return CryptoJS['mode']['CBC'];
        }
    }

    function get_iv(options) {
        return (options['mode'] == 'cbc') ? CryptoJS['enc']['Utf8']['parse'](iv) : null;
    }

    return {

        'encrypt': function(data, key, options) {
            if (!key) return data;
            options = parse_options(options);
            var iv = get_iv(options);
            var mode = get_mode(options);
            var cipher_key = get_padded_key(key, options);
            var hex_message = JSON['stringify'](data);
            var encryptedHexArray = CryptoJS['AES']['encrypt'](hex_message, cipher_key, {'iv': iv, 'mode': mode})['ciphertext'];
            var base_64_encrypted = encryptedHexArray['toString'](CryptoJS['enc']['Base64']);
            return base_64_encrypted || data;
        },

        'decrypt': function(data, key, options) {
            if (!key) return data;
            options = parse_options(options);
            var iv = get_iv(options);
            var mode = get_mode(options);
            var cipher_key = get_padded_key(key, options);
            try {
                var binary_enc = CryptoJS['enc']['Base64']['parse'](data);
                var json_plain = CryptoJS['AES']['decrypt']({'ciphertext': binary_enc}, cipher_key, {'iv': iv, 'mode': mode})['toString'](CryptoJS['enc']['Utf8']);
                var plaintext = JSON['parse'](json_plain);
                return plaintext;
            }
            catch (e) {
                return undefined;
            }
        }
    };
}
/* =-====================================================================-= */
/* =-====================================================================-= */
/* =-=========================     UTIL     =============================-= */
/* =-====================================================================-= */
/* =-====================================================================-= */

window['PUBNUB'] || (function() {

/**
 * UTIL LOCALS
 */

var SWF             = 'https://pubnub.a.ssl.fastly.net/pubnub.swf'
,   ASYNC           = 'async'
,   UA              = navigator.userAgent
,   PNSDK           = 'PubNub-JS-' + 'Web' + '/' + '3.7.13'
,   XORIGN          = UA.indexOf('MSIE 6') == -1;

/**
 * CONSOLE COMPATIBILITY
 */
window.console || (window.console=window.console||{});
console.log    || (
    console.log   =
    console.error =
    ((window.opera||{}).postError||function(){})
);

/**
 * LOCAL STORAGE OR COOKIE
 */
var db = (function(){
    var store = {};
    var ls = false;
    try {
        ls = window['localStorage'];
    } catch (e) { }
    var cookieGet = function(key) {
        if (document.cookie.indexOf(key) == -1) return null;
        return ((document.cookie||'').match(
            RegExp(key+'=([^;]+)')
        )||[])[1] || null;
    };
    var cookieSet = function( key, value ) {
        document.cookie = key + '=' + value +
            '; expires=Thu, 1 Aug 2030 20:00:00 UTC; path=/';
    };
    var cookieTest = (function() {
        try {
            cookieSet('pnctest', '1');
            return cookieGet('pnctest') === '1';
        } catch (e) {
            return false;
        }
    }());
    return {
        'get' : function(key) {
            try {
                if (ls) return ls.getItem(key);
                if (cookieTest) return cookieGet(key);
                return store[key];
            } catch(e) {
                return store[key];
            }
        },
        'set' : function( key, value ) {
            try {
                if (ls) return ls.setItem( key, value ) && 0;
                if (cookieTest) cookieSet( key, value );
                store[key] = value;
            } catch(e) {
                store[key] = value;
            }
        }
    };
})();

function get_hmac_SHA256(data,key) {
    var hash = CryptoJS['HmacSHA256'](data, key);
    return hash.toString(CryptoJS['enc']['Base64']);
}

/**
 * $
 * =
 * var div = $('divid');
 */
function $(id) { return document.getElementById(id) }

/**
 * ERROR
 * =====
 * error('message');
 */
function error(message) { console['error'](message) }

/**
 * SEARCH
 * ======
 * var elements = search('a div span');
 */
function search( elements, start) {
    var list = [];
    each( elements.split(/\s+/), function(el) {
        each( (start || document).getElementsByTagName(el), function(node) {
            list.push(node);
        } );
    });
    return list;
}

/**
 * BIND
 * ====
 * bind( 'keydown', search('a')[0], function(element) {
 *     ...
 * } );
 */
function bind( type, el, fun ) {
    each( type.split(','), function(etype) {
        var rapfun = function(e) {
            if (!e) e = window.event;
            if (!fun(e)) {
                e.cancelBubble = true;
                e.preventDefault  && e.preventDefault();
                e.stopPropagation && e.stopPropagation();
            }
        };

        if ( el.addEventListener ) el.addEventListener( etype, rapfun, false );
        else if ( el.attachEvent ) el.attachEvent( 'on' + etype, rapfun );
        else  el[ 'on' + etype ] = rapfun;
    } );
}

/**
 * UNBIND
 * ======
 * unbind( 'keydown', search('a')[0] );
 */
function unbind( type, el, fun ) {
    if ( el.removeEventListener ) el.removeEventListener( type, false );
    else if ( el.detachEvent ) el.detachEvent( 'on' + type, false );
    else  el[ 'on' + type ] = null;
}

/**
 * HEAD
 * ====
 * head().appendChild(elm);
 */
function head() { return search('head')[0] }

/**
 * ATTR
 * ====
 * var attribute = attr( node, 'attribute' );
 */
function attr( node, attribute, value ) {
    if (value) node.setAttribute( attribute, value );
    else return node && node.getAttribute && node.getAttribute(attribute);
}

/**
 * CSS
 * ===
 * var obj = create('div');
 */
function css( element, styles ) {
    for (var style in styles) if (styles.hasOwnProperty(style))
        try {element.style[style] = styles[style] + (
            '|width|height|top|left|'.indexOf(style) > 0 &&
            typeof styles[style] == 'number'
            ? 'px' : ''
        )}catch(e){}
}

/**
 * CREATE
 * ======
 * var obj = create('div');
 */
function create(element) { return document.createElement(element) }


/**
 * jsonp_cb
 * ========
 * var callback = jsonp_cb();
 */
function jsonp_cb() { return XORIGN || FDomainRequest() ? 0 : unique() }



/**
 * EVENTS
 * ======
 * PUBNUB.events.bind( 'you-stepped-on-flower', function(message) {
 *     // Do Stuff with message
 * } );
 *
 * PUBNUB.events.fire( 'you-stepped-on-flower', "message-data" );
 * PUBNUB.events.fire( 'you-stepped-on-flower', {message:"data"} );
 * PUBNUB.events.fire( 'you-stepped-on-flower', [1,2,3] );
 *
 */
var events = {
    'list'   : {},
    'unbind' : function( name ) { events.list[name] = [] },
    'bind'   : function( name, fun ) {
        (events.list[name] = events.list[name] || []).push(fun);
    },
    'fire' : function( name, data ) {
        each(
            events.list[name] || [],
            function(fun) { fun(data) }
        );
    }
};

/**
 * XDR Cross Domain Request
 * ========================
 *  xdr({
 *     url     : ['http://www.blah.com/url'],
 *     success : function(response) {},
 *     fail    : function() {}
 *  });
 */
function xdr( setup ) {
    if (XORIGN || FDomainRequest()) return ajax(setup);

    var script    = create('script')
    ,   callback  = setup.callback
    ,   id        = unique()
    ,   finished  = 0
    ,   xhrtme    = setup.timeout || DEF_TIMEOUT
    ,   timer     = timeout( function(){done(1, {"message" : "timeout"})}, xhrtme )
    ,   fail      = setup.fail    || function(){}
    ,   data      = setup.data    || {}
    ,   success   = setup.success || function(){}
    ,   append    = function() { head().appendChild(script) }
    ,   done      = function( failed, response ) {
            if (finished) return;
            finished = 1;

            script.onerror = null;
            clearTimeout(timer);

            (failed || !response) || success(response);

            timeout( function() {
                failed && fail();
                var s = $(id)
                ,   p = s && s.parentNode;
                p && p.removeChild(s);
            }, SECOND );
        };

    window[callback] = function(response) {
        done( 0, response );
    };

    if (!setup.blocking) script[ASYNC] = ASYNC;

    script.onerror = function() { done(1) };
    script.src     = build_url( setup.url, data );

    attr( script, 'id', id );

    append();
    return done;
}

/**
 * CORS XHR Request
 * ================
 *  xdr({
 *     url     : ['http://www.blah.com/url'],
 *     success : function(response) {},
 *     fail    : function() {}
 *  });
 */
function ajax( setup ) {
    var xhr, response
    ,   finished = function() {
            if (loaded) return;
            loaded = 1;

            clearTimeout(timer);

            try       { response = JSON['parse'](xhr.responseText); }
            catch (r) { return done(1); }

            complete = 1;
            success(response);
        }
    ,   complete = 0
    ,   loaded   = 0
    ,   xhrtme   = setup.timeout || DEF_TIMEOUT
    ,   timer    = timeout( function(){done(1, {"message" : "timeout"})}, xhrtme )
    ,   fail     = setup.fail    || function(){}
    ,   data     = setup.data    || {}
    ,   success  = setup.success || function(){}
    ,   async    = !(setup.blocking)
    ,   done     = function(failed,response) {
            if (complete) return;
            complete = 1;

            clearTimeout(timer);

            if (xhr) {
                xhr.onerror = xhr.onload = null;
                xhr.abort && xhr.abort();
                xhr = null;
            }

            failed && fail(response);
        };

    // Send
    try {
        xhr = FDomainRequest()      ||
              window.XDomainRequest &&
              new XDomainRequest()  ||
              new XMLHttpRequest();

        xhr.onerror = xhr.onabort   = function(e){ done(
            1, e || (xhr && xhr.responseText) || { "error" : "Network Connection Error"}
        ) };
        xhr.onload  = xhr.onloadend = finished;
        xhr.onreadystatechange = function() {
            if (xhr && xhr.readyState == 4) {
                switch(xhr.status) {
                    case 200:
                        break;
                    default:
                        try {
                            response = JSON['parse'](xhr.responseText);
                            done(1,response);
                        }
                        catch (r) { return done(1, {status : xhr.status, payload : null, message : xhr.responseText}); }
                        return;
                }
            }
        }

        var url = build_url(setup.url,data);

        xhr.open( 'GET', url, async );
        if (async) xhr.timeout = xhrtme;
        xhr.send();
    }
    catch(eee) {
        done(0);
        XORIGN = 0;
        return xdr(setup);
    }

    // Return 'done'
    return done;
}

// Test Connection State
function _is_online() {
    if (!('onLine' in navigator)) return 1;
    try       { return navigator['onLine'] }
    catch (e) { return true }
}

/* =-====================================================================-= */
/* =-====================================================================-= */
/* =-=========================     PUBNUB     ===========================-= */
/* =-====================================================================-= */
/* =-====================================================================-= */

var PDIV          = $('pubnub') || 0
,   CREATE_PUBNUB = function(setup) {

    // Force JSONP if requested from user.
    if (setup['jsonp'])  XORIGN = 0;
    else                 XORIGN = UA.indexOf('MSIE 6') == -1;

    var SUBSCRIBE_KEY = setup['subscribe_key'] || ''
    ,   KEEPALIVE     = (+setup['keepalive']   || DEF_KEEPALIVE)   * SECOND
    ,   UUID          = setup['uuid'] || db['get'](SUBSCRIBE_KEY+'uuid')||'';

    var leave_on_unload = setup['leave_on_unload'] || 0;

    setup['xdr']        = xdr;
    setup['db']         = db;
    setup['error']      = setup['error'] || error;
    setup['_is_online'] = _is_online;
    setup['jsonp_cb']   = jsonp_cb;
    setup['hmac_SHA256']= get_hmac_SHA256;
    setup['crypto_obj'] = crypto_obj();
    setup['params']     = { 'pnsdk' : PNSDK }

    var SELF = function(setup) {
        return CREATE_PUBNUB(setup);
    };

    var PN = PN_API(setup);

    for (var prop in PN) {
        if (PN.hasOwnProperty(prop)) {
            SELF[prop] = PN[prop];
        }
    }
    SELF['css']         = css;
    SELF['$']           = $;
    SELF['create']      = create;
    SELF['bind']        = bind;
    SELF['head']        = head;
    SELF['search']      = search;
    SELF['attr']        = attr;
    SELF['events']      = events;
    SELF['init']        = SELF;
    SELF['secure']      = SELF;
    SELF['crypto_obj']  = crypto_obj(); // export to instance


    // Add Leave Functions
    bind( 'beforeunload', window, function() {
        if (leave_on_unload) SELF['each-channel'](function(ch){ SELF['LEAVE']( ch.name, 0 ) });
        return true;
    } );

    // Return without Testing
    if (setup['notest']) return SELF;

    bind( 'offline', window,   SELF['offline'] );
    bind( 'offline', document, SELF['offline'] );

    // Return PUBNUB Socket Object
    return SELF;
};
CREATE_PUBNUB['init']   = CREATE_PUBNUB;
CREATE_PUBNUB['secure'] = CREATE_PUBNUB;
CREATE_PUBNUB['crypto_obj'] = crypto_obj(); // export to constructor

// Bind for PUBNUB Readiness to Subscribe
if (document.readyState === 'complete') {
    timeout( ready, 0 );
}
else {
    bind( 'load', window, function(){ timeout( ready, 0 ) } );
}

var pdiv = PDIV || {};

// CREATE A PUBNUB GLOBAL OBJECT
PUBNUB = CREATE_PUBNUB({
    'notest'        : 1,
    'publish_key'   : attr( pdiv, 'pub-key' ),
    'subscribe_key' : attr( pdiv, 'sub-key' ),
    'ssl'           : !document.location.href.indexOf('https') ||
                      attr( pdiv, 'ssl' ) == 'on',
    'origin'        : attr( pdiv, 'origin' ),
    'uuid'          : attr( pdiv, 'uuid' )
});

// jQuery Interface
window['jQuery'] && (window['jQuery']['PUBNUB'] = CREATE_PUBNUB);

// For Modern JS + Testling.js - http://testling.com/
typeof(module) !== 'undefined' && (module['exports'] = PUBNUB) && ready();

var pubnubs = $('pubnubs') || 0;

// LEAVE NOW IF NO PDIV.
if (!PDIV) return;

// PUBNUB Flash Socket
css( PDIV, { 'position' : 'absolute', 'top' : -SECOND } );

if ('opera' in window || attr( PDIV, 'flash' )) PDIV['innerHTML'] =
    '<object id=pubnubs data='  + SWF +
    '><param name=movie value=' + SWF +
    '><param name=allowscriptaccess value=always></object>';

// Create Interface for Opera Flash
PUBNUB['rdx'] = function( id, data ) {
    if (!data) return FDomainRequest[id]['onerror']();
    FDomainRequest[id]['responseText'] = unescape(data);
    FDomainRequest[id]['onload']();
};

function FDomainRequest() {
    if (!pubnubs || !pubnubs['get']) return 0;

    var fdomainrequest = {
        'id'    : FDomainRequest['id']++,
        'send'  : function() {},
        'abort' : function() { fdomainrequest['id'] = {} },
        'open'  : function( method, url ) {
            FDomainRequest[fdomainrequest['id']] = fdomainrequest;
            pubnubs['get']( fdomainrequest['id'], url );
        }
    };

    return fdomainrequest;
}
FDomainRequest['id'] = SECOND;

})();
(function(){

// ---------------------------------------------------------------------------
// WEBSOCKET INTERFACE
// ---------------------------------------------------------------------------
var WS = PUBNUB['ws'] = function( url, protocols ) {
    if (!(this instanceof WS)) return new WS( url, protocols );

    var self     = this
    ,   url      = self.url      = url || ''
    ,   protocol = self.protocol = protocols || 'Sec-WebSocket-Protocol'
    ,   bits     = url.split('/')
    ,   setup    = {
         'ssl'           : bits[0] === 'wss:'
        ,'origin'        : bits[2]
        ,'publish_key'   : bits[3]
        ,'subscribe_key' : bits[4]
        ,'channel'       : bits[5]
    };

    // READY STATES
    self['CONNECTING'] = 0; // The connection is not yet open.
    self['OPEN']       = 1; // The connection is open and ready to communicate.
    self['CLOSING']    = 2; // The connection is in the process of closing.
    self['CLOSED']     = 3; // The connection is closed or couldn't be opened.

    // CLOSE STATES
    self['CLOSE_NORMAL']         = 1000; // Normal Intended Close; completed.
    self['CLOSE_GOING_AWAY']     = 1001; // Closed Unexpecttedly.
    self['CLOSE_PROTOCOL_ERROR'] = 1002; // Server: Not Supported.
    self['CLOSE_UNSUPPORTED']    = 1003; // Server: Unsupported Protocol.
    self['CLOSE_TOO_LARGE']      = 1004; // Server: Too Much Data.
    self['CLOSE_NO_STATUS']      = 1005; // Server: No reason.
    self['CLOSE_ABNORMAL']       = 1006; // Abnormal Disconnect.

    // Events Default
    self['onclose']   = self['onerror'] =
    self['onmessage'] = self['onopen']  =
    self['onsend']    =  function(){};

    // Attributes
    self['binaryType']     = '';
    self['extensions']     = '';
    self['bufferedAmount'] = 0;
    self['trasnmitting']   = false;
    self['buffer']         = [];
    self['readyState']     = self['CONNECTING'];

    // Close if no setup.
    if (!url) {
        self['readyState'] = self['CLOSED'];
        self['onclose']({
            'code'     : self['CLOSE_ABNORMAL'],
            'reason'   : 'Missing URL',
            'wasClean' : true
        });
        return self;
    }

    // PubNub WebSocket Emulation
    self.pubnub       = PUBNUB['init'](setup);
    self.pubnub.setup = setup;
    self.setup        = setup;

    self.pubnub['subscribe']({
        'restore'    : false,
        'channel'    : setup['channel'],
        'disconnect' : self['onerror'],
        'reconnect'  : self['onopen'],
        'error'      : function() {
            self['onclose']({
                'code'     : self['CLOSE_ABNORMAL'],
                'reason'   : 'Missing URL',
                'wasClean' : false
            });
        },
        'callback'   : function(message) {
            self['onmessage']({ 'data' : message });
        },
        'connect'    : function() {
            self['readyState'] = self['OPEN'];
            self['onopen']();
        }
    });
};

// ---------------------------------------------------------------------------
// WEBSOCKET SEND
// ---------------------------------------------------------------------------
WS.prototype.send = function(data) {
    var self = this;
    self.pubnub['publish']({
        'channel'  : self.pubnub.setup['channel'],
        'message'  : data,
        'callback' : function(response) {
            self['onsend']({ 'data' : response });
        }
    });
};

// ---------------------------------------------------------------------------
// WEBSOCKET CLOSE
// ---------------------------------------------------------------------------
WS.prototype.close = function() {
    var self = this;
    self.pubnub['unsubscribe']({ 'channel' : self.pubnub.setup['channel'] });
    self['readyState'] = self['CLOSED'];
    self['onclose']({});
};

})();
/*
CryptoJS v3.1.2
code.google.com/p/crypto-js
(c) 2009-2013 by Jeff Mott. All rights reserved.
code.google.com/p/crypto-js/wiki/License
*/
var CryptoJS=CryptoJS||function(h,s){var f={},g=f.lib={},q=function(){},m=g.Base={extend:function(a){q.prototype=this;var c=new q;a&&c.mixIn(a);c.hasOwnProperty("init")||(c.init=function(){c.$super.init.apply(this,arguments)});c.init.prototype=c;c.$super=this;return c},create:function(){var a=this.extend();a.init.apply(a,arguments);return a},init:function(){},mixIn:function(a){for(var c in a)a.hasOwnProperty(c)&&(this[c]=a[c]);a.hasOwnProperty("toString")&&(this.toString=a.toString)},clone:function(){return this.init.prototype.extend(this)}},
r=g.WordArray=m.extend({init:function(a,c){a=this.words=a||[];this.sigBytes=c!=s?c:4*a.length},toString:function(a){return(a||k).stringify(this)},concat:function(a){var c=this.words,d=a.words,b=this.sigBytes;a=a.sigBytes;this.clamp();if(b%4)for(var e=0;e<a;e++)c[b+e>>>2]|=(d[e>>>2]>>>24-8*(e%4)&255)<<24-8*((b+e)%4);else if(65535<d.length)for(e=0;e<a;e+=4)c[b+e>>>2]=d[e>>>2];else c.push.apply(c,d);this.sigBytes+=a;return this},clamp:function(){var a=this.words,c=this.sigBytes;a[c>>>2]&=4294967295<<
32-8*(c%4);a.length=h.ceil(c/4)},clone:function(){var a=m.clone.call(this);a.words=this.words.slice(0);return a},random:function(a){for(var c=[],d=0;d<a;d+=4)c.push(4294967296*h.random()|0);return new r.init(c,a)}}),l=f.enc={},k=l.Hex={stringify:function(a){var c=a.words;a=a.sigBytes;for(var d=[],b=0;b<a;b++){var e=c[b>>>2]>>>24-8*(b%4)&255;d.push((e>>>4).toString(16));d.push((e&15).toString(16))}return d.join("")},parse:function(a){for(var c=a.length,d=[],b=0;b<c;b+=2)d[b>>>3]|=parseInt(a.substr(b,
2),16)<<24-4*(b%8);return new r.init(d,c/2)}},n=l.Latin1={stringify:function(a){var c=a.words;a=a.sigBytes;for(var d=[],b=0;b<a;b++)d.push(String.fromCharCode(c[b>>>2]>>>24-8*(b%4)&255));return d.join("")},parse:function(a){for(var c=a.length,d=[],b=0;b<c;b++)d[b>>>2]|=(a.charCodeAt(b)&255)<<24-8*(b%4);return new r.init(d,c)}},j=l.Utf8={stringify:function(a){try{return decodeURIComponent(escape(n.stringify(a)))}catch(c){throw Error("Malformed UTF-8 data");}},parse:function(a){return n.parse(unescape(encodeURIComponent(a)))}},
u=g.BufferedBlockAlgorithm=m.extend({reset:function(){this._data=new r.init;this._nDataBytes=0},_append:function(a){"string"==typeof a&&(a=j.parse(a));this._data.concat(a);this._nDataBytes+=a.sigBytes},_process:function(a){var c=this._data,d=c.words,b=c.sigBytes,e=this.blockSize,f=b/(4*e),f=a?h.ceil(f):h.max((f|0)-this._minBufferSize,0);a=f*e;b=h.min(4*a,b);if(a){for(var g=0;g<a;g+=e)this._doProcessBlock(d,g);g=d.splice(0,a);c.sigBytes-=b}return new r.init(g,b)},clone:function(){var a=m.clone.call(this);
a._data=this._data.clone();return a},_minBufferSize:0});g.Hasher=u.extend({cfg:m.extend(),init:function(a){this.cfg=this.cfg.extend(a);this.reset()},reset:function(){u.reset.call(this);this._doReset()},update:function(a){this._append(a);this._process();return this},finalize:function(a){a&&this._append(a);return this._doFinalize()},blockSize:16,_createHelper:function(a){return function(c,d){return(new a.init(d)).finalize(c)}},_createHmacHelper:function(a){return function(c,d){return(new t.HMAC.init(a,
d)).finalize(c)}}});var t=f.algo={};return f}(Math);

// SHA256
(function(h){for(var s=CryptoJS,f=s.lib,g=f.WordArray,q=f.Hasher,f=s.algo,m=[],r=[],l=function(a){return 4294967296*(a-(a|0))|0},k=2,n=0;64>n;){var j;a:{j=k;for(var u=h.sqrt(j),t=2;t<=u;t++)if(!(j%t)){j=!1;break a}j=!0}j&&(8>n&&(m[n]=l(h.pow(k,0.5))),r[n]=l(h.pow(k,1/3)),n++);k++}var a=[],f=f.SHA256=q.extend({_doReset:function(){this._hash=new g.init(m.slice(0))},_doProcessBlock:function(c,d){for(var b=this._hash.words,e=b[0],f=b[1],g=b[2],j=b[3],h=b[4],m=b[5],n=b[6],q=b[7],p=0;64>p;p++){if(16>p)a[p]=
c[d+p]|0;else{var k=a[p-15],l=a[p-2];a[p]=((k<<25|k>>>7)^(k<<14|k>>>18)^k>>>3)+a[p-7]+((l<<15|l>>>17)^(l<<13|l>>>19)^l>>>10)+a[p-16]}k=q+((h<<26|h>>>6)^(h<<21|h>>>11)^(h<<7|h>>>25))+(h&m^~h&n)+r[p]+a[p];l=((e<<30|e>>>2)^(e<<19|e>>>13)^(e<<10|e>>>22))+(e&f^e&g^f&g);q=n;n=m;m=h;h=j+k|0;j=g;g=f;f=e;e=k+l|0}b[0]=b[0]+e|0;b[1]=b[1]+f|0;b[2]=b[2]+g|0;b[3]=b[3]+j|0;b[4]=b[4]+h|0;b[5]=b[5]+m|0;b[6]=b[6]+n|0;b[7]=b[7]+q|0},_doFinalize:function(){var a=this._data,d=a.words,b=8*this._nDataBytes,e=8*a.sigBytes;
d[e>>>5]|=128<<24-e%32;d[(e+64>>>9<<4)+14]=h.floor(b/4294967296);d[(e+64>>>9<<4)+15]=b;a.sigBytes=4*d.length;this._process();return this._hash},clone:function(){var a=q.clone.call(this);a._hash=this._hash.clone();return a}});s.SHA256=q._createHelper(f);s.HmacSHA256=q._createHmacHelper(f)})(Math);

// HMAC SHA256
(function(){var h=CryptoJS,s=h.enc.Utf8;h.algo.HMAC=h.lib.Base.extend({init:function(f,g){f=this._hasher=new f.init;"string"==typeof g&&(g=s.parse(g));var h=f.blockSize,m=4*h;g.sigBytes>m&&(g=f.finalize(g));g.clamp();for(var r=this._oKey=g.clone(),l=this._iKey=g.clone(),k=r.words,n=l.words,j=0;j<h;j++)k[j]^=1549556828,n[j]^=909522486;r.sigBytes=l.sigBytes=m;this.reset()},reset:function(){var f=this._hasher;f.reset();f.update(this._iKey)},update:function(f){this._hasher.update(f);return this},finalize:function(f){var g=
this._hasher;f=g.finalize(f);g.reset();return g.finalize(this._oKey.clone().concat(f))}})})();

// Base64
(function(){var u=CryptoJS,p=u.lib.WordArray;u.enc.Base64={stringify:function(d){var l=d.words,p=d.sigBytes,t=this._map;d.clamp();d=[];for(var r=0;r<p;r+=3)for(var w=(l[r>>>2]>>>24-8*(r%4)&255)<<16|(l[r+1>>>2]>>>24-8*((r+1)%4)&255)<<8|l[r+2>>>2]>>>24-8*((r+2)%4)&255,v=0;4>v&&r+0.75*v<p;v++)d.push(t.charAt(w>>>6*(3-v)&63));if(l=t.charAt(64))for(;d.length%4;)d.push(l);return d.join("")},parse:function(d){var l=d.length,s=this._map,t=s.charAt(64);t&&(t=d.indexOf(t),-1!=t&&(l=t));for(var t=[],r=0,w=0;w<
l;w++)if(w%4){var v=s.indexOf(d.charAt(w-1))<<2*(w%4),b=s.indexOf(d.charAt(w))>>>6-2*(w%4);t[r>>>2]|=(v|b)<<24-8*(r%4);r++}return p.create(t,r)},_map:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/="}})();

// BlockCipher
(function(u){function p(b,n,a,c,e,j,k){b=b+(n&a|~n&c)+e+k;return(b<<j|b>>>32-j)+n}function d(b,n,a,c,e,j,k){b=b+(n&c|a&~c)+e+k;return(b<<j|b>>>32-j)+n}function l(b,n,a,c,e,j,k){b=b+(n^a^c)+e+k;return(b<<j|b>>>32-j)+n}function s(b,n,a,c,e,j,k){b=b+(a^(n|~c))+e+k;return(b<<j|b>>>32-j)+n}for(var t=CryptoJS,r=t.lib,w=r.WordArray,v=r.Hasher,r=t.algo,b=[],x=0;64>x;x++)b[x]=4294967296*u.abs(u.sin(x+1))|0;r=r.MD5=v.extend({_doReset:function(){this._hash=new w.init([1732584193,4023233417,2562383102,271733878])},
_doProcessBlock:function(q,n){for(var a=0;16>a;a++){var c=n+a,e=q[c];q[c]=(e<<8|e>>>24)&16711935|(e<<24|e>>>8)&4278255360}var a=this._hash.words,c=q[n+0],e=q[n+1],j=q[n+2],k=q[n+3],z=q[n+4],r=q[n+5],t=q[n+6],w=q[n+7],v=q[n+8],A=q[n+9],B=q[n+10],C=q[n+11],u=q[n+12],D=q[n+13],E=q[n+14],x=q[n+15],f=a[0],m=a[1],g=a[2],h=a[3],f=p(f,m,g,h,c,7,b[0]),h=p(h,f,m,g,e,12,b[1]),g=p(g,h,f,m,j,17,b[2]),m=p(m,g,h,f,k,22,b[3]),f=p(f,m,g,h,z,7,b[4]),h=p(h,f,m,g,r,12,b[5]),g=p(g,h,f,m,t,17,b[6]),m=p(m,g,h,f,w,22,b[7]),
f=p(f,m,g,h,v,7,b[8]),h=p(h,f,m,g,A,12,b[9]),g=p(g,h,f,m,B,17,b[10]),m=p(m,g,h,f,C,22,b[11]),f=p(f,m,g,h,u,7,b[12]),h=p(h,f,m,g,D,12,b[13]),g=p(g,h,f,m,E,17,b[14]),m=p(m,g,h,f,x,22,b[15]),f=d(f,m,g,h,e,5,b[16]),h=d(h,f,m,g,t,9,b[17]),g=d(g,h,f,m,C,14,b[18]),m=d(m,g,h,f,c,20,b[19]),f=d(f,m,g,h,r,5,b[20]),h=d(h,f,m,g,B,9,b[21]),g=d(g,h,f,m,x,14,b[22]),m=d(m,g,h,f,z,20,b[23]),f=d(f,m,g,h,A,5,b[24]),h=d(h,f,m,g,E,9,b[25]),g=d(g,h,f,m,k,14,b[26]),m=d(m,g,h,f,v,20,b[27]),f=d(f,m,g,h,D,5,b[28]),h=d(h,f,
m,g,j,9,b[29]),g=d(g,h,f,m,w,14,b[30]),m=d(m,g,h,f,u,20,b[31]),f=l(f,m,g,h,r,4,b[32]),h=l(h,f,m,g,v,11,b[33]),g=l(g,h,f,m,C,16,b[34]),m=l(m,g,h,f,E,23,b[35]),f=l(f,m,g,h,e,4,b[36]),h=l(h,f,m,g,z,11,b[37]),g=l(g,h,f,m,w,16,b[38]),m=l(m,g,h,f,B,23,b[39]),f=l(f,m,g,h,D,4,b[40]),h=l(h,f,m,g,c,11,b[41]),g=l(g,h,f,m,k,16,b[42]),m=l(m,g,h,f,t,23,b[43]),f=l(f,m,g,h,A,4,b[44]),h=l(h,f,m,g,u,11,b[45]),g=l(g,h,f,m,x,16,b[46]),m=l(m,g,h,f,j,23,b[47]),f=s(f,m,g,h,c,6,b[48]),h=s(h,f,m,g,w,10,b[49]),g=s(g,h,f,m,
E,15,b[50]),m=s(m,g,h,f,r,21,b[51]),f=s(f,m,g,h,u,6,b[52]),h=s(h,f,m,g,k,10,b[53]),g=s(g,h,f,m,B,15,b[54]),m=s(m,g,h,f,e,21,b[55]),f=s(f,m,g,h,v,6,b[56]),h=s(h,f,m,g,x,10,b[57]),g=s(g,h,f,m,t,15,b[58]),m=s(m,g,h,f,D,21,b[59]),f=s(f,m,g,h,z,6,b[60]),h=s(h,f,m,g,C,10,b[61]),g=s(g,h,f,m,j,15,b[62]),m=s(m,g,h,f,A,21,b[63]);a[0]=a[0]+f|0;a[1]=a[1]+m|0;a[2]=a[2]+g|0;a[3]=a[3]+h|0},_doFinalize:function(){var b=this._data,n=b.words,a=8*this._nDataBytes,c=8*b.sigBytes;n[c>>>5]|=128<<24-c%32;var e=u.floor(a/
4294967296);n[(c+64>>>9<<4)+15]=(e<<8|e>>>24)&16711935|(e<<24|e>>>8)&4278255360;n[(c+64>>>9<<4)+14]=(a<<8|a>>>24)&16711935|(a<<24|a>>>8)&4278255360;b.sigBytes=4*(n.length+1);this._process();b=this._hash;n=b.words;for(a=0;4>a;a++)c=n[a],n[a]=(c<<8|c>>>24)&16711935|(c<<24|c>>>8)&4278255360;return b},clone:function(){var b=v.clone.call(this);b._hash=this._hash.clone();return b}});t.MD5=v._createHelper(r);t.HmacMD5=v._createHmacHelper(r)})(Math);
(function(){var u=CryptoJS,p=u.lib,d=p.Base,l=p.WordArray,p=u.algo,s=p.EvpKDF=d.extend({cfg:d.extend({keySize:4,hasher:p.MD5,iterations:1}),init:function(d){this.cfg=this.cfg.extend(d)},compute:function(d,r){for(var p=this.cfg,s=p.hasher.create(),b=l.create(),u=b.words,q=p.keySize,p=p.iterations;u.length<q;){n&&s.update(n);var n=s.update(d).finalize(r);s.reset();for(var a=1;a<p;a++)n=s.finalize(n),s.reset();b.concat(n)}b.sigBytes=4*q;return b}});u.EvpKDF=function(d,l,p){return s.create(p).compute(d,
l)}})();

// Cipher
CryptoJS.lib.Cipher||function(u){var p=CryptoJS,d=p.lib,l=d.Base,s=d.WordArray,t=d.BufferedBlockAlgorithm,r=p.enc.Base64,w=p.algo.EvpKDF,v=d.Cipher=t.extend({cfg:l.extend(),createEncryptor:function(e,a){return this.create(this._ENC_XFORM_MODE,e,a)},createDecryptor:function(e,a){return this.create(this._DEC_XFORM_MODE,e,a)},init:function(e,a,b){this.cfg=this.cfg.extend(b);this._xformMode=e;this._key=a;this.reset()},reset:function(){t.reset.call(this);this._doReset()},process:function(e){this._append(e);return this._process()},
finalize:function(e){e&&this._append(e);return this._doFinalize()},keySize:4,ivSize:4,_ENC_XFORM_MODE:1,_DEC_XFORM_MODE:2,_createHelper:function(e){return{encrypt:function(b,k,d){return("string"==typeof k?c:a).encrypt(e,b,k,d)},decrypt:function(b,k,d){return("string"==typeof k?c:a).decrypt(e,b,k,d)}}}});d.StreamCipher=v.extend({_doFinalize:function(){return this._process(!0)},blockSize:1});var b=p.mode={},x=function(e,a,b){var c=this._iv;c?this._iv=u:c=this._prevBlock;for(var d=0;d<b;d++)e[a+d]^=
c[d]},q=(d.BlockCipherMode=l.extend({createEncryptor:function(e,a){return this.Encryptor.create(e,a)},createDecryptor:function(e,a){return this.Decryptor.create(e,a)},init:function(e,a){this._cipher=e;this._iv=a}})).extend();q.Encryptor=q.extend({processBlock:function(e,a){var b=this._cipher,c=b.blockSize;x.call(this,e,a,c);b.encryptBlock(e,a);this._prevBlock=e.slice(a,a+c)}});q.Decryptor=q.extend({processBlock:function(e,a){var b=this._cipher,c=b.blockSize,d=e.slice(a,a+c);b.decryptBlock(e,a);x.call(this,
e,a,c);this._prevBlock=d}});b=b.CBC=q;q=(p.pad={}).Pkcs7={pad:function(a,b){for(var c=4*b,c=c-a.sigBytes%c,d=c<<24|c<<16|c<<8|c,l=[],n=0;n<c;n+=4)l.push(d);c=s.create(l,c);a.concat(c)},unpad:function(a){a.sigBytes-=a.words[a.sigBytes-1>>>2]&255}};d.BlockCipher=v.extend({cfg:v.cfg.extend({mode:b,padding:q}),reset:function(){v.reset.call(this);var a=this.cfg,b=a.iv,a=a.mode;if(this._xformMode==this._ENC_XFORM_MODE)var c=a.createEncryptor;else c=a.createDecryptor,this._minBufferSize=1;this._mode=c.call(a,
this,b&&b.words)},_doProcessBlock:function(a,b){this._mode.processBlock(a,b)},_doFinalize:function(){var a=this.cfg.padding;if(this._xformMode==this._ENC_XFORM_MODE){a.pad(this._data,this.blockSize);var b=this._process(!0)}else b=this._process(!0),a.unpad(b);return b},blockSize:4});var n=d.CipherParams=l.extend({init:function(a){this.mixIn(a)},toString:function(a){return(a||this.formatter).stringify(this)}}),b=(p.format={}).OpenSSL={stringify:function(a){var b=a.ciphertext;a=a.salt;return(a?s.create([1398893684,
1701076831]).concat(a).concat(b):b).toString(r)},parse:function(a){a=r.parse(a);var b=a.words;if(1398893684==b[0]&&1701076831==b[1]){var c=s.create(b.slice(2,4));b.splice(0,4);a.sigBytes-=16}return n.create({ciphertext:a,salt:c})}},a=d.SerializableCipher=l.extend({cfg:l.extend({format:b}),encrypt:function(a,b,c,d){d=this.cfg.extend(d);var l=a.createEncryptor(c,d);b=l.finalize(b);l=l.cfg;return n.create({ciphertext:b,key:c,iv:l.iv,algorithm:a,mode:l.mode,padding:l.padding,blockSize:a.blockSize,formatter:d.format})},
decrypt:function(a,b,c,d){d=this.cfg.extend(d);b=this._parse(b,d.format);return a.createDecryptor(c,d).finalize(b.ciphertext)},_parse:function(a,b){return"string"==typeof a?b.parse(a,this):a}}),p=(p.kdf={}).OpenSSL={execute:function(a,b,c,d){d||(d=s.random(8));a=w.create({keySize:b+c}).compute(a,d);c=s.create(a.words.slice(b),4*c);a.sigBytes=4*b;return n.create({key:a,iv:c,salt:d})}},c=d.PasswordBasedCipher=a.extend({cfg:a.cfg.extend({kdf:p}),encrypt:function(b,c,d,l){l=this.cfg.extend(l);d=l.kdf.execute(d,
b.keySize,b.ivSize);l.iv=d.iv;b=a.encrypt.call(this,b,c,d.key,l);b.mixIn(d);return b},decrypt:function(b,c,d,l){l=this.cfg.extend(l);c=this._parse(c,l.format);d=l.kdf.execute(d,b.keySize,b.ivSize,c.salt);l.iv=d.iv;return a.decrypt.call(this,b,c,d.key,l)}})}();

// AES
(function(){for(var u=CryptoJS,p=u.lib.BlockCipher,d=u.algo,l=[],s=[],t=[],r=[],w=[],v=[],b=[],x=[],q=[],n=[],a=[],c=0;256>c;c++)a[c]=128>c?c<<1:c<<1^283;for(var e=0,j=0,c=0;256>c;c++){var k=j^j<<1^j<<2^j<<3^j<<4,k=k>>>8^k&255^99;l[e]=k;s[k]=e;var z=a[e],F=a[z],G=a[F],y=257*a[k]^16843008*k;t[e]=y<<24|y>>>8;r[e]=y<<16|y>>>16;w[e]=y<<8|y>>>24;v[e]=y;y=16843009*G^65537*F^257*z^16843008*e;b[k]=y<<24|y>>>8;x[k]=y<<16|y>>>16;q[k]=y<<8|y>>>24;n[k]=y;e?(e=z^a[a[a[G^z]]],j^=a[a[j]]):e=j=1}var H=[0,1,2,4,8,
16,32,64,128,27,54],d=d.AES=p.extend({_doReset:function(){for(var a=this._key,c=a.words,d=a.sigBytes/4,a=4*((this._nRounds=d+6)+1),e=this._keySchedule=[],j=0;j<a;j++)if(j<d)e[j]=c[j];else{var k=e[j-1];j%d?6<d&&4==j%d&&(k=l[k>>>24]<<24|l[k>>>16&255]<<16|l[k>>>8&255]<<8|l[k&255]):(k=k<<8|k>>>24,k=l[k>>>24]<<24|l[k>>>16&255]<<16|l[k>>>8&255]<<8|l[k&255],k^=H[j/d|0]<<24);e[j]=e[j-d]^k}c=this._invKeySchedule=[];for(d=0;d<a;d++)j=a-d,k=d%4?e[j]:e[j-4],c[d]=4>d||4>=j?k:b[l[k>>>24]]^x[l[k>>>16&255]]^q[l[k>>>
8&255]]^n[l[k&255]]},encryptBlock:function(a,b){this._doCryptBlock(a,b,this._keySchedule,t,r,w,v,l)},decryptBlock:function(a,c){var d=a[c+1];a[c+1]=a[c+3];a[c+3]=d;this._doCryptBlock(a,c,this._invKeySchedule,b,x,q,n,s);d=a[c+1];a[c+1]=a[c+3];a[c+3]=d},_doCryptBlock:function(a,b,c,d,e,j,l,f){for(var m=this._nRounds,g=a[b]^c[0],h=a[b+1]^c[1],k=a[b+2]^c[2],n=a[b+3]^c[3],p=4,r=1;r<m;r++)var q=d[g>>>24]^e[h>>>16&255]^j[k>>>8&255]^l[n&255]^c[p++],s=d[h>>>24]^e[k>>>16&255]^j[n>>>8&255]^l[g&255]^c[p++],t=
d[k>>>24]^e[n>>>16&255]^j[g>>>8&255]^l[h&255]^c[p++],n=d[n>>>24]^e[g>>>16&255]^j[h>>>8&255]^l[k&255]^c[p++],g=q,h=s,k=t;q=(f[g>>>24]<<24|f[h>>>16&255]<<16|f[k>>>8&255]<<8|f[n&255])^c[p++];s=(f[h>>>24]<<24|f[k>>>16&255]<<16|f[n>>>8&255]<<8|f[g&255])^c[p++];t=(f[k>>>24]<<24|f[n>>>16&255]<<16|f[g>>>8&255]<<8|f[h&255])^c[p++];n=(f[n>>>24]<<24|f[g>>>16&255]<<16|f[h>>>8&255]<<8|f[k&255])^c[p++];a[b]=q;a[b+1]=s;a[b+2]=t;a[b+3]=n},keySize:8});u.AES=p._createHelper(d)})();

// Mode ECB
CryptoJS.mode.ECB = (function () {
    var ECB = CryptoJS.lib.BlockCipherMode.extend();

    ECB.Encryptor = ECB.extend({
        processBlock: function (words, offset) {
            this._cipher.encryptBlock(words, offset);
        }
    });

    ECB.Decryptor = ECB.extend({
        processBlock: function (words, offset) {
            this._cipher.decryptBlock(words, offset);
        }
    });

    return ECB;
}());// Moved to hmac-sha-256.js
//# sourceMappingURL=ringcentral-bundle.js.map