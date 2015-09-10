(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("es6-promise"), require("node-fetch"), require("pubnub"));
	else if(typeof define === 'function' && define.amd)
		define([, , "pubnub"], factory);
	else if(typeof exports === 'object')
		exports["SDK"] = factory(require("es6-promise"), require("node-fetch"), require("pubnub"));
	else
		root["RingCentral"] = root["RingCentral"] || {}, root["RingCentral"]["SDK"] = factory(root[undefined], root[undefined], root[undefined]);
})(this, function(__WEBPACK_EXTERNAL_MODULE_4__, __WEBPACK_EXTERNAL_MODULE_5__, __WEBPACK_EXTERNAL_MODULE_6__) {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/build/";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(1);


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

'use strict';

exports.__esModule = true;

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _coreUtils = __webpack_require__(2);

var Utils = _interopRequireWildcard(_coreUtils);

var _coreCache = __webpack_require__(7);

var _coreCache2 = _interopRequireDefault(_coreCache);

var _coreExternals = __webpack_require__(3);

var Externals = _interopRequireWildcard(_coreExternals);

var _coreObservable = __webpack_require__(8);

var _coreObservable2 = _interopRequireDefault(_coreObservable);

var _httpClient = __webpack_require__(9);

var _httpClient2 = _interopRequireDefault(_httpClient);

var _httpApiResponse = __webpack_require__(11);

var _httpApiResponse2 = _interopRequireDefault(_httpApiResponse);

var _httpUtils = __webpack_require__(10);

var HttpUtils = _interopRequireWildcard(_httpUtils);

var _mocksClientMock = __webpack_require__(12);

var _mocksClientMock2 = _interopRequireDefault(_mocksClientMock);

var _mocksMock = __webpack_require__(14);

var _mocksMock2 = _interopRequireDefault(_mocksMock);

var _mocksRegistry = __webpack_require__(13);

var _mocksRegistry2 = _interopRequireDefault(_mocksRegistry);

var _platformPlatform = __webpack_require__(15);

var _platformPlatform2 = _interopRequireDefault(_platformPlatform);

var _platformAuth = __webpack_require__(17);

var _platformAuth2 = _interopRequireDefault(_platformAuth);

var _platformQueue = __webpack_require__(16);

var _platformQueue2 = _interopRequireDefault(_platformQueue);

var _pubnubPubnubFactory = __webpack_require__(18);

var _pubnubPubnubFactory2 = _interopRequireDefault(_pubnubPubnubFactory);

var _subscriptionSubscription = __webpack_require__(20);

var _subscriptionSubscription2 = _interopRequireDefault(_subscriptionSubscription);

__webpack_require__(21);

var SDK = (function () {
    _createClass(SDK, null, [{
        key: 'version',
        value: '2.0.0',
        enumerable: true
    }, {
        key: 'server',
        value: {
            sandbox: 'https://platform.devtest.ringcentral.com',
            production: 'https://platform.ringcentral.com'
        },

        /**
         * @constructor
         * @param {object} [options]
         * @param {string} [options.server]
         * @param {string} [options.cachePrefix]
         * @param {string} [options.appSecret]
         * @param {string} [options.appKey]
         * @param {string} [options.appName]
         * @param {string} [options.appVersion]
         * @param {string} [options.pubnubFactory]
         * @param {string} [options.client]
         */
        enumerable: true
    }]);

    function SDK(options) {
        _classCallCheck(this, SDK);

        options = options || {};

        this._cache = new _coreCache2['default'](Externals.localStorage, options.cachePrefix);

        this._client = options.client || new _httpClient2['default']();

        this._platform = new _platformPlatform2['default'](this._client, this._cache, options.server, options.appKey, options.appSecret);

        this._pubnubFactory = options.pubnubFactory || Externals.PUBNUB;
    }

    /**
     * @return {Platform}
     */

    SDK.prototype.platform = function platform() {
        return this._platform;
    };

    /**
     * @return {Subscription}
     */

    SDK.prototype.createSubscription = function createSubscription() {
        return new _subscriptionSubscription2['default'](this._pubnubFactory, this._platform, this._cache);
    };

    /**
     * @return {Cache}
     */

    SDK.prototype.cache = function cache() {
        return this._cache;
    };

    _createClass(SDK, null, [{
        key: 'core',
        value: {
            Cache: _coreCache2['default'],
            Observable: _coreObservable2['default'],
            Utils: Utils,
            Externals: Externals
        },
        enumerable: true
    }, {
        key: 'http',
        value: {
            Client: _httpClient2['default'],
            ApiResponse: _httpApiResponse2['default'],
            Utils: HttpUtils
        },
        enumerable: true
    }, {
        key: 'platform',
        value: {
            Auth: _platformAuth2['default'],
            Platform: _platformPlatform2['default'],
            Queue: _platformQueue2['default']
        },
        enumerable: true
    }, {
        key: 'subscription',
        value: {
            Subscription: _subscriptionSubscription2['default']
        },
        enumerable: true
    }, {
        key: 'mocks',
        value: {
            Client: _mocksClientMock2['default'],
            Registry: _mocksRegistry2['default'],
            Mock: _mocksMock2['default']
        },
        enumerable: true
    }, {
        key: 'pubnub',
        value: {
            PubnubMockFactory: _pubnubPubnubFactory2['default']
        },
        enumerable: true
    }]);

    return SDK;
})();

exports['default'] = SDK;
module.exports = exports['default'];

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

'use strict';

exports.__esModule = true;
exports.queryStringify = queryStringify;
exports.parseQueryString = parseQueryString;
exports.isFunction = isFunction;
exports.isArray = isArray;
exports.poll = poll;
exports.stopPolling = stopPolling;
exports.isNodeJS = isNodeJS;
exports.isBrowser = isBrowser;
exports.delay = delay;

var _ExternalsJs = __webpack_require__(3);

/**
 * TODO Replace with something better
 * @see https://github.com/joyent/node/blob/master/lib/querystring.js
 * @param {object} parameters
 * @returns {string}
 */

function queryStringify(parameters) {

    var array = [];

    parameters = parameters || {};

    Object.keys(parameters).forEach(function (k) {

        var v = parameters[k];

        if (isArray(v)) {
            v.forEach(function (vv) {
                array.push(encodeURIComponent(k) + '=' + encodeURIComponent(vv));
            });
        } else {
            array.push(encodeURIComponent(k) + '=' + encodeURIComponent(v));
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

function parseQueryString(queryString) {

    var argsParsed = {};

    queryString.split('&').forEach(function (arg) {

        arg = decodeURIComponent(arg);

        if (arg.indexOf('=') == -1) {

            argsParsed[arg.trim()] = true;
        } else {

            var pair = arg.split('='),
                key = pair[0].trim(),
                value = pair[1].trim();

            if (key in argsParsed) {
                if (key in argsParsed && !isArray(argsParsed[key])) argsParsed[key] = [argsParsed[key]];
                argsParsed[key].push(value);
            } else {
                argsParsed[key] = value;
            }
        }
    });

    return argsParsed;
}

/**
 * @param obj
 * @return {boolean}
 */

function isFunction(obj) {
    return typeof obj === "function";
}

/**
 * @param obj
 * @return {boolean}
 */

function isArray(obj) {
    return Array.isArray ? Array.isArray(obj) : typeof obj === "array";
}

/**
 * @param fn
 * @param interval
 * @param timeout
 */

function poll(fn, interval, timeout) {
    //NodeJS.Timer|number

    module.exports.stopPolling(timeout);

    interval = interval || 1000;

    var next = function next(delay) {

        delay = delay || interval;

        interval = delay;

        return setTimeout(function () {

            fn(next, delay);
        }, delay);
    };

    return next();
}

function stopPolling(timeout) {
    if (timeout) clearTimeout(timeout);
}

function isNodeJS() {
    return typeof process !== 'undefined';
}

function isBrowser() {
    return typeof window !== 'undefined';
}

function delay(timeout) {
    return new _ExternalsJs.Promise(function (resolve, reject) {
        setTimeout(function () {
            resolve(null);
        }, timeout);
    });
}

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

'use strict';

exports.__esModule = true;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _es6Promise = __webpack_require__(4);

var _es6Promise2 = _interopRequireDefault(_es6Promise);

var _nodeFetch = __webpack_require__(5);

var _nodeFetch2 = _interopRequireDefault(_nodeFetch);

var _pubnub = __webpack_require__(6);

var _pubnub2 = _interopRequireDefault(_pubnub);

var Promise = _es6Promise2['default'] && _es6Promise2['default'].Promise || window.Promise;

exports.Promise = Promise;
var fetch = _nodeFetch2['default'] || window.fetch;
exports.fetch = fetch;
var Request = fetch.Request || window.Request;
exports.Request = Request;
var Response = fetch.Response || window.Response;
exports.Response = Response;
var Headers = fetch.Headers || window.Headers;

exports.Headers = Headers;
var PUBNUB = _pubnub2['default'] || window.PUBNUB;

exports.PUBNUB = PUBNUB;
var localStorage = typeof window !== 'undefined' && typeof window.localStorage !== 'undefined' ? window.localStorage : {};
exports.localStorage = localStorage;

/***/ },
/* 4 */
/***/ function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE_4__;

/***/ },
/* 5 */
/***/ function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE_5__;

/***/ },
/* 6 */
/***/ function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE_6__;

/***/ },
/* 7 */
/***/ function(module, exports) {

'use strict';

exports.__esModule = true;

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var Cache = (function () {
    _createClass(Cache, null, [{
        key: 'defaultPrefix',
        value: 'rc-',
        enumerable: true
    }]);

    function Cache(storage, prefix) {
        _classCallCheck(this, Cache);

        this.setPrefix(prefix);
        this._storage = storage;
    }

    Cache.prototype.setPrefix = function setPrefix(prefix) {
        this._prefix = prefix || Cache.defaultPrefix;
        return this;
    };

    Cache.prototype.setItem = function setItem(key, data) {
        this._storage[this._prefixKey(key)] = JSON.stringify(data);
        return this;
    };

    Cache.prototype.removeItem = function removeItem(key) {
        delete this._storage[this._prefixKey(key)];
        return this;
    };

    Cache.prototype.getItem = function getItem(key) {
        var item = this._storage[this._prefixKey(key)];
        if (!item) return null;
        return JSON.parse(item);
    };

    Cache.prototype.clean = function clean() {

        for (var key in this._storage) {

            if (!this._storage.hasOwnProperty(key)) continue;

            if (key.indexOf(this._prefix) === 0) {
                delete this._storage[key];
            }
        }

        return this;
    };

    Cache.prototype._prefixKey = function _prefixKey(key) {
        return this._prefix + key;
    };

    return Cache;
})();

exports['default'] = Cache;
module.exports = exports['default'];

/***/ },
/* 8 */
/***/ function(module, exports) {

'use strict';

exports.__esModule = true;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var Observable = (function () {
    function Observable() {
        _classCallCheck(this, Observable);

        this.off();
    }

    Observable.prototype.hasListeners = function hasListeners(event) {
        return event in this._listeners;
    };

    Observable.prototype.on = function on(events, callback) {
        var _this = this;

        if (typeof events == 'string') events = [events];
        if (!events) throw new Error('No events to subscribe to');
        if (typeof callback !== 'function') throw new Error('Callback must be a function');

        events.forEach(function (event) {

            if (!_this.hasListeners(event)) _this._listeners[event] = [];

            _this._listeners[event].push(callback);
        });

        return this;
    };

    Observable.prototype.emit = function emit(event) {
        var _this2 = this;

        for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
            args[_key - 1] = arguments[_key];
        }

        var result = null;

        if (!this.hasListeners(event)) return null;

        this._listeners[event].some(function (callback) {

            result = callback.apply(_this2, args);
            return result === false;
        });

        return result;
    };

    Observable.prototype.off = function off(event, callback) {
        var _this3 = this;

        if (!event) {

            this._listeners = {};
        } else {

            if (!callback) {

                delete this._listeners[event];
            } else {

                if (!this.hasListeners(event)) return this;

                this._listeners[event].forEach(function (cb, i) {

                    if (cb === callback) delete _this3._listeners[event][i];
                });
            }
        }

        return this;
    };

    return Observable;
})();

exports['default'] = Observable;
module.exports = exports['default'];

/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

'use strict';

exports.__esModule = true;

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _coreExternals = __webpack_require__(3);

var _coreUtils = __webpack_require__(2);

var _Utils = __webpack_require__(10);

var _coreObservable = __webpack_require__(8);

var _coreObservable2 = _interopRequireDefault(_coreObservable);

var _ApiResponse = __webpack_require__(11);

var _ApiResponse2 = _interopRequireDefault(_ApiResponse);

var Client = (function (_Observable) {
    _inherits(Client, _Observable);

    function Client() {
        _classCallCheck(this, Client);

        _Observable.apply(this, arguments);

        this.events = {
            beforeRequest: 'beforeRequest',
            requestSuccess: 'requestSuccess',
            requestError: 'requestError'
        };
    }

    /**
     * @name IApiError
     * @property {string} stack
     * @property {string} originalMessage
     * @property {ApiResponse} apiResponse
     */

    /**
     * @param {Request} request
     * @return {Promise<ApiResponse>}
     */

    Client.prototype.sendRequest = function sendRequest(request) {
        var apiResponse;
        return regeneratorRuntime.async(function sendRequest$(context$2$0) {
            while (1) switch (context$2$0.prev = context$2$0.next) {
                case 0:
                    apiResponse = new _ApiResponse2['default'](request);
                    context$2$0.prev = 1;

                    //TODO Stop request if listeners return false
                    this.emit(this.events.beforeRequest, apiResponse);

                    context$2$0.next = 5;
                    return regeneratorRuntime.awrap(this._loadResponse(request));

                case 5:
                    apiResponse._response = context$2$0.sent;

                    if (!(apiResponse._isMultipart() || apiResponse._isJson())) {
                        context$2$0.next = 10;
                        break;
                    }

                    context$2$0.next = 9;
                    return regeneratorRuntime.awrap(apiResponse.response().text());

                case 9:
                    apiResponse._text = context$2$0.sent;

                case 10:
                    if (apiResponse.ok()) {
                        context$2$0.next = 12;
                        break;
                    }

                    throw new Error('Response has unsuccessful status');

                case 12:

                    this.emit(this.events.requestSuccess, apiResponse);

                    return context$2$0.abrupt('return', apiResponse);

                case 16:
                    context$2$0.prev = 16;
                    context$2$0.t0 = context$2$0['catch'](1);

                    if (!context$2$0.t0.apiResponse) context$2$0.t0 = this.makeError(context$2$0.t0, apiResponse);

                    this.emit(this.events.requestError, context$2$0.t0);

                    throw context$2$0.t0;

                case 21:
                case 'end':
                    return context$2$0.stop();
            }
        }, null, this, [[1, 16]]);
    };

    /**
     * @param {Request} request
     * @return {Promise<Response>}
     * @private
     */

    Client.prototype._loadResponse = function _loadResponse(request) {
        return regeneratorRuntime.async(function _loadResponse$(context$2$0) {
            while (1) switch (context$2$0.prev = context$2$0.next) {
                case 0:
                    context$2$0.next = 2;
                    return regeneratorRuntime.awrap(_coreExternals.fetch.call(null, request));

                case 2:
                    return context$2$0.abrupt('return', context$2$0.sent);

                case 3:
                case 'end':
                    return context$2$0.stop();
            }
        }, null, this);
    };

    /**
     * Wraps the JS Error object with transaction information
     * @param {Error|IApiError} e
     * @param {ApiResponse} apiResponse
     * @return {IApiError}
     */

    Client.prototype.makeError = function makeError(e, apiResponse) {

        // Wrap only if regular error
        if (!e.hasOwnProperty('apiResponse') && !e.hasOwnProperty('originalMessage')) {

            e.apiResponse = apiResponse;
            e.originalMessage = e.message;
            e.message = apiResponse && apiResponse.error(true) || e.originalMessage;
        }

        return e;
    };

    /**
     *
     * @param {object} init
     * @param {object} [init.url]
     * @param {object} [init.body]
     * @param {string} [init.method]
     * @param {object} [init.query]
     * @param {object} [init.headers]
     * @return {Request}
     */

    Client.prototype.createRequest = function createRequest(init) {

        init = init || {};
        init.headers = init.headers || {};

        // Sanity checks
        if (!init.url) throw new Error('Url is not defined');
        if (!init.method) init.method = 'GET';
        if (init.method && Client._allowedMethods.indexOf(init.method) < 0) throw new Error('Method has wrong value: ' + init.method);

        // Defaults
        init.credentials = init.credentials || 'include';
        init.mode = init.mode || 'cors';

        // Append Query String
        if (init.query) {
            init.url = init.url + (init.url.indexOf('?') > -1 ? '&' : '?') + _coreUtils.queryStringify(init.query);
        }

        if (!_Utils.findHeaderName('Accept', init.headers)) {
            init.headers['Accept'] = _ApiResponse2['default']._jsonContentType;
        }

        // Serialize body
        //TODO Check that body is a plain object
        if (typeof init.body !== 'string' || !init.body) {

            var contentTypeHeaderName = _Utils.findHeaderName(_ApiResponse2['default']._contentType, init.headers);

            if (!contentTypeHeaderName) {
                contentTypeHeaderName = _ApiResponse2['default']._contentType;
                init.headers[contentTypeHeaderName] = _ApiResponse2['default']._jsonContentType;
            }

            var contentType = init.headers[contentTypeHeaderName];

            // Assign a new encoded body
            if (contentType.indexOf(_ApiResponse2['default']._jsonContentType) > -1) {
                init.body = JSON.stringify(init.body);
            } else if (contentType.indexOf(_ApiResponse2['default']._urlencodedContentType) > -1) {
                init.body = _coreUtils.queryStringify(init.body);
            }
        }

        // Create a request with encoded body
        var req = new _coreExternals.Request(init.url, init);

        // Keep the original body accessible directly (for mocks)
        req.originalBody = init.body;

        return req;
    };

    _createClass(Client, null, [{
        key: '_allowedMethods',
        value: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS', 'HEAD'],
        enumerable: true
    }]);

    return Client;
})(_coreObservable2['default']);

exports['default'] = Client;
module.exports = exports['default'];

/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

'use strict';

exports.__esModule = true;
exports.createResponse = createResponse;
exports.findHeaderName = findHeaderName;

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }

var _coreExternals = __webpack_require__(3);

var _coreUtils = __webpack_require__(2);

var utils = _interopRequireWildcard(_coreUtils);

/**
 * Creates a response
 * @param stringBody
 * @param init
 * @return {Response}
 */

function createResponse(stringBody, init) {

    init = init || {};

    var response = new _coreExternals.Response(stringBody, init);

    //TODO Wait for https://github.com/bitinn/node-fetch/issues/38
    if (utils.isNodeJS()) {

        response._text = stringBody;
        response._decode = function () {
            return this._text;
        };
    }

    return response;
}

function findHeaderName(name, headers) {
    name = name.toLowerCase();
    return Object.keys(headers).reduce(function (res, key) {
        if (res) return res;
        if (name == key.toLowerCase()) return key;
        return res;
    }, null);
}

/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

'use strict';

exports.__esModule = true;

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _coreExternals = __webpack_require__(3);

var _Utils = __webpack_require__(10);

var utils = _interopRequireWildcard(_Utils);

var ApiResponse = (function () {
    _createClass(ApiResponse, null, [{
        key: '_contentType',
        value: 'Content-Type',
        enumerable: true
    }, {
        key: '_jsonContentType',
        value: 'application/json',
        enumerable: true
    }, {
        key: '_multipartContentType',
        value: 'multipart/mixed',
        enumerable: true
    }, {
        key: '_urlencodedContentType',
        value: 'application/x-www-form-urlencoded',
        enumerable: true
    }, {
        key: '_headerSeparator',
        value: ':',
        enumerable: true
    }, {
        key: '_bodySeparator',
        value: '\n\n',
        enumerable: true
    }, {
        key: '_boundarySeparator',
        value: '--',

        /**
         * @param {Request} request
         * @param {Response} response
         * @param {string} responseText
         */
        enumerable: true
    }]);

    function ApiResponse(request, response, responseText) {
        _classCallCheck(this, ApiResponse);

        /** @type {Request} */
        this._request = request;

        /** @type {Response} */
        this._response = response;

        this._text = responseText;
        this._json = null;
        this._multipart = [];
    }

    /**
     * @return {Response}
     */

    ApiResponse.prototype.response = function response() {
        return this._response;
    };

    /**
     * @return {Request}
     */

    ApiResponse.prototype.request = function request() {
        return this._request;
    };

    /**
     * @return {boolean}
     */

    ApiResponse.prototype.ok = function ok() {
        return this._response && this._response.ok;
    };

    /**
     * @return {string}
     */

    ApiResponse.prototype.text = function text() {
        if (!this._isJson() && !this._isMultipart()) throw new Error('Response is not text');
        return this._text;
    };

    /**
     * @return {object}
     */

    ApiResponse.prototype.json = function json() {
        if (!this._isJson()) throw new Error('Response is not JSON');
        if (!this._json) {
            this._json = this._text ? JSON.parse(this._text) : null;
        }
        return this._json;
    };

    /**
     * @param [skipOKCheck]
     * @return {string}
     */

    ApiResponse.prototype.error = function error(skipOKCheck) {

        if (this.ok() && !skipOKCheck) return null;

        var message = (this._response && this._response.status ? this._response.status + ' ' : '') + (this._response && this._response.statusText ? this._response.statusText : '');

        try {

            if (this.json().message) message = this.json().message;
            if (this.json().error_description) message = this.json().error_description;
            if (this.json().description) message = this.json().description;
        } catch (e) {}

        return message;
    };

    /**
     * @return {ApiResponse[]}
     */

    ApiResponse.prototype.multipart = function multipart() {

        if (!this._isMultipart()) throw new Error('Response is not multipart');

        if (!this._multipart.length) {

            // Step 1. Split multipart response

            var text = this.text();

            if (!text) throw new Error('No response body');

            var boundary = this._getContentType().match(/boundary=([^;]+)/i)[1];

            if (!boundary) throw new Error('Cannot find boundary');

            var parts = text.toString().split(ApiResponse._boundarySeparator + boundary);

            if (parts[0].trim() === '') parts.shift();
            if (parts[parts.length - 1].trim() == ApiResponse._boundarySeparator) parts.pop();

            if (parts.length < 1) throw new Error('No parts in body');

            // Step 2. Parse status info

            var statusInfo = ApiResponse.create(parts.shift(), this._response.status, this._response.statusText).json();

            // Step 3. Parse all other parts

            this._multipart = parts.map(function (part, i) {

                var status = statusInfo.response[i].status;

                return ApiResponse.create(part, status);
            });
        }

        return this._multipart;
    };

    ApiResponse.prototype._isContentType = function _isContentType(contentType) {
        return this._getContentType().indexOf(contentType) > -1;
    };

    ApiResponse.prototype._getContentType = function _getContentType() {
        return this._response.headers.get(ApiResponse._contentType) || '';
    };

    ApiResponse.prototype._isMultipart = function _isMultipart() {
        return this._isContentType(ApiResponse._multipartContentType);
    };

    ApiResponse.prototype._isUrlEncoded = function _isUrlEncoded() {
        return this._isContentType(ApiResponse._urlencodedContentType);
    };

    ApiResponse.prototype._isJson = function _isJson() {
        return this._isContentType(ApiResponse._jsonContentType);
    };

    /**
     * Method is used to create ApiResponse object from string parts of multipart/mixed response
     * @param {string} [text]
     * @param {number} [status]
     * @param {string} [statusText]
     * @return {ApiResponse}
     */

    ApiResponse.create = function create(text, status, statusText) {

        text = text || '';
        status = status || 200;
        statusText = statusText || 'OK';

        text = text.replace(/\r/g, '');

        var headers = new _coreExternals.Headers(),
            headersAndBody = text.split(ApiResponse._bodySeparator),
            headersText = headersAndBody.length > 1 ? headersAndBody.shift() : '';

        text = headersAndBody.join(ApiResponse._bodySeparator);

        (headersText || '').split('\n').forEach(function (header) {

            var split = header.trim().split(ApiResponse._headerSeparator),
                key = split.shift().trim(),
                value = split.join(ApiResponse._headerSeparator).trim();

            if (key) headers.append(key, value);
        });

        return new ApiResponse(null, utils.createResponse(text, {
            headers: headers,
            status: status,
            statusText: statusText
        }), text);
    };

    return ApiResponse;
})();

exports['default'] = ApiResponse;
module.exports = exports['default'];

/***/ },
/* 12 */
/***/ function(module, exports, __webpack_require__) {

'use strict';

exports.__esModule = true;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _Registry = __webpack_require__(13);

var _Registry2 = _interopRequireDefault(_Registry);

var _httpClient = __webpack_require__(9);

var _httpClient2 = _interopRequireDefault(_httpClient);

var Client = (function (_HttpClient) {
    _inherits(Client, _HttpClient);

    function Client() {
        _classCallCheck(this, Client);

        _HttpClient.call(this);
        this._registry = new _Registry2['default']();
    }

    Client.prototype.registry = function registry() {
        return this._registry;
    };

    Client.prototype._loadResponse = function _loadResponse(request) {
        var mock;
        return regeneratorRuntime.async(function _loadResponse$(context$2$0) {
            while (1) switch (context$2$0.prev = context$2$0.next) {
                case 0:
                    mock = this._registry.find(request);
                    context$2$0.next = 3;
                    return regeneratorRuntime.awrap(mock.getResponse(request));

                case 3:
                    return context$2$0.abrupt('return', context$2$0.sent);

                case 4:
                case 'end':
                    return context$2$0.stop();
            }
        }, null, this);
    };

    return Client;
})(_httpClient2['default']);

exports['default'] = Client;
module.exports = exports['default'];

/***/ },
/* 13 */
/***/ function(module, exports, __webpack_require__) {

'use strict';

exports.__esModule = true;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _Mock = __webpack_require__(14);

var _Mock2 = _interopRequireDefault(_Mock);

var Registry = (function () {
    function Registry() {
        _classCallCheck(this, Registry);

        this._mocks = [];
    }

    Registry.prototype.add = function add(mock) {
        this._mocks.push(mock);
        return this;
    };

    Registry.prototype.clear = function clear() {
        this._mocks = [];
        return this;
    };

    Registry.prototype.find = function find(request) {

        //console.log('Registry is looking for', request);

        var mock = this._mocks.shift();

        if (!mock) throw new Error('No mock in registry for request ' + request.method + ' ' + request.url);

        if (!mock.test(request)) throw new Error('Wrong request ' + request.method + ' ' + request.url + ' for expected mock ' + mock.method() + ' ' + mock.path());

        return mock;
    };

    Registry.prototype.apiCall = function apiCall(method, path, response, status, statusText) {

        this.add(new _Mock2['default'](method, path, response, status, statusText));

        return this;
    };

    Registry.prototype.authentication = function authentication() {

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

    Registry.prototype.logout = function logout() {

        this.apiCall('POST', '/restapi/oauth/revoke', {});

        return this;
    };

    Registry.prototype.presenceLoad = function presenceLoad(id) {

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

    Registry.prototype.subscribeGeneric = function subscribeGeneric(expiresIn) {

        expiresIn = expiresIn || 15 * 60 * 60;

        var date = new Date();

        this.apiCall('POST', '/restapi/v1.0/subscription', {
            'eventFilters': ['/restapi/v1.0/account/~/extension/~/presence'],
            'expirationTime': new Date(date.getTime() + expiresIn * 1000).toISOString(),
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

    Registry.prototype.subscribeOnPresence = function subscribeOnPresence(id, detailed) {

        id = id || '1';

        var date = new Date();

        this.apiCall('POST', '/restapi/v1.0/subscription', {
            'eventFilters': ['/restapi/v1.0/account/~/extension/' + id + '/presence' + (detailed ? '?detailedTelephonyState=true' : '')],
            'expirationTime': new Date(date.getTime() + 15 * 60 * 60 * 1000).toISOString(),
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

    Registry.prototype.tokenRefresh = function tokenRefresh(failure) {

        if (!failure) {

            this.apiCall('POST', '/restapi/oauth/token', {
                'access_token': 'ACCESS_TOKEN_FROM_REFRESH',
                'token_type': 'bearer',
                'expires_in': 3600,
                'refresh_token': 'REFRESH_TOKEN_FROM_REFRESH',
                'refresh_token_expires_in': 60480,
                'scope': 'SMS RCM Foo Boo'
            });
        } else {

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

exports['default'] = Registry;
module.exports = exports['default'];

/***/ },
/* 14 */
/***/ function(module, exports, __webpack_require__) {

'use strict';

exports.__esModule = true;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _httpApiResponse = __webpack_require__(11);

var _httpApiResponse2 = _interopRequireDefault(_httpApiResponse);

var _coreUtils = __webpack_require__(2);

var _httpUtils = __webpack_require__(10);

var Mock = (function () {
    function Mock(method, path, json, status, statusText, delay) {
        _classCallCheck(this, Mock);

        this._method = method.toUpperCase();
        this._path = path;
        this._json = json || {};
        this._delay = delay || 10;
        this._status = status || 200;
        this._statusText = statusText || 'OK';
    }

    Mock.prototype.path = function path() {
        return this._path;
    };

    Mock.prototype.method = function method() {
        return this._method;
    };

    Mock.prototype.test = function test(request) {

        return request.url.indexOf(this._path) > -1 && request.method.toUpperCase() == this._method;
    };

    Mock.prototype.getResponse = function getResponse(request) {
        return regeneratorRuntime.async(function getResponse$(context$2$0) {
            while (1) switch (context$2$0.prev = context$2$0.next) {
                case 0:
                    context$2$0.next = 2;
                    return regeneratorRuntime.awrap(_coreUtils.delay(this._delay));

                case 2:
                    return context$2$0.abrupt('return', this.createResponse(this._json));

                case 3:
                case 'end':
                    return context$2$0.stop();
            }
        }, null, this);
    };

    Mock.prototype.createResponse = function createResponse(json, init) {

        init = init || {};

        init.status = init.status || this._status;
        init.statusText = init.statusText || this._statusText;

        var str = JSON.stringify(json),
            res = _httpUtils.createResponse(str, init);

        res.headers.set(_httpApiResponse2['default']._contentType, _httpApiResponse2['default']._jsonContentType);

        return res;
    };

    return Mock;
})();

exports['default'] = Mock;
module.exports = exports['default'];

/***/ },
/* 15 */
/***/ function(module, exports, __webpack_require__) {

'use strict';

exports.__esModule = true;

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _coreObservable = __webpack_require__(8);

var _coreObservable2 = _interopRequireDefault(_coreObservable);

var _Queue = __webpack_require__(16);

var _Queue2 = _interopRequireDefault(_Queue);

var _Auth = __webpack_require__(17);

var _Auth2 = _interopRequireDefault(_Auth);

var _coreExternals = __webpack_require__(3);

var _coreUtils = __webpack_require__(2);

var Platform = (function (_Observable) {
    _inherits(Platform, _Observable);

    _createClass(Platform, null, [{
        key: '_urlPrefix',
        value: '/restapi',
        enumerable: true
    }, {
        key: '_apiVersion',
        value: 'v1.0',
        enumerable: true
    }, {
        key: '_accessTokenTtl',
        value: null,
        // Platform server by default sets it to 60 * 60 = 1 hour
        enumerable: true
    }, {
        key: '_refreshTokenTtl',
        value: 10 * 60 * 60,
        // 10 hours
        enumerable: true
    }, {
        key: '_refreshTokenTtlRemember',
        value: 7 * 24 * 60 * 60,
        // 1 week
        enumerable: true
    }, {
        key: '_tokenEndpoint',
        value: '/restapi/oauth/token',
        enumerable: true
    }, {
        key: '_revokeEndpoint',
        value: '/restapi/oauth/revoke',
        enumerable: true
    }, {
        key: '_authorizeEndpoint',
        value: '/restapi/oauth/authorize',
        enumerable: true
    }, {
        key: '_refreshDelayMs',
        value: 100,
        enumerable: true
    }, {
        key: '_cacheId',
        value: 'platform',
        enumerable: true
    }, {
        key: '_clearCacheOnRefreshError',
        value: true,
        enumerable: true
    }]);

    function Platform(client, cache, server, appKey, appSecret) {
        _classCallCheck(this, Platform);

        _Observable.call(this);

        this.events = {
            beforeLogin: 'beforeLogin',
            loginSuccess: 'loginSuccess',
            loginError: 'loginError',
            beforeRefresh: 'beforeRefresh',
            refreshSuccess: 'refreshSuccess',
            refreshError: 'refreshError',
            beforeLogout: 'beforeLogout',
            logoutSuccess: 'logoutSuccess',
            logoutError: 'logoutError'
        };
        this._server = server;
        this._appKey = appKey;
        this._appSecret = appSecret;

        /** @type {Cache} */
        this._cache = cache;

        /** @type {Client} */
        this._client = client;

        this._queue = new _Queue2['default'](this._cache, Platform._cacheId + '-refresh');

        this._auth = new _Auth2['default'](this._cache, Platform._cacheId);
    }

    /**
     * @return {Auth}
     */

    Platform.prototype.auth = function auth() {
        return this._auth;
    };

    /**
     * @return {Client}
     */

    Platform.prototype.client = function client() {
        return this._client;
    };

    /**
     * @param {string} path
     * @param {object} [options]
     * @param {boolean} [options.addServer]
     * @param {string} [options.addMethod]
     * @param {boolean} [options.addToken]
     * @return {string}
     */

    Platform.prototype.createUrl = function createUrl(path, options) {

        path = path || '';
        options = options || {};

        var builtUrl = '',
            hasHttp = path.indexOf('http://') != -1 || path.indexOf('https://') != -1;

        if (options.addServer && !hasHttp) builtUrl += this._server;

        if (path.indexOf(Platform._urlPrefix) == -1 && !hasHttp) builtUrl += Platform._urlPrefix + '/' + Platform._apiVersion;

        builtUrl += path;

        if (options.addMethod || options.addToken) builtUrl += path.indexOf('?') > -1 ? '&' : '?';

        if (options.addMethod) builtUrl += '_method=' + options.addMethod;
        if (options.addToken) builtUrl += (options.addMethod ? '&' : '') + 'access_token=' + this._auth.accessToken();

        return builtUrl;
    };

    /**
     * @param {string} options.redirectUri
     * @param {string} options.state
     * @param {string} options.brandId
     * @param {string} options.display
     * @param {string} options.prompt
     * @return {string}
     */

    Platform.prototype.authUrl = function authUrl(options) {

        options = options || {};

        return this.createUrl(Platform._authorizeEndpoint + '?' + _coreUtils.queryStringify({
            'response_type': 'code',
            'redirect_uri': options.redirectUri || '',
            'client_id': this._appKey,
            'state': options.state || '',
            'brand_id': options.brandId || '',
            'display': options.display || '',
            'prompt': options.prompt || ''
        }), { addServer: true });
    };

    /**
     * @param {string} url
     * @return {Object}
     */

    Platform.prototype.parseAuthRedirectUrl = function parseAuthRedirectUrl(url) {

        var qs = _coreUtils.parseQueryString(url.split('?').reverse()[0]),
            error = qs.error_description || qs.error;

        if (error) {
            var e = new Error(error);
            e.error = qs.error;
            throw e;
        }

        return qs;
    };

    /**
     * @return {Promise<boolean>}
     */

    Platform.prototype.loggedIn = function loggedIn() {
        return regeneratorRuntime.async(function loggedIn$(context$2$0) {
            while (1) switch (context$2$0.prev = context$2$0.next) {
                case 0:
                    context$2$0.prev = 0;
                    context$2$0.next = 3;
                    return regeneratorRuntime.awrap(this._ensureAuthentication());

                case 3:
                    return context$2$0.abrupt('return', true);

                case 6:
                    context$2$0.prev = 6;
                    context$2$0.t0 = context$2$0['catch'](0);
                    return context$2$0.abrupt('return', false);

                case 9:
                case 'end':
                    return context$2$0.stop();
            }
        }, null, this, [[0, 6]]);
    };

    /**
     * @param {string} options.username
     * @param {string} options.password
     * @param {string} options.extension
     * @param {string} options.code
     * @param {string} options.redirectUri
     * @param {string} options.endpointId
     * @returns {Promise<ApiResponse>}
     */

    Platform.prototype.login = function login(options) {
        var body, apiResponse, json;
        return regeneratorRuntime.async(function login$(context$2$0) {
            while (1) switch (context$2$0.prev = context$2$0.next) {
                case 0:
                    context$2$0.prev = 0;

                    options = options || {};

                    options.remember = options.remember || false;

                    this.emit(this.events.beforeLogin);

                    body = {
                        "access_token_ttl": Platform._accessTokenTtl,
                        "refresh_token_ttl": options.remember ? Platform._refreshTokenTtlRemember : Platform._refreshTokenTtl
                    };

                    if (!options.code) {

                        body.grant_type = 'password';
                        body.username = options.username;
                        body.password = options.password;
                        body.extension = options.extension || '';
                    } else if (options.code) {

                        body.grant_type = 'authorization_code';
                        body.code = options.code;
                        body.redirect_uri = options.redirectUri;
                        //body.client_id = this.getCredentials().key; // not needed
                    }

                    if (options.endpointId) body.endpoint_id = options.endpointId;

                    context$2$0.next = 9;
                    return regeneratorRuntime.awrap(this._tokenRequest(Platform._tokenEndpoint, body));

                case 9:
                    apiResponse = context$2$0.sent;
                    json = apiResponse.json();

                    this._auth.setData(json).setRemember(options.remember);

                    this.emit(this.events.loginSuccess, apiResponse);

                    return context$2$0.abrupt('return', apiResponse);

                case 16:
                    context$2$0.prev = 16;
                    context$2$0.t0 = context$2$0['catch'](0);

                    this._cache.clean();

                    this.emit(this.events.loginError, context$2$0.t0);

                    throw context$2$0.t0;

                case 21:
                case 'end':
                    return context$2$0.stop();
            }
        }, null, this, [[0, 16]]);
    };

    /**
     * @returns {Promise<ApiResponse>}
     */

    Platform.prototype.refresh = function refresh() {
        var res, json;
        return regeneratorRuntime.async(function refresh$(context$2$0) {
            while (1) switch (context$2$0.prev = context$2$0.next) {
                case 0:
                    context$2$0.prev = 0;

                    this.emit(this.events.beforeRefresh);

                    if (!this._queue.isPaused()) {
                        context$2$0.next = 9;
                        break;
                    }

                    context$2$0.next = 5;
                    return regeneratorRuntime.awrap(this._queue.poll());

                case 5:
                    if (this._isAccessTokenValid()) {
                        context$2$0.next = 7;
                        break;
                    }

                    throw new Error('Automatic authentification timeout');

                case 7:

                    this.emit(this.events.refreshSuccess, null);

                    return context$2$0.abrupt('return', null);

                case 9:

                    this._queue.pause();

                    // Make sure all existing AJAX calls had a chance to reach the server
                    context$2$0.next = 12;
                    return regeneratorRuntime.awrap(_coreUtils.delay(Platform._refreshDelayMs));

                case 12:
                    if (this._auth.refreshToken()) {
                        context$2$0.next = 14;
                        break;
                    }

                    throw new Error('Refresh token is missing');

                case 14:
                    if (this._auth.refreshTokenValid()) {
                        context$2$0.next = 16;
                        break;
                    }

                    throw new Error('Refresh token has expired');

                case 16:
                    if (this._queue.isPaused()) {
                        context$2$0.next = 18;
                        break;
                    }

                    throw new Error('Queue was resumed before refresh call');

                case 18:
                    context$2$0.next = 20;
                    return regeneratorRuntime.awrap(this._tokenRequest(Platform._tokenEndpoint, {
                        "grant_type": "refresh_token",
                        "refresh_token": this._auth.refreshToken(),
                        "access_token_ttl": Platform._accessTokenTtl,
                        "refresh_token_ttl": this._auth.remember() ? Platform._refreshTokenTtlRemember : Platform._refreshTokenTtl
                    }));

                case 20:
                    res = context$2$0.sent;
                    json = res.json();

                    if (json.access_token) {
                        context$2$0.next = 24;
                        break;
                    }

                    throw this._client.makeError(new Error('Malformed OAuth response'), res);

                case 24:

                    this._auth.setData(json);
                    this._queue.resume();

                    this.emit(this.events.refreshSuccess, res);

                    return context$2$0.abrupt('return', res);

                case 30:
                    context$2$0.prev = 30;
                    context$2$0.t0 = context$2$0['catch'](0);

                    context$2$0.t0 = this._client.makeError(context$2$0.t0);

                    if (Platform._clearCacheOnRefreshError) {
                        this._cache.clean();
                    }

                    this.emit(this.events.refreshError, context$2$0.t0);

                    throw context$2$0.t0;

                case 36:
                case 'end':
                    return context$2$0.stop();
            }
        }, null, this, [[0, 30]]);
    };

    /**
     * @returns {Promise<ApiResponse>}
     */

    Platform.prototype.logout = function logout() {
        var res;
        return regeneratorRuntime.async(function logout$(context$2$0) {
            while (1) switch (context$2$0.prev = context$2$0.next) {
                case 0:
                    context$2$0.prev = 0;

                    this.emit(this.events.beforeLogout);

                    this._queue.pause();

                    context$2$0.next = 5;
                    return regeneratorRuntime.awrap(this._tokenRequest(Platform._revokeEndpoint, {
                        token: this._auth.accessToken()
                    }));

                case 5:
                    res = context$2$0.sent;

                    this._queue.resume();
                    this._cache.clean();

                    this.emit(this.events.logoutSuccess, res);

                    return context$2$0.abrupt('return', res);

                case 12:
                    context$2$0.prev = 12;
                    context$2$0.t0 = context$2$0['catch'](0);

                    this._queue.resume();

                    this.emit(this.events.logoutError, context$2$0.t0);

                    throw context$2$0.t0;

                case 17:
                case 'end':
                    return context$2$0.stop();
            }
        }, null, this, [[0, 12]]);
    };

    /**
     * @param {Request} request
     * @param {object} [options]
     * @param {boolean} [options.skipAuthCheck]
     * @return {Promise<Request>}
     */

    Platform.prototype.inflateRequest = function inflateRequest(request, options) {
        return regeneratorRuntime.async(function inflateRequest$(context$2$0) {
            while (1) switch (context$2$0.prev = context$2$0.next) {
                case 0:

                    options = options || {};

                    if (!options.skipAuthCheck) {
                        context$2$0.next = 3;
                        break;
                    }

                    return context$2$0.abrupt('return', request);

                case 3:
                    context$2$0.next = 5;
                    return regeneratorRuntime.awrap(this._ensureAuthentication());

                case 5:

                    request.headers.set('Authorization', this._authHeader());
                    //request.url = this.createUrl(request.url, {addServer: true}); //FIXME Spec prevents this...

                    //TODO Add User-Agent here

                    return context$2$0.abrupt('return', request);

                case 7:
                case 'end':
                    return context$2$0.stop();
            }
        }, null, this);
    };

    /**
     * @param {Request} request
     * @param {object} [options]
     * @param {boolean} [options.skipAuthCheck]
     * @return {Promise<ApiResponse>}
     */

    Platform.prototype.sendRequest = function sendRequest(request, options) {
        return regeneratorRuntime.async(function sendRequest$(context$2$0) {
            while (1) switch (context$2$0.prev = context$2$0.next) {
                case 0:
                    context$2$0.prev = 0;
                    context$2$0.next = 3;
                    return regeneratorRuntime.awrap(this.inflateRequest(request, options));

                case 3:
                    request = context$2$0.sent;
                    context$2$0.next = 6;
                    return regeneratorRuntime.awrap(this._client.sendRequest(request));

                case 6:
                    return context$2$0.abrupt('return', context$2$0.sent);

                case 9:
                    context$2$0.prev = 9;
                    context$2$0.t0 = context$2$0['catch'](0);

                    if (!(!context$2$0.t0.apiResponse || !context$2$0.t0.apiResponse.response() || context$2$0.t0.apiResponse.response().status != 401)) {
                        context$2$0.next = 13;
                        break;
                    }

                    throw context$2$0.t0;

                case 13:

                    this._auth.cancelAccessToken();

                    context$2$0.next = 16;
                    return regeneratorRuntime.awrap(this.sendRequest(request, options));

                case 16:
                    return context$2$0.abrupt('return', context$2$0.sent);

                case 17:
                case 'end':
                    return context$2$0.stop();
            }
        }, null, this, [[0, 9]]);
    };

    /**
     * General purpose function to send anything to server
     * @param {object} [options.body]
     * @param {string} [options.url]
     * @param {string} [options.method]
     * @param {object} [options.query]
     * @param {object} [options.headers]
     * @param {boolean} [options.skipAuthCheck]
     * @return {Promise<ApiResponse>}
     */

    Platform.prototype.send = function send() {
        var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
        return regeneratorRuntime.async(function send$(context$2$0) {
            while (1) switch (context$2$0.prev = context$2$0.next) {
                case 0:

                    //FIXME https://github.com/bitinn/node-fetch/issues/43
                    options.url = this.createUrl(options.url, { addServer: true });

                    context$2$0.next = 3;
                    return regeneratorRuntime.awrap(this.sendRequest(this._client.createRequest(options), options));

                case 3:
                    return context$2$0.abrupt('return', context$2$0.sent);

                case 4:
                case 'end':
                    return context$2$0.stop();
            }
        }, null, this);
    };

    /**
     * @param {string} url
     * @param {object} query
     * @param {object} [options]
     * @param {object} [options.headers]
     * @param {boolean} [options.skipAuthCheck]
     * @return {Promise<ApiResponse>}
     */

    Platform.prototype.get = function get(url, query, options) {
        return regeneratorRuntime.async(function get$(context$2$0) {
            while (1) switch (context$2$0.prev = context$2$0.next) {
                case 0:
                    options = options || {};
                    options.method = 'GET';
                    options.url = url;
                    options.query = query;
                    context$2$0.next = 6;
                    return regeneratorRuntime.awrap(this.send(options));

                case 6:
                    return context$2$0.abrupt('return', context$2$0.sent);

                case 7:
                case 'end':
                    return context$2$0.stop();
            }
        }, null, this);
    };

    /**
     * @param {string} url
     * @param {object} body
     * @param {object} query
     * @param {object} [options]
     * @param {object} [options.headers]
     * @param {boolean} [options.skipAuthCheck]
     * @return {Promise<ApiResponse>}
     */

    Platform.prototype.post = function post(url, body, query, options) {
        return regeneratorRuntime.async(function post$(context$2$0) {
            while (1) switch (context$2$0.prev = context$2$0.next) {
                case 0:
                    options = options || {};
                    options.method = 'POST';
                    options.url = url;
                    options.query = query;
                    options.body = body;
                    context$2$0.next = 7;
                    return regeneratorRuntime.awrap(this.send(options));

                case 7:
                    return context$2$0.abrupt('return', context$2$0.sent);

                case 8:
                case 'end':
                    return context$2$0.stop();
            }
        }, null, this);
    };

    /**
     * @param {string} url
     * @param {object} body
     * @param {object} query
     * @param {object} [options]
     * @param {object} [options.headers]
     * @param {boolean} [options.skipAuthCheck]
     * @return {Promise<ApiResponse>}
     */

    Platform.prototype.put = function put(url, body, query, options) {
        return regeneratorRuntime.async(function put$(context$2$0) {
            while (1) switch (context$2$0.prev = context$2$0.next) {
                case 0:
                    options = options || {};
                    options.method = 'PUT';
                    options.url = url;
                    options.query = query;
                    options.body = body;
                    context$2$0.next = 7;
                    return regeneratorRuntime.awrap(this.send(options));

                case 7:
                    return context$2$0.abrupt('return', context$2$0.sent);

                case 8:
                case 'end':
                    return context$2$0.stop();
            }
        }, null, this);
    };

    /**
     * @param {string} url
     * @param {string} query
     * @param {object} [options]
     * @param {object} [options.headers]
     * @param {boolean} [options.skipAuthCheck]
     * @return {Promise<ApiResponse>}
     */

    Platform.prototype['delete'] = function _delete(url, query, options) {
        return regeneratorRuntime.async(function _delete$(context$2$0) {
            while (1) switch (context$2$0.prev = context$2$0.next) {
                case 0:
                    options = options || {};
                    options.method = 'DELETE';
                    options.url = url;
                    options.query = query;
                    context$2$0.next = 6;
                    return regeneratorRuntime.awrap(this.send(options));

                case 6:
                    return context$2$0.abrupt('return', context$2$0.sent);

                case 7:
                case 'end':
                    return context$2$0.stop();
            }
        }, null, this);
    };

    Platform.prototype._tokenRequest = function _tokenRequest(path, body) {
        return regeneratorRuntime.async(function _tokenRequest$(context$2$0) {
            while (1) switch (context$2$0.prev = context$2$0.next) {
                case 0:
                    context$2$0.next = 2;
                    return regeneratorRuntime.awrap(this.send({
                        url: path,
                        skipAuthCheck: true,
                        body: body,
                        method: 'POST',
                        headers: {
                            'Authorization': 'Basic ' + this._apiKey(),
                            'Content-Type': 'application/x-www-form-urlencoded'
                        }
                    }));

                case 2:
                    return context$2$0.abrupt('return', context$2$0.sent);

                case 3:
                case 'end':
                    return context$2$0.stop();
            }
        }, null, this);
    };

    Platform.prototype._ensureAuthentication = function _ensureAuthentication() {
        return regeneratorRuntime.async(function _ensureAuthentication$(context$2$0) {
            while (1) switch (context$2$0.prev = context$2$0.next) {
                case 0:
                    if (!this._isAccessTokenValid()) {
                        context$2$0.next = 2;
                        break;
                    }

                    return context$2$0.abrupt('return', null);

                case 2:
                    context$2$0.next = 4;
                    return regeneratorRuntime.awrap(this.refresh());

                case 4:
                    return context$2$0.abrupt('return', context$2$0.sent);

                case 5:
                case 'end':
                    return context$2$0.stop();
            }
        }, null, this);
    };

    Platform.prototype._isAccessTokenValid = function _isAccessTokenValid() {

        return this._auth.accessTokenValid() && !this._queue.isPaused();
    };

    Platform.prototype._apiKey = function _apiKey() {
        var apiKey = this._appKey + ':' + this._appSecret;
        return typeof btoa == 'function' ? btoa(apiKey) : new Buffer(apiKey).toString('base64');
    };

    Platform.prototype._authHeader = function _authHeader() {
        var token = this._auth.accessToken();
        return this._auth.tokenType() + (token ? ' ' + token : '');
    };

    return Platform;
})(_coreObservable2['default']);

exports['default'] = Platform;
module.exports = exports['default'];

// Perform sanity checks

/** @type {ApiResponse} */

// Guard is for errors that come from polling

/***/ },
/* 16 */
/***/ function(module, exports, __webpack_require__) {

'use strict';

exports.__esModule = true;

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _coreExternals = __webpack_require__(3);

var _coreUtils = __webpack_require__(2);

var Queue = (function () {
    _createClass(Queue, null, [{
        key: '_pollInterval',
        value: 250,
        enumerable: true
    }, {
        key: '_releaseTimeout',
        value: 5000,
        enumerable: true
    }]);

    function Queue(cache, cacheId) {
        _classCallCheck(this, Queue);

        this._cache = cache;
        this._cacheId = cacheId;
        this._promise = null;
    }

    Queue.prototype.isPaused = function isPaused() {

        var storage = this._cache,
            cacheId = this._cacheId,
            time = storage.getItem(cacheId);

        return !!time && Date.now() - parseInt(time) < Queue._releaseTimeout;
    };

    Queue.prototype.pause = function pause() {
        this._cache.setItem(this._cacheId, Date.now());
        return this;
    };

    Queue.prototype.resume = function resume() {
        this._cache.removeItem(this._cacheId);
        return this;
    };

    Queue.prototype.poll = function poll() {
        var _this = this;

        if (this._promise) return this._promise;

        this._promise = new _coreExternals.Promise(function (resolve, reject) {

            _coreUtils.poll(function (next) {

                if (_this.isPaused()) return next();

                _this._promise = null;

                _this.resume(); // this is actually not needed but why not

                resolve(null);
            }, Queue._pollInterval);
        });

        return this._promise;
    };

    return Queue;
})();

exports['default'] = Queue;
module.exports = exports['default'];

/***/ },
/* 17 */
/***/ function(module, exports) {

'use strict';

exports.__esModule = true;

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var Auth = (function () {
    _createClass(Auth, null, [{
        key: 'refreshHandicapMs',
        value: 60 * 1000,
        // 1 minute
        enumerable: true
    }, {
        key: 'forcedTokenType',
        value: 'forced',
        enumerable: true
    }]);

    function Auth(cache, cacheId) {
        _classCallCheck(this, Auth);

        /** @type {Cache} */
        this._cache = cache;
        this._cacheId = cacheId;
    }

    //export interface IAuthData {
    //    remember?:boolean;
    //    token_type?:string;
    //    access_token?:string;
    //    expires_in?:number; // actually it's string
    //    expire_time?:number;
    //    refresh_token?:string;
    //    refresh_token_expires_in?:number; // actually it's string
    //    refresh_token_expire_time?:number;
    //    scope?:string;
    //}

    Auth.prototype.accessToken = function accessToken() {
        return this.data().access_token;
    };

    Auth.prototype.refreshToken = function refreshToken() {
        return this.data().refresh_token;
    };

    Auth.prototype.tokenType = function tokenType() {
        return this.data().token_type;
    };

    /**
     * @return {{token_type: string, access_token: string, expires_in: number, refresh_token: string, refresh_token_expires_in: number}}
     */

    Auth.prototype.data = function data() {

        return this._cache.getItem(this._cacheId) || {
            token_type: '',
            access_token: '',
            expires_in: 0,
            refresh_token: '',
            refresh_token_expires_in: 0
        };
    };

    /**
     * @param {object} newData
     * @return {Auth}
     */

    Auth.prototype.setData = function setData(newData) {

        newData = newData || {};

        var data = this.data();

        Object.keys(newData).forEach(function (key) {
            data[key] = newData[key];
        });

        data.expire_time = Date.now() + data.expires_in * 1000;
        data.refresh_token_expire_time = Date.now() + data.refresh_token_expires_in * 1000;

        this._cache.setItem(this._cacheId, data);

        return this;
    };

    /**
     * Check if there is a valid (not expired) access token
     * @return {boolean}
     */

    Auth.prototype.accessTokenValid = function accessTokenValid() {

        var authData = this.data();
        return authData.token_type === Auth.forcedTokenType || authData.expire_time - Auth.refreshHandicapMs > Date.now();
    };

    /**
     * Check if there is a valid (not expired) access token
     * @return {boolean}
     */

    Auth.prototype.refreshTokenValid = function refreshTokenValid() {

        return this.data().refresh_token_expire_time > Date.now();
    };

    /**
     * @return {Auth}
     */

    Auth.prototype.cancelAccessToken = function cancelAccessToken() {

        return this.setData({
            access_token: '',
            expires_in: 0
        });
    };

    /**
     * This method sets a special authentication mode used in Service Web
     * @return {Auth}
     */

    Auth.prototype.forceAuthentication = function forceAuthentication() {

        this.setData({
            token_type: Auth.forcedTokenType,
            access_token: '',
            expires_in: 0,
            refresh_token: '',
            refresh_token_expires_in: 0
        });

        return this;
    };

    /**
     * @param remember
     * @return {Auth}
     */

    Auth.prototype.setRemember = function setRemember(remember) {

        return this.setData({ remember: remember });
    };

    /**
     * @return {boolean}
     */

    Auth.prototype.remember = function remember() {

        return !!this.data().remember;
    };

    return Auth;
})();

exports['default'] = Auth;
module.exports = exports['default'];

/***/ },
/* 18 */
/***/ function(module, exports, __webpack_require__) {

'use strict';

exports.__esModule = true;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _PubnubMockJs = __webpack_require__(19);

var _PubnubMockJs2 = _interopRequireDefault(_PubnubMockJs);

var _coreExternals = __webpack_require__(3);

var PubnubMockFactory = (function () {
    function PubnubMockFactory() {
        _classCallCheck(this, PubnubMockFactory);

        this.crypto_obj = _coreExternals.PUBNUB.crypto_obj;
    }

    PubnubMockFactory.prototype.init = function init(options) {
        return new _PubnubMockJs2['default'](options);
    };

    return PubnubMockFactory;
})();

exports['default'] = PubnubMockFactory;
module.exports = exports['default'];

/***/ },
/* 19 */
/***/ function(module, exports, __webpack_require__) {

'use strict';

exports.__esModule = true;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _coreObservable = __webpack_require__(8);

var _coreObservable2 = _interopRequireDefault(_coreObservable);

var _coreExternals = __webpack_require__(3);

var PubnubMock = (function (_Observable) {
    _inherits(PubnubMock, _Observable);

    function PubnubMock(options) {
        _classCallCheck(this, PubnubMock);

        _Observable.call(this);
        this.options = options;
        this.crypto_obj = _coreExternals.PUBNUB.crypto_obj;
    }

    PubnubMock.prototype.ready = function ready() {};

    PubnubMock.prototype.subscribe = function subscribe(options) {
        this.on('message-' + options.channel, options.message);
    };

    PubnubMock.prototype.unsubscribe = function unsubscribe(options) {
        this.off('message-' + options.channel);
    };

    PubnubMock.prototype.receiveMessage = function receiveMessage(msg, channel) {
        this.emit('message-' + channel, msg, 'env', channel);
    };

    return PubnubMock;
})(_coreObservable2['default']);

exports['default'] = PubnubMock;
module.exports = exports['default'];

/***/ },
/* 20 */
/***/ function(module, exports, __webpack_require__) {

'use strict';

exports.__esModule = true;

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _coreObservable = __webpack_require__(8);

var _coreObservable2 = _interopRequireDefault(_coreObservable);

var _httpClient = __webpack_require__(9);

var _httpClient2 = _interopRequireDefault(_httpClient);

var _coreUtils = __webpack_require__(2);

var Subscription = (function (_Observable) {
    _inherits(Subscription, _Observable);

    _createClass(Subscription, null, [{
        key: '_renewHandicapMs',
        value: 2 * 60 * 1000,
        enumerable: true
    }, {
        key: '_pollInterval',
        value: 10 * 1000,
        enumerable: true
    }]);

    function Subscription(pubnubFactory, platform, cache) {
        _classCallCheck(this, Subscription);

        _Observable.call(this);

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
        this._cache = cache;
        this._pubnub = null;
        this._timeout = null;
        this._subscription = {};
    }

    //export interface ISubscription {
    //    id?:string;
    //    uri?: string;
    //    eventFilters?:string[];
    //    expirationTime?:string; // 2014-03-12T19:54:35.613Z
    //    expiresIn?:number;
    //    deliveryMode?: {
    //        transportType?:string;
    //        encryption?:boolean;
    //        address?:string;
    //        subscriberKey?:string;
    //        encryptionKey?:string;
    //        secretKey?:string;
    //    };
    //    creationTime?:string; // 2014-03-12T19:54:35.613Z
    //    status?:string; // Active
    //}

    /**
     * @return {boolean}
     */

    Subscription.prototype.alive = function alive() {

        return !!(this._subscription.id && this._subscription.deliveryMode && this._subscription.deliveryMode.subscriberKey && this._subscription.deliveryMode.address && Date.now() < this.expirationTime());
    };

    Subscription.prototype.expirationTime = function expirationTime() {
        return new Date(this._subscription.expirationTime || 0).getTime() - Subscription._renewHandicapMs;
    };

    Subscription.prototype.setSubscription = function setSubscription(subscription) {

        subscription = subscription || {};

        this._clearTimeout();

        this._subscription = subscription;

        if (!this._pubnub) this._subscribeAtPubnub();

        this._setTimeout();

        return this;
    };

    Subscription.prototype.subscription = function subscription() {
        return this._subscription;
    };

    /**
     * Creates or updates subscription if there is an active one
     * @param {{events?:string[]}} [options] New array of events
     * @returns {Promise<ApiResponse>}
     */

    Subscription.prototype.register = function register(options) {
        return regeneratorRuntime.async(function register$(context$2$0) {
            while (1) switch (context$2$0.prev = context$2$0.next) {
                case 0:
                    if (!this.alive()) {
                        context$2$0.next = 6;
                        break;
                    }

                    context$2$0.next = 3;
                    return regeneratorRuntime.awrap(this.renew(options));

                case 3:
                    return context$2$0.abrupt('return', context$2$0.sent);

                case 6:
                    context$2$0.next = 8;
                    return regeneratorRuntime.awrap(this.subscribe(options));

                case 8:
                    return context$2$0.abrupt('return', context$2$0.sent);

                case 9:
                case 'end':
                    return context$2$0.stop();
            }
        }, null, this);
    };

    Subscription.prototype.eventFilters = function eventFilters() {
        return this._subscription.eventFilters || [];
    };

    /**
     * @param {string[]} events
     * @return {Subscription}
     */

    Subscription.prototype.addEventFilters = function addEventFilters(events) {
        this.setEventFilters(this.eventFilters().concat(events));
        return this;
    };

    /**
     * @param {string[]} events
     * @return {Subscription}
     */

    Subscription.prototype.setEventFilters = function setEventFilters(events) {
        this._subscription.eventFilters = events;
        return this;
    };

    /**
     * @param {{events?:string[]}} [options] New array of events
     * @returns {Promise<ApiResponse>}
     */

    Subscription.prototype.subscribe = function subscribe(options) {
        var response, json;
        return regeneratorRuntime.async(function subscribe$(context$2$0) {
            while (1) switch (context$2$0.prev = context$2$0.next) {
                case 0:
                    context$2$0.prev = 0;

                    options = options || {};

                    if (options.events) this.setEventFilters(options.events);

                    this._clearTimeout();

                    if (this.eventFilters().length) {
                        context$2$0.next = 6;
                        break;
                    }

                    throw new Error('Events are undefined');

                case 6:
                    context$2$0.next = 8;
                    return regeneratorRuntime.awrap(this._platform.post('/restapi/v1.0/subscription', {
                        eventFilters: this._getFullEventFilters(),
                        deliveryMode: {
                            transportType: 'PubNub'
                        }
                    }));

                case 8:
                    response = context$2$0.sent;
                    json = response.json();

                    this.setSubscription(json).emit(this.events.subscribeSuccess, response);

                    return context$2$0.abrupt('return', response);

                case 14:
                    context$2$0.prev = 14;
                    context$2$0.t0 = context$2$0['catch'](0);

                    context$2$0.t0 = this._platform.client().makeError(context$2$0.t0);

                    this.reset().emit(this.events.subscribeError, context$2$0.t0);

                    throw context$2$0.t0;

                case 19:
                case 'end':
                    return context$2$0.stop();
            }
        }, null, this, [[0, 14]]);
    };

    /**
     * @param {{events?:string[]}} [options] New array of events
     * @returns {Promise<ApiResponse>}
     */

    Subscription.prototype.renew = function renew(options) {
        var response, json;
        return regeneratorRuntime.async(function renew$(context$2$0) {
            while (1) switch (context$2$0.prev = context$2$0.next) {
                case 0:
                    context$2$0.prev = 0;

                    options = options || {};

                    if (options.events) this.setEventFilters(options.events);

                    this._clearTimeout();

                    if (this.alive()) {
                        context$2$0.next = 6;
                        break;
                    }

                    throw new Error('Subscription is not alive');

                case 6:
                    if (this.eventFilters().length) {
                        context$2$0.next = 8;
                        break;
                    }

                    throw new Error('Events are undefined');

                case 8:
                    context$2$0.next = 10;
                    return regeneratorRuntime.awrap(this._platform.put('/restapi/v1.0/subscription/' + this._subscription.id, {
                        eventFilters: this._getFullEventFilters()
                    }));

                case 10:
                    response = context$2$0.sent;
                    json = response.json();

                    this.setSubscription(json).emit(this.events.renewSuccess, response);

                    return context$2$0.abrupt('return', response);

                case 16:
                    context$2$0.prev = 16;
                    context$2$0.t0 = context$2$0['catch'](0);

                    context$2$0.t0 = this._platform.client().makeError(context$2$0.t0);

                    this.reset().emit(this.events.renewError, context$2$0.t0);

                    throw context$2$0.t0;

                case 21:
                case 'end':
                    return context$2$0.stop();
            }
        }, null, this, [[0, 16]]);
    };

    /**
     * @returns {Promise<ApiResponse>}
     */

    Subscription.prototype.remove = function remove() {
        var response;
        return regeneratorRuntime.async(function remove$(context$2$0) {
            while (1) switch (context$2$0.prev = context$2$0.next) {
                case 0:
                    context$2$0.prev = 0;

                    if (this.alive()) {
                        context$2$0.next = 3;
                        break;
                    }

                    throw new Error('Subscription is not alive');

                case 3:
                    context$2$0.next = 5;
                    return regeneratorRuntime.awrap(this._platform['delete']('/restapi/v1.0/subscription/' + this._subscription.id));

                case 5:
                    response = context$2$0.sent;

                    this.reset().emit(this.events.removeSuccess, response);

                    return context$2$0.abrupt('return', response);

                case 10:
                    context$2$0.prev = 10;
                    context$2$0.t0 = context$2$0['catch'](0);

                    context$2$0.t0 = this._platform.client().makeError(context$2$0.t0);

                    this.emit(this.events.removeError, context$2$0.t0);

                    throw context$2$0.t0;

                case 15:
                case 'end':
                    return context$2$0.stop();
            }
        }, null, this, [[0, 10]]);
    };

    /**
     * Remove subscription and disconnect from PUBNUB
     * This method resets subscription at client side but backend is not notified
     */

    Subscription.prototype.reset = function reset() {
        this._clearTimeout();
        if (this.alive() && this._pubnub) this._pubnub.unsubscribe({ channel: this._subscription.deliveryMode.address });
        this._subscription = {};
        return this;
    };

    /**
     *
     * @param {string} cacheKey
     * @param {string[]} events
     * @return {Subscription}
     */

    Subscription.prototype.restoreFromCache = function restoreFromCache(cacheKey, events) {
        var _this = this;

        this.on([this.events.subscribeSuccess, this.events.renewSuccess], function () {

            _this._cache.setItem(cacheKey, _this.subscription());
        });

        this.on(this.events.renewError, function () {

            _this.reset().setEventFilters(events).register();
        });

        var cachedSubscriptionData = this._cache.getItem(cacheKey);

        if (cachedSubscriptionData) {
            try {
                this.setSubscription(cachedSubscriptionData);
            } catch (e) {}
        } else {
            this.setEventFilters(events);
        }

        return this;
    };

    Subscription.prototype._getFullEventFilters = function _getFullEventFilters() {
        var _this2 = this;

        return this.eventFilters().map(function (event) {
            return _this2._platform.createUrl(event);
        });
    };

    Subscription.prototype._setTimeout = function _setTimeout() {
        var _this3 = this;

        this._clearTimeout();

        if (!this.alive()) throw new Error('Subscription is not alive');

        _coreUtils.poll(function (next) {

            if (_this3.alive()) return next();

            _this3.renew();
        }, Subscription._pollInterval, this._timeout);

        return this;
    };

    Subscription.prototype._clearTimeout = function _clearTimeout() {

        _coreUtils.stopPolling(this._timeout);

        return this;
    };

    Subscription.prototype._decrypt = function _decrypt(message) {

        if (!this.alive()) throw new Error('Subscription is not alive');

        if (this._subscription.deliveryMode.encryptionKey) {

            var PUBNUB = this._pubnubFactory;

            message = PUBNUB.crypto_obj.decrypt(message, this._subscription.deliveryMode.encryptionKey, {
                encryptKey: false,
                keyEncoding: 'base64',
                keyLength: 128,
                mode: 'ecb'
            });
        }

        return message;
    };

    Subscription.prototype._notify = function _notify(message) {

        this.emit(this.events.notification, this._decrypt(message));

        return this;
    };

    Subscription.prototype._subscribeAtPubnub = function _subscribeAtPubnub() {

        if (!this.alive()) throw new Error('Subscription is not alive');

        var PUBNUB = this._pubnubFactory;

        this._pubnub = PUBNUB.init({
            ssl: true,
            subscribe_key: this._subscription.deliveryMode.subscriberKey
        });

        this._pubnub.ready();

        this._pubnub.subscribe({
            channel: this._subscription.deliveryMode.address,
            message: this._notify.bind(this),
            connect: function connect() {}
        });

        return this;
    };

    return Subscription;
})(_coreObservable2['default']);

exports['default'] = Subscription;
module.exports = exports['default'];

/***/ },
/* 21 */
/***/ function(module, exports) {

/* WEBPACK VAR INJECTION */(function(global) {/**
 * Copyright (c) 2014, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * https://raw.github.com/facebook/regenerator/master/LICENSE file. An
 * additional grant of patent rights can be found in the PATENTS file in
 * the same directory.
 */

!(function(global) {
  "use strict";

  var hasOwn = Object.prototype.hasOwnProperty;
  var undefined; // More compressible than void 0.
  var iteratorSymbol =
    typeof Symbol === "function" && Symbol.iterator || "@@iterator";

  var inModule = typeof module === "object";
  var runtime = global.regeneratorRuntime;
  if (runtime) {
    if (inModule) {
      // If regeneratorRuntime is defined globally and we're in a module,
      // make the exports object identical to regeneratorRuntime.
      module.exports = runtime;
    }
    // Don't bother evaluating the rest of this file if the runtime was
    // already defined globally.
    return;
  }

  // Define the runtime globally (as expected by generated code) as either
  // module.exports (if we're in a module) or a new, empty object.
  runtime = global.regeneratorRuntime = inModule ? module.exports : {};

  function wrap(innerFn, outerFn, self, tryLocsList) {
    // If outerFn provided, then outerFn.prototype instanceof Generator.
    var generator = Object.create((outerFn || Generator).prototype);
    var context = new Context(tryLocsList || []);

    // The ._invoke method unifies the implementations of the .next,
    // .throw, and .return methods.
    generator._invoke = makeInvokeMethod(innerFn, self, context);

    return generator;
  }
  runtime.wrap = wrap;

  // Try/catch helper to minimize deoptimizations. Returns a completion
  // record like context.tryEntries[i].completion. This interface could
  // have been (and was previously) designed to take a closure to be
  // invoked without arguments, but in all the cases we care about we
  // already have an existing method we want to call, so there's no need
  // to create a new function object. We can even get away with assuming
  // the method takes exactly one argument, since that happens to be true
  // in every case, so we don't have to touch the arguments object. The
  // only additional allocation required is the completion record, which
  // has a stable shape and so hopefully should be cheap to allocate.
  function tryCatch(fn, obj, arg) {
    try {
      return { type: "normal", arg: fn.call(obj, arg) };
    } catch (err) {
      return { type: "throw", arg: err };
    }
  }

  var GenStateSuspendedStart = "suspendedStart";
  var GenStateSuspendedYield = "suspendedYield";
  var GenStateExecuting = "executing";
  var GenStateCompleted = "completed";

  // Returning this object from the innerFn has the same effect as
  // breaking out of the dispatch switch statement.
  var ContinueSentinel = {};

  // Dummy constructor functions that we use as the .constructor and
  // .constructor.prototype properties for functions that return Generator
  // objects. For full spec compliance, you may wish to configure your
  // minifier not to mangle the names of these two functions.
  function Generator() {}
  function GeneratorFunction() {}
  function GeneratorFunctionPrototype() {}

  var Gp = GeneratorFunctionPrototype.prototype = Generator.prototype;
  GeneratorFunction.prototype = Gp.constructor = GeneratorFunctionPrototype;
  GeneratorFunctionPrototype.constructor = GeneratorFunction;
  GeneratorFunction.displayName = "GeneratorFunction";

  // Helper for defining the .next, .throw, and .return methods of the
  // Iterator interface in terms of a single ._invoke method.
  function defineIteratorMethods(prototype) {
    ["next", "throw", "return"].forEach(function(method) {
      prototype[method] = function(arg) {
        return this._invoke(method, arg);
      };
    });
  }

  runtime.isGeneratorFunction = function(genFun) {
    var ctor = typeof genFun === "function" && genFun.constructor;
    return ctor
      ? ctor === GeneratorFunction ||
        // For the native GeneratorFunction constructor, the best we can
        // do is to check its .name property.
        (ctor.displayName || ctor.name) === "GeneratorFunction"
      : false;
  };

  runtime.mark = function(genFun) {
    if (Object.setPrototypeOf) {
      Object.setPrototypeOf(genFun, GeneratorFunctionPrototype);
    } else {
      genFun.__proto__ = GeneratorFunctionPrototype;
    }
    genFun.prototype = Object.create(Gp);
    return genFun;
  };

  // Within the body of any async function, `await x` is transformed to
  // `yield regeneratorRuntime.awrap(x)`, so that the runtime can test
  // `value instanceof AwaitArgument` to determine if the yielded value is
  // meant to be awaited. Some may consider the name of this method too
  // cutesy, but they are curmudgeons.
  runtime.awrap = function(arg) {
    return new AwaitArgument(arg);
  };

  function AwaitArgument(arg) {
    this.arg = arg;
  }

  function AsyncIterator(generator) {
    // This invoke function is written in a style that assumes some
    // calling function (or Promise) will handle exceptions.
    function invoke(method, arg) {
      var result = generator[method](arg);
      var value = result.value;
      return value instanceof AwaitArgument
        ? Promise.resolve(value.arg).then(invokeNext, invokeThrow)
        : Promise.resolve(value).then(function(unwrapped) {
            // When a yielded Promise is resolved, its final value becomes
            // the .value of the Promise<{value,done}> result for the
            // current iteration. If the Promise is rejected, however, the
            // result for this iteration will be rejected with the same
            // reason. Note that rejections of yielded Promises are not
            // thrown back into the generator function, as is the case
            // when an awaited Promise is rejected. This difference in
            // behavior between yield and await is important, because it
            // allows the consumer to decide what to do with the yielded
            // rejection (swallow it and continue, manually .throw it back
            // into the generator, abandon iteration, whatever). With
            // await, by contrast, there is no opportunity to examine the
            // rejection reason outside the generator function, so the
            // only option is to throw it from the await expression, and
            // let the generator function handle the exception.
            result.value = unwrapped;
            return result;
          });
    }

    if (typeof process === "object" && process.domain) {
      invoke = process.domain.bind(invoke);
    }

    var invokeNext = invoke.bind(generator, "next");
    var invokeThrow = invoke.bind(generator, "throw");
    var invokeReturn = invoke.bind(generator, "return");
    var previousPromise;

    function enqueue(method, arg) {
      function callInvokeWithMethodAndArg() {
        return invoke(method, arg);
      }

      return previousPromise =
        // If enqueue has been called before, then we want to wait until
        // all previous Promises have been resolved before calling invoke,
        // so that results are always delivered in the correct order. If
        // enqueue has not been called before, then it is important to
        // call invoke immediately, without waiting on a callback to fire,
        // so that the async generator function has the opportunity to do
        // any necessary setup in a predictable way. This predictability
        // is why the Promise constructor synchronously invokes its
        // executor callback, and why async functions synchronously
        // execute code before the first await. Since we implement simple
        // async functions in terms of async generators, it is especially
        // important to get this right, even though it requires care.
        previousPromise ? previousPromise.then(
          callInvokeWithMethodAndArg,
          // Avoid propagating failures to Promises returned by later
          // invocations of the iterator.
          callInvokeWithMethodAndArg
        ) : new Promise(function (resolve) {
          resolve(callInvokeWithMethodAndArg());
        });
    }

    // Define the unified helper method that is used to implement .next,
    // .throw, and .return (see defineIteratorMethods).
    this._invoke = enqueue;
  }

  defineIteratorMethods(AsyncIterator.prototype);

  // Note that simple async functions are implemented on top of
  // AsyncIterator objects; they just return a Promise for the value of
  // the final result produced by the iterator.
  runtime.async = function(innerFn, outerFn, self, tryLocsList) {
    var iter = new AsyncIterator(
      wrap(innerFn, outerFn, self, tryLocsList)
    );

    return runtime.isGeneratorFunction(outerFn)
      ? iter // If outerFn is a generator, return the full iterator.
      : iter.next().then(function(result) {
          return result.done ? result.value : iter.next();
        });
  };

  function makeInvokeMethod(innerFn, self, context) {
    var state = GenStateSuspendedStart;

    return function invoke(method, arg) {
      if (state === GenStateExecuting) {
        throw new Error("Generator is already running");
      }

      if (state === GenStateCompleted) {
        if (method === "throw") {
          throw arg;
        }

        // Be forgiving, per 25.3.3.3.3 of the spec:
        // https://people.mozilla.org/~jorendorff/es6-draft.html#sec-generatorresume
        return doneResult();
      }

      while (true) {
        var delegate = context.delegate;
        if (delegate) {
          if (method === "return" ||
              (method === "throw" && delegate.iterator[method] === undefined)) {
            // A return or throw (when the delegate iterator has no throw
            // method) always terminates the yield* loop.
            context.delegate = null;

            // If the delegate iterator has a return method, give it a
            // chance to clean up.
            var returnMethod = delegate.iterator["return"];
            if (returnMethod) {
              var record = tryCatch(returnMethod, delegate.iterator, arg);
              if (record.type === "throw") {
                // If the return method threw an exception, let that
                // exception prevail over the original return or throw.
                method = "throw";
                arg = record.arg;
                continue;
              }
            }

            if (method === "return") {
              // Continue with the outer return, now that the delegate
              // iterator has been terminated.
              continue;
            }
          }

          var record = tryCatch(
            delegate.iterator[method],
            delegate.iterator,
            arg
          );

          if (record.type === "throw") {
            context.delegate = null;

            // Like returning generator.throw(uncaught), but without the
            // overhead of an extra function call.
            method = "throw";
            arg = record.arg;
            continue;
          }

          // Delegate generator ran and handled its own exceptions so
          // regardless of what the method was, we continue as if it is
          // "next" with an undefined arg.
          method = "next";
          arg = undefined;

          var info = record.arg;
          if (info.done) {
            context[delegate.resultName] = info.value;
            context.next = delegate.nextLoc;
          } else {
            state = GenStateSuspendedYield;
            return info;
          }

          context.delegate = null;
        }

        if (method === "next") {
          if (state === GenStateSuspendedYield) {
            context.sent = arg;
          } else {
            context.sent = undefined;
          }

        } else if (method === "throw") {
          if (state === GenStateSuspendedStart) {
            state = GenStateCompleted;
            throw arg;
          }

          if (context.dispatchException(arg)) {
            // If the dispatched exception was caught by a catch block,
            // then let that catch block handle the exception normally.
            method = "next";
            arg = undefined;
          }

        } else if (method === "return") {
          context.abrupt("return", arg);
        }

        state = GenStateExecuting;

        var record = tryCatch(innerFn, self, context);
        if (record.type === "normal") {
          // If an exception is thrown from innerFn, we leave state ===
          // GenStateExecuting and loop back for another invocation.
          state = context.done
            ? GenStateCompleted
            : GenStateSuspendedYield;

          var info = {
            value: record.arg,
            done: context.done
          };

          if (record.arg === ContinueSentinel) {
            if (context.delegate && method === "next") {
              // Deliberately forget the last sent value so that we don't
              // accidentally pass it on to the delegate.
              arg = undefined;
            }
          } else {
            return info;
          }

        } else if (record.type === "throw") {
          state = GenStateCompleted;
          // Dispatch the exception by looping back around to the
          // context.dispatchException(arg) call above.
          method = "throw";
          arg = record.arg;
        }
      }
    };
  }

  // Define Generator.prototype.{next,throw,return} in terms of the
  // unified ._invoke helper method.
  defineIteratorMethods(Gp);

  Gp[iteratorSymbol] = function() {
    return this;
  };

  Gp.toString = function() {
    return "[object Generator]";
  };

  function pushTryEntry(locs) {
    var entry = { tryLoc: locs[0] };

    if (1 in locs) {
      entry.catchLoc = locs[1];
    }

    if (2 in locs) {
      entry.finallyLoc = locs[2];
      entry.afterLoc = locs[3];
    }

    this.tryEntries.push(entry);
  }

  function resetTryEntry(entry) {
    var record = entry.completion || {};
    record.type = "normal";
    delete record.arg;
    entry.completion = record;
  }

  function Context(tryLocsList) {
    // The root entry object (effectively a try statement without a catch
    // or a finally block) gives us a place to store values thrown from
    // locations where there is no enclosing try statement.
    this.tryEntries = [{ tryLoc: "root" }];
    tryLocsList.forEach(pushTryEntry, this);
    this.reset(true);
  }

  runtime.keys = function(object) {
    var keys = [];
    for (var key in object) {
      keys.push(key);
    }
    keys.reverse();

    // Rather than returning an object with a next method, we keep
    // things simple and return the next function itself.
    return function next() {
      while (keys.length) {
        var key = keys.pop();
        if (key in object) {
          next.value = key;
          next.done = false;
          return next;
        }
      }

      // To avoid creating an additional object, we just hang the .value
      // and .done properties off the next function object itself. This
      // also ensures that the minifier will not anonymize the function.
      next.done = true;
      return next;
    };
  };

  function values(iterable) {
    if (iterable) {
      var iteratorMethod = iterable[iteratorSymbol];
      if (iteratorMethod) {
        return iteratorMethod.call(iterable);
      }

      if (typeof iterable.next === "function") {
        return iterable;
      }

      if (!isNaN(iterable.length)) {
        var i = -1, next = function next() {
          while (++i < iterable.length) {
            if (hasOwn.call(iterable, i)) {
              next.value = iterable[i];
              next.done = false;
              return next;
            }
          }

          next.value = undefined;
          next.done = true;

          return next;
        };

        return next.next = next;
      }
    }

    // Return an iterator with no values.
    return { next: doneResult };
  }
  runtime.values = values;

  function doneResult() {
    return { value: undefined, done: true };
  }

  Context.prototype = {
    constructor: Context,

    reset: function(skipTempReset) {
      this.prev = 0;
      this.next = 0;
      this.sent = undefined;
      this.done = false;
      this.delegate = null;

      this.tryEntries.forEach(resetTryEntry);

      if (!skipTempReset) {
        for (var name in this) {
          // Not sure about the optimal order of these conditions:
          if (name.charAt(0) === "t" &&
              hasOwn.call(this, name) &&
              !isNaN(+name.slice(1))) {
            this[name] = undefined;
          }
        }
      }
    },

    stop: function() {
      this.done = true;

      var rootEntry = this.tryEntries[0];
      var rootRecord = rootEntry.completion;
      if (rootRecord.type === "throw") {
        throw rootRecord.arg;
      }

      return this.rval;
    },

    dispatchException: function(exception) {
      if (this.done) {
        throw exception;
      }

      var context = this;
      function handle(loc, caught) {
        record.type = "throw";
        record.arg = exception;
        context.next = loc;
        return !!caught;
      }

      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        var record = entry.completion;

        if (entry.tryLoc === "root") {
          // Exception thrown outside of any try block that could handle
          // it, so set the completion value of the entire function to
          // throw the exception.
          return handle("end");
        }

        if (entry.tryLoc <= this.prev) {
          var hasCatch = hasOwn.call(entry, "catchLoc");
          var hasFinally = hasOwn.call(entry, "finallyLoc");

          if (hasCatch && hasFinally) {
            if (this.prev < entry.catchLoc) {
              return handle(entry.catchLoc, true);
            } else if (this.prev < entry.finallyLoc) {
              return handle(entry.finallyLoc);
            }

          } else if (hasCatch) {
            if (this.prev < entry.catchLoc) {
              return handle(entry.catchLoc, true);
            }

          } else if (hasFinally) {
            if (this.prev < entry.finallyLoc) {
              return handle(entry.finallyLoc);
            }

          } else {
            throw new Error("try statement without catch or finally");
          }
        }
      }
    },

    abrupt: function(type, arg) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.tryLoc <= this.prev &&
            hasOwn.call(entry, "finallyLoc") &&
            this.prev < entry.finallyLoc) {
          var finallyEntry = entry;
          break;
        }
      }

      if (finallyEntry &&
          (type === "break" ||
           type === "continue") &&
          finallyEntry.tryLoc <= arg &&
          arg <= finallyEntry.finallyLoc) {
        // Ignore the finally entry if control is not jumping to a
        // location outside the try/catch block.
        finallyEntry = null;
      }

      var record = finallyEntry ? finallyEntry.completion : {};
      record.type = type;
      record.arg = arg;

      if (finallyEntry) {
        this.next = finallyEntry.finallyLoc;
      } else {
        this.complete(record);
      }

      return ContinueSentinel;
    },

    complete: function(record, afterLoc) {
      if (record.type === "throw") {
        throw record.arg;
      }

      if (record.type === "break" ||
          record.type === "continue") {
        this.next = record.arg;
      } else if (record.type === "return") {
        this.rval = record.arg;
        this.next = "end";
      } else if (record.type === "normal" && afterLoc) {
        this.next = afterLoc;
      }
    },

    finish: function(finallyLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.finallyLoc === finallyLoc) {
          this.complete(entry.completion, entry.afterLoc);
          resetTryEntry(entry);
          return ContinueSentinel;
        }
      }
    },

    "catch": function(tryLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.tryLoc === tryLoc) {
          var record = entry.completion;
          if (record.type === "throw") {
            var thrown = record.arg;
            resetTryEntry(entry);
          }
          return thrown;
        }
      }

      // The context.catch method must only be called with a location
      // argument that corresponds to a known catch block.
      throw new Error("illegal catch attempt");
    },

    delegateYield: function(iterable, resultName, nextLoc) {
      this.delegate = {
        iterator: values(iterable),
        resultName: resultName,
        nextLoc: nextLoc
      };

      return ContinueSentinel;
    }
  };
})(
  // Among the various tricks for obtaining a reference to the global
  // object, this seems to be the most reliable technique that does not
  // use indirect eval (which violates Content Security Policy).
  typeof global === "object" ? global :
  typeof window === "object" ? window :
  typeof self === "object" ? self : this
);

/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ }
/******/ ])
});
;
//# sourceMappingURL=ringcentral.js.map