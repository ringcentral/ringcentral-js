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

//# sourceMappingURL=ringcentral.js.map