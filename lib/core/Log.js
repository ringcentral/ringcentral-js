var define = typeof define === 'function' && define.amd ? define : function (factory) {
    factory(require, exports, module);
};
define(function (require, exports, module) {
    var utils = require('./Utils');
    var Log = function () {
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
    }();
    exports.Log = Log;
    function $get(context) {
        return context.createSingleton('Log', function () {
            return new Log(context, console);
        });
    }
    exports.$get = $get;
});