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
    var Timezone = function (_super) {
        __extends(Timezone, _super);
        function Timezone() {
            _super.apply(this, arguments);
        }
        Timezone.prototype.createUrl = function () {
            return '/dictionary/timezone';
        };
        return Timezone;
    }(helper.Helper);
    exports.Timezone = Timezone;
    function $get(context) {
        return context.createSingleton('Timezone', function () {
            return new Timezone(context);
        });
    }
    exports.$get = $get;
});