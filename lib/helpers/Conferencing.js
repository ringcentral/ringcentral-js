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
    var Conferencing = function (_super) {
        __extends(Conferencing, _super);
        function Conferencing() {
            _super.apply(this, arguments);
        }
        Conferencing.prototype.createUrl = function () {
            return '/account/~/extension/~/conferencing';
        };
        return Conferencing;
    }(helper.Helper);
    exports.Conferencing = Conferencing;
    function $get(context) {
        return context.createSingleton('Conferencing', function () {
            return new Conferencing(context);
        });
    }
    exports.$get = $get;
});