var define = typeof define === 'function' && define.amd ? define : function (factory) {
    factory(require, exports, module);
};
define(function (require, exports, module) {
    var Context = function () {
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
                    return _this.injections.localStorage;    // this is window.localStorage
                }
                return new _this.injections.localStorage();    // this is NPM dom-storage constructor
            });
        };
        Context.prototype.getPromise = function () {
            return this.injections.Promise;
        };
        Context.prototype.getXHR = function () {
            return this.stubAjax ? this.injections.xhrMock.$get(this) : this.injections.XHR();
        };
        return Context;
    }();
    exports.Context = Context;
    function $get(injections) {
        return new Context(injections);
    }
    exports.$get = $get;
});