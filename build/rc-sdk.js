(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("es6-promise"), require("crypto-js"), require("pubnub"));
	else if(typeof define === 'function' && define.amd)
		define(["es6-promise", "crypto-js", "pubnub"], factory);
	else if(typeof exports === 'object')
		exports["RCSDK"] = factory(require("es6-promise"), require("crypto-js"), require("pubnub"));
	else
		root["RCSDK"] = factory(root["Promise"], root["CryptoJS"], root["PUBNUB"]);
})(this, function(__WEBPACK_EXTERNAL_MODULE_2__, __WEBPACK_EXTERNAL_MODULE_3__, __WEBPACK_EXTERNAL_MODULE_4__) {
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
/******/ 	__webpack_require__.p = "";
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

var __WEBPACK_AMD_DEFINE_RESULT__;/**
 * Browser-compatible version
 */
!(__WEBPACK_AMD_DEFINE_RESULT__ = function(require, exports, module) {

    'use strict';

    var promise = __webpack_require__(2);

    module.exports = __webpack_require__(5)({
        CryptoJS: __webpack_require__(3),
        localStorage: window.localStorage,
        Promise: (promise && 'Promise' in promise) ? promise.Promise : window.Promise,
        PUBNUB: __webpack_require__(4),
        XHR: window.XMLHttpRequest
    });

}.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

module.exports = __WEBPACK_EXTERNAL_MODULE_2__;

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

module.exports = __WEBPACK_EXTERNAL_MODULE_3__;

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

module.exports = __WEBPACK_EXTERNAL_MODULE_4__;

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_RESULT__ = function(require, exports, module) {

    'use strict';

    /**
     * @param {IInjections} injections
     * @returns {RCSDK}
     */
    module.exports = function(injections) {

        /**
         * @name RCSDK
         * @param {IOptions} [options]
         * @constructor
         */
        function RCSDK(options) {

            options = options || {};

            /** @private */
            this._context = __webpack_require__(6).$get(injections);

            this.getCache()
                .setPrefix(options.cachePrefix || '');

            this.getPlatform()
                .setServer(options.server)
                .setCredentials(options.appKey, options.appSecret);

            //TODO Link Platform events with Subscriptions and the rest

        }

        RCSDK.version = '1.2.1';

        // Internals

        /** @returns {Context} */
        RCSDK.prototype.getContext = function() { return this._context; };

        // Core

        /**
         * This is for internal use only
         * @protected
         * @returns {Request}
         */
        RCSDK.prototype.getRequest = function() { return __webpack_require__(7).$get(this.getContext()); };

        /**
         * This is for internal use only
         * @protected
         * @returns {Response}
         */
        RCSDK.prototype.getResponse = function(status, statusText, body, headers) {
            return __webpack_require__(8).$get(this.getContext(), status, statusText, body, headers);
        };

        /**
         * @returns {AjaxObserver}
         */
        RCSDK.prototype.getAjaxObserver = function() { return __webpack_require__(9).$get(this.getContext()); };

        /**
         * This is for internal use only
         * @protected
         * @returns {XhrResponse}
         */
        RCSDK.prototype.getXhrResponse = function() { return __webpack_require__(10).$get(this.getContext()); };

        /**
         * @returns {Platform}
         */
        RCSDK.prototype.getPlatform = function() { return __webpack_require__(11).$get(this.getContext()); };

        /**
         * @returns {Cache}
         */
        RCSDK.prototype.getCache = function() { return __webpack_require__(12).$get(this.getContext()); };

        /**
         * @returns {Subscription}
         */
        RCSDK.prototype.getSubscription = function() { return __webpack_require__(13).$get(this.getContext()); };

        /**
         * @returns {PageVisibility}
         */
        RCSDK.prototype.getPageVisibility = function() { return __webpack_require__(14).$get(this.getContext()); };

        /**
         * @returns {Helper}
         */
        RCSDK.prototype.getHelper = function() { return __webpack_require__(15).$get(this.getContext()); };

        /**
         * @returns {Observable}
         */
        RCSDK.prototype.getObservable = function() { return __webpack_require__(16).$get(this.getContext()); };

        /**
         * @returns {Validator}
         */
        RCSDK.prototype.getValidator = function() { return __webpack_require__(17).$get(this.getContext()); };

        /**
         * @returns {Log}
         */
        RCSDK.prototype.getLog = function() { return __webpack_require__(18).$get(this.getContext()); };

        /**
         * @returns {Utils}
         */
        RCSDK.prototype.getUtils = function() { return __webpack_require__(19).$get(this.getContext()); };

        /**
         * @returns {List}
         */
        RCSDK.prototype.getList = function() { return __webpack_require__(20).$get(this.getContext()); };

        // Helpers

        /**
         * @returns {CountryHelper}
         */
        RCSDK.prototype.getCountryHelper = function() { return __webpack_require__(21).$get(this.getContext()); };

        /**
         * @returns {DeviceModelHelper}
         */
        RCSDK.prototype.getDeviceModelHelper = function() { return __webpack_require__(22).$get(this.getContext()); };

        /**
         * @returns {LanguageHelper}
         */
        RCSDK.prototype.getLanguageHelper = function() { return __webpack_require__(23).$get(this.getContext()); };

        /**
         * @returns {LocationHelper}
         */
        RCSDK.prototype.getLocationHelper = function() { return __webpack_require__(24).$get(this.getContext()); };

        /**
         * @returns {ShippingMethodHelper}
         */
        RCSDK.prototype.getShippingMethodHelper = function() { return __webpack_require__(25).$get(this.getContext()); };

        /**
         * @returns {StateHelper}
         */
        RCSDK.prototype.getStateHelper = function() { return __webpack_require__(26).$get(this.getContext()); };

        /**
         * @returns {TimezoneHelper}
         */
        RCSDK.prototype.getTimezoneHelper = function() { return __webpack_require__(27).$get(this.getContext()); };

        /**
         * @returns {AccountHelper}
         */
        RCSDK.prototype.getAccountHelper = function() { return __webpack_require__(28).$get(this.getContext()); };

        /**
         * @returns {BlockedNumberHelper}
         */
        RCSDK.prototype.getBlockedNumberHelper = function() { return __webpack_require__(29).$get(this.getContext()); };

        /**
         * @returns {CallHelper}
         */
        RCSDK.prototype.getCallHelper = function() { return __webpack_require__(30).$get(this.getContext()); };

        /**
         * @returns {ConferencingHelper}
         */
        RCSDK.prototype.getConferencingHelper = function() { return __webpack_require__(31).$get(this.getContext()); };

        /**
         * @returns {ContactHelper}
         */
        RCSDK.prototype.getContactHelper = function() { return __webpack_require__(32).$get(this.getContext()); };

        /**
         * @returns {ContactGroupHelper}
         */
        RCSDK.prototype.getContactGroupHelper = function() { return __webpack_require__(33).$get(this.getContext()); };

        /**
         * @returns {DeviceHelper}
         */
        RCSDK.prototype.getDeviceHelper = function() { return __webpack_require__(34).$get(this.getContext()); };

        /**
         * @returns {ExtensionHelper}
         */
        RCSDK.prototype.getExtensionHelper = function() { return __webpack_require__(35).$get(this.getContext()); };

        /**
         * @returns {ForwardingNumberHelper}
         */
        RCSDK.prototype.getForwardingNumberHelper = function() { return __webpack_require__(36).$get(this.getContext()); };

        /**
         * @returns {MessageHelper}
         */
        RCSDK.prototype.getMessageHelper = function() { return __webpack_require__(37).$get(this.getContext()); };

        /**
         * @returns {PhoneNumberHelper}
         */
        RCSDK.prototype.getPhoneNumberHelper = function() { return __webpack_require__(38).$get(this.getContext()); };

        /**
         * @returns {PresenceHelper}
         */
        RCSDK.prototype.getPresenceHelper = function() { return __webpack_require__(39).$get(this.getContext()); };

        /**
         * @returns {RingoutHelper}
         */
        RCSDK.prototype.getRingoutHelper = function() { return __webpack_require__(40).$get(this.getContext()); };

        /**
         * @returns {ServiceHelper}
         */
        RCSDK.prototype.getServiceHelper = function() { return __webpack_require__(41).$get(this.getContext()); };

        if (!injections
            || !('CryptoJS' in injections)
            || !('localStorage' in injections)
            || !('Promise' in injections)
            || !('PUBNUB' in injections)
            || !('XHR' in injections)) throw new Error('Injections object is not complete');

        injections.XHR = (injections.XHR || function() {
            try { return new ActiveXObject("Msxml2.XMLHTTP.6.0"); } catch (e1) {}
            try { return new ActiveXObject("Msxml2.XMLHTTP.3.0"); } catch (e2) {}
            try { return new ActiveXObject("Msxml2.XMLHTTP"); } catch (e3) {}
            throw new Error("This browser does not support XMLHttpRequest.");
        });

        return RCSDK;

    };

    /**
     * @typedef {Object} IInjections
     * @property {PUBNUB} PUBNUB
     * @property {CryptoJS} CryptoJS
     * @property {Storage} localStorage
     * @property {XMLHttpRequest} XHR
     * @property {Promise} Promise
     */

    /**
     * @typedef {Object} IOptions
     * @property {string} server
     * @property {string} appKey
     * @property {string} appSecret
     * @property {string} [cachePrefix]
     */

}.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_RESULT__ = function(require, exports, module) {

    'use strict';

    /**
     * @constructor
     * @param {IInjections} injections
     */
    function Context(injections) {
        /** @private */
        this.singletons = {};
        /** @type {IInjections} */
        this.injections = injections;
        this.stubPubnub = false;
        this.stubAjax = false;
    }

    /**
     * @param {string} name
     * @param {function} factory
     * @returns {*}
     */
    Context.prototype.createSingleton = function(name, factory) {

        if (!this.singletons[name]) this.singletons[name] = factory();
        return this.singletons[name];

    };

    Context.prototype.usePubnubStub = function(flag) {
        this.stubPubnub = !!flag;
        return this;
    };

    Context.prototype.useAjaxStub = function(flag) {
        this.stubAjax = !!flag;
        return this;
    };

    /**
     * @returns {CryptoJS}
     */
    Context.prototype.getCryptoJS = function() {
        return this.injections.CryptoJS;
    };

    /**
     * @returns {PUBNUB}
     */
    Context.prototype.getPubnub = function() {
        return this.stubPubnub ? __webpack_require__(42).$get(this) : this.injections.PUBNUB;
    };

    /**
     * @returns {Storage}
     * @abstract
     */
    Context.prototype.getLocalStorage = function() {
        return this.createSingleton('localStorage', function() {
            return (typeof this.injections.localStorage == 'function')
                ? new this.injections.localStorage() // this is NPM dom-storage constructor
                : this.injections.localStorage; // this is window.localStorage
        }.bind(this));
    };

    /**
     * @returns {function(new:Promise)}
     */
    Context.prototype.getPromise = function() {
        return this.injections.Promise;
    };

    /**
     * @returns {XMLHttpRequest}
     */
    Context.prototype.getXHR = function() {
        return this.stubAjax ? __webpack_require__(43).$get(this) : new this.injections.XHR();
    };

    module.exports = {
        Class: Context,
        /**
         * @param {IInjections} injections
         */
        $get: function(injections) {
            return new Context(injections);
        }
    };

}.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_RESULT__ = function(require, exports, module) {

    'use strict';

    var Headers = __webpack_require__(44).Class,
        Response = __webpack_require__(8),
        Utils = __webpack_require__(19),
        Log = __webpack_require__(18);

    /**
     * @typedef {Object} IAjaxOptions
     * @property {string} url
     * @property {string} method?
     * @property {boolean} async?
     * @property {Object} body?
     * @property {Object} query?
     * @property {Object} headers?
     * @property {Object} post? // @deprecated
     * @property {Object} get? // @deprecated
     */

    /**
     * TODO @see https://github.com/github/fetch/blob/master/fetch.js
     * @constructor
     * @extends Observable
     * @alias RCSDK.core.Request
     * @param {Context} [context]
     */
    function Request(context) {
        Headers.call(this);
        this.async = true;
        this.method = '';
        this.url = '';
        this.query = null;
        this.body = {};
        this.context = context;
        /** @type {XMLHttpRequest} */
        this.xhr = null;
        /** @type {AjaxObserver} */
        this.observer = __webpack_require__(9).$get(context);
    }

    Request.prototype = Object.create(Headers.prototype);
    Object.defineProperty(Request.prototype, 'constructor', {value: Request, enumerable: false});

    /**
     * @returns {boolean}
     */
    Request.prototype.isLoaded = function() {
        return !!this.xhr;
    };

    /**
     * @param {IAjaxOptions} [options]
     * @returns {Request}
     */
    Request.prototype.setOptions = function(options) {

        options = options || {};

        // backwards compatibility
        if (!('body' in options) && options.post) options.body = options.post;
        if (!('query' in options) && options.get) options.query = options.get;

        if ('method' in options) this.method = options.method;
        if ('url' in options) this.url = options.url;
        if ('query' in options) this.query = options.query;
        if ('body' in options) this.body = options.body;
        if ('headers' in options) this.setHeaders(options.headers);
        if ('async' in options) this.async = !!options.async;

        return this;

    };

    /**
     * Checks the send options, defaulting various of the options,
     * and consuming / transforming some of the options (like get).
     * @returns {Request}
     */
    Request.prototype.checkOptions = function() {

        if (!this.url) throw new Error('Url is not defined');

        if (!this.hasHeader('Accept')) this.setHeader('Accept', Headers.jsonContentType);
        if (!this.hasHeader('Content-Type')) this.setHeader('Content-Type', Headers.jsonContentType);

        this.method = this.method ? this.method.toUpperCase() : 'GET';

        if (['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS', 'HEAD'].indexOf(this.method) < 0) throw new Error('Method has wrong value');

        return this;

    };

    Request.prototype.getEncodedBody = function() {

        if (this.method === 'GET') return null;

        if (typeof this.body === 'string') {
            return this.body;
        } else if (this.isJson()) {
            return JSON.stringify(this.body);
        } else if (this.isUrlEncoded()) {
            return Utils.queryStringify(this.body);
        } else {
            return this.body;
        }

    };

    /**
     * @returns {Promise}
     */
    Request.prototype.send = function() {

        this.observer.emit(this.observer.events.beforeRequest, this);

        var responsePromise = new (this.context.getPromise())(function(resolve, reject) {

            this.checkOptions();

            var xhr = this.getXHR(),
                url = this.url + (!!this.query ? ((this.url.indexOf('?') > -1 ? '&' : '?') + Utils.queryStringify(this.query)) : '');

            xhr.open(this.method, url, this.async);

            //@see http://stackoverflow.com/questions/19666809/cors-withcredentials-support-limited
            xhr.withCredentials = true;

            xhr.onload = function() {

                //TODO http://jira.ringcentral.com/browse/PLA-10585
                var response = Response
                    .$get(this.context, xhr.status, xhr.statusText, xhr.responseText, xhr.getAllResponseHeaders());

                if (response.error) {
                    var e = response.error;
                    e.ajax = response; // backwards compatibility
                    e.response = response; //FIXME Circular
                    e.request = this;
                    reject(e);
                } else {
                    resolve(response);
                }

            }.bind(this);

            xhr.onerror = function(event) { // CORS or network issue
                var e = new Error('The request cannot be sent');
                e.request = this;
                e.response = null;
                e.ajax = null; // backwards compatibility
                reject(e);
            }.bind(this);

            Utils.forEach(this.headers, function(value, header) {
                if (!!value) xhr.setRequestHeader(header, value);
            });

            xhr.send(this.getEncodedBody());

            this.xhr = xhr;

        }.bind(this));

        return responsePromise
            .then(function(response) {

                this.observer.emit(this.observer.events.requestSuccess, response, this);

                return response;

            }.bind(this))
            .catch(function(e) {

                this.observer.emit(this.observer.events.requestError, e);

                throw e;

            }.bind(this));

    };

    /**
     * @returns {XMLHttpRequest}
     */
    Request.prototype.getXHR = function() {
        return this.context.getXHR();
    };

    Request.prototype.destroy = function() {
        if (this.xhr) this.xhr.abort();
    };

    module.exports = {
        Class: Request,
        /**
         * @static
         * @param {Context} context
         * @returns {Request}
         */
        $get: function(context) {
            return new Request(context);

        }
    };

}.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_RESULT__ = function(require, exports, module) {

    'use strict';

    var Headers = __webpack_require__(44).Class,
        Utils = __webpack_require__(19),
        Log = __webpack_require__(18),
        boundarySeparator = '--',
        headerSeparator = ':',
        bodySeparator = '\n\n';

    /**
     * @typedef {Object} IResponseOptions
     * @property {string} url
     * @property {string} method?
     * @property {boolean} async?
     * @property {Object} post?
     * @property {Object} get?
     * @property {Object} headers?
     */

    /**
     * @constructor
     * @extends Observable
     * @alias RCSDK.core.Response
     * @param {Context} [context]
     * @param {number} [status]
     * @param {string} [statusText]
     * @param {string} [body]
     * @param {object|string} [headers]
     */
    function Response(context, status, statusText, body, headers) {

        Headers.call(this);

        if (typeof(body) === 'string') {

            body = body.replace(/\r/g, '');

            if (!headers) {

                var tmp = body.split(bodySeparator);

                headers = (tmp.length > 1) ? tmp.shift() : {};
                body = tmp.join(bodySeparator);

            }

        }

        /** @type {Response[]|object} */
        this.data = null;

        /** @type {object} */
        this.json = null;

        /** @type {Response[]} */
        this.responses = [];

        /** @type {Error} */
        this.error = null;

        if (status == 1223) status = 204; //@see http://stackoverflow.com/questions/10046972/msie-returns-status-code-of-1223-for-ajax-request

        this.status = status;
        this.statusText = statusText;
        this.body = body;

        this.context = context;

        try {

            // Step 1. Parse headers

            if (typeof(headers) === 'string') {

                (headers || '')
                    .split('\n')
                    .forEach(/** @param {string} header */ function(header) {

                        if (!header) return;

                        /** @type {string[]} */
                        var parts = header.split(headerSeparator),
                            name = parts.shift().trim();

                        this.setHeader(name, parts.join(headerSeparator).trim());

                    }, this);

            } else {

                this.setHeaders(headers);

            }

            // Step 1.1. JEDI proxy sometimes may omit Content-Type header

            if (!this.hasHeader(Headers.contentType)) this.setHeader(Headers.contentType, Headers.jsonContentType);

            // Step 2. Parse body

            if (this.isJson() && !!this.body && typeof(this.body) === 'string') { // Handle 204 No Content -- response may be empty

                this.json = JSON.parse(this.body);
                this.data = this.json; // backwards compatibility

                if (!this.checkStatus()) this.error = new Error(this.getError());

            } else if (this.isMultipart()) { // Handle 207 Multi-Status

                // Step 2.1. Split multipart response

                var boundary = this.getContentType().match(/boundary=([^;]+)/i)[1],
                    parts = this.body.split(boundarySeparator + boundary);

                if (parts[0].trim() === '') parts.shift();
                if (parts[parts.length - 1].trim() == boundarySeparator) parts.pop();

                // Step 2.2. Parse status info

                var statusInfo = new Response(this.context, this.status, '', parts.shift());

                // Step 2.3. Parse all other parts

                this.responses = parts.map(function(part, i) {

                    var status = statusInfo.data.response[i].status;

                    return new Response(this.context, status, '', part);

                }, this);

                this.data = this.responses; // backwards compatibility

            } else { //TODO Add more parsers

                this.data = this.body;

            }

        } catch (e) { // Capture parse errors

            Log.error('Response.parseResponse(): Unable to parse data');
            Log.error(e.stack || e);
            Log.error(this.body);

            this.error = e;

        }

    }

    Response.prototype = Object.create(Headers.prototype);
    Object.defineProperty(Response.prototype, 'constructor', {value: Response, enumerable: false});

    /**
     * @returns {boolean}
     */
    Response.prototype.isUnauthorized = function() {
        return (this.status == 401);
    };

    Response.prototype.checkStatus = function() {
        return this.status >= 200 && this.status < 300;
    };

    Response.prototype.getError = function() {
        return this.data.message ||
               this.data.error_description ||
               this.data.description ||
               'Unknown error';
    };

    module.exports = {
        Class: Response,
        /**
         * @static
         * @param {Context} [context]
         * @param {number} [status]
         * @param {string} [statusText]
         * @param {string} [body]
         * @param {object|string} [headers]
         * @returns {Response}
         */
        $get: function(context, status, statusText, body, headers) {
            return new Response(context, status, statusText, body, headers);

        }
    };

}.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_RESULT__ = function(require, exports, module) {

    'use strict';

    var Observable = __webpack_require__(16).Class;

    /**
     * @constructor
     * @extends Observable
     * @alias RCSDK.core.AjaxObserver
     */
    function AjaxObserver() {

        Observable.call(this);

    }

    AjaxObserver.prototype = Object.create(Observable.prototype);

    AjaxObserver.prototype.events = {
        beforeRequest: 'beforeRequest', // parameters: ajax
        requestSuccess: 'requestSuccess', // means that response was successfully fetched from server
        requestError: 'requestError' // means that request failed completely
    };

    module.exports = {
        Class: AjaxObserver,
        /**
         * @param {Context} context
         * @returns {AjaxObserver}
         */
        $get: function(context) {

            return context.createSingleton('AjaxObserver', function() {
                return new AjaxObserver();
            });

        }
    };

}.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_RESULT__ = function(require, exports, module) {

    'use strict';

    /**
     * Ajax Response Manager
     * @constructor
     * @alias RCSDK.core.XhrResponse
     */
    function XhrResponse() {
        /** @type {IXhrResponse[]} */
        this.responses = [];
    }

    /**
     * @param {IXhrResponse} response
     */
    XhrResponse.prototype.add = function(response) {
        this.responses.push(response);
    };

    XhrResponse.prototype.clear = function() {
        this.responses = [];
    };

    /**
     * @param {XhrMock} ajax
     * @returns {IXhrResponse}
     */
    XhrResponse.prototype.find = function(ajax) {

        var currentResponse = null;

        this.responses.forEach(function(response) {

            if (ajax.url.indexOf(response.path) > -1 && (!response.test || response.test(ajax))) {
                currentResponse = response;
            }

        });

        return currentResponse;

    };

    module.exports = {
        Class: XhrResponse,
        /**
         * @static
         * @param {Context} context
         * @returns {XhrResponse}
         */
        $get: function(context) {

            return context.createSingleton('XhrResponse', function() {
                return new XhrResponse(context);
            });

        }
    };

    /**
     * @typedef {Object} IXhrResponse
     * @property {string} path
     * @property {function(Ajax)} response Response mock function
     * @property {function(Ajax)} test? This will be executed to determine, whether this mock is applicable
     */

}.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_RESULT__ = function(require, exports, module) {

    'use strict';

    var Utils = __webpack_require__(19),
        Observable = __webpack_require__(16).Class,
        Log = __webpack_require__(18),
        forcedTokenType = 'forced';

    /**
     * @typedef {Object} PlatformAuthInfo
     * @property {string} token_type
     * @property {string} access_token
     * @property {string} expires_in
     * @property {int} expireTime
     * @property {string} refresh_token
     * @property {string} refresh_token_expires_in
     * @property {int} refreshExpireTime
     * @property {string} scope
     */

    /**
     * @constructor
     * @extends Observable
     * @alias RCSDK.core.Platform
     * @param {Context} context
     */
    function Platform(context) {
        Observable.call(this);
        this.server = '';
        this.apiKey = '';
        this.account = '~';
        this.urlPrefix = '/restapi';
        this.apiVersion = 'v1.0';
        this.accountPrefix = '/account/';
        this.accessTokenTtl = null; // Platform server by default sets it to 60 * 60 = 1 hour
        this.refreshTokenTtl = 10 * 60 * 60; // 10 hours
        this.refreshTokenTtlRemember = 7 * 24 * 60 * 60; // 1 week
        this.refreshHandicapMs = 60 * 1000; // 1 minute
        this.refreshDelayMs = 100;
        this.clearCacheOnRefreshError = true;
        /** @type {Promise} */
        this.refreshPromise = null;
        this.context = context;
    }

    Platform.prototype = Object.create(Observable.prototype);
    Object.defineProperty(Platform.prototype, 'constructor', {value: Platform, enumerable: false});

    Platform.prototype.cacheId = 'platform';

    Platform.prototype.pollInterval = 250;

    Platform.prototype.releaseTimeout = 5000; // If queue was not released then force it to do so after some timeout

    Platform.prototype.events = {
        accessViolation: 'accessViolation',
        logoutSuccess: 'logoutSuccess',
        logoutError: 'logoutError',
        authorizeSuccess: 'authorizeSuccess',
        authorizeError: 'authorizeError',
        refreshSuccess: 'refreshSuccess',
        refreshError: 'refreshError'
    };

    /**
     * @returns {Cache}
     */
    Platform.prototype.getStorage = function() {

        return __webpack_require__(12).$get(this.context);

    };

    /**
     * @returns {Request}
     */
    Platform.prototype.getRequest = function() {

        return __webpack_require__(7).$get(this.context);

    };

    /**
     * @returns {Platform}
     */
    Platform.prototype.clearStorage = function() {

        this.getStorage().clean();

        return this;

    };

    /**
     * @returns {Platform}
     */
    Platform.prototype.setCredentials = function(appKey, appSecret) {

        var apiKey = (appKey || '') + ':' + (appSecret || '');

        if (apiKey == ':') return this;

        this.apiKey = (typeof btoa == 'function') ? btoa(apiKey) : new Buffer(apiKey).toString('base64');

        return this;

    };

    /**
     * @returns {Platform}
     */
    Platform.prototype.setServer = function(server) {

        this.server = server || '';

        return this;

    };

    /**
     * @param {boolean} [remember]
     * @returns {Platform|boolean}
     */
    Platform.prototype.remember = function(remember) {

        var key = this.cacheId + '-remember';

        if (remember !== undefined) {

            this.getStorage().setItem(key, remember);
            return this;

        }

        return this.getStorage().getItem(key) || false;

    };

    /**
     * @param {string} options.username
     * @param {string} options.password
     * @param {string} [options.extension]
     * @param {boolean} [options.remember]
     * @returns {Promise}
     */
    Platform.prototype.authorize = function(options) {

        options = options || {};

        options.remember = options.remember || false;

        return this
            .authCall({
                url: '/restapi/oauth/token',
                post: {
                    "grant_type": "password",
                    "username": options.username,
                    "extension": options.extension || '',
                    "password": options.password,
                    "access_token_ttl": this.accessTokenTtl,
                    "refresh_token_ttl": options.remember ? this.refreshTokenTtlRemember : this.refreshTokenTtl
                }
            })
            .then(function(response) {

                this.setCache(response.data)
                    .remember(options.remember)
                    .emitAndCallback(this.events.authorizeSuccess, []);

                return response;

            }.bind(this))
            .catch(function(e) {

                this.clearStorage()
                    .emitAndCallback(this.events.authorizeError, [e]);

                throw e;

            }.bind(this));

    };

    Platform.prototype.isPaused = function() {
        var storage = this.getStorage(),
            cacheId = this.cacheId + '-refresh';
        return !!storage.getItem(cacheId) && Date.now() - parseInt(storage.getItem(cacheId)) < this.releaseTimeout;
    };

    Platform.prototype.pause = function() {
        this.getStorage().setItem(this.cacheId + '-refresh', Date.now());
        return this;
    };

    /**
     * If the queue is unpaused internally, polling will be cancelled
     * @returns {Platform}
     */
    Platform.prototype.resume = function() {
        this.getStorage().removeItem(this.cacheId + '-refresh');
        return this;
    };

    /**
     * Gets resolved into Ajax or null if refresh resolved from elsewhere
     * @returns {Promise}
     */
    Platform.prototype.refresh = function() {

        var refresh = new (this.context.getPromise())(function(resolve, reject) {

            if (this.isPaused()) {
                return resolve(this.refreshPolling(null));
            } else {
                this.pause();
            }

            // Make sure all existing AJAX calls had a chance to reach the server
            setTimeout(function() {

                var authData = this.getAuthData();

                Log.debug('Platform.refresh(): Performing token refresh (access token', authData.access_token, ', refresh token', authData.refresh_token, ')');

                if (!authData || !authData.refresh_token) return reject(new Error('Refresh token is missing'));
                if (Date.now() > authData.refreshExpireTime) return reject(new Error('Refresh token has expired'));
                if (!this.isPaused()) return reject(new Error('Queue was resumed before refresh call'));

                resolve(this.authCall({
                    url: '/restapi/oauth/token',
                    post: {
                        "grant_type": "refresh_token",
                        "refresh_token": authData.refresh_token,
                        "access_token_ttl": this.accessTokenTtl,
                        "refresh_token_ttl": this.remember() ? this.refreshTokenTtlRemember : this.refreshTokenTtl
                    }
                }));

            }.bind(this), this.refreshDelayMs);

        }.bind(this));

        return refresh
            .then(function(response) {

                // This means refresh has happened elsewhere and we are here because of timeout
                if (!response || !response.data) return response;

                Log.info('Platform.refresh(): Token was refreshed');

                if (!response.data.refresh_token || !response.data.access_token) {
                    var e = new Error('Malformed OAuth response');
                    e.ajax = response;
                    throw e;
                }

                this.setCache(response.data)
                    .resume();

                return response;

            }.bind(this))
            .then(function(result) {

                this.emit(this.events.refreshSuccess, result);
                return result;

            }.bind(this))
            .catch(function(e) {

                if (this.clearCacheOnRefreshError) this.clearStorage();

                this.emitAndCallback(this.events.accessViolation, [e])
                    .emitAndCallback(this.events.refreshError, [e]);

                throw e;

            }.bind(this));

    };

    /**
     * @returns {Promise}
     */
    Platform.prototype.logout = function() {

        this.pause();

        return this
            .authCall({
                url: '/restapi/oauth/revoke',
                post: {
                    token: this.getToken()
                }
            })
            .then(function(response) {

                this.resume()
                    .clearStorage()
                    .emit(this.events.logoutSuccess, response);

                return response;

            }.bind(this))
            .catch(function(e) {

                this.resume()
                    .emitAndCallback(this.events.accessViolation, [e])
                    .emitAndCallback(this.events.logoutError, [e]);

                throw e;

            }.bind(this));

    };

    Platform.prototype.refreshPolling = function(result) {

        if (this.refreshPromise) return this.refreshPromise;

        this.refreshPromise = new (this.context.getPromise())(function(resolve, reject) {

            Log.warn('Platform.refresh(): Refresh is already in progress polling started');

            Utils.poll(function(next) {

                if (this.isPaused()) return next();

                this.refreshPromise = null;
                this.resume();

                if (this.isTokenValid()) {
                    resolve(result);
                } else {
                    reject(new Error('Automatic authentification timeout'));
                }

            }.bind(this), this.pollInterval);

        }.bind(this));

        return this.refreshPromise;

    };

    Platform.prototype.getToken = function() {

        return this.getAuthData().access_token;

    };

    Platform.prototype.getTokenType = function() {

        return this.getAuthData().token_type;

    };

    /**
     * @returns {PlatformAuthInfo}
     */
    Platform.prototype.getAuthData = function() {

        return this.getStorage().getItem(this.cacheId) || {
                token_type: '',
                access_token: '',
                expires_in: 0,
                refresh_token: '',
                refresh_token_expires_in: 0
            };

    };

    /**
     * Check if there is a valid (not expired) access token
     * @returns {boolean}
     */
    Platform.prototype.isTokenValid = function() {

        var authData = this.getAuthData();
        return (authData.token_type == forcedTokenType || (new Date(authData.expireTime).getTime() - this.refreshHandicapMs) > Date.now() && !this.isPaused());

    };

    /**
     * Checks if user is authorized
     * If there is no access token, refresh will be performed
     * @returns {Promise}
     */
    Platform.prototype.isAuthorized = function() {

        if (this.isTokenValid()) return this.context.getPromise().resolve(true);
        return this.refresh();

    };

    /**
     * @returns {Platform}
     */
    Platform.prototype.cancelAccessToken = function() {

        return this.setCache(Utils.extend(this.getAuthData(), {
            access_token: '',
            expires_in: 0
        }));

    };

    /**
     * @param {object} authData
     * @returns {Platform}
     */
    Platform.prototype.setCache = function(authData) {

        var oldAuthData = this.getAuthData();

        Log.info('Platform.setCache(): Tokens were updated, new:', authData, ', old:', oldAuthData);

        authData.expireTime = Date.now() + (authData.expires_in * 1000);
        authData.refreshExpireTime = Date.now() + (authData.refresh_token_expires_in * 1000);

        this.getStorage().setItem(this.cacheId, authData);

        return this;

    };

    /**
     * @returns {Platform}
     */
    Platform.prototype.forceAuthentication = function() {

        this.setCache({
            token_type: forcedTokenType,
            access_token: '',
            expires_in: 0,
            refresh_token: '',
            refresh_token_expires_in: 0
        });

        return this;

    };

    /**
     * @param {IAjaxOptions} options
     * @returns {Promise}
     */
    Platform.prototype.apiCall = function(options) {

        options = options || {};
        options.url = this.apiUrl(options.url, {addServer: true});

        return this
            .isAuthorized() // Refresh will occur inside
            .then(function() {

                var token = this.getToken();

                return this.getRequest()
                    .setOptions(options)
                    .setHeader('Authorization', this.getTokenType() + (token ? ' ' + token : ''))
                    .send();

            }.bind(this))
            .catch(function(e) {

                if (!e.ajax || !e.ajax.isUnauthorized()) throw e;

                this.cancelAccessToken();

                return this
                    .refresh()
                    .then(function() {

                        // Re-send with same options
                        return this.apiCall(options);

                    }.bind(this));

            }.bind(this));

    };

    /**
     * @param {string} url
     * @param {IAjaxOptions} [options]
     * @returns {Promise}
     */
    Platform.prototype.get = function(url, options) {
        options = options || {};
        options.url = url;
        options.method = 'GET';
        return this.apiCall(options);
    };

    /**
     * @param {string} url
     * @param {IAjaxOptions} options
     * @returns {Promise}
     */
    Platform.prototype.post = function(url, options) {
        options = options || {};
        options.url = url;
        options.method = 'POST';
        return this.apiCall(options);
    };

    /**
     * @param {string} url
     * @param {IAjaxOptions} options
     * @returns {Promise}
     */
    Platform.prototype.put = function(url, options) {
        options = options || {};
        options.url = url;
        options.method = 'PUT';
        return this.apiCall(options);
    };

    /**
     * @param {string} url
     * @param {IAjaxOptions} [options]
     * @returns {Promise}
     */
    Platform.prototype['delete'] = function(url, options) {
        options = options || {};
        options.url = url;
        options.method = 'DELETE';
        return this.apiCall(options);
    };

    /**
     * @param {IAjaxOptions} options
     * @returns {Promise}
     */
    Platform.prototype.authCall = function(options) {

        options = options || {};
        options.method = options.method || 'POST';
        options.url = this.apiUrl(options.url, {addServer: true});

        return this.getRequest()
            .setOptions(options)
            .setHeader('Content-Type', 'application/x-www-form-urlencoded')
            .setHeader('Accept', 'application/json')
            .setHeader('Authorization', 'Basic ' + this.apiKey)
            .send();

    };

    /**
     *
     * @param url
     * @param {{addMethod?: string, addToken?: boolean, addServer?: boolean}} [options]
     * @returns {string}
     */
    Platform.prototype.apiUrl = function(url, options) {

        url = url || '';
        options = options || {};

        var builtUrl = '';

        if (options.addServer && url.indexOf('http://') == -1 && url.indexOf('https://') == -1) builtUrl += this.server;

        if (url.indexOf(this.urlPrefix) == -1) builtUrl += this.urlPrefix + '/' + this.apiVersion;

        if (url.indexOf(this.accountPrefix) > -1) builtUrl.replace(this.accountPrefix + '~', this.accountPrefix + this.account);

        builtUrl += url;

        if (options.addMethod || options.addToken) builtUrl += (url.indexOf('?') > -1 ? '&' : '?');

        if (options.addMethod) builtUrl += '_method=' + options.addMethod;
        if (options.addToken) builtUrl += (options.addMethod ? '&' : '') + 'access_token=' + this.getToken();

        return builtUrl;

    };

    module.exports = {
        Class: Platform,
        /**
         * @param {Context} context
         * @returns {Platform}
         */
        $get: function(context) {

            return context.createSingleton('Platform', function() {
                return new Platform(context);
            });

        }
    };

}.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ },
/* 12 */
/***/ function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_RESULT__ = function(require, exports, module) {

    'use strict';

    var Observable = __webpack_require__(16).Class,
        Utils = __webpack_require__(19);

    /**
     * @constructor
     * @extends Observable
     * @alias RCSDK.core.Cache
     * @param {Context} context
     */
    function Cache(context) {
        Observable.call(this);
        this.setPrefix();
        this.storage = context.getLocalStorage(); // storage must be defined from outside
    }

    Cache.prototype = Object.create(Observable.prototype);
    Object.defineProperty(Cache.prototype, 'constructor', {value: Cache, enumerable: false});

    Cache.prototype.setPrefix = function(prefix) {
        this.prefix = prefix || 'rc-';
        return this;
    };

    Cache.prototype.prefixKey = function(key) {
        return this.prefix + key;
    };

    Cache.prototype.setItem = function(key, data) {
        this.storage.setItem(this.prefixKey(key), JSON.stringify(data));
        return this;
    };

    Cache.prototype.removeItem = function(key) {
        this.storage.removeItem(this.prefixKey(key));
        return this;
    };

    Cache.prototype.getItem = function(key) {
        var item = this.storage.getItem(this.prefixKey(key));
        if (!item) return null;
        return JSON.parse(item);
    };

    Cache.prototype.clean = function() {

        for (var key in this.storage) {
            if (!this.storage.hasOwnProperty(key)) continue;
            if (key.indexOf(this.prefix) === 0) {
                this.storage.removeItem(key);
                delete this.storage[key];
            }
        }

        return this;

    };

    module.exports = {
        Class: Cache,
        /**
         * @param {Context} context
         * @returns {Cache}
         */
        $get: function(context) {

            return context.createSingleton('Cache', function() {
                return new Cache(context);
            });

        }
    };

}.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ },
/* 13 */
/***/ function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_RESULT__ = function(require, exports, module) {

    'use strict';

    var Observable = __webpack_require__(16).Class,
        Log = __webpack_require__(18),
        Utils = __webpack_require__(19),
        renewHandicapMs = 60 * 1000;

    /**
     * @constructor
     * @extends Observable
     * @alias RCSDK.core.Subscription
     * @param {Context} context
     */
    function Subscription(context) {
        Observable.call(this);
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
        /** @type {PUBNUB} */
        this.pubnub = null;
        this.context = context;
    }

    Subscription.prototype = Object.create(Observable.prototype);
    Object.defineProperty(Subscription.prototype, 'constructor', {value: Subscription, enumerable: false});

    Subscription.prototype.events = {
        notification: 'notification',
        removeSuccess: 'removeSuccess',
        removeError: 'removeError',
        renewSuccess: 'renewSuccess',
        renewError: 'renewError',
        subscribeSuccess: 'subscribeSuccess',
        subscribeError: 'subscribeError'
    };

    /**
     * @returns {PUBNUB}
     */
    Subscription.prototype.getPubnub = function() {

        return this.context.getPubnub();

    };

    Subscription.prototype.getCrypto = function() {

        return this.context.getCryptoJS();

    };

    Subscription.prototype.getPlatform = function() {

        return __webpack_require__(11).$get(this.context);

    };

    /**
     * Creates or updates subscription if there is an active one
     * @param {{events?:string[]}} [options] New array of events
     * @returns {Promise}
     */
    Subscription.prototype.register = function(options) {

        if (this.isSubscribed()) {
            return this.renew(options);
        } else {
            return this.subscribe(options);
        }

    };

    Subscription.prototype.addEvents = function(events) {
        this.eventFilters = this.eventFilters.concat(events);
        return this;
    };

    Subscription.prototype.setEvents = function(events) {
        this.eventFilters = events;
        return this;
    };

    Subscription.prototype.getFullEventFilters = function() {

        return this.eventFilters.map(function(event) {
            return this.getPlatform().apiUrl(event);
        }.bind(this));

    };

    /**
     * @private
     * @param {Array} [options.events] New array of events
     * @returns {Promise}
     */
    Subscription.prototype.subscribe = function(options) {

        options = options || {};
        if (options.events) this.eventFilters = options.events;

        this.clearTimeout();

        return new (this.context.getPromise())(
            function(resolve, reject) {

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

            }.bind(this))
            .then(function(ajax) {

                this.updateSubscription(ajax.data)
                    .subscribeAtPubnub()
                    .emit(this.events.subscribeSuccess, ajax.data);

                return ajax;

            }.bind(this))
            .catch(function(e) {

                this.unsubscribe()
                    .emit(this.events.subscribeError, e);

                throw e;

            }.bind(this));

    };

    /**
     * @private
     * @param {Array} [options.events] New array of events
     * @returns {Promise}
     */
    Subscription.prototype.renew = function(options) {

        options = options || {};
        if (options.events) this.eventFilters = options.events;

        this.clearTimeout();

        return new (this.context.getPromise())(
            function(resolve, reject) {

                if (!this.subscription || !this.subscription.id) throw new Error('Subscription ID is required');
                if (!this.eventFilters || !this.eventFilters.length) throw new Error('Events are undefined');

                resolve();

            }.bind(this))
            .then(function() {

                return this.getPlatform().apiCall({
                    method: 'PUT',
                    url: '/restapi/v1.0/subscription/' + this.subscription.id,
                    post: {
                        eventFilters: this.getFullEventFilters()
                    }
                });

            }.bind(this))
            .then(function(ajax) {

                this.updateSubscription(ajax.data)
                    .emit(this.events.renewSuccess, ajax.data);

                return ajax;

            }.bind(this))
            .catch(function(e) {

                this.unsubscribe()
                    .emit(this.events.renewError, e);

                throw e;

            }.bind(this));

    };

    /**
     * @param {boolean} [options.async]
     * @returns {Promise}
     */
    Subscription.prototype.remove = function(options) {

        options = Utils.extend({
            async: true
        }, options);

        return new (this.context.getPromise())(
            function(resolve, reject) {

                if (!this.subscription || !this.subscription.id) throw new Error('Subscription ID is required');

                resolve(this.getPlatform().apiCall({
                    async: !!options.async, // Warning! This is necessary because this method is used in beforeunload hook and has to be synchronous
                    method: 'DELETE',
                    url: '/restapi/v1.0/subscription/' + this.subscription.id
                }));

            }.bind(this))
            .then(function(ajax) {

                this.unsubscribe()
                    .emit(this.events.removeSuccess, ajax);

                return ajax;

            }.bind(this))
            .catch(function(e) {

                this.emit(this.events.removeError, e);

                throw e;

            }.bind(this));

    };

    Subscription.prototype.destroy = function() {

        this.unsubscribe();

        Log.info('RC.core.Subscription: Destroyed');

        return Observable.prototype.destroy.call(this);

    };

    Subscription.prototype.isSubscribed = function() {

        return this.subscription &&
               this.subscription.deliveryMode &&
               this.subscription.deliveryMode.subscriberKey &&
               this.subscription.deliveryMode.address;

    };

    /**
     * @protected
     */
    Subscription.prototype.setTimeout = function() {

        var timeToExpiration = (this.subscription.expiresIn * 1000) - renewHandicapMs;

        this.timeout = setTimeout(function() {

            this.renew({});

        }.bind(this), timeToExpiration);

    };

    /**
     * @protected
     */
    Subscription.prototype.clearTimeout = function() {

        clearTimeout(this.timeout);

    };

    /**
     * Set new subscription info and re-create timeout
     * @protected
     * @param subscription
     * @returns {Subscription}
     */
    Subscription.prototype.updateSubscription = function(subscription) {

        this.clearTimeout();
        this.subscription = subscription;
        this.setTimeout();
        return this;

    };

    /**
     * Remove subscription and disconnect from PUBNUB
     * @protected
     * @returns {Subscription}
     */
    Subscription.prototype.unsubscribe = function() {
        this.clearTimeout();
        if (this.pubnub && this.isSubscribed()) this.pubnub.unsubscribe({channel: this.subscription.deliveryMode.address});
        this.subscription = null;
        return this;
    };

    /**
     * @abstract
     * @param {Object} message
     * @returns {Subscription}
     */
    Subscription.prototype.notify = function(message) {

        if (this.isSubscribed() && this.subscription.deliveryMode.encryptionKey) {

            var CryptoJS = this.getCrypto();

            var key = CryptoJS.enc.Base64.parse(this.subscription.deliveryMode.encryptionKey);
            var data = CryptoJS.enc.Base64.parse(message);
            var decrypted = CryptoJS.AES.decrypt({ciphertext: data}, key, {mode: CryptoJS.mode.ECB, padding: CryptoJS.pad.Pkcs7}).toString(CryptoJS.enc.Utf8);
            message = JSON.parse(decrypted);

        }

        this.emit(this.events.notification, message);

        return this;

    };

    /**
     * @returns {Subscription}
     */
    Subscription.prototype.subscribeAtPubnub = function() {

        if (!this.isSubscribed()) return this;

        var PUBNUB = this.getPubnub();

        this.pubnub = PUBNUB.init({
            ssl: true,
            subscribe_key: this.subscription.deliveryMode.subscriberKey
        });

        this.pubnub.ready();

        this.pubnub.subscribe({
            channel: this.subscription.deliveryMode.address,
            message: function(message, env, channel) {

                Log.info('RC.core.Subscription: Incoming message', message);
                this.notify(message);

            }.bind(this),
            connect: function() {
                Log.info('RC.core.Subscription: PUBNUB connected');
            }.bind(this)
        });

        return this;

    };

    module.exports = {
        Class: Subscription,
        /**
         * @param {Context} context
         * @returns {Subscription}
         */
        $get: function(context) {
            return new Subscription(context);
        }
    };

}.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ },
/* 14 */
/***/ function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_RESULT__;/**
 * istanbul ignore next
 */
