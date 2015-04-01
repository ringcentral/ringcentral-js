var define = typeof define === 'function' && define.amd ? define : function (factory) {
    factory(require, exports, module);
};
define(function (require, exports, module) {
    var PubnubMock = function () {
        function PubnubMock() {
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
        return PubnubMock;
    }();
    exports.PubnubMock = PubnubMock;
    var PubnubFactory = function () {
        function PubnubFactory(context) {
            this.context = context;
        }
        PubnubFactory.prototype.init = function (options) {
            return new PubnubMock();
        };
        return PubnubFactory;
    }();
    exports.PubnubFactory = PubnubFactory;
    function $get(context) {
        return new PubnubFactory(context);
    }
    exports.$get = $get;
});