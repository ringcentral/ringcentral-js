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
    var Account = function (_super) {
        __extends(Account, _super);
        function Account() {
            _super.apply(this, arguments);
        }
        Account.prototype.createUrl = function () {
            return '/account/~';
        };
        return Account;
    }(helper.Helper);
    exports.Account = Account;
    function $get(context) {
        return context.createSingleton('Account', function () {
            return new Account(context);
        });
    }
    exports.$get = $get;
});