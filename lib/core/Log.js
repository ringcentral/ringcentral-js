define(function(require, exports, module) {

    'use strict';

    var Utils = require('./Utils');

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

});
