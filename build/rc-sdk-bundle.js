(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory((function webpackLoadOptionalExternalModule() { try { return require("xhr2"); } catch(e) {} }()), require("dom-storage"));
	else if(typeof define === 'function' && define.amd)
		define(["exports", "exports"], factory);
	else if(typeof exports === 'object')
		exports["RCSDK"] = factory((function webpackLoadOptionalExternalModule() { try { return require("xhr2"); } catch(e) {} }()), require("dom-storage"));
	else
		root["RCSDK"] = factory(root["XMLHttpRequest"], root["localStorage"]);
})(this, function(__WEBPACK_EXTERNAL_MODULE_1__, __WEBPACK_EXTERNAL_MODULE_2__) {
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

/// <reference path="../typings/externals.d.ts" />
var pubnubMock = __webpack_require__(3);
var xhrMock = __webpack_require__(4);
var xhrResponse = __webpack_require__(5);
var ajaxObserver = __webpack_require__(6);
var cache = __webpack_require__(7);
var context = __webpack_require__(8);
var helper = __webpack_require__(9);
var list = __webpack_require__(10);
var log = __webpack_require__(11);
var observable = __webpack_require__(12);
var pageVisibility = __webpack_require__(13);
var platform = __webpack_require__(14);
var subscription = __webpack_require__(15);
var utils = __webpack_require__(16);
var validator = __webpack_require__(17);
var accountHelper = __webpack_require__(18);
var blockedNumberHelper = __webpack_require__(19);
var callHelper = __webpack_require__(20);
var contactHelper = __webpack_require__(21);
var contactGroupHelper = __webpack_require__(22);
var conferencingHelper = __webpack_require__(23);
var countryHelper = __webpack_require__(24);
var deviceHelper = __webpack_require__(25);
var deviceModelHelper = __webpack_require__(26);
var extensionHelper = __webpack_require__(27);
var forwardingNumberHelper = __webpack_require__(28);
var languageHelper = __webpack_require__(29);
var locationHelper = __webpack_require__(30);
var messageHelper = __webpack_require__(31);
var phoneNumberHelper = __webpack_require__(32);
var presenceHelper = __webpack_require__(33);
var ringoutHelper = __webpack_require__(34);
var serviceHelper = __webpack_require__(35);
var shippingMethodHelper = __webpack_require__(36);
var stateHelper = __webpack_require__(37);
var timezoneHelper = __webpack_require__(38);
var promise = __webpack_require__(43);
var pubnub = __webpack_require__(39);
__webpack_require__(40);
__webpack_require__(41);
var RCSDK = (function () {
    function RCSDK(options) {
        options = options || {};
        this._context = context.$get(RCSDK.injections);
        this.getCache().setPrefix(options.cachePrefix || '');
        this.getPlatform().setServer(options.server || '').setCredentials(options.appKey || '', options.appSecret || '');
        //TODO Link Platform events with Subscriptions and the rest
    }
    // Internals
    RCSDK.prototype.getContext = function () {
        return this._context;
    };
    // Core
    RCSDK.prototype.getAjaxObserver = function () {
        return ajaxObserver.$get(this.getContext());
    };
    RCSDK.prototype.getXhrResponse = function () {
        return xhrResponse.$get(this.getContext());
    };
    RCSDK.prototype.getPlatform = function () {
        return platform.$get(this.getContext());
    };
    RCSDK.prototype.getCache = function () {
        return cache.$get(this.getContext());
    };
    RCSDK.prototype.getSubscription = function () {
        return subscription.$get(this.getContext());
    };
    RCSDK.prototype.getPageVisibility = function () {
        return pageVisibility.$get(this.getContext());
    };
    RCSDK.prototype.getHelper = function () {
        return helper.$get(this.getContext());
    };
    RCSDK.prototype.getObservable = function () {
        return observable.$get(this.getContext());
    };
    RCSDK.prototype.getValidator = function () {
        return validator.$get(this.getContext());
    };
    RCSDK.prototype.getLog = function () {
        return log.$get(this.getContext());
    };
    RCSDK.prototype.getUtils = function () {
        return utils.$get(this.getContext());
    };
    RCSDK.prototype.getList = function () {
        return list.$get(this.getContext());
    };
    // Helpers
    RCSDK.prototype.getCountryHelper = function () {
        return countryHelper.$get(this.getContext());
    };
    RCSDK.prototype.getDeviceModelHelper = function () {
        return deviceModelHelper.$get(this.getContext());
    };
    RCSDK.prototype.getLanguageHelper = function () {
        return languageHelper.$get(this.getContext());
    };
    RCSDK.prototype.getLocationHelper = function () {
        return locationHelper.$get(this.getContext());
    };
    RCSDK.prototype.getShippingMethodHelper = function () {
        return shippingMethodHelper.$get(this.getContext());
    };
    RCSDK.prototype.getStateHelper = function () {
        return stateHelper.$get(this.getContext());
    };
    RCSDK.prototype.getTimezoneHelper = function () {
        return timezoneHelper.$get(this.getContext());
    };
    RCSDK.prototype.getAccountHelper = function () {
        return accountHelper.$get(this.getContext());
    };
    RCSDK.prototype.getBlockedNumberHelper = function () {
        return blockedNumberHelper.$get(this.getContext());
    };
    RCSDK.prototype.getCallHelper = function () {
        return callHelper.$get(this.getContext());
    };
    RCSDK.prototype.getConferencingHelper = function () {
        return conferencingHelper.$get(this.getContext());
    };
    RCSDK.prototype.getContactHelper = function () {
        return contactHelper.$get(this.getContext());
    };
    RCSDK.prototype.getContactGroupHelper = function () {
        return contactGroupHelper.$get(this.getContext());
    };
    RCSDK.prototype.getDeviceHelper = function () {
        return deviceHelper.$get(this.getContext());
    };
    RCSDK.prototype.getExtensionHelper = function () {
        return extensionHelper.$get(this.getContext());
    };
    RCSDK.prototype.getForwardingNumberHelper = function () {
        return forwardingNumberHelper.$get(this.getContext());
    };
    RCSDK.prototype.getMessageHelper = function () {
        return messageHelper.$get(this.getContext());
    };
    RCSDK.prototype.getPhoneNumberHelper = function () {
        return phoneNumberHelper.$get(this.getContext());
    };
    RCSDK.prototype.getPresenceHelper = function () {
        return presenceHelper.$get(this.getContext());
    };
    RCSDK.prototype.getRingoutHelper = function () {
        return ringoutHelper.$get(this.getContext());
    };
    RCSDK.prototype.getServiceHelper = function () {
        return serviceHelper.$get(this.getContext());
    };
    RCSDK.version = '1.3.0';
    RCSDK.CryptoJS = __webpack_require__(42);
    RCSDK.XHR = function () {
        try {
            return new XMLHttpRequest();
        }
        catch (e) {
        }
        try {
            return new ActiveXObject("Msxml2.XMLHTTP.6.0");
        }
        catch (e1) {
        }
        try {
            return new ActiveXObject("Msxml2.XMLHTTP.3.0");
        }
        catch (e2) {
        }
        try {
            return new ActiveXObject("Msxml2.XMLHTTP");
        }
        catch (e3) {
        }
        try {
            return new (__webpack_require__(1))();
        }
        catch (e4) {
        }
        throw new Error("This browser does not support XMLHttpRequest.");
    };
    RCSDK.injections = {
        CryptoJS: RCSDK.CryptoJS,
        localStorage: (typeof (localStorage) !== 'undefined' ? localStorage : __webpack_require__(2)),
        Promise: typeof (Promise) !== 'undefined' ? Promise : promise.Promise,
        PUBNUB: pubnub,
        XHR: RCSDK.XHR,
        pubnubMock: pubnubMock,
        xhrMock: xhrMock
    };
    return RCSDK;
})();
module.exports = RCSDK;


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

if(typeof __WEBPACK_EXTERNAL_MODULE_1__ === 'undefined') {var e = new Error("Cannot find module \"undefined\""); e.code = 'MODULE_NOT_FOUND'; throw e;}
module.exports = __WEBPACK_EXTERNAL_MODULE_1__;

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

module.exports = __WEBPACK_EXTERNAL_MODULE_2__;

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

/// <reference path="../../../typings/externals.d.ts" />
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var observable = __webpack_require__(12);
var PubnubMock = (function (_super) {
    __extends(PubnubMock, _super);
    function PubnubMock(context, options) {
        this.options = options;
        _super.call(this, context);
    }
    PubnubMock.prototype.ready = function () {
    };
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
})(observable.Observable);
exports.PubnubMock = PubnubMock;
var PubnubFactory = (function () {
    function PubnubFactory(context) {
        this.context = context;
    }
    PubnubFactory.prototype.init = function (options) {
        return new PubnubMock(this.context, options);
    };
    return PubnubFactory;
})();
exports.PubnubFactory = PubnubFactory;
function $get(context) {
    return new PubnubFactory(context);
}
exports.$get = $get;


/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

var utils = __webpack_require__(16);
var log = __webpack_require__(11);
var xhrResponse = __webpack_require__(5); //FIXME Circular
var XhrMock = (function () {
    function XhrMock(context) {
        // Service
        this.context = context;
        this.responses = xhrResponse.$get(context);
        this.log = log.$get(context);
        this.utils = utils.$get(context);
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
    }
    XhrMock.prototype.getResponseHeader = function (header) {
        return this.responseHeaders[header.toLowerCase()];
    };
    XhrMock.prototype.setRequestHeader = function (header, value) {
        this.requestHeaders[header.toLowerCase()] = value;
    };
    XhrMock.prototype.getAllResponseHeaders = function () {
        var res = [];
        this.utils.forEach(this.responseHeaders, function (value, name) {
            res.push(name + ':' + value);
        });
        return res.join('\n');
    };
    XhrMock.prototype.open = function (method, url, async) {
        this.method = method;
        this.url = url;
        this.async = async;
    };
    XhrMock.prototype.send = function (data) {
        var _this = this;
        var contentType = this.getRequestHeader('Content-Type');
        this.data = data;
        if (this.data && typeof this.data == 'string') {
            // For convenience encoded post data will be decoded
            if (contentType == 'application/json')
                this.data = JSON.parse(this.data);
            if (contentType == 'application/x-www-form-urlencoded')
                this.data = this.utils.parseQueryString(this.data);
        }
        this.log.debug('API REQUEST', this.method, this.url);
        var currentResponse = this.responses.find(this);
        if (!currentResponse) {
            setTimeout(function () {
                if (_this.onerror)
                    _this.onerror(new Error('Unknown request: ' + _this.url));
            }, 1);
            return;
        }
        this.setStatus(200);
        this.setResponseHeader('Content-Type', 'application/json');
        var res = currentResponse.response(this), Promise = this.context.getPromise(), onLoad = function (res) {
            if (_this.getResponseHeader('Content-Type') == 'application/json')
                res = JSON.stringify(res);
            _this.responseText = res;
            setTimeout(function () {
                if (_this.onload)
                    _this.onload();
            }, 1);
        };
        if (res instanceof Promise) {
            res.then(onLoad.bind(this)).catch(this.onerror.bind(this));
        }
        else
            onLoad(res);
    };
    XhrMock.prototype.abort = function () {
        this.log.debug('XhrMock.destroy(): Aborted');
    };
    XhrMock.prototype.getRequestHeader = function (header) {
        return this.requestHeaders[header.toLowerCase()];
    };
    XhrMock.prototype.setResponseHeader = function (header, value) {
        this.responseHeaders[header.toLowerCase()] = value;
    };
    XhrMock.prototype.setStatus = function (status) {
        this.status = status;
        return this;
    };
    return XhrMock;
})();
exports.XhrMock = XhrMock;
function $get(context) {
    return new XhrMock(context);
}
exports.$get = $get;


/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

var XhrResponse = (function () {
    function XhrResponse(context) {
        this.responses = [];
    }
    XhrResponse.prototype.add = function (response) {
        this.responses.push(response);
    };
    XhrResponse.prototype.clear = function () {
        this.responses = [];
    };
    XhrResponse.prototype.find = function (ajax) {
        var currentResponse = null;
        this.responses.forEach(function (response) {
            if (ajax.url.indexOf(response.path) > -1 && (!response.test || response.test(ajax))) {
                currentResponse = response;
            }
        });
        return currentResponse;
    };
    return XhrResponse;
})();
exports.XhrResponse = XhrResponse;
function $get(context) {
    return context.createSingleton('XhrResponse', function () {
        return new XhrResponse(context);
    });
}
exports.$get = $get;


/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

/// <reference path="../../typings/externals.d.ts" />
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var observable = __webpack_require__(12);
var AjaxObserver = (function (_super) {
    __extends(AjaxObserver, _super);
    function AjaxObserver() {
        _super.apply(this, arguments);
        this.events = {
            beforeRequest: 'beforeRequest',
            requestSuccess: 'requestSuccess',
            requestError: 'requestError' // means that request failed completely
        };
    }
    return AjaxObserver;
})(observable.Observable);
exports.AjaxObserver = AjaxObserver;
function $get(context) {
    return context.createSingleton('AjaxObserver', function () {
        return new AjaxObserver(context);
    });
}
exports.$get = $get;


/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

/// <reference path="../../typings/externals.d.ts" />
var Cache = (function () {
    function Cache(context) {
        this.setPrefix();
        this.context = context;
        this.storage = context.getLocalStorage(); // storage must be defined from outside
    }
    Cache.prototype.setPrefix = function (prefix) {
        this.prefix = prefix || 'rc-';
        return this;
    };
    Cache.prototype.prefixKey = function (key) {
        return this.prefix + key;
    };
    Cache.prototype.setItem = function (key, data) {
        this.storage.setItem(this.prefixKey(key), JSON.stringify(data));
        return this;
    };
    Cache.prototype.removeItem = function (key) {
        this.storage.removeItem(this.prefixKey(key));
        return this;
    };
    Cache.prototype.getItem = function (key) {
        var item = this.storage.getItem(this.prefixKey(key));
        if (!item)
            return null;
        return JSON.parse(item);
    };
    Cache.prototype.clean = function () {
        for (var key in this.storage) {
            if (!this.storage.hasOwnProperty(key))
                continue;
            if (key.indexOf(this.prefix) === 0) {
                this.storage.removeItem(key);
                delete this.storage[key];
            }
        }
        return this;
    };
    return Cache;
})();
exports.Cache = Cache;
function $get(context) {
    return context.createSingleton('Cache', function () {
        return new Cache(context);
    });
}
exports.$get = $get;


/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

/// <reference path="../../typings/externals.d.ts" />
var Context = (function () {
    function Context(injections) {
        this.singletons = {};
        this.injections = injections;
        this.stubPubnub = false;
        this.stubAjax = false;
    }
    Context.prototype.createSingleton = function (name, factory) {
        if (!this.singletons[name])
            this.singletons[name] = factory();
        return this.singletons[name];
    };
    Context.prototype.usePubnubStub = function (flag) {
        this.stubPubnub = !!flag;
        return this;
    };
    Context.prototype.useAjaxStub = function (flag) {
        this.stubAjax = !!flag;
        return this;
    };
    Context.prototype.getCryptoJS = function () {
        return this.injections.CryptoJS;
    };
    Context.prototype.getPubnub = function () {
        return this.stubPubnub ? this.injections.pubnubMock.$get(this) : this.injections.PUBNUB;
    };
    Context.prototype.getLocalStorage = function () {
        var _this = this;
        return this.createSingleton('localStorage', function () {
            if (typeof _this.injections.localStorage !== 'function') {
                return _this.injections.localStorage; // this is window.localStorage
            }
            return new _this.injections.localStorage(); // this is NPM dom-storage constructor
        });
    };
    Context.prototype.getPromise = function () {
        return this.injections.Promise;
    };
    Context.prototype.getXHR = function () {
        return (this.stubAjax ? this.injections.xhrMock.$get(this) : this.injections.XHR());
    };
    return Context;
})();
exports.Context = Context;
function $get(injections) {
    return new Context(injections);
}
exports.$get = $get;


/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

/// <reference path="../../typings/externals.d.ts" />
var utils = __webpack_require__(16);
var Helper = (function () {
    function Helper(context) {
        this.defaultProperty = 'id';
        this.context = context;
        this.utils = utils.$get(context);
    }
    Helper.prototype.getContext = function () {
        return this.context;
    };
    Helper.prototype.createUrl = function (options, id) {
        return '';
    };
    Helper.prototype.getId = function (object) {
        return object && object[this.defaultProperty];
    };
    Helper.prototype.isNew = function (object) {
        return !this.getId(object) || !this.getUri(object);
    };
    Helper.prototype.resetAsNew = function (object) {
        if (object) {
            delete object.id;
            delete object.uri;
        }
        return object;
    };
    Helper.prototype.getUri = function (object) {
        return object && object.uri;
    };
    Helper.prototype.parseMultipartResponse = function (ajax) {
        if (ajax.isMultipart()) {
            // ajax.data has full array, leave only successful
            return ajax.data.filter(function (result) {
                return (!result.error);
            }).map(function (result) {
                return result.data;
            });
        }
        else {
            return [ajax.data];
        }
    };
    /**
     * Options have higher priority, if object.url and options.url were provided, options.url will be returned
     * If no URL was provided, default will be returned
     */
    Helper.prototype.loadRequest = function (object, options) {
        return this.utils.extend(options || {}, {
            url: (options && options.url) || (object && this.getUri(object)) || this.createUrl(),
            method: (options && options.method) || 'GET'
        });
    };
    /**
     * Options have higher priority, if object.url and options.url were provided, options.url will be returned
     * If no URL was provided, default will be returned
     */
    Helper.prototype.saveRequest = function (object, options) {
        if (!object && !(options && (options.post || options.body)))
            throw new Error('No Object');
        return this.utils.extend(options || {}, {
            method: (options && options.method) || (this.isNew(object) ? 'POST' : 'PUT'),
            url: (options && options.url) || this.getUri(object) || this.createUrl(),
            body: (options && (options.body || options.post)) || object
        });
    };
    /**
     * Options have higher priority, if object.url and options.url were provided, options.url will be returned
     * If no URL was provided exception will be thrown
     */
    Helper.prototype.deleteRequest = function (object, options) {
        options = options || {};
        if (!this.getUri(object) && !(options && options.url))
            throw new Error('Object has to be not new or URL must be provided');
        return this.utils.extend(options || {}, {
            method: (options && options.method) || 'DELETE',
            url: (options && options.url) || this.getUri(object)
        });
    };
    /**
     * If no url was provided, default SYNC url will be returned
     */
    Helper.prototype.syncRequest = function (options) {
        options = options || {};
        options.url = options.url || this.createUrl({ sync: true });
        options.query = options.query || options.get || {};
        if (!!options.query.syncToken) {
            options.query = {
                syncType: 'ISync',
                syncToken: options.get.syncToken
            };
        }
        else {
            options.query.syncType = 'FSync';
        }
        return options;
    };
    Helper.prototype.nextPageExists = function (data) {
        return (data && data.navigation && ('nextPage' in data.navigation));
    };
    /**
     * array - an array to be indexed
     * getIdFn - must return an ID for each array item
     * gather - if true, then each index will have an array of items, that has same ID, otherwise the first indexed
     * item wins
     */
    Helper.prototype.index = function (array, getIdFn, gather) {
        getIdFn = getIdFn || this.getId.bind(this);
        array = array || [];
        return array.reduce(function (index, item) {
            var id = getIdFn(item);
            if (!id || (index[id] && !gather))
                return index;
            if (gather) {
                if (!index[id])
                    index[id] = [];
                index[id].push(item);
            }
            else {
                index[id] = item;
            }
            return index;
        }, {});
    };
    /**
     * Returns a shallow copy of merged _target_ array plus _supplement_ array
     * mergeItems
     * - if true, properties of _supplement_ item will be applied to _target_ item,
     * - otherwise _target_ item will be replaced
     */
    Helper.prototype.merge = function (target, supplement, getIdFn, mergeItems) {
        var _this = this;
        getIdFn = getIdFn || this.getId.bind(this);
        target = target || [];
        supplement = supplement || [];
        var supplementIndex = this.index(supplement, getIdFn), updatedIDs = [], result = target.map(function (item) {
            var id = getIdFn(item), newItem = supplementIndex[id];
            if (newItem)
                updatedIDs.push(id);
            return newItem ? (mergeItems ? _this.utils.extend(item, newItem) : newItem) : item;
        });
        supplement.forEach(function (item) {
            if (updatedIDs.indexOf(getIdFn(item)) == -1)
                result.push(item);
        });
        return result;
    };
    return Helper;
})();
exports.Helper = Helper;
function $get(context) {
    return new Helper(context);
}
exports.$get = $get;


/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

/// <reference path="../../typings/externals.d.ts" />
var utils = __webpack_require__(16);
var List = (function () {
    function List(context) {
        this.context = context;
        this.utils = utils.$get(context);
        this.numberComparator = this.numberComparator.bind(this);
        this.stringComparator = this.stringComparator.bind(this);
    }
    /**
     * TODO Use utils getProperty
     * @param {string} property
     * @returns {function(object)}
     */
    List.prototype.propertyExtractor = function (property) {
        return function (item, options) {
            return property ? ((item && item[property]) || null) : item;
        };
    };
    /**
     * Non-string types are converted to string
     * Non-string types are extracted as an empty string if they could be converted to false
     * If no options.sortBy given the item itself is extracted
     * Compares strings:
     * - if (a is less than b) return -1;
     * - if (a is greater than b) return 1;
     * - else (a must be equal to b) return 0;
     * Exceptions in will be suppressed, if any - a is assumed to be less than b
     */
    List.prototype.stringComparator = function (a, b, options) {
        return this.utils.parseString(a).localeCompare(this.utils.parseString(b));
    };
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
     */
    List.prototype.numberComparator = function (a, b, options) {
        return (this.utils.parseNumber(a) - this.utils.parseNumber(b));
    };
    /**
     * Function extracts (using _extractFn_ option) values of a property (_sortBy_ option) and compares them using
     * compare function (_compareFn_ option, by default Helper.stringComparator)
     * Merged options are provided to _extractFn_ and _compareFn_
     * TODO Check memory leaks for all that options links
     */
    List.prototype.comparator = function (options) {
        options = this.utils.extend({
            extractFn: this.propertyExtractor((options && options.sortBy) || null).bind(this),
            compareFn: this.stringComparator.bind(this)
        }, options);
        return function (item1, item2) {
            return options.compareFn(options.extractFn(item1, options), options.extractFn(item2, options), options);
        };
    };
    List.prototype.equalsFilter = function (obj, options) {
        return (options.condition === obj);
    };
    /**
     * @param {string} obj
     * @param {IListFilterOptions} options
     * @returns {boolean}
     */
    List.prototype.containsFilter = function (obj, options) {
        return (obj && obj.toString().indexOf(options.condition) > -1);
    };
    List.prototype.regexpFilter = function (obj, options) {
        if (!(options.condition instanceof RegExp))
            throw new Error('Condition must be an instance of RegExp');
        return (options.condition.test(obj));
    };
    /**
     * Function extracts (using `extractFn` option) values of a property (`filterBy` option) and filters them using
     * compare function (`filterFn` option, by default Helper.equalsFilter)
     * Merged options are provided to `extractFn` and `compareFn`
     * Set `filterBy` to null to force `propertyExtractor` to return object itself
     * TODO Check memory leaks for all that options links
     */
    List.prototype.filter = function (filterConfigs) {
        var _this = this;
        var self = this;
        filterConfigs = (filterConfigs || []).map(function (opt) {
            return _this.utils.extend({
                condition: '',
                extractFn: self.propertyExtractor((opt && opt.filterBy) || null).bind(_this),
                filterFn: self.equalsFilter.bind(_this)
            }, opt);
        });
        return function (item) {
            return filterConfigs.reduce(function (pass, opt) {
                if (!pass || !opt.condition)
                    return pass;
                return opt.filterFn(opt.extractFn(item, opt), opt);
            }, true);
        };
    };
    return List;
})();
exports.List = List;
function $get(context) {
    return context.createSingleton('List', function () {
        return new List(context);
    });
}
exports.$get = $get;


/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

/// <reference path="../../typings/externals.d.ts" />
var utils = __webpack_require__(16);
var Log = (function () {
    function Log(context, console) {
        if (!console) {
            console = {
                log: function () {
                },
                warn: function () {
                },
                info: function () {
                },
                error: function () {
                }
            };
        }
        this.context = context;
        this.console = console;
        this.utils = utils.$get(context);
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
    Log.prototype.parseArguments = function (args) {
        args = this.utils.argumentsToArray(args);
        if (this.addTimestamps)
            args.unshift(new Date().toLocaleString(), '-');
        return args;
    };
    Log.prototype.debug = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i - 0] = arguments[_i];
        }
        if (this.logDebug)
            this.console.log.apply(this.console, this.parseArguments(arguments));
    };
    Log.prototype.info = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i - 0] = arguments[_i];
        }
        if (this.logInfo)
            this.console.info.apply(this.console, this.parseArguments(arguments));
    };
    Log.prototype.warn = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i - 0] = arguments[_i];
        }
        if (this.logWarnings)
            this.console.warn.apply(this.console, this.parseArguments(arguments));
    };
    Log.prototype.error = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i - 0] = arguments[_i];
        }
        if (this.logErrors)
            this.console.error.apply(this.console, this.parseArguments(arguments));
    };
    return Log;
})();
exports.Log = Log;
function $get(context) {
    return context.createSingleton('Log', function () {
        return new Log(context, console);
    });
}
exports.$get = $get;


/***/ },
/* 12 */
/***/ function(module, exports, __webpack_require__) {

/// <reference path="../../typings/externals.d.ts" />
var utils = __webpack_require__(16);
var log = __webpack_require__(11);
/**
 * @see https://github.com/Microsoft/TypeScript/issues/275
 */
var Observable = (function () {
    function Observable(context) {
        if (!(this instanceof Observable))
            throw new Error('Observable(): New operator was omitted');
        Object.defineProperty(this, 'listeners', { value: {}, enumerable: false, writable: true });
        Object.defineProperty(this, 'oneTimeEvents', { value: {}, enumerable: false, writable: true });
        Object.defineProperty(this, 'oneTimeArguments', { value: {}, enumerable: false, writable: true });
        this.context = context;
        this.utils = utils.$get(context);
        this.log = log.$get(context);
    }
    Observable.prototype.hasListeners = function (event) {
        return (event in this.listeners);
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
            return (result === false);
        });
        return result;
    };
    Observable.prototype.off = function (event, callback) {
        var _this = this;
        if (!event) {
            this.listeners = {};
            this.oneTimeEvents = {};
            this.oneTimeArguments = {};
        }
        else {
            if (!callback) {
                delete this.listeners[event];
            }
            else {
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
        return (event in this.oneTimeEvents);
    };
    /**
     * @deprecated
     * @param {string} event
     * @returns {boolean}
     */
    Observable.prototype.isOneTimeEventFired = function (event) {
        if (!this.isOneTimeEvent(event))
            return false;
        return (this.oneTimeEvents[event]);
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
})();
exports.Observable = Observable;
function $get(context) {
    return new Observable(context);
}
exports.$get = $get;


/***/ },
/* 13 */
/***/ function(module, exports, __webpack_require__) {

/// <reference path="../../typings/externals.d.ts" />
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var observable = __webpack_require__(12);
var PageVisibility = (function (_super) {
    __extends(PageVisibility, _super);
    function PageVisibility(context) {
        var _this = this;
        _super.call(this, context);
        this.events = {
            change: 'change'
        };
        var hidden = "hidden", onchange = function (evt) {
            evt = evt || window.event;
            var v = 'visible', h = 'hidden', evtMap = {
                focus: v,
                focusin: v,
                pageshow: v,
                blur: h,
                focusout: h,
                pagehide: h
            };
            _this.visible = (evt.type in evtMap) ? evtMap[evt.type] == v : !document[hidden];
            _this.emit(_this.events.change, _this.visible);
        };
        this.visible = true;
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
    PageVisibility.prototype.isVisible = function () {
        return this.visible;
    };
    return PageVisibility;
})(observable.Observable);
exports.PageVisibility = PageVisibility;
function $get(context) {
    return new PageVisibility(context);
}
exports.$get = $get;


/***/ },
/* 14 */
/***/ function(module, exports, __webpack_require__) {

/// <reference path="../../typings/externals.d.ts" />
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var observable = __webpack_require__(12);
var cache = __webpack_require__(7);
var request = __webpack_require__(44);
var Platform = (function (_super) {
    __extends(Platform, _super);
    function Platform(context) {
        _super.call(this, context);
        this.events = {
            accessViolation: 'accessViolation',
            logoutSuccess: 'logoutSuccess',
            logoutError: 'logoutError',
            authorizeSuccess: 'authorizeSuccess',
            authorizeError: 'authorizeError',
            refreshSuccess: 'refreshSuccess',
            refreshError: 'refreshError'
        };
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
        this.refreshPromise = null;
        this.cacheId = 'platform';
        this.pollInterval = 250;
        this.releaseTimeout = 5000; // If queue was not released then force it to do so after some timeout
    }
    Platform.prototype.getStorage = function () {
        return cache.$get(this.context);
    };
    Platform.prototype.getRequest = function () {
        return request.$get(this.context);
    };
    Platform.prototype.clearStorage = function () {
        this.getStorage().clean();
        return this;
    };
    Platform.prototype.setCredentials = function (appKey, appSecret) {
        var apiKey = (appKey || '') + ':' + (appSecret || '');
        if (apiKey == ':')
            return this;
        this.apiKey = (typeof btoa == 'function') ? btoa(apiKey) : new Buffer(apiKey).toString('base64');
        return this;
    };
    Platform.prototype.setServer = function (server) {
        this.server = server || '';
        return this;
    };
    Platform.prototype.remember = function (remember) {
        var key = this.cacheId + '-remember';
        if (remember !== undefined) {
            this.getStorage().setItem(key, remember);
            return this;
        }
        return this.getStorage().getItem(key) || false;
    };
    Platform.prototype.authorize = function (options) {
        var _this = this;
        options = options || {};
        options.remember = options.remember || false;
        return this.authCall({
            url: '/restapi/oauth/token',
            post: {
                "grant_type": "password",
                "username": options.username,
                "extension": options.extension || '',
                "password": options.password,
                "access_token_ttl": this.accessTokenTtl,
                "refresh_token_ttl": options.remember ? this.refreshTokenTtlRemember : this.refreshTokenTtl
            }
        }).then(function (response) {
            _this.setCache(response.data).remember(options.remember).emitAndCallback(_this.events.authorizeSuccess, []);
            return response;
        }).catch(function (e) {
            _this.clearStorage().emitAndCallback(_this.events.authorizeError, [e]);
            throw e;
        });
    };
    Platform.prototype.isPaused = function () {
        var storage = this.getStorage(), cacheId = this.cacheId + '-refresh';
        return !!storage.getItem(cacheId) && Date.now() - parseInt(storage.getItem(cacheId)) < this.releaseTimeout;
    };
    Platform.prototype.pause = function () {
        this.getStorage().setItem(this.cacheId + '-refresh', Date.now());
        return this;
    };
    /**
     * If the queue is unpaused internally, polling will be cancelled
     * @returns {Platform}
     */
    Platform.prototype.resume = function () {
        this.getStorage().removeItem(this.cacheId + '-refresh');
        return this;
    };
    Platform.prototype.refresh = function () {
        var _this = this;
        var refresh = new (this.context.getPromise())(function (resolve, reject) {
            if (_this.isPaused()) {
                return resolve(_this.refreshPolling(null));
            }
            else {
                _this.pause();
            }
            // Make sure all existing AJAX calls had a chance to reach the server
            setTimeout(function () {
                var authData = _this.getAuthData();
                _this.log.debug('Platform.refresh(): Performing token refresh (access token', authData.access_token, ', refresh token', authData.refresh_token, ')');
                if (!authData || !authData.refresh_token)
                    return reject(new Error('Refresh token is missing'));
                if (Date.now() > authData.refreshExpireTime)
                    return reject(new Error('Refresh token has expired'));
                if (!_this.isPaused())
                    return reject(new Error('Queue was resumed before refresh call'));
                resolve(_this.authCall({
                    url: '/restapi/oauth/token',
                    post: {
                        "grant_type": "refresh_token",
                        "refresh_token": authData.refresh_token,
                        "access_token_ttl": _this.accessTokenTtl,
                        "refresh_token_ttl": _this.remember() ? _this.refreshTokenTtlRemember : _this.refreshTokenTtl
                    }
                }));
            }, _this.refreshDelayMs);
        });
        return refresh.then(function (response) {
            // This means refresh has happened elsewhere and we are here because of timeout
            if (!response || !response.data)
                return response;
            _this.log.info('Platform.refresh(): Token was refreshed');
            if (!response.data.refresh_token || !response.data.access_token) {
                var e = new Error('Malformed OAuth response');
                e.ajax = response;
                throw e;
            }
            _this.setCache(response.data).resume();
            return response;
        }).then(function (result) {
            _this.emit(_this.events.refreshSuccess, result);
            return result;
        }).catch(function (e) {
            if (_this.clearCacheOnRefreshError)
                _this.clearStorage();
            _this.emitAndCallback(_this.events.accessViolation, [e]).emitAndCallback(_this.events.refreshError, [e]);
            throw e;
        });
    };
    /**
     * @returns {Promise}
     */
    Platform.prototype.logout = function () {
        var _this = this;
        this.pause();
        return this.authCall({
            url: '/restapi/oauth/revoke',
            post: {
                token: this.getToken()
            }
        }).then(function (response) {
            _this.resume().clearStorage().emit(_this.events.logoutSuccess, response);
            return response;
        }).catch(function (e) {
            _this.resume().emitAndCallback(_this.events.accessViolation, [e]).emitAndCallback(_this.events.logoutError, [e]);
            throw e;
        });
    };
    Platform.prototype.refreshPolling = function (result) {
        var _this = this;
        if (this.refreshPromise)
            return this.refreshPromise;
        this.refreshPromise = new (this.context.getPromise())(function (resolve, reject) {
            _this.log.warn('Platform.refresh(): Refresh is already in progress polling started');
            _this.utils.poll(function (next) {
                if (_this.isPaused())
                    return next();
                _this.refreshPromise = null;
                _this.resume();
                if (_this.isTokenValid()) {
                    resolve(result);
                }
                else {
                    reject(new Error('Automatic authentification timeout'));
                }
            }, _this.pollInterval);
        });
        return this.refreshPromise;
    };
    Platform.prototype.getToken = function () {
        return this.getAuthData().access_token;
    };
    Platform.prototype.getTokenType = function () {
        return this.getAuthData().token_type;
    };
    Platform.prototype.getAuthData = function () {
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
     */
    Platform.prototype.isTokenValid = function () {
        var authData = this.getAuthData();
        return (authData.token_type == Platform.forcedTokenType || (new Date(authData.expireTime).getTime() - this.refreshHandicapMs) > Date.now() && !this.isPaused());
    };
    /**
     * Checks if user is authorized
     * If there is no access token, refresh will be performed
     */
    Platform.prototype.isAuthorized = function () {
        if (this.isTokenValid())
            return this.context.getPromise().resolve(true);
        return this.refresh();
    };
    Platform.prototype.cancelAccessToken = function () {
        return this.setCache(this.utils.extend(this.getAuthData(), {
            access_token: '',
            expires_in: 0
        }));
    };
    Platform.prototype.setCache = function (authData) {
        var oldAuthData = this.getAuthData();
        this.log.info('Platform.setCache(): Tokens were updated, new:', authData, ', old:', oldAuthData);
        authData.expireTime = Date.now() + (authData.expires_in * 1000);
        authData.refreshExpireTime = Date.now() + (authData.refresh_token_expires_in * 1000);
        this.getStorage().setItem(this.cacheId, authData);
        return this;
    };
    Platform.prototype.forceAuthentication = function () {
        this.setCache({
            token_type: Platform.forcedTokenType,
            access_token: '',
            expires_in: 0,
            refresh_token: '',
            refresh_token_expires_in: 0
        });
        return this;
    };
    Platform.prototype.apiCall = function (options) {
        var _this = this;
        options = options || {};
        options.url = this.apiUrl(options.url, { addServer: true });
        return this.isAuthorized().then(function () {
            var token = _this.getToken();
            return _this.getRequest().setOptions(options).setHeader('Authorization', _this.getTokenType() + (token ? ' ' + token : '')).send();
        }).catch(function (e) {
            if (!e.response || !e.response.isUnauthorized())
                throw e;
            _this.cancelAccessToken();
            return _this.refresh().then(function () {
                // Re-send with same options
                return _this.apiCall(options);
            });
        });
    };
    Platform.prototype.get = function (url, options) {
        options = options || {};
        options.url = url;
        options.method = 'GET';
        return this.apiCall(options);
    };
    Platform.prototype.post = function (url, options) {
        options = options || {};
        options.url = url;
        options.method = 'POST';
        return this.apiCall(options);
    };
    Platform.prototype.put = function (url, options) {
        options = options || {};
        options.url = url;
        options.method = 'PUT';
        return this.apiCall(options);
    };
    Platform.prototype['delete'] = function (url, options) {
        options = options || {};
        options.url = url;
        options.method = 'DELETE';
        return this.apiCall(options);
    };
    Platform.prototype.authCall = function (options) {
        options = options || {};
        options.method = options.method || 'POST';
        options.url = this.apiUrl(options.url, { addServer: true });
        return this.getRequest().setOptions(options).setHeader('Content-Type', 'application/x-www-form-urlencoded').setHeader('Accept', 'application/json').setHeader('Authorization', 'Basic ' + this.apiKey).send();
    };
    Platform.prototype.apiUrl = function (url, options) {
        url = url || '';
        options = options || {};
        var builtUrl = '', hasHttp = url.indexOf('http://') != -1 || url.indexOf('https://') != -1;
        if (options.addServer && !hasHttp)
            builtUrl += this.server;
        if (url.indexOf(this.urlPrefix) == -1 && !hasHttp)
            builtUrl += this.urlPrefix + '/' + this.apiVersion;
        if (url.indexOf(this.accountPrefix) > -1)
            builtUrl.replace(this.accountPrefix + '~', this.accountPrefix + this.account);
        builtUrl += url;
        if (options.addMethod || options.addToken)
            builtUrl += (url.indexOf('?') > -1 ? '&' : '?');
        if (options.addMethod)
            builtUrl += '_method=' + options.addMethod;
        if (options.addToken)
            builtUrl += (options.addMethod ? '&' : '') + 'access_token=' + this.getToken();
        return builtUrl;
    };
    Platform.forcedTokenType = 'forced';
    return Platform;
})(observable.Observable);
exports.Platform = Platform;
function $get(context) {
    return context.createSingleton('Platform', function () {
        return new Platform(context);
    });
}
exports.$get = $get;


/***/ },
/* 15 */
/***/ function(module, exports, __webpack_require__) {

/// <reference path="../../typings/externals.d.ts" />
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var observable = __webpack_require__(12);
var platform = __webpack_require__(14);
var Subscription = (function (_super) {
    __extends(Subscription, _super);
    function Subscription(context) {
        _super.call(this, context);
        this.events = {
            notification: 'notification',
            removeSuccess: 'removeSuccess',
            removeError: 'removeError',
            renewSuccess: 'renewSuccess',
            renewError: 'renewError',
            subscribeSuccess: 'subscribeSuccess',
            subscribeError: 'subscribeError'
        };
        this.pubnub = null;
        this.eventFilters = [];
        this.timeout = null;
        this.subscription = {
            eventFilters: [],
            expirationTime: '',
            expiresIn: 0,
            deliveryMode: {
                transportType: 'PubNub',
                encryption: false,
                address: '',
                subscriberKey: '',
                secretKey: ''
            },
            id: '',
            creationTime: '',
            status: '',
            uri: ''
        };
    }
    Subscription.prototype.getPubnub = function () {
        return this.context.getPubnub();
    };
    Subscription.prototype.getCrypto = function () {
        return this.context.getCryptoJS();
    };
    Subscription.prototype.getPlatform = function () {
        return platform.$get(this.context);
    };
    /**
     * Creates or updates subscription if there is an active one
     * @param {{events?:string[]}} [options] New array of events
     * @returns {Promise}
     */
    Subscription.prototype.register = function (options) {
        if (this.isSubscribed()) {
            return this.renew(options);
        }
        else {
            return this.subscribe(options);
        }
    };
    Subscription.prototype.addEvents = function (events) {
        this.eventFilters = this.eventFilters.concat(events);
        return this;
    };
    Subscription.prototype.setEvents = function (events) {
        this.eventFilters = events;
        return this;
    };
    Subscription.prototype.getFullEventFilters = function () {
        var _this = this;
        return this.eventFilters.map(function (event) {
            return _this.getPlatform().apiUrl(event);
        });
    };
    Subscription.prototype.subscribe = function (options) {
        var _this = this;
        options = options || {};
        if (options.events)
            this.eventFilters = options.events;
        this.clearTimeout();
        return new (this.context.getPromise())(function (resolve, reject) {
            if (!_this.eventFilters || !_this.eventFilters.length)
                throw new Error('Events are undefined');
            resolve(_this.getPlatform().apiCall({
                method: 'POST',
                url: '/restapi/v1.0/subscription',
                post: {
                    eventFilters: _this.getFullEventFilters(),
                    deliveryMode: {
                        transportType: 'PubNub'
                    }
                }
            }));
        }).then(function (ajax) {
            _this.updateSubscription(ajax.data).subscribeAtPubnub().emit(_this.events.subscribeSuccess, ajax.data);
            return ajax;
        }).catch(function (e) {
            _this.unsubscribe().emit(_this.events.subscribeError, e);
            throw e;
        });
    };
    Subscription.prototype.renew = function (options) {
        var _this = this;
        options = options || {};
        if (options.events)
            this.eventFilters = options.events;
        this.clearTimeout();
        return new (this.context.getPromise())(function (resolve, reject) {
            if (!_this.subscription || !_this.subscription.id)
                throw new Error('Subscription ID is required');
            if (!_this.eventFilters || !_this.eventFilters.length)
                throw new Error('Events are undefined');
            resolve();
        }).then(function () {
            return _this.getPlatform().apiCall({
                method: 'PUT',
                url: '/restapi/v1.0/subscription/' + _this.subscription.id,
                post: {
                    eventFilters: _this.getFullEventFilters()
                }
            });
        }).then(function (ajax) {
            _this.updateSubscription(ajax.data).emit(_this.events.renewSuccess, ajax.data);
            return ajax;
        }).catch(function (e) {
            _this.unsubscribe().emit(_this.events.renewError, e);
            throw e;
        });
    };
    Subscription.prototype.remove = function (options) {
        var _this = this;
        options = this.utils.extend({
            async: true
        }, options);
        return new (this.context.getPromise())(function (resolve, reject) {
            if (!_this.subscription || !_this.subscription.id)
                throw new Error('Subscription ID is required');
            resolve(_this.getPlatform().apiCall({
                async: !!options.async,
                // hook and has to be synchronous
                method: 'DELETE',
                url: '/restapi/v1.0/subscription/' + _this.subscription.id
            }));
        }).then(function (ajax) {
            _this.unsubscribe().emit(_this.events.removeSuccess, ajax);
            return ajax;
        }).catch(function (e) {
            _this.emit(_this.events.removeError, e);
            throw e;
        });
    };
    Subscription.prototype.destroy = function () {
        this.unsubscribe();
        this.log.info('RC.core.Subscription: Destroyed');
        return _super.prototype.destroy.call(this);
    };
    Subscription.prototype.isSubscribed = function () {
        return this.subscription && this.subscription.deliveryMode && this.subscription.deliveryMode.subscriberKey && this.subscription.deliveryMode.address;
    };
    Subscription.prototype.setTimeout = function () {
        var _this = this;
        var timeToExpiration = (this.subscription.expiresIn * 1000) - Subscription.renewHandicapMs;
        this.timeout = setTimeout(function () {
            _this.renew({});
        }, timeToExpiration);
    };
    Subscription.prototype.clearTimeout = function () {
        clearTimeout(this.timeout);
    };
    Subscription.prototype.updateSubscription = function (subscription) {
        this.clearTimeout();
        this.subscription = subscription;
        this.setTimeout();
        return this;
    };
    /**
     * Remove subscription and disconnect from PUBNUB
     */
    Subscription.prototype.unsubscribe = function () {
        this.clearTimeout();
        if (this.pubnub && this.isSubscribed())
            this.pubnub.unsubscribe({ channel: this.subscription.deliveryMode.address });
        this.subscription = null;
        return this;
    };
    /**
     * Do not use this method! Internal use only
     * @param message
     * @returns {Subscription}
     */
    Subscription.prototype.notify = function (message) {
        if (this.isSubscribed() && this.subscription.deliveryMode.encryptionKey) {
            var CryptoJS = this.getCrypto();
            var key = CryptoJS.enc.Base64.parse(this.subscription.deliveryMode.encryptionKey);
            var data = CryptoJS.enc.Base64.parse(message);
            var decrypted = CryptoJS.AES.decrypt({ ciphertext: data }, key, {
                mode: CryptoJS.mode.ECB,
                padding: CryptoJS.pad.Pkcs7
            }).toString(CryptoJS.enc.Utf8);
            message = JSON.parse(decrypted);
        }
        this.emit(this.events.notification, message);
        return this;
    };
    /**
     * Do not use this method! Internal use only
     * @returns {Subscription}
     */
    Subscription.prototype.subscribeAtPubnub = function () {
        var _this = this;
        if (!this.isSubscribed())
            return this;
        var PUBNUB = this.getPubnub();
        this.pubnub = PUBNUB.init({
            ssl: true,
            subscribe_key: this.subscription.deliveryMode.subscriberKey
        });
        this.pubnub.ready();
        this.pubnub.subscribe({
            channel: this.subscription.deliveryMode.address,
            message: function (message, env, channel) {
                _this.log.info('RC.core.Subscription: Incoming message', message);
                _this.notify(message);
            },
            connect: function () {
                _this.log.info('RC.core.Subscription: PUBNUB connected');
            }
        });
        return this;
    };
    Subscription.renewHandicapMs = 60 * 1000;
    return Subscription;
})(observable.Observable);
exports.Subscription = Subscription;
function $get(context) {
    return new Subscription(context);
}
exports.$get = $get;


/***/ },
/* 16 */
/***/ function(module, exports, __webpack_require__) {

/// <reference path="../../typings/externals.d.ts" />
var hasOwn = Object.prototype.hasOwnProperty, toString = Object.prototype.toString, rdigit = /\d/, class2type = {};
// Populate the class2type map
'Boolean Number String Function Array Date RegExp Object'.split(' ').forEach(function (name) {
    class2type["[object " + name + "]"] = name.toLowerCase();
});
var Utils = (function () {
    function Utils() {
    }
    /**
     * Ported from jQuery.fn.extend
     * Optional first parameter makes deep copy
     */
    Utils.prototype.extend = function (targetObject, sourceObject) {
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
        if (typeof target !== "object" && !this.isFunction(target)) {
            target = {};
        }
        for (; i < length; i++) {
            // Only deal with non-null/undefined values
            if ((options = arguments[i]) !== null) {
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
                        }
                        else {
                            clone = src && this.isPlainObject(src) ? src : {};
                        }
                        // Never move original objects, clone them
                        target[name] = this.extend(deep, clone, copy);
                    }
                    else if (copy !== undefined) {
                        target[name] = copy;
                    }
                }
            }
        }
        // Return the modified object
        return target;
    };
    Utils.prototype.forEach = function (object, cb) {
        for (var i in object) {
            if (!object.hasOwnProperty(i))
                continue;
            var res = cb(object[i], i);
            if (res === false)
                break;
        }
    };
    /**
     * TODO Replace with something better
     * @see https://github.com/joyent/node/blob/master/lib/querystring.js
     * @param {object} parameters
     * @returns {string}
     */
    Utils.prototype.queryStringify = function (parameters) {
        var _this = this;
        var array = [];
        this.forEach(parameters, function (v, i) {
            if (_this.isArray(v)) {
                v.forEach(function (vv) {
                    array.push(encodeURIComponent(i) + '=' + encodeURIComponent(vv));
                });
            }
            else {
                array.push(encodeURIComponent(i) + '=' + encodeURIComponent(v));
            }
        });
        return array.join('&');
    };
    /**
     * TODO Replace with something better
     * @see https://github.com/joyent/node/blob/master/lib/querystring.js
     * @param {string} queryString
     * @returns {object}
     */
    Utils.prototype.parseQueryString = function (queryString) {
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
    };
    /**
     * Returns true if the passed value is valid email address.
     * Checks multiple comma separated emails according to RFC 2822 if parameter `multiple` is `true`
     */
    Utils.prototype.isEmail = function (v, multiple) {
        if (!!multiple) {
            //this Regexp is also suitable for multiple emails (comma separated)
            return /^(?:[a-z0-9!#$%&'*+\/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+\/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?[ ,;]*)+$/i.test(v);
        }
        else {
            return /^[a-z0-9!#$%&'*+\/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+\/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/i.test(v);
        }
    };
    Utils.prototype.isPhoneNumber = function (v) {
        return (/\+?1[0-9]{3}[0-9a-z]{7}/im.test(v.toString().split(/[^0-9a-z\+]/im).join('')));
    };
    /**
     * @param args
     * @returns {Array}
     */
    Utils.prototype.argumentsToArray = function (args) {
        return Array.prototype.slice.call(args || [], 0);
    };
    Utils.prototype.isDate = function (obj) {
        return this.type(obj) === "date";
    };
    Utils.prototype.isFunction = function (obj) {
        return this.type(obj) === "function";
    };
    Utils.prototype.isArray = function (obj) {
        return Array.isArray ? Array.isArray(obj) : this.type(obj) === "array";
    };
    // A crude way of determining if an object is a window
    Utils.prototype.isWindow = function (obj) {
        return obj && typeof obj === "object" && "setInterval" in obj;
    };
    Utils.prototype.isNaN = function (obj) {
        return obj === null || !rdigit.test(obj) || isNaN(obj);
    };
    Utils.prototype.type = function (obj) {
        return obj === null ? String(obj) : class2type[toString.call(obj)] || "object";
    };
    Utils.prototype.isPlainObject = function (obj) {
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
        for (key in obj) {
        }
        return key === undefined || hasOwn.call(obj, key);
    };
    Utils.prototype.getProperty = function (obj, property) {
        return property.split(/[.[\]]/).reduce(function (res, part) {
            if (!res)
                return undefined;
            return part ? res[part] : res;
        }, obj);
    };
    Utils.prototype.poll = function (fn, interval, timeout) {
        this.stopPolling(timeout);
        interval = interval || 1000;
        var next = function (delay) {
            delay = delay || interval;
            interval = delay;
            return setTimeout(function () {
                fn(next, delay);
            }, delay);
        };
        return next();
    };
    Utils.prototype.stopPolling = function (timeout) {
        if (timeout)
            clearTimeout(timeout);
    };
    Utils.prototype.parseString = function (s) {
        return s ? s.toString() : '';
    };
    Utils.prototype.parseNumber = function (n) {
        if (!n)
            return 0;
        n = parseFloat(n);
        return isNaN(n) ? 0 : n;
    };
    return Utils;
})();
exports.Utils = Utils;
function $get(context) {
    return context.createSingleton('Utils', function () {
        return new Utils();
    });
}
exports.$get = $get;


/***/ },
/* 17 */
/***/ function(module, exports, __webpack_require__) {

/// <reference path="../../typings/externals.d.ts" />
var utils = __webpack_require__(16);
var Validator = (function () {
    function Validator(context) {
        this.context = context;
        this.utils = utils.$get(context);
    }
    Validator.prototype.validate = function (validators) {
        var result = {
            errors: {},
            isValid: true
        };
        result.errors = validators.reduce(function (errors, validator) {
            var res = validator.validator();
            if (res.length > 0) {
                result.isValid = false;
                errors[validator.field] = errors[validator.field] || [];
                errors[validator.field] = errors[validator.field].concat(res);
            }
            return errors;
        }, {});
        return result;
    };
    /**
     * It is not recommended to have any kinds of complex validators at front end
     * @deprecated
     */
    Validator.prototype.email = function (value, multiple) {
        var _this = this;
        return function () {
            if (!value)
                return [];
            return _this.utils.isEmail(value, multiple) ? [] : [new Error('Value has to be a valid email')];
        };
    };
    /**
     * It is not recommended to have any kinds of complex validators at front end
     * TODO International phone numbers
     * @deprecated
     */
    Validator.prototype.phone = function (value) {
        var _this = this;
        return function () {
            if (!value)
                return [];
            return _this.utils.isPhoneNumber(value) ? [] : [new Error('Value has to be a valid US phone number')];
        };
    };
    Validator.prototype.required = function (value) {
        return function () {
            return !value ? [new Error('Field is required')] : [];
        };
    };
    Validator.prototype.length = function (value, max, min) {
        return function () {
            var errors = [];
            if (!value)
                return errors;
            value = value.toString();
            if (min && value.length < min)
                errors.push(new Error('Minimum length of ' + min + ' characters is required'));
            if (max && value.length > max)
                errors.push(new Error('Maximum length of ' + max + ' characters is required'));
            return errors;
        };
    };
    return Validator;
})();
exports.Validator = Validator;
function $get(context) {
    return context.createSingleton('Validator', function () {
        return new Validator(context);
    });
}
exports.$get = $get;


/***/ },
/* 18 */
/***/ function(module, exports, __webpack_require__) {

/// <reference path="../../typings/externals.d.ts" />
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var helper = __webpack_require__(9);
var Account = (function (_super) {
    __extends(Account, _super);
    function Account() {
        _super.apply(this, arguments);
    }
    Account.prototype.createUrl = function () {
        return '/account/~';
    };
    return Account;
})(helper.Helper);
exports.Account = Account;
function $get(context) {
    return context.createSingleton('Account', function () {
        return new Account(context);
    });
}
exports.$get = $get;


/***/ },
/* 19 */
/***/ function(module, exports, __webpack_require__) {

/// <reference path="../../typings/externals.d.ts" />
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var helper = __webpack_require__(9);
var validator = __webpack_require__(17);
var BlockedNumber = (function (_super) {
    __extends(BlockedNumber, _super);
    function BlockedNumber(context) {
        _super.call(this, context);
        this.validator = validator.$get(context);
    }
    BlockedNumber.prototype.createUrl = function (options, id) {
        options = options || {};
        return '/account/~/extension/' + (options.extensionId ? options.extensionId : '~') + '/blocked-number' + (id ? '/' + id : '');
    };
    BlockedNumber.prototype.validate = function (item) {
        return this.validator.validate([
            { field: 'phoneNumber', validator: this.validator.phone(item.phoneNumber) },
            { field: 'phoneNumber', validator: this.validator.required(item.phoneNumber) },
            { field: 'name', validator: this.validator.required(item.name) }
        ]);
    };
    return BlockedNumber;
})(helper.Helper);
exports.BlockedNumber = BlockedNumber;
function $get(context) {
    return context.createSingleton('BlockedNumber', function () {
        return new BlockedNumber(context);
    });
}
exports.$get = $get;


/***/ },
/* 20 */
/***/ function(module, exports, __webpack_require__) {

/// <reference path="../../typings/externals.d.ts" />
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var helper = __webpack_require__(9);
var list = __webpack_require__(10);
var presence = __webpack_require__(33);
var contact = __webpack_require__(21);
var Call = (function (_super) {
    __extends(Call, _super);
    function Call(context) {
        _super.call(this, context);
        this.list = list.$get(context);
        this.contact = contact.$get(context);
        this.presence = presence.$get(context);
    }
    Call.prototype.createUrl = function (options, id) {
        options = options || {};
        if (!('personal' in options) && !('extensionId' in options))
            options.personal = true;
        return '/account/~/' + (options.personal || options.extensionId ? ('extension/' + (options.extensionId || '~') + '/') : '') + (options.active ? 'active-calls' : 'call-log') + (id ? '/' + id : '');
    };
    Call.prototype.getSessionId = function (call) {
        return (call && call.sessionId);
    };
    Call.prototype.isInProgress = function (call) {
        return (call && call.result == 'In Progress');
    };
    Call.prototype.isAlive = function (call) {
        return (call && call.availability == 'Alive');
    };
    Call.prototype.isInbound = function (call) {
        return (call && call.direction == 'Inbound');
    };
    Call.prototype.isOutbound = function (call) {
        return !this.isInbound(call);
    };
    Call.prototype.isMissed = function (call) {
        return (call && call.result == 'Missed');
    };
    Call.prototype.isFindMe = function (call) {
        return (call && call.action == 'FindMe');
    };
    Call.prototype.getCallerInfo = function (call) {
        return this.isInbound(call) ? call.from : call.to;
    };
    Call.prototype.getAllCallerInfos = function (call) {
        return [this.getCallerInfo(call)].concat(this.isInbound(call) ? call.to : call.from);
    };
    Call.prototype.formatDuration = function (call) {
        function addZero(v) {
            return (v < 10) ? '0' + v : v;
        }
        var duration = parseInt(call.duration), hours = Math.floor(duration / (60 * 60)), mins = Math.floor((duration % (60 * 60)) / 60), secs = Math.floor(duration % 60);
        return (hours ? hours + ':' : '') + addZero(mins) + ':' + addZero(secs);
    };
    Call.prototype.filter = function (options) {
        options = this.utils.extend({
            alive: true,
            direction: '',
            type: ''
        }, options);
        return this.list.filter([
            { filterBy: 'direction', condition: options.direction },
            { filterBy: 'type', condition: options.type }
        ]);
    };
    Call.prototype.comparator = function (options) {
        return this.list.comparator(this.utils.extend({
            sortBy: 'startTime'
        }, options));
    };
    /**
     * Injects contact field with appropriate {IContact} data structure into all callerInfos found in
     * all calls Warning, this function may be performance-consuming, reduce the amount of items passed to contacts
     * and calls
     */
    Call.prototype.attachContacts = function (contacts, calls, options) {
        var _this = this;
        // Flatten all caller infos from all messages
        var callerInfos = calls.reduce(function (callerInfos, call) {
            return callerInfos.concat(_this.getAllCallerInfos(call));
        }, []);
        this.contact.attachToCallerInfos(callerInfos, contacts, options);
    };
    /**
     * Check whether pair of calls are two legs of RingOut
     */
    Call.prototype.checkMergeability = function (outboundRingOutCall, inboundCall, options) {
        var getTime = function (dateString) {
            return (new Date(dateString)).getTime();
        };
        return ((!options.strict || outboundRingOutCall.action && outboundRingOutCall.action.toLowerCase().indexOf('ringout') != -1) && outboundRingOutCall.direction == 'Outbound' && inboundCall.direction == 'Inbound' && ((!inboundCall.startTime && !outboundRingOutCall.startTime) || Math.abs(getTime(inboundCall.startTime) - getTime(outboundRingOutCall.startTime)) < (options.maxStartTimeDiscrepancy || 5000)) && inboundCall.from.phoneNumber == outboundRingOutCall.to.phoneNumber && (inboundCall.to.phoneNumber == outboundRingOutCall.from.phoneNumber || inboundCall.to.name == outboundRingOutCall.from.name));
    };
    Call.prototype.combineCalls = function (outboundRingOutCall, inboundCall, options) {
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
        }
        else {
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
     */
    Call.prototype.processCalls = function (calls, options) {
        var processedCalls = [], callsToMerge = [], self = this;
        // Iterate through calls
        calls.forEach(function (call) {
            var merged = false;
            call.subsequent = false;
            call.hasSubsequent = false;
            // Second cycle to find other leg
            // It is assumed that call is the outbound, secondCall is inbound
            calls.some(function (secondCall) {
                if (call === secondCall)
                    return false;
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
        calls.forEach(function (call) {
            if (callsToMerge.indexOf(call) == -1)
                processedCalls.push(call);
        });
        return processedCalls;
    };
    /**
     * Converts Presence's ActiveCall array into regular Calls array
     */
    Call.prototype.parsePresenceCalls = function (activeCalls) {
        var _this = this;
        return activeCalls.map(function (activeCall) {
            return {
                id: activeCall.id,
                uri: '',
                sessionId: activeCall.sessionId,
                from: { phoneNumber: activeCall.from },
                to: { phoneNumber: activeCall.to },
                direction: activeCall.direction,
                startTime: '',
                duration: 0,
                type: '',
                action: '',
                result: _this.presence.isCallInProgress(activeCall) ? 'In Progress' : activeCall.telephonyStatus,
                telephonyStatus: activeCall.telephonyStatus // non-standard property for compatibility
            };
        });
    };
    Call.prototype.getSignature = function (call) {
        var cleanup = function (phoneNumber) {
            return (phoneNumber || '').toString().replace(/[^0-9]/ig, '');
        };
        return call.direction + '|' + (call.from && cleanup(call.from.phoneNumber)) + '|' + (call.to && cleanup(call.to.phoneNumber));
    };
    Call.prototype.mergePresenceCalls = function (presenceCalls, presence) {
        var currentDate = new Date(), activeCalls = this.parsePresenceCalls(presence && presence.activeCalls || []).map(function (call) {
            // delete property to make sure it is skipped during merge
            delete call.startTime;
            return call;
        });
        presenceCalls = this.merge(presenceCalls || [], activeCalls, this.getSessionId, true);
        presenceCalls.forEach(function (call) {
            if (!call.startTime)
                call.startTime = currentDate.toISOString();
        });
        return presenceCalls;
    };
    Call.prototype.mergeAll = function (presenceCalls, calls, activeCalls) {
        // First, merge calls into presence calls
        var presenceAndCalls = this.merge(presenceCalls || [], calls || [], this.getSessionId, true);
        // Second, merge activeCalls into previous result
        return this.merge(presenceAndCalls, activeCalls || [], this.getSessionId, true);
    };
    return Call;
})(helper.Helper);
exports.Call = Call;
function $get(context) {
    return context.createSingleton('Call', function () {
        return new Call(context);
    });
}
exports.$get = $get;


/***/ },
/* 21 */
/***/ function(module, exports, __webpack_require__) {

/// <reference path="../../typings/externals.d.ts" />
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var helper = __webpack_require__(9);
var validator = __webpack_require__(17);
var list = __webpack_require__(10);
var Contact = (function (_super) {
    __extends(Contact, _super);
    function Contact(context) {
        _super.call(this, context);
        this.phoneFields = [
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
        this.faxFields = [
            'businessFax',
            'otherFax'
        ];
        this.addressFields = [
            'homeAddress',
            'businessAddress',
            'otherAddress'
        ];
        this.addressSubFields = [
            'street',
            'city',
            'state',
            'zip'
        ];
        this.nameFields = [
            'firstName',
            'middleName',
            'lastName',
            'nickName'
        ];
        this.otherFields = [
            'company',
            'jobTitle',
            'webPage',
            'notes'
        ];
        this.emailFields = [
            'email',
            'email2',
            'email3'
        ];
        this.list = list.$get(context);
        this.validator = validator.$get(context);
    }
    Contact.prototype.createUrl = function (options, id) {
        options = options || {};
        var root = '/account/~/extension/' + (options.extensionId ? options.extensionId : '~') + '/address-book';
        if (options.sync)
            return root + '-sync';
        return root + (options.groupId ? '/group/' + options.groupId + '/contact' : '/contact') + (id ? '/' + id : '');
    };
    /**
     * Returns all values of the given fields if value exists
     */
    Contact.prototype.getFieldValues = function (where, fields, asHash) {
        return fields.reduce(function (result, field) {
            if (where && where[field]) {
                if (asHash) {
                    result[field] = where[field];
                }
                else {
                    result.push(where[field]);
                }
            }
            return result;
        }, asHash ? {} : []);
    };
    Contact.prototype.getFullName = function (contact) {
        return this.getFieldValues(contact, this.nameFields).join(' ');
    };
    Contact.prototype.getEmails = function (contact, asHash) {
        return this.getFieldValues(contact, this.emailFields, asHash);
    };
    Contact.prototype.getPhones = function (contact, asHash) {
        return this.getFieldValues(contact, this.phoneFields, asHash);
    };
    Contact.prototype.getFaxes = function (contact, asHash) {
        return this.getFieldValues(contact, this.faxFields, asHash);
    };
    Contact.prototype.getAddresses = function (contact, asHash) {
        return this.getFieldValues(contact, this.addressFields, asHash);
    };
    Contact.prototype.isAlive = function (contact) {
        return (contact.availability == 'Alive');
    };
    /**
     * Matches a contact against a given string, returns null if nothing found
     */
    Contact.prototype.match = function (contact, string, options) {
        var _this = this;
        options = this.utils.extend({
            fields: [].concat(this.nameFields, this.emailFields, this.phoneFields, this.faxFields, this.otherFields),
            inAddresses: true,
            transformFn: function (value, options) {
                return value ? value.toString().toLocaleLowerCase() : '';
            },
            strict: false
        }, options);
        string = options.transformFn(string, options);
        var found = null;
        if (!string)
            return found;
        var matchWith = function (value) {
            // skip unnecessary cycles if match has been found
            if (found)
                return;
            var transformed = options.transformFn(value, options);
            if (!transformed)
                return;
            var match = (options.strict ? transformed == string : transformed.indexOf(string) > -1);
            if (match)
                found = value;
        };
        // Search in fields
        options.fields.forEach(function (field) {
            matchWith(contact[field]);
        });
        // Search in addresses, skip unnecessary cycles if match has been found
        if (options.inAddresses && !found)
            this.addressFields.forEach(function (field) {
                // skip unnecessary cycles if match has been found or no field value
                if (!contact[field] || found)
                    return;
                _this.addressSubFields.forEach(function (subField) {
                    matchWith(contact[field][subField]);
                });
            });
        return found;
    };
    /**
     * Matches a contact against a given phone number, returns null if nothing found
     */
    Contact.prototype.matchAsPhone = function (contact, phone, options) {
        return this.match(contact, phone, this.utils.extend({
            fields: [].concat(this.phoneFields, this.faxFields),
            inAddresses: false,
            transformFn: function (value, options) {
                return value ? value.toString().replace(/[^\d\w]/ig, '') : ''; //TODO Trickier removal reqired;
            },
            strict: false
        }, options));
    };
    /**
     * Injects contact field with appropriate {IContact} data structure into all given {ICallerInfo}
     * Warning, this function may be performance-consuming, reduce the amount of items passed to contacts and callerInfos
     */
    Contact.prototype.attachToCallerInfos = function (callerInfos, contacts, options) {
        var self = this, callerInfoIndex = this.index(callerInfos, function (callerInfo) {
            return callerInfo.phoneNumber;
        }, true);
        this.utils.forEach(callerInfoIndex, function (indexedCallerInfos, phoneNumber) {
            var foundContact = null, foundPhone = null;
            contacts.some(function (contact) {
                foundPhone = self.matchAsPhone(contact, phoneNumber, options);
                if (foundPhone)
                    foundContact = contact;
                return foundPhone;
            });
            if (foundContact) {
                indexedCallerInfos.forEach(function (callerInfo) {
                    callerInfo.contact = foundContact;
                    callerInfo.contactPhone = foundPhone;
                });
            }
        });
    };
    Contact.prototype.comparator = function (options) {
        var _this = this;
        return this.list.comparator(this.utils.extend({
            extractFn: function (contact, options) {
                return _this.getFullName(contact);
            }
        }, options));
    };
    /**
     * TODO Add filtering by group http://jira.ringcentral.com/browse/SDK-4
     */
    Contact.prototype.filter = function (options) {
        var _this = this;
        options = this.utils.extend({
            alive: true,
            startsWith: '',
            phonesOnly: false,
            faxesOnly: false
        }, options);
        return this.list.filter([
            { condition: options.alive, filterFn: this.isAlive },
            { condition: options.startsWith, filterFn: function (item, opts) {
                return _this.match(item, opts.condition);
            } },
            { condition: options.phonesOnly, filterFn: function (item, opts) {
                return (_this.getPhones(item).length > 0);
            } },
            { condition: options.faxesOnly, filterFn: function (item, opts) {
                return (_this.getFaxes(item).length > 0);
            } }
        ]);
    };
    Contact.prototype.validate = function (item) {
        return this.validator.validate([
            { field: 'firstName', validator: this.validator.required(item.firstName) },
            { field: 'lastName', validator: this.validator.required(item.lastName) },
            { field: 'email', validator: this.validator.email(item.email) },
            { field: 'email2', validator: this.validator.email(item.email2) },
            { field: 'email3', validator: this.validator.email(item.email3) }
        ]);
    };
    return Contact;
})(helper.Helper);
exports.Contact = Contact;
function $get(context) {
    return context.createSingleton('Contact', function () {
        return new Contact(context);
    });
}
exports.$get = $get;


/***/ },
/* 22 */
/***/ function(module, exports, __webpack_require__) {

/// <reference path="../../typings/externals.d.ts" />
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var helper = __webpack_require__(9);
var validator = __webpack_require__(17);
var ContactGroup = (function (_super) {
    __extends(ContactGroup, _super);
    function ContactGroup(context) {
        _super.call(this, context);
        this.validator = validator.$get(context);
    }
    ContactGroup.prototype.createUrl = function (options, id) {
        return '/account/~/extension/~/address-book/group' + (id ? '/' + id : '');
    };
    ContactGroup.prototype.validate = function (item) {
        return this.validator.validate([
            { field: 'groupName', validator: this.validator.required(item && item.groupName) }
        ]);
    };
    return ContactGroup;
})(helper.Helper);
exports.ContactGroup = ContactGroup;
function $get(context) {
    return context.createSingleton('ContactGroup', function () {
        return new ContactGroup(context);
    });
}
exports.$get = $get;


/***/ },
/* 23 */
/***/ function(module, exports, __webpack_require__) {

/// <reference path="../../typings/externals.d.ts" />
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var helper = __webpack_require__(9);
var Conferencing = (function (_super) {
    __extends(Conferencing, _super);
    function Conferencing() {
        _super.apply(this, arguments);
    }
    Conferencing.prototype.createUrl = function () {
        return '/account/~/extension/~/conferencing';
    };
    return Conferencing;
})(helper.Helper);
exports.Conferencing = Conferencing;
function $get(context) {
    return context.createSingleton('Conferencing', function () {
        return new Conferencing(context);
    });
}
exports.$get = $get;


/***/ },
/* 24 */
/***/ function(module, exports, __webpack_require__) {

/// <reference path="../../typings/externals.d.ts" />
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var helper = __webpack_require__(9);
var Country = (function (_super) {
    __extends(Country, _super);
    function Country() {
        _super.apply(this, arguments);
    }
    Country.prototype.createUrl = function (options, id) {
        return '/dictionary/country';
    };
    return Country;
})(helper.Helper);
exports.Country = Country;
function $get(context) {
    return context.createSingleton('Country', function () {
        return new Country(context);
    });
}
exports.$get = $get;


/***/ },
/* 25 */
/***/ function(module, exports, __webpack_require__) {

/// <reference path="../../typings/externals.d.ts" />
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var helper = __webpack_require__(9);
var validator = __webpack_require__(17);
var extension = __webpack_require__(27);
var deviceModel = __webpack_require__(26);
var Device = (function (_super) {
    __extends(Device, _super);
    function Device(context) {
        _super.call(this, context);
        this.validator = validator.$get(context);
        this.extension = extension.$get(context);
        this.deviceModel = deviceModel.$get(context);
    }
    Device.prototype.createUrl = function (options, id) {
        options = options || {};
        if (options.order)
            return '/account/~/order';
        return '/account/~' + (options.extensionId ? '/extension/' + options.extensionId : '') + '/device' + (id ? '/' + id : '');
    };
    /**
     * @param {IDevice} item
     */
    Device.prototype.validate = function (item) {
        return this.validator.validate([
            { field: 'emergencyServiceAddress-street', validator: this.validator.required(item && item.emergencyServiceAddress && item.emergencyServiceAddress.street) },
            { field: 'emergencyServiceAddress-city', validator: this.validator.required(item && item.emergencyServiceAddress && item.emergencyServiceAddress.city) },
            { field: 'emergencyServiceAddress-state', validator: this.validator.required(item && item.emergencyServiceAddress && item.emergencyServiceAddress.state) },
            { field: 'emergencyServiceAddress-country', validator: this.validator.required(item && item.emergencyServiceAddress && item.emergencyServiceAddress.country) },
            { field: 'emergencyServiceAddress-zip', validator: this.validator.required(item && item.emergencyServiceAddress && item.emergencyServiceAddress.zip) },
            { field: 'emergencyServiceAddress-customerName', validator: this.validator.required(item && item.emergencyServiceAddress && item.emergencyServiceAddress.customerName) },
            { field: 'extension', validator: this.validator.required(this.extension.getId(item && item.extension)) },
            { field: 'model', validator: this.validator.required(this.deviceModel.getId(item && item.model)) }
        ]);
    };
    return Device;
})(helper.Helper);
exports.Device = Device;
function $get(context) {
    return context.createSingleton('Device', function () {
        return new Device(context);
    });
}
exports.$get = $get;


/***/ },
/* 26 */
/***/ function(module, exports, __webpack_require__) {

/// <reference path="../../typings/externals.d.ts" />
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var helper = __webpack_require__(9);
var DeviceModel = (function (_super) {
    __extends(DeviceModel, _super);
    function DeviceModel() {
        _super.apply(this, arguments);
        /**
         * TODO Remove when http://jira.ringcentral.com/browse/SDK-1 is done
         */
        this.devices = [
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
    }
    DeviceModel.prototype.getId = function (device) {
        if (!device)
            return null;
        return device.id + (device.addons && device.addons[0] ? '-' + device.addons[0].id + '-' + device.addons[0].count : '');
    };
    /**
     * Remove extra textual information from device
     * @exceptionalCase Platform does not understand full device info
     */
    DeviceModel.prototype.cleanForSaving = function (device) {
        if (!device)
            return null;
        delete device.name;
        delete device.deviceClass;
        if (device.addons && device.addons.length > 0) {
            device.addons.forEach(function (addon, i) {
                delete device.addons[i].name;
            });
        }
        else {
            delete device.addons;
        }
        return device;
    };
    return DeviceModel;
})(helper.Helper);
exports.DeviceModel = DeviceModel;
function $get(context) {
    return context.createSingleton('DeviceModel', function () {
        return new DeviceModel(context);
    });
}
exports.$get = $get;


/***/ },
/* 27 */
/***/ function(module, exports, __webpack_require__) {

/// <reference path="../../typings/externals.d.ts" />
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var helper = __webpack_require__(9);
var list = __webpack_require__(10);
var Extension = (function (_super) {
    __extends(Extension, _super);
    function Extension(context) {
        _super.call(this, context);
        this.type = {
            department: 'Department',
            user: 'User',
            announcement: 'Announcement',
            voicemail: 'Voicemail'
        };
        this.list = list.$get(context);
    }
    Extension.prototype.createUrl = function (options, id) {
        options = options || {};
        return '/account/~' + (options.departmentId ? '/department/' + options.departmentId + '/members' : '/extension') + (id ? '/' + id : '');
    };
    Extension.prototype.isUser = function (extension) {
        return extension && extension.type == this.type.user;
    };
    Extension.prototype.isDepartment = function (extension) {
        return extension && extension.type == this.type.department;
    };
    Extension.prototype.isAnnouncement = function (extension) {
        return extension && extension.type == this.type.announcement;
    };
    Extension.prototype.isVoicemail = function (extension) {
        return extension && extension.type == this.type.voicemail;
    };
    Extension.prototype.comparator = function (options) {
        return this.list.comparator(this.utils.extend({
            sortBy: 'extensionNumber',
            compareFn: this.list.numberComparator
        }, options));
    };
    Extension.prototype.filter = function (options) {
        options = this.utils.extend({
            search: '',
            type: ''
        }, options);
        return this.list.filter([
            { filterBy: 'type', condition: options.type },
            {
                condition: options.search.toLocaleLowerCase(),
                filterFn: this.list.containsFilter,
                extractFn: function (item) {
                    return (item.name && (item.name.toLocaleLowerCase() + ' ')) + (item.extensionNumber && item.extensionNumber.toString().toLocaleLowerCase());
                }
            }
        ]);
    };
    return Extension;
})(helper.Helper);
exports.Extension = Extension;
function $get(context) {
    return context.createSingleton('Extension', function () {
        return new Extension(context);
    });
}
exports.$get = $get;


/***/ },
/* 28 */
/***/ function(module, exports, __webpack_require__) {

/// <reference path="../../typings/externals.d.ts" />
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var helper = __webpack_require__(9);
var list = __webpack_require__(10);
var ForwardingNumber = (function (_super) {
    __extends(ForwardingNumber, _super);
    function ForwardingNumber(context) {
        _super.call(this, context);
        this.list = list.$get(context);
    }
    ForwardingNumber.prototype.createUrl = function (options, id) {
        options = options || {};
        return '/account/~/extension/' + (options.extensionId || '~') + '/forwarding-number' + (id ? '/' + id : '');
    };
    ForwardingNumber.prototype.getId = function (forwardingNumber) {
        return forwardingNumber && (forwardingNumber.id || (forwardingNumber.phoneNumber)); //TODO @exceptionalCase
    };
    ForwardingNumber.prototype.hasFeature = function (phoneNumber, feature) {
        return (!!phoneNumber && !!phoneNumber.features && phoneNumber.features.indexOf(feature) != -1);
    };
    ForwardingNumber.prototype.comparator = function (options) {
        return this.list.comparator(this.utils.extend({
            sortBy: 'label'
        }, options));
    };
    ForwardingNumber.prototype.filter = function (options) {
        var _this = this;
        options = this.utils.extend({
            features: []
        }, options);
        return this.list.filter([{
            condition: options.features.length,
            filterFn: function (item) {
                return options.features.some(function (feature) {
                    return _this.hasFeature(item, feature);
                });
            }
        }]);
    };
    return ForwardingNumber;
})(helper.Helper);
exports.ForwardingNumber = ForwardingNumber;
function $get(context) {
    return context.createSingleton('ForwardingNumber', function () {
        return new ForwardingNumber(context);
    });
}
exports.$get = $get;


/***/ },
/* 29 */
/***/ function(module, exports, __webpack_require__) {

/// <reference path="../../typings/externals.d.ts" />
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var helper = __webpack_require__(9);
var Language = (function (_super) {
    __extends(Language, _super);
    function Language() {
        _super.apply(this, arguments);
        this.languages = [
            {
                id: '1033',
                name: 'English (US)'
            },
            {
                id: '3084',
                name: 'French (Canada)'
            }
        ];
    }
    return Language;
})(helper.Helper);
exports.Language = Language;
function $get(context) {
    return context.createSingleton('Language', function () {
        return new Language(context);
    });
}
exports.$get = $get;


/***/ },
/* 30 */
/***/ function(module, exports, __webpack_require__) {

/// <reference path="../../typings/externals.d.ts" />
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var helper = __webpack_require__(9);
var list = __webpack_require__(10);
var state = __webpack_require__(37);
var Location = (function (_super) {
    __extends(Location, _super);
    function Location(context) {
        _super.call(this, context);
        this.list = list.$get(context);
        this.state = state.$get(context);
    }
    Location.prototype.createUrl = function () {
        return '/dictionary/location';
    };
    Location.prototype.filter = function (options) {
        var _this = this;
        var uniqueNPAs = [];
        options = this.utils.extend({
            stateId: '',
            onlyUniqueNPA: false
        }, options);
        return this.list.filter([
            {
                condition: options.stateId,
                filterFn: function (item, opts) {
                    return (_this.state.getId(item.state) == opts.condition);
                }
            },
            {
                condition: options.onlyUniqueNPA,
                filterFn: function (item, opts) {
                    if (uniqueNPAs.indexOf(item.npa) == -1) {
                        uniqueNPAs.push(item.npa);
                        return true;
                    }
                    else {
                        return false;
                    }
                }
            }
        ]);
    };
    Location.prototype.comparator = function (options) {
        options = this.utils.extend({
            sortBy: 'npa'
        }, options);
        if (options.sortBy == 'nxx') {
            options.extractFn = function (item) {
                return (parseInt(item.npa) * 1000000) + parseInt(item.nxx);
            };
            options.compareFn = this.list.numberComparator;
        }
        return this.list.comparator(options);
    };
    return Location;
})(helper.Helper);
exports.Location = Location;
function $get(context) {
    return context.createSingleton('Location', function () {
        return new Location(context);
    });
}
exports.$get = $get;


/***/ },
/* 31 */
/***/ function(module, exports, __webpack_require__) {

/// <reference path="../../typings/externals.d.ts" />
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var helper = __webpack_require__(9);
var list = __webpack_require__(10);
var validator = __webpack_require__(17);
var subscription = __webpack_require__(15);
var platform = __webpack_require__(14);
var contact = __webpack_require__(21);
var Message = (function (_super) {
    __extends(Message, _super);
    function Message(context) {
        _super.call(this, context);
        this.contact = contact.$get(context);
        this.list = list.$get(context);
        this.platform = platform.$get(context);
        this.validator = validator.$get(context);
    }
    /**
     *
     * @exceptionalCase Different endpoint when creating SMS/Pager
     */
    Message.prototype.createUrl = function (options, id) {
        options = options || {};
        var root = '/account/~/extension/' + (options.extensionId || '~');
        if (options.fax)
            return root + '/fax';
        if (options.sms)
            return root + '/sms';
        if (options.pager)
            return root + '/company-pager';
        if (options.sync)
            return root + '/message-sync';
        return root + '/message-store' + (id ? '/' + id : '');
    };
    Message.prototype.isInbound = function (message) {
        return (message && message.direction == 'Inbound');
    };
    Message.prototype.isOutbound = function (message) {
        return !this.isInbound(message);
    };
    Message.prototype.isSMS = function (message) {
        return (message && message.type == 'SMS');
    };
    Message.prototype.isPager = function (message) {
        return (message && message.type == 'Pager');
    };
    Message.prototype.isVoiceMail = function (message) {
        return (message && message.type == 'VoiceMail');
    };
    Message.prototype.isFax = function (message) {
        return (message && message.type == 'Fax');
    };
    Message.prototype.isAlive = function (message) {
        //return (this.availability != 'Deleted' && this.availability != 'Purged');
        return (message && message.availability == 'Alive');
    };
    Message.prototype.isRead = function (message) {
        return (message.readStatus == 'Read');
    };
    Message.prototype.setIsRead = function (message, isRead) {
        message.readStatus = (!!isRead) ? 'Read' : 'Unread';
        return message;
    };
    Message.prototype.getAttachmentUrl = function (message, i) {
        return message.attachments[i] ? this.platform.apiUrl(message.attachments[i].uri, { addMethod: 'GET', addServer: true, addToken: true }) : '';
    };
    Message.prototype.getAttachmentContentType = function (message, i) {
        return message.attachments[i] ? message.attachments[i].contentType : '';
    };
    Message.prototype.getSubscription = function (options) {
        return subscription.$get(this.context).setEvents([this.createUrl(options)]);
    };
    /**
     * Returns from-phones if inbound (oterwise to-phones)
     */
    Message.prototype.getCallerInfos = function (message) {
        return this.isInbound(message) ? [message.from] : message.to;
    };
    /**
     * Returns first from-phones if inbound (oterwise to-phones), then vice-versa
     */
    Message.prototype.getAllCallerInfos = function (message) {
        return this.getCallerInfos(message).concat(this.isInbound(message) ? message.to : [message.from]);
    };
    /**
     * TODO Compare as dates
     */
    Message.prototype.comparator = function (options) {
        return this.list.comparator(this.utils.extend({
            sortBy: 'creationTime'
        }, options));
    };
    Message.prototype.filter = function (options) {
        options = this.utils.extend({
            search: '',
            alive: true,
            direction: '',
            conversationId: '',
            readStatus: ''
        }, options);
        return this.list.filter([
            { condition: options.alive, filterFn: this.isAlive },
            { filterBy: 'type', condition: options.type },
            { filterBy: 'direction', condition: options.direction },
            { filterBy: 'conversationId', condition: options.conversationId },
            { filterBy: 'readStatus', condition: options.readStatus },
            { filterBy: 'subject', condition: options.search, filterFn: this.list.containsFilter }
        ]);
    };
    /**
     * Injects contact field with appropriate {IContact} data structure into all callerInfos found in all messages
     * Warning, this function may be performance-consuming, reduce the amount of items passed to contacts and messages
     */
    Message.prototype.attachContacts = function (contacts, messages, options) {
        var self = this;
        // Flatten all caller infos from all messages
        var callerInfos = messages.reduce(function (callerInfos, message) {
            return callerInfos.concat(self.getAllCallerInfos(message));
        }, []);
        this.contact.attachToCallerInfos(callerInfos, contacts, options);
    };
    Message.prototype.shorten = function (message) {
        return {
            from: message.from,
            to: message.to,
            text: message.subject
        };
    };
    Message.prototype.validateSMS = function (item) {
        return this.validator.validate([
            { field: 'to', validator: this.validator.required(this.utils.getProperty(item, 'to[0].phoneNumber')) },
            { field: 'from', validator: this.validator.required(this.utils.getProperty(item, 'from.phoneNumber')) },
            { field: 'subject', validator: this.validator.required(this.utils.getProperty(item, 'subject')) },
            { field: 'subject', validator: this.validator.length(this.utils.getProperty(item, 'subject'), 160) }
        ]);
    };
    Message.prototype.validatePager = function (item) {
        return this.validator.validate([
            { field: 'to', validator: this.validator.required(this.utils.getProperty(item, 'to.extensionNumber')) },
            { field: 'from', validator: this.validator.required(this.utils.getProperty(item, 'from.extensionNumber')) },
            { field: 'subject', validator: this.validator.required(this.utils.getProperty(item, 'subject')) },
            { field: 'subject', validator: this.validator.length(this.utils.getProperty(item, 'subject'), 160) }
        ]);
    };
    return Message;
})(helper.Helper);
exports.Message = Message;
function $get(context) {
    return context.createSingleton('Message', function () {
        return new Message(context);
    });
}
exports.$get = $get;


/***/ },
/* 32 */
/***/ function(module, exports, __webpack_require__) {

/// <reference path="../../typings/externals.d.ts" />
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var helper = __webpack_require__(9);
var list = __webpack_require__(10);
var extension = __webpack_require__(27);
var PhoneNumber = (function (_super) {
    __extends(PhoneNumber, _super);
    function PhoneNumber(context) {
        _super.call(this, context);
        this.extension = extension.$get(context);
        this.list = list.$get(context);
    }
    PhoneNumber.prototype.createUrl = function (options, id) {
        options = options || {};
        if (options.lookup)
            return '/number-pool/lookup';
        return '/account/~' + (options.extensionId ? '/extension/' + options.extensionId : '') + '/phone-number' + (id ? '/' + id : '');
    };
    PhoneNumber.prototype.isSMS = function (phoneNumber) {
        return this.hasFeature(phoneNumber, 'SmsSender');
    };
    PhoneNumber.prototype.hasFeature = function (phoneNumber, feature) {
        return (!!phoneNumber.features && phoneNumber.features.indexOf(feature) != -1);
    };
    PhoneNumber.prototype.reserve = function (phoneNumber, date) {
        phoneNumber.reservedTill = new Date(date).toISOString();
    };
    PhoneNumber.prototype.unreserve = function (phoneNumber) {
        phoneNumber.reservedTill = null;
    };
    PhoneNumber.prototype.comparator = function (options) {
        return this.list.comparator(this.utils.extend({
            extractFn: function (item) {
                return item.usageType + '-' + item.paymentType + '-' + item.type;
            }
        }, options));
    };
    /**
     * TODO Add other filtering methods http://jira.ringcentral.com/browse/SDK-5
     */
    PhoneNumber.prototype.filter = function (options) {
        var _this = this;
        options = this.utils.extend({
            usageType: '',
            paymentType: '',
            type: '',
            features: []
        }, options);
        return this.list.filter([
            { filterBy: 'usageType', condition: options.usageType },
            { filterBy: 'paymentType', condition: options.paymentType },
            { filterBy: 'type', condition: options.type },
            {
                condition: options.features.length,
                filterFn: function (item) {
                    return options.features.some(function (feature) {
                        return _this.hasFeature(item, feature);
                    });
                }
            }
        ]);
    };
    return PhoneNumber;
})(helper.Helper);
exports.PhoneNumber = PhoneNumber;
function $get(context) {
    return context.createSingleton('PhoneNumber', function () {
        return new PhoneNumber(context);
    });
}
exports.$get = $get;


/***/ },
/* 33 */
/***/ function(module, exports, __webpack_require__) {

/// <reference path="../../typings/externals.d.ts" />
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var helper = __webpack_require__(9);
var subscription = __webpack_require__(15);
var extension = __webpack_require__(27);
var Presence = (function (_super) {
    __extends(Presence, _super);
    function Presence(context) {
        _super.call(this, context);
        this.extension = extension.$get(context);
    }
    Presence.prototype.createUrl = function (options, id) {
        options = options || {};
        return '/account/~/extension/' + (id || '~') + '/presence' + (options.detailed ? '?detailedTelephonyState=true' : '');
    };
    Presence.prototype.getId = function (presence) {
        return presence && (this.extension.getId(presence.extension) || presence.extensionId);
    };
    Presence.prototype.isAvailable = function (presence) {
        return presence && presence.presenceStatus == 'Available';
    };
    Presence.prototype.getSubscription = function (options, id) {
        return subscription.$get(this.context).setEvents([this.createUrl(options, id)]);
    };
    Presence.prototype.updateSubscription = function (subscription, presences, options) {
        var _this = this;
        var events = presences.map(this.getId, this).map(function (id) {
            return _this.createUrl(options, id);
        }, this);
        subscription.addEvents(events);
        return subscription;
    };
    Presence.prototype.attachToExtensions = function (extensions, presences, merge) {
        var _this = this;
        var index = this.index(presences);
        extensions.forEach(function (ex) {
            var presence = index[_this.extension.getId(ex)];
            if (presence) {
                if ('presence' in ex && merge) {
                    _this.utils.extend(ex.presence, presence);
                }
                else {
                    ex.presence = presence;
                }
            }
        }, this);
        return this;
    };
    Presence.prototype.isCallInProgress = function (presenceCall) {
        return (presenceCall && presenceCall.telephonyStatus != 'NoCall');
    };
    return Presence;
})(helper.Helper);
exports.Presence = Presence;
function $get(context) {
    return context.createSingleton('Presence', function () {
        return new Presence(context);
    });
}
exports.$get = $get;


/***/ },
/* 34 */
/***/ function(module, exports, __webpack_require__) {

/// <reference path="../../typings/externals.d.ts" />
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var helper = __webpack_require__(9);
var validator = __webpack_require__(17);
var Ringout = (function (_super) {
    __extends(Ringout, _super);
    function Ringout(context) {
        _super.call(this, context);
        this.validator = validator.$get(context);
    }
    Ringout.prototype.createUrl = function (options, id) {
        options = options || {};
        return '/account/~/extension/' + (options.extensionId || '~') + '/ringout' + (id ? '/' + id : '');
    };
    Ringout.prototype.resetAsNew = function (object) {
        object = _super.prototype.resetAsNew.call(this, object);
        if (object) {
            delete object.status;
        }
        return object;
    };
    Ringout.prototype.isInProgress = function (ringout) {
        return ringout && !this.isNew(ringout) && ringout.status && ringout.status.callStatus == 'InProgress';
    };
    Ringout.prototype.isSuccess = function (ringout) {
        return ringout && !this.isNew(ringout) && ringout.status && ringout.status.callStatus == 'Success';
    };
    Ringout.prototype.isError = function (ringout) {
        return !this.isNew(ringout) && !this.isInProgress(ringout) && !this.isSuccess(ringout);
    };
    Ringout.prototype.validate = function (item) {
        return this.validator.validate([
            { field: 'to', validator: this.validator.required(item && item.to && item.to.phoneNumber) },
            { field: 'from', validator: this.validator.required(item && item.from && item.from.phoneNumber) }
        ]);
    };
    return Ringout;
})(helper.Helper);
exports.Ringout = Ringout;
function $get(context) {
    return context.createSingleton('Ringout', function () {
        return new Ringout(context);
    });
}
exports.$get = $get;


/***/ },
/* 35 */
/***/ function(module, exports, __webpack_require__) {

/// <reference path="../../typings/externals.d.ts" />
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var helper = __webpack_require__(9);
var Service = (function (_super) {
    __extends(Service, _super);
    function Service() {
        _super.apply(this, arguments);
        this.isSmsEnabled = this.isServiceFeatureEnabledMethod('SMS');
        this.isSmsReceivingEnabled = this.isServiceFeatureEnabledMethod('SMSReceiving');
        this.isPresenceEnabled = this.isServiceFeatureEnabledMethod('Presence');
        this.isRingOutEnabled = this.isServiceFeatureEnabledMethod('RingOut');
        this.isInternationalCallingEnabled = this.isServiceFeatureEnabledMethod('InternationalCalling');
        this.isDndEnabled = this.isServiceFeatureEnabledMethod('DND');
        this.isFaxEnabled = this.isServiceFeatureEnabledMethod('Fax');
        this.isFaxReceivingEnabled = this.isServiceFeatureEnabledMethod('FaxReceiving');
        this.isVoicemailEnabled = this.isServiceFeatureEnabledMethod('Voicemail');
        this.isPagerEnabled = this.isServiceFeatureEnabledMethod('Pager');
        this.isPagerReceivingEnabled = this.isServiceFeatureEnabledMethod('PagerReceiving');
        this.isVoipCallingEnabled = this.isServiceFeatureEnabledMethod('VoipCalling');
        this.isVideoConferencingEnabled = this.isServiceFeatureEnabledMethod('VideoConferencing');
        this.isSalesForceEnabled = this.isServiceFeatureEnabledMethod('SalesForce');
        this.isIntercomEnabled = this.isServiceFeatureEnabledMethod('Intercom');
        this.isPagingEnabled = this.isServiceFeatureEnabledMethod('Paging');
        this.isConferencingEnabled = this.isServiceFeatureEnabledMethod('Conferencing');
        this.isFreeSoftPhoneLinesEnabled = this.isServiceFeatureEnabledMethod('FreeSoftPhoneLines');
        this.isHipaaComplianceEnabled = this.isServiceFeatureEnabledMethod('HipaaCompliance');
        this.isCallParkEnabled = this.isServiceFeatureEnabledMethod('CallPark');
        this.isOnDemandCallRecordingEnabled = this.isServiceFeatureEnabledMethod('OnDemandCallRecording');
    }
    Service.prototype.createUrl = function () {
        return '/account/~/service-info';
    };
    Service.prototype.isEnabled = function (feature, serviceFeatures) {
        return serviceFeatures.reduce(function (value, f) {
            if (f.featureName == feature)
                value = f.enabled;
            return value;
        }, false);
    };
    Service.prototype.isServiceFeatureEnabledMethod = function (feature) {
        var _this = this;
        return function (serviceFeatures) {
            return _this.isEnabled(feature, serviceFeatures);
        };
    };
    return Service;
})(helper.Helper);
exports.Service = Service;
function $get(context) {
    return context.createSingleton('Service', function () {
        return new Service(context);
    });
}
exports.$get = $get;


/***/ },
/* 36 */
/***/ function(module, exports, __webpack_require__) {

/// <reference path="../../typings/externals.d.ts" />
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var helper = __webpack_require__(9);
var ShippingMethod = (function (_super) {
    __extends(ShippingMethod, _super);
    function ShippingMethod() {
        _super.apply(this, arguments);
        /**
         * TODO Remove when http://jira.ringcentral.com/browse/SDK-3 id done
         */
        this.shippingMethods = [
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
    }
    return ShippingMethod;
})(helper.Helper);
exports.ShippingMethod = ShippingMethod;
function $get(context) {
    return context.createSingleton('ShippingMethod', function () {
        return new ShippingMethod(context);
    });
}
exports.$get = $get;


/***/ },
/* 37 */
/***/ function(module, exports, __webpack_require__) {

/// <reference path="../../typings/externals.d.ts" />
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var helper = __webpack_require__(9);
var list = __webpack_require__(10);
var country = __webpack_require__(24);
var State = (function (_super) {
    __extends(State, _super);
    function State(context) {
        _super.call(this, context);
        this.countryHelper = country.$get(context);
        this.list = list.$get(context);
    }
    State.prototype.createUrl = function () {
        return '/dictionary/state';
    };
    State.prototype.filter = function (options) {
        var _this = this;
        options = this.utils.extend({
            countryId: ''
        }, options);
        return this.list.filter([
            {
                condition: options.countryId,
                filterFn: function (item, opts) {
                    return (_this.countryHelper.getId(item.country) == opts.condition);
                }
            }
        ]);
    };
    return State;
})(helper.Helper);
exports.State = State;
function $get(context) {
    return context.createSingleton('State', function () {
        return new State(context);
    });
}
exports.$get = $get;


/***/ },
/* 38 */
/***/ function(module, exports, __webpack_require__) {

/// <reference path="../../typings/externals.d.ts" />
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var helper = __webpack_require__(9);
var Timezone = (function (_super) {
    __extends(Timezone, _super);
    function Timezone() {
        _super.apply(this, arguments);
    }
    Timezone.prototype.createUrl = function () {
        return '/dictionary/timezone';
    };
    return Timezone;
})(helper.Helper);
exports.Timezone = Timezone;
function $get(context) {
    return context.createSingleton('Timezone', function () {
        return new Timezone(context);
    });
}
exports.$get = $get;


/***/ },
/* 39 */
/***/ function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(module) {// Version: 3.7.10
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
,   SDK_VER         = '3.7.10'
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
            si += k + "=" + encode(params[k]) ;
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
            ,   auth_key        = args['auth_key']    || AUTH_KEY
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
                        'data'     : _get_url_params({ 'uuid' : UUID, 'auth' : auth_key }),
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
                        'auth_key' : auth_key
                    });

                    // Presence Subscribed?
                    if (settings.subscribed) return;

                    // See Who's Here Now?
                    if (noheresync) return;
                    SELF['here_now']({
                        'channel_group'  : channel_group,
                        'data'           : _get_url_params({ 'uuid' : UUID, 'auth' : auth_key }),
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
                    timeout( CONNECT, SECOND );
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

                var data = _get_url_params({ 'uuid' : UUID, 'auth' : auth_key });

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
            ,   channel         = args['channel']
            ,   channel_group   = args['channel_group']
            ,   jsonp           = jsonp_cb()
            ,   ttl             = args['ttl']
            ,   r               = (args['read'] )?"1":"0"
            ,   w               = (args['write'])?"1":"0"
            ,   m               = (args['manage'])?"1":"0"
            ,   auth_key        = args['auth_key'];

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

function crypto_obj (){

    return {

        'encrypt': function(data, key, options) {
            options = options || {};
            if (!key) return data;
            var cipher_key = options.encryptKey ? CryptoJS.SHA256(key) : key;
            var hex_message = JSON['stringify'](data);
            var encryptedHexArray = CryptoJS.AES.encrypt(hex_message, cipher_key, {
                mode: options.mode == 'ECB' ? CryptoJS.mode.ECB : CryptoJS.mode.CBC,
                padding: CryptoJS.pad.Pkcs7
            });
            var base_64_encrypted = CryptoJS.enc.Base64.stringify(encryptedHexArray);
            return base_64_encrypted;
        },

        'decrypt': function(data, key, options) {
            options = options || {};
            if (!key) return data;
            var cipher_key = options.encryptKey ? CryptoJS.SHA256(key) : key;
            try {
                var binary_enc = CryptoJS.enc.Base64.parse(data);
                var json_plain = CryptoJS.AES.decrypt({ciphertext: data}, key, {
                    mode: options.mode == 'ECB' ? CryptoJS.mode.ECB : CryptoJS.mode.CBC,
                    padding: CryptoJS.pad.Pkcs7
                }).toString(CryptoJS.enc.Utf8);
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
,   PNSDK           = 'PubNub-JS-' + 'Web' + '/' + '3.7.10'
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

        xhr.onerror = xhr.onabort   = function(){ done(
            1, xhr.responseText || { "error" : "Network Connection Error"}
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

    SELF['hmac_SHA256'] = get_hmac_SHA256;
    SELF['crypto_obj'] = crypto_obj();


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
(function(h){for(var s=CryptoJS,f=s.lib,g=f.WordArray,q=f.Hasher,f=s.algo,m=[],r=[],l=function(a){return 4294967296*(a-(a|0))|0},k=2,n=0;64>n;){var j;a:{j=k;for(var u=h.sqrt(j),t=2;t<=u;t++)if(!(j%t)){j=!1;break a}j=!0}j&&(8>n&&(m[n]=l(h.pow(k,0.5))),r[n]=l(h.pow(k,1/3)),n++);k++}var a=[],f=f.SHA256=q.extend({_doReset:function(){this._hash=new g.init(m.slice(0))},_doProcessBlock:function(c,d){for(var b=this._hash.words,e=b[0],f=b[1],g=b[2],j=b[3],h=b[4],m=b[5],n=b[6],q=b[7],p=0;64>p;p++){if(16>p)a[p]=
c[d+p]|0;else{var k=a[p-15],l=a[p-2];a[p]=((k<<25|k>>>7)^(k<<14|k>>>18)^k>>>3)+a[p-7]+((l<<15|l>>>17)^(l<<13|l>>>19)^l>>>10)+a[p-16]}k=q+((h<<26|h>>>6)^(h<<21|h>>>11)^(h<<7|h>>>25))+(h&m^~h&n)+r[p]+a[p];l=((e<<30|e>>>2)^(e<<19|e>>>13)^(e<<10|e>>>22))+(e&f^e&g^f&g);q=n;n=m;m=h;h=j+k|0;j=g;g=f;f=e;e=k+l|0}b[0]=b[0]+e|0;b[1]=b[1]+f|0;b[2]=b[2]+g|0;b[3]=b[3]+j|0;b[4]=b[4]+h|0;b[5]=b[5]+m|0;b[6]=b[6]+n|0;b[7]=b[7]+q|0},_doFinalize:function(){var a=this._data,d=a.words,b=8*this._nDataBytes,e=8*a.sigBytes;
d[e>>>5]|=128<<24-e%32;d[(e+64>>>9<<4)+14]=h.floor(b/4294967296);d[(e+64>>>9<<4)+15]=b;a.sigBytes=4*d.length;this._process();return this._hash},clone:function(){var a=q.clone.call(this);a._hash=this._hash.clone();return a}});s.SHA256=q._createHelper(f);s.HmacSHA256=q._createHmacHelper(f)})(Math);
(function(){var h=CryptoJS,s=h.enc.Utf8;h.algo.HMAC=h.lib.Base.extend({init:function(f,g){f=this._hasher=new f.init;"string"==typeof g&&(g=s.parse(g));var h=f.blockSize,m=4*h;g.sigBytes>m&&(g=f.finalize(g));g.clamp();for(var r=this._oKey=g.clone(),l=this._iKey=g.clone(),k=r.words,n=l.words,j=0;j<h;j++)k[j]^=1549556828,n[j]^=909522486;r.sigBytes=l.sigBytes=m;this.reset()},reset:function(){var f=this._hasher;f.reset();f.update(this._iKey)},update:function(f){this._hasher.update(f);return this},finalize:function(f){var g=
this._hasher;f=g.finalize(f);g.reset();return g.finalize(this._oKey.clone().concat(f))}})})();
/*
CryptoJS v3.1.2
code.google.com/p/crypto-js
(c) 2009-2013 by Jeff Mott. All rights reserved.
code.google.com/p/crypto-js/wiki/License
*/
(function(){var h=CryptoJS,j=h.lib.WordArray;h.enc.Base64={stringify:function(b){var e=b.words,f=b.sigBytes,c=this._map;b.clamp();b=[];for(var a=0;a<f;a+=3)for(var d=(e[a>>>2]>>>24-8*(a%4)&255)<<16|(e[a+1>>>2]>>>24-8*((a+1)%4)&255)<<8|e[a+2>>>2]>>>24-8*((a+2)%4)&255,g=0;4>g&&a+0.75*g<f;g++)b.push(c.charAt(d>>>6*(3-g)&63));if(e=c.charAt(64))for(;b.length%4;)b.push(e);return b.join("")},parse:function(b){var e=b.length,f=this._map,c=f.charAt(64);c&&(c=b.indexOf(c),-1!=c&&(e=c));for(var c=[],a=0,d=0;d<
e;d++)if(d%4){var g=f.indexOf(b.charAt(d-1))<<2*(d%4),h=f.indexOf(b.charAt(d))>>>6-2*(d%4);c[a>>>2]|=(g|h)<<24-8*(a%4);a++}return j.create(c,a)},_map:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/="}})();
/*
CryptoJS v3.1.2
code.google.com/p/crypto-js
(c) 2009-2013 by Jeff Mott. All rights reserved.
code.google.com/p/crypto-js/wiki/License
*/
(function(){var u=CryptoJS,p=u.lib.WordArray;u.enc.Base64={stringify:function(d){var l=d.words,p=d.sigBytes,t=this._map;d.clamp();d=[];for(var r=0;r<p;r+=3)for(var w=(l[r>>>2]>>>24-8*(r%4)&255)<<16|(l[r+1>>>2]>>>24-8*((r+1)%4)&255)<<8|l[r+2>>>2]>>>24-8*((r+2)%4)&255,v=0;4>v&&r+0.75*v<p;v++)d.push(t.charAt(w>>>6*(3-v)&63));if(l=t.charAt(64))for(;d.length%4;)d.push(l);return d.join("")},parse:function(d){var l=d.length,s=this._map,t=s.charAt(64);t&&(t=d.indexOf(t),-1!=t&&(l=t));for(var t=[],r=0,w=0;w<
l;w++)if(w%4){var v=s.indexOf(d.charAt(w-1))<<2*(w%4),b=s.indexOf(d.charAt(w))>>>6-2*(w%4);t[r>>>2]|=(v|b)<<24-8*(r%4);r++}return p.create(t,r)},_map:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/="}})();
(function(u){function p(b,n,a,c,e,j,k){b=b+(n&a|~n&c)+e+k;return(b<<j|b>>>32-j)+n}function d(b,n,a,c,e,j,k){b=b+(n&c|a&~c)+e+k;return(b<<j|b>>>32-j)+n}function l(b,n,a,c,e,j,k){b=b+(n^a^c)+e+k;return(b<<j|b>>>32-j)+n}function s(b,n,a,c,e,j,k){b=b+(a^(n|~c))+e+k;return(b<<j|b>>>32-j)+n}for(var t=CryptoJS,r=t.lib,w=r.WordArray,v=r.Hasher,r=t.algo,b=[],x=0;64>x;x++)b[x]=4294967296*u.abs(u.sin(x+1))|0;r=r.MD5=v.extend({_doReset:function(){this._hash=new w.init([1732584193,4023233417,2562383102,271733878])},
_doProcessBlock:function(q,n){for(var a=0;16>a;a++){var c=n+a,e=q[c];q[c]=(e<<8|e>>>24)&16711935|(e<<24|e>>>8)&4278255360}var a=this._hash.words,c=q[n+0],e=q[n+1],j=q[n+2],k=q[n+3],z=q[n+4],r=q[n+5],t=q[n+6],w=q[n+7],v=q[n+8],A=q[n+9],B=q[n+10],C=q[n+11],u=q[n+12],D=q[n+13],E=q[n+14],x=q[n+15],f=a[0],m=a[1],g=a[2],h=a[3],f=p(f,m,g,h,c,7,b[0]),h=p(h,f,m,g,e,12,b[1]),g=p(g,h,f,m,j,17,b[2]),m=p(m,g,h,f,k,22,b[3]),f=p(f,m,g,h,z,7,b[4]),h=p(h,f,m,g,r,12,b[5]),g=p(g,h,f,m,t,17,b[6]),m=p(m,g,h,f,w,22,b[7]),
f=p(f,m,g,h,v,7,b[8]),h=p(h,f,m,g,A,12,b[9]),g=p(g,h,f,m,B,17,b[10]),m=p(m,g,h,f,C,22,b[11]),f=p(f,m,g,h,u,7,b[12]),h=p(h,f,m,g,D,12,b[13]),g=p(g,h,f,m,E,17,b[14]),m=p(m,g,h,f,x,22,b[15]),f=d(f,m,g,h,e,5,b[16]),h=d(h,f,m,g,t,9,b[17]),g=d(g,h,f,m,C,14,b[18]),m=d(m,g,h,f,c,20,b[19]),f=d(f,m,g,h,r,5,b[20]),h=d(h,f,m,g,B,9,b[21]),g=d(g,h,f,m,x,14,b[22]),m=d(m,g,h,f,z,20,b[23]),f=d(f,m,g,h,A,5,b[24]),h=d(h,f,m,g,E,9,b[25]),g=d(g,h,f,m,k,14,b[26]),m=d(m,g,h,f,v,20,b[27]),f=d(f,m,g,h,D,5,b[28]),h=d(h,f,
m,g,j,9,b[29]),g=d(g,h,f,m,w,14,b[30]),m=d(m,g,h,f,u,20,b[31]),f=l(f,m,g,h,r,4,b[32]),h=l(h,f,m,g,v,11,b[33]),g=l(g,h,f,m,C,16,b[34]),m=l(m,g,h,f,E,23,b[35]),f=l(f,m,g,h,e,4,b[36]),h=l(h,f,m,g,z,11,b[37]),g=l(g,h,f,m,w,16,b[38]),m=l(m,g,h,f,B,23,b[39]),f=l(f,m,g,h,D,4,b[40]),h=l(h,f,m,g,c,11,b[41]),g=l(g,h,f,m,k,16,b[42]),m=l(m,g,h,f,t,23,b[43]),f=l(f,m,g,h,A,4,b[44]),h=l(h,f,m,g,u,11,b[45]),g=l(g,h,f,m,x,16,b[46]),m=l(m,g,h,f,j,23,b[47]),f=s(f,m,g,h,c,6,b[48]),h=s(h,f,m,g,w,10,b[49]),g=s(g,h,f,m,
E,15,b[50]),m=s(m,g,h,f,r,21,b[51]),f=s(f,m,g,h,u,6,b[52]),h=s(h,f,m,g,k,10,b[53]),g=s(g,h,f,m,B,15,b[54]),m=s(m,g,h,f,e,21,b[55]),f=s(f,m,g,h,v,6,b[56]),h=s(h,f,m,g,x,10,b[57]),g=s(g,h,f,m,t,15,b[58]),m=s(m,g,h,f,D,21,b[59]),f=s(f,m,g,h,z,6,b[60]),h=s(h,f,m,g,C,10,b[61]),g=s(g,h,f,m,j,15,b[62]),m=s(m,g,h,f,A,21,b[63]);a[0]=a[0]+f|0;a[1]=a[1]+m|0;a[2]=a[2]+g|0;a[3]=a[3]+h|0},_doFinalize:function(){var b=this._data,n=b.words,a=8*this._nDataBytes,c=8*b.sigBytes;n[c>>>5]|=128<<24-c%32;var e=u.floor(a/
4294967296);n[(c+64>>>9<<4)+15]=(e<<8|e>>>24)&16711935|(e<<24|e>>>8)&4278255360;n[(c+64>>>9<<4)+14]=(a<<8|a>>>24)&16711935|(a<<24|a>>>8)&4278255360;b.sigBytes=4*(n.length+1);this._process();b=this._hash;n=b.words;for(a=0;4>a;a++)c=n[a],n[a]=(c<<8|c>>>24)&16711935|(c<<24|c>>>8)&4278255360;return b},clone:function(){var b=v.clone.call(this);b._hash=this._hash.clone();return b}});t.MD5=v._createHelper(r);t.HmacMD5=v._createHmacHelper(r)})(Math);
(function(){var u=CryptoJS,p=u.lib,d=p.Base,l=p.WordArray,p=u.algo,s=p.EvpKDF=d.extend({cfg:d.extend({keySize:4,hasher:p.MD5,iterations:1}),init:function(d){this.cfg=this.cfg.extend(d)},compute:function(d,r){for(var p=this.cfg,s=p.hasher.create(),b=l.create(),u=b.words,q=p.keySize,p=p.iterations;u.length<q;){n&&s.update(n);var n=s.update(d).finalize(r);s.reset();for(var a=1;a<p;a++)n=s.finalize(n),s.reset();b.concat(n)}b.sigBytes=4*q;return b}});u.EvpKDF=function(d,l,p){return s.create(p).compute(d,
l)}})();
CryptoJS.lib.Cipher||function(u){var p=CryptoJS,d=p.lib,l=d.Base,s=d.WordArray,t=d.BufferedBlockAlgorithm,r=p.enc.Base64,w=p.algo.EvpKDF,v=d.Cipher=t.extend({cfg:l.extend(),createEncryptor:function(e,a){return this.create(this._ENC_XFORM_MODE,e,a)},createDecryptor:function(e,a){return this.create(this._DEC_XFORM_MODE,e,a)},init:function(e,a,b){this.cfg=this.cfg.extend(b);this._xformMode=e;this._key=a;this.reset()},reset:function(){t.reset.call(this);this._doReset()},process:function(e){this._append(e);return this._process()},
finalize:function(e){e&&this._append(e);return this._doFinalize()},keySize:4,ivSize:4,_ENC_XFORM_MODE:1,_DEC_XFORM_MODE:2,_createHelper:function(e){return{encrypt:function(b,k,d){return("string"==typeof k?c:a).encrypt(e,b,k,d)},decrypt:function(b,k,d){return("string"==typeof k?c:a).decrypt(e,b,k,d)}}}});d.StreamCipher=v.extend({_doFinalize:function(){return this._process(!0)},blockSize:1});var b=p.mode={},x=function(e,a,b){var c=this._iv;c?this._iv=u:c=this._prevBlock;for(var d=0;d<b;d++)e[a+d]^=
c[d]},q=(d.BlockCipherMode=l.extend({createEncryptor:function(e,a){return this.Encryptor.create(e,a)},createDecryptor:function(e,a){return this.Decryptor.create(e,a)},init:function(e,a){this._cipher=e;this._iv=a}})).extend();q.Encryptor=q.extend({processBlock:function(e,a){var b=this._cipher,c=b.blockSize;x.call(this,e,a,c);b.encryptBlock(e,a);this._prevBlock=e.slice(a,a+c)}});q.Decryptor=q.extend({processBlock:function(e,a){var b=this._cipher,c=b.blockSize,d=e.slice(a,a+c);b.decryptBlock(e,a);x.call(this,
e,a,c);this._prevBlock=d}});b=b.CBC=q;q=(p.pad={}).Pkcs7={pad:function(a,b){for(var c=4*b,c=c-a.sigBytes%c,d=c<<24|c<<16|c<<8|c,l=[],n=0;n<c;n+=4)l.push(d);c=s.create(l,c);a.concat(c)},unpad:function(a){a.sigBytes-=a.words[a.sigBytes-1>>>2]&255}};d.BlockCipher=v.extend({cfg:v.cfg.extend({mode:b,padding:q}),reset:function(){v.reset.call(this);var a=this.cfg,b=a.iv,a=a.mode;if(this._xformMode==this._ENC_XFORM_MODE)var c=a.createEncryptor;else c=a.createDecryptor,this._minBufferSize=1;this._mode=c.call(a,
this,b&&b.words)},_doProcessBlock:function(a,b){this._mode.processBlock(a,b)},_doFinalize:function(){var a=this.cfg.padding;if(this._xformMode==this._ENC_XFORM_MODE){a.pad(this._data,this.blockSize);var b=this._process(!0)}else b=this._process(!0),a.unpad(b);return b},blockSize:4});var n=d.CipherParams=l.extend({init:function(a){this.mixIn(a)},toString:function(a){return(a||this.formatter).stringify(this)}}),b=(p.format={}).OpenSSL={stringify:function(a){var b=a.ciphertext;a=a.salt;return(a?s.create([1398893684,
1701076831]).concat(a).concat(b):b).toString(r)},parse:function(a){a=r.parse(a);var b=a.words;if(1398893684==b[0]&&1701076831==b[1]){var c=s.create(b.slice(2,4));b.splice(0,4);a.sigBytes-=16}return n.create({ciphertext:a,salt:c})}},a=d.SerializableCipher=l.extend({cfg:l.extend({format:b}),encrypt:function(a,b,c,d){d=this.cfg.extend(d);var l=a.createEncryptor(c,d);b=l.finalize(b);l=l.cfg;return n.create({ciphertext:b,key:c,iv:l.iv,algorithm:a,mode:l.mode,padding:l.padding,blockSize:a.blockSize,formatter:d.format})},
decrypt:function(a,b,c,d){d=this.cfg.extend(d);b=this._parse(b,d.format);return a.createDecryptor(c,d).finalize(b.ciphertext)},_parse:function(a,b){return"string"==typeof a?b.parse(a,this):a}}),p=(p.kdf={}).OpenSSL={execute:function(a,b,c,d){d||(d=s.random(8));a=w.create({keySize:b+c}).compute(a,d);c=s.create(a.words.slice(b),4*c);a.sigBytes=4*b;return n.create({key:a,iv:c,salt:d})}},c=d.PasswordBasedCipher=a.extend({cfg:a.cfg.extend({kdf:p}),encrypt:function(b,c,d,l){l=this.cfg.extend(l);d=l.kdf.execute(d,
b.keySize,b.ivSize);l.iv=d.iv;b=a.encrypt.call(this,b,c,d.key,l);b.mixIn(d);return b},decrypt:function(b,c,d,l){l=this.cfg.extend(l);c=this._parse(c,l.format);d=l.kdf.execute(d,b.keySize,b.ivSize,c.salt);l.iv=d.iv;return a.decrypt.call(this,b,c,d.key,l)}})}();
(function(){for(var u=CryptoJS,p=u.lib.BlockCipher,d=u.algo,l=[],s=[],t=[],r=[],w=[],v=[],b=[],x=[],q=[],n=[],a=[],c=0;256>c;c++)a[c]=128>c?c<<1:c<<1^283;for(var e=0,j=0,c=0;256>c;c++){var k=j^j<<1^j<<2^j<<3^j<<4,k=k>>>8^k&255^99;l[e]=k;s[k]=e;var z=a[e],F=a[z],G=a[F],y=257*a[k]^16843008*k;t[e]=y<<24|y>>>8;r[e]=y<<16|y>>>16;w[e]=y<<8|y>>>24;v[e]=y;y=16843009*G^65537*F^257*z^16843008*e;b[k]=y<<24|y>>>8;x[k]=y<<16|y>>>16;q[k]=y<<8|y>>>24;n[k]=y;e?(e=z^a[a[a[G^z]]],j^=a[a[j]]):e=j=1}var H=[0,1,2,4,8,
16,32,64,128,27,54],d=d.AES=p.extend({_doReset:function(){for(var a=this._key,c=a.words,d=a.sigBytes/4,a=4*((this._nRounds=d+6)+1),e=this._keySchedule=[],j=0;j<a;j++)if(j<d)e[j]=c[j];else{var k=e[j-1];j%d?6<d&&4==j%d&&(k=l[k>>>24]<<24|l[k>>>16&255]<<16|l[k>>>8&255]<<8|l[k&255]):(k=k<<8|k>>>24,k=l[k>>>24]<<24|l[k>>>16&255]<<16|l[k>>>8&255]<<8|l[k&255],k^=H[j/d|0]<<24);e[j]=e[j-d]^k}c=this._invKeySchedule=[];for(d=0;d<a;d++)j=a-d,k=d%4?e[j]:e[j-4],c[d]=4>d||4>=j?k:b[l[k>>>24]]^x[l[k>>>16&255]]^q[l[k>>>
8&255]]^n[l[k&255]]},encryptBlock:function(a,b){this._doCryptBlock(a,b,this._keySchedule,t,r,w,v,l)},decryptBlock:function(a,c){var d=a[c+1];a[c+1]=a[c+3];a[c+3]=d;this._doCryptBlock(a,c,this._invKeySchedule,b,x,q,n,s);d=a[c+1];a[c+1]=a[c+3];a[c+3]=d},_doCryptBlock:function(a,b,c,d,e,j,l,f){for(var m=this._nRounds,g=a[b]^c[0],h=a[b+1]^c[1],k=a[b+2]^c[2],n=a[b+3]^c[3],p=4,r=1;r<m;r++)var q=d[g>>>24]^e[h>>>16&255]^j[k>>>8&255]^l[n&255]^c[p++],s=d[h>>>24]^e[k>>>16&255]^j[n>>>8&255]^l[g&255]^c[p++],t=
d[k>>>24]^e[n>>>16&255]^j[g>>>8&255]^l[h&255]^c[p++],n=d[n>>>24]^e[g>>>16&255]^j[h>>>8&255]^l[k&255]^c[p++],g=q,h=s,k=t;q=(f[g>>>24]<<24|f[h>>>16&255]<<16|f[k>>>8&255]<<8|f[n&255])^c[p++];s=(f[h>>>24]<<24|f[k>>>16&255]<<16|f[n>>>8&255]<<8|f[g&255])^c[p++];t=(f[k>>>24]<<24|f[n>>>16&255]<<16|f[g>>>8&255]<<8|f[h&255])^c[p++];n=(f[n>>>24]<<24|f[g>>>16&255]<<16|f[h>>>8&255]<<8|f[k&255])^c[p++];a[b]=q;a[b+1]=s;a[b+2]=t;a[b+3]=n},keySize:8});u.AES=p._createHelper(d)})();

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(49)(module)))

/***/ },
/* 40 */
/***/ function(module, exports, __webpack_require__) {

(function(e,r){true?module.exports=exports=r(__webpack_require__(42),__webpack_require__(45),__webpack_require__(46),__webpack_require__(47),__webpack_require__(48)):"function"==typeof define&&define.amd?define(["./core","./enc-base64","./md5","./evpkdf","./cipher-core"],r):r(e.CryptoJS)})(this,function(e){return function(){var r=e,t=r.lib,i=t.BlockCipher,o=r.algo,n=[],c=[],s=[],a=[],f=[],u=[],h=[],p=[],d=[],l=[];(function(){for(var e=[],r=0;256>r;r++)e[r]=128>r?r<<1:283^r<<1;for(var t=0,i=0,r=0;256>r;r++){var o=i^i<<1^i<<2^i<<3^i<<4;o=99^(o>>>8^255&o),n[t]=o,c[o]=t;var y=e[t],v=e[y],m=e[v],x=257*e[o]^16843008*o;s[t]=x<<24|x>>>8,a[t]=x<<16|x>>>16,f[t]=x<<8|x>>>24,u[t]=x;var x=16843009*m^65537*v^257*y^16843008*t;h[o]=x<<24|x>>>8,p[o]=x<<16|x>>>16,d[o]=x<<8|x>>>24,l[o]=x,t?(t=y^e[e[e[m^y]]],i^=e[e[i]]):t=i=1}})();var y=[0,1,2,4,8,16,32,64,128,27,54],v=o.AES=i.extend({_doReset:function(){for(var e=this._key,r=e.words,t=e.sigBytes/4,i=this._nRounds=t+6,o=4*(i+1),c=this._keySchedule=[],s=0;o>s;s++)if(t>s)c[s]=r[s];else{var a=c[s-1];s%t?t>6&&4==s%t&&(a=n[a>>>24]<<24|n[255&a>>>16]<<16|n[255&a>>>8]<<8|n[255&a]):(a=a<<8|a>>>24,a=n[a>>>24]<<24|n[255&a>>>16]<<16|n[255&a>>>8]<<8|n[255&a],a^=y[0|s/t]<<24),c[s]=c[s-t]^a}for(var f=this._invKeySchedule=[],u=0;o>u;u++){var s=o-u;if(u%4)var a=c[s];else var a=c[s-4];f[u]=4>u||4>=s?a:h[n[a>>>24]]^p[n[255&a>>>16]]^d[n[255&a>>>8]]^l[n[255&a]]}},encryptBlock:function(e,r){this._doCryptBlock(e,r,this._keySchedule,s,a,f,u,n)},decryptBlock:function(e,r){var t=e[r+1];e[r+1]=e[r+3],e[r+3]=t,this._doCryptBlock(e,r,this._invKeySchedule,h,p,d,l,c);var t=e[r+1];e[r+1]=e[r+3],e[r+3]=t},_doCryptBlock:function(e,r,t,i,o,n,c,s){for(var a=this._nRounds,f=e[r]^t[0],u=e[r+1]^t[1],h=e[r+2]^t[2],p=e[r+3]^t[3],d=4,l=1;a>l;l++){var y=i[f>>>24]^o[255&u>>>16]^n[255&h>>>8]^c[255&p]^t[d++],v=i[u>>>24]^o[255&h>>>16]^n[255&p>>>8]^c[255&f]^t[d++],m=i[h>>>24]^o[255&p>>>16]^n[255&f>>>8]^c[255&u]^t[d++],x=i[p>>>24]^o[255&f>>>16]^n[255&u>>>8]^c[255&h]^t[d++];f=y,u=v,h=m,p=x}var y=(s[f>>>24]<<24|s[255&u>>>16]<<16|s[255&h>>>8]<<8|s[255&p])^t[d++],v=(s[u>>>24]<<24|s[255&h>>>16]<<16|s[255&p>>>8]<<8|s[255&f])^t[d++],m=(s[h>>>24]<<24|s[255&p>>>16]<<16|s[255&f>>>8]<<8|s[255&u])^t[d++],x=(s[p>>>24]<<24|s[255&f>>>16]<<16|s[255&u>>>8]<<8|s[255&h])^t[d++];e[r]=y,e[r+1]=v,e[r+2]=m,e[r+3]=x},keySize:8});r.AES=i._createHelper(v)}(),e.AES});

/***/ },
/* 41 */
/***/ function(module, exports, __webpack_require__) {

(function(e,r){true?module.exports=exports=r(__webpack_require__(42),__webpack_require__(48)):"function"==typeof define&&define.amd?define(["./core","./cipher-core"],r):r(e.CryptoJS)})(this,function(e){return e.mode.ECB=function(){var r=e.lib.BlockCipherMode.extend();return r.Encryptor=r.extend({processBlock:function(e,r){this._cipher.encryptBlock(e,r)}}),r.Decryptor=r.extend({processBlock:function(e,r){this._cipher.decryptBlock(e,r)}}),r}(),e.mode.ECB});

/***/ },
/* 42 */
/***/ function(module, exports, __webpack_require__) {

(function(e,r){true?module.exports=exports=r():"function"==typeof define&&define.amd?define([],r):e.CryptoJS=r()})(this,function(){var e=e||function(e,r){var t={},i=t.lib={},n=i.Base=function(){function e(){}return{extend:function(r){e.prototype=this;var t=new e;return r&&t.mixIn(r),t.hasOwnProperty("init")||(t.init=function(){t.$super.init.apply(this,arguments)}),t.init.prototype=t,t.$super=this,t},create:function(){var e=this.extend();return e.init.apply(e,arguments),e},init:function(){},mixIn:function(e){for(var r in e)e.hasOwnProperty(r)&&(this[r]=e[r]);e.hasOwnProperty("toString")&&(this.toString=e.toString)},clone:function(){return this.init.prototype.extend(this)}}}(),o=i.WordArray=n.extend({init:function(e,t){e=this.words=e||[],this.sigBytes=t!=r?t:4*e.length},toString:function(e){return(e||s).stringify(this)},concat:function(e){var r=this.words,t=e.words,i=this.sigBytes,n=e.sigBytes;if(this.clamp(),i%4)for(var o=0;n>o;o++){var c=255&t[o>>>2]>>>24-8*(o%4);r[i+o>>>2]|=c<<24-8*((i+o)%4)}else if(t.length>65535)for(var o=0;n>o;o+=4)r[i+o>>>2]=t[o>>>2];else r.push.apply(r,t);return this.sigBytes+=n,this},clamp:function(){var r=this.words,t=this.sigBytes;r[t>>>2]&=4294967295<<32-8*(t%4),r.length=e.ceil(t/4)},clone:function(){var e=n.clone.call(this);return e.words=this.words.slice(0),e},random:function(r){for(var t=[],i=0;r>i;i+=4)t.push(0|4294967296*e.random());return new o.init(t,r)}}),c=t.enc={},s=c.Hex={stringify:function(e){for(var r=e.words,t=e.sigBytes,i=[],n=0;t>n;n++){var o=255&r[n>>>2]>>>24-8*(n%4);i.push((o>>>4).toString(16)),i.push((15&o).toString(16))}return i.join("")},parse:function(e){for(var r=e.length,t=[],i=0;r>i;i+=2)t[i>>>3]|=parseInt(e.substr(i,2),16)<<24-4*(i%8);return new o.init(t,r/2)}},u=c.Latin1={stringify:function(e){for(var r=e.words,t=e.sigBytes,i=[],n=0;t>n;n++){var o=255&r[n>>>2]>>>24-8*(n%4);i.push(String.fromCharCode(o))}return i.join("")},parse:function(e){for(var r=e.length,t=[],i=0;r>i;i++)t[i>>>2]|=(255&e.charCodeAt(i))<<24-8*(i%4);return new o.init(t,r)}},f=c.Utf8={stringify:function(e){try{return decodeURIComponent(escape(u.stringify(e)))}catch(r){throw Error("Malformed UTF-8 data")}},parse:function(e){return u.parse(unescape(encodeURIComponent(e)))}},a=i.BufferedBlockAlgorithm=n.extend({reset:function(){this._data=new o.init,this._nDataBytes=0},_append:function(e){"string"==typeof e&&(e=f.parse(e)),this._data.concat(e),this._nDataBytes+=e.sigBytes},_process:function(r){var t=this._data,i=t.words,n=t.sigBytes,c=this.blockSize,s=4*c,u=n/s;u=r?e.ceil(u):e.max((0|u)-this._minBufferSize,0);var f=u*c,a=e.min(4*f,n);if(f){for(var p=0;f>p;p+=c)this._doProcessBlock(i,p);var d=i.splice(0,f);t.sigBytes-=a}return new o.init(d,a)},clone:function(){var e=n.clone.call(this);return e._data=this._data.clone(),e},_minBufferSize:0});i.Hasher=a.extend({cfg:n.extend(),init:function(e){this.cfg=this.cfg.extend(e),this.reset()},reset:function(){a.reset.call(this),this._doReset()},update:function(e){return this._append(e),this._process(),this},finalize:function(e){e&&this._append(e);var r=this._doFinalize();return r},blockSize:16,_createHelper:function(e){return function(r,t){return new e.init(t).finalize(r)}},_createHmacHelper:function(e){return function(r,t){return new p.HMAC.init(e,t).finalize(r)}}});var p=t.algo={};return t}(Math);return e});

/***/ },
/* 43 */
/***/ function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_RESULT__;/* WEBPACK VAR INJECTION */(function(process, global, module) {/*!
 * @overview es6-promise - a tiny implementation of Promises/A+.
 * @copyright Copyright (c) 2014 Yehuda Katz, Tom Dale, Stefan Penner and contributors (Conversion to ES6 API by Jake Archibald)
 * @license   Licensed under MIT license
 *            See https://raw.githubusercontent.com/jakearchibald/es6-promise/master/LICENSE
 * @version   2.0.1
 */

(function() {
    "use strict";

    function $$utils$$objectOrFunction(x) {
      return typeof x === 'function' || (typeof x === 'object' && x !== null);
    }

    function $$utils$$isFunction(x) {
      return typeof x === 'function';
    }

    function $$utils$$isMaybeThenable(x) {
      return typeof x === 'object' && x !== null;
    }

    var $$utils$$_isArray;

    if (!Array.isArray) {
      $$utils$$_isArray = function (x) {
        return Object.prototype.toString.call(x) === '[object Array]';
      };
    } else {
      $$utils$$_isArray = Array.isArray;
    }

    var $$utils$$isArray = $$utils$$_isArray;
    var $$utils$$now = Date.now || function() { return new Date().getTime(); };
    function $$utils$$F() { }

    var $$utils$$o_create = (Object.create || function (o) {
      if (arguments.length > 1) {
        throw new Error('Second argument not supported');
      }
      if (typeof o !== 'object') {
        throw new TypeError('Argument must be an object');
      }
      $$utils$$F.prototype = o;
      return new $$utils$$F();
    });

    var $$asap$$len = 0;

    var $$asap$$default = function asap(callback, arg) {
      $$asap$$queue[$$asap$$len] = callback;
      $$asap$$queue[$$asap$$len + 1] = arg;
      $$asap$$len += 2;
      if ($$asap$$len === 2) {
        // If len is 1, that means that we need to schedule an async flush.
        // If additional callbacks are queued before the queue is flushed, they
        // will be processed by this flush that we are scheduling.
        $$asap$$scheduleFlush();
      }
    };

    var $$asap$$browserGlobal = (typeof window !== 'undefined') ? window : {};
    var $$asap$$BrowserMutationObserver = $$asap$$browserGlobal.MutationObserver || $$asap$$browserGlobal.WebKitMutationObserver;

    // test for web worker but not in IE10
    var $$asap$$isWorker = typeof Uint8ClampedArray !== 'undefined' &&
      typeof importScripts !== 'undefined' &&
      typeof MessageChannel !== 'undefined';

    // node
    function $$asap$$useNextTick() {
      return function() {
        process.nextTick($$asap$$flush);
      };
    }

    function $$asap$$useMutationObserver() {
      var iterations = 0;
      var observer = new $$asap$$BrowserMutationObserver($$asap$$flush);
      var node = document.createTextNode('');
      observer.observe(node, { characterData: true });

      return function() {
        node.data = (iterations = ++iterations % 2);
      };
    }

    // web worker
    function $$asap$$useMessageChannel() {
      var channel = new MessageChannel();
      channel.port1.onmessage = $$asap$$flush;
      return function () {
        channel.port2.postMessage(0);
      };
    }

    function $$asap$$useSetTimeout() {
      return function() {
        setTimeout($$asap$$flush, 1);
      };
    }

    var $$asap$$queue = new Array(1000);

    function $$asap$$flush() {
      for (var i = 0; i < $$asap$$len; i+=2) {
        var callback = $$asap$$queue[i];
        var arg = $$asap$$queue[i+1];

        callback(arg);

        $$asap$$queue[i] = undefined;
        $$asap$$queue[i+1] = undefined;
      }

      $$asap$$len = 0;
    }

    var $$asap$$scheduleFlush;

    // Decide what async method to use to triggering processing of queued callbacks:
    if (typeof process !== 'undefined' && {}.toString.call(process) === '[object process]') {
      $$asap$$scheduleFlush = $$asap$$useNextTick();
    } else if ($$asap$$BrowserMutationObserver) {
      $$asap$$scheduleFlush = $$asap$$useMutationObserver();
    } else if ($$asap$$isWorker) {
      $$asap$$scheduleFlush = $$asap$$useMessageChannel();
    } else {
      $$asap$$scheduleFlush = $$asap$$useSetTimeout();
    }

    function $$$internal$$noop() {}
    var $$$internal$$PENDING   = void 0;
    var $$$internal$$FULFILLED = 1;
    var $$$internal$$REJECTED  = 2;
    var $$$internal$$GET_THEN_ERROR = new $$$internal$$ErrorObject();

    function $$$internal$$selfFullfillment() {
      return new TypeError("You cannot resolve a promise with itself");
    }

    function $$$internal$$cannotReturnOwn() {
      return new TypeError('A promises callback cannot return that same promise.')
    }

    function $$$internal$$getThen(promise) {
      try {
        return promise.then;
      } catch(error) {
        $$$internal$$GET_THEN_ERROR.error = error;
        return $$$internal$$GET_THEN_ERROR;
      }
    }

    function $$$internal$$tryThen(then, value, fulfillmentHandler, rejectionHandler) {
      try {
        then.call(value, fulfillmentHandler, rejectionHandler);
      } catch(e) {
        return e;
      }
    }

    function $$$internal$$handleForeignThenable(promise, thenable, then) {
       $$asap$$default(function(promise) {
        var sealed = false;
        var error = $$$internal$$tryThen(then, thenable, function(value) {
          if (sealed) { return; }
          sealed = true;
          if (thenable !== value) {
            $$$internal$$resolve(promise, value);
          } else {
            $$$internal$$fulfill(promise, value);
          }
        }, function(reason) {
          if (sealed) { return; }
          sealed = true;

          $$$internal$$reject(promise, reason);
        }, 'Settle: ' + (promise._label || ' unknown promise'));

        if (!sealed && error) {
          sealed = true;
          $$$internal$$reject(promise, error);
        }
      }, promise);
    }

    function $$$internal$$handleOwnThenable(promise, thenable) {
      if (thenable._state === $$$internal$$FULFILLED) {
        $$$internal$$fulfill(promise, thenable._result);
      } else if (promise._state === $$$internal$$REJECTED) {
        $$$internal$$reject(promise, thenable._result);
      } else {
        $$$internal$$subscribe(thenable, undefined, function(value) {
          $$$internal$$resolve(promise, value);
        }, function(reason) {
          $$$internal$$reject(promise, reason);
        });
      }
    }

    function $$$internal$$handleMaybeThenable(promise, maybeThenable) {
      if (maybeThenable.constructor === promise.constructor) {
        $$$internal$$handleOwnThenable(promise, maybeThenable);
      } else {
        var then = $$$internal$$getThen(maybeThenable);

        if (then === $$$internal$$GET_THEN_ERROR) {
          $$$internal$$reject(promise, $$$internal$$GET_THEN_ERROR.error);
        } else if (then === undefined) {
          $$$internal$$fulfill(promise, maybeThenable);
        } else if ($$utils$$isFunction(then)) {
          $$$internal$$handleForeignThenable(promise, maybeThenable, then);
        } else {
          $$$internal$$fulfill(promise, maybeThenable);
        }
      }
    }

    function $$$internal$$resolve(promise, value) {
      if (promise === value) {
        $$$internal$$reject(promise, $$$internal$$selfFullfillment());
      } else if ($$utils$$objectOrFunction(value)) {
        $$$internal$$handleMaybeThenable(promise, value);
      } else {
        $$$internal$$fulfill(promise, value);
      }
    }

    function $$$internal$$publishRejection(promise) {
      if (promise._onerror) {
        promise._onerror(promise._result);
      }

      $$$internal$$publish(promise);
    }

    function $$$internal$$fulfill(promise, value) {
      if (promise._state !== $$$internal$$PENDING) { return; }

      promise._result = value;
      promise._state = $$$internal$$FULFILLED;

      if (promise._subscribers.length === 0) {
      } else {
        $$asap$$default($$$internal$$publish, promise);
      }
    }

    function $$$internal$$reject(promise, reason) {
      if (promise._state !== $$$internal$$PENDING) { return; }
      promise._state = $$$internal$$REJECTED;
      promise._result = reason;

      $$asap$$default($$$internal$$publishRejection, promise);
    }

    function $$$internal$$subscribe(parent, child, onFulfillment, onRejection) {
      var subscribers = parent._subscribers;
      var length = subscribers.length;

      parent._onerror = null;

      subscribers[length] = child;
      subscribers[length + $$$internal$$FULFILLED] = onFulfillment;
      subscribers[length + $$$internal$$REJECTED]  = onRejection;

      if (length === 0 && parent._state) {
        $$asap$$default($$$internal$$publish, parent);
      }
    }

    function $$$internal$$publish(promise) {
      var subscribers = promise._subscribers;
      var settled = promise._state;

      if (subscribers.length === 0) { return; }

      var child, callback, detail = promise._result;

      for (var i = 0; i < subscribers.length; i += 3) {
        child = subscribers[i];
        callback = subscribers[i + settled];

        if (child) {
          $$$internal$$invokeCallback(settled, child, callback, detail);
        } else {
          callback(detail);
        }
      }

      promise._subscribers.length = 0;
    }

    function $$$internal$$ErrorObject() {
      this.error = null;
    }

    var $$$internal$$TRY_CATCH_ERROR = new $$$internal$$ErrorObject();

    function $$$internal$$tryCatch(callback, detail) {
      try {
        return callback(detail);
      } catch(e) {
        $$$internal$$TRY_CATCH_ERROR.error = e;
        return $$$internal$$TRY_CATCH_ERROR;
      }
    }

    function $$$internal$$invokeCallback(settled, promise, callback, detail) {
      var hasCallback = $$utils$$isFunction(callback),
          value, error, succeeded, failed;

      if (hasCallback) {
        value = $$$internal$$tryCatch(callback, detail);

        if (value === $$$internal$$TRY_CATCH_ERROR) {
          failed = true;
          error = value.error;
          value = null;
        } else {
          succeeded = true;
        }

        if (promise === value) {
          $$$internal$$reject(promise, $$$internal$$cannotReturnOwn());
          return;
        }

      } else {
        value = detail;
        succeeded = true;
      }

      if (promise._state !== $$$internal$$PENDING) {
        // noop
      } else if (hasCallback && succeeded) {
        $$$internal$$resolve(promise, value);
      } else if (failed) {
        $$$internal$$reject(promise, error);
      } else if (settled === $$$internal$$FULFILLED) {
        $$$internal$$fulfill(promise, value);
      } else if (settled === $$$internal$$REJECTED) {
        $$$internal$$reject(promise, value);
      }
    }

    function $$$internal$$initializePromise(promise, resolver) {
      try {
        resolver(function resolvePromise(value){
          $$$internal$$resolve(promise, value);
        }, function rejectPromise(reason) {
          $$$internal$$reject(promise, reason);
        });
      } catch(e) {
        $$$internal$$reject(promise, e);
      }
    }

    function $$$enumerator$$makeSettledResult(state, position, value) {
      if (state === $$$internal$$FULFILLED) {
        return {
          state: 'fulfilled',
          value: value
        };
      } else {
        return {
          state: 'rejected',
          reason: value
        };
      }
    }

    function $$$enumerator$$Enumerator(Constructor, input, abortOnReject, label) {
      this._instanceConstructor = Constructor;
      this.promise = new Constructor($$$internal$$noop, label);
      this._abortOnReject = abortOnReject;

      if (this._validateInput(input)) {
        this._input     = input;
        this.length     = input.length;
        this._remaining = input.length;

        this._init();

        if (this.length === 0) {
          $$$internal$$fulfill(this.promise, this._result);
        } else {
          this.length = this.length || 0;
          this._enumerate();
          if (this._remaining === 0) {
            $$$internal$$fulfill(this.promise, this._result);
          }
        }
      } else {
        $$$internal$$reject(this.promise, this._validationError());
      }
    }

    $$$enumerator$$Enumerator.prototype._validateInput = function(input) {
      return $$utils$$isArray(input);
    };

    $$$enumerator$$Enumerator.prototype._validationError = function() {
      return new Error('Array Methods must be provided an Array');
    };

    $$$enumerator$$Enumerator.prototype._init = function() {
      this._result = new Array(this.length);
    };

    var $$$enumerator$$default = $$$enumerator$$Enumerator;

    $$$enumerator$$Enumerator.prototype._enumerate = function() {
      var length  = this.length;
      var promise = this.promise;
      var input   = this._input;

      for (var i = 0; promise._state === $$$internal$$PENDING && i < length; i++) {
        this._eachEntry(input[i], i);
      }
    };

    $$$enumerator$$Enumerator.prototype._eachEntry = function(entry, i) {
      var c = this._instanceConstructor;
      if ($$utils$$isMaybeThenable(entry)) {
        if (entry.constructor === c && entry._state !== $$$internal$$PENDING) {
          entry._onerror = null;
          this._settledAt(entry._state, i, entry._result);
        } else {
          this._willSettleAt(c.resolve(entry), i);
        }
      } else {
        this._remaining--;
        this._result[i] = this._makeResult($$$internal$$FULFILLED, i, entry);
      }
    };

    $$$enumerator$$Enumerator.prototype._settledAt = function(state, i, value) {
      var promise = this.promise;

      if (promise._state === $$$internal$$PENDING) {
        this._remaining--;

        if (this._abortOnReject && state === $$$internal$$REJECTED) {
          $$$internal$$reject(promise, value);
        } else {
          this._result[i] = this._makeResult(state, i, value);
        }
      }

      if (this._remaining === 0) {
        $$$internal$$fulfill(promise, this._result);
      }
    };

    $$$enumerator$$Enumerator.prototype._makeResult = function(state, i, value) {
      return value;
    };

    $$$enumerator$$Enumerator.prototype._willSettleAt = function(promise, i) {
      var enumerator = this;

      $$$internal$$subscribe(promise, undefined, function(value) {
        enumerator._settledAt($$$internal$$FULFILLED, i, value);
      }, function(reason) {
        enumerator._settledAt($$$internal$$REJECTED, i, reason);
      });
    };

    var $$promise$all$$default = function all(entries, label) {
      return new $$$enumerator$$default(this, entries, true /* abort on reject */, label).promise;
    };

    var $$promise$race$$default = function race(entries, label) {
      /*jshint validthis:true */
      var Constructor = this;

      var promise = new Constructor($$$internal$$noop, label);

      if (!$$utils$$isArray(entries)) {
        $$$internal$$reject(promise, new TypeError('You must pass an array to race.'));
        return promise;
      }

      var length = entries.length;

      function onFulfillment(value) {
        $$$internal$$resolve(promise, value);
      }

      function onRejection(reason) {
        $$$internal$$reject(promise, reason);
      }

      for (var i = 0; promise._state === $$$internal$$PENDING && i < length; i++) {
        $$$internal$$subscribe(Constructor.resolve(entries[i]), undefined, onFulfillment, onRejection);
      }

      return promise;
    };

    var $$promise$resolve$$default = function resolve(object, label) {
      /*jshint validthis:true */
      var Constructor = this;

      if (object && typeof object === 'object' && object.constructor === Constructor) {
        return object;
      }

      var promise = new Constructor($$$internal$$noop, label);
      $$$internal$$resolve(promise, object);
      return promise;
    };

    var $$promise$reject$$default = function reject(reason, label) {
      /*jshint validthis:true */
      var Constructor = this;
      var promise = new Constructor($$$internal$$noop, label);
      $$$internal$$reject(promise, reason);
      return promise;
    };

    var $$es6$promise$promise$$counter = 0;

    function $$es6$promise$promise$$needsResolver() {
      throw new TypeError('You must pass a resolver function as the first argument to the promise constructor');
    }

    function $$es6$promise$promise$$needsNew() {
      throw new TypeError("Failed to construct 'Promise': Please use the 'new' operator, this object constructor cannot be called as a function.");
    }

    var $$es6$promise$promise$$default = $$es6$promise$promise$$Promise;

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
    function $$es6$promise$promise$$Promise(resolver) {
      this._id = $$es6$promise$promise$$counter++;
      this._state = undefined;
      this._result = undefined;
      this._subscribers = [];

      if ($$$internal$$noop !== resolver) {
        if (!$$utils$$isFunction(resolver)) {
          $$es6$promise$promise$$needsResolver();
        }

        if (!(this instanceof $$es6$promise$promise$$Promise)) {
          $$es6$promise$promise$$needsNew();
        }

        $$$internal$$initializePromise(this, resolver);
      }
    }

    $$es6$promise$promise$$Promise.all = $$promise$all$$default;
    $$es6$promise$promise$$Promise.race = $$promise$race$$default;
    $$es6$promise$promise$$Promise.resolve = $$promise$resolve$$default;
    $$es6$promise$promise$$Promise.reject = $$promise$reject$$default;

    $$es6$promise$promise$$Promise.prototype = {
      constructor: $$es6$promise$promise$$Promise,

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

        if (state === $$$internal$$FULFILLED && !onFulfillment || state === $$$internal$$REJECTED && !onRejection) {
          return this;
        }

        var child = new this.constructor($$$internal$$noop);
        var result = parent._result;

        if (state) {
          var callback = arguments[state - 1];
          $$asap$$default(function(){
            $$$internal$$invokeCallback(state, child, callback, result);
          });
        } else {
          $$$internal$$subscribe(parent, child, onFulfillment, onRejection);
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

    var $$es6$promise$polyfill$$default = function polyfill() {
      var local;

      if (typeof global !== 'undefined') {
        local = global;
      } else if (typeof window !== 'undefined' && window.document) {
        local = window;
      } else {
        local = self;
      }

      var es6PromiseSupport =
        "Promise" in local &&
        // Some of these methods are missing from
        // Firefox/Chrome experimental implementations
        "resolve" in local.Promise &&
        "reject" in local.Promise &&
        "all" in local.Promise &&
        "race" in local.Promise &&
        // Older version of the spec had a resolver object
        // as the arg rather than a function
        (function() {
          var resolve;
          new local.Promise(function(r) { resolve = r; });
          return $$utils$$isFunction(resolve);
        }());

      if (!es6PromiseSupport) {
        local.Promise = $$es6$promise$promise$$default;
      }
    };

    var es6$promise$umd$$ES6Promise = {
      'Promise': $$es6$promise$promise$$default,
      'polyfill': $$es6$promise$polyfill$$default
    };

    /* global define:true module:true window: true */
    if ("function" === 'function' && __webpack_require__(50)['amd']) {
      !(__WEBPACK_AMD_DEFINE_RESULT__ = function() { return es6$promise$umd$$ES6Promise; }.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
    } else if (typeof module !== 'undefined' && module['exports']) {
      module['exports'] = es6$promise$umd$$ES6Promise;
    } else if (typeof this !== 'undefined') {
      this['ES6Promise'] = es6$promise$umd$$ES6Promise;
    }
}).call(this);
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(53), (function() { return this; }()), __webpack_require__(49)(module)))

/***/ },
/* 44 */
/***/ function(module, exports, __webpack_require__) {

/// <reference path="../../../typings/externals.d.ts" />
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var h = __webpack_require__(51);
var ajaxObserver = __webpack_require__(6);
var r = __webpack_require__(52);
/**
 * TODO @see https://github.com/github/fetch/blob/master/fetch.js
 */
var Request = (function (_super) {
    __extends(Request, _super);
    function Request(context) {
        _super.call(this, context);
        this.async = true;
        this.method = '';
        this.url = '';
        this.query = null;
        this.body = {};
        this.context = context;
        this.xhr = null;
        this.observer = ajaxObserver.$get(context);
    }
    Request.prototype.isLoaded = function () {
        return !!this.xhr;
    };
    Request.prototype.setOptions = function (options) {
        options = options || {};
        // backwards compatibility
        if (!('body' in options) && options.post)
            options.body = options.post;
        if (!('query' in options) && options.get)
            options.query = options.get;
        if ('method' in options)
            this.method = options.method;
        if ('url' in options)
            this.url = options.url;
        if ('query' in options)
            this.query = options.query;
        if ('body' in options)
            this.body = options.body;
        if ('headers' in options)
            this.setHeaders(options.headers);
        if ('async' in options)
            this.async = !!options.async;
        return this;
    };
    /**
     * Checks the send options, defaulting various of the options,
     * and consuming / transforming some of the options (like get).
     */
    Request.prototype.checkOptions = function () {
        if (!this.url)
            throw new Error('Url is not defined');
        if (!this.hasHeader('Accept'))
            this.setHeader('Accept', h.Headers.jsonContentType);
        if (!this.hasHeader('Content-Type'))
            this.setHeader('Content-Type', h.Headers.jsonContentType);
        this.method = this.method ? this.method.toUpperCase() : 'GET';
        if (['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS', 'HEAD'].indexOf(this.method) < 0)
            throw new Error('Method has wrong value');
        return this;
    };
    Request.prototype.getEncodedBody = function () {
        if (this.method === 'GET')
            return null;
        if (typeof this.body === 'string') {
            return this.body;
        }
        else if (this.isJson()) {
            return JSON.stringify(this.body);
        }
        else if (this.isUrlEncoded()) {
            return this.utils.queryStringify(this.body);
        }
        else {
            return this.body;
        }
    };
    Request.prototype.send = function () {
        var _this = this;
        this.observer.emit(this.observer.events.beforeRequest, this);
        var responsePromise = new (this.context.getPromise())(function (resolve, reject) {
            _this.checkOptions();
            var xhr = _this.getXHR(), url = _this.url + (!!_this.query ? ((_this.url.indexOf('?') > -1 ? '&' : '?') + _this.utils.queryStringify(_this.query)) : '');
            xhr.open(_this.method, url, _this.async);
            //@see http://stackoverflow.com/questions/19666809/cors-withcredentials-support-limited
            xhr.withCredentials = true;
            xhr.onload = function () {
                //TODO http://jira.ringcentral.com/browse/PLA-10585
                var response = r.$get(_this.context, xhr.status, xhr.statusText, xhr.responseText, xhr.getAllResponseHeaders());
                if (response.error) {
                    var e = response.error;
                    e.ajax = response; // backwards compatibility
                    e.response = response; //FIXME Circular
                    e.request = _this;
                    reject(e);
                }
                else {
                    resolve(response);
                }
            };
            xhr.onerror = function (event) {
                var e = new Error('The request cannot be sent' + (event ? ' (' + event.toString() + ')' : ''));
                e.request = _this;
                e.response = null;
                e.ajax = null; // backwards compatibility
                reject(e);
            };
            _this.utils.forEach(_this.headers, function (value, header) {
                if (!!value)
                    xhr.setRequestHeader(header, value);
            });
            xhr.send(_this.getEncodedBody());
            _this.xhr = xhr;
        });
        return responsePromise.then(function (response) {
            _this.observer.emit(_this.observer.events.requestSuccess, response, _this);
            return response;
        }).catch(function (e) {
            _this.observer.emit(_this.observer.events.requestError, e);
            throw e;
        });
    };
    Request.prototype.getXHR = function () {
        return this.context.getXHR();
    };
    Request.prototype.destroy = function () {
        if (this.xhr)
            this.xhr.abort();
    };
    return Request;
})(h.Headers);
exports.Request = Request;
function $get(context) {
    return new Request(context);
}
exports.$get = $get;


/***/ },
/* 45 */
/***/ function(module, exports, __webpack_require__) {

(function(e,r){true?module.exports=exports=r(__webpack_require__(42)):"function"==typeof define&&define.amd?define(["./core"],r):r(e.CryptoJS)})(this,function(e){return function(){var r=e,t=r.lib,n=t.WordArray,i=r.enc;i.Base64={stringify:function(e){var r=e.words,t=e.sigBytes,n=this._map;e.clamp();for(var i=[],o=0;t>o;o+=3)for(var c=255&r[o>>>2]>>>24-8*(o%4),f=255&r[o+1>>>2]>>>24-8*((o+1)%4),s=255&r[o+2>>>2]>>>24-8*((o+2)%4),a=c<<16|f<<8|s,u=0;4>u&&t>o+.75*u;u++)i.push(n.charAt(63&a>>>6*(3-u)));var p=n.charAt(64);if(p)for(;i.length%4;)i.push(p);return i.join("")},parse:function(e){var r=e.length,t=this._map,i=t.charAt(64);if(i){var o=e.indexOf(i);-1!=o&&(r=o)}for(var c=[],f=0,s=0;r>s;s++)if(s%4){var a=t.indexOf(e.charAt(s-1))<<2*(s%4),u=t.indexOf(e.charAt(s))>>>6-2*(s%4);c[f>>>2]|=(a|u)<<24-8*(f%4),f++}return n.create(c,f)},_map:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/="}}(),e.enc.Base64});

/***/ },
/* 46 */
/***/ function(module, exports, __webpack_require__) {

(function(e,r){true?module.exports=exports=r(__webpack_require__(42)):"function"==typeof define&&define.amd?define(["./core"],r):r(e.CryptoJS)})(this,function(e){return function(r){function t(e,r,t,n,i,o,c){var s=e+(r&t|~r&n)+i+c;return(s<<o|s>>>32-o)+r}function n(e,r,t,n,i,o,c){var s=e+(r&n|t&~n)+i+c;return(s<<o|s>>>32-o)+r}function i(e,r,t,n,i,o,c){var s=e+(r^t^n)+i+c;return(s<<o|s>>>32-o)+r}function o(e,r,t,n,i,o,c){var s=e+(t^(r|~n))+i+c;return(s<<o|s>>>32-o)+r}var c=e,s=c.lib,f=s.WordArray,a=s.Hasher,u=c.algo,p=[];(function(){for(var e=0;64>e;e++)p[e]=0|4294967296*r.abs(r.sin(e+1))})();var d=u.MD5=a.extend({_doReset:function(){this._hash=new f.init([1732584193,4023233417,2562383102,271733878])},_doProcessBlock:function(e,r){for(var c=0;16>c;c++){var s=r+c,f=e[s];e[s]=16711935&(f<<8|f>>>24)|4278255360&(f<<24|f>>>8)}var a=this._hash.words,u=e[r+0],d=e[r+1],h=e[r+2],y=e[r+3],m=e[r+4],l=e[r+5],x=e[r+6],q=e[r+7],g=e[r+8],v=e[r+9],b=e[r+10],S=e[r+11],A=e[r+12],w=e[r+13],_=e[r+14],C=e[r+15],B=a[0],H=a[1],j=a[2],J=a[3];B=t(B,H,j,J,u,7,p[0]),J=t(J,B,H,j,d,12,p[1]),j=t(j,J,B,H,h,17,p[2]),H=t(H,j,J,B,y,22,p[3]),B=t(B,H,j,J,m,7,p[4]),J=t(J,B,H,j,l,12,p[5]),j=t(j,J,B,H,x,17,p[6]),H=t(H,j,J,B,q,22,p[7]),B=t(B,H,j,J,g,7,p[8]),J=t(J,B,H,j,v,12,p[9]),j=t(j,J,B,H,b,17,p[10]),H=t(H,j,J,B,S,22,p[11]),B=t(B,H,j,J,A,7,p[12]),J=t(J,B,H,j,w,12,p[13]),j=t(j,J,B,H,_,17,p[14]),H=t(H,j,J,B,C,22,p[15]),B=n(B,H,j,J,d,5,p[16]),J=n(J,B,H,j,x,9,p[17]),j=n(j,J,B,H,S,14,p[18]),H=n(H,j,J,B,u,20,p[19]),B=n(B,H,j,J,l,5,p[20]),J=n(J,B,H,j,b,9,p[21]),j=n(j,J,B,H,C,14,p[22]),H=n(H,j,J,B,m,20,p[23]),B=n(B,H,j,J,v,5,p[24]),J=n(J,B,H,j,_,9,p[25]),j=n(j,J,B,H,y,14,p[26]),H=n(H,j,J,B,g,20,p[27]),B=n(B,H,j,J,w,5,p[28]),J=n(J,B,H,j,h,9,p[29]),j=n(j,J,B,H,q,14,p[30]),H=n(H,j,J,B,A,20,p[31]),B=i(B,H,j,J,l,4,p[32]),J=i(J,B,H,j,g,11,p[33]),j=i(j,J,B,H,S,16,p[34]),H=i(H,j,J,B,_,23,p[35]),B=i(B,H,j,J,d,4,p[36]),J=i(J,B,H,j,m,11,p[37]),j=i(j,J,B,H,q,16,p[38]),H=i(H,j,J,B,b,23,p[39]),B=i(B,H,j,J,w,4,p[40]),J=i(J,B,H,j,u,11,p[41]),j=i(j,J,B,H,y,16,p[42]),H=i(H,j,J,B,x,23,p[43]),B=i(B,H,j,J,v,4,p[44]),J=i(J,B,H,j,A,11,p[45]),j=i(j,J,B,H,C,16,p[46]),H=i(H,j,J,B,h,23,p[47]),B=o(B,H,j,J,u,6,p[48]),J=o(J,B,H,j,q,10,p[49]),j=o(j,J,B,H,_,15,p[50]),H=o(H,j,J,B,l,21,p[51]),B=o(B,H,j,J,A,6,p[52]),J=o(J,B,H,j,y,10,p[53]),j=o(j,J,B,H,b,15,p[54]),H=o(H,j,J,B,d,21,p[55]),B=o(B,H,j,J,g,6,p[56]),J=o(J,B,H,j,C,10,p[57]),j=o(j,J,B,H,x,15,p[58]),H=o(H,j,J,B,w,21,p[59]),B=o(B,H,j,J,m,6,p[60]),J=o(J,B,H,j,S,10,p[61]),j=o(j,J,B,H,h,15,p[62]),H=o(H,j,J,B,v,21,p[63]),a[0]=0|a[0]+B,a[1]=0|a[1]+H,a[2]=0|a[2]+j,a[3]=0|a[3]+J},_doFinalize:function(){var e=this._data,t=e.words,n=8*this._nDataBytes,i=8*e.sigBytes;t[i>>>5]|=128<<24-i%32;var o=r.floor(n/4294967296),c=n;t[(i+64>>>9<<4)+15]=16711935&(o<<8|o>>>24)|4278255360&(o<<24|o>>>8),t[(i+64>>>9<<4)+14]=16711935&(c<<8|c>>>24)|4278255360&(c<<24|c>>>8),e.sigBytes=4*(t.length+1),this._process();for(var s=this._hash,f=s.words,a=0;4>a;a++){var u=f[a];f[a]=16711935&(u<<8|u>>>24)|4278255360&(u<<24|u>>>8)}return s},clone:function(){var e=a.clone.call(this);return e._hash=this._hash.clone(),e}});c.MD5=a._createHelper(d),c.HmacMD5=a._createHmacHelper(d)}(Math),e.MD5});

/***/ },
/* 47 */
/***/ function(module, exports, __webpack_require__) {

(function(e,r){true?module.exports=exports=r(__webpack_require__(42),__webpack_require__(54),__webpack_require__(55)):"function"==typeof define&&define.amd?define(["./core","./sha1","./hmac"],r):r(e.CryptoJS)})(this,function(e){return function(){var r=e,t=r.lib,i=t.Base,n=t.WordArray,o=r.algo,a=o.MD5,s=o.EvpKDF=i.extend({cfg:i.extend({keySize:4,hasher:a,iterations:1}),init:function(e){this.cfg=this.cfg.extend(e)},compute:function(e,r){for(var t=this.cfg,i=t.hasher.create(),o=n.create(),a=o.words,s=t.keySize,c=t.iterations;s>a.length;){f&&i.update(f);var f=i.update(e).finalize(r);i.reset();for(var u=1;c>u;u++)f=i.finalize(f),i.reset();o.concat(f)}return o.sigBytes=4*s,o}});r.EvpKDF=function(e,r,t){return s.create(t).compute(e,r)}}(),e.EvpKDF});

/***/ },
/* 48 */
/***/ function(module, exports, __webpack_require__) {

(function(e,r){true?module.exports=exports=r(__webpack_require__(42)):"function"==typeof define&&define.amd?define(["./core"],r):r(e.CryptoJS)})(this,function(e){e.lib.Cipher||function(r){var t=e,i=t.lib,n=i.Base,o=i.WordArray,c=i.BufferedBlockAlgorithm,s=t.enc;s.Utf8;var a=s.Base64,f=t.algo,u=f.EvpKDF,h=i.Cipher=c.extend({cfg:n.extend(),createEncryptor:function(e,r){return this.create(this._ENC_XFORM_MODE,e,r)},createDecryptor:function(e,r){return this.create(this._DEC_XFORM_MODE,e,r)},init:function(e,r,t){this.cfg=this.cfg.extend(t),this._xformMode=e,this._key=r,this.reset()},reset:function(){c.reset.call(this),this._doReset()},process:function(e){return this._append(e),this._process()},finalize:function(e){e&&this._append(e);var r=this._doFinalize();return r},keySize:4,ivSize:4,_ENC_XFORM_MODE:1,_DEC_XFORM_MODE:2,_createHelper:function(){function e(e){return"string"==typeof e?q:_}return function(r){return{encrypt:function(t,i,n){return e(i).encrypt(r,t,i,n)},decrypt:function(t,i,n){return e(i).decrypt(r,t,i,n)}}}}()});i.StreamCipher=h.extend({_doFinalize:function(){var e=this._process(true);return e},blockSize:1});var d=t.mode={},p=i.BlockCipherMode=n.extend({createEncryptor:function(e,r){return this.Encryptor.create(e,r)},createDecryptor:function(e,r){return this.Decryptor.create(e,r)},init:function(e,r){this._cipher=e,this._iv=r}}),l=d.CBC=function(){function e(e,t,i){var n=this._iv;if(n){var o=n;this._iv=r}else var o=this._prevBlock;for(var c=0;i>c;c++)e[t+c]^=o[c]}var t=p.extend();return t.Encryptor=t.extend({processBlock:function(r,t){var i=this._cipher,n=i.blockSize;e.call(this,r,t,n),i.encryptBlock(r,t),this._prevBlock=r.slice(t,t+n)}}),t.Decryptor=t.extend({processBlock:function(r,t){var i=this._cipher,n=i.blockSize,o=r.slice(t,t+n);i.decryptBlock(r,t),e.call(this,r,t,n),this._prevBlock=o}}),t}(),y=t.pad={},v=y.Pkcs7={pad:function(e,r){for(var t=4*r,i=t-e.sigBytes%t,n=i<<24|i<<16|i<<8|i,c=[],s=0;i>s;s+=4)c.push(n);var a=o.create(c,i);e.concat(a)},unpad:function(e){var r=255&e.words[e.sigBytes-1>>>2];e.sigBytes-=r}};i.BlockCipher=h.extend({cfg:h.cfg.extend({mode:l,padding:v}),reset:function(){h.reset.call(this);var e=this.cfg,r=e.iv,t=e.mode;if(this._xformMode==this._ENC_XFORM_MODE)var i=t.createEncryptor;else{var i=t.createDecryptor;this._minBufferSize=1}this._mode=i.call(t,this,r&&r.words)},_doProcessBlock:function(e,r){this._mode.processBlock(e,r)},_doFinalize:function(){var e=this.cfg.padding;if(this._xformMode==this._ENC_XFORM_MODE){e.pad(this._data,this.blockSize);var r=this._process(true)}else{var r=this._process(true);e.unpad(r)}return r},blockSize:4});var g=i.CipherParams=n.extend({init:function(e){this.mixIn(e)},toString:function(e){return(e||this.formatter).stringify(this)}}),m=t.format={},x=m.OpenSSL={stringify:function(e){var r=e.ciphertext,t=e.salt;if(t)var i=o.create([1398893684,1701076831]).concat(t).concat(r);else var i=r;return i.toString(a)},parse:function(e){var r=a.parse(e),t=r.words;if(1398893684==t[0]&&1701076831==t[1]){var i=o.create(t.slice(2,4));t.splice(0,4),r.sigBytes-=16}return g.create({ciphertext:r,salt:i})}},_=i.SerializableCipher=n.extend({cfg:n.extend({format:x}),encrypt:function(e,r,t,i){i=this.cfg.extend(i);var n=e.createEncryptor(t,i),o=n.finalize(r),c=n.cfg;return g.create({ciphertext:o,key:t,iv:c.iv,algorithm:e,mode:c.mode,padding:c.padding,blockSize:e.blockSize,formatter:i.format})},decrypt:function(e,r,t,i){i=this.cfg.extend(i),r=this._parse(r,i.format);var n=e.createDecryptor(t,i).finalize(r.ciphertext);return n},_parse:function(e,r){return"string"==typeof e?r.parse(e,this):e}}),w=t.kdf={},S=w.OpenSSL={execute:function(e,r,t,i){i||(i=o.random(8));var n=u.create({keySize:r+t}).compute(e,i),c=o.create(n.words.slice(r),4*t);return n.sigBytes=4*r,g.create({key:n,iv:c,salt:i})}},q=i.PasswordBasedCipher=_.extend({cfg:_.cfg.extend({kdf:S}),encrypt:function(e,r,t,i){i=this.cfg.extend(i);var n=i.kdf.execute(t,e.keySize,e.ivSize);i.iv=n.iv;var o=_.encrypt.call(this,e,r,n.key,i);return o.mixIn(n),o},decrypt:function(e,r,t,i){i=this.cfg.extend(i),r=this._parse(r,i.format);var n=i.kdf.execute(t,e.keySize,e.ivSize,r.salt);i.iv=n.iv;var o=_.decrypt.call(this,e,r,n.key,i);return o}})}()});

/***/ },
/* 49 */
/***/ function(module, exports, __webpack_require__) {

module.exports = function(module) {
	if(!module.webpackPolyfill) {
		module.deprecate = function() {};
		module.paths = [];
		// module.parent = undefined by default
		module.children = [];
		module.webpackPolyfill = 1;
	}
	return module;
}


/***/ },
/* 50 */
/***/ function(module, exports, __webpack_require__) {

module.exports = function() { throw new Error("define cannot be used indirect"); };


/***/ },
/* 51 */
/***/ function(module, exports, __webpack_require__) {

/// <reference path="../../../typings/externals.d.ts" />
var utils = __webpack_require__(16);
/**
 * @see https://github.com/Microsoft/TypeScript/issues/275
 */
var Headers = (function () {
    function Headers(context) {
        this.headers = {};
        this.context = context;
        this.utils = utils.$get(context);
    }
    Headers.prototype.setHeader = function (name, value) {
        this.headers[name.toLowerCase()] = value;
        return this;
    };
    Headers.prototype.getHeader = function (name) {
        return this.headers[name.toLowerCase()];
    };
    Headers.prototype.hasHeader = function (name) {
        return (name.toLowerCase() in this.headers);
    };
    Headers.prototype.setHeaders = function (headers) {
        var _this = this;
        this.utils.forEach(headers, function (value, name) {
            _this.setHeader(name, value);
        });
        return this;
    };
    Headers.prototype.isContentType = function (contentType) {
        return this.getContentType().indexOf(contentType) > -1;
    };
    Headers.prototype.setContentType = function (contentType) {
        this.setHeader(Headers.contentType, contentType);
        return this;
    };
    Headers.prototype.getContentType = function () {
        return this.getHeader(Headers.contentType) || '';
    };
    Headers.prototype.isMultipart = function () {
        return this.isContentType(Headers.multipartContentType);
    };
    Headers.prototype.isUrlEncoded = function () {
        return this.isContentType(Headers.urlencodedContentType);
    };
    Headers.prototype.isJson = function () {
        return this.isContentType(Headers.jsonContentType);
    };
    Headers.contentType = 'Content-Type';
    Headers.jsonContentType = 'application/json';
    Headers.multipartContentType = 'multipart/mixed';
    Headers.urlencodedContentType = 'application/x-www-form-urlencoded';
    return Headers;
})();
exports.Headers = Headers;


/***/ },
/* 52 */
/***/ function(module, exports, __webpack_require__) {

/// <reference path="../../../typings/externals.d.ts" />
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var h = __webpack_require__(51);
var log = __webpack_require__(11);
var Response = (function (_super) {
    __extends(Response, _super);
    function Response(context, status, statusText, body, headers) {
        var _this = this;
        _super.call(this, context);
        this.log = log.$get(context);
        if (typeof (body) === 'string') {
            body = body.replace(/\r/g, '');
            if (!headers) {
                var tmp = body.split(Response.bodySeparator);
                headers = (tmp.length > 1) ? tmp.shift() : {};
                body = tmp.join(Response.bodySeparator);
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
        //@see http://stackoverflow.com/questions/10046972/msie-returns-status-code-of-1223-for-ajax-request
        if (status == 1223)
            status = 204;
        this.status = status;
        this.statusText = statusText;
        this.body = body;
        try {
            // Step 1. Parse headers
            if (typeof (headers) === 'string') {
                (headers || '').split('\n').forEach(function (header) {
                    if (!header)
                        return;
                    /** @type {string[]} */
                    var parts = header.split(Response.headerSeparator), name = parts.shift().trim();
                    _this.setHeader(name, parts.join(Response.headerSeparator).trim());
                });
            }
            else {
                this.setHeaders(headers);
            }
            // Step 1.1. JEDI proxy sometimes may omit Content-Type header
            if (!this.hasHeader(h.Headers.contentType))
                this.setHeader(h.Headers.contentType, h.Headers.jsonContentType);
            // Step 2. Parse body
            if (this.isJson() && !!this.body && typeof (this.body) === 'string') {
                this.json = JSON.parse(this.body);
                this.data = this.json; // backwards compatibility
                if (!this.checkStatus())
                    this.error = new Error(this.getError());
            }
            else if (this.isMultipart()) {
                // Step 2.1. Split multipart response
                var boundary = this.getContentType().match(/boundary=([^;]+)/i)[1], parts = this.body.split(Response.boundarySeparator + boundary);
                if (parts[0].trim() === '')
                    parts.shift();
                if (parts[parts.length - 1].trim() == Response.boundarySeparator)
                    parts.pop();
                // Step 2.2. Parse status info
                var statusInfo = new Response(this.context, this.status, '', parts.shift());
                // Step 2.3. Parse all other parts
                this.responses = parts.map(function (part, i) {
                    var status = statusInfo.data.response[i].status;
                    return new Response(_this.context, status, '', part);
                });
                this.data = this.responses; // backwards compatibility
            }
            else {
                this.data = this.body;
            }
        }
        catch (e) {
            this.log.error('Response.parseResponse(): Unable to parse data');
            this.log.error(e.stack || e);
            this.log.error(this.body);
            this.error = e;
        }
    }
    /**
     * @returns {boolean}
     */
    Response.prototype.isUnauthorized = function () {
        return (this.status == 401);
    };
    Response.prototype.checkStatus = function () {
        return this.status >= 200 && this.status < 300;
    };
    Response.prototype.getError = function () {
        return this.data.message || this.data.error_description || this.data.description || 'Unknown error';
    };
    Response.boundarySeparator = '--';
    Response.headerSeparator = ':';
    Response.bodySeparator = '\n\n';
    return Response;
})(h.Headers);
exports.Response = Response;
function $get(context, status, statusText, body, headers) {
    return new Response(context, status, statusText, body, headers);
}
exports.$get = $get;


/***/ },
/* 53 */
/***/ function(module, exports, __webpack_require__) {

// shim for using process in browser

var process = module.exports = {};
var queue = [];
var draining = false;

function drainQueue() {
    if (draining) {
        return;
    }
    draining = true;
    var currentQueue;
    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        var i = -1;
        while (++i < len) {
            currentQueue[i]();
        }
        len = queue.length;
    }
    draining = false;
}
process.nextTick = function (fun) {
    queue.push(fun);
    if (!draining) {
        setTimeout(drainQueue, 0);
    }
};

process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

// TODO(shtylman)
process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };


/***/ },
/* 54 */
/***/ function(module, exports, __webpack_require__) {

(function(e,r){true?module.exports=exports=r(__webpack_require__(42)):"function"==typeof define&&define.amd?define(["./core"],r):r(e.CryptoJS)})(this,function(e){return function(){var r=e,t=r.lib,n=t.WordArray,i=t.Hasher,o=r.algo,s=[],c=o.SHA1=i.extend({_doReset:function(){this._hash=new n.init([1732584193,4023233417,2562383102,271733878,3285377520])},_doProcessBlock:function(e,r){for(var t=this._hash.words,n=t[0],i=t[1],o=t[2],c=t[3],a=t[4],f=0;80>f;f++){if(16>f)s[f]=0|e[r+f];else{var u=s[f-3]^s[f-8]^s[f-14]^s[f-16];s[f]=u<<1|u>>>31}var d=(n<<5|n>>>27)+a+s[f];d+=20>f?(i&o|~i&c)+1518500249:40>f?(i^o^c)+1859775393:60>f?(i&o|i&c|o&c)-1894007588:(i^o^c)-899497514,a=c,c=o,o=i<<30|i>>>2,i=n,n=d}t[0]=0|t[0]+n,t[1]=0|t[1]+i,t[2]=0|t[2]+o,t[3]=0|t[3]+c,t[4]=0|t[4]+a},_doFinalize:function(){var e=this._data,r=e.words,t=8*this._nDataBytes,n=8*e.sigBytes;return r[n>>>5]|=128<<24-n%32,r[(n+64>>>9<<4)+14]=Math.floor(t/4294967296),r[(n+64>>>9<<4)+15]=t,e.sigBytes=4*r.length,this._process(),this._hash},clone:function(){var e=i.clone.call(this);return e._hash=this._hash.clone(),e}});r.SHA1=i._createHelper(c),r.HmacSHA1=i._createHmacHelper(c)}(),e.SHA1});

/***/ },
/* 55 */
/***/ function(module, exports, __webpack_require__) {

(function(e,r){true?module.exports=exports=r(__webpack_require__(42)):"function"==typeof define&&define.amd?define(["./core"],r):r(e.CryptoJS)})(this,function(e){(function(){var r=e,t=r.lib,n=t.Base,i=r.enc,o=i.Utf8,a=r.algo;a.HMAC=n.extend({init:function(e,r){e=this._hasher=new e.init,"string"==typeof r&&(r=o.parse(r));var t=e.blockSize,n=4*t;r.sigBytes>n&&(r=e.finalize(r)),r.clamp();for(var i=this._oKey=r.clone(),a=this._iKey=r.clone(),s=i.words,c=a.words,f=0;t>f;f++)s[f]^=1549556828,c[f]^=909522486;i.sigBytes=a.sigBytes=n,this.reset()},reset:function(){var e=this._hasher;e.reset(),e.update(this._iKey)},update:function(e){return this._hasher.update(e),this},finalize:function(e){var r=this._hasher,t=r.finalize(e);r.reset();var n=r.finalize(this._oKey.clone().concat(t));return n}})})()});

/***/ }
/******/ ])
});
;
//# sourceMappingURL=rc-sdk-bundle.js.map