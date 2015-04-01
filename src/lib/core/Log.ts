/// <reference path="../../typings/externals.d.ts" />

import utils = require('./Utils');
import context = require('./Context');

export class Log {

    private context:context.Context;
    private utils:utils.Utils;

    public console:Console;
    public logDebug:boolean;
    public logInfo:boolean;
    public logWarnings:boolean;
    public logErrors:boolean;
    public addTimestamps:boolean;

    constructor(context:context.Context, console?:Console) {

        if (!console) {
            console = <Console>{ // safety
                log: () => {},
                warn: () => {},
                info: () => {},
                error: () => {}
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

    disableAll() {
        this.logDebug = false;
        this.logInfo = false;
        this.logWarnings = false;
        this.logErrors = false;
    }

    enableAll() {
        this.logDebug = true;
        this.logInfo = true;
        this.logWarnings = true;
        this.logErrors = true;
    }

    parseArguments(args) {
        args = this.utils.argumentsToArray(args);
        if (this.addTimestamps) args.unshift(new Date().toLocaleString(), '-');
        return args;
    }

    debug(...args) {
        if (this.logDebug) this.console.log.apply(this.console, this.parseArguments(arguments));
    }

    info(...args) {
        if (this.logInfo) this.console.info.apply(this.console, this.parseArguments(arguments));
    }

    warn(...args) {
        if (this.logWarnings) this.console.warn.apply(this.console, this.parseArguments(arguments));
    }

    error(...args) {
        if (this.logErrors) this.console.error.apply(this.console, this.parseArguments(arguments));
    }

}

export function $get(context:context.Context):Log {

    return context.createSingleton('Log', ()=> {
        return new Log(context, console);
    });

}