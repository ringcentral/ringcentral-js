(function (root) {
  var core_pubnub_PubnubMock, core_Utils, core_Log, core_xhr_XhrResponse, core_xhr_XhrMock, core_Context, core_Observable, core_AjaxObserver, core_Ajax, core_Cache, core_Platform, core_Subscription, core_PageVisibility, core_Helper, core_Validator, core_List, helpers_Country, helpers_DeviceModel, helpers_Language, helpers_State, helpers_Location, helpers_ShippingMethod, helpers_Timezone, helpers_Account, helpers_BlockedNumber, helpers_Extension, helpers_Presence, helpers_Contact, helpers_Call, helpers_Conferencing, helpers_ContactGroup, helpers_Device, helpers_ForwardingNumber, helpers_Message, helpers_PhoneNumber, helpers_Ringout, helpers_Service, RCSDK;
  core_pubnub_PubnubMock = function (exports) {
    'use strict';
    function PubnubMock(options) {
    }
    PubnubMock.prototype.ready = function () {
    };
    PubnubMock.prototype.unsubscribe = function (options) {
    };
    PubnubMock.prototype.subscribe = function (options) {
      this.onMessage = options.message;
    };
    PubnubMock.prototype.receiveMessage = function (msg) {
      this.onMessage(msg, 'env', 'channel');
    };
    /**
     * @alias RCSDK.core.pubnub.Mock
     * @type {PUBNUB}
     */
    exports = {
      /**
       * @param {Context} context
       * @returns {PUBNUB}
       */
      $get: function (context) {
        return {
          init: function (options) {
            return new PubnubMock(options);
          }
        };
      }
    };
    return exports;
  }({});
  core_Utils = function (exports) {
    'use strict';
    var hasOwn = Object.prototype.hasOwnProperty, toString = Object.prototype.toString, rdigit = /\d/, class2type = {};
    // Populate the class2type map
    'Boolean Number String Function Array Date RegExp Object'.split(' ').forEach(function (name) {
      class2type['[object ' + name + ']'] = name.toLowerCase();
    });
    /**
     * @alias RCSDK.core.Utils
     * @name Utils
     */
    var Utils = exports = {
      /**
       * Ported from jQuery.fn.extend
       * Optional first parameter makes deep copy
       * @param {object} targetObject
       * @param {object} sourceObject
       * @returns {object}
       */
      extend: function extend(targetObject, sourceObject) {
        var options, name, src, copy, copyIsArray, clone, target = arguments[0] || {}, i = 1, length = arguments.length, deep = false;
        // Handle a deep copy situation
        if (typeof target === 'boolean') {
          deep = target;
          // skip the boolean and the target
          target = arguments[i] || {};
          i++;
        }
        // Handle case when target is a string or something (possible in deep copy)
        if (typeof target !== 'object' && !this.isFunction(target)) {
          target = {};
        }
        for (; i < length; i++) {
          // Only deal with non-null/undefined values
          if ((options = arguments[i]) != null) {
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
                target[name] = this.extend(deep, clone, copy);  // Don't bring in undefined values
              } else if (copy !== undefined) {
                target[name] = copy;
              }
            }
          }
        }
        // Return the modified object
        return target;
      },
      forEach: function (object, cb) {
        for (var i in object) {
          if (!object.hasOwnProperty(i))
            continue;
          var res = cb(object[i], i);
          if (res === false)
            break;
        }
      },
      /**
       * TODO Replace with something better
       * @see https://github.com/joyent/node/blob/master/lib/querystring.js
       * @param {object} parameters
       * @returns {string}
       */
      queryStringify: function (parameters) {
        var array = [], self = this;
        this.forEach(parameters, function (v, i) {
          if (self.isArray(v)) {
            v.forEach(function (vv) {
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
      parseQueryString: function (queryString) {
        var argsParsed = {}, self = this;
        queryString.split('&').forEach(function (arg) {
          arg = decodeURIComponent(arg);
          if (arg.indexOf('=') == -1) {
            argsParsed[arg.trim()] = true;
          } else {
            var pair = arg.split('='), key = pair[0].trim(), value = pair[1].trim();
            if (key in argsParsed) {
              if (key in argsParsed && !self.isArray(argsParsed[key]))
                argsParsed[key] = [argsParsed[key]];
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
      isEmail: function (v, multiple) {
        if (!!multiple) {
          //this Regexp is also suitable for multiple emails (comma separated)
          return /^(?:[a-z0-9!#$%&'*+\/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+\/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?[ ,;]*)+$/i.test(v);
        } else {
          return /^[a-z0-9!#$%&'*+\/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+\/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/i.test(v);
        }
      },
      isPhoneNumber: function (v) {
        return /\+?1[0-9]{3}[0-9a-z]{7}/im.test(v.toString().split(/[^0-9a-z\+]/im).join(''));
      },
      /**
       * @param args
       * @returns {Array}
       */
      argumentsToArray: function (args) {
        return Array.prototype.slice.call(args || [], 0);
      },
      isDate: function (obj) {
        return this.type(obj) === 'date';
      },
      isFunction: function (obj) {
        return this.type(obj) === 'function';
      },
      isArray: Array.isArray || function (obj) {
        return this.type(obj) === 'array';
      },
      // A crude way of determining if an object is a window
      isWindow: function (obj) {
        return obj && typeof obj === 'object' && 'setInterval' in obj;
      },
      isNaN: function (obj) {
        return obj == null || !rdigit.test(obj) || isNaN(obj);
      },
      type: function (obj) {
        return obj == null ? String(obj) : class2type[toString.call(obj)] || 'object';
      },
      isPlainObject: function (obj) {
        // Must be an Object.
        // Because of IE, we also have to check the presence of the constructor property.
        // Make sure that DOM nodes and window objects don't pass through, as well
        if (!obj || this.type(obj) !== 'object' || obj.nodeType || this.isWindow(obj)) {
          return false;
        }
        // Not own constructor property must be Object
        if (obj.constructor && !hasOwn.call(obj, 'constructor') && !hasOwn.call(obj.constructor.prototype, 'isPrototypeOf')) {
          return false;
        }
        // Own properties are enumerated firstly, so to speed up,
        // if last one is own, then all properties are own.
        var key;
        for (key in obj) {
        }
        return key === undefined || hasOwn.call(obj, key);
      },
      getProperty: function (obj, property) {
        try {
          return eval('obj.' + property);  //TODO Refactor
        } catch (e) {
          return undefined;
        }
      },
      poll: function (fn, interval, timeout) {
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
      },
      stopPolling: function (timeout) {
        timeout && clearTimeout(timeout);
      },
      parseString: function (s) {
        return s ? s.toString() : '';
      },
      parseNumber: function (n) {
        if (!n)
          return 0;
        n = parseFloat(n);
        return isNaN(n) ? 0 : n;
      },
      $get: function (context) {
        return Utils;
      }
    };
    return exports;
  }({});
  core_Log = function (exports) {
    'use strict';
    var Utils = core_Utils;
    /**
     * @alias RCSDK.core.Log
     * @name Log
     */
    var Log = exports = {
      logDebug: false,
      logInfo: false,
      logWarnings: false,
      logErrors: false,
      addTimestamps: true,
      /** @type {Console} */
      console: console || {
        // safety
        log: function () {
        },
        warn: function () {
        },
        info: function () {
        },
        error: function () {
        }
      },
      disableAll: function () {
        this.logDebug = false;
        this.logInfo = false;
        this.logWarnings = false;
        this.logErrors = false;
      },
      enableAll: function () {
        this.logDebug = true;
        this.logInfo = true;
        this.logWarnings = true;
        this.logErrors = true;
      },
      parseArguments: function (args) {
        args = Utils.argumentsToArray(args);
        if (this.addTimestamps)
          args.unshift(new Date().toLocaleString(), '-');
        return args;
      },
      debug: function () {
        if (this.logDebug)
          this.console.log.apply(this.console, this.parseArguments(arguments));
      },
      info: function () {
        if (this.logInfo)
          this.console.info.apply(this.console, this.parseArguments(arguments));
      },
      warn: function () {
        if (this.logWarnings)
          this.console.warn.apply(this.console, this.parseArguments(arguments));
      },
      error: function () {
        if (this.logErrors)
          this.console.error.apply(this.console, this.parseArguments(arguments));
      },
      $get: function (context) {
        return Log;
      }
    };
    return exports;
  }({});
  core_xhr_XhrResponse = function (exports) {
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
    XhrResponse.prototype.add = function (response) {
      this.responses.push(response);
    };
    XhrResponse.prototype.clear = function () {
      this.responses = [];
    };
    /**
     * @param {XhrMock} ajax
     * @returns {IXhrResponse}
     */
    XhrResponse.prototype.find = function (ajax) {
      var currentResponse = null;
      this.responses.forEach(function (response) {
        if (ajax.url.indexOf(response.path) > -1 && (!response.test || response.test(ajax))) {
          currentResponse = response;
        }
      });
      return currentResponse;
    };
    exports = {
      Class: XhrResponse,
      /**
       * @static
       * @param {Context} context
       * @returns {XhrResponse}
       */
      $get: function (context) {
        return context.createSingleton('XhrResponse', function () {
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
    return exports;
  }({});
  core_xhr_XhrMock = function (exports) {
    'use strict';
    var Log = core_Log, Utils = core_Utils;
    /**
     * @constructor
     * @alias RCSDK.core.ajax.XhrMock
     * @extends XMLHttpRequest
     */
    function XhrMock(context) {
      // Service
      this.responses = core_xhr_XhrResponse.$get(context);
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
    XhrMock.prototype.getResponseHeader = function (header) {
      return this.responseHeaders[header.toLowerCase()];
    };
    XhrMock.prototype.setRequestHeader = function (header, value) {
      this.requestHeaders[header.toLowerCase()] = value;
    };
    XhrMock.prototype.open = function (method, url, async) {
      this.method = method;
      this.url = url;
      this.async = async;
    };
    XhrMock.prototype.send = function (data) {
      var contentType = this.getRequestHeader('Content-Type');
      this.data = data;
      if (this.data && typeof this.data == 'string') {
        // For convenience encoded post data will be decoded
        if (contentType == 'application/json')
          this.data = JSON.parse(this.data);
        if (contentType == 'application/x-www-form-urlencoded')
          this.data = Utils.parseQueryString(this.data);
      }
      Log.debug('API REQUEST', this.method, this.url);
      var currentResponse = this.responses.find(this);
      if (!currentResponse) {
        setTimeout(function () {
          this.onerror && this.onerror(new Error('Unknown request: ' + this.url));
        }.bind(this), 1);
        return;
      }
      this.setStatus(200);
      this.setResponseHeader('Content-Type', 'application/json');
      var res = currentResponse.response(this), Promise = this.context.getPromise();
      function onLoad(res) {
        if (this.getResponseHeader('Content-Type') == 'application/json')
          res = JSON.stringify(res);
        this.responseText = res;
        setTimeout(function () {
          this.onload && this.onload();
        }.bind(this), 1);
      }
      if (res instanceof Promise) {
        res.then(onLoad.bind(this)).catch(this.onerror.bind(this));
      } else
        onLoad.call(this, res);
    };
    XhrMock.prototype.abort = function () {
      Log.debug('XhrMock.destroy(): Aborted');
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
    exports = {
      Class: XhrMock,
      /**
       * @static
       * @param {Context} context
       * @returns {XhrMock}
       */
      $get: function (context) {
        return new XhrMock(context);
      }
    };
    return exports;
  }({});
  core_Context = function (exports) {
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
    /**
     * @returns {CryptoJS}
     */
    Context.prototype.getCryptoJS = function () {
      return this.injections.CryptoJS;
    };
    /**
     * @returns {PUBNUB}
     */
    Context.prototype.getPubnub = function () {
      return this.stubPubnub ? core_pubnub_PubnubMock.$get(this) : this.injections.PUBNUB;
    };
    /**
     * @returns {Storage}
     * @abstract
     */
    Context.prototype.getLocalStorage = function () {
      return this.injections.localStorage;
    };
    /**
     * @returns {function(new:Promise)}
     */
    Context.prototype.getPromise = function () {
      return this.injections.Promise;
    };
    /**
     * @returns {XMLHttpRequest}
     */
    Context.prototype.getXHR = function () {
      return this.stubAjax ? core_xhr_XhrMock.$get(this) : new this.injections.XHR();
    };
    exports = {
      Class: Context,
      /**
       * @param {IInjections} injections
       */
      $get: function (injections) {
        return new Context(injections);
      }
    };
    return exports;
  }({});
  core_Observable = function (exports) {
    var Utils = core_Utils, Log = core_Log;
    /**
     * @constructor
     * @alias RCSDK.core.Observable
     */
    function Observable() {
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
    }
    // Object.create({}) is not needed
    // Do not put Object or Function.prototype instead of {}, otherwise all instances will get non-writable 'name' property
    // Observable.prototype = {};
    Object.defineProperty(Observable.prototype, 'constructor', {
      value: Observable,
      enumerable: false
    });
    Observable.prototype.hasListeners = function (event) {
      return event in this.listeners;
    };
    Observable.prototype.registerOneTimeEvent = function (event) {
      this.oneTimeEvents[event] = false;
      this.oneTimeArguments[event] = [];
    };
    Observable.prototype.on = function (events, callback) {
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
          // Fire listener immediately if is inited already
          Log.debug('Observable.on(%s): One-time event has been fired already, executing callback', event);
          callback.apply(self, self.getOneTimeEventArgumens(event));
        }
      });
      return this;
    };
    Observable.prototype.emit = function (event) {
      if (this.isOneTimeEventFired(event)) {
        Log.debug('Observable.emit(%s): One-time event has been fired already', event);
        return null;
      }
      var self = this, args = Utils.argumentsToArray(arguments).splice(1), result = null;
      if (this.isOneTimeEvent(event)) {
        this.setOneTimeEventFired(event);
        this.setOneTimeEventArgumens(event, args);
      }
      if (!this.hasListeners(event))
        return null;
      this.listeners[event].some(function (callback) {
        result = callback.apply(self, args);
        return result === false;
      });
      return result;
    };
    Observable.prototype.off = function (event, callback) {
      var self = this;
      if (!callback) {
        delete this.listeners[event];
      } else {
        if (!this.hasListeners(event))
          return this;
        this.listeners[event].forEach(function (cb, i) {
          if (cb === callback)
            delete self.listeners[event][i];
        });
      }
      return this;
    };
    Observable.prototype.isOneTimeEvent = function (event) {
      return event in this.oneTimeEvents;
    };
    Observable.prototype.isOneTimeEventFired = function (event) {
      if (!this.isOneTimeEvent(event))
        return false;
      return this.oneTimeEvents[event];
    };
    Observable.prototype.setOneTimeEventFired = function (event) {
      this.oneTimeEvents[event] = true;
    };
    Observable.prototype.setOneTimeEventArgumens = function (event, args) {
      this.oneTimeArguments[event] = args;
    };
    Observable.prototype.getOneTimeEventArgumens = function (event) {
      return this.oneTimeArguments[event];
    };
    Observable.prototype.offAll = function () {
      this.listeners = {};
      this.oneTimeEvents = {};
      this.oneTimeArguments = {};
    };
    Observable.prototype.destroy = function () {
      this.offAll();
      Log.debug('Observable.destroy(): Listeners were destroyed');
      return this;
    };
    /**
     * @param {string} event
     * @param {Array} args
     * @param {function} [callback]
     */
    Observable.prototype.emitAndCallback = function (event, args, callback) {
      args = Utils.argumentsToArray(args);
      if (event)
        this.emit.apply(this, [event].concat(args));
      if (callback)
        callback.apply(this, args);
      return this;
    };
    exports = {
      Class: Observable,
      /**
       * @param {Context} context
       * @returns {Observable}
       */
      $get: function (context) {
        return new Observable(context);
      }
    };
    return exports;
  }({});
  core_AjaxObserver = function (exports) {
    'use strict';
    var Observable = core_Observable.Class;
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
      beforeRequest: 'beforeRequest',
      // parameters: ajax
      requestSuccess: 'requestSuccess',
      // means that response was successfully fetched from server
      requestError: 'requestError'  // means that request failed completely
    };
    exports = {
      Class: AjaxObserver,
      /**
       * @param {Context} context
       * @returns {AjaxObserver}
       */
      $get: function (context) {
        return context.createSingleton('AjaxObserver', function () {
          return new AjaxObserver();
        });
      }
    };
    return exports;
  }({});
  core_Ajax = function (exports) {
    'use strict';
    var Observable = core_Observable.Class, Utils = core_Utils, Log = core_Log, jsonContentType = 'application/json', multipartContentType = 'multipart/mixed', boundarySeparator = '--', headerSeparator = ':', bodySeparator = '\n\n';
    /**
     * @typedef {Object} IAjaxOptions
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
     * @alias RCSDK.core.Ajax
     * @param {Context} [context]
     */
    function Ajax(context) {
      Observable.call(this);
      /** @type {Ajax[]|object} */
      this.data = null;
      /** @type {Error|null} */
      this.error = null;
      this.response = '';
      this.headers = {};
      this.status = 0;
      /**
       * @type {IAjaxOptions}
       * @protected
       */
      this.options = {};
      this.context = context;
      /** @type {AjaxObserver} */
      this.observer = core_AjaxObserver.$get(context);
      /** @type {XMLHttpRequest} */
      this.xhr = null;
    }
    Ajax.prototype = Object.create(Observable.prototype);
    Object.defineProperty(Ajax.prototype, 'constructor', {
      value: Ajax,
      enumerable: false
    });
    /**
     * @returns {IAjaxOptions}
     */
    Ajax.prototype.getOptions = function () {
      return this.options;
    };
    /**
     * @param {IAjaxOptions} [options]
     * @returns {Ajax}
     */
    Ajax.prototype.setOptions = function (options) {
      if (options)
        this.options = options;
      return this;
    };
    /**
     * @param {string} name
     * @param {string} value
     * @returns {Ajax}
     */
    Ajax.prototype.setRequestHeader = function (name, value) {
      name = name.toLowerCase();
      this.options.headers = this.options.headers || {};
      if (value) {
        this.options.headers[name] = value;
      } else {
        delete this.options.headers[name];
      }
      return this;
    };
    /**
     * @param {string} name
     * @param {string} value
     * @returns {Ajax}
     */
    Ajax.prototype.setResponseHeader = function (name, value) {
      this.headers[name.toLowerCase()] = value;
      return this;
    };
    /**
     * @param {string} name
     * @returns {string}
     */
    Ajax.prototype.getRequestHeader = function (name) {
      this.options.headers = this.options.headers || {};
      return this.options.headers[name.toLowerCase()];
    };
    /**
     * @param {string} name
     * @returns {string}
     */
    Ajax.prototype.getResponseHeader = function (name) {
      return this.headers[name.toLowerCase()];
    };
    /**
     * @param {string} type
     * @returns {boolean}
     */
    Ajax.prototype.isResponseContentType = function (type) {
      return this.getResponseContentType().indexOf(type) > -1;
    };
    /**
     * @returns {string}
     */
    Ajax.prototype.getResponseContentType = function () {
      return this.getResponseHeader('Content-Type') || '';
    };
    /**
     * @returns {boolean}
     */
    Ajax.prototype.isResponseMultipart = function () {
      return this.isResponseContentType(multipartContentType);
    };
    /**
     * @returns {boolean}
     */
    Ajax.prototype.isResponseUnauthorized = function () {
      return this.status == 401;
    };
    /**
     * @deprecated
     * @returns {string}
     */
    Ajax.prototype.getContentType = function () {
      return this.getResponseContentType();
    };
    /**
     * @deprecated
     * @returns {boolean}
     */
    Ajax.prototype.isMultipart = function () {
      return this.isResponseMultipart();
    };
    /**
     * @deprecated
     * @returns {boolean}
     */
    Ajax.prototype.isUnauthorized = function () {
      return this.isResponseUnauthorized();
    };
    /**
     * @returns {boolean}
     */
    Ajax.prototype.isLoaded = function () {
      return !!this.status;
    };
    /**
     * Checks the send options, defaulting various of the options,
     * and consuming / transforming some of the options (like get).
     * @returns {Ajax}
     */
    Ajax.prototype.checkOptions = function () {
      if (!this.options.url)
        throw new Error('Url is not defined');
      var defaultHeaders = {
          'Accept': jsonContentType,
          'Content-Type': jsonContentType
        }, headers = this.options.headers || {};
      this.options.headers = {};
      Object.keys(defaultHeaders).forEach(function (key) {
        this.setRequestHeader(key, defaultHeaders[key]);
      }, this);
      Object.keys(headers).forEach(function (key) {
        this.setRequestHeader(key, headers[key]);
      }, this);
      // Delete all headers that don't have value
      Object.keys(this.options.headers).forEach(function (key) {
        if (!this.options.headers[key])
          delete this.options.headers[key];
      }, this);
      this.options.method = this.options.method ? this.options.method.toUpperCase() : 'GET';
      this.options.async = this.options.async !== undefined ? this.options.async : true;
      this.options.get = this.options.get || null;
      this.options.post = this.options.post ? typeof this.options.post !== 'string' && this.getRequestHeader('Content-Type') === jsonContentType ? JSON.stringify(this.options.post) : this.options.post : '';
      this.options.url = this.options.url + (this.options.get ? (this.options.url.indexOf('?') > -1 ? '&' : '?') + Utils.queryStringify(this.options.get) : '');
      if ([
          'GET',
          'POST',
          'PUT',
          'DELETE',
          'PATCH',
          'OPTIONS'
        ].indexOf(this.options.method) < 0)
        throw new Error('Method has wrong value');
      delete this.options.get;
      return this;
    };
    /**
     * @returns {Promise}
     */
    Ajax.prototype.send = function () {
      this.observer.emit(this.observer.events.beforeRequest, this);
      return this.request().then(function (ajax) {
        ajax.parseResponse();
        if (ajax.error)
          throw ajax.error;
        return ajax;
      }.bind(this)).then(function (ajax) {
        this.observer.emit(this.observer.events.requestSuccess, ajax);
        return ajax;
      }.bind(this)).catch(function (e) {
        e.ajax = this;
        this.observer.emit(this.observer.events.requestError, e);
        throw e;
      }.bind(this));
    };
    /**
     * @returns {XMLHttpRequest}
     */
    Ajax.prototype.getXHR = function () {
      return this.context.getXHR();
    };
    /**
     * @returns {Promise}
     */
    Ajax.prototype.request = function () {
      return new (this.context.getPromise())(function (resolve, reject) {
        this.checkOptions();
        var options = this.options, xhr = this.getXHR();
        xhr.open(options.method, options.url, options.async);
        //@see http://stackoverflow.com/questions/19666809/cors-withcredentials-support-limited
        xhr.withCredentials = true;
        xhr.onload = function () {
          this.status = xhr.status;
          this.response = xhr.responseText;
          this.setResponseHeader('Content-Type', xhr.getResponseHeader('Content-Type') || jsonContentType);
          // if no header, set default
          resolve(this);
        }.bind(this);
        xhr.onerror = function (event) {
          reject(new Error('The request cannot be sent'));  // CORS or network issue
        };
        Utils.forEach(options.headers, function (value, header) {
          xhr.setRequestHeader(header, value);
        });
        xhr.send(options.method === 'GET' ? null : options.post);
        this.xhr = xhr;
      }.bind(this));
    };
    Ajax.prototype.checkStatus = function (status) {
      return status.toString().substr(0, 1) == '2';
    };
    Ajax.prototype.parseResponse = function () {
      try {
        if (!this.isResponseMultipart()) {
          if (typeof this.response == 'string' && !!this.response && this.isResponseContentType(jsonContentType)) {
            // Handle 204 No Content -- response may be empty
            this.data = JSON.parse(this.response);
          } else {
            this.data = this.response;  //TODO Add more parsers
          }
          if (!this.checkStatus(this.status))
            this.error = new Error(this.data.message || this.data.error_description || this.data.description || 'Unknown error');
        } else {
          var boundary = this.getResponseContentType().match(/boundary=([^;]+)/i)[1], parts = this.response.split(boundarySeparator + boundary);
          if (parts[0].trim() == '')
            parts.shift();
          if (parts[parts.length - 1].trim() == boundarySeparator)
            parts.pop();
          // Step 1. Parse all parts into Ajax objects
          parts = parts.map(function (part) {
            var subParts = part.trim().replace(/\r/g, '').split(bodySeparator), ajaxPart = new Ajax(this.context);
            (subParts.length > 1 ? subParts.shift() : '').split('\n').forEach(function (header) {
              if (header.length == 0)
                return res;
              var headerParts = header.split(headerSeparator), name = headerParts.shift().trim();
              ajaxPart.setResponseHeader(name, headerParts.join(headerSeparator).trim());
            }, this);
            ajaxPart.response = subParts.join(bodySeparator);
            return ajaxPart;
          }, this);
          // Step 2. Claim first part as statuses, assign status from this and parse the response
          var statusInfo = parts.shift();
          statusInfo.status = this.status;
          statusInfo.parseResponse();
          // Steo 3. For the rest of parts assign status and parse the response
          this.data = parts.map(function (part, i) {
            part.status = statusInfo.data.response[i].status;
            part.parseResponse();
            return part;
          }, this);
        }
      } catch (e) {
        // Capture parse errors
        Log.error('Ajax.parseResponse(): Unable to parse data');
        Log.error(e.stack || e);
        Log.error(this.response);
        this.error = e;
      }
      return this;
    };
    Ajax.prototype.destroy = function () {
      this.xhr && this.xhr.abort();
      return Observable.prototype.destroy.call(this);
    };
    exports = {
      Class: Ajax,
      /**
       * @static
       * @param {Context} context
       * @returns {Ajax}
       */
      $get: function (context) {
        return new Ajax(context);
      }
    };
    return exports;
  }({});
  core_Cache = function (exports) {
    'use strict';
    var Observable = core_Observable.Class, Utils = core_Utils;
    /**
     * @constructor
     * @extends Observable
     * @alias RCSDK.core.Cache
     * @param {Context} context
     */
    function Cache(context) {
      Observable.call(this);
      this.prefix = 'rc-';
      this.storage = context.getLocalStorage();  // storage must be defined from outside
    }
    Cache.prototype = Object.create(Observable.prototype);
    Object.defineProperty(Cache.prototype, 'constructor', {
      value: Cache,
      enumerable: false
    });
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
    exports = {
      Class: Cache,
      /**
       * @param {Context} context
       * @returns {Cache}
       */
      $get: function (context) {
        return context.createSingleton('Cache', function () {
          return new Cache(context);
        });
      }
    };
    return exports;
  }({});
  core_Platform = function (exports) {
    'use strict';
    var Utils = core_Utils, Observable = core_Observable.Class, Log = core_Log, forcedTokenType = 'forced';
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
      this.accessTokenTtl = 10 * 60;
      // 10 minutes
      this.refreshTokenTtl = 10 * 60 * 60;
      // 10 hours
      this.refreshTokenTtlRemember = 7 * 24 * 60 * 60;
      // 1 week
      this.refreshHandicapMs = 60 * 1000;
      // 1 minute
      this.refreshDelayMs = 100;
      this.clearCacheOnRefreshError = true;
      /** @type {Promise} */
      this.refreshPromise = null;
      this.context = context;
    }
    Platform.prototype = Object.create(Observable.prototype);
    Object.defineProperty(Platform.prototype, 'constructor', {
      value: Platform,
      enumerable: false
    });
    Platform.prototype.cacheId = 'platform';
    Platform.prototype.pollInterval = 250;
    Platform.prototype.releaseTimeout = 5000;
    // If queue was not released then force it to do so after some timeout
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
    Platform.prototype.getStorage = function () {
      return core_Cache.$get(this.context);
    };
    /**
     * @returns {Ajax}
     */
    Platform.prototype.getAjax = function () {
      return core_Ajax.$get(this.context);
    };
    /**
     * @returns {Platform}
     */
    Platform.prototype.clearStorage = function () {
      this.getStorage().clean();
      return this;
    };
    /**
     * @param {boolean} [remember]
     * @returns {Platform|boolean}
     */
    Platform.prototype.remember = function (remember) {
      var key = this.cacheId + '-remember';
      if (remember != undefined) {
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
    Platform.prototype.authorize = function (options) {
      options = options || {};
      options.remember = options.remember || false;
      return this.authCall({
        url: '/restapi/oauth/token',
        post: {
          'grant_type': 'password',
          'username': options.username,
          'extension': options.extension || '',
          'password': options.password,
          'access_token_ttl': this.accessTokenTtl,
          'refresh_token_ttl': options.remember ? this.refreshTokenTtlRemember : this.refreshTokenTtl
        }
      }).then(function (ajax) {
        this.setCache(ajax.data).remember(options.remember).emitAndCallback(this.events.authorizeSuccess, []);
        return ajax;
      }.bind(this)).catch(function (e) {
        this.clearStorage().emitAndCallback(this.events.authorizeError, [e]);
        throw e;
      }.bind(this));
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
    /**
     * Gets resolved into Ajax or null if refresh resolved from elsewhere
     * @returns {Promise}
     */
    Platform.prototype.refresh = function () {
      var refresh = new (this.context.getPromise())(function (resolve, reject) {
        if (this.isPaused()) {
          return resolve(this.refreshPolling(null));
        } else {
          this.pause();
        }
        // Make sure all existing AJAX calls had a chance to reach the server
        setTimeout(function () {
          var authData = this.getAuthData();
          Log.debug('Platform.refresh(): Performing token refresh (access token', authData.access_token, ', refresh token', authData.refresh_token, ')');
          if (!authData || !authData.refresh_token)
            return reject(new Error('Refresh token is missing'));
          if (Date.now() > authData.refreshExpireTime)
            return reject(new Error('Refresh token has expired'));
          if (!this.isPaused())
            return reject(new Error('Queue was resumed before refresh call'));
          resolve(this.authCall({
            url: '/restapi/oauth/token',
            post: {
              'grant_type': 'refresh_token',
              'refresh_token': authData.refresh_token,
              'access_token_ttl': this.accessTokenTtl,
              'refresh_token_ttl': this.remember() ? this.refreshTokenTtlRemember : this.refreshTokenTtl
            }
          }));
        }.bind(this), this.refreshDelayMs);
      }.bind(this));
      return refresh.then(function (ajax) {
        // This means refresh has happened elsewhere and we are here because of timeout
        if (!ajax || !ajax.data)
          return ajax;
        Log.info('Platform.refresh(): Token was refreshed');
        if (!ajax.data.refresh_token || !ajax.data.access_token) {
          var e = new Error('Malformed OAuth response');
          e.ajax = ajax;
          throw e;
        }
        this.setCache(ajax.data).resume();
        return ajax;
      }.bind(this)).then(function (result) {
        this.emit(this.events.refreshSuccess, result);
        return result;
      }.bind(this)).catch(function (e) {
        if (this.clearCacheOnRefreshError)
          this.clearStorage();
        this.emitAndCallback(this.events.accessViolation, [e]).emitAndCallback(this.events.refreshError, [e]);
        throw e;
      }.bind(this));
    };
    /**
     * @returns {Promise}
     */
    Platform.prototype.logout = function () {
      this.pause();
      return this.authCall({
        url: '/restapi/oauth/revoke',
        get: { token: this.getToken() }
      }).then(function (ajax) {
        this.resume().clearStorage().emit(this.events.logoutSuccess, ajax);
        return ajax;
      }.bind(this)).catch(function (e) {
        this.resume().emitAndCallback(this.events.accessViolation, [e]).emitAndCallback(this.events.logoutError, [e]);
        throw e;
      }.bind(this));
    };
    Platform.prototype.refreshPolling = function (result) {
      if (this.refreshPromise)
        return this.refreshPromise;
      this.refreshPromise = new (this.context.getPromise())(function (resolve, reject) {
        Log.warn('Platform.refresh(): Refresh is already in progress polling started');
        Utils.poll(function (next) {
          if (this.isPaused())
            return next();
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
    Platform.prototype.getToken = function () {
      return this.getAuthData().access_token;
    };
    Platform.prototype.getTokenType = function () {
      return this.getAuthData().token_type;
    };
    /**
     * @returns {PlatformAuthInfo}
     */
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
     * @returns {boolean}
     */
    Platform.prototype.isTokenValid = function () {
      var authData = this.getAuthData();
      return authData.token_type == forcedTokenType || new Date(authData.expireTime).getTime() - this.refreshHandicapMs > Date.now() && !this.isPaused();
    };
    /**
     * Checks if user is authorized
     * If there is no access token, refresh will be performed
     * @returns {Promise}
     */
    Platform.prototype.isAuthorized = function () {
      if (this.isTokenValid())
        return this.context.getPromise().resolve(true);
      return this.refresh();
    };
    /**
     * @returns {Platform}
     */
    Platform.prototype.cancelAccessToken = function () {
      return this.setCache(Utils.extend(this.getAuthData(), {
        access_token: '',
        expires_in: 0
      }));
    };
    /**
     * @param {object} authData
     * @returns {Platform}
     */
    Platform.prototype.setCache = function (authData) {
      var oldAuthData = this.getAuthData();
      Log.info('Platform.setCache(): Tokens were updated, new:', authData, ', old:', oldAuthData);
      authData.expireTime = Date.now() + authData.expires_in * 1000;
      authData.refreshExpireTime = Date.now() + authData.refresh_token_expires_in * 1000;
      this.getStorage().setItem(this.cacheId, authData);
      return this;
    };
    /**
     * @returns {Platform}
     */
    Platform.prototype.forceAuthentication = function () {
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
    Platform.prototype.apiCall = function (options) {
      options = options || {};
      options.url = this.apiUrl(options.url, { addServer: true });
      return this.isAuthorized()  // Refresh will occur inside
.then(function () {
        var token = this.getToken();
        return this.getAjax().setOptions(options).setRequestHeader('Authorization', this.getTokenType() + (token ? ' ' + token : '')).send();
      }.bind(this)).catch(function (e) {
        if (!e.ajax || !e.ajax.isResponseUnauthorized())
          throw e;
        this.cancelAccessToken();
        return this.refresh().then(function () {
          // Re-send with same options
          return this.apiCall(options);
        }.bind(this));
      }.bind(this));
    };
    /**
     * @param {IAjaxOptions} options
     * @returns {Promise}
     */
    Platform.prototype.authCall = function (options) {
      options = options || {};
      options.method = options.method || 'POST';
      options.post = Utils.queryStringify(options.post);
      options.url = this.apiUrl(options.url, { addServer: true });
      return this.getAjax().setOptions(options).setRequestHeader('Content-Type', 'application/x-www-form-urlencoded').setRequestHeader('Accept', 'application/json').setRequestHeader('Authorization', 'Basic ' + this.apiKey).send();
    };
    /**
     *
     * @param url
     * @param {{addMethod?: string, addToken?: boolean, addServer?: boolean}} [options]
     * @returns {string}
     */
    Platform.prototype.apiUrl = function (url, options) {
      url = url || '';
      options = options || {};
      var builtUrl = '';
      if (options.addServer && url.indexOf('http://') == -1 && url.indexOf('https://') == -1)
        builtUrl += this.server;
      if (url.indexOf(this.urlPrefix) == -1)
        builtUrl += this.urlPrefix + '/' + this.apiVersion;
      if (url.indexOf(this.accountPrefix) > -1)
        builtUrl.replace(this.accountPrefix + '~', this.accountPrefix + this.account);
      builtUrl += url;
      if (options.addMethod || options.addToken)
        builtUrl += url.indexOf('?') > -1 ? '&' : '?';
      if (options.addMethod)
        builtUrl += '_method=' + options.addMethod;
      if (options.addToken)
        builtUrl += (options.addMethod ? '&' : '') + 'access_token=' + this.getToken();
      return builtUrl;
    };
    exports = {
      Class: Platform,
      /**
       * @param {Context} context
       * @returns {Platform}
       */
      $get: function (context) {
        return context.createSingleton('Platform', function () {
          return new Platform(context);
        });
      }
    };
    return exports;
  }({});
  core_Subscription = function (exports) {
    'use strict';
    var Observable = core_Observable.Class, Log = core_Log, Utils = core_Utils, renewHandicapMs = 60 * 1000;
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
        expirationTime: '',
        // 2014-03-12T19:54:35.613Z
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
        // 2014-03-12T19:54:35.613Z
        status: '',
        // Active
        uri: ''
      };
      /** @type {PUBNUB} */
      this.pubnub = null;
      this.context = context;
    }
    Subscription.prototype = Object.create(Observable.prototype);
    Object.defineProperty(Subscription.prototype, 'constructor', {
      value: Subscription,
      enumerable: false
    });
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
    Subscription.prototype.getPubnub = function () {
      return this.context.getPubnub();
    };
    Subscription.prototype.getCrypto = function () {
      return this.context.getCryptoJS();
    };
    Subscription.prototype.getPlatform = function () {
      return core_Platform.$get(this.context);
    };
    /**
     * Creates or updates subscription if there is an active one
     * @param {{events?:string[]}} [options] New array of events
     * @returns {Promise}
     */
    Subscription.prototype.register = function (options) {
      if (this.isSubscribed()) {
        return this.renew(options);
      } else {
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
      return this.eventFilters.map(function (event) {
        return this.getPlatform().apiUrl(event);
      }.bind(this));
    };
    /**
     * @private
     * @param {Array} [options.events] New array of events
     * @returns {Promise}
     */
    Subscription.prototype.subscribe = function (options) {
      options = options || {};
      if (options.events)
        this.eventFilters = options.events;
      this.clearTimeout();
      return new (this.context.getPromise())(function (resolve, reject) {
        if (!this.eventFilters || !this.eventFilters.length)
          throw new Error('Events are undefined');
        resolve(this.getPlatform().apiCall({
          method: 'POST',
          url: '/restapi/v1.0/subscription',
          post: {
            eventFilters: this.getFullEventFilters(),
            deliveryMode: { transportType: 'PubNub' }
          }
        }));
      }.bind(this)).then(function (ajax) {
        this.updateSubscription(ajax.data).subscribeAtPubnub().emit(this.events.subscribeSuccess, ajax.data);
        return ajax;
      }.bind(this)).catch(function (e) {
        this.unsubscribe().emit(this.events.subscribeError, e);
        throw e;
      }.bind(this));
    };
    /**
     * @private
     * @param {Array} [options.events] New array of events
     * @returns {Promise}
     */
    Subscription.prototype.renew = function (options) {
      options = options || {};
      if (options.events)
        this.eventFilters = options.events;
      this.clearTimeout();
      return new (this.context.getPromise())(function (resolve, reject) {
        if (!this.subscription || !this.subscription.id)
          throw new Error('Subscription ID is required');
        if (!this.eventFilters || !this.eventFilters.length)
          throw new Error('Events are undefined');
        resolve();
      }.bind(this)).then(function () {
        return this.getPlatform().apiCall({
          method: 'PUT',
          url: '/restapi/v1.0/subscription/' + this.subscription.id,
          post: { eventFilters: this.getFullEventFilters() }
        });
      }.bind(this)).then(function (ajax) {
        this.updateSubscription(ajax.data).emit(this.events.renewSuccess, ajax.data);
        return ajax;
      }.bind(this)).catch(function (e) {
        this.unsubscribe().emit(this.events.renewError, e);
        throw e;
      }.bind(this));
    };
    /**
     * @param {boolean} [options.async]
     * @returns {Promise}
     */
    Subscription.prototype.remove = function (options) {
      options = Utils.extend({ async: true }, options);
      return new (this.context.getPromise())(function (resolve, reject) {
        if (!this.subscription || !this.subscription.id)
          throw new Error('Subscription ID is required');
        resolve(this.getPlatform().apiCall({
          async: !!options.async,
          // Warning! This is necessary because this method is used in beforeunload hook and has to be synchronous
          method: 'DELETE',
          url: '/restapi/v1.0/subscription/' + this.subscription.id
        }));
      }.bind(this)).then(function (ajax) {
        this.unsubscribe().emit(this.events.removeSuccess, ajax);
        return ajax;
      }.bind(this)).catch(function (e) {
        this.emit(this.events.removeError, e);
        throw e;
      }.bind(this));
    };
    Subscription.prototype.destroy = function () {
      this.unsubscribe();
      Log.info('RC.core.Subscription: Destroyed');
      return Observable.prototype.destroy.call(this);
    };
    Subscription.prototype.isSubscribed = function () {
      return this.subscription && this.subscription.deliveryMode && this.subscription.deliveryMode.subscriberKey && this.subscription.deliveryMode.address;
    };
    /**
     * @protected
     */
    Subscription.prototype.setTimeout = function () {
      var timeToExpiration = this.subscription.expiresIn * 1000 - renewHandicapMs;
      this.timeout = setTimeout(function () {
        this.renew({});
      }.bind(this), timeToExpiration);
    };
    /**
     * @protected
     */
    Subscription.prototype.clearTimeout = function () {
      clearTimeout(this.timeout);
    };
    /**
     * Set new subscription info and re-create timeout
     * @protected
     * @param subscription
     * @returns {Subscription}
     */
    Subscription.prototype.updateSubscription = function (subscription) {
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
    Subscription.prototype.unsubscribe = function () {
      this.clearTimeout();
      if (this.pubnub && this.isSubscribed())
        this.pubnub.unsubscribe({ channel: this.subscription.deliveryMode.address });
      this.subscription = null;
      return this;
    };
    /**
     * @abstract
     * @param {Object} message
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
     * @returns {Subscription}
     */
    Subscription.prototype.subscribeAtPubnub = function () {
      if (!this.isSubscribed())
        return this;
      var PUBNUB = this.getPubnub();
      this.pubnub = PUBNUB.init({ subscribe_key: this.subscription.deliveryMode.subscriberKey });
      this.pubnub.ready();
      this.pubnub.subscribe({
        channel: this.subscription.deliveryMode.address,
        message: function (message, env, channel) {
          Log.info('RC.core.Subscription: Incoming message', message);
          this.notify(message);
        }.bind(this),
        connect: function () {
          Log.info('RC.core.Subscription: PUBNUB connected');
        }.bind(this)
      });
      return this;
    };
    exports = {
      Class: Subscription,
      /**
       * @param {Context} context
       * @returns {Subscription}
       */
      $get: function (context) {
        return new Subscription(context);
      }
    };
    return exports;
  }({});
  core_PageVisibility = function (exports) {
    'use strict';
    var Observable = core_Observable.Class;
    /**
     * @constructor
     * @extends Observable
     * @alias RCSDK.core.PageVisibility
     */
    function PageVisibility() {
      Observable.call(this);
      var hidden = 'hidden', self = this;
      this.visible = true;
      if (typeof document == 'undefined' || typeof window == 'undefined')
        return;
      // Standards:
      if (hidden in document)
        document.addEventListener('visibilitychange', onchange);
      else if ((hidden = 'mozHidden') in document)
        document.addEventListener('mozvisibilitychange', onchange);
      else if ((hidden = 'webkitHidden') in document)
        document.addEventListener('webkitvisibilitychange', onchange);
      else if ((hidden = 'msHidden') in document)
        document.addEventListener('msvisibilitychange', onchange);  // IE 9 and lower:
      else if ('onfocusin' in document)
        document.onfocusin = document.onfocusout = onchange;  // All others:
      else
        window.onpageshow = window.onpagehide = window.onfocus = window.onblur = onchange;
      function onchange(evt) {
        evt = evt || window.event;
        var v = 'visible', h = 'hidden', evtMap = {
            focus: v,
            focusin: v,
            pageshow: v,
            blur: h,
            focusout: h,
            pagehide: h
          };
        self.visible = evt.type in evtMap ? evtMap[evt.type] == v : !document[hidden];
        self.emit(self.events.change, self.visible);
      }
    }
    PageVisibility.prototype = Object.create(Observable.prototype);
    Object.defineProperty(PageVisibility.prototype, 'constructor', {
      value: PageVisibility,
      enumerable: false
    });
    PageVisibility.prototype.events = { change: 'change' };
    PageVisibility.prototype.isVisible = function () {
      return this.visible;
    };
    exports = {
      Class: PageVisibility,
      /**
       * @param {Context} context
       * @returns {PageVisibility}
       */
      $get: function (context) {
        return new PageVisibility();
      }
    };
    return exports;
  }({});
  core_Helper = function (exports) {
    'use strict';
    var Utils = core_Utils;
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
    Helper.prototype.getContext = function () {
      return this.context;
    };
    /**
     * @param {object} [options]
     * @param {string} [id]
     */
    Helper.prototype.createUrl = function (options, id) {
      return '';
    };
    /**
     * @param {IHelperObject} object
     * @returns {string}
     */
    Helper.prototype.getId = function (object) {
      return object && object[this.defaultProperty];
    };
    /**
     *
     * @param {IHelperObject} object
     * @returns {boolean}
     */
    Helper.prototype.isNew = function (object) {
      return !this.getId(object) || !this.getUri(object);
    };
    /**
     *
     * @param {IHelperObject} object
     * @returns {IHelperObject}
     */
    Helper.prototype.resetAsNew = function (object) {
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
    Helper.prototype.getUri = function (object) {
      return object && object.uri;
    };
    /**
     * @param {Ajax} ajax
     * @return {IHelperObject[]}
     */
    Helper.prototype.parseMultipartResponse = function (ajax) {
      if (ajax.isResponseMultipart()) {
        // ajax.data has full array, leave only successful
        return ajax.data.filter(function (result) {
          return !result.error;
        }).map(function (result) {
          return result.data;
        });
      } else {
        // Single ID
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
    Helper.prototype.loadRequest = function (object, options) {
      return Utils.extend(options || {}, {
        url: options && options.url || object && this.getUri(object) || this.createUrl(),
        method: options && options.method || 'GET'
      });
    };
    /**
     * Options have higher priority, if object.url and options.url were provided, options.url will be returned
     * If no URL was provided, default will be returned
     * @param {IHelperObject} object
     * @param {IAjaxOptions} [options]
     * @return {IAjaxOptions}
     */
    Helper.prototype.saveRequest = function (object, options) {
      if (!object && !(options && options.post))
        throw new Error('No Object');
      return Utils.extend(options || {}, {
        method: options && options.method || (this.isNew(object) ? 'POST' : 'PUT'),
        url: options && options.url || this.getUri(object) || this.createUrl(),
        post: options && options.post || object
      });
    };
    /**
     * Options have higher priority, if object.url and options.url were provided, options.url will be returned
     * If no URL was provided exception will be thrown
     * @param {IHelperObject} object
     * @param {IAjaxOptions} [options]
     * @return {IAjaxOptions}
     */
    Helper.prototype.deleteRequest = function (object, options) {
      options = options || {};
      if (!this.getUri(object) && !(options && options.url))
        throw new Error('Object has to be not new or URL must be provided');
      return Utils.extend(options || {}, {
        method: options && options.method || 'DELETE',
        url: options && options.url || this.getUri(object)
      });
    };
    /**
     * If no url was provided, default SYNC url will be returned
     * @param {IAjaxOptions} [options]
     * @return {IAjaxOptions}
     */
    Helper.prototype.syncRequest = function (options) {
      options = options || {};
      options.url = options.url || this.createUrl({ sync: true });
      options.get = options.get || {};
      if (!!options.get.syncToken) {
        options.get = {
          syncType: 'ISync',
          syncToken: options.get.syncToken
        };
      } else {
        options.get.syncType = 'FSync';
      }
      return options;
    };
    Helper.prototype.nextPageExists = function (data) {
      return data && data.navigation && 'nextPage' in data.navigation;
    };
    /**
     * @param {IHelperObject[]} array - an array to be indexed
     * @param {function(object)} [getIdFn] - must return an ID for each array item
     * @param {boolean} [gather] - if true, then each index will have an array of items, that has same ID, otherwise the first indexed item wins
     * @returns {*}
     */
    Helper.prototype.index = function (array, getIdFn, gather) {
      getIdFn = getIdFn || this.getId.bind(this);
      array = array || [];
      return array.reduce(function (index, item) {
        var id = getIdFn(item);
        if (!id || index[id] && !gather)
          return index;
        if (gather) {
          if (!index[id])
            index[id] = [];
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
    Helper.prototype.merge = function (target, supplement, getIdFn, mergeItems) {
      getIdFn = getIdFn || this.getId.bind(this);
      target = target || [];
      supplement = supplement || [];
      var supplementIndex = this.index(supplement, getIdFn), updatedIDs = [];
      var result = target.map(function (item) {
        var id = getIdFn(item), newItem = supplementIndex[id];
        if (newItem)
          updatedIDs.push(id);
        return newItem ? mergeItems ? Utils.extend(item, newItem) : newItem : item;
      });
      supplement.forEach(function (item) {
        if (updatedIDs.indexOf(getIdFn(item)) == -1)
          result.push(item);
      });
      return result;
    };
    exports = {
      Class: Helper,
      /**
       * @param {Context} context
       * @returns {Helper}
       */
      $get: function (context) {
        return new Helper(context);
      }
    };
    /**
     * @typedef {object} IHelperObject
     * @property {string} id
     * @property {string} uri
     */
    return exports;
  }({});
  core_Validator = function (exports) {
    'use strict';
    var Utils = core_Utils;
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
    var Validator = exports = {
      /**
       * @param {IValidator[]} validators
       * @returns {IValidatorResult}
       */
      validate: function (validators) {
        /** @type {IValidatorResult} */
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
      },
      /**
       * It is not recommended to have any kinds of complex validators at front end
       * @deprecated
       * @param value
       * @param multiple
       * @returns {Function}
       */
      email: function (value, multiple) {
        return function () {
          if (!value)
            return [];
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
      phone: function (value) {
        return function () {
          if (!value)
            return [];
          return Utils.isPhoneNumber(value) ? [] : [new Error('Value has to be a valid US phone number')];
        };
      },
      required: function (value) {
        return function () {
          return !value ? [new Error('Field is required')] : [];
        };
      },
      length: function (value, max, min) {
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
      },
      $get: function (context) {
        return Validator;
      }
    };
    return exports;
  }({});
  core_List = function (exports) {
    'use strict';
    var Utils = core_Utils;
    /**
     * @alias RCSDK.core.List
     * @name List
     */
    var List = exports = {
      /**
       * @param {string} property
       * @returns {function(object)}
       */
      propertyExtractor: function (property) {
        return function (item, options) {
          return property ? item && item[property] || null : item;
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
      stringComparator: function (a, b, options) {
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
      numberComparator: function (a, b, options) {
        return Utils.parseNumber(a) - Utils.parseNumber(b);
      },
      /**
       * Function extracts (using _extractFn_ option) values of a property (_sortBy_ option) and compares them using
       * compare function (_compareFn_ option, by default Helper.stringComparator)
       * Merged options are provided to _extractFn_ and _compareFn_
       * TODO Check memory leaks for all that options links
       * @param {IListComparatorOptions} [options]
       * @returns {function(object, object)}
       */
      comparator: function (options) {
        options = Utils.extend({
          extractFn: this.propertyExtractor(options && options.sortBy || null),
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
      equalsFilter: function (obj, options) {
        return options.condition === obj;
      },
      /**
       * @param {string} obj
       * @param {IListFilterOptions} options
       * @returns {boolean}
       */
      containsFilter: function (obj, options) {
        return obj && obj.toString().indexOf(options.condition) > -1;
      },
      /**
       * @param {string} obj
       * @param {IListFilterOptions} options - `condition` must be an instance of RegExp
       * @returns {boolean}
       */
      regexpFilter: function (obj, options) {
        if (!(options.condition instanceof RegExp))
          throw new Error('Condition must be an instance of RegExp');
        return options.condition.test(obj);
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
      filter: function (filterConfigs) {
        var self = this;
        filterConfigs = (filterConfigs || []).map(function (opt) {
          return Utils.extend({
            condition: '',
            extractFn: self.propertyExtractor(opt && opt.filterBy || null),
            filterFn: self.equalsFilter
          }, opt);
        });
        /**
         * @param {object} item
         * @returns {boolean}
         */
        function filter(item) {
          return filterConfigs.reduce(function (pass, opt) {
            if (!pass || !opt.condition)
              return pass;
            return opt.filterFn(opt.extractFn(item, opt), opt);
          }, true);
        }
        return filter;
      },
      $get: function (context) {
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
    return exports;
  }({});
  helpers_Country = function (exports) {
    'use strict';
    var Helper = core_Helper.Class;
    /**
     * @extends Helper
     * @constructor
     */
    function CountryHelper(context) {
      Helper.call(this, context);
    }
    CountryHelper.prototype = Object.create(Helper.prototype);
    CountryHelper.prototype.createUrl = function () {
      return '/dictionary/country';
    };
    exports = {
      Class: CountryHelper,
      /**
       * @param {Context} context
       * @returns {CountryHelper}
       */
      $get: function (context) {
        return context.createSingleton('CountryHelper', function () {
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
    return exports;
  }({});
  helpers_DeviceModel = function (exports) {
    'use strict';
    var Helper = core_Helper.Class;
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
    DeviceModelHelper.prototype.getId = function (device) {
      if (!device)
        return null;
      return device.id + (device.addons && device.addons[0] ? '-' + device.addons[0].id + '-' + device.addons[0].count : '');
    };
    /**
     * Remove extra textual information from device
     * @exceptionalCase Platform does not understand full device info
     * @param {IDeviceModel} device
     * @returns {IDeviceModel}
     */
    DeviceModelHelper.prototype.cleanForSaving = function (device) {
      if (!device)
        return null;
      delete device.name;
      delete device.deviceClass;
      if (device.addons && device.addons.length > 0) {
        device.addons.forEach(function (addon, i) {
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
        addons: [{
            id: '2',
            name: 'Cisco Sidecar',
            count: '1'
          }]
      },
      {
        id: '16',
        name: 'Cisco SPA-508G Desk Phone with 2 Expansion Modules',
        deviceClass: 'Desk Phone',
        addons: [{
            id: '2',
            name: 'Cisco Sidecar',
            count: '2'
          }]
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
        addons: [{
            id: '2',
            name: 'Cisco Sidecar',
            count: '1'
          }]
      },
      {
        id: '19',
        name: 'Cisco SPA-525G2 Desk Phone with 2 Expansion Modules\tDesk Phone',
        addons: [{
            id: '2',
            name: 'Cisco Sidecar',
            count: '2'
          }]
      },
      {
        id: '34',
        name: 'Polycom IP 650 HD Executive IP phone with 1 Expansion Module',
        deviceClass: 'Desk Phone',
        addons: [{
            id: '1',
            name: 'Plolycom Expansion',
            count: '1'
          }]
      },
      {
        id: '34',
        name: 'Polycom IP 650 HD Executive IP phone with 2 Expansion Modules',
        deviceClass: 'Desk Phone',
        addons: [{
            id: '1',
            name: 'Plolycom Expansion',
            count: '2'
          }]
      },
      {
        id: '34',
        name: 'Polycom IP 650 HD Executive IP phone with 3 Expansion Modules',
        deviceClass: 'Desk Phone',
        addons: [{
            id: '1',
            name: 'Plolycom Expansion',
            count: '3'
          }]
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
    exports = {
      Class: DeviceModelHelper,
      /**
       * @param {Context} context
       * @returns {DeviceModelHelper}
       */
      $get: function (context) {
        return context.createSingleton('DeviceModelHelper', function () {
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
    return exports;
  }({});
  helpers_Language = function (exports) {
    'use strict';
    var Helper = core_Helper.Class;
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
    exports = {
      Class: LanguageHelper,
      /**
       * @param {Context} context
       * @returns {LanguageHelper}
       */
      $get: function (context) {
        return context.createSingleton('LanguageHelper', function () {
          return new LanguageHelper(context);
        });
      }
    };
    /**
     * @typedef {object} ILanguage
     * @property {string} id
     * @property {string} name
     */
    return exports;
  }({});
  helpers_State = function (exports) {
    'use strict';
    var Helper = core_Helper.Class, List = core_List, Utils = core_Utils;
    /**
     * @extends Helper
     * @constructor
     */
    function StateHelper(context) {
      Helper.call(this, context);
      this.countryHelper = helpers_Country.$get(context);
    }
    StateHelper.prototype = Object.create(Helper.prototype);
    StateHelper.prototype.createUrl = function () {
      return '/dictionary/state';
    };
    /**
     * @param {IStateOptions} options
     * @returns {function(IState)}
     */
    StateHelper.prototype.filter = function (options) {
      options = Utils.extend({ countryId: '' }, options);
      return List.filter([{
          condition: options.countryId,
          filterFn: function (item, opts) {
            return this.countryHelper.getId(item.country) == opts.condition;
          }.bind(this)
        }]);
    };
    exports = {
      Class: StateHelper,
      /**
       * @param {Context} context
       * @returns {StateHelper}
       */
      $get: function (context) {
        return context.createSingleton('StateHelper', function () {
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
    return exports;
  }({});
  helpers_Location = function (exports) {
    'use strict';
    var Helper = core_Helper.Class, List = core_List, Utils = core_Utils;
    /**
     * @extends Helper
     * @constructor
     */
    function LocationHelper(context) {
      Helper.call(this, context);
      this.state = helpers_State.$get(context);
    }
    LocationHelper.prototype = Object.create(Helper.prototype);
    LocationHelper.prototype.createUrl = function () {
      return '/dictionary/location';
    };
    /**
     * @param {ILocationFilterOptions} options
     * @returns {function(ILocation)}
     */
    LocationHelper.prototype.filter = function (options) {
      var uniqueNPAs = [];
      options = Utils.extend({
        stateId: '',
        onlyUniqueNPA: false
      }, options);
      return List.filter([
        {
          condition: options.stateId,
          filterFn: function (item, opts) {
            return this.state.getId(item.state) == opts.condition;
          }.bind(this)
        },
        {
          condition: options.onlyUniqueNPA,
          filterFn: function (item, opts) {
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
    LocationHelper.prototype.comparator = function (options) {
      options = Utils.extend({ sortBy: 'npa' }, options);
      if (options.sortBy == 'nxx') {
        /**
         * @param {ILocation} item
         * @returns {number}
         */
        options.extractFn = function (item) {
          return parseInt(item.npa) * 1000000 + parseInt(item.nxx);
        };
        options.compareFn = List.numberComparator;
      }
      return List.comparator(options);
    };
    exports = {
      Class: LocationHelper,
      /**
       * @param {Context} context
       * @returns {LocationHelper}
       */
      $get: function (context) {
        return context.createSingleton('LocationHelper', function () {
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
    return exports;
  }({});
  helpers_ShippingMethod = function (exports) {
    'use strict';
    var Helper = core_Helper.Class;
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
    exports = {
      Class: ShippingMethodHelper,
      /**
       * @param {Context} context
       * @returns {ShippingMethodHelper}
       */
      $get: function (context) {
        return context.createSingleton('ShippingMethodHelper', function () {
          return new ShippingMethodHelper(context);
        });
      }
    };
    /**
     * @typedef {object} IShippingMethod
     * @property {string} id
     * @property {string} name
     */
    return exports;
  }({});
  helpers_Timezone = function (exports) {
    'use strict';
    var Helper = core_Helper.Class;
    /**
     * @extends Helper
     * @constructor
     */
    function TimezoneHelper(context) {
      Helper.call(this, context);
    }
    TimezoneHelper.prototype = Object.create(Helper.prototype);
    TimezoneHelper.prototype.createUrl = function () {
      return '/dictionary/timezone';
    };
    exports = {
      Class: TimezoneHelper,
      /**
       * @param {Context} context
       * @returns {TimezoneHelper}
       */
      $get: function (context) {
        return context.createSingleton('TimezoneHelper', function () {
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
    return exports;
  }({});
  helpers_Account = function (exports) {
    'use strict';
    var Helper = core_Helper.Class;
    /**
     * @extends Helper
     * @constructor
     */
    function AccountHelper(context) {
      Helper.call(this, context);
    }
    AccountHelper.prototype = Object.create(Helper.prototype);
    AccountHelper.prototype.createUrl = function () {
      return '/account/~';
    };
    exports = {
      Class: AccountHelper,
      /**
       * @param {Context} context
       * @returns {AccountHelper}
       */
      $get: function (context) {
        return context.createSingleton('AccountHelper', function () {
          return new AccountHelper(context);
        });
      }
    };
    return exports;
  }({});
  helpers_BlockedNumber = function (exports) {
    'use strict';
    var Helper = core_Helper.Class, Validator = core_Validator;
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
    BlockedNumberHelper.prototype.createUrl = function (options, id) {
      options = options || {};
      return '/account/~/extension/' + (options.extensionId ? options.extensionId : '~') + '/blocked-number' + (id ? '/' + id : '');
    };
    /**
     * @param {IBlockedNumber} item
     */
    BlockedNumberHelper.prototype.validate = function (item) {
      return Validator.validate([
        {
          field: 'phoneNumber',
          validator: Validator.phone(item.phoneNumber)
        },
        {
          field: 'phoneNumber',
          validator: Validator.required(item.phoneNumber)
        },
        {
          field: 'name',
          validator: Validator.required(item.name)
        }
      ]);
    };
    exports = {
      Class: BlockedNumberHelper,
      /**
       * @param {Context} context
       * @returns {BlockedNumberHelper}
       */
      $get: function (context) {
        return context.createSingleton('BlockedNumberHelper', function () {
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
    return exports;
  }({});
  helpers_Extension = function (exports) {
    'use strict';
    var Helper = core_Helper.Class, List = core_List, Utils = core_Utils;
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
    ExtensionHelper.prototype.createUrl = function (options, id) {
      options = options || {};
      return '/account/~' + (options.departmentId ? '/department/' + options.departmentId + '/members' : '/extension') + (id ? '/' + id : '');
    };
    /**
     * @param {IExtension} extension
     * @returns {boolean}
     */
    ExtensionHelper.prototype.isUser = function (extension) {
      return extension && extension.type == this.type.user;
    };
    /**
     * @param {IExtension} extension
     * @returns {boolean}
     */
    ExtensionHelper.prototype.isDepartment = function (extension) {
      return extension && extension.type == this.type.department;
    };
    /**
     * @param {IExtension} extension
     * @returns {boolean}
     */
    ExtensionHelper.prototype.isAnnouncement = function (extension) {
      return extension && extension.type == this.type.announcement;
    };
    /**
     * @param {IExtension} extension
     * @returns {boolean}
     */
    ExtensionHelper.prototype.isVoicemail = function (extension) {
      return extension && extension.type == this.type.voicemail;
    };
    /**
     * @param {IListComparatorOptions} [options]
     * @returns {function(object, object)}
     */
    ExtensionHelper.prototype.comparator = function (options) {
      return List.comparator(Utils.extend({
        sortBy: 'extensionNumber',
        compareFn: List.numberComparator
      }, options));
    };
    /**
     * @param {IExtensionFilterOptions} [options]
     * @returns {function(IExtension)}
     */
    ExtensionHelper.prototype.filter = function (options) {
      options = Utils.extend({
        search: '',
        type: ''
      }, options);
      return List.filter([
        {
          filterBy: 'type',
          condition: options.type
        },
        {
          condition: options.search.toLocaleLowerCase(),
          filterFn: List.containsFilter,
          extractFn: function (item) {
            return (item.name && item.name.toLocaleLowerCase() + ' ') + (item.extensionNumber && item.extensionNumber.toString().toLocaleLowerCase());
          }
        }
      ]);
    };
    exports = {
      Class: ExtensionHelper,
      /**
       * @param {Context} context
       * @returns {ExtensionHelper}
       */
      $get: function (context) {
        return context.createSingleton('ExtensionHelper', function () {
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
    return exports;
  }({});
  helpers_Presence = function (exports) {
    'use strict';
    var Helper = core_Helper.Class, Utils = core_Utils;
    /**
     * @extends Helper
     * @constructor
     */
    function PresenceHelper(context) {
      Helper.call(this, context);
      this.extension = helpers_Extension.$get(context);
    }
    PresenceHelper.prototype = Object.create(Helper.prototype);
    /**
     * @param {IPresenceOptions} [options]
     * @param {string} [id]
     * @returns {string}
     */
    PresenceHelper.prototype.createUrl = function (options, id) {
      options = options || {};
      return '/account/~/extension/' + (id || '~') + '/presence' + (options.detailed ? '?detailedTelephonyState=true' : '');
    };
    /**
     * @param {IPresence} presence
     * @returns {string}
     */
    PresenceHelper.prototype.getId = function (presence) {
      return presence && (this.extension.getId(presence.extension) || presence.extensionId);
    };
    /**
     * @param {IPresence} presence
     * @returns {boolean}
     */
    PresenceHelper.prototype.isAvailable = function (presence) {
      return presence && presence.presenceStatus == 'Available';
    };
    /**
     * @param {IPresenceOptions} [options]
     * @param {string} [id]
     * @returns {Subscription}
     */
    PresenceHelper.prototype.getSubscription = function (options, id) {
      return core_Subscription.$get(this.context).setEvents([this.createUrl(options, id)]);
    };
    /**
     *
     * @param {Subscription} subscription
     * @param {IPresence[]} presences
     * @param {IPresenceOptions} options
     * @returns {*}
     */
    PresenceHelper.prototype.updateSubscription = function (subscription, presences, options) {
      var events = presences.map(this.getId, this).map(function (id) {
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
    PresenceHelper.prototype.attachToExtensions = function (extensions, presences, merge) {
      var index = this.index(presences);
      extensions.forEach(/** @param {IExtension} extension */
      function (extension) {
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
    PresenceHelper.prototype.isCallInProgress = function (presenceCall) {
      return presenceCall && presenceCall.telephonyStatus != 'NoCall';
    };
    exports = {
      Class: PresenceHelper,
      /**
       * @param {Context} context
       * @returns {PresenceHelper}
       */
      $get: function (context) {
        return context.createSingleton('PresenceHelper', function () {
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
    return exports;
  }({});
  helpers_Contact = function (exports) {
    'use strict';
    var Utils = core_Utils, Validator = core_Validator, Helper = core_Helper.Class, List = core_List;
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
    ContactHelper.prototype.createUrl = function (options, id) {
      options = options || {};
      var root = '/account/~/extension/' + (options.extensionId ? options.extensionId : '~') + '/address-book';
      if (options.sync)
        return root + '-sync';
      return root + (options.groupId ? '/group/' + options.groupId + '/contact' : '/contact') + (id ? '/' + id : '');
    };
    /**
     * Returns all values of the given fields if value exists
     * @param {(IContact|object)} where
     * @param {Array} fields
     * @param {boolean} [asHash]
     * @protected
     * @returns {Object}
     */
    ContactHelper.prototype.getFieldValues = function (where, fields, asHash) {
      return fields.reduce(function (result, field) {
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
    ContactHelper.prototype.getFullName = function (contact) {
      return this.getFieldValues(contact, this.nameFields).join(' ');
    };
    /**
     * @param {IContact} contact
     * @param {boolean} [asHash]
     * @returns {IContact}
     */
    ContactHelper.prototype.getEmails = function (contact, asHash) {
      return this.getFieldValues(contact, this.emailFields, asHash);
    };
    /**
     * @param {IContact} contact
     * @param {boolean} [asHash]
     * @returns {IContact}
     */
    ContactHelper.prototype.getPhones = function (contact, asHash) {
      return this.getFieldValues(contact, this.phoneFields, asHash);
    };
    /**
     * @param {IContact} contact
     * @param {boolean} [asHash]
     * @returns {IContact}
     */
    ContactHelper.prototype.getFaxes = function (contact, asHash) {
      return this.getFieldValues(contact, this.faxFields, asHash);
    };
    /**
     * @param {IContact} contact
     * @param {boolean} [asHash]
     * @returns {IContact}
     */
    ContactHelper.prototype.getAddresses = function (contact, asHash) {
      return this.getFieldValues(contact, this.addressFields, asHash);
    };
    /**
     * @param {IContact} contact
     * @returns {boolean}
     */
    ContactHelper.prototype.isAlive = function (contact) {
      return contact.availability == 'Alive';
    };
    /**
     * Matches a contact against a given string, returns null if nothing found
     * @param {IContact} contact
     * @param {string} string
     * @param {IContactMatchOptions} [options]
     * @returns {(string|null)}
     */
    ContactHelper.prototype.match = function (contact, string, options) {
      options = Utils.extend({
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
      function matchWith(value) {
        // skip unnecessary cycles if match has been found
        if (found)
          return;
        var transformed = options.transformFn(value, options);
        if (!transformed)
          return;
        var match = options.strict ? transformed == string : transformed.indexOf(string) > -1;
        if (match)
          found = value;
      }
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
          this.addressSubFields.forEach(function (subField) {
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
    ContactHelper.prototype.matchAsPhone = function (contact, phone, options) {
      return this.match(contact, phone, Utils.extend({
        fields: [].concat(this.phoneFields, this.faxFields),
        inAddresses: false,
        transformFn: function (value, options) {
          return value ? value.toString().replace(/[^\d\w]/gi, '') : '';  //TODO Trickier removal reqired;
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
    ContactHelper.prototype.attachToCallerInfos = function (callerInfos, contacts, options) {
      var self = this, callerInfoIndex = this.index(callerInfos, function (callerInfo) {
          return callerInfo.phoneNumber;
        }, true);
      Utils.forEach(callerInfoIndex, function (indexedCallerInfos, phoneNumber) {
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
    /**
     * @param {IListComparatorOptions} [options]
     * @returns {function(object, object)}
     */
    ContactHelper.prototype.comparator = function (options) {
      var self = this;
      return List.comparator(Utils.extend({
        extractFn: function (contact, options) {
          return self.getFullName(contact);
        }
      }, options));
    };
    /**
     * TODO Add filtering by group http://jira.ringcentral.com/browse/SDK-4
     * @param {IContactOptions} [options]
     * @returns {function(IContact)}
     */
    ContactHelper.prototype.filter = function (options) {
      var self = this;
      options = Utils.extend({
        alive: true,
        startsWith: '',
        phonesOnly: false,
        faxesOnly: false
      }, options);
      return List.filter([
        {
          condition: options.alive,
          filterFn: this.isAlive
        },
        {
          condition: options.startsWith,
          filterFn: function (item, opts) {
            return self.match(item, opts.condition);
          }
        },
        {
          condition: options.phonesOnly,
          filterFn: function (item, opts) {
            return self.getPhones(item).length > 0;
          }
        },
        {
          condition: options.faxesOnly,
          filterFn: function (item, opts) {
            return self.getFaxes(item).length > 0;
          }
        }
      ]);
    };
    /**
     * @param {IContact} item
     */
    ContactHelper.prototype.validate = function (item) {
      return Validator.validate([
        {
          field: 'firstName',
          validator: Validator.required(item.firstName)
        },
        {
          field: 'lastName',
          validator: Validator.required(item.lastName)
        },
        {
          field: 'email',
          validator: Validator.email(item.email)
        },
        {
          field: 'email2',
          validator: Validator.email(item.email2)
        },
        {
          field: 'email3',
          validator: Validator.email(item.email3)
        }
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
    exports = {
      Class: ContactHelper,
      /**
       * @param {Context} context
       * @returns {ContactHelper}
       */
      $get: function (context) {
        return context.createSingleton('ContactHelper', function () {
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
    return exports;
  }({});
  helpers_Call = function (exports) {
    'use strict';
    var Helper = core_Helper.Class, Utils = core_Utils, List = core_List;
    /**
     * @extends Helper
     * @constructor
     */
    function CallHelper(context) {
      Helper.call(this, context);
      this.presence = helpers_Presence.$get(context);
      this.contact = helpers_Contact.$get(context);
    }
    CallHelper.prototype = Object.create(Helper.prototype);
    /**
     * @param {ICallOptions} [options]
     * @param {string} [id]
     * @returns {string}
     */
    CallHelper.prototype.createUrl = function (options, id) {
      options = options || {};
      if (!('personal' in options) && !('extensionId' in options))
        options.personal = true;
      return '/account/~/' + (options.personal || options.extensionId ? 'extension/' + (options.extensionId || '~') + '/' : '') + (options.active ? 'active-calls' : 'call-log') + (id ? '/' + id : '');
    };
    CallHelper.prototype.getSessionId = function (call) {
      return call && call.sessionId;
    };
    CallHelper.prototype.isInProgress = function (call) {
      return call && call.result == 'In Progress';
    };
    CallHelper.prototype.isAlive = function (call) {
      return call && call.availability == 'Alive';
    };
    /**
     * @param {ICall} call
     * @returns {boolean}
     */
    CallHelper.prototype.isInbound = function (call) {
      return call && call.direction == 'Inbound';
    };
    /**
     * @param {ICall} call
     * @returns {boolean}
     */
    CallHelper.prototype.isOutbound = function (call) {
      return !this.isInbound(call);
    };
    /**
     * @param {ICall} call
     * @returns {boolean}
     */
    CallHelper.prototype.isMissed = function (call) {
      return call && call.result == 'Missed';
    };
    /**
     * @param {ICall} call
     * @returns {boolean}
     */
    CallHelper.prototype.isFindMe = function (call) {
      return call && call.action == 'FindMe';
    };
    /**
     * @param {ICall} call
     * @returns {ICallerInfo}
     */
    CallHelper.prototype.getCallerInfo = function (call) {
      return this.isInbound(call) ? call.from : call.to;
    };
    /**
     * @param {ICall} call
     * @returns {ICallerInfo[]}
     */
    CallHelper.prototype.getAllCallerInfos = function (call) {
      return [this.getCallerInfo(call)].concat(this.isInbound(call) ? call.to : call.from);
    };
    CallHelper.prototype.formatDuration = function (call) {
      function addZero(v) {
        return v < 10 ? '0' + v : v;
      }
      var duration = parseInt(call.duration), hours = Math.floor(duration / (60 * 60)), mins = Math.floor(duration % (60 * 60) / 60), secs = Math.floor(duration % 60);
      return (hours ? hours + ':' : '') + addZero(mins) + ':' + addZero(secs);
    };
    /**
     * @param {ICallFilterOptions} [options]
     * @returns {function(ICall)}
     */
    CallHelper.prototype.filter = function (options) {
      options = Utils.extend({
        alive: true,
        direction: '',
        type: ''
      }, options);
      return List.filter([
        //{condition: options.alive, filterFn: this.isAlive},
        {
          filterBy: 'direction',
          condition: options.direction
        },
        {
          filterBy: 'type',
          condition: options.type
        }
      ]);
    };
    /**
     * TODO Compare as dates
     * @param {IListComparatorOptions} [options]
     * @returns {function(object, object)}
     */
    CallHelper.prototype.comparator = function (options) {
      return List.comparator(Utils.extend({ sortBy: 'startTime' }, options));
    };
    /**
     * Injects contact field with appropriate {IContact} data structure into all callerInfos found in
     * all calls Warning, this function may be performance-consuming, reduce the amount of items passed to contacts
     * and calls
     * @param {IContact[]} contacts
     * @param {ICall[]} calls
     * @param {IContactMatchOptions} [options]
     */
    CallHelper.prototype.attachContacts = function (contacts, calls, options) {
      var self = this;
      // Flatten all caller infos from all messages
      var callerInfos = calls.reduce(function (callerInfos, call) {
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
    CallHelper.prototype.checkMergeability = function (outboundRingOutCall, inboundCall, options) {
      function getTime(dateString) {
        return new Date(dateString).getTime();
      }
      return (!options.strict || outboundRingOutCall.action && outboundRingOutCall.action.toLowerCase().indexOf('ringout') != -1) && // Check directions
      outboundRingOutCall.direction == 'Outbound' && inboundCall.direction == 'Inbound' && (!inboundCall.startTime && !outboundRingOutCall.startTime || Math.abs(getTime(inboundCall.startTime) - getTime(outboundRingOutCall.startTime)) < (options.maxStartTimeDiscrepancy || 5000)) && // Check that numbers match
      inboundCall.from.phoneNumber == outboundRingOutCall.to.phoneNumber && (inboundCall.to.phoneNumber == outboundRingOutCall.from.phoneNumber || inboundCall.to.name == outboundRingOutCall.from.name)  //TODO Maybe name check is not required
;
    };
    /**
     * @param {ICall} outboundRingOutCall
     * @param {ICall} inboundCall
     * @param {ICallProcessingOptions} [options]
     * @returns {Array}
     */
    CallHelper.prototype.combineCalls = function (outboundRingOutCall, inboundCall, options) {
      options = options || {};
      var result = [];
      outboundRingOutCall.hasSubsequent = true;
      if (options.merge) {
        outboundRingOutCall.duration = outboundRingOutCall.duration > inboundCall.duration ? outboundRingOutCall.duration : inboundCall.duration;
        // TODO Usually information from inbound call is more accurate for unknown reason
        outboundRingOutCall.from = inboundCall.to;
        outboundRingOutCall.to = inboundCall.from;
        // Push only one "merged" outbound call
        result.push(outboundRingOutCall);
      } else {
        // Mark next call as subsequent
        inboundCall.subsequent = true;
        inboundCall.startTime = outboundRingOutCall.startTime;
        // Needed for sort
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
    CallHelper.prototype.processCalls = function (calls, options) {
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
     * @param {IPresenceCall[]} activeCalls
     * @returns {ICall[]}
     */
    CallHelper.prototype.parsePresenceCalls = function (activeCalls) {
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
          result: this.presence.isCallInProgress(activeCall) ? 'In Progress' : activeCall.telephonyStatus,
          telephonyStatus: activeCall.telephonyStatus
        };
      }, this);
    };
    /**
     * @param {ICall} call
     * @returns {string}
     */
    CallHelper.prototype.getSignature = function (call) {
      function cleanup(phoneNumber) {
        return (phoneNumber || '').toString().replace(/[^0-9]/gi, '');
      }
      return call.direction + '|' + (call.from && cleanup(call.from.phoneNumber)) + '|' + (call.to && cleanup(call.to.phoneNumber));
    };
    /**
     * @param {ICall[]} presenceCalls
     * @param {IPresence} presence
     * @returns {ICall[]}
     */
    CallHelper.prototype.mergePresenceCalls = function (presenceCalls, presence) {
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
    /**
     * @param {ICall[]} presenceCalls
     * @param {ICall[]} calls
     * @param {ICall[]} activeCalls
     * @returns {ICall[]}
     */
    CallHelper.prototype.mergeAll = function (presenceCalls, calls, activeCalls) {
      // First, merge calls into presence calls
      var presenceAndCalls = this.merge(presenceCalls || [], calls || [], this.getSessionId, true);
      // Second, merge activeCalls into previous result
      return this.merge(presenceAndCalls, activeCalls || [], this.getSessionId, true);
    };
    exports = {
      Class: CallHelper,
      /**
       * @param {Context} context
       * @returns {CallHelper}
       */
      $get: function (context) {
        return context.createSingleton('CallHelper', function () {
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
    return exports;
  }({});
  helpers_Conferencing = function (exports) {
    'use strict';
    var Helper = core_Helper.Class;
    /**
     * @extends Helper
     * @constructor
     */
    function ConferencingHelper(context) {
      Helper.call(this, context);
    }
    ConferencingHelper.prototype = Object.create(Helper.prototype);
    ConferencingHelper.prototype.createUrl = function () {
      return '/account/~/extension/~/conferencing';
    };
    exports = {
      Class: ConferencingHelper,
      /**
       * @param {Context} context
       * @returns {ConferencingHelper}
       */
      $get: function (context) {
        return context.createSingleton('ConferencingHelper', function () {
          return new ConferencingHelper(context);
        });
      }
    };
    return exports;
  }({});
  helpers_ContactGroup = function (exports) {
    'use strict';
    var Helper = core_Helper.Class, Validator = core_Validator;
    /**
     * @extends Helper
     * @constructor
     */
    function ContactGroupHelper(context) {
      Helper.call(this, context);
    }
    ContactGroupHelper.prototype = Object.create(Helper.prototype);
    ContactGroupHelper.prototype.createUrl = function (options, id) {
      return '/account/~/extension/~/address-book/group' + (id ? '/' + id : '');
    };
    /**
     * @param {IContactGroup} item
     */
    ContactGroupHelper.prototype.validate = function (item) {
      return Validator.validate([{
          field: 'groupName',
          validator: Validator.required(item && item.groupName)
        }]);
    };
    exports = {
      Class: ContactGroupHelper,
      /**
       * @param {Context} context
       * @returns {ContactGroupHelper}
       */
      $get: function (context) {
        return context.createSingleton('ContactGroupHelper', function () {
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
    return exports;
  }({});
  helpers_Device = function (exports) {
    'use strict';
    var Helper = core_Helper.Class, Validator = core_Validator;
    /**
     * @extends Helper
     * @constructor
     */
    function DeviceHelper(context) {
      Helper.call(this, context);
      this.extension = helpers_Extension.$get(context);
      this.deviceModel = helpers_DeviceModel.$get(context);
    }
    DeviceHelper.prototype = Object.create(Helper.prototype);
    /**
     * @param {IDeviceOptions} [options]
     * @param {string} [id]
     * @returns {string}
     */
    DeviceHelper.prototype.createUrl = function (options, id) {
      options = options || {};
      if (options.order)
        return '/account/~/order';
      return '/account/~' + (options.extensionId ? '/extension/' + options.extensionId : '') + '/device' + (id ? '/' + id : '');
    };
    /**
     * @param {IDevice} item
     */
    DeviceHelper.prototype.validate = function (item) {
      return Validator.validate([
        {
          field: 'emergencyServiceAddress-street',
          validator: Validator.required(item && item.emergencyServiceAddress && item.emergencyServiceAddress.street)
        },
        {
          field: 'emergencyServiceAddress-city',
          validator: Validator.required(item && item.emergencyServiceAddress && item.emergencyServiceAddress.city)
        },
        {
          field: 'emergencyServiceAddress-state',
          validator: Validator.required(item && item.emergencyServiceAddress && item.emergencyServiceAddress.state)
        },
        {
          field: 'emergencyServiceAddress-country',
          validator: Validator.required(item && item.emergencyServiceAddress && item.emergencyServiceAddress.country)
        },
        {
          field: 'emergencyServiceAddress-zip',
          validator: Validator.required(item && item.emergencyServiceAddress && item.emergencyServiceAddress.zip)
        },
        {
          field: 'emergencyServiceAddress-customerName',
          validator: Validator.required(item && item.emergencyServiceAddress && item.emergencyServiceAddress.customerName)
        },
        {
          field: 'extension',
          validator: Validator.required(this.extension.getId(item && item.extension))
        },
        {
          field: 'model',
          validator: Validator.required(this.deviceModel.getId(item && item.model))
        }
      ]);
    };
    exports = {
      Class: DeviceHelper,
      /**
       * @param {Context} context
       * @returns {DeviceHelper}
       */
      $get: function (context) {
        return context.createSingleton('DeviceHelper', function () {
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
    return exports;
  }({});
  helpers_ForwardingNumber = function (exports) {
    'use strict';
    var Helper = core_Helper.Class, Utils = core_Utils, List = core_List;
    /**
     * @extends Helper
     * @constructor
     */
    function ForwardingNumberHelper(context) {
      Helper.call(this, context);
    }
    ForwardingNumberHelper.prototype = Object.create(Helper.prototype);
    ForwardingNumberHelper.prototype.createUrl = function (options, id) {
      options = options || {};
      return '/account/~/extension/' + (options.extensionId || '~') + '/forwarding-number' + (id ? '/' + id : '');
    };
    ForwardingNumberHelper.prototype.getId = function (forwardingNumber) {
      return forwardingNumber.id || forwardingNumber.phoneNumber;
    };
    ForwardingNumberHelper.prototype.hasFeature = function (phoneNumber, feature) {
      return !!phoneNumber.features && phoneNumber.features.indexOf(feature) != -1;
    };
    /**
     * @param {IListComparatorOptions} [options]
     * @returns {function(object, object)}
     */
    ForwardingNumberHelper.prototype.comparator = function (options) {
      return List.comparator(Utils.extend({ sortBy: 'label' }, options));
    };
    /**
     * @param options
     * @returns {function(IForwardingNumber)}
     */
    ForwardingNumberHelper.prototype.filter = function (options) {
      var self = this;
      options = Utils.extend({ features: [] }, options);
      return List.filter([{
          condition: options.features.length,
          filterFn: function (item) {
            return options.features.some(function (feature) {
              return self.hasFeature(item, feature);
            });
          }
        }]);
    };
    exports = {
      Class: ForwardingNumberHelper,
      /**
       * @param {Context} context
       * @returns {ForwardingNumberHelper}
       */
      $get: function (context) {
        return context.createSingleton('ForwardingNumberHelper', function () {
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
    return exports;
  }({});
  helpers_Message = function (exports) {
    'use strict';
    var Helper = core_Helper.Class, Validator = core_Validator, Utils = core_Utils, List = core_List;
    /**
     * @extends Helper
     * @constructor
     */
    function MessageHelper(context) {
      Helper.call(this, context);
      this.platform = core_Platform.$get(context);
      this.contact = helpers_Contact.$get(context);
    }
    MessageHelper.prototype = Object.create(Helper.prototype);
    /**
     *
     * @param {IMessageOptions} [options]
     * @param {string} [id]
     * @returns {string}
     * @exceptionalCase Different endpoint when creating SMS/Pager
     */
    MessageHelper.prototype.createUrl = function (options, id) {
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
    MessageHelper.prototype.isInbound = function (message) {
      return message && message.direction == 'Inbound';
    };
    MessageHelper.prototype.isOutbound = function (message) {
      return !this.isInbound(message);
    };
    MessageHelper.prototype.isSMS = function (message) {
      return message && message.type == 'SMS';
    };
    MessageHelper.prototype.isPager = function (message) {
      return message && message.type == 'Pager';
    };
    MessageHelper.prototype.isVoiceMail = function (message) {
      return message && message.type == 'VoiceMail';
    };
    MessageHelper.prototype.isFax = function (message) {
      return message && message.type == 'Fax';
    };
    MessageHelper.prototype.isAlive = function (message) {
      //return (this.availability != 'Deleted' && this.availability != 'Purged');
      return message && message.availability == 'Alive';
    };
    MessageHelper.prototype.isRead = function (message) {
      return message.readStatus == 'Read';
    };
    MessageHelper.prototype.setIsRead = function (message, isRead) {
      message.readStatus = !!isRead ? 'Read' : 'Unread';
      return message;
    };
    MessageHelper.prototype.getAttachmentUrl = function (message, i) {
      return message.attachments[i] ? this.platform.apiUrl(message.attachments[i].uri, {
        addMethod: 'GET',
        addServer: true,
        addToken: true
      }) : '';
    };
    MessageHelper.prototype.getAttachmentContentType = function (message, i) {
      return message.attachments[i] ? message.attachments[i].contentType : '';
    };
    /**
     * @returns {Subscription}
     */
    MessageHelper.prototype.getSubscription = function (options) {
      return core_Subscription.$get(this.context).setEvents([this.createUrl(options)]);
    };
    /**
     * Returns from-phones if inbound (oterwise to-phones)
     * @returns {ICallerInfo[]}
     */
    MessageHelper.prototype.getCallerInfos = function (message) {
      return this.isInbound(message) ? [message.from] : message.to;
    };
    /**
     * Returns first from-phones if inbound (oterwise to-phones), then vice-versa
     * @returns {ICallerInfo[]}
     */
    MessageHelper.prototype.getAllCallerInfos = function (message) {
      return this.getCallerInfos(message).concat(this.isInbound(message) ? message.to : [message.from]);
    };
    /**
     * TODO Compare as dates
     * @param {IListComparatorOptions} [options]
     * @returns {function(object, object)}
     */
    MessageHelper.prototype.comparator = function (options) {
      return List.comparator(Utils.extend({ sortBy: 'creationTime' }, options));
    };
    /**
     * @param {IMessageFilterOptions} [options]
     * @returns {function(IMessage)}
     */
    MessageHelper.prototype.filter = function (options) {
      options = Utils.extend({
        search: '',
        alive: true,
        direction: '',
        conversationId: '',
        readStatus: ''
      }, options);
      return List.filter([
        {
          condition: options.alive,
          filterFn: this.isAlive
        },
        {
          filterBy: 'type',
          condition: options.type
        },
        {
          filterBy: 'direction',
          condition: options.direction
        },
        {
          filterBy: 'conversationId',
          condition: options.conversationId
        },
        {
          filterBy: 'readStatus',
          condition: options.readStatus
        },
        {
          filterBy: 'subject',
          condition: options.search,
          filterFn: List.containsFilter
        }
      ]);
    };
    /**
     * Injects contact field with appropriate {IContact} data structure into all callerInfos found in all messages
     * Warning, this function may be performance-consuming, reduce the amount of items passed to contacts and messages
     * @param {IContact[]} contacts
     * @param {IMessage[]} messages
     * @param {IContactMatchOptions} [options]
     */
    MessageHelper.prototype.attachContacts = function (contacts, messages, options) {
      var self = this;
      // Flatten all caller infos from all messages
      var callerInfos = messages.reduce(function (callerInfos, message) {
        return callerInfos.concat(self.getAllCallerInfos(message));
      }, []);
      this.contact.attachToCallerInfos(callerInfos, contacts, options);
    };
    /**
     *
     * @param message
     * @returns {IMessageShort}
     */
    MessageHelper.prototype.shorten = function (message) {
      return {
        from: message.from,
        to: message.to,
        text: message.subject
      };
    };
    /**
     * @param {IMessage} item
     */
    MessageHelper.prototype.validateSMS = function (item) {
      return Validator.validate([
        {
          field: 'to',
          validator: Validator.required(Utils.getProperty(item, 'to[0].phoneNumber'))
        },
        {
          field: 'from',
          validator: Validator.required(Utils.getProperty(item, 'from.phoneNumber'))
        },
        {
          field: 'subject',
          validator: Validator.required(Utils.getProperty(item, 'subject'))
        },
        {
          field: 'subject',
          validator: Validator.length(Utils.getProperty(item, 'subject'), 160)
        }
      ]);
    };
    /**
     * @param {IMessage} item
     */
    MessageHelper.prototype.validatePager = function (item) {
      return Validator.validate([
        {
          field: 'to',
          validator: Validator.required(Utils.getProperty(item, 'to.extensionNumber'))
        },
        {
          field: 'from',
          validator: Validator.required(Utils.getProperty(item, 'from.extensionNumber'))
        },
        {
          field: 'subject',
          validator: Validator.required(Utils.getProperty(item, 'subject'))
        },
        {
          field: 'subject',
          validator: Validator.length(Utils.getProperty(item, 'subject'), 160)
        }
      ]);
    };
    exports = {
      Class: MessageHelper,
      /**
       * @param {Context} context
       * @returns {MessageHelper}
       */
      $get: function (context) {
        return context.createSingleton('MessageHelper', function () {
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
    return exports;
  }({});
  helpers_PhoneNumber = function (exports) {
    'use strict';
    var List = core_List, Utils = core_Utils, Helper = core_Helper.Class;
    /**
     * @extends Helper
     * @constructor
     */
    function PhoneNumberHelper(context) {
      Helper.call(this, context);
      this.extension = helpers_Extension.$get(context);
    }
    PhoneNumberHelper.prototype = Object.create(Helper.prototype);
    /**
     * @param {IPhoneNumberOptions} [options]
     * @param {string} [id]
     * @returns {string}
     */
    PhoneNumberHelper.prototype.createUrl = function (options, id) {
      options = options || {};
      if (options.lookup)
        return '/number-pool/lookup';
      return '/account/~' + (options.extensionId ? '/extension/' + options.extensionId : '') + '/phone-number' + (id ? '/' + id : '');
    };
    PhoneNumberHelper.prototype.isSMS = function (phoneNumber) {
      return this.hasFeature(phoneNumber, 'SmsSender');
    };
    PhoneNumberHelper.prototype.hasFeature = function (phoneNumber, feature) {
      return !!phoneNumber.features && phoneNumber.features.indexOf(feature) != -1;
    };
    PhoneNumberHelper.prototype.reserve = function (phoneNumber, date) {
      phoneNumber.reservedTill = new Date(date).toISOString();
    };
    PhoneNumberHelper.prototype.unreserve = function (phoneNumber) {
      phoneNumber.reservedTill = null;
    };
    /**
     * @param {IListComparatorOptions} [options]
     * @returns {function(IPhoneNumber, IPhoneNumber)}
     */
    PhoneNumberHelper.prototype.comparator = function (options) {
      return List.comparator(Utils.extend({
        /**
         * @param {IPhoneNumber} item
         * @returns {string}
         */
        extractFn: function (item) {
          return item.usageType + '-' + item.paymentType + '-' + item.type;
        }
      }, options));
    };
    /**
     * TODO Add other filtering methods http://jira.ringcentral.com/browse/SDK-5
     * @param {IPhoneNumberFilterOptions} options
     * @returns {function(IForwardingNumber)}
     */
    PhoneNumberHelper.prototype.filter = function (options) {
      var self = this;
      options = Utils.extend({
        usageType: '',
        paymentType: '',
        type: '',
        features: []
      }, options);
      return List.filter([
        {
          filterBy: 'usageType',
          condition: options.usageType
        },
        {
          filterBy: 'paymentType',
          condition: options.paymentType
        },
        {
          filterBy: 'type',
          condition: options.type
        },
        {
          condition: options.features.length,
          filterFn: function (item) {
            return options.features.some(function (feature) {
              return self.hasFeature(item, feature);
            });
          }
        }
      ]);
    };
    exports = {
      Class: PhoneNumberHelper,
      /**
       * @param {Context} context
       * @returns {PhoneNumberHelper}
       */
      $get: function (context) {
        return context.createSingleton('PhoneNumberHelper', function () {
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
    return exports;
  }({});
  helpers_Ringout = function (exports) {
    'use strict';
    var Helper = core_Helper.Class, Validator = core_Validator;
    /**
     * @extends Helper
     * @constructor
     */
    function RingoutHelper(context) {
      Helper.call(this, context);
      this.extension = helpers_Extension.$get(context);
    }
    RingoutHelper.prototype = Object.create(Helper.prototype);
    RingoutHelper.prototype.createUrl = function (options, id) {
      options = options || {};
      return '/account/~/extension/' + (options.extensionId || '~') + '/ringout' + (id ? '/' + id : '');
    };
    RingoutHelper.prototype.resetAsNew = function (object) {
      object = Helper.prototype.resetAsNew.call(this, object);
      if (object) {
        delete object.status;
      }
      return object;
    };
    RingoutHelper.prototype.isInProgress = function (ringout) {
      return ringout && !this.isNew(ringout) && ringout.status && ringout.status.callStatus == 'InProgress';
    };
    RingoutHelper.prototype.isSuccess = function (ringout) {
      return ringout && !this.isNew(ringout) && ringout.status && ringout.status.callStatus == 'Success';
    };
    RingoutHelper.prototype.isError = function (ringout) {
      return !this.isNew(ringout) && !this.isInProgress(ringout) && !this.isSuccess(ringout);
    };
    /**
     * @param {IRingout} item
     */
    RingoutHelper.prototype.validate = function (item) {
      return Validator.validate([
        {
          field: 'to',
          validator: Validator.required(item && item.to && item.to.phoneNumber)
        },
        {
          field: 'from',
          validator: Validator.required(item && item.from && item.from.phoneNumber)
        }
      ]);
    };
    exports = {
      Class: RingoutHelper,
      /**
       * @param {Context} context
       * @returns {RingoutHelper}
       */
      $get: function (context) {
        return context.createSingleton('RingoutHelper', function () {
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
    return exports;
  }({});
  helpers_Service = function (exports) {
    'use strict';
    var Helper = core_Helper.Class;
    /**
     * @extends Helper
     * @constructor
     */
    function ServiceHelper(context) {
      Helper.call(this, context);
    }
    ServiceHelper.prototype = Object.create(Helper.prototype);
    ServiceHelper.prototype.createUrl = function () {
      return '/account/~/service-info';
    };
    /**
     * @param {string} feature
     * @param {IServiceFeature[]} serviceFeatures
     * @returns {*}
     */
    ServiceHelper.prototype.isEnabled = function (feature, serviceFeatures) {
      return serviceFeatures.reduce(function (value, f) {
        if (f.featureName == feature)
          value = f.enabled;
        return value;
      }, false);
    };
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
    function isServiceFeatureEnabledMethod(feature) {
      return function (serviceFeatures) {
        return this.isEnabled(feature, serviceFeatures);
      };
    }
    exports = {
      Class: ServiceHelper,
      /**
       * @param {Context} context
       * @returns {ServiceHelper}
       */
      $get: function (context) {
        return context.createSingleton('serviceHelper', function () {
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
    return exports;
  }({});
  RCSDK = function (exports) {
    'use strict';
    /**
     * @param {IInjections} injections
     * @returns {RCSDK}
     */
    exports = function (injections) {
      /**
       * @name RCSDK
       * @constructor
       */
      function RCSDK(options) {
        /** @private */
        this._context = core_Context.$get(injections);  //TODO Link Platform events with Subscriptions and the rest
      }
      RCSDK.version = '1.1.4';
      // Internals
      /**
       * @returns {Context}
       */
      RCSDK.prototype.getContext = function () {
        return this._context;
      };
      // Core
      /**
       */
      RCSDK.prototype.getAjax = function () {
        return core_Ajax.$get(this.getContext());
      };
      /**
       * @returns {AjaxObserver}
       */
      RCSDK.prototype.getAjaxObserver = function () {
        return core_AjaxObserver.$get(this.getContext());
      };
      /**
       * @returns {XhrResponse}
       */
      RCSDK.prototype.getXhrResponse = function () {
        return core_xhr_XhrResponse.$get(this.getContext());
      };
      /**
       * @returns {Platform}
       */
      RCSDK.prototype.getPlatform = function () {
        return core_Platform.$get(this.getContext());
      };
      /**
       * @returns {Cache}
       */
      RCSDK.prototype.getCache = function () {
        return core_Cache.$get(this.getContext());
      };
      /**
       * @returns {Subscription}
       */
      RCSDK.prototype.getSubscription = function () {
        return core_Subscription.$get(this.getContext());
      };
      /**
       * @returns {PageVisibility}
       */
      RCSDK.prototype.getPageVisibility = function () {
        return core_PageVisibility.$get(this.getContext());
      };
      /**
       * @returns {Helper}
       */
      RCSDK.prototype.getHelper = function () {
        return core_Helper.$get(this.getContext());
      };
      /**
       * @returns {Observable}
       */
      RCSDK.prototype.getObservable = function () {
        return core_Observable.$get(this.getContext());
      };
      /**
       * @returns {Validator}
       */
      RCSDK.prototype.getValidator = function () {
        return core_Validator.$get(this.getContext());
      };
      /**
       * @returns {Log}
       */
      RCSDK.prototype.getLog = function () {
        return core_Log.$get(this.getContext());
      };
      /**
       * @returns {Utils}
       */
      RCSDK.prototype.getUtils = function () {
        return core_Utils.$get(this.getContext());
      };
      /**
       * @returns {List}
       */
      RCSDK.prototype.getList = function () {
        return core_List.$get(this.getContext());
      };
      // Helpers
      /**
       * @returns {CountryHelper}
       */
      RCSDK.prototype.getCountryHelper = function () {
        return helpers_Country.$get(this.getContext());
      };
      /**
       * @returns {DeviceModelHelper}
       */
      RCSDK.prototype.getDeviceModelHelper = function () {
        return helpers_DeviceModel.$get(this.getContext());
      };
      /**
       * @returns {LanguageHelper}
       */
      RCSDK.prototype.getLanguageHelper = function () {
        return helpers_Language.$get(this.getContext());
      };
      /**
       * @returns {LocationHelper}
       */
      RCSDK.prototype.getLocationHelper = function () {
        return helpers_Location.$get(this.getContext());
      };
      /**
       * @returns {ShippingMethodHelper}
       */
      RCSDK.prototype.getShippingMethodHelper = function () {
        return helpers_ShippingMethod.$get(this.getContext());
      };
      /**
       * @returns {StateHelper}
       */
      RCSDK.prototype.getStateHelper = function () {
        return helpers_State.$get(this.getContext());
      };
      /**
       * @returns {TimezoneHelper}
       */
      RCSDK.prototype.getTimezoneHelper = function () {
        return helpers_Timezone.$get(this.getContext());
      };
      /**
       * @returns {AccountHelper}
       */
      RCSDK.prototype.getAccountHelper = function () {
        return helpers_Account.$get(this.getContext());
      };
      /**
       * @returns {BlockedNumberHelper}
       */
      RCSDK.prototype.getBlockedNumberHelper = function () {
        return helpers_BlockedNumber.$get(this.getContext());
      };
      /**
       * @returns {CallHelper}
       */
      RCSDK.prototype.getCallHelper = function () {
        return helpers_Call.$get(this.getContext());
      };
      /**
       * @returns {ConferencingHelper}
       */
      RCSDK.prototype.getConferencingHelper = function () {
        return helpers_Conferencing.$get(this.getContext());
      };
      /**
       * @returns {ContactHelper}
       */
      RCSDK.prototype.getContactHelper = function () {
        return helpers_Contact.$get(this.getContext());
      };
      /**
       * @returns {ContactGroupHelper}
       */
      RCSDK.prototype.getContactGroupHelper = function () {
        return helpers_ContactGroup.$get(this.getContext());
      };
      /**
       * @returns {DeviceHelper}
       */
      RCSDK.prototype.getDeviceHelper = function () {
        return helpers_Device.$get(this.getContext());
      };
      /**
       * @returns {ExtensionHelper}
       */
      RCSDK.prototype.getExtensionHelper = function () {
        return helpers_Extension.$get(this.getContext());
      };
      /**
       * @returns {ForwardingNumberHelper}
       */
      RCSDK.prototype.getForwardingNumberHelper = function () {
        return helpers_ForwardingNumber.$get(this.getContext());
      };
      /**
       * @returns {MessageHelper}
       */
      RCSDK.prototype.getMessageHelper = function () {
        return helpers_Message.$get(this.getContext());
      };
      /**
       * @returns {PhoneNumberHelper}
       */
      RCSDK.prototype.getPhoneNumberHelper = function () {
        return helpers_PhoneNumber.$get(this.getContext());
      };
      /**
       * @returns {PresenceHelper}
       */
      RCSDK.prototype.getPresenceHelper = function () {
        return helpers_Presence.$get(this.getContext());
      };
      /**
       * @returns {RingoutHelper}
       */
      RCSDK.prototype.getRingoutHelper = function () {
        return helpers_Ringout.$get(this.getContext());
      };
      /**
       * @returns {ServiceHelper}
       */
      RCSDK.prototype.getServiceHelper = function () {
        return helpers_Service.$get(this.getContext());
      };
      /** @type {window} */
      var root = new Function('return this')();
      function getXHR() {
        return root.XMLHttpRequest || function () {
          try {
            return new ActiveXObject('Msxml2.XMLHTTP.6.0');
          } catch (e1) {
          }
          try {
            return new ActiveXObject('Msxml2.XMLHTTP.3.0');
          } catch (e2) {
          }
          try {
            return new ActiveXObject('Msxml2.XMLHTTP');
          } catch (e3) {
          }
          throw new Error('This browser does not support XMLHttpRequest.');
        };
      }
      function getCryptoJS() {
        return root.CryptoJS || typeof CryptoJS !== 'undefined' && CryptoJS;
      }
      function getLocalStorage() {
        return root.localStorage;
      }
      function getPUBNUB() {
        return root.PUBNUB || typeof PUBNUB !== 'undefined' && PUBNUB;
      }
      function getPromise() {
        return root.Promise;
      }
      injections = injections || {};
      injections.CryptoJS = injections.CryptoJS || getCryptoJS();
      injections.localStorage = injections.localStorage || getLocalStorage();
      injections.Promise = injections.Promise || getPromise();
      injections.PUBNUB = injections.PUBNUB || getPUBNUB();
      injections.XHR = injections.XHR || getXHR();
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
    return exports;
  }({});
  (function () {
    if (typeof exports !== 'undefined') {
      // NodeJS
      if (typeof module !== 'undefined' && module.exports) {
        exports = module.exports = RCSDK({
          CryptoJS: require('crypto-js'),
          localStorage: new (require('dom-storage'))(),
          Promise: require('es6-promise').Promise,
          PUBNUB: require('pubnub'),
          XHR: require('xhr2')
        });
      }
    } else if (typeof define === 'function' && define.amd) {
      // RequireJS
      define([
        'crypto-js',
        'pubnub',
        'es6-promise'
      ], function (CryptoJS, PUBNUB) {
        // amdclean
        return RCSDK({
          CryptoJS: CryptoJS,
          PUBNUB: PUBNUB
        });
      });
    } else {
      // Standalone in browser
      RCSDK.noConflict = function (old) {
        return function () {
          root.RCSDK = old;
          RCSDK.noConflict = undefined;
          return RCSDK;
        };
      }(root.RCSDK);
      root.RCSDK = RCSDK({});
    }
  }());
}(this));
//# sourceMappingURL=rc-sdk.js.map