!(__WEBPACK_AMD_DEFINE_RESULT__ = function(require, exports, module) {
    'use strict';

    var Observable = __webpack_require__(16).Class;

    /**
     * @constructor
     * @extends Observable
     * @alias RCSDK.core.PageVisibility
     */
    function PageVisibility() {

        Observable.call(this);

        var hidden = "hidden",
            onchange = function(evt) {

                evt = evt || window.event;

                var v = 'visible',
                    h = 'hidden',
                    evtMap = {
                        focus: v, focusin: v, pageshow: v, blur: h, focusout: h, pagehide: h
                    };

                this.visible = (evt.type in evtMap) ? evtMap[evt.type] == v : !document[hidden];

                this.emit(this.events.change, this.visible);

            }.bind(this);

        this.visible = true;

        if (typeof document == 'undefined' || typeof window == 'undefined') return;

        // Standards:

        if (hidden in document)
            document.addEventListener("visibilitychange", onchange);
        else if ((hidden = "mozHidden") in document)
            document.addEventListener("mozvisibilitychange", onchange);
        else if ((hidden = "webkitHidden") in document)
            document.addEventListener("webkitvisibilitychange", onchange);
        else if ((hidden = "msHidden") in document)
            document.addEventListener("msvisibilitychange", onchange);
        // IE 9 and lower:
        else if ('onfocusin' in document)
            document.onfocusin = document.onfocusout = onchange;
        // All others:
        else
            window.onpageshow = window.onpagehide = window.onfocus = window.onblur = onchange;

    }

    PageVisibility.prototype = Object.create(Observable.prototype);
    Object.defineProperty(PageVisibility.prototype, 'constructor', {value: PageVisibility, enumerable: false});

    PageVisibility.prototype.events = {
        change: 'change'
    };

    PageVisibility.prototype.isVisible = function() {
        return this.visible;
    };

    module.exports = {
        Class: PageVisibility,
        /**
         * @param {Context} context
         * @returns {PageVisibility}
         */
        $get: function(context) {
            return new PageVisibility();
        }
    };

}.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ },
/* 15 */
/***/ function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_RESULT__ = function(require, exports, module) {

    'use strict';

    var Utils = __webpack_require__(19);

    /**
     * @alias RCSDK.core.Helper
     * @constructor
     * @param {Context} context
     */
    function Helper(context) {
        this.context = context;
    }

    Helper.prototype.defaultProperty = 'id';

    /**
     * @returns {Context}
     */
    Helper.prototype.getContext = function() {
        return this.context;
    };

    /**
     * @param {object} [options]
     * @param {string} [id]
     */
    Helper.prototype.createUrl = function(options, id) {
        return '';
    };

    /**
     * @param {IHelperObject} object
     * @returns {string}
     */
    Helper.prototype.getId = function(object) {
        return object && object[this.defaultProperty];
    };

    /**
     *
     * @param {IHelperObject} object
     * @returns {boolean}
     */
    Helper.prototype.isNew = function(object) {
        return !this.getId(object) || !this.getUri(object);
    };

    /**
     *
     * @param {IHelperObject} object
     * @returns {IHelperObject}
     */
    Helper.prototype.resetAsNew = function(object) {
        if (object) {
            delete object.id;
            delete object.uri;
        }
        return object;
    };

    /**
     * @param {IHelperObject} object
     * @returns {string}
     */
    Helper.prototype.getUri = function(object) {
        return object && object.uri;
    };

    /**
     * @param {Response} ajax
     * @return {IHelperObject[]}
     */
    Helper.prototype.parseMultipartResponse = function(ajax) {

        if (ajax.isMultipart()) {

            // ajax.data has full array, leave only successful
            return ajax.data.filter(function(result) {
                return (!result.error);
            }).map(function(result) {
                return result.data;
            });

        } else { // Single ID

            return [ajax.data];

        }

    };

    /**
     * Options have higher priority, if object.url and options.url were provided, options.url will be returned
     * If no URL was provided, default will be returned
     * @param {IHelperObject} [object]
     * @param {IAjaxOptions} [options]
     * @return {IAjaxOptions}
     */
    Helper.prototype.loadRequest = function(object, options) {

        return Utils.extend(options || {}, {
            url: (options && options.url) || (object && this.getUri(object)) || this.createUrl(),
            method: (options && options.method) || 'GET'
        });

    };

    /**
     * Options have higher priority, if object.url and options.url were provided, options.url will be returned
     * If no URL was provided, default will be returned
     * @param {IHelperObject} object
     * @param {IAjaxOptions} [options]
     * @return {IAjaxOptions}
     */
    Helper.prototype.saveRequest = function(object, options) {

        if (!object && !(options && (options.post || options.body))) throw new Error('No Object');

        return Utils.extend(options || {}, {
            method: (options && options.method) || (this.isNew(object) ? 'POST' : 'PUT'),
            url: (options && options.url) || this.getUri(object) || this.createUrl(),
            body: (options && (options.body || options.post)) || object
        });

    };

    /**
     * Options have higher priority, if object.url and options.url were provided, options.url will be returned
     * If no URL was provided exception will be thrown
     * @param {IHelperObject} object
     * @param {IAjaxOptions} [options]
     * @return {IAjaxOptions}
     */
    Helper.prototype.deleteRequest = function(object, options) {

        options = options || {};

        if (!this.getUri(object) && !(options && options.url)) throw new Error('Object has to be not new or URL must be provided');

        return Utils.extend(options || {}, {
            method: (options && options.method) || 'DELETE',
            url: (options && options.url) || this.getUri(object)
        });

    };

    /**
     * If no url was provided, default SYNC url will be returned
     * @param {IAjaxOptions} [options]
     * @return {IAjaxOptions}
     */
    Helper.prototype.syncRequest = function(options) {

        options = options || {};

        options.url = options.url || this.createUrl({sync: true});
        options.query = options.query || options.get || {};

        if (!!options.query.syncToken) {
            options.query = {
                syncType: 'ISync',
                syncToken: options.get.syncToken
            };
        } else {
            options.query.syncType = 'FSync';
        }

        return options;

    };

    Helper.prototype.nextPageExists = function(data) {

        return (data && data.navigation && ('nextPage' in data.navigation));

    };

    /**
     * @param {IHelperObject[]} array - an array to be indexed
     * @param {function(object)} [getIdFn] - must return an ID for each array item
     * @param {boolean} [gather] - if true, then each index will have an array of items, that has same ID, otherwise the first indexed item wins
     * @returns {*}
     */
    Helper.prototype.index = function(array, getIdFn, gather) {

        getIdFn = getIdFn || this.getId.bind(this);
        array = array || [];

        return array.reduce(function(index, item) {

            var id = getIdFn(item);

            if (!id || (index[id] && !gather)) return index;

            if (gather) {
                if (!index[id]) index[id] = [];
                index[id].push(item);
            } else {
                index[id] = item;
            }

            return index;

        }, {});

    };

    /**
     * Returns a shallow copy of merged _target_ array plus _supplement_ array
     * @param {IHelperObject[]} target
     * @param {IHelperObject[]} supplement
     * @param {function(IHelperObject)} [getIdFn]
     * @param {boolean} [mergeItems] - if true, properties of _supplement_ item will be applied to _target_ item, otherwise _target_ item will be replaced
     * @returns {*}
     */
    Helper.prototype.merge = function(target, supplement, getIdFn, mergeItems) {

        getIdFn = getIdFn || this.getId.bind(this);
        target = target || [];
        supplement = supplement || [];

        var supplementIndex = this.index(supplement, getIdFn),
            updatedIDs = [];

        var result = target.map(function(item) {

            var id = getIdFn(item),
                newItem = supplementIndex[id];

            if (newItem) updatedIDs.push(id);

            return newItem ? (mergeItems ? Utils.extend(item, newItem) : newItem) : item;

        });

        supplement.forEach(function(item) {

            if (updatedIDs.indexOf(getIdFn(item)) == -1) result.push(item);

        });

        return result;

    };

    module.exports = {
        Class: Helper,
        /**
         * @param {Context} context
         * @returns {Helper}
         */
        $get: function(context) {
            return new Helper(context);
        }
    };

    /**
     * @typedef {object} IHelperObject
     * @property {string} id
     * @property {string} uri
     */

}.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ },
/* 16 */
/***/ function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_RESULT__ = function(require, exports, module) {

    var Utils = __webpack_require__(19),
        Log = __webpack_require__(18);

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

}.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ },
/* 17 */
/***/ function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_RESULT__ = function(require, exports, module) {

    'use strict';

    var Utils = __webpack_require__(19);

    /**
     * @typedef {object} IValidator
     * @property {string} field
     * @property {function} validator
     */

    /**
     * @typedef {object} IValidatorResult
     * @property {boolean} isValid
     * @property {Object.<number, Error[]>} errors
     */

    /**
     * @alias RCSDK.core.Validator
     * @name Validator
     */
    var Validator = module.exports = {
        /**
         * @param {IValidator[]} validators
         * @returns {IValidatorResult}
         */
        validate: function(validators) {

            /** @type {IValidatorResult} */
            var result = {
                errors: {},
                isValid: true
            };

            result.errors = validators.reduce(function(errors, validator) {

                var res = validator.validator();

                if (res.length > 0) {
                    result.isValid = false;
                    errors[validator.field] = errors[validator.field] || [];
                    errors[validator.field] = errors[validator.field].concat(res);
                }

                return errors;

            }, {});

            return result;

        },
        /**
         * It is not recommended to have any kinds of complex validators at front end
         * @deprecated
         * @param value
         * @param multiple
         * @returns {Function}
         */
        email: function(value, multiple) {
            return function() {
                if (!value) return [];
                return Utils.isEmail(value, multiple) ? [] : [new Error('Value has to be a valid email')];
            };
        },
        /**
         * It is not recommended to have any kinds of complex validators at front end
         * TODO International phone numbers
         * @deprecated
         * @param value
         * @returns {Function}
         */
        phone: function(value) {
            return function() {
                if (!value) return [];
                return Utils.isPhoneNumber(value) ? [] : [new Error('Value has to be a valid US phone number')];
            };
        },
        required: function(value) {
            return function() {
                return !value ? [new Error('Field is required')] : [];
            };
        },
        length: function(value, max, min) {
            return function() {

                var errors = [];

                if (!value) return errors;

                value = value.toString();

                if (min && value.length < min) errors.push(new Error('Minimum length of ' + min + ' characters is required'));
                if (max && value.length > max) errors.push(new Error('Maximum length of ' + max + ' characters is required'));

                return errors;

            };
        },
        $get: function(context) {
            return Validator;
        }
    };

}.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ },
/* 18 */
/***/ function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_RESULT__ = function(require, exports, module) {

    'use strict';

    var Utils = __webpack_require__(19);

    /**
     * @alias RCSDK.core.Log
     * @name Log
     */
    var Log = module.exports = {
        logDebug: false,
        logInfo: false,
        logWarnings: false,
        logErrors: false,
        addTimestamps: true,
        /** @type {Console} */
        console: console || { // safety
            log: function() {},
            warn: function() {},
            info: function() {},
            error: function() {}
        },
        disableAll: function() {
            this.logDebug = false;
            this.logInfo = false;
            this.logWarnings = false;
            this.logErrors = false;
        },
        enableAll: function() {
            this.logDebug = true;
            this.logInfo = true;
            this.logWarnings = true;
            this.logErrors = true;
        },
        parseArguments: function(args) {
            args = Utils.argumentsToArray(args);
            if (this.addTimestamps) args.unshift(new Date().toLocaleString(), '-');
            return args;
        },
        debug: function() {
            if (this.logDebug) this.console.log.apply(this.console, this.parseArguments(arguments));
        },
        info: function() {
            if (this.logInfo) this.console.info.apply(this.console, this.parseArguments(arguments));
        },
        warn: function() {
            if (this.logWarnings) this.console.warn.apply(this.console, this.parseArguments(arguments));
        },
        error: function() {
            if (this.logErrors) this.console.error.apply(this.console, this.parseArguments(arguments));
        },
        $get: function(context) {
            return Log;
        }
    };

}.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ },
/* 19 */
/***/ function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_RESULT__ = function(require, exports, module) {

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

}.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ },
/* 20 */
/***/ function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_RESULT__ = function(require, exports, module) {

    'use strict';

    var Utils = __webpack_require__(19);

    /**
     * @alias RCSDK.core.List
     * @name List
     */
    var List = module.exports = {

        /**
         * @param {string} property
         * @returns {function(object)}
         */
        propertyExtractor: function(property) {
            return function(item, options) {
                return property ? ((item && item[property]) || null) : item;
            };
        },

        /**
         * Non-string types are converted to string
         * Non-string types are extracted as an empty string if they could be converted to false
         * If no options.sortBy given the item itself is extracted
         * Compares strings:
         * - if (a is less than b) return -1;
         * - if (a is greater than b) return 1;
         * - else (a must be equal to b) return 0;
         * Exceptions in will be suppressed, if any - a is assumed to be less than b
         * @param {string} a
         * @param {string} b
         * @param {IListComparatorOptions} [options]
         * @returns {number}
         */
        stringComparator: function(a, b, options) {

            return Utils.parseString(a).localeCompare(Utils.parseString(b));

        },

        /**
         * Non-numeric types are extracted as 0 if they could be converted to false
         * Objects that could not be converted to number are extracted as 0
         * If no options.sortBy given the item itself is extracted
         * See parseFloat for more info
         * Compares numbers:
         * - if (a is less than b) return -1;
         * - if (a is greater than b) return 1;
         * - else (a must be equal to b) return 0;
         * Function does not check types
         * Exceptions in will be suppressed, if any - a is assumed to be less than b
         * @param {number} a
         * @param {number} b
         * @param {IListComparatorOptions} [options]
         * @returns {number}
         */
        numberComparator: function(a, b, options) {

            return (Utils.parseNumber(a) - Utils.parseNumber(b));

        },

        /**
         * Function extracts (using _extractFn_ option) values of a property (_sortBy_ option) and compares them using
         * compare function (_compareFn_ option, by default Helper.stringComparator)
         * Merged options are provided to _extractFn_ and _compareFn_
         * TODO Check memory leaks for all that options links
         * @param {IListComparatorOptions} [options]
         * @returns {function(object, object)}
         */
        comparator: function(options) {

            options = Utils.extend({
                extractFn: this.propertyExtractor((options && options.sortBy) || null),
                compareFn: this.stringComparator
            }, options);

            /**
             * @param {object} item1
             * @param {object} item2
             * @returns {number}
             */
            function comparator(item1, item2) {

                return options.compareFn(options.extractFn(item1, options), options.extractFn(item2, options), options);

            }

            return comparator;

        },

        /**
         * @param {string} obj
         * @param {IListFilterOptions} options
         * @returns {boolean}
         */
        equalsFilter: function(obj, options) {
            return (options.condition === obj);
        },

        /**
         * @param {string} obj
         * @param {IListFilterOptions} options
         * @returns {boolean}
         */
        containsFilter: function(obj, options) {
            return (obj && obj.toString().indexOf(options.condition) > -1);
        },

        /**
         * @param {string} obj
         * @param {IListFilterOptions} options - `condition` must be an instance of RegExp
         * @returns {boolean}
         */
        regexpFilter: function(obj, options) {
            if (!(options.condition instanceof RegExp)) throw new Error('Condition must be an instance of RegExp');
            return (options.condition.test(obj));
        },

        /**
         * Function extracts (using `extractFn` option) values of a property (`filterBy` option) and filters them using
         * compare function (`filterFn` option, by default Helper.equalsFilter)
         * Merged options are provided to `extractFn` and `compareFn`
         * Set `filterBy` to null to force `propertyExtractor` to return object itself
         * TODO Check memory leaks for all that options links
         * @param {IListFilterOptions[]} [filterConfigs]
         * @returns {function(object)}
         */
        filter: function(filterConfigs) {

            var self = this;

            filterConfigs = (filterConfigs || []).map(function(opt) {

                return Utils.extend({
                    condition: '',
                    extractFn: self.propertyExtractor((opt && opt.filterBy) || null),
                    filterFn: self.equalsFilter
                }, opt);

            });

            /**
             * @param {object} item
             * @returns {boolean}
             */
            function filter(item) {

                return filterConfigs.reduce(function(pass, opt) {

                    if (!pass || !opt.condition) return pass;
                    return opt.filterFn(opt.extractFn(item, opt), opt);

                }, true);

            }

            return filter;

        },

        $get: function(context) {
            return List;
        }

    };

    /**
     * @typedef {object} IListComparatorOptions
     * @property {string} sortBy
     * @property {function(object, IListComparatorOptions)} extractFn
     * @property {function(object, object)} compareFn
     */

    /**
     * @typedef {object} IListFilterOptions
     * @property {string} filterBy
     * @property {object} condition
     * @property {function(object, IListComparatorOptions)} extractFn
     * @property {function(object, object)} filterFn
     */

}.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ },
/* 21 */
/***/ function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_RESULT__ = function(require, exports, module) {

    'use strict';

    var Helper = __webpack_require__(15).Class;

    /**
     * @extends Helper
     * @constructor
     */
    function CountryHelper(context) {
        Helper.call(this, context);
    }

    CountryHelper.prototype = Object.create(Helper.prototype);

    CountryHelper.prototype.createUrl = function() {
        return '/dictionary/country';
    };

    module.exports = {
        Class: CountryHelper,
        /**
         * @param {Context} context
         * @returns {CountryHelper}
         */
        $get: function(context) {

            return context.createSingleton('CountryHelper', function() {
                return new CountryHelper(context);
            });

        }
    };

    /**
     * @typedef {object} ICountry
     * @property {string} id
     * @property {string} uri
     * @property {string} name
     * @property {string} isoCode
     * @property {string} callingCode
     */

}.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ },
/* 22 */
/***/ function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_RESULT__ = function(require, exports, module) {

    'use strict';

    var Helper = __webpack_require__(15).Class;

    /**
     * @extends Helper
     * @constructor
     */
    function DeviceModelHelper(context) {
        Helper.call(this, context);
    }

    DeviceModelHelper.prototype = Object.create(Helper.prototype);

    /**
     * @param {IDeviceModel} device
     * @returns {string}
     */
    DeviceModelHelper.prototype.getId = function(device) {

        if (!device) return null;

        return device.id + (
                device.addons && device.addons[0]
                    ? '-' + device.addons[0].id + '-' + device.addons[0].count
                    : ''
            );

    };

    /**
     * Remove extra textual information from device
     * @exceptionalCase Platform does not understand full device info
     * @param {IDeviceModel} device
     * @returns {IDeviceModel}
     */
    DeviceModelHelper.prototype.cleanForSaving = function(device) {

        if (!device) return null;

        delete device.name;
        delete device.deviceClass;

        if (device.addons && device.addons.length > 0) {

            device.addons.forEach(function(addon, i) {
                delete device.addons[i].name;
            });

        } else {

            delete device.addons;

        }

        return device;

    };

    /**
     * TODO Remove when http://jira.ringcentral.com/browse/SDK-1 is done
     * @type {IDeviceModel[]}
     */
    DeviceModelHelper.prototype.devices = [
        {
            id: '-1',
            name: 'Softphone'
        },
        {
            id: '0',
            name: 'Existing device'
        },
        {
            id: '19',
            name: 'Cisco SPA-525G2 Desk Phone',
            deviceClass: 'Desk Phone'
        },
        {
            id: '23',
            name: 'Polycom IP 321 Basic IP phone',
            deviceClass: 'Desk Phone'
        },
        {
            id: '30',
            name: 'Polycom IP 550 HD Manager IP phone',
            deviceClass: 'Desk Phone'
        },
        {
            id: '37',
            name: 'Polycom IP 6000 Conference Phone',
            deviceClass: 'Conference Phone'
        },
        {
            id: '40',
            name: 'Polycom IP 335 HD IP phone',
            deviceClass: 'Desk Phone'
        },
        {
            id: '51',
            name: 'Cisco SPA-303 Desk Phone',
            deviceClass: 'Desk Phone'
        },
        {
            id: '16',
            name: 'Cisco SPA-508G Desk Phone with 1 Expansion Module',
            deviceClass: 'Desk Phone',
            addons: [
                {
                    id: '2',
                    name: 'Cisco Sidecar',
                    count: '1'
                }
            ]
        },
        {
            id: '16',
            name: 'Cisco SPA-508G Desk Phone with 2 Expansion Modules',
            deviceClass: 'Desk Phone',
            addons: [
                {
                    id: '2',
                    name: 'Cisco Sidecar',
                    count: '2'
                }
            ]
        },
        {
            id: '16',
            name: 'Cisco SPA-508G Desk Phone',
            deviceClass: 'Desk Phone'
        },
        {
            id: '19',
            name: 'Cisco SPA-525G2 Desk Phone with 1 Expansion Module',
            deviceClass: 'Desk Phone',
            addons: [
                {
                    id: '2',
                    name: 'Cisco Sidecar',
                    count: '1'
                }
            ]
        },
        {
            id: '19',
            name: 'Cisco SPA-525G2 Desk Phone with 2 Expansion Modules	Desk Phone',
            addons: [
                {
                    id: '2',
                    name: 'Cisco Sidecar',
                    count: '2'
                }
            ]
        },
        {
            id: '34',
            name: 'Polycom IP 650 HD Executive IP phone with 1 Expansion Module',
            deviceClass: 'Desk Phone',
            addons: [
                {
                    id: '1',
                    name: 'Plolycom Expansion',
                    count: '1'
                }
            ]
        },
        {
            id: '34',
            name: 'Polycom IP 650 HD Executive IP phone with 2 Expansion Modules',
            deviceClass: 'Desk Phone',
            addons: [
                {
                    id: '1',
                    name: 'Plolycom Expansion',
                    count: '2'
                }
            ]
        },
        {
            id: '34',
            name: 'Polycom IP 650 HD Executive IP phone with 3 Expansion Modules',
            deviceClass: 'Desk Phone',
            addons: [
                {
                    id: '1',
                    name: 'Plolycom Expansion',
                    count: '3'
                }
            ]
        },
        {
            id: '34',
            name: 'Polycom IP 650 HD Executive IP phone',
            deviceClass: 'Desk Phone'
        },
        {
            id: '52',
            name: 'Cisco SPA-122 ATA',
            deviceClass: 'Analog Adapter'
        },
        {
            id: '53',
            name: 'Polycom VVX-500 Color Touchscreen',
            deviceClass: 'Desk Phone'
        },
        {
            id: '54',
            name: 'Polycom VVX-310 Gigabit Ethernet Phone',
            deviceClass: 'Desk Phone'
        },
        {
            id: '55',
            name: 'Polycom VVX-410 Color Gigabit Ethernet Phone',
            deviceClass: 'Desk Phone'
        }
    ];

    module.exports = {
        Class: DeviceModelHelper,
        /**
         * @param {Context} context
         * @returns {DeviceModelHelper}
         */
        $get: function(context) {

            return context.createSingleton('DeviceModelHelper', function() {
                return new DeviceModelHelper(context);
            });

        }
    };

    /**
     * @typedef {object} IDeviceModel
     * @property {string} id
     * @property {string} name
     * @property {string} deviceClass
     * @property {string} addons
     */

    /**
     * @typedef {Object} IDeviceModelAddon
     * @property {string} id
     * @property {string} name
     * @property {string} count
     */

}.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ },
/* 23 */
/***/ function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_RESULT__ = function(require, exports, module) {

    'use strict';

    var Helper = __webpack_require__(15).Class;

    /**
     * @extends Helper
     * @constructor
     */
    function LanguageHelper(context) {
        Helper.call(this, context);
    }

    LanguageHelper.prototype = Object.create(Helper.prototype);

    /**
     * @type {ILanguage[]}
     */
    LanguageHelper.prototype.languages = [
        {
            id: '1033',
            name: 'English (US)'
        },
        {
            id: '3084',
            name: 'French (Canada)'
        }
    ];

    module.exports = {
        Class: LanguageHelper,
        /**
         * @param {Context} context
         * @returns {LanguageHelper}
         */
        $get: function(context) {

            return context.createSingleton('LanguageHelper', function() {
                return new LanguageHelper(context);
            });

        }
    };

    /**
     * @typedef {object} ILanguage
     * @property {string} id
     * @property {string} name
     */

}.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ },
/* 24 */
/***/ function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_RESULT__ = function(require, exports, module) {

    'use strict';

    var Helper = __webpack_require__(15).Class,
        List = __webpack_require__(20),
        Utils = __webpack_require__(19);

    /**
     * @extends Helper
     * @constructor
     */
    function LocationHelper(context) {
        Helper.call(this, context);
        this.state = __webpack_require__(26).$get(context);
    }

    LocationHelper.prototype = Object.create(Helper.prototype);

    LocationHelper.prototype.createUrl = function() {
        return '/dictionary/location';
    };

    /**
     * @param {ILocationFilterOptions} options
     * @returns {function(ILocation)}
     */
    LocationHelper.prototype.filter = function(options) {

        var uniqueNPAs = [];

        options = Utils.extend({
            stateId: '',
            onlyUniqueNPA: false
        }, options);

        return List.filter([
            {
                condition: options.stateId,
                filterFn: function(item, opts) {
                    return (this.state.getId(item.state) == opts.condition);
                }.bind(this)
            },
            {
                condition: options.onlyUniqueNPA,
                filterFn: function(item, opts) {
                    if (uniqueNPAs.indexOf(item.npa) == -1) {
                        uniqueNPAs.push(item.npa);
                        return true;
                    } else {
                        return false;
                    }
                }
            }
        ]);

    };

    /**
     * @param {IListComparatorOptions} [options]
     * @returns {comparator}
     */
    LocationHelper.prototype.comparator = function(options) {

        options = Utils.extend({
            sortBy: 'npa'
        }, options);

        if (options.sortBy == 'nxx') {

            /**
             * @param {ILocation} item
             * @returns {number}
             */
            options.extractFn = function(item) {
                return (parseInt(item.npa) * 1000000) + parseInt(item.nxx);
            };

            options.compareFn = List.numberComparator;

        }

        return List.comparator(options);

    };

    module.exports = {
        Class: LocationHelper,
        /**
         * @param {Context} context
         * @returns {LocationHelper}
         */
        $get: function(context) {

            return context.createSingleton('LocationHelper', function() {
                return new LocationHelper(context);
            });

        }
    };

    /**
     * @typedef {object} ILocation
     * @property {string} id
     * @property {string} uri
     * @property {string} name
     * @property {string} isoCode
     * @property {string} npa
     * @property {string} nxx
     * @property {IState} state
     */

    /**
     * @typedef {object} ILocationFilterOptions
     * @property {string} stateId
     * @property {boolean} onlyUniqueNPA
     */

}.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ },
/* 25 */
/***/ function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_RESULT__ = function(require, exports, module) {

    'use strict';

    var Helper = __webpack_require__(15).Class;

    /**
     * @extends Helper
     * @constructor
     */
    function ShippingMethodHelper(context) {
        Helper.call(this, context);
    }

    ShippingMethodHelper.prototype = Object.create(Helper.prototype);

    /**
     * TODO Remove when http://jira.ringcentral.com/browse/SDK-3 id done
     * @type {IShippingMethod[]}
     */
    ShippingMethodHelper.prototype.shippingMethods = [
        {
            id: '1',
            name: 'Ground Shipping (5-7 business days)'
        },
        {
            id: '2',
            name: '2-days Shipping'
        },
        {
            id: '3',
            name: 'Overnight Shipping'
        }
    ];

    module.exports = {
        Class: ShippingMethodHelper,
        /**
         * @param {Context} context
         * @returns {ShippingMethodHelper}
         */
        $get: function(context) {

            return context.createSingleton('ShippingMethodHelper', function() {
                return new ShippingMethodHelper(context);
            });

        }
    };

    /**
     * @typedef {object} IShippingMethod
     * @property {string} id
     * @property {string} name
     */

}.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ },
/* 26 */
/***/ function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_RESULT__ = function(require, exports, module) {

    'use strict';

    var Helper = __webpack_require__(15).Class,
        List = __webpack_require__(20),
        Utils = __webpack_require__(19);

    /**
     * @extends Helper
     * @constructor
     */
    function StateHelper(context) {
        Helper.call(this, context);
        this.countryHelper = __webpack_require__(21).$get(context);
    }

    StateHelper.prototype = Object.create(Helper.prototype);

    StateHelper.prototype.createUrl = function() {
        return '/dictionary/state';
    };

    /**
     * @param {IStateOptions} options
     * @returns {function(IState)}
     */
    StateHelper.prototype.filter = function(options) {

        options = Utils.extend({
            countryId: ''
        }, options);

        return List.filter([
            {
                condition: options.countryId,
                filterFn: function(item, opts) {
                    return (this.countryHelper.getId(item.country) == opts.condition);
                }.bind(this)
            }
        ]);

    };

    module.exports = {
        Class: StateHelper,
        /**
         * @param {Context} context
         * @returns {StateHelper}
         */
        $get: function(context) {

            return context.createSingleton('StateHelper', function() {
                return new StateHelper(context);
            });

        }
    };

    /**
     * @typedef {object} IState
     * @property {string} id
     * @property {string} uri
     * @property {string} name
     * @property {string} isoCode
     * @property {ICountry} country
     */

    /**
     * @typedef {object} IStateOptions
     * @property {string} countryId
     */

}.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ },
/* 27 */
/***/ function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_RESULT__ = function(require, exports, module) {

    'use strict';

    var Helper = __webpack_require__(15).Class;

    /**
     * @extends Helper
     * @constructor
     */
    function TimezoneHelper(context) {
        Helper.call(this, context);
    }

    TimezoneHelper.prototype = Object.create(Helper.prototype);

    TimezoneHelper.prototype.createUrl = function() {
        return '/dictionary/timezone';
    };

    module.exports = {
        Class: TimezoneHelper,
        /**
         * @param {Context} context
         * @returns {TimezoneHelper}
         */
        $get: function(context) {

            return context.createSingleton('TimezoneHelper', function() {
                return new TimezoneHelper(context);
            });

        }
    };

    /**
     * @typedef {object} ITimezone
     * @property {string} id
     * @property {string} uri
     * @property {string} name
     * @property {string} description
     */

}.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ },
/* 28 */
/***/ function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_RESULT__ = function(require, exports, module) {

    'use strict';

    var Helper = __webpack_require__(15).Class;

    /**
     * @extends Helper
     * @constructor
     */
    function AccountHelper(context) {
        Helper.call(this, context);
    }

    AccountHelper.prototype = Object.create(Helper.prototype);

    AccountHelper.prototype.createUrl = function() {
        return '/account/~';
    };

    module.exports = {
        Class: AccountHelper,
        /**
         * @param {Context} context
         * @returns {AccountHelper}
         */
        $get: function(context) {

            return context.createSingleton('AccountHelper', function() {
                return new AccountHelper(context);
            });

        }
    };

}.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ },
/* 29 */
/***/ function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_RESULT__ = function(require, exports, module) {

    'use strict';

    var Helper = __webpack_require__(15).Class,
        Validator = __webpack_require__(17);

    /**
     * @extends Helper
     * @constructor
     */
    function BlockedNumberHelper(context) {
        Helper.call(this, context);
    }

    BlockedNumberHelper.prototype = Object.create(Helper.prototype);

    /**
     *
     * @param {IBlockedNumberOptions} [options]
     * @param {string} [id]
     * @returns {string}
     */
    BlockedNumberHelper.prototype.createUrl = function(options, id) {

        options = options || {};

        return '/account/~/extension/' +
               (options.extensionId ? options.extensionId : '~') +
               '/blocked-number' +
               (id ? '/' + id : '');

    };

    /**
     * @param {IBlockedNumber} item
     */
    BlockedNumberHelper.prototype.validate = function(item) {

        return Validator.validate([
            {field: 'phoneNumber', validator: Validator.phone(item.phoneNumber)},
            {field: 'phoneNumber', validator: Validator.required(item.phoneNumber)},
            {field: 'name', validator: Validator.required(item.name)}
        ]);

    };

    module.exports = {
        Class: BlockedNumberHelper,
        /**
         * @param {Context} context
         * @returns {BlockedNumberHelper}
         */
        $get: function(context) {

            return context.createSingleton('BlockedNumberHelper', function() {
                return new BlockedNumberHelper(context);
            });

        }
    };

    /**
     * @typedef {object} IBlockedNumber
     * @property {string} name
     * @property {string} phoneNumber
     */

    /**
     * @typedef {object} IBlockedNumberOptions
     * @property {string} extensionId
     */

}.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ },
/* 30 */
/***/ function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_RESULT__ = function(require, exports, module) {

    'use strict';

    var Helper = __webpack_require__(15).Class,
        Utils = __webpack_require__(19),
        List = __webpack_require__(20);

    /**
     * @extends Helper
     * @constructor
     */
    function CallHelper(context) {
        Helper.call(this, context);
        this.presence = __webpack_require__(39).$get(context);
        this.contact = __webpack_require__(32).$get(context);
    }

    CallHelper.prototype = Object.create(Helper.prototype);


    /**
     * @param {ICallOptions} [options]
     * @param {string} [id]
     * @returns {string}
     */
    CallHelper.prototype.createUrl = function(options, id) {

        options = options || {};

        if (!('personal' in options) && !('extensionId' in options)) options.personal = true;

        return '/account/~/' +
               (options.personal || options.extensionId ? ('extension/' + (options.extensionId || '~') + '/') : '') +
               (options.active ? 'active-calls' : 'call-log') +
               (id ? '/' + id : '');

    };

    CallHelper.prototype.getSessionId = function(call) {
        return (call && call.sessionId);
    };

    CallHelper.prototype.isInProgress = function(call) {
        return (call && call.result == 'In Progress');
    };

    CallHelper.prototype.isAlive = function(call) {
        return (call && call.availability == 'Alive');
    };

    /**
     * @param {ICall} call
     * @returns {boolean}
     */
    CallHelper.prototype.isInbound = function(call) {
        return (call && call.direction == 'Inbound');
    };

    /**
     * @param {ICall} call
     * @returns {boolean}
     */
    CallHelper.prototype.isOutbound = function(call) {
        return !this.isInbound(call);
    };

    /**
     * @param {ICall} call
     * @returns {boolean}
     */
    CallHelper.prototype.isMissed = function(call) {
        return (call && call.result == 'Missed');
    };

    /**
     * @param {ICall} call
     * @returns {boolean}
     */
    CallHelper.prototype.isFindMe = function(call) {
        return (call && call.action == 'FindMe');
    };

    /**
     * @param {ICall} call
     * @returns {ICallerInfo}
     */
    CallHelper.prototype.getCallerInfo = function(call) {
        return this.isInbound(call) ? call.from : call.to;
    };

    /**
     * @param {ICall} call
     * @returns {ICallerInfo[]}
     */
    CallHelper.prototype.getAllCallerInfos = function(call) {
        return [this.getCallerInfo(call)].concat(this.isInbound(call) ? call.to : call.from);
    };

    CallHelper.prototype.formatDuration = function(call) {

        function addZero(v) {
            return (v < 10) ? '0' + v : v;
        }

        var duration = parseInt(call.duration),
            hours = Math.floor(duration / (60 * 60)),
            mins = Math.floor((duration % (60 * 60)) / 60),
            secs = Math.floor(duration % 60);

        return (hours ? hours + ':' : '') + addZero(mins) + ':' + addZero(secs);

    };

    /**
     * @param {ICallFilterOptions} [options]
     * @returns {function(ICall)}
     */
    CallHelper.prototype.filter = function(options) {

        options = Utils.extend({
            alive: true,
            direction: '',
            type: ''
        }, options);

        return List.filter([
            //{condition: options.alive, filterFn: this.isAlive},
            {filterBy: 'direction', condition: options.direction},
            {filterBy: 'type', condition: options.type}
        ]);

    };

    /**
     * TODO Compare as dates
     * @param {IListComparatorOptions} [options]
     * @returns {function(object, object)}
     */
    CallHelper.prototype.comparator = function(options) {

        return List.comparator(Utils.extend({
            sortBy: 'startTime'
        }, options));

    };

    /**
     * Injects contact field with appropriate {IContact} data structure into all callerInfos found in
     * all calls Warning, this function may be performance-consuming, reduce the amount of items passed to contacts
     * and calls
     * @param {IContact[]} contacts
     * @param {ICall[]} calls
     * @param {IContactMatchOptions} [options]
     */
    CallHelper.prototype.attachContacts = function(contacts, calls, options) {

        var self = this;

        // Flatten all caller infos from all messages
        var callerInfos = calls.reduce(function(callerInfos, call) {

            return callerInfos.concat(self.getAllCallerInfos(call));

        }, []);

        this.contact.attachToCallerInfos(callerInfos, contacts, options);

    };

    /**
     * Check whether pair of calls are two legs of RingOut
     * @param {ICall} outboundRingOutCall
     * @param {ICall} inboundCall
     * @param {ICallProcessingOptions} options
     * @returns {boolean}
     */
    CallHelper.prototype.checkMergeability = function(outboundRingOutCall, inboundCall, options) {

        function getTime(dateString) {
            return (new Date(dateString)).getTime();
        }

        return (
        (!options.strict || outboundRingOutCall.action && outboundRingOutCall.action.toLowerCase().indexOf('ringout') != -1) &&
        // Check directions
        outboundRingOutCall.direction == 'Outbound' &&
        inboundCall.direction == 'Inbound' &&
        // Check that start times are equal or close enough
        ((!inboundCall.startTime && !outboundRingOutCall.startTime) || Math.abs(getTime(inboundCall.startTime) - getTime(outboundRingOutCall.startTime)) < (options.maxStartTimeDiscrepancy || 5000)) &&
        // Check that numbers match
        inboundCall.from.phoneNumber == outboundRingOutCall.to.phoneNumber &&
        (inboundCall.to.phoneNumber == outboundRingOutCall.from.phoneNumber || inboundCall.to.name == outboundRingOutCall.from.name) //TODO Maybe name check is not required
        );

    };

    /**
     * @param {ICall} outboundRingOutCall
     * @param {ICall} inboundCall
     * @param {ICallProcessingOptions} [options]
     * @returns {Array}
     */
    CallHelper.prototype.combineCalls = function(outboundRingOutCall, inboundCall, options) {

        options = options || {};

        var result = [];

        outboundRingOutCall.hasSubsequent = true;

        if (options.merge) {

            outboundRingOutCall.duration = (outboundRingOutCall.duration > inboundCall.duration) ? outboundRingOutCall.duration : inboundCall.duration;

            // TODO Usually information from inbound call is more accurate for unknown reason
            outboundRingOutCall.from = inboundCall.to;
            outboundRingOutCall.to = inboundCall.from;

            // Push only one "merged" outbound call
            result.push(outboundRingOutCall);

        } else {

            // Mark next call as subsequent
            inboundCall.subsequent = true;

            inboundCall.startTime = outboundRingOutCall.startTime; // Needed for sort

            // Push both calls, first outbound then inbound
            result.push(outboundRingOutCall);
            result.push(inboundCall);

        }

        return result;

    };

    /**
     * (!) Experimental (!)
     *
     * Calls in Recent Calls (Call Log) or Active Calls arrays can be combined if they are, for example, two legs of
     * one RingOut. The logic that stands behind this process is simple:
     *
     * - Calls must have opposite directions
     * - Must have been started within a certain limited time frame
     * - Must have same phone numbers in their Caller Info sections (from/to)
     *
     * ```js
     * var processedCalls = Call.processCalls(callsArray, {strict: false, merge: true});
     * ```
     *
     * Flags:
     *
     * - if `strict` is `true` then only calls with RingOut in `action` property will be affected
     * - `merge` &mdash; controls whether to merge calls (reducing the length of array) or give them `subsequent`
     *     and `hasSubsequent` properties
     *
     * @param {ICall[]} calls
     * @param {ICallProcessingOptions} options
     * @returns {ICall[]}
     */
    CallHelper.prototype.processCalls = function(calls, options) {

        var processedCalls = [],
            callsToMerge = [],
            self = this;

        // Iterate through calls
        calls.forEach(function(call) {

            var merged = false;

            call.subsequent = false;
            call.hasSubsequent = false;

            // Second cycle to find other leg
            // It is assumed that call is the outbound, secondCall is inbound
            calls.some(function(secondCall) {

                if (call === secondCall) return false;

                if (self.checkMergeability(call, secondCall, options)) {

                    // Push to result array merged call
                    processedCalls = processedCalls.concat(self.combineCalls(call, secondCall, options));

                    // Push to array calls that are merged
                    callsToMerge.push(call);
                    callsToMerge.push(secondCall);

                    merged = true;

                }

                return merged;

            });

        });

        // After all calls are merged, add non-merged calls
        calls.forEach(function(call) {

            if (callsToMerge.indexOf(call) == -1) processedCalls.push(call);

        });

        return processedCalls;

    };

    /**
     * Converts Presence's ActiveCall array into regular Calls array
     * @param {IPresenceCall[]} activeCalls
     * @returns {ICall[]}
     */
    CallHelper.prototype.parsePresenceCalls = function(activeCalls) {

        return activeCalls.map(function(activeCall) {

            return {
                id: activeCall.id,
                uri: '',
                sessionId: activeCall.sessionId,
                from: {phoneNumber: activeCall.from},
                to: {phoneNumber: activeCall.to},
                direction: activeCall.direction,
                startTime: '',
                duration: 0,
                type: '',
                action: '',
                result: this.presence.isCallInProgress(activeCall) ? 'In Progress' : activeCall.telephonyStatus,
                telephonyStatus: activeCall.telephonyStatus // non-standard property for compatibility
            };

        }, this);

    };

    /**
     * @param {ICall} call
     * @returns {string}
     */
    CallHelper.prototype.getSignature = function(call) {

        function cleanup(phoneNumber) {
            return (phoneNumber || '').toString().replace(/[^0-9]/ig, '');
        }

        return call.direction + '|' + (call.from && cleanup(call.from.phoneNumber)) + '|' + (call.to && cleanup(call.to.phoneNumber));

    };

    /**
     * @param {ICall[]} presenceCalls
     * @param {IPresence} presence
     * @returns {ICall[]}
     */
    CallHelper.prototype.mergePresenceCalls = function(presenceCalls, presence) {

        var currentDate = new Date(),

            activeCalls = this
                .parsePresenceCalls(presence && presence.activeCalls || [])
                .map(function(call) {
                    // delete property to make sure it is skipped during merge
                    delete call.startTime;
                    return call;
                });

        presenceCalls = this.merge(presenceCalls || [], activeCalls, this.getSessionId, true);

        presenceCalls.forEach(function(call) {
            if (!call.startTime) call.startTime = currentDate.toISOString();
        });

        return presenceCalls;

    };

    /**
     * @param {ICall[]} presenceCalls
     * @param {ICall[]} calls
     * @param {ICall[]} activeCalls
     * @returns {ICall[]}
     */
    CallHelper.prototype.mergeAll = function(presenceCalls, calls, activeCalls) {

        // First, merge calls into presence calls
        var presenceAndCalls = this.merge(presenceCalls || [], calls || [], this.getSessionId, true);

        // Second, merge activeCalls into previous result
        return this.merge(presenceAndCalls, activeCalls || [], this.getSessionId, true);

    };

    module.exports = {
        Class: CallHelper,
        /**
         * @param {Context} context
         * @returns {CallHelper}
         */
        $get: function(context) {

            return context.createSingleton('CallHelper', function() {
                return new CallHelper(context);
            });

        }
    };

    /**
     * @typedef {object} ICall
     * @property {string} id
     * @property {string} uri
     * @property {string} sessionId
     * @property {string} startTime
     * @property {string} duration
     * @property {string} type
     * @property {string} direction
     * @property {string} action
     * @property {string} result
     * @property {ICallerInfo} to
     * @property {ICallerInfo} from
     */

    /**
     * @typedef {object} ICallOptions
     * @property {string} extensionId
     * @property {boolean} active
     * @property {boolean} personal
     */

    /**
     * @typedef {object} ICallProcessingOptions
     * @property {boolean} strict
     * @property {boolean} merge
     * @property {number} maxStartTimeDiscrepancy
     */

    /**
     * @typedef {object} ICallFilterOptions
     * @property {string} extensionId
     * @property {string} direction
     * @property {string} type
     */

    /**
     * @see http://platform-dev.dins.ru/artifacts/documentation/latest/webhelp/dev_guide_advanced/CallerInfo.html
     * @typedef {Object} ICallerInfo
     * @property {string} phoneNumber
     * @property {string} extensionNumber
     * @property {string} name
     * @property {string} location
     * @property {IContact} [contact] - corresponding contact (added by attachContacts methods)
     * @property {string} [contactPhone] - contact's phone as written in contact (added by attachContacts methods)
     */

}.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ },
/* 31 */
/***/ function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_RESULT__ = function(require, exports, module) {

    'use strict';

    var Helper = __webpack_require__(15).Class;

    /**
     * @extends Helper
     * @constructor
     */
    function ConferencingHelper(context) {
        Helper.call(this, context);
    }

    ConferencingHelper.prototype = Object.create(Helper.prototype);

    ConferencingHelper.prototype.createUrl = function() {
        return '/account/~/extension/~/conferencing';
    };

    module.exports = {
        Class: ConferencingHelper,
        /**
         * @param {Context} context
         * @returns {ConferencingHelper}
         */
        $get: function(context) {

            return context.createSingleton('ConferencingHelper', function() {
                return new ConferencingHelper(context);
            });

        }
    };

}.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ },
/* 32 */
/***/ function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_RESULT__ = function(require, exports, module) {

    'use strict';

    var Utils = __webpack_require__(19),
        Validator = __webpack_require__(17),
        Helper = __webpack_require__(15).Class,
        List = __webpack_require__(20);

    /**
     * @extends Helper
     * @constructor
     */
    function ContactHelper(context) {
        Helper.call(this, context);
    }

    ContactHelper.prototype = Object.create(Helper.prototype);

    /**
     * @param {IContactOptions} [options]
     * @param {string} [id]
     * @returns {string}
     */
    ContactHelper.prototype.createUrl = function(options, id) {

        options = options || {};

        var root = '/account/~/extension/' +
                   (options.extensionId ? options.extensionId : '~') +
                   '/address-book';

        if (options.sync) return root + '-sync';

        return root +
               (options.groupId ? '/group/' + options.groupId + '/contact' : '/contact') +
               (id ? '/' + id : '');

    };

    /**
     * Returns all values of the given fields if value exists
     * @param {(IContact|object)} where
     * @param {Array} fields
     * @param {boolean} [asHash]
     * @protected
     * @returns {Object}
     */
    ContactHelper.prototype.getFieldValues = function(where, fields, asHash) {

        return fields.reduce(function(result, field) {

            if (where && where[field]) {
                if (asHash) {
                    result[field] = where[field];
                } else {
                    result.push(where[field]);
                }
            }

            return result;

        }, asHash ? {} : []);

    };

    /**
     * @param {IContact} contact
     * @returns {string}
     */
    ContactHelper.prototype.getFullName = function(contact) {
        return this.getFieldValues(contact, this.nameFields).join(' ');
    };

    /**
     * @param {IContact} contact
     * @param {boolean} [asHash]
     * @returns {IContact}
     */
    ContactHelper.prototype.getEmails = function(contact, asHash) {
        return this.getFieldValues(contact, this.emailFields, asHash);
    };

    /**
     * @param {IContact} contact
     * @param {boolean} [asHash]
     * @returns {IContact}
     */
    ContactHelper.prototype.getPhones = function(contact, asHash) {
        return this.getFieldValues(contact, this.phoneFields, asHash);
    };

    /**
     * @param {IContact} contact
     * @param {boolean} [asHash]
     * @returns {IContact}
     */
    ContactHelper.prototype.getFaxes = function(contact, asHash) {
        return this.getFieldValues(contact, this.faxFields, asHash);
    };

    /**
     * @param {IContact} contact
     * @param {boolean} [asHash]
     * @returns {IContact}
     */
    ContactHelper.prototype.getAddresses = function(contact, asHash) {
        return this.getFieldValues(contact, this.addressFields, asHash);
    };

    /**
     * @param {IContact} contact
     * @returns {boolean}
     */
    ContactHelper.prototype.isAlive = function(contact) {
        return (contact.availability == 'Alive');
    };

    /**
     * Matches a contact against a given string, returns null if nothing found
     * @param {IContact} contact
     * @param {string} string
     * @param {IContactMatchOptions} [options]
     * @returns {(string|null)}
     */
    ContactHelper.prototype.match = function(contact, string, options) {

        options = Utils.extend({
            fields: [].concat(this.nameFields, this.emailFields, this.phoneFields, this.faxFields, this.otherFields),
            inAddresses: true,
            transformFn: function(value, options) {
                return value ? value.toString().toLocaleLowerCase() : '';
            },
            strict: false
        }, options);

        string = options.transformFn(string, options);

        var found = null;

        if (!string) return found;

        function matchWith(value) {

            // skip unnecessary cycles if match has been found
            if (found) return;

            var transformed = options.transformFn(value, options);

            if (!transformed) return;

            var match = (options.strict ? transformed == string : transformed.indexOf(string) > -1);

            if (match) found = value;

        }

        // Search in fields
        options.fields.forEach(function(field) {
            matchWith(contact[field]);
        });

        // Search in addresses, skip unnecessary cycles if match has been found
        if (options.inAddresses && !found) this.addressFields.forEach(function(field) {

            // skip unnecessary cycles if match has been found or no field value
            if (!contact[field] || found) return;

            this.addressSubFields.forEach(function(subField) {
                matchWith(contact[field][subField]);
            });

        }, this);

        return found;

    };

    /**
     * Matches a contact against a given phone number, returns null if nothing found
     * @param {IContact} contact
     * @param {string} phone
     * @param {IContactMatchOptions} [options]
     * @returns {string|null}
     */
    ContactHelper.prototype.matchAsPhone = function(contact, phone, options) {

        return this.match(contact, phone, Utils.extend({
            fields: [].concat(this.phoneFields, this.faxFields),
            inAddresses: false,
            transformFn: function(value, options) {
                return value ? value.toString().replace(/[^\d\w]/ig, '') : ''; //TODO Trickier removal reqired;
            },
            strict: false
        }, options));

    };


    /**
     * Injects contact field with appropriate {IContact} data structure into all given {ICallerInfo}
     * Warning, this function may be performance-consuming, reduce the amount of items passed to contacts and callerInfos
     * @param {ICallerInfo[]} callerInfos
     * @param {IContact[]} contacts
     * @param {IContactMatchOptions} [options]
     */
    ContactHelper.prototype.attachToCallerInfos = function(callerInfos, contacts, options) {

        var self = this,
            callerInfoIndex = this.index(callerInfos, function(callerInfo) { return callerInfo.phoneNumber; }, true);

        Utils.forEach(callerInfoIndex, function(indexedCallerInfos, phoneNumber) {

            var foundContact = null,
                foundPhone = null;

            contacts.some(function(contact) {

                foundPhone = self.matchAsPhone(contact, phoneNumber, options);

                if (foundPhone) foundContact = contact;

                return foundPhone;

            });

            if (foundContact) {

                indexedCallerInfos.forEach(function(callerInfo) {
                    callerInfo.contact = foundContact;
                    callerInfo.contactPhone = foundPhone;
                });

            }

        });

    };

    /**
     * @param {IListComparatorOptions} [options]
     * @returns {function(object, object)}
     */
    ContactHelper.prototype.comparator = function(options) {

        var self = this;

        return List.comparator(Utils.extend({
            extractFn: function(contact, options) {
                return self.getFullName(contact);
            }
        }, options));

    };

    /**
     * TODO Add filtering by group http://jira.ringcentral.com/browse/SDK-4
     * @param {IContactOptions} [options]
     * @returns {function(IContact)}
     */
    ContactHelper.prototype.filter = function(options) {

        var self = this;

        options = Utils.extend({
            alive: true,
            startsWith: '',
            phonesOnly: false,
            faxesOnly: false
        }, options);

        return List.filter([
            {condition: options.alive, filterFn: this.isAlive},
            {condition: options.startsWith, filterFn: function(item, opts) { return self.match(item, opts.condition); }},
            {condition: options.phonesOnly, filterFn: function(item, opts) { return (self.getPhones(item).length > 0); }},
            {condition: options.faxesOnly, filterFn: function(item, opts) { return (self.getFaxes(item).length > 0); }}
        ]);

    };

    /**
     * @param {IContact} item
     */
    ContactHelper.prototype.validate = function(item) {

        return Validator.validate([
            {field: 'firstName', validator: Validator.required(item.firstName)},
            {field: 'lastName', validator: Validator.required(item.lastName)},
            {field: 'email', validator: Validator.email(item.email)},
            {field: 'email2', validator: Validator.email(item.email2)},
            {field: 'email3', validator: Validator.email(item.email3)}
        ]);

    };

    ContactHelper.prototype.phoneFields = [
        'homePhone',
        'homePhone2',
        'businessPhone',
        'businessPhone2',
        'mobilePhone',
        'companyPhone',
        'assistantPhone',
        'carPhone',
        'otherPhone',
        'callbackPhone'
    ];

    ContactHelper.prototype.faxFields = [
        'businessFax',
        'otherFax'
    ];

    ContactHelper.prototype.addressFields = [
        'homeAddress',
        'businessAddress',
        'otherAddress'
    ];

    ContactHelper.prototype.addressSubFields = [
        'street',
        'city',
        'state',
        'zip'
    ];

    ContactHelper.prototype.nameFields = [
        'firstName',
        'middleName',
        'lastName',
        'nickName'
    ];

    ContactHelper.prototype.otherFields = [
        'company',
        'jobTitle',
        'webPage',
        'notes'
    ];

    ContactHelper.prototype.emailFields = [
        'email',
        'email2',
        'email3'
    ];

    module.exports = {
        Class: ContactHelper,
        /**
         * @param {Context} context
         * @returns {ContactHelper}
         */
        $get: function(context) {

            return context.createSingleton('ContactHelper', function() {
                return new ContactHelper(context);
            });

        }
    };

    /**
     * @typedef {object} IContactOptions
     * @property {string} extensionId
     * @property {string} groupId
     */

    /**
     * @typedef {object} IContactFilterOptions
     * @property {string} startsWith
     * @property {boolean} alive
     */

    /**
     * @typedef {object} IContactMatchOptions
     * @property {function(object, IContactMatchOptions)} transformFn
     * @property {boolean} strict - if false look for as sub string
     * @property {boolean} inAddresses - look in addresses as well
     * @property {string[]} fields - in which fields to look for
     */

    /**
     * @see http://platform-dev.dins.ru/artifacts/documentation/webhelp/dev_guide/content/ch16s04.html#ContactAddressInfo
     * @typedef {Object} IContactAddress
     * @property {string} country
     * @property {string} street
     * @property {string} city
     * @property {string} state
     * @property {string} zip
     */

    /**
     * @see http://platform-dev.dins.ru/artifacts/documentation/latest/webhelp/dev_guide_advanced/ch18s04.html#ContactInfo
     * @typedef {Object} IContactBrief
     * @property {string} firstName
     * @property {string} lastName
     * @property {string} company
     * @property {string} email
     * @property {IContactAddress} businessAddress
     */

    /**
     * @see http://platform-dev.dins.ru/artifacts/documentation/webhelp/dev_guide/content/ch16s04.html#ContactInfo
     * @typedef {Object} IContact
     *
     * Shared:
     * @property {string} id
     * @property {string} uri
     *
     * Names:
     * @property {string} firstName
     * @property {string} lastName
     * @property {string} company
     * @property {string} nickName
     * @property {string} middleName
     *
     * Emails:
     * @property {string} email
     * @property {string} email2
     * @property {string} email3
     *
     * Addresses:
     * @property {IContactAddress} businessAddress
     * @property {IContactAddress} homeAddress
     * @property {IContactAddress} otherAddress
     *
     * Phones:
     * @property {string} homePhone
     * @property {string} homePhone2
     * @property {string} businessPhone
     * @property {string} businessPhone2
     * @property {string} mobilePhone
     * @property {string} companyPhone
     * @property {string} assistantPhone
     * @property {string} carPhone
     * @property {string} otherPhone
     * @property {string} callbackPhone
     *
     * @property {string} businessFax
     * @property {string} otherFax
     */

}.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ },
/* 33 */
/***/ function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_RESULT__ = function(require, exports, module) {

    'use strict';

    var Helper = __webpack_require__(15).Class,
        Validator = __webpack_require__(17);

    /**
     * @extends Helper
     * @constructor
     */
    function ContactGroupHelper(context) {
        Helper.call(this, context);
    }

    ContactGroupHelper.prototype = Object.create(Helper.prototype);
    ContactGroupHelper.prototype.createUrl = function(options, id) {
        return '/account/~/extension/~/address-book/group' + (id ? '/' + id : '');
    };

    /**
     * @param {IContactGroup} item
     */
    ContactGroupHelper.prototype.validate = function(item) {

        return Validator.validate([
            {field: 'groupName', validator: Validator.required(item && item.groupName)}
        ]);

    };

    module.exports = {
        Class: ContactGroupHelper,
        /**
         * @param {Context} context
         * @returns {ContactGroupHelper}
         */
        $get: function(context) {

            return context.createSingleton('ContactGroupHelper', function() {
                return new ContactGroupHelper(context);
            });

        }
    };

    /**
     * @typedef {object} IContactGroup
     * @property {string} id
     * @property {string} uri
     * @property {string} notes
     * @property {string} groupName
     * @property {number} contactsCount
     */

}.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ },
/* 34 */
/***/ function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_RESULT__ = function(require, exports, module) {

    'use strict';

    var Helper = __webpack_require__(15).Class,
        Validator = __webpack_require__(17);

    /**
     * @extends Helper
     * @constructor
     */
    function DeviceHelper(context) {
        Helper.call(this, context);
        this.extension = __webpack_require__(35).$get(context);
        this.deviceModel = __webpack_require__(22).$get(context);
    }

    DeviceHelper.prototype = Object.create(Helper.prototype);

    /**
     * @param {IDeviceOptions} [options]
     * @param {string} [id]
     * @returns {string}
     */
    DeviceHelper.prototype.createUrl = function(options, id) {

        options = options || {};

        if (options.order) return '/account/~/order';

        return '/account/~' +
               (options.extensionId ? '/extension/' + options.extensionId : '') +
               '/device' +
               (id ? '/' + id : '');

    };

    /**
     * @param {IDevice} item
     */
    DeviceHelper.prototype.validate = function(item) {

        return Validator.validate([
            {field: 'emergencyServiceAddress-street', validator: Validator.required(item && item.emergencyServiceAddress && item.emergencyServiceAddress.street)},
            {field: 'emergencyServiceAddress-city', validator: Validator.required(item && item.emergencyServiceAddress && item.emergencyServiceAddress.city)},
            {field: 'emergencyServiceAddress-state', validator: Validator.required(item && item.emergencyServiceAddress && item.emergencyServiceAddress.state)},
            {field: 'emergencyServiceAddress-country', validator: Validator.required(item && item.emergencyServiceAddress && item.emergencyServiceAddress.country)},
            {field: 'emergencyServiceAddress-zip', validator: Validator.required(item && item.emergencyServiceAddress && item.emergencyServiceAddress.zip)},
            {field: 'emergencyServiceAddress-customerName', validator: Validator.required(item && item.emergencyServiceAddress && item.emergencyServiceAddress.customerName)},
            {field: 'extension', validator: Validator.required(this.extension.getId(item && item.extension))},
            {field: 'model', validator: Validator.required(this.deviceModel.getId(item && item.model))}
        ]);

    };

    module.exports = {
        Class: DeviceHelper,
        /**
         * @param {Context} context
         * @returns {DeviceHelper}
         */
        $get: function(context) {

            return context.createSingleton('DeviceHelper', function() {
                return new DeviceHelper(context);
            });

        }
    };

    /**
     * @typedef {Object} IDevice
     * @property {string} id
     * @property {string} uri
     * @property {string} type
     * @property {string} name
     * @property {string} serial
     * @property {IDeviceModel} model
     * @property {IExtensionShort} extension TODO IExtension?
     * @property {IDeviceAddress} emergencyServiceAddress
     * @property {IDeviceShipping} shipping
     * @property {IDevicePhoneLine[]} phoneLines
     */

    /**
     * @typedef {Object} IDeviceOrder
     * @property {IDevice[]} devices
     */

    /**
     * @typedef {Object} IDeviceAddress
     * @property {string} street
     * @property {string} street2
     * @property {string} city
     * @property {string} state
     * @property {string} country
     * @property {string} zip
     * @property {string} customerName
     */

    /**
     * @typedef {Object} IDeviceShipping
     * @property {IDeviceAddress} address
     * @property {IShippingMethod} method
     * @property {string} status
     */

    /**
     * @typedef {Object} IDevicePhoneLine
     * @property {string} lineType
     * @property {IPhoneNumber} phoneInfo
     */

    /**
     * @typedef {Object} IDeviceOptions
     * @property {string} extensionId
     */

}.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ },
/* 35 */
/***/ function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_RESULT__ = function(require, exports, module) {

    'use strict';

    var Helper = __webpack_require__(15).Class,
        List = __webpack_require__(20),
        Utils = __webpack_require__(19);

    /**
     * @extends Helper
     * @constructor
     */
    function ExtensionHelper(context) {
        Helper.call(this, context);
    }

    ExtensionHelper.prototype = Object.create(Helper.prototype);

    ExtensionHelper.prototype.type = {
        department: 'Department',
        user: 'User',
        announcement: 'Announcement',
        voicemail: 'Voicemail'
    };

    /**
     *
     * @param {IExtensionOptions} [options]
     * @param {string} [id]
     * @returns {string}
     */
    ExtensionHelper.prototype.createUrl = function(options, id) {

        options = options || {};

        return '/account/~' +
               (options.departmentId ? '/department/' + options.departmentId + '/members' : '/extension') +
               (id ? '/' + id : '');

    };

    /**
     * @param {IExtension} extension
     * @returns {boolean}
     */
    ExtensionHelper.prototype.isUser = function(extension) {
        return extension && extension.type == this.type.user;
    };

    /**
     * @param {IExtension} extension
     * @returns {boolean}
     */
    ExtensionHelper.prototype.isDepartment = function(extension) {
        return extension && extension.type == this.type.department;
    };

    /**
     * @param {IExtension} extension
     * @returns {boolean}
     */
    ExtensionHelper.prototype.isAnnouncement = function(extension) {
        return extension && extension.type == this.type.announcement;
    };

    /**
     * @param {IExtension} extension
     * @returns {boolean}
     */
    ExtensionHelper.prototype.isVoicemail = function(extension) {
        return extension && extension.type == this.type.voicemail;
    };

    /**
     * @param {IListComparatorOptions} [options]
     * @returns {function(object, object)}
     */
    ExtensionHelper.prototype.comparator = function(options) {

        return List.comparator(Utils.extend({
            sortBy: 'extensionNumber',
            compareFn: List.numberComparator
        }, options));

    };

    /**
     * @param {IExtensionFilterOptions} [options]
     * @returns {function(IExtension)}
     */
    ExtensionHelper.prototype.filter = function(options) {

        options = Utils.extend({
            search: '',
            type: ''
        }, options);

        return List.filter([
            {filterBy: 'type', condition: options.type},
            {
                condition: options.search.toLocaleLowerCase(),
                filterFn: List.containsFilter,
                extractFn: function(item) {
                    return (item.name && (item.name.toLocaleLowerCase() + ' ')) +
                           (item.extensionNumber && item.extensionNumber.toString().toLocaleLowerCase());
                }
            }
        ]);

    };

    module.exports = {
        Class: ExtensionHelper,
        /**
         * @param {Context} context
         * @returns {ExtensionHelper}
         */
        $get: function(context) {

            return context.createSingleton('ExtensionHelper', function() {
                return new ExtensionHelper(context);
            });

        }
    };

    /**
     * @typedef {object} IExtensionOptions
     * @property {string} departmentId
     */

    /**
     * @typedef {object} IExtensionFilterOptions
     * @property {string} search
     * @property {string} type
     */

    /**
     * @see http://platform-dev.dins.ru/artifacts/documentation/latest/webhelp/dev_guide_advanced/ch18s04.html#ShortExtensionInfo
     * @typedef {object} IExtensionShort
     * @property {string} id
     * @property {string} uri
     * @property {string} extensionNumber
     */

    /**
     * @see http://platform-dev.dins.ru/artifacts/documentation/latest/webhelp/dev_guide_advanced/ch18s04.html#ExtensionInfo
     * @typedef {object} IExtension
     * @property {string} id
     * @property {string} uri
     * @property {string} extensionNumber
     * @property {string} name
     * @property {string} type
     * @property {IContactBrief} contact
     * @property {IExtensionRegionalSettings} regionalSettings
     * @property {IServiceFeature[]} serviceFeatures
     * @property {string} status
     * @property {string} setupWizardState
     */

    /**
     * @typedef {object} IExtensionRegionalSettings
     * @property {ITimezone} timezone
     * @property {ILanguage} language
     * @property {ICountry} homeCountry
     */

}.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ },
/* 36 */
/***/ function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_RESULT__ = function(require, exports, module) {

    'use strict';

    var Helper = __webpack_require__(15).Class,
        Utils = __webpack_require__(19),
        List = __webpack_require__(20);

    /**
     * @extends Helper
     * @constructor
     */
    function ForwardingNumberHelper(context) {
        Helper.call(this, context);
    }

    ForwardingNumberHelper.prototype = Object.create(Helper.prototype);


    ForwardingNumberHelper.prototype.createUrl = function(options, id) {

        options = options || {};

        return '/account/~/extension/' + (options.extensionId || '~') + '/forwarding-number' + (id ? '/' + id : '');

    };

    ForwardingNumberHelper.prototype.getId = function(forwardingNumber) {
        return forwardingNumber.id || (forwardingNumber.phoneNumber);
    };

    ForwardingNumberHelper.prototype.hasFeature = function(phoneNumber, feature) {
        return (!!phoneNumber.features && phoneNumber.features.indexOf(feature) != -1);
    };

    /**
     * @param {IListComparatorOptions} [options]
     * @returns {function(object, object)}
     */
    ForwardingNumberHelper.prototype.comparator = function(options) {

        return List.comparator(Utils.extend({
            sortBy: 'label'
        }, options));

    };

    /**
     * @param options
     * @returns {function(IForwardingNumber)}
     */
    ForwardingNumberHelper.prototype.filter = function(options) {

        var self = this;

        options = Utils.extend({
            features: []
        }, options);

        return List.filter([
            {
                condition: options.features.length, filterFn: function(item) {

                return options.features.some(function(feature) {
                    return self.hasFeature(item, feature);
                });

            }
            }
        ]);

    };


    module.exports = {
        Class: ForwardingNumberHelper,
        /**
         * @param {Context} context
         * @returns {ForwardingNumberHelper}
         */
        $get: function(context) {

            return context.createSingleton('ForwardingNumberHelper', function() {
                return new ForwardingNumberHelper(context);
            });

        }
    };

    /**
     *
     * @typedef {object} IForwardingNumber
     * @property {string} id
     * @property {string} uri
     * @property {string} label
     * @property {string} phoneNumber
     * @property {string} flipNumber
     */

}.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ },
/* 37 */
/***/ function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_RESULT__ = function(require, exports, module) {

    'use strict';

    var Helper = __webpack_require__(15).Class,
        Validator = __webpack_require__(17),
        Utils = __webpack_require__(19),
        List = __webpack_require__(20);

    /**
     * @extends Helper
     * @constructor
     */
    function MessageHelper(context) {
        Helper.call(this, context);
        this.platform = __webpack_require__(11).$get(context);
        this.contact = __webpack_require__(32).$get(context);
    }

    MessageHelper.prototype = Object.create(Helper.prototype);

    /**
     *
     * @param {IMessageOptions} [options]
     * @param {string} [id]
     * @returns {string}
     * @exceptionalCase Different endpoint when creating SMS/Pager
     */
    MessageHelper.prototype.createUrl = function(options, id) {

        options = options || {};

        var root = '/account/~/extension/' + (options.extensionId || '~');

        if (options.fax) return root + '/fax';
        if (options.sms) return root + '/sms';
        if (options.pager) return root + '/company-pager';
        if (options.sync) return root + '/message-sync';

        return root + '/message-store' + (id ? '/' + id : '');

    };

    MessageHelper.prototype.isInbound = function(message) {
        return (message && message.direction == 'Inbound');
    };

    MessageHelper.prototype.isOutbound = function(message) {
        return !this.isInbound(message);
    };

    MessageHelper.prototype.isSMS = function(message) {
        return (message && message.type == 'SMS');
    };

    MessageHelper.prototype.isPager = function(message) {
        return (message && message.type == 'Pager');
    };

    MessageHelper.prototype.isVoiceMail = function(message) {
        return (message && message.type == 'VoiceMail');
    };

    MessageHelper.prototype.isFax = function(message) {
        return (message && message.type == 'Fax');
    };

    MessageHelper.prototype.isAlive = function(message) {
        //return (this.availability != 'Deleted' && this.availability != 'Purged');
        return (message && message.availability == 'Alive');
    };

    MessageHelper.prototype.isRead = function(message) {
        return (message.readStatus == 'Read');
    };

    MessageHelper.prototype.setIsRead = function(message, isRead) {
        message.readStatus = (!!isRead) ? 'Read' : 'Unread';
        return message;
    };

    MessageHelper.prototype.getAttachmentUrl = function(message, i) {
        return message.attachments[i] ? this.platform.apiUrl(message.attachments[i].uri, {addMethod: 'GET', addServer: true, addToken: true}) : '';
    };

    MessageHelper.prototype.getAttachmentContentType = function(message, i) {
        return message.attachments[i] ? message.attachments[i].contentType : '';
    };

    /**
     * @returns {Subscription}
     */
    MessageHelper.prototype.getSubscription = function(options) {

        return (__webpack_require__(13).$get(this.context)).setEvents([this.createUrl(options)]);

    };

    /**
     * Returns from-phones if inbound (oterwise to-phones)
     * @returns {ICallerInfo[]}
     */
    MessageHelper.prototype.getCallerInfos = function(message) {
        return this.isInbound(message) ? [message.from] : message.to;
    };

    /**
     * Returns first from-phones if inbound (oterwise to-phones), then vice-versa
     * @returns {ICallerInfo[]}
     */
    MessageHelper.prototype.getAllCallerInfos = function(message) {
        return this.getCallerInfos(message).concat(this.isInbound(message) ? message.to : [message.from]);
    };

    /**
     * TODO Compare as dates
     * @param {IListComparatorOptions} [options]
     * @returns {function(object, object)}
     */
    MessageHelper.prototype.comparator = function(options) {

        return List.comparator(Utils.extend({
            sortBy: 'creationTime'
        }, options));

    };

    /**
     * @param {IMessageFilterOptions} [options]
     * @returns {function(IMessage)}
     */
    MessageHelper.prototype.filter = function(options) {

        options = Utils.extend({
            search: '',
            alive: true,
            direction: '',
            conversationId: '',
            readStatus: ''
        }, options);

        return List.filter([
            {condition: options.alive, filterFn: this.isAlive},
            {filterBy: 'type', condition: options.type},
            {filterBy: 'direction', condition: options.direction},
            {filterBy: 'conversationId', condition: options.conversationId},
            {filterBy: 'readStatus', condition: options.readStatus},
            {filterBy: 'subject', condition: options.search, filterFn: List.containsFilter}
        ]);

    };

    /**
     * Injects contact field with appropriate {IContact} data structure into all callerInfos found in all messages
     * Warning, this function may be performance-consuming, reduce the amount of items passed to contacts and messages
     * @param {IContact[]} contacts
     * @param {IMessage[]} messages
     * @param {IContactMatchOptions} [options]
     */
    MessageHelper.prototype.attachContacts = function(contacts, messages, options) {

        var self = this;

        // Flatten all caller infos from all messages
        var callerInfos = messages.reduce(function(callerInfos, message) {

            return callerInfos.concat(self.getAllCallerInfos(message));

        }, []);

        this.contact.attachToCallerInfos(callerInfos, contacts, options);

    };

    /**
     *
     * @param message
     * @returns {IMessageShort}
     */
    MessageHelper.prototype.shorten = function(message) {

        return {
            from: message.from,
            to: message.to,
            text: message.subject
        };

    };


    /**
     * @param {IMessage} item
     */
    MessageHelper.prototype.validateSMS = function(item) {

        return Validator.validate([
            {field: 'to', validator: Validator.required(Utils.getProperty(item, 'to[0].phoneNumber'))},
            {field: 'from', validator: Validator.required(Utils.getProperty(item, 'from.phoneNumber'))},
            {field: 'subject', validator: Validator.required(Utils.getProperty(item, 'subject'))},
            {field: 'subject', validator: Validator.length(Utils.getProperty(item, 'subject'), 160)}
        ]);

    };

    /**
     * @param {IMessage} item
     */
    MessageHelper.prototype.validatePager = function(item) {

        return Validator.validate([
            {field: 'to', validator: Validator.required(Utils.getProperty(item, 'to.extensionNumber'))},
            {field: 'from', validator: Validator.required(Utils.getProperty(item, 'from.extensionNumber'))},
            {field: 'subject', validator: Validator.required(Utils.getProperty(item, 'subject'))},
            {field: 'subject', validator: Validator.length(Utils.getProperty(item, 'subject'), 160)}
        ]);

    };

    module.exports = {
        Class: MessageHelper,
        /**
         * @param {Context} context
         * @returns {MessageHelper}
         */
        $get: function(context) {

            return context.createSingleton('MessageHelper', function() {
                return new MessageHelper(context);
            });

        }
    };

    /**
     * @typedef {object} IMessage
     * @property {string} id
     * @property {string} uri
     * @property {ICallerInfo[]} to
     * @property {ICallerInfo} from
     * @property {string} type
     * @property {string} creationTime
     * @property {string} readStatus
     * @property {string} priority
     * @property {IMessageAttachment} attachments
     * @property {string} direction
     * @property {string} availability
     * @property {string} subject
     * @property {string} messageStatus
     * @property {string} conversationId
     * @property {string} lastModifiedTime
     */

    /**
     * @typedef {object} IMessageShort
     * @property {ICallerInfo[]} to
     * @property {ICallerInfo} from
     * @property {string} text
     */

    /**
     * @typedef {object} IMessageOptions
     * @property {boolean} fax
     * @property {boolean} sync
     * @property {boolean} sms
     * @property {boolean} pager
     * @property {string} extensionId
     */

    /**
     * @typedef {object} IMessageFilterOptions
     * @property {boolean} alive
     * @property {string} conversationId
     * @property {string} direction
     * @property {string} readStatus
     * @property {string} type
     */

    /**
     * @typedef {object} IMessageFaxAttachment
     * @property {string} contentType
     * @property {string} content
     * @property {string} fileName
     */

    /**
     * @see http://platform-dev.dins.ru/artifacts/documentation/webhelp/dev_guide/content/ch18s01.html#MessageAttachmentInfo
     * @typedef {Object} IMessageAttachment
     * @property {string} id
     * @property {string} uri
     * @property {string} contentType
     * @property {string} vmDuration
     */

}.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ },
/* 38 */
/***/ function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_RESULT__ = function(require, exports, module) {

    'use strict';

    var List = __webpack_require__(20),
        Utils = __webpack_require__(19),
        Helper = __webpack_require__(15).Class;

    /**
     * @extends Helper
     * @constructor
     */
    function PhoneNumberHelper(context) {
        Helper.call(this, context);
        this.extension = __webpack_require__(35).$get(context);
    }

    PhoneNumberHelper.prototype = Object.create(Helper.prototype);

    /**
     * @param {IPhoneNumberOptions} [options]
     * @param {string} [id]
     * @returns {string}
     */
    PhoneNumberHelper.prototype.createUrl = function(options, id) {

        options = options || {};

        if (options.lookup) return '/number-pool/lookup';

        return '/account/~' +
               (options.extensionId ? '/extension/' + options.extensionId : '') +
               '/phone-number' +
               (id ? '/' + id : '');

    };

    PhoneNumberHelper.prototype.isSMS = function(phoneNumber) {
        return this.hasFeature(phoneNumber, 'SmsSender');
    };

    PhoneNumberHelper.prototype.hasFeature = function(phoneNumber, feature) {
        return (!!phoneNumber.features && phoneNumber.features.indexOf(feature) != -1);
    };

    PhoneNumberHelper.prototype.reserve = function(phoneNumber, date) {
        phoneNumber.reservedTill = new Date(date).toISOString();
    };

    PhoneNumberHelper.prototype.unreserve = function(phoneNumber) {
        phoneNumber.reservedTill = null;
    };

    /**
     * @param {IListComparatorOptions} [options]
     * @returns {function(IPhoneNumber, IPhoneNumber)}
     */
    PhoneNumberHelper.prototype.comparator = function(options) {

        return List.comparator(Utils.extend({
            /**
             * @param {IPhoneNumber} item
             * @returns {string}
             */
            extractFn: function(item) {
                return item.usageType + '-' +
                       item.paymentType + '-' +
                       item.type;
            }
        }, options));

    };

    /**
     * TODO Add other filtering methods http://jira.ringcentral.com/browse/SDK-5
     * @param {IPhoneNumberFilterOptions} options
     * @returns {function(IForwardingNumber)}
     */
    PhoneNumberHelper.prototype.filter = function(options) {

        var self = this;

        options = Utils.extend({
            usageType: '',
            paymentType: '',
            type: '',
            features: []
        }, options);

        return List.filter([
            {filterBy: 'usageType', condition: options.usageType},
            {filterBy: 'paymentType', condition: options.paymentType},
            {filterBy: 'type', condition: options.type},
            {
                condition: options.features.length, filterFn: function(item) {

                return options.features.some(function(feature) {
                    return self.hasFeature(item, feature);
                });

            }
            }
        ]);

    };

    module.exports = {
        Class: PhoneNumberHelper,
        /**
         * @param {Context} context
         * @returns {PhoneNumberHelper}
         */
        $get: function(context) {

            return context.createSingleton('PhoneNumberHelper', function() {
                return new PhoneNumberHelper(context);
            });

        }
    };

    /**
     * @typedef {object} IPhoneNumber
     * @property {string} id
     * @property {string} uri
     * @property {string} phoneNumber
     * @property {string} paymentType - External, TollFree, Local
     * @property {string} location
     * @property {string} type - VoiceFax, FaxOnly, VoiceOnly
     * @property {string} usageType - CompanyNumber, DirectNumber, CompanyFaxNumber, ForwardedNumber
     * @property {array} features - CallerId, SmsSender
     * @property {string} reservedTill - Date
     * @property {string} error
     */

    /**
     * @typedef {object} IPhoneNumberOptions
     * @property {string} extensionId
     * @property {true} lookup
     * @property {string} countryId
     * @property {string} paymentType
     * @property {string} npa
     * @property {string} nxx
     * @property {string} line
     * @property {string} exclude
     */

    /**
     * @typedef {object} IPhoneNumberFilterOptions
     * @property {string} paymentType
     * @property {string} usageType
     * @property {string} type
     * @property {string[]} features
     */

    /**
     * @typedef {object} IPhoneNumberOrder
     * @property {IPhoneNumber[]} records
     */

}.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ },
/* 39 */
/***/ function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_RESULT__ = function(require, exports, module) {

    'use strict';

    var Helper = __webpack_require__(15).Class,
        Utils = __webpack_require__(19);

    /**
     * @extends Helper
     * @constructor
     */
    function PresenceHelper(context) {
        Helper.call(this, context);
        this.extension = __webpack_require__(35).$get(context);
    }

    PresenceHelper.prototype = Object.create(Helper.prototype);

    /**
     * @param {IPresenceOptions} [options]
     * @param {string} [id]
     * @returns {string}
     */
    PresenceHelper.prototype.createUrl = function(options, id) {

        options = options || {};

        return '/account/~/extension/' + (id || '~') + '/presence' + (options.detailed ? '?detailedTelephonyState=true' : '');

    };

    /**
     * @param {IPresence} presence
     * @returns {string}
     */
    PresenceHelper.prototype.getId = function(presence) {
        return presence && (this.extension.getId(presence.extension) || presence.extensionId);
    };

    /**
     * @param {IPresence} presence
     * @returns {boolean}
     */
    PresenceHelper.prototype.isAvailable = function(presence) {
        return presence && presence.presenceStatus == 'Available';
    };

    /**
     * @param {IPresenceOptions} [options]
     * @param {string} [id]
     * @returns {Subscription}
     */
    PresenceHelper.prototype.getSubscription = function(options, id) {

        return __webpack_require__(13).$get(this.context).setEvents([this.createUrl(options, id)]);

    };

    /**
     *
     * @param {Subscription} subscription
     * @param {IPresence[]} presences
     * @param {IPresenceOptions} options
     * @returns {*}
     */
    PresenceHelper.prototype.updateSubscription = function(subscription, presences, options) {

        var events = presences.map(this.getId, this).map(function(id) {
            return this.createUrl(options, id);
        }, this);

        subscription.addEvents(events);

        return subscription;

    };

    /**
     * @param {IExtension[]} extensions
     * @param {IPresence[]} presences
     * @param {bool} [merge]
     * @returns {*}
     */
    PresenceHelper.prototype.attachToExtensions = function(extensions, presences, merge) {

        var index = this.index(presences);

        extensions.forEach(/** @param {IExtension} extension */ function(extension) {

            var presence = index[this.extension.getId(extension)];

            if (presence) {
                if ('presence' in extension && merge) {
                    Utils.extend(extension.presence, presence);
                } else {
                    extension.presence = presence;
                }
            }

        }, this);

    };

    /**
     * @param {IPresenceCall} presenceCall
     * @returns {boolean}
     */
    PresenceHelper.prototype.isCallInProgress = function(presenceCall) {
        return (presenceCall && presenceCall.telephonyStatus != 'NoCall');
    };

    module.exports = {
        Class: PresenceHelper,
        /**
         * @param {Context} context
         * @returns {PresenceHelper}
         */
        $get: function(context) {

            return context.createSingleton('PresenceHelper', function() {
                return new PresenceHelper(context);
            });

        }
    };

    /**
     * @typedef {Object} IPresence
     * @property {IExtension} extension
     * @property {IPresenceCall[]} activeCalls
     * @property {string} presenceStatus - Offline, Busy, Available
     * @property {string} telephonyStatus - NoCall, CallConnected, Ringing, OnHold
     * @property {string} userStatus - Offline, Busy, Available
     * @property {string} dndStatus - TakeAllCalls, DoNotAcceptAnyCalls, DoNotAcceptDepartmentCalls, TakeDepartmentCallsOnly
     * @property {boolean} allowSeeMyPresence
     * @property {boolean} ringOnMonitoredCall
     * @property {boolean} pickUpCallsOnHold
     * @property {number} extensionId
     * @property {number} sequence
     */

    /**
     * @typedef {Object} IPresenceCall
     * @property {string} direction
     * @property {string} from
     * @property {string} to
     * @property {string} sessionId
     * @property {string} id
     * @property {string} telephonyStatus
     */

    /**
     * @typedef {Object} IPresenceOptions
     * @property {boolean} detailed
     */

}.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ },
/* 40 */
/***/ function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_RESULT__ = function(require, exports, module) {

    'use strict';

    var Helper = __webpack_require__(15).Class,
        Validator = __webpack_require__(17);

    /**
     * @extends Helper
     * @constructor
     */
    function RingoutHelper(context) {
        Helper.call(this, context);
        this.extension = __webpack_require__(35).$get(context);
    }

    RingoutHelper.prototype = Object.create(Helper.prototype);

    RingoutHelper.prototype.createUrl = function(options, id) {

        options = options || {};

        return '/account/~/extension/' + (options.extensionId || '~') + '/ringout' + (id ? '/' + id : '');

    };

    RingoutHelper.prototype.resetAsNew = function(object) {
        object = Helper.prototype.resetAsNew.call(this, object);
        if (object) {
            delete object.status;
        }
        return object;
    };

    RingoutHelper.prototype.isInProgress = function(ringout) {
        return ringout && !this.isNew(ringout) && ringout.status && ringout.status.callStatus == 'InProgress';
    };

    RingoutHelper.prototype.isSuccess = function(ringout) {
        return ringout && !this.isNew(ringout) && ringout.status && ringout.status.callStatus == 'Success';
    };

    RingoutHelper.prototype.isError = function(ringout) {
        return !this.isNew(ringout) && !this.isInProgress(ringout) && !this.isSuccess(ringout);
    };

    /**
     * @param {IRingout} item
     */
    RingoutHelper.prototype.validate = function(item) {

        return Validator.validate([
            {field: 'to', validator: Validator.required(item && item.to && item.to.phoneNumber)},
            {field: 'from', validator: Validator.required(item && item.from && item.from.phoneNumber)}
        ]);

    };

    module.exports = {
        Class: RingoutHelper,
        /**
         * @param {Context} context
         * @returns {RingoutHelper}
         */
        $get: function(context) {

            return context.createSingleton('RingoutHelper', function() {
                return new RingoutHelper(context);
            });

        }
    };

    /**
     * @typedef {object} IRingout
     * @property {ICallerInfo} [from] (!) ONLY PHONE NUMBER
     * @property {ICallerInfo} [to] (!) ONLY PHONE NUMBER
     * @property {ICallerInfo} [callerId] (!) ONLY PHONE NUMBER
     * @property {boolean} [playPrompt]
     * @property {{callStatus:boolean, callerStatus:boolean, calleeStatus:boolean}} [status]
     */

}.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ },
/* 41 */
/***/ function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_RESULT__ = function(require, exports, module) {

    'use strict';

    var Helper = __webpack_require__(15).Class;

    /**
     * @extends Helper
     * @constructor
     */
    function ServiceHelper(context) {
        Helper.call(this, context);
    }

    ServiceHelper.prototype = Object.create(Helper.prototype);

    ServiceHelper.prototype.createUrl = function() {
        return '/account/~/service-info';
    };

    /**
     * @param {string} feature
     * @param {IServiceFeature[]} serviceFeatures
     * @returns {*}
     */
    ServiceHelper.prototype.isEnabled = function(feature, serviceFeatures) {

        return serviceFeatures.reduce(function(value, f) {

            if (f.featureName == feature) value = f.enabled;
            return value;

        }, false);

    };

    function isServiceFeatureEnabledMethod(feature) {
        return function(serviceFeatures) {
            return this.isEnabled(feature, serviceFeatures);
        };
    }

    ServiceHelper.prototype.isSmsEnabled = isServiceFeatureEnabledMethod('SMS');
    ServiceHelper.prototype.isSmsReceivingEnabled = isServiceFeatureEnabledMethod('SMSReceiving');
    ServiceHelper.prototype.isPresenceEnabled = isServiceFeatureEnabledMethod('Presence');
    ServiceHelper.prototype.isRingOutEnabled = isServiceFeatureEnabledMethod('RingOut');
    ServiceHelper.prototype.isInternationalCallingEnabled = isServiceFeatureEnabledMethod('InternationalCalling');
    ServiceHelper.prototype.isDndEnabled = isServiceFeatureEnabledMethod('DND');
    ServiceHelper.prototype.isFaxEnabled = isServiceFeatureEnabledMethod('Fax');
    ServiceHelper.prototype.isFaxReceivingEnabled = isServiceFeatureEnabledMethod('FaxReceiving');
    ServiceHelper.prototype.isVoicemailEnabled = isServiceFeatureEnabledMethod('Voicemail');
    ServiceHelper.prototype.isPagerEnabled = isServiceFeatureEnabledMethod('Pager');
    ServiceHelper.prototype.isPagerReceivingEnabled = isServiceFeatureEnabledMethod('PagerReceiving');
    ServiceHelper.prototype.isVoipCallingEnabled = isServiceFeatureEnabledMethod('VoipCalling');
    ServiceHelper.prototype.isVideoConferencingEnabled = isServiceFeatureEnabledMethod('VideoConferencing');
    ServiceHelper.prototype.isSalesForceEnabled = isServiceFeatureEnabledMethod('SalesForce');
    ServiceHelper.prototype.isIntercomEnabled = isServiceFeatureEnabledMethod('Intercom');
    ServiceHelper.prototype.isPagingEnabled = isServiceFeatureEnabledMethod('Paging');
    ServiceHelper.prototype.isConferencingEnabled = isServiceFeatureEnabledMethod('Conferencing');
    ServiceHelper.prototype.isFreeSoftPhoneLinesEnabled = isServiceFeatureEnabledMethod('FreeSoftPhoneLines');
    ServiceHelper.prototype.isHipaaComplianceEnabled = isServiceFeatureEnabledMethod('HipaaCompliance');
    ServiceHelper.prototype.isCallParkEnabled = isServiceFeatureEnabledMethod('CallPark');
    ServiceHelper.prototype.isOnDemandCallRecordingEnabled = isServiceFeatureEnabledMethod('OnDemandCallRecording');

    module.exports = {
        Class: ServiceHelper,
        /**
         * @param {Context} context
         * @returns {ServiceHelper}
         */
        $get: function(context) {

            return context.createSingleton('serviceHelper', function() {
                return new ServiceHelper(context);
            });

        }
    };

    /**
     * @typedef {object} IServiceFeature
     * @property {string} featureName
     * @property {boolean} enabled
     */

    /**
     * @typedef {object} IService
     * @property {IServiceFeature[]} serviceFeatures
     * @property {string} servicePlanName
     */

}.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ },
/* 42 */
/***/ function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_RESULT__ = function(require, exports, module) {

    'use strict';

    function PubnubMock(options) {}

    PubnubMock.prototype.ready = function() {};

    PubnubMock.prototype.unsubscribe = function(options) {};

    PubnubMock.prototype.subscribe = function(options) {
        this.onMessage = options.message;
    };

    PubnubMock.prototype.receiveMessage = function(msg) {
        this.onMessage(msg, 'env', 'channel');
    };

    /**
     * @alias RCSDK.core.pubnub.Mock
     * @type {PUBNUB}
     */
    module.exports = {
        /**
         * @param {Context} context
         * @returns {PUBNUB}
         */
        $get: function(context) {

            return {
                init: function(options) {
                    return new PubnubMock(options);
                }
            };

        }
    };

}.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ },
/* 43 */
/***/ function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_RESULT__;/**
 * istanbul ignore next
 */
!(__WEBPACK_AMD_DEFINE_RESULT__ = function(require, exports, module) {

    'use strict';

    var Log = __webpack_require__(18),
        Utils = __webpack_require__(19);

    /**
     * @constructor
     * @alias RCSDK.core.ajax.XhrMock
     * @extends XMLHttpRequest
     */
    function XhrMock(context) {
        // Service
        this.responses = __webpack_require__(10).$get(context);
        // Request
        this.async = true;
        this.method = '';
        this.url = '';
        this.requestHeaders = {};
        this.withCredentials = false;
        // Response
        this.data = null;
        this.readyState = 0;
        this.responseHeaders = {};
        this.status = 0;
        this.context = context;
    }

    XhrMock.prototype.getResponseHeader = function(header) {
        return this.responseHeaders[header.toLowerCase()];
    };

    XhrMock.prototype.setRequestHeader = function(header, value) {
        this.requestHeaders[header.toLowerCase()] = value;
    };

    XhrMock.prototype.getAllResponseHeaders = function() {
        var res = [];
        Utils.forEach(this.responseHeaders, function(value, name) {
            res.push(name + ':' + value);
        });
        return res.join('\n');
    };

    XhrMock.prototype.open = function(method, url, async) {
        this.method = method;
        this.url = url;
        this.async = async;
    };

    XhrMock.prototype.send = function(data) {

        var contentType = this.getRequestHeader('Content-Type');

        this.data = data;

        if (this.data && typeof this.data == 'string') {
            // For convenience encoded post data will be decoded
            if (contentType == 'application/json') this.data = JSON.parse(this.data);
            if (contentType == 'application/x-www-form-urlencoded') this.data = Utils.parseQueryString(this.data);
        }

        Log.debug('API REQUEST', this.method, this.url);

        var currentResponse = this.responses.find(this);

        if (!currentResponse) {
            setTimeout(function() {
                if (this.onerror) this.onerror(new Error('Unknown request: ' + this.url));
            }.bind(this), 1);
            return;
        }

        this.setStatus(200);
        this.setResponseHeader('Content-Type', 'application/json');

        var res = currentResponse.response(this),
            Promise = this.context.getPromise(),
            onLoad = function(res) {

                if (this.getResponseHeader('Content-Type') == 'application/json') res = JSON.stringify(res);

                this.responseText = res;

                setTimeout(function() {
                    if (this.onload) this.onload();
                }.bind(this), 1);

            }.bind(this);

        if (res instanceof Promise) {

            res.then(onLoad.bind(this)).catch(this.onerror.bind(this));

        } else onLoad(res);

    };

    XhrMock.prototype.abort = function() {
        Log.debug('XhrMock.destroy(): Aborted');
    };

    XhrMock.prototype.getRequestHeader = function(header) {
        return this.requestHeaders[header.toLowerCase()];
    };

    XhrMock.prototype.setResponseHeader = function(header, value) {
        this.responseHeaders[header.toLowerCase()] = value;
    };

    XhrMock.prototype.setStatus = function(status) {
        this.status = status;
        return this;
    };

    module.exports = {
        Class: XhrMock,
        /**
         * @static
         * @param {Context} context
         * @returns {XhrMock}
         */
        $get: function(context) {

            return new XhrMock(context);

        }
    };

}.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ },
/* 44 */
/***/ function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_RESULT__ = function(require, exports, module) {

    'use strict';

    var Utils = __webpack_require__(19);

    /**
     * @constructor
     * @alias RCSDK.core.Headers
     */
    function Headers() {
        /** @private */
        this.headers = {};
    }

    Object.defineProperty(Headers.prototype, 'constructor', {value: Headers, enumerable: false});

    Headers.contentType = 'Content-Type';
    Headers.jsonContentType = 'application/json';
    Headers.multipartContentType = 'multipart/mixed';
    Headers.urlencodedContentType = 'application/x-www-form-urlencoded';

    /**
     * @param {string} name
     * @param {string} value
     * @returns {Headers}
     */
    Headers.prototype.setHeader = function(name, value) {

        this.headers[name.toLowerCase()] = value;

        return this;

    };

    /**
     * @param {string} name
     * @returns {string}
     */
    Headers.prototype.getHeader = function(name) {

        return this.headers[name.toLowerCase()];

    };

    /**
     * @param {string} name
     * @returns {boolean}
     */
    Headers.prototype.hasHeader = function(name) {

        return (name.toLowerCase() in this.headers);

    };

    /**
     * @param {object} headers
     * @returns {Headers}
     */
    Headers.prototype.setHeaders = function(headers) {

        Utils.forEach(headers, function(value, name) {
            this.setHeader(name, value);
        }.bind(this));

        return this;

    };

    /**
     * @param {string} type
     * @returns {boolean}
     */
    Headers.prototype.isContentType = function(type) {
        return this.getContentType().indexOf(type) > -1;
    };

    /**
     * @returns {string}
     */
    Headers.prototype.getContentType = function() {
        return this.getHeader(Headers.contentType) || '';
    };

    /**
     * @returns {boolean}
     */
    Headers.prototype.isMultipart = function() {
        return this.isContentType(Headers.multipartContentType);
    };

    /**
     * @returns {boolean}
     */
    Headers.prototype.isUrlEncoded = function() {
        return this.isContentType(Headers.urlencodedContentType);
    };

    /**
     * @returns {boolean}
     */
    Headers.prototype.isJson = function() {
        return this.isContentType(Headers.jsonContentType);
    };

    module.exports = {
        Class: Headers
    };

}.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }
/******/ ])
});
;
//# sourceMappingURL=rc-sdk.js.map