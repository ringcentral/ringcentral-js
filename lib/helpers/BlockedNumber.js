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
    var validator = require('../core/Validator');
    var BlockedNumber = function (_super) {
        __extends(BlockedNumber, _super);
        function BlockedNumber(context) {
            _super.call(this, context);
            this.validator = validator.$get(context);
        }
        BlockedNumber.prototype.createUrl = function (options, id) {
            options = options || {};
            return '/account/~/extension/' + (options.extensionId ? options.extensionId : '~') + '/blocked-number' + (id ? '/' + id : '');
        };
        BlockedNumber.prototype.validate = function (item) {
            return this.validator.validate([
                {
                    field: 'phoneNumber',
                    validator: this.validator.phone(item.phoneNumber)
                },
                {
                    field: 'phoneNumber',
                    validator: this.validator.required(item.phoneNumber)
                },
                {
                    field: 'name',
                    validator: this.validator.required(item.name)
                }
            ]);
        };
        return BlockedNumber;
    }(helper.Helper);
    exports.BlockedNumber = BlockedNumber;
    function $get(context) {
        return context.createSingleton('BlockedNumber', function () {
            return new BlockedNumber(context);
        });
    }
    exports.$get = $get;
});