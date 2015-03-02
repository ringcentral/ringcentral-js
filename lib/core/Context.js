define(function(require, exports, module) {

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
        return this.stubPubnub ? require('./pubnub/PubnubMock').$get(this) : this.injections.PUBNUB;
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
        return this.stubAjax ? require('./xhr/XhrMock').$get(this) : new this.injections.XHR();
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

});
