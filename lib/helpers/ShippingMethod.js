/// <reference path="../../typings/tsd.d.ts" />
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var helper = require('../core/Helper');
var ShippingMethod = (function (_super) {
    __extends(ShippingMethod, _super);
    function ShippingMethod() {
        _super.apply(this, arguments);
        /**
         * TODO Remove when http://jira.ringcentral.com/browse/SDK-3 id done
         */
        this.shippingMethods = [
            {
                id: '1',
                name: 'Ground Shipping (5-7 business days)'
            },
            {
                id: '2',
                name: '2-days Shipping'
            },
            {
                id: '3',
                name: 'Overnight Shipping'
            }
        ];
    }
    return ShippingMethod;
})(helper.Helper);
exports.ShippingMethod = ShippingMethod;
function $get(context) {
    return context.createSingleton('ShippingMethod', function () {
        return new ShippingMethod(context);
    });
}
exports.$get = $get;
