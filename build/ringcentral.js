(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("es6-promise"), require("fetch-ponyfill"), require("pubnub"));
	else if(typeof define === 'function' && define.amd)
		define([, , "pubnub"], factory);
	else if(typeof exports === 'object')
		exports["SDK"] = factory(require("es6-promise"), require("fetch-ponyfill"), require("pubnub"));
	else
		root["RingCentral"] = root["RingCentral"] || {}, root["RingCentral"]["SDK"] = factory(root[undefined], root[undefined], root[undefined]);
})(this, function(__WEBPACK_EXTERNAL_MODULE_5__, __WEBPACK_EXTERNAL_MODULE_6__, __WEBPACK_EXTERNAL_MODULE_7__) {
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

"use strict";

__webpack_require__(2);

var _Utils = __webpack_require__(3);

var Utils = _interopRequireWildcard(_Utils);

var _Cache = __webpack_require__(11);

var _Cache2 = _interopRequireDefault(_Cache);

var _Externals = __webpack_require__(4);

var Externals = _interopRequireWildcard(_Externals);

var _events = __webpack_require__(12);

var _events2 = _interopRequireDefault(_events);

var _Client = __webpack_require__(13);

var _Client2 = _interopRequireDefault(_Client);

var _ApiResponse = __webpack_require__(14);

var _ApiResponse2 = _interopRequireDefault(_ApiResponse);

var _ClientMock = __webpack_require__(15);

var _ClientMock2 = _interopRequireDefault(_ClientMock);

var _Mock = __webpack_require__(17);

var _Mock2 = _interopRequireDefault(_Mock);

var _Registry = __webpack_require__(16);

var _Registry2 = _interopRequireDefault(_Registry);

var _Platform = __webpack_require__(18);

var _Platform2 = _interopRequireDefault(_Platform);

var _Auth = __webpack_require__(19);

var _Auth2 = _interopRequireDefault(_Auth);

var _PubnubFactory = __webpack_require__(21);

var _PubnubFactory2 = _interopRequireDefault(_PubnubFactory);

var _Subscription = __webpack_require__(23);

var _Subscription2 = _interopRequireDefault(_Subscription);

var _CachedSubscription = __webpack_require__(24);

var _CachedSubscription2 = _interopRequireDefault(_CachedSubscription);

var _Constants = __webpack_require__(20);

var _Constants2 = _interopRequireDefault(_Constants);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var SDK = function () {

    /**
     * @namespace RingCentral
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
     * @param {string} [options.redirectUri]
     */

    function SDK(_ref) {
        var server = _ref.server;
        var cachePrefix = _ref.cachePrefix;
        var appSecret = _ref.appSecret;
        var appKey = _ref.appKey;
        var appName = _ref.appName;
        var appVersion = _ref.appVersion;
        var pubnubFactory = _ref.pubnubFactory;
        var client = _ref.client;
        var redirectUri = _ref.redirectUri;

        _classCallCheck(this, SDK);

        if (!Externals.fetch) {
            throw new Error('Native Fetch is missing, set RingCentral.SDK.core.Externals.fetch to your favorite alternative');
        }

        if (!Externals.Promise) {
            throw new Error('Native Promise is missing, set RingCentral.SDK.core.Externals.Promise to your favorite alternative');
        }

        this._cache = new _Cache2.default(Externals.localStorage, cachePrefix);

        this._client = client || new _Client2.default();

        this._platform = new _Platform2.default({
            client: this._client,
            cache: this._cache,
            version: SDK.version,
            server: server,
            appKey: appKey,
            appSecret: appSecret,
            appName: appName,
            appVersion: appVersion,
            redirectUri: redirectUri
        });

        this._pubnubFactory = pubnubFactory || Externals.PUBNUB;
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
        return new _Subscription2.default(this._pubnubFactory, this._platform);
    };

    /**
     * @return {CachedSubscription}
     */


    SDK.prototype.createCachedSubscription = function createCachedSubscription(cacheKey) {
        return new _CachedSubscription2.default(this._pubnubFactory, this._platform, this._cache, cacheKey);
    };

    /**
     * @return {Cache}
     */


    SDK.prototype.cache = function cache() {
        return this._cache;
    };

    SDK.handleLoginRedirect = function handleLoginRedirect(origin) {
        var _window$opener$postMe;

        var response = window.location.hash ? window.location.hash : window.location.search;
        window.opener.postMessage((_window$opener$postMe = {}, _window$opener$postMe[_Constants2.default.authResponseProperty] = response, _window$opener$postMe), origin || window.location.origin);
    };

    return SDK;
}();

SDK.version = _Constants2.default.version;
SDK.server = {
    sandbox: 'https://platform.devtest.ringcentral.com',
    production: 'https://platform.ringcentral.com'
};
SDK.core = {
    Cache: _Cache2.default,
    EventEmitter: _events2.default,
    Utils: Utils,
    Externals: Externals
};
SDK.http = {
    Client: _Client2.default,
    ApiResponse: _ApiResponse2.default
};
SDK.platform = {
    Auth: _Auth2.default,
    Platform: _Platform2.default
};
SDK.subscription = {
    Subscription: _Subscription2.default
};
SDK.mocks = {
    Client: _ClientMock2.default,
    Registry: _Registry2.default,
    Mock: _Mock2.default
};
SDK.pubnub = {
    PubnubMockFactory: _PubnubFactory2.default
};


module.exports = SDK;

/***/ },
/* 2 */
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
          context._sent = arg;

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

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

"use strict";

exports.__esModule = true;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

exports.queryStringify = queryStringify;
exports.parseQueryString = parseQueryString;
exports.isFunction = isFunction;
exports.isArray = isArray;
exports.isObject = isObject;
exports.isObjectObject = isObjectObject;
exports.isPlainObject = isPlainObject;
exports.isNodeJS = isNodeJS;
exports.isBrowser = isBrowser;
exports.delay = delay;

var _Externals = __webpack_require__(4);

var _querystring = __webpack_require__(8);

var _querystring2 = _interopRequireDefault(_querystring);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * @param {object} parameters
 * @returns {string}
 */
function queryStringify(parameters) {
    return _querystring2.default.stringify(parameters);
}

/**
 * @param {string} queryString
 * @returns {object}
 */
function parseQueryString(queryString) {
    return _querystring2.default.parse(queryString);
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

function isObject(o) {
    return o != null && (typeof o === "undefined" ? "undefined" : _typeof(o)) === 'object' && !isArray(o);
}

function isObjectObject(o) {
    return isObject(o) === true && Object.prototype.toString.call(o) === '[object Object]';
}

function isPlainObject(o) {
    var ctor, prot;

    if (isObjectObject(o) === false) return false;

    // If has modified constructor
    ctor = o.constructor;
    if (typeof ctor !== 'function') return false;

    // If has modified prototype
    prot = ctor.prototype;
    if (isObjectObject(prot) === false) return false;

    // If constructor does not have an Object-specific method
    if (prot.hasOwnProperty('isPrototypeOf') === false) {
        return false;
    }

    // Most likely a plain Object
    return true;
}

function isNodeJS() {
    return typeof process !== 'undefined';
}

function isBrowser() {
    return typeof window !== 'undefined';
}

function delay(timeout) {
    return new _Externals.Promise(function (resolve, reject) {
        setTimeout(function () {
            resolve(null);
        }, timeout);
    });
}

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(global) {"use strict";

exports.__esModule = true;
exports.localStorage = exports.PUBNUB = exports.Headers = exports.Response = exports.Request = exports.fetch = exports.Promise = undefined;

var _es6Promise = __webpack_require__(5);

var _es6Promise2 = _interopRequireDefault(_es6Promise);

var _fetchPonyfill = __webpack_require__(6);

var _fetchPonyfill2 = _interopRequireDefault(_fetchPonyfill);

var _pubnub = __webpack_require__(7);

var _pubnub2 = _interopRequireDefault(_pubnub);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var root = typeof window !== "undefined" && window || typeof global !== "undefined" && global || Function("return this;")();

var Promise = _es6Promise2.default && _es6Promise2.default.Promise || root.Promise;

var fetchParts = _fetchPonyfill2.default ? (0, _fetchPonyfill2.default)({ Promise: Promise }) : {};

var fetch = fetchParts.fetch || root.fetch;
var Request = fetchParts.Request || root.Request;
var Response = fetchParts.Response || root.Response;
var Headers = fetchParts.Headers || root.Headers;

var PUBNUB = _pubnub2.default || root.PUBNUB;

var localStorage = typeof root.localStorage !== 'undefined' ? root.localStorage : {};

exports.Promise = Promise;
exports.fetch = fetch;
exports.Request = Request;
exports.Response = Response;
exports.Headers = Headers;
exports.PUBNUB = PUBNUB;
exports.localStorage = localStorage;
/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

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

module.exports = __WEBPACK_EXTERNAL_MODULE_7__;

/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

'use strict';

exports.decode = exports.parse = __webpack_require__(9);
exports.encode = exports.stringify = __webpack_require__(10);


/***/ },
/* 9 */
/***/ function(module, exports) {

// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

'use strict';

// If obj.hasOwnProperty has been overridden, then calling
// obj.hasOwnProperty(prop) will break.
// See: https://github.com/joyent/node/issues/1707
function hasOwnProperty(obj, prop) {
  return Object.prototype.hasOwnProperty.call(obj, prop);
}

module.exports = function(qs, sep, eq, options) {
  sep = sep || '&';
  eq = eq || '=';
  var obj = {};

  if (typeof qs !== 'string' || qs.length === 0) {
    return obj;
  }

  var regexp = /\+/g;
  qs = qs.split(sep);

  var maxKeys = 1000;
  if (options && typeof options.maxKeys === 'number') {
    maxKeys = options.maxKeys;
  }

  var len = qs.length;
  // maxKeys <= 0 means that we should not limit keys count
  if (maxKeys > 0 && len > maxKeys) {
    len = maxKeys;
  }

  for (var i = 0; i < len; ++i) {
    var x = qs[i].replace(regexp, '%20'),
        idx = x.indexOf(eq),
        kstr, vstr, k, v;

    if (idx >= 0) {
      kstr = x.substr(0, idx);
      vstr = x.substr(idx + 1);
    } else {
      kstr = x;
      vstr = '';
    }

    k = decodeURIComponent(kstr);
    v = decodeURIComponent(vstr);

    if (!hasOwnProperty(obj, k)) {
      obj[k] = v;
    } else if (Array.isArray(obj[k])) {
      obj[k].push(v);
    } else {
      obj[k] = [obj[k], v];
    }
  }

  return obj;
};


/***/ },
/* 10 */
/***/ function(module, exports) {

// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

'use strict';

var stringifyPrimitive = function(v) {
  switch (typeof v) {
    case 'string':
      return v;

    case 'boolean':
      return v ? 'true' : 'false';

    case 'number':
      return isFinite(v) ? v : '';

    default:
      return '';
  }
};

module.exports = function(obj, sep, eq, name) {
  sep = sep || '&';
  eq = eq || '=';
  if (obj === null) {
    obj = undefined;
  }

  if (typeof obj === 'object') {
    return Object.keys(obj).map(function(k) {
      var ks = encodeURIComponent(stringifyPrimitive(k)) + eq;
      if (Array.isArray(obj[k])) {
        return obj[k].map(function(v) {
          return ks + encodeURIComponent(stringifyPrimitive(v));
        }).join(sep);
      } else {
        return ks + encodeURIComponent(stringifyPrimitive(obj[k]));
      }
    }).join(sep);

  }

  if (!name) return '';
  return encodeURIComponent(stringifyPrimitive(name)) + eq +
         encodeURIComponent(stringifyPrimitive(obj));
};


/***/ },
/* 11 */
/***/ function(module, exports) {

'use strict';

exports.__esModule = true;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Cache = function () {
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
}();

Cache.defaultPrefix = 'rc-';
exports.default = Cache;

/***/ },
/* 12 */
/***/ function(module, exports) {

// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

function EventEmitter() {
  this._events = this._events || {};
  this._maxListeners = this._maxListeners || undefined;
}
module.exports = EventEmitter;

// Backwards-compat with node 0.10.x
EventEmitter.EventEmitter = EventEmitter;

EventEmitter.prototype._events = undefined;
EventEmitter.prototype._maxListeners = undefined;

// By default EventEmitters will print a warning if more than 10 listeners are
// added to it. This is a useful default which helps finding memory leaks.
EventEmitter.defaultMaxListeners = 10;

// Obviously not all Emitters should be limited to 10. This function allows
// that to be increased. Set to zero for unlimited.
EventEmitter.prototype.setMaxListeners = function(n) {
  if (!isNumber(n) || n < 0 || isNaN(n))
    throw TypeError('n must be a positive number');
  this._maxListeners = n;
  return this;
};

EventEmitter.prototype.emit = function(type) {
  var er, handler, len, args, i, listeners;

  if (!this._events)
    this._events = {};

  // If there is no 'error' event listener then throw.
  if (type === 'error') {
    if (!this._events.error ||
        (isObject(this._events.error) && !this._events.error.length)) {
      er = arguments[1];
      if (er instanceof Error) {
        throw er; // Unhandled 'error' event
      } else {
        // At least give some kind of context to the user
        var err = new Error('Uncaught, unspecified "error" event. (' + er + ')');
        err.context = er;
        throw err;
      }
    }
  }

  handler = this._events[type];

  if (isUndefined(handler))
    return false;

  if (isFunction(handler)) {
    switch (arguments.length) {
      // fast cases
      case 1:
        handler.call(this);
        break;
      case 2:
        handler.call(this, arguments[1]);
        break;
      case 3:
        handler.call(this, arguments[1], arguments[2]);
        break;
      // slower
      default:
        args = Array.prototype.slice.call(arguments, 1);
        handler.apply(this, args);
    }
  } else if (isObject(handler)) {
    args = Array.prototype.slice.call(arguments, 1);
    listeners = handler.slice();
    len = listeners.length;
    for (i = 0; i < len; i++)
      listeners[i].apply(this, args);
  }

  return true;
};

EventEmitter.prototype.addListener = function(type, listener) {
  var m;

  if (!isFunction(listener))
    throw TypeError('listener must be a function');

  if (!this._events)
    this._events = {};

  // To avoid recursion in the case that type === "newListener"! Before
  // adding it to the listeners, first emit "newListener".
  if (this._events.newListener)
    this.emit('newListener', type,
              isFunction(listener.listener) ?
              listener.listener : listener);

  if (!this._events[type])
    // Optimize the case of one listener. Don't need the extra array object.
    this._events[type] = listener;
  else if (isObject(this._events[type]))
    // If we've already got an array, just append.
    this._events[type].push(listener);
  else
    // Adding the second element, need to change to array.
    this._events[type] = [this._events[type], listener];

  // Check for listener leak
  if (isObject(this._events[type]) && !this._events[type].warned) {
    if (!isUndefined(this._maxListeners)) {
      m = this._maxListeners;
    } else {
      m = EventEmitter.defaultMaxListeners;
    }

    if (m && m > 0 && this._events[type].length > m) {
      this._events[type].warned = true;
      console.error('(node) warning: possible EventEmitter memory ' +
                    'leak detected. %d listeners added. ' +
                    'Use emitter.setMaxListeners() to increase limit.',
                    this._events[type].length);
      if (typeof console.trace === 'function') {
        // not supported in IE 10
        console.trace();
      }
    }
  }

  return this;
};

EventEmitter.prototype.on = EventEmitter.prototype.addListener;

EventEmitter.prototype.once = function(type, listener) {
  if (!isFunction(listener))
    throw TypeError('listener must be a function');

  var fired = false;

  function g() {
    this.removeListener(type, g);

    if (!fired) {
      fired = true;
      listener.apply(this, arguments);
    }
  }

  g.listener = listener;
  this.on(type, g);

  return this;
};

// emits a 'removeListener' event iff the listener was removed
EventEmitter.prototype.removeListener = function(type, listener) {
  var list, position, length, i;

  if (!isFunction(listener))
    throw TypeError('listener must be a function');

  if (!this._events || !this._events[type])
    return this;

  list = this._events[type];
  length = list.length;
  position = -1;

  if (list === listener ||
      (isFunction(list.listener) && list.listener === listener)) {
    delete this._events[type];
    if (this._events.removeListener)
      this.emit('removeListener', type, listener);

  } else if (isObject(list)) {
    for (i = length; i-- > 0;) {
      if (list[i] === listener ||
          (list[i].listener && list[i].listener === listener)) {
        position = i;
        break;
      }
    }

    if (position < 0)
      return this;

    if (list.length === 1) {
      list.length = 0;
      delete this._events[type];
    } else {
      list.splice(position, 1);
    }

    if (this._events.removeListener)
      this.emit('removeListener', type, listener);
  }

  return this;
};

EventEmitter.prototype.removeAllListeners = function(type) {
  var key, listeners;

  if (!this._events)
    return this;

  // not listening for removeListener, no need to emit
  if (!this._events.removeListener) {
    if (arguments.length === 0)
      this._events = {};
    else if (this._events[type])
      delete this._events[type];
    return this;
  }

  // emit removeListener for all listeners on all events
  if (arguments.length === 0) {
    for (key in this._events) {
      if (key === 'removeListener') continue;
      this.removeAllListeners(key);
    }
    this.removeAllListeners('removeListener');
    this._events = {};
    return this;
  }

  listeners = this._events[type];

  if (isFunction(listeners)) {
    this.removeListener(type, listeners);
  } else if (listeners) {
    // LIFO order
    while (listeners.length)
      this.removeListener(type, listeners[listeners.length - 1]);
  }
  delete this._events[type];

  return this;
};

EventEmitter.prototype.listeners = function(type) {
  var ret;
  if (!this._events || !this._events[type])
    ret = [];
  else if (isFunction(this._events[type]))
    ret = [this._events[type]];
  else
    ret = this._events[type].slice();
  return ret;
};

EventEmitter.prototype.listenerCount = function(type) {
  if (this._events) {
    var evlistener = this._events[type];

    if (isFunction(evlistener))
      return 1;
    else if (evlistener)
      return evlistener.length;
  }
  return 0;
};

EventEmitter.listenerCount = function(emitter, type) {
  return emitter.listenerCount(type);
};

function isFunction(arg) {
  return typeof arg === 'function';
}

function isNumber(arg) {
  return typeof arg === 'number';
}

function isObject(arg) {
  return typeof arg === 'object' && arg !== null;
}

function isUndefined(arg) {
  return arg === void 0;
}


/***/ },
/* 13 */
/***/ function(module, exports, __webpack_require__) {

"use strict";

exports.__esModule = true;
exports.findHeaderName = findHeaderName;

var _Externals = __webpack_require__(4);

var _Utils = __webpack_require__(3);

var _events = __webpack_require__(12);

var _events2 = _interopRequireDefault(_events);

var _ApiResponse = __webpack_require__(14);

var _ApiResponse2 = _interopRequireDefault(_ApiResponse);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { return step("next", value); }, function (err) { return step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Client = function (_EventEmitter) {
    _inherits(Client, _EventEmitter);

    function Client() {
        var _temp, _this, _ret;

        _classCallCheck(this, Client);

        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
        }

        return _ret = (_temp = (_this = _possibleConstructorReturn(this, _EventEmitter.call.apply(_EventEmitter, [this].concat(args))), _this), _this.events = {
            beforeRequest: 'beforeRequest',
            requestSuccess: 'requestSuccess',
            requestError: 'requestError'
        }, _temp), _possibleConstructorReturn(_this, _ret);
    }

    /**
     * @param {Request} request
     * @return {Promise<ApiResponse>}
     */

    Client.prototype.sendRequest = function () {
        var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee(request) {
            var apiResponse;
            return regeneratorRuntime.wrap(function _callee$(_context) {
                while (1) {
                    switch (_context.prev = _context.next) {
                        case 0:
                            apiResponse = new _ApiResponse2.default(request);
                            _context.prev = 1;


                            //TODO Stop request if listeners return false
                            this.emit(this.events.beforeRequest, apiResponse);

                            _context.next = 5;
                            return this._loadResponse(request);

                        case 5:
                            apiResponse._response = _context.sent;
                            _context.next = 8;
                            return apiResponse._init();

                        case 8:
                            if (apiResponse.ok()) {
                                _context.next = 10;
                                break;
                            }

                            throw new Error('Response has unsuccessful status');

                        case 10:

                            this.emit(this.events.requestSuccess, apiResponse);

                            return _context.abrupt("return", apiResponse);

                        case 14:
                            _context.prev = 14;
                            _context.t0 = _context["catch"](1);


                            if (!_context.t0.apiResponse) _context.t0 = this.makeError(_context.t0, apiResponse);

                            this.emit(this.events.requestError, _context.t0);

                            throw _context.t0;

                        case 19:
                        case "end":
                            return _context.stop();
                    }
                }
            }, _callee, this, [[1, 14]]);
        }));

        function sendRequest(_x) {
            return _ref.apply(this, arguments);
        }

        return sendRequest;
    }();

    /**
     * @param {Request} request
     * @return {Promise<Response>}
     * @private
     */


    Client.prototype._loadResponse = function () {
        var _ref2 = _asyncToGenerator(regeneratorRuntime.mark(function _callee2(request) {
            return regeneratorRuntime.wrap(function _callee2$(_context2) {
                while (1) {
                    switch (_context2.prev = _context2.next) {
                        case 0:
                            _context2.next = 2;
                            return _Externals.fetch.call(null, request);

                        case 2:
                            return _context2.abrupt("return", _context2.sent);

                        case 3:
                        case "end":
                            return _context2.stop();
                    }
                }
            }, _callee2, this);
        }));

        function _loadResponse(_x2) {
            return _ref2.apply(this, arguments);
        }

        return _loadResponse;
    }();

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
        init.method = init.method.toUpperCase();
        if (init.method && Client._allowedMethods.indexOf(init.method) < 0) {
            throw new Error('Method has wrong value: ' + init.method);
        }

        // Defaults
        init.credentials = init.credentials || 'include';
        init.mode = init.mode || 'cors';

        // Append Query String
        if (init.query) {
            init.url = init.url + (init.url.indexOf('?') > -1 ? '&' : '?') + (0, _Utils.queryStringify)(init.query);
        }

        if (!findHeaderName('Accept', init.headers)) {
            init.headers['Accept'] = _ApiResponse2.default._jsonContentType;
        }

        // Serialize body
        if ((0, _Utils.isPlainObject)(init.body) || !init.body) {

            var contentTypeHeaderName = findHeaderName(_ApiResponse2.default._contentType, init.headers);

            if (!contentTypeHeaderName) {
                contentTypeHeaderName = _ApiResponse2.default._contentType;
                init.headers[contentTypeHeaderName] = _ApiResponse2.default._jsonContentType;
            }

            var contentType = init.headers[contentTypeHeaderName];

            // Assign a new encoded body
            if (contentType.indexOf(_ApiResponse2.default._jsonContentType) > -1) {
                if ((init.method === 'GET' || init.method === 'HEAD') && !!init.body) {
                    // oddly setting body to null still result in TypeError in phantomjs
                    init.body = undefined;
                } else {
                    init.body = JSON.stringify(init.body);
                }
            } else if (contentType.indexOf(_ApiResponse2.default._urlencodedContentType) > -1) {
                init.body = (0, _Utils.queryStringify)(init.body);
            }
        }

        // Create a request with encoded body
        var req = new _Externals.Request(init.url, init);

        // Keep the original body accessible directly (for mocks)
        req.originalBody = init.body;

        return req;
    };

    return Client;
}(_events2.default);

Client._allowedMethods = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS', 'HEAD'];
exports.default = Client;
function findHeaderName(name, headers) {
    name = name.toLowerCase();
    return Object.keys(headers).reduce(function (res, key) {
        if (res) return res;
        if (name == key.toLowerCase()) return key;
        return res;
    }, null);
}

/**
 * @name IApiError
 * @property {string} stack
 * @property {string} originalMessage
 * @property {ApiResponse} apiResponse
 */

/***/ },
/* 14 */
/***/ function(module, exports, __webpack_require__) {

'use strict';

exports.__esModule = true;

var _Externals = __webpack_require__(4);

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new _Externals.Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return _Externals.Promise.resolve(value).then(function (value) { return step("next", value); }, function (err) { return step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ApiResponse = function () {

    /**
     * @param {Request} request
     * @param {Response} response
     * @param {string} responseText
     */

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

    ApiResponse.prototype._init = function () {
        var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee() {
            return regeneratorRuntime.wrap(function _callee$(_context) {
                while (1) {
                    switch (_context.prev = _context.next) {
                        case 0:
                            if (!(this._isMultipart() || this._isJson())) {
                                _context.next = 4;
                                break;
                            }

                            _context.next = 3;
                            return this.response().text();

                        case 3:
                            this._text = _context.sent;

                        case 4:
                            return _context.abrupt('return', this);

                        case 5:
                        case 'end':
                            return _context.stop();
                    }
                }
            }, _callee, this);
        }));

        function _init() {
            return _ref.apply(this, arguments);
        }

        return _init;
    }();

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

        var headers = new _Externals.Headers(),
            headersAndBody = text.split(ApiResponse._bodySeparator),
            headersText = headersAndBody.length > 1 ? headersAndBody.shift() : '';

        text = headersAndBody.length > 0 ? headersAndBody.join(ApiResponse._bodySeparator) : null;

        (headersText || '').split('\n').forEach(function (header) {

            var split = header.trim().split(ApiResponse._headerSeparator),
                key = split.shift().trim(),
                value = split.join(ApiResponse._headerSeparator).trim();

            if (key) headers.append(key, value);
        });

        return new ApiResponse(null, new _Externals.Response(text ? text : undefined, {
            headers: headers,
            status: status,
            statusText: statusText
        }), text);
    };

    return ApiResponse;
}();

ApiResponse._contentType = 'Content-Type';
ApiResponse._jsonContentType = 'application/json';
ApiResponse._multipartContentType = 'multipart/mixed';
ApiResponse._urlencodedContentType = 'application/x-www-form-urlencoded';
ApiResponse._headerSeparator = ':';
ApiResponse._bodySeparator = '\n\n';
ApiResponse._boundarySeparator = '--';
exports.default = ApiResponse;

/***/ },
/* 15 */
/***/ function(module, exports, __webpack_require__) {

'use strict';

exports.__esModule = true;

var _Registry = __webpack_require__(16);

var _Registry2 = _interopRequireDefault(_Registry);

var _Client = __webpack_require__(13);

var _Client2 = _interopRequireDefault(_Client);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { return step("next", value); }, function (err) { return step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Client = function (_HttpClient) {
    _inherits(Client, _HttpClient);

    function Client() {
        _classCallCheck(this, Client);

        var _this = _possibleConstructorReturn(this, _HttpClient.call(this));

        _this._registry = new _Registry2.default();
        return _this;
    }

    Client.prototype.registry = function registry() {
        return this._registry;
    };

    Client.prototype._loadResponse = function () {
        var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee(request) {
            var mock;
            return regeneratorRuntime.wrap(function _callee$(_context) {
                while (1) {
                    switch (_context.prev = _context.next) {
                        case 0:
                            mock = this._registry.find(request);
                            _context.next = 3;
                            return mock.getResponse(request);

                        case 3:
                            return _context.abrupt('return', _context.sent);

                        case 4:
                        case 'end':
                            return _context.stop();
                    }
                }
            }, _callee, this);
        }));

        function _loadResponse(_x) {
            return _ref.apply(this, arguments);
        }

        return _loadResponse;
    }();

    return Client;
}(_Client2.default);

exports.default = Client;

/***/ },
/* 16 */
/***/ function(module, exports, __webpack_require__) {

'use strict';

exports.__esModule = true;

var _Mock = __webpack_require__(17);

var _Mock2 = _interopRequireDefault(_Mock);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Registry = function () {
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

    Registry.prototype.apiCall = function apiCall(method, path, response, status, statusText, delay) {

        this.add(new _Mock2.default(method, path, response, status, statusText, delay));

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
}();

exports.default = Registry;

/***/ },
/* 17 */
/***/ function(module, exports, __webpack_require__) {

'use strict';

exports.__esModule = true;

var _Externals = __webpack_require__(4);

var _ApiResponse = __webpack_require__(14);

var _ApiResponse2 = _interopRequireDefault(_ApiResponse);

var _Utils = __webpack_require__(3);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new _Externals.Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return _Externals.Promise.resolve(value).then(function (value) { return step("next", value); }, function (err) { return step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Mock = function () {
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

    Mock.prototype.getResponse = function () {
        var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee(request) {
            return regeneratorRuntime.wrap(function _callee$(_context) {
                while (1) {
                    switch (_context.prev = _context.next) {
                        case 0:
                            _context.next = 2;
                            return (0, _Utils.delay)(this._delay);

                        case 2:
                            return _context.abrupt('return', this.createResponse(this._json));

                        case 3:
                        case 'end':
                            return _context.stop();
                    }
                }
            }, _callee, this);
        }));

        function getResponse(_x) {
            return _ref.apply(this, arguments);
        }

        return getResponse;
    }();

    Mock.prototype.createResponse = function createResponse(json, init) {

        init = init || {};

        init.status = init.status || this._status;
        init.statusText = init.statusText || this._statusText;

        var str = JSON.stringify(json),
            res = new _Externals.Response(str, init);

        res.headers.set(_ApiResponse2.default._contentType, _ApiResponse2.default._jsonContentType);

        return res;
    };

    return Mock;
}();

exports.default = Mock;

/***/ },
/* 18 */
/***/ function(module, exports, __webpack_require__) {

"use strict";

exports.__esModule = true;

var _Externals = __webpack_require__(4);

var _events = __webpack_require__(12);

var _events2 = _interopRequireDefault(_events);

var _Auth = __webpack_require__(19);

var _Auth2 = _interopRequireDefault(_Auth);

var _Utils = __webpack_require__(3);

var _Constants = __webpack_require__(20);

var _Constants2 = _interopRequireDefault(_Constants);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new _Externals.Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return _Externals.Promise.resolve(value).then(function (value) { return step("next", value); }, function (err) { return step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Platform = function (_EventEmitter) {
    _inherits(Platform, _EventEmitter);

    function Platform(_ref) {
        var client = _ref.client;
        var cache = _ref.cache;
        var server = _ref.server;
        var appKey = _ref.appKey;
        var appSecret = _ref.appSecret;
        var appName = _ref.appName;
        var appVersion = _ref.appVersion;
        var sdkVersion = _ref.sdkVersion;
        var redirectUri = _ref.redirectUri;

        _classCallCheck(this, Platform);

        var _this = _possibleConstructorReturn(this, _EventEmitter.call(this));

        _this.events = {
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


        _this._server = server;
        _this._appKey = appKey;
        _this._appSecret = appSecret;

        /** @type {Cache} */
        _this._cache = cache;

        /** @type {Client} */
        _this._client = client;

        /** @type {Promise<ApiResponse>} */
        _this._refreshPromise = null;

        _this._auth = new _Auth2.default(_this._cache, Platform._cacheId);

        _this._userAgent = (appName ? appName + (appVersion ? '/' + appVersion : '') + ' ' : '') + 'RCJSSDK/' + sdkVersion;

        _this._redirectUri = redirectUri || '';

        return _this;
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
     * @param {boolean} options.implicit
     * @param {object} [options]
     * @return {string}
     */


    Platform.prototype.loginUrl = function loginUrl(options) {

        options = options || {};

        return this.createUrl(Platform._authorizeEndpoint + '?' + (0, _Utils.queryStringify)({
            'response_type': options.implicit ? 'token' : 'code',
            'redirect_uri': options.redirectUri || this._redirectUri,
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


    Platform.prototype.parseLoginRedirect = function parseLoginRedirect(url) {

        function getParts(url, separator) {
            return url.split(separator).reverse()[0];
        }

        var response = url.indexOf('#') === 0 && getParts(url, '#') || url.indexOf('?') === 0 && getParts(url, '?') || null;

        if (!response) throw new Error('Unable to parse response');

        var qs = (0, _Utils.parseQueryString)(response);

        if (!qs) throw new Error('Unable to parse response');

        var error = qs.error_description || qs.error;

        if (error) {
            var e = new Error(error);
            e.error = qs.error;
            throw e;
        }

        return qs;
    };

    /**
     * Convenience method to handle 3-legged OAuth
     *
     * Attention! This is an experimental method and it's signature and behavior may change without notice.
     *
     * @experimental
     * @param {number} [options.width]
     * @param {number} [options.height]
     * @param {object} [options.login] additional options for login()
     * @param {string} [options.origin]
     * @param {string} [options.property] name of window.postMessage's event data property
     * @param {string} [options.target] target for window.open()
     * @param {string} options.url
     * @return {Promise}
     */


    Platform.prototype.loginWindow = function loginWindow(options) {
        var _this2 = this;

        return new _Externals.Promise(function (resolve, reject) {

            if (!(0, _Utils.isBrowser)()) throw new Error('This method can be used only in browser');

            if (!options.url) throw new Error('Missing mandatory URL parameter');

            options = options || {};
            options.url = options.url || 400;
            options.width = options.width || 400;
            options.height = options.height || 600;
            options.origin = options.origin || window.location.origin;
            options.property = options.property || _Constants2.default.authResponseProperty;
            options.target = options.target || '_blank';

            var dualScreenLeft = window.screenLeft != undefined ? window.screenLeft : screen.left;
            var dualScreenTop = window.screenTop != undefined ? window.screenTop : screen.top;

            var width = window.innerWidth ? window.innerWidth : document.documentElement.clientWidth ? document.documentElement.clientWidth : screen.width;
            var height = window.innerHeight ? window.innerHeight : document.documentElement.clientHeight ? document.documentElement.clientHeight : screen.height;

            var left = width / 2 - options.width / 2 + dualScreenLeft;
            var top = height / 2 - options.height / 2 + dualScreenTop;
            var win = window.open(options.url, '_blank', options.target == '_blank' ? 'scrollbars=yes, status=yes, width=' + options.width + ', height=' + options.height + ', left=' + left + ', top=' + top : '');

            if (window.focus) win.focus();

            var eventMethod = window.addEventListener ? 'addEventListener' : 'attachEvent';
            var eventRemoveMethod = eventMethod == 'addEventListener' ? 'removeEventListener' : 'detachEvent';
            var messageEvent = eventMethod == 'addEventListener' ? 'message' : 'onmessage';

            var eventListener = function eventListener(e) {

                if (e.origin != options.origin) return;
                if (!e.data || !e.data[options.property]) return; // keep waiting

                win.close();
                window[eventRemoveMethod](messageEvent, eventListener);

                try {

                    var loginOptions = _this2.parseLoginRedirect(e.data[options.property]);

                    if (!loginOptions.code && !loginOptions.access_token) throw new Error('No authorization code or token');

                    resolve(loginOptions);
                } catch (e) {
                    reject(e);
                }
            };

            window[eventMethod](messageEvent, eventListener, false);
        });
    };

    /**
     * @return {Promise<boolean>}
     */


    Platform.prototype.loggedIn = function () {
        var _ref2 = _asyncToGenerator(regeneratorRuntime.mark(function _callee() {
            return regeneratorRuntime.wrap(function _callee$(_context) {
                while (1) {
                    switch (_context.prev = _context.next) {
                        case 0:
                            _context.prev = 0;
                            _context.next = 3;
                            return this.ensureLoggedIn();

                        case 3:
                            return _context.abrupt("return", true);

                        case 6:
                            _context.prev = 6;
                            _context.t0 = _context["catch"](0);
                            return _context.abrupt("return", false);

                        case 9:
                        case "end":
                            return _context.stop();
                    }
                }
            }, _callee, this, [[0, 6]]);
        }));

        function loggedIn() {
            return _ref2.apply(this, arguments);
        }

        return loggedIn;
    }();

    /**
     * @param {string} options.username
     * @param {string} options.password
     * @param {string} options.extension
     * @param {string} options.code
     * @param {string} options.redirectUri
     * @param {string} options.endpointId
     * @param {string} options.remember
     * @param {string} options.accessTokenTtl
     * @param {string} options.refreshTokenTtl
     * @param {string} options.access_token
     * @returns {Promise<ApiResponse>}
     */


    Platform.prototype.login = function () {
        var _ref3 = _asyncToGenerator(regeneratorRuntime.mark(function _callee2(options) {
            var body, apiResponse, json;
            return regeneratorRuntime.wrap(function _callee2$(_context2) {
                while (1) {
                    switch (_context2.prev = _context2.next) {
                        case 0:
                            _context2.prev = 0;


                            options = options || {};

                            this.emit(this.events.beforeLogin);

                            body = {};


                            if (!options.code) {

                                body.grant_type = 'password';
                                body.username = options.username;
                                body.password = options.password;
                                body.extension = options.extension || '';
                            } else if (options.code) {

                                body.grant_type = 'authorization_code';
                                body.code = options.code;
                                body.redirect_uri = options.redirectUri || this._redirectUri;
                                //body.client_id = this.getCredentials().key; // not needed
                            }

                            if (!options.access_token) {
                                _context2.next = 9;
                                break;
                            }

                            //TODO Potentially make a request to /oauth/tokeninfo
                            json = options;

                            _context2.next = 16;
                            break;

                        case 9:

                            if (options.endpointId) body.endpoint_id = options.endpointId;
                            if (options.accessTokenTtl) body.accessTokenTtl = options.accessTokenTtl;
                            if (options.refreshTokenTtl) body.refreshTokenTtl = options.refreshTokenTtl;

                            _context2.next = 14;
                            return this._tokenRequest(Platform._tokenEndpoint, body);

                        case 14:
                            apiResponse = _context2.sent;

                            json = apiResponse.json();

                        case 16:

                            this._auth.setData(json);

                            this.emit(this.events.loginSuccess, apiResponse);

                            return _context2.abrupt("return", apiResponse);

                        case 21:
                            _context2.prev = 21;
                            _context2.t0 = _context2["catch"](0);


                            this._cache.clean();

                            this.emit(this.events.loginError, _context2.t0);

                            throw _context2.t0;

                        case 26:
                        case "end":
                            return _context2.stop();
                    }
                }
            }, _callee2, this, [[0, 21]]);
        }));

        function login(_x) {
            return _ref3.apply(this, arguments);
        }

        return login;
    }();

    /**
     * @returns {Promise<ApiResponse>}
     * @private
     */


    Platform.prototype._refresh = function () {
        var _ref4 = _asyncToGenerator(regeneratorRuntime.mark(function _callee3() {
            var res, json;
            return regeneratorRuntime.wrap(function _callee3$(_context3) {
                while (1) {
                    switch (_context3.prev = _context3.next) {
                        case 0:
                            _context3.prev = 0;


                            this.emit(this.events.beforeRefresh);

                            _context3.next = 4;
                            return (0, _Utils.delay)(Platform._refreshDelayMs);

                        case 4:
                            if (this._auth.refreshToken()) {
                                _context3.next = 6;
                                break;
                            }

                            throw new Error('Refresh token is missing');

                        case 6:
                            if (this._auth.refreshTokenValid()) {
                                _context3.next = 8;
                                break;
                            }

                            throw new Error('Refresh token has expired');

                        case 8:
                            _context3.next = 10;
                            return this._tokenRequest(Platform._tokenEndpoint, {
                                "grant_type": "refresh_token",
                                "refresh_token": this._auth.refreshToken(),
                                "access_token_ttl": this._auth.data().expires_in + 1,
                                "refresh_token_ttl": this._auth.data().refresh_token_expires_in + 1
                            });

                        case 10:
                            res = _context3.sent;
                            json = res.json();

                            if (json.access_token) {
                                _context3.next = 14;
                                break;
                            }

                            throw this._client.makeError(new Error('Malformed OAuth response'), res);

                        case 14:

                            this._auth.setData(json);

                            this.emit(this.events.refreshSuccess, res);

                            return _context3.abrupt("return", res);

                        case 19:
                            _context3.prev = 19;
                            _context3.t0 = _context3["catch"](0);


                            _context3.t0 = this._client.makeError(_context3.t0);

                            if (Platform._clearCacheOnRefreshError) {
                                this._cache.clean();
                            }

                            this.emit(this.events.refreshError, _context3.t0);

                            throw _context3.t0;

                        case 25:
                        case "end":
                            return _context3.stop();
                    }
                }
            }, _callee3, this, [[0, 19]]);
        }));

        function _refresh() {
            return _ref4.apply(this, arguments);
        }

        return _refresh;
    }();

    /**
     * @returns {Promise<ApiResponse>}
     */


    Platform.prototype.refresh = function () {
        var _ref5 = _asyncToGenerator(regeneratorRuntime.mark(function _callee4() {
            var _this3 = this;

            return regeneratorRuntime.wrap(function _callee4$(_context4) {
                while (1) {
                    switch (_context4.prev = _context4.next) {
                        case 0:
                            if (!this._refreshPromise) {
                                _context4.next = 2;
                                break;
                            }

                            return _context4.abrupt("return", this._refreshPromise);

                        case 2:
                            _context4.prev = 2;


                            this._refreshPromise = this._refresh().then(function (res) {
                                _this3._refreshPromise = null;
                                return res;
                            });

                            return _context4.abrupt("return", this._refreshPromise);

                        case 7:
                            _context4.prev = 7;
                            _context4.t0 = _context4["catch"](2);


                            this._refreshPromise = null;
                            throw _context4.t0;

                        case 11:
                        case "end":
                            return _context4.stop();
                    }
                }
            }, _callee4, this, [[2, 7]]);
        }));

        function refresh() {
            return _ref5.apply(this, arguments);
        }

        return refresh;
    }();

    /**
     * @returns {Promise<ApiResponse>}
     */


    Platform.prototype.logout = function () {
        var _ref6 = _asyncToGenerator(regeneratorRuntime.mark(function _callee5() {
            var res;
            return regeneratorRuntime.wrap(function _callee5$(_context5) {
                while (1) {
                    switch (_context5.prev = _context5.next) {
                        case 0:
                            _context5.prev = 0;


                            this.emit(this.events.beforeLogout);

                            _context5.next = 4;
                            return this._tokenRequest(Platform._revokeEndpoint, {
                                token: this._auth.accessToken()
                            });

                        case 4:
                            res = _context5.sent;


                            this._cache.clean();

                            this.emit(this.events.logoutSuccess, res);

                            return _context5.abrupt("return", res);

                        case 10:
                            _context5.prev = 10;
                            _context5.t0 = _context5["catch"](0);


                            this.emit(this.events.logoutError, _context5.t0);

                            throw _context5.t0;

                        case 14:
                        case "end":
                            return _context5.stop();
                    }
                }
            }, _callee5, this, [[0, 10]]);
        }));

        function logout() {
            return _ref6.apply(this, arguments);
        }

        return logout;
    }();

    /**
     * @param {Request} request
     * @param {object} [options]
     * @param {boolean} [options.skipAuthCheck]
     * @return {Promise<Request>}
     */


    Platform.prototype.inflateRequest = function () {
        var _ref7 = _asyncToGenerator(regeneratorRuntime.mark(function _callee6(request, options) {
            return regeneratorRuntime.wrap(function _callee6$(_context6) {
                while (1) {
                    switch (_context6.prev = _context6.next) {
                        case 0:

                            options = options || {};

                            if (!options.skipAuthCheck) {
                                _context6.next = 3;
                                break;
                            }

                            return _context6.abrupt("return", request);

                        case 3:
                            _context6.next = 5;
                            return this.ensureLoggedIn();

                        case 5:

                            request.headers.set('X-User-Agent', this._userAgent);
                            request.headers.set('Client-Id', this._appKey);
                            request.headers.set('Authorization', this._authHeader());
                            //request.url = this.createUrl(request.url, {addServer: true}); //FIXME Spec prevents this...

                            return _context6.abrupt("return", request);

                        case 9:
                        case "end":
                            return _context6.stop();
                    }
                }
            }, _callee6, this);
        }));

        function inflateRequest(_x2, _x3) {
            return _ref7.apply(this, arguments);
        }

        return inflateRequest;
    }();

    /**
     * @param {Request} request
     * @param {object} [options]
     * @param {boolean} [options.skipAuthCheck]
     * @return {Promise<ApiResponse>}
     */


    Platform.prototype.sendRequest = function () {
        var _ref8 = _asyncToGenerator(regeneratorRuntime.mark(function _callee7(request, options) {
            return regeneratorRuntime.wrap(function _callee7$(_context7) {
                while (1) {
                    switch (_context7.prev = _context7.next) {
                        case 0:
                            _context7.prev = 0;
                            _context7.next = 3;
                            return this.inflateRequest(request, options);

                        case 3:
                            request = _context7.sent;
                            _context7.next = 6;
                            return this._client.sendRequest(request);

                        case 6:
                            return _context7.abrupt("return", _context7.sent);

                        case 9:
                            _context7.prev = 9;
                            _context7.t0 = _context7["catch"](0);

                            if (!(!_context7.t0.apiResponse || !_context7.t0.apiResponse.response() || _context7.t0.apiResponse.response().status != 401 || options.retry)) {
                                _context7.next = 13;
                                break;
                            }

                            throw _context7.t0;

                        case 13:

                            this._auth.cancelAccessToken();

                            options.retry = true;

                            _context7.next = 17;
                            return this.sendRequest(request, options);

                        case 17:
                            return _context7.abrupt("return", _context7.sent);

                        case 18:
                        case "end":
                            return _context7.stop();
                    }
                }
            }, _callee7, this, [[0, 9]]);
        }));

        function sendRequest(_x4, _x5) {
            return _ref8.apply(this, arguments);
        }

        return sendRequest;
    }();

    /**
     * General purpose function to send anything to server
     * @param {string} options.url
     * @param {object} [options.body]
     * @param {string} [options.method]
     * @param {object} [options.query]
     * @param {object} [options.headers]
     * @param {boolean} [options.skipAuthCheck]
     * @return {Promise<ApiResponse>}
     */


    Platform.prototype.send = function () {
        var _ref9 = _asyncToGenerator(regeneratorRuntime.mark(function _callee8() {
            var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
            return regeneratorRuntime.wrap(function _callee8$(_context8) {
                while (1) {
                    switch (_context8.prev = _context8.next) {
                        case 0:

                            //FIXME https://github.com/bitinn/node-fetch/issues/43
                            options.url = this.createUrl(options.url, { addServer: true });

                            _context8.next = 3;
                            return this.sendRequest(this._client.createRequest(options), options);

                        case 3:
                            return _context8.abrupt("return", _context8.sent);

                        case 4:
                        case "end":
                            return _context8.stop();
                    }
                }
            }, _callee8, this);
        }));

        function send(_x6) {
            return _ref9.apply(this, arguments);
        }

        return send;
    }();

    /**
     * @param {string} url
     * @param {object} [query]
     * @param {object} [options]
     * @param {object} [options.headers]
     * @param {boolean} [options.skipAuthCheck]
     * @return {Promise<ApiResponse>}
     */


    Platform.prototype.get = function () {
        var _ref10 = _asyncToGenerator(regeneratorRuntime.mark(function _callee9(url, query, options) {
            return regeneratorRuntime.wrap(function _callee9$(_context9) {
                while (1) {
                    switch (_context9.prev = _context9.next) {
                        case 0:
                            options = options || {};
                            options.method = 'GET';
                            options.url = url;
                            options.query = query;
                            _context9.next = 6;
                            return this.send(options);

                        case 6:
                            return _context9.abrupt("return", _context9.sent);

                        case 7:
                        case "end":
                            return _context9.stop();
                    }
                }
            }, _callee9, this);
        }));

        function get(_x8, _x9, _x10) {
            return _ref10.apply(this, arguments);
        }

        return get;
    }();

    /**
     * @param {string} url
     * @param {object} body
     * @param {object} [query]
     * @param {object} [options]
     * @param {object} [options.headers]
     * @param {boolean} [options.skipAuthCheck]
     * @return {Promise<ApiResponse>}
     */


    Platform.prototype.post = function () {
        var _ref11 = _asyncToGenerator(regeneratorRuntime.mark(function _callee10(url, body, query, options) {
            return regeneratorRuntime.wrap(function _callee10$(_context10) {
                while (1) {
                    switch (_context10.prev = _context10.next) {
                        case 0:
                            options = options || {};
                            options.method = 'POST';
                            options.url = url;
                            options.query = query;
                            options.body = body;
                            _context10.next = 7;
                            return this.send(options);

                        case 7:
                            return _context10.abrupt("return", _context10.sent);

                        case 8:
                        case "end":
                            return _context10.stop();
                    }
                }
            }, _callee10, this);
        }));

        function post(_x11, _x12, _x13, _x14) {
            return _ref11.apply(this, arguments);
        }

        return post;
    }();

    /**
     * @param {string} url
     * @param {object} [body]
     * @param {object} [query]
     * @param {object} [options]
     * @param {object} [options.headers]
     * @param {boolean} [options.skipAuthCheck]
     * @return {Promise<ApiResponse>}
     */


    Platform.prototype.put = function () {
        var _ref12 = _asyncToGenerator(regeneratorRuntime.mark(function _callee11(url, body, query, options) {
            return regeneratorRuntime.wrap(function _callee11$(_context11) {
                while (1) {
                    switch (_context11.prev = _context11.next) {
                        case 0:
                            options = options || {};
                            options.method = 'PUT';
                            options.url = url;
                            options.query = query;
                            options.body = body;
                            _context11.next = 7;
                            return this.send(options);

                        case 7:
                            return _context11.abrupt("return", _context11.sent);

                        case 8:
                        case "end":
                            return _context11.stop();
                    }
                }
            }, _callee11, this);
        }));

        function put(_x15, _x16, _x17, _x18) {
            return _ref12.apply(this, arguments);
        }

        return put;
    }();

    /**
     * @param {string} url
     * @param {string} [query]
     * @param {object} [options]
     * @param {object} [options.headers]
     * @param {boolean} [options.skipAuthCheck]
     * @return {Promise<ApiResponse>}
     */


    Platform.prototype['delete'] = function () {
        var _ref13 = _asyncToGenerator(regeneratorRuntime.mark(function _callee12(url, query, options) {
            return regeneratorRuntime.wrap(function _callee12$(_context12) {
                while (1) {
                    switch (_context12.prev = _context12.next) {
                        case 0:
                            options = options || {};
                            options.method = 'DELETE';
                            options.url = url;
                            options.query = query;
                            _context12.next = 6;
                            return this.send(options);

                        case 6:
                            return _context12.abrupt("return", _context12.sent);

                        case 7:
                        case "end":
                            return _context12.stop();
                    }
                }
            }, _callee12, this);
        }));

        function _delete(_x19, _x20, _x21) {
            return _ref13.apply(this, arguments);
        }

        return _delete;
    }();

    Platform.prototype._tokenRequest = function () {
        var _ref14 = _asyncToGenerator(regeneratorRuntime.mark(function _callee13(path, body) {
            return regeneratorRuntime.wrap(function _callee13$(_context13) {
                while (1) {
                    switch (_context13.prev = _context13.next) {
                        case 0:
                            _context13.next = 2;
                            return this.send({
                                url: path,
                                skipAuthCheck: true,
                                body: body,
                                method: 'POST',
                                headers: {
                                    'Authorization': 'Basic ' + this._apiKey(),
                                    'Content-Type': 'application/x-www-form-urlencoded'
                                }
                            });

                        case 2:
                            return _context13.abrupt("return", _context13.sent);

                        case 3:
                        case "end":
                            return _context13.stop();
                    }
                }
            }, _callee13, this);
        }));

        function _tokenRequest(_x22, _x23) {
            return _ref14.apply(this, arguments);
        }

        return _tokenRequest;
    }();

    Platform.prototype.ensureLoggedIn = function () {
        var _ref15 = _asyncToGenerator(regeneratorRuntime.mark(function _callee14() {
            return regeneratorRuntime.wrap(function _callee14$(_context14) {
                while (1) {
                    switch (_context14.prev = _context14.next) {
                        case 0:
                            if (!this._isAccessTokenValid()) {
                                _context14.next = 2;
                                break;
                            }

                            return _context14.abrupt("return", null);

                        case 2:
                            _context14.next = 4;
                            return this.refresh();

                        case 4:
                            return _context14.abrupt("return", _context14.sent);

                        case 5:
                        case "end":
                            return _context14.stop();
                    }
                }
            }, _callee14, this);
        }));

        function ensureLoggedIn() {
            return _ref15.apply(this, arguments);
        }

        return ensureLoggedIn;
    }();

    Platform.prototype._isAccessTokenValid = function _isAccessTokenValid() {
        return this._auth.accessTokenValid();
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
}(_events2.default);

Platform._urlPrefix = '/restapi';
Platform._apiVersion = 'v1.0';
Platform._tokenEndpoint = '/restapi/oauth/token';
Platform._revokeEndpoint = '/restapi/oauth/revoke';
Platform._authorizeEndpoint = '/restapi/oauth/authorize';
Platform._refreshDelayMs = 100;
Platform._cacheId = 'platform';
Platform._clearCacheOnRefreshError = false;
exports.default = Platform;

/***/ },
/* 19 */
/***/ function(module, exports) {

'use strict';

exports.__esModule = true;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Auth = function () {
    function Auth(cache, cacheId) {
        _classCallCheck(this, Auth);

        /** @type {Cache} */
        this._cache = cache;
        this._cacheId = cacheId;
    } // 1 minute


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

    return Auth;
}();

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


Auth.refreshHandicapMs = 60 * 1000;
Auth.forcedTokenType = 'forced';
exports.default = Auth;

/***/ },
/* 20 */
/***/ function(module, exports, __webpack_require__) {

'use strict';

exports.__esModule = true;
exports.default = {
    authResponseProperty: 'RCAuthorizationResponse',
    version:  true ? ("3.0.0-rc2") : 'x.x.x'
};

/***/ },
/* 21 */
/***/ function(module, exports, __webpack_require__) {

'use strict';

exports.__esModule = true;

var _PubnubMock = __webpack_require__(22);

var _PubnubMock2 = _interopRequireDefault(_PubnubMock);

var _Externals = __webpack_require__(4);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var PubnubMockFactory = function () {
    function PubnubMockFactory() {
        _classCallCheck(this, PubnubMockFactory);

        this.crypto_obj = _Externals.PUBNUB.crypto_obj;
    }

    PubnubMockFactory.prototype.init = function init(options) {
        return new _PubnubMock2.default(options);
    };

    return PubnubMockFactory;
}();

exports.default = PubnubMockFactory;

/***/ },
/* 22 */
/***/ function(module, exports, __webpack_require__) {

"use strict";

exports.__esModule = true;

var _events = __webpack_require__(12);

var _events2 = _interopRequireDefault(_events);

var _Externals = __webpack_require__(4);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var PubnubMock = function (_EventEmitter) {
    _inherits(PubnubMock, _EventEmitter);

    function PubnubMock(options) {
        _classCallCheck(this, PubnubMock);

        var _this = _possibleConstructorReturn(this, _EventEmitter.call(this));

        _this.options = options;
        _this.crypto_obj = _Externals.PUBNUB.crypto_obj;
        return _this;
    }

    PubnubMock.prototype.init = function init(options) {
        this.options = options;
    };

    PubnubMock.prototype.ready = function ready() {};

    PubnubMock.prototype.subscribe = function subscribe(options) {
        this.on('message-' + options.channel, options.message);
    };

    PubnubMock.prototype.unsubscribe = function unsubscribe(options) {
        this.removeAllListeners('message-' + options.channel);
    };

    PubnubMock.prototype.receiveMessage = function receiveMessage(msg, channel) {
        this.emit('message-' + channel, msg, 'env', channel);
    };

    return PubnubMock;
}(_events2.default);

exports.default = PubnubMock;

/***/ },
/* 23 */
/***/ function(module, exports, __webpack_require__) {

'use strict';

exports.__esModule = true;

var _events = __webpack_require__(12);

var _events2 = _interopRequireDefault(_events);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { return step("next", value); }, function (err) { return step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Subscription = function (_EventEmitter) {
    _inherits(Subscription, _EventEmitter);

    function Subscription(pubnubFactory, platform) {
        _classCallCheck(this, Subscription);

        var _this = _possibleConstructorReturn(this, _EventEmitter.call(this));

        _this.events = {
            notification: 'notification',
            removeSuccess: 'removeSuccess',
            removeError: 'removeError',
            renewSuccess: 'renewSuccess',
            renewError: 'renewError',
            subscribeSuccess: 'subscribeSuccess',
            subscribeError: 'subscribeError'
        };


        _this._pubnubFactory = pubnubFactory;
        _this._platform = platform;
        _this._pubnub = null;
        _this._pubnubLastChannel = null;
        _this._timeout = null;
        _this._subscription = null;

        return _this;
    }

    Subscription.prototype.subscribed = function subscribed() {

        var subscription = this.subscription();

        return !!(subscription.id && subscription.deliveryMode && subscription.deliveryMode.subscriberKey && subscription.deliveryMode.address);
    };

    /**
     * @return {boolean}
     */


    Subscription.prototype.alive = function alive() {
        return this.subscribed() && Date.now() < this.expirationTime();
    };

    /**
     * @return {boolean}
     */


    Subscription.prototype.expired = function expired() {
        if (!this.subscribed()) return true;
        return !this.subscribed() || Date.now() > this.subscription().expirationTime;
    };

    Subscription.prototype.expirationTime = function expirationTime() {
        return new Date(this.subscription().expirationTime || 0).getTime() - Subscription._renewHandicapMs;
    };

    Subscription.prototype.setSubscription = function setSubscription(subscription) {

        subscription = subscription || {};

        this._clearTimeout();
        this._setSubscription(subscription);
        this._subscribeAtPubnub();
        this._setTimeout();

        return this;
    };

    Subscription.prototype.subscription = function subscription() {
        return this._subscription || {};
    };

    /**
     * Creates or updates subscription if there is an active one
     * @returns {Promise<ApiResponse>}
     */


    Subscription.prototype.register = function () {
        var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee() {
            return regeneratorRuntime.wrap(function _callee$(_context) {
                while (1) {
                    switch (_context.prev = _context.next) {
                        case 0:
                            if (!this.alive()) {
                                _context.next = 6;
                                break;
                            }

                            _context.next = 3;
                            return this.renew();

                        case 3:
                            return _context.abrupt('return', _context.sent);

                        case 6:
                            _context.next = 8;
                            return this.subscribe();

                        case 8:
                            return _context.abrupt('return', _context.sent);

                        case 9:
                        case 'end':
                            return _context.stop();
                    }
                }
            }, _callee, this);
        }));

        function register() {
            return _ref.apply(this, arguments);
        }

        return register;
    }();

    Subscription.prototype.eventFilters = function eventFilters() {
        return this.subscription().eventFilters || [];
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
        var subscription = this.subscription();
        subscription.eventFilters = events;
        this._setSubscription(subscription);
        return this;
    };

    /**
     * @returns {Promise<ApiResponse>}
     */


    Subscription.prototype.subscribe = function () {
        var _ref2 = _asyncToGenerator(regeneratorRuntime.mark(function _callee2() {
            var response, json;
            return regeneratorRuntime.wrap(function _callee2$(_context2) {
                while (1) {
                    switch (_context2.prev = _context2.next) {
                        case 0:
                            _context2.prev = 0;


                            this._clearTimeout();

                            if (this.eventFilters().length) {
                                _context2.next = 4;
                                break;
                            }

                            throw new Error('Events are undefined');

                        case 4:
                            _context2.next = 6;
                            return this._platform.post('/subscription', {
                                eventFilters: this._getFullEventFilters(),
                                deliveryMode: {
                                    transportType: 'PubNub'
                                }
                            });

                        case 6:
                            response = _context2.sent;
                            json = response.json();


                            this.setSubscription(json).emit(this.events.subscribeSuccess, response);

                            return _context2.abrupt('return', response);

                        case 12:
                            _context2.prev = 12;
                            _context2.t0 = _context2['catch'](0);


                            _context2.t0 = this._platform.client().makeError(_context2.t0);

                            this.reset().emit(this.events.subscribeError, _context2.t0);

                            throw _context2.t0;

                        case 17:
                        case 'end':
                            return _context2.stop();
                    }
                }
            }, _callee2, this, [[0, 12]]);
        }));

        function subscribe() {
            return _ref2.apply(this, arguments);
        }

        return subscribe;
    }();

    /**
     * @returns {Promise<ApiResponse>}
     */


    Subscription.prototype.renew = function () {
        var _ref3 = _asyncToGenerator(regeneratorRuntime.mark(function _callee3() {
            var response, json;
            return regeneratorRuntime.wrap(function _callee3$(_context3) {
                while (1) {
                    switch (_context3.prev = _context3.next) {
                        case 0:
                            _context3.prev = 0;


                            this._clearTimeout();

                            if (this.subscribed()) {
                                _context3.next = 4;
                                break;
                            }

                            throw new Error('No subscription');

                        case 4:
                            if (this.eventFilters().length) {
                                _context3.next = 6;
                                break;
                            }

                            throw new Error('Events are undefined');

                        case 6:
                            _context3.next = 8;
                            return this._platform.put('/subscription/' + this.subscription().id, {
                                eventFilters: this._getFullEventFilters()
                            });

                        case 8:
                            response = _context3.sent;
                            json = response.json();


                            this.setSubscription(json).emit(this.events.renewSuccess, response);

                            return _context3.abrupt('return', response);

                        case 14:
                            _context3.prev = 14;
                            _context3.t0 = _context3['catch'](0);


                            _context3.t0 = this._platform.client().makeError(_context3.t0);

                            this.reset().emit(this.events.renewError, _context3.t0);

                            throw _context3.t0;

                        case 19:
                        case 'end':
                            return _context3.stop();
                    }
                }
            }, _callee3, this, [[0, 14]]);
        }));

        function renew() {
            return _ref3.apply(this, arguments);
        }

        return renew;
    }();

    /**
     * @returns {Promise<ApiResponse>}
     */


    Subscription.prototype.remove = function () {
        var _ref4 = _asyncToGenerator(regeneratorRuntime.mark(function _callee4() {
            var response;
            return regeneratorRuntime.wrap(function _callee4$(_context4) {
                while (1) {
                    switch (_context4.prev = _context4.next) {
                        case 0:
                            _context4.prev = 0;

                            if (this.subscribed()) {
                                _context4.next = 3;
                                break;
                            }

                            throw new Error('No subscription');

                        case 3:
                            _context4.next = 5;
                            return this._platform.delete('/subscription/' + this.subscription().id);

                        case 5:
                            response = _context4.sent;


                            this.reset().emit(this.events.removeSuccess, response);

                            return _context4.abrupt('return', response);

                        case 10:
                            _context4.prev = 10;
                            _context4.t0 = _context4['catch'](0);


                            _context4.t0 = this._platform.client().makeError(_context4.t0);

                            this.emit(this.events.removeError, _context4.t0);

                            throw _context4.t0;

                        case 15:
                        case 'end':
                            return _context4.stop();
                    }
                }
            }, _callee4, this, [[0, 10]]);
        }));

        function remove() {
            return _ref4.apply(this, arguments);
        }

        return remove;
    }();

    /**
     * @returns {Promise<ApiResponse>}
     */


    Subscription.prototype.resubscribe = function resubscribe() {
        var filters = this.eventFilters();
        return this.reset().setEventFilters(filters).subscribe();
    };

    /**
     * Remove subscription and disconnect from PUBNUB
     * This method resets subscription at client side but backend is not notified
     */


    Subscription.prototype.reset = function reset() {
        this._clearTimeout();
        if (this.subscribed() && this._pubnub) this._pubnub.unsubscribe({ channel: this.subscription().deliveryMode.address });
        this._setSubscription(null);
        return this;
    };

    Subscription.prototype._setSubscription = function _setSubscription(subscription) {
        this._subscription = subscription;
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

        this._timeout = setInterval(function () {

            if (_this3.alive()) return;

            if (_this3.expired()) {
                _this3.subscribe();
            } else {
                _this3.renew();
            }
        }, Subscription._pollInterval);

        return this;
    };

    Subscription.prototype._clearTimeout = function _clearTimeout() {
        clearInterval(this._timeout);
        return this;
    };

    Subscription.prototype._decrypt = function _decrypt(message) {

        if (!this.subscribed()) throw new Error('No subscription');

        if (this.subscription().deliveryMode.encryptionKey) {

            message = this._pubnubFactory.crypto_obj.decrypt(message, this.subscription().deliveryMode.encryptionKey, {
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

        var deliveryMode = this.subscription().deliveryMode;

        if (this._pubnub) {

            if (this._pubnubLastChannel == deliveryMode.address) {
                // Nothing to update, keep listening to same channel
                return this;
            } else if (this._pubnubLastChannel) {
                // Need to subscribe to new channel
                this._pubnub.unsubscribe({ channel: this._pubnubLastChannel });
            }

            // Re-init for new data
            this._pubnub = this._pubnub.init({
                ssl: true,
                subscribe_key: deliveryMode.subscriberKey
            });
        } else {

            // Init from scratch
            this._pubnub = this._pubnubFactory.init({
                ssl: true,
                subscribe_key: deliveryMode.subscriberKey
            });

            this._pubnub.ready(); //TODO This may be not needed anymore
        }

        this._pubnubLastChannel = deliveryMode.address;

        this._pubnub.subscribe({
            channel: deliveryMode.address,
            message: this._notify.bind(this),
            connect: function connect() {}
        });

        return this;
    };

    return Subscription;
}(_events2.default);

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


Subscription._renewHandicapMs = 2 * 60 * 1000;
Subscription._pollInterval = 10 * 1000;
exports.default = Subscription;

/***/ },
/* 24 */
/***/ function(module, exports, __webpack_require__) {

"use strict";

exports.__esModule = true;

var _Subscription2 = __webpack_require__(23);

var _Subscription3 = _interopRequireDefault(_Subscription2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var CachedSubscription = function (_Subscription) {
    _inherits(CachedSubscription, _Subscription);

    function CachedSubscription(pubnubFactory, platform, cache, cacheKey) {
        _classCallCheck(this, CachedSubscription);

        /** @type {Cache} */

        var _this = _possibleConstructorReturn(this, _Subscription.call(this, pubnubFactory, platform));

        _this._cache = cache;
        _this._cacheKey = cacheKey;

        return _this;
    }

    CachedSubscription.prototype.subscription = function subscription() {
        return this._cache.getItem(this._cacheKey) || {};
    };

    CachedSubscription.prototype._setSubscription = function _setSubscription(subscription) {
        return this._cache.setItem(this._cacheKey, subscription);
    };

    /**
     * This function checks whether there are any pre-defined eventFilters in cache and if not -- uses provided as defaults
     * @param {string[]} events
     * @return {CachedSubscription}
     */


    CachedSubscription.prototype.restore = function restore(events) {

        if (!this.eventFilters().length) {
            this.setEventFilters(events);
        }

        return this;
    };

    return CachedSubscription;
}(_Subscription3.default);

exports.default = CachedSubscription;

/***/ }
/******/ ])
});
;
//# sourceMappingURL=ringcentral.js.map