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
    var list = require('../core/List');
    var ForwardingNumber = function (_super) {
        __extends(ForwardingNumber, _super);
        function ForwardingNumber(context) {
            _super.call(this, context);
            this.list = list.$get(context);
        }
        ForwardingNumber.prototype.createUrl = function (options, id) {
            options = options || {};
            return '/account/~/extension/' + (options.extensionId || '~') + '/forwarding-number' + (id ? '/' + id : '');
        };
        ForwardingNumber.prototype.getId = function (forwardingNumber) {
            return forwardingNumber && (forwardingNumber.id || forwardingNumber.phoneNumber);    //TODO @exceptionalCase
        };
        ForwardingNumber.prototype.hasFeature = function (phoneNumber, feature) {
            return !!phoneNumber && !!phoneNumber.features && phoneNumber.features.indexOf(feature) != -1;
        };
        ForwardingNumber.prototype.comparator = function (options) {
            return this.list.comparator(this.utils.extend({ sortBy: 'label' }, options));
        };
        ForwardingNumber.prototype.filter = function (options) {
            var _this = this;
            options = this.utils.extend({ features: [] }, options);
            return this.list.filter([{
                    condition: options.features.length,
                    filterFn: function (item) {
                        return options.features.some(function (feature) {
                            return _this.hasFeature(item, feature);
                        });
                    }
                }]);
        };
        return ForwardingNumber;
    }(helper.Helper);
    exports.ForwardingNumber = ForwardingNumber;
    function $get(context) {
        return context.createSingleton('ForwardingNumber', function () {
            return new ForwardingNumber(context);
        });
    }
    exports.$get = $get;
});