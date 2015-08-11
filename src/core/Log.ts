module RingCentral.sdk.core {

    /**
     * TODO Fix public vars
     */
    export class Log {

        public _console:Console;
        public logDebug:boolean;
        public logInfo:boolean;
        public logWarnings:boolean;
        public logErrors:boolean;
        public addTimestamps:boolean;

        constructor(console?:Console) {

            if (!console) {
                console = <Console>{ // safety
                    log: () => {},
                    warn: () => {},
                    info: () => {},
                    error: () => {}
                };
            }

            this._console = console;

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

        debug(...args) {
            if (this.logDebug) this._console.log.apply(this._console, this._parseArguments(arguments));
        }

        info(...args) {
            if (this.logInfo) this._console.info.apply(this._console, this._parseArguments(arguments));
        }

        warn(...args) {
            if (this.logWarnings) this._console.warn.apply(this._console, this._parseArguments(arguments));
        }

        error(...args) {
            if (this.logErrors) this._console.error.apply(this._console, this._parseArguments(arguments));
        }

        stack() {
            var e = <any> new Error();
            if (e.hasOwnProperty('stack')) {
                return e.stack.replace('Error\n', 'Stack Trace\n');
            }
        }

        protected _parseArguments(args) {
            args = utils.argumentsToArray(args);
            if (this.addTimestamps) args.unshift(new Date().toLocaleString(), '-');
            return args;
        }

    }

    export var log = new Log();

}