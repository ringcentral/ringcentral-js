var define = typeof define === 'function' && define.amd ? define : function (factory) {
    factory(require, exports, module);
};
define(function (require, exports, module) {
    var __extends = this.__extends || function (d, b) {
        for (var p in b)
            if (b.hasOwnProperty(p))
                d[p] = b[p];
        function __() {
            this.constructor = d;
        }
        __.prototype = b.prototype;
        d.prototype = new __();
    };
    var observable = require('../Observable');
    var PubnubMock = function (_super) {
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
    }(observable.Observable);
    exports.PubnubMock = PubnubMock;
    var PubnubFactory = function () {
        function PubnubFactory(context) {
            this.context = context;
        }
        PubnubFactory.prototype.init = function (options) {
            return new PubnubMock(this.context, options);
        };
        return PubnubFactory;
    }();
    exports.PubnubFactory = PubnubFactory;
    function $get(context) {
        return new PubnubFactory(context);
    }
    exports.$get = $get;
});