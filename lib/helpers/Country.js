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
    var Country = function (_super) {
        __extends(Country, _super);
        function Country() {
            _super.apply(this, arguments);
        }
        Country.prototype.createUrl = function (options, id) {
            return '/dictionary/country';
        };
        return Country;
    }(helper.Helper);
    exports.Country = Country;
    function $get(context) {
        return context.createSingleton('Country', function () {
            return new Country(context);
        });
    }
    exports.$get = $get;
});