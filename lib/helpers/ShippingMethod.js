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
    var helper = require('../core/Helper');
    var ShippingMethod = function (_super) {
        __extends(ShippingMethod, _super);
        function ShippingMethod() {
            _super.apply(this, arguments);
        }
        /**
     * TODO Add or describe options http://jira.ringcentral.com/browse/SDK-3 id done
     */
        ShippingMethod.prototype.createUrl = function () {
            return '/dictionary/shipping-options';
        };
        return ShippingMethod;
    }(helper.Helper);
    exports.ShippingMethod = ShippingMethod;
    function $get(context) {
        return context.createSingleton('ShippingMethod', function () {
            return new ShippingMethod(context);
        });
    }
    exports.$get = $get;
});