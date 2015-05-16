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
    var extension = require('./Extension');
    var PhoneNumber = function (_super) {
        __extends(PhoneNumber, _super);
        function PhoneNumber(context) {
            _super.call(this, context);
            this.extension = extension.$get(context);
            this.list = list.$get(context);
        }
        PhoneNumber.prototype.createUrl = function (options, id) {
            options = options || {};
            if (options.lookup) {
                var urlOptions = {
                    countryId: options.countryId,
                    paymentType: options.paymentType,
                    npa: options.npa
                };
                if (options.nxx)
                    urlOptions.nxx = options.nxx;
                if (options.line)
                    urlOptions.line = options.line;
                if (options.exclude)
                    urlOptions.exclude = options.exclude;
                return '/number-pool/lookup?' + this.utils.queryStringify(urlOptions);
            }
            return '/account/~' + (options.extensionId ? '/extension/' + options.extensionId : '') + '/phone-number' + (id ? '/' + id : '');
        };
        PhoneNumber.prototype.isSMS = function (phoneNumber) {
            return this.hasFeature(phoneNumber, 'SmsSender');
        };
        PhoneNumber.prototype.hasFeature = function (phoneNumber, feature) {
            return !!phoneNumber.features && phoneNumber.features.indexOf(feature) != -1;
        };
        PhoneNumber.prototype.reserve = function (phoneNumber, date) {
            phoneNumber.reservedTill = new Date(date).toISOString();
        };
        PhoneNumber.prototype.unreserve = function (phoneNumber) {
            phoneNumber.reservedTill = null;
        };
        PhoneNumber.prototype.comparator = function (options) {
            return this.list.comparator(this.utils.extend({
                extractFn: function (item) {
                    return item.usageType + '-' + item.paymentType + '-' + item.type;
                }
            }, options));
        };
        /**
     * TODO Add other filtering methods http://jira.ringcentral.com/browse/SDK-5
     */
        PhoneNumber.prototype.filter = function (options) {
            var _this = this;
            options = this.utils.extend({
                usageType: '',
                paymentType: '',
                type: '',
                features: []
            }, options);
            return this.list.filter([
                {
                    filterBy: 'usageType',
                    condition: options.usageType
                },
                {
                    filterBy: 'paymentType',
                    condition: options.paymentType
                },
                {
                    filterBy: 'type',
                    condition: options.type
                },
                {
                    condition: options.features.length,
                    filterFn: function (item) {
                        return options.features.some(function (feature) {
                            return _this.hasFeature(item, feature);
                        });
                    }
                }
            ]);
        };
        return PhoneNumber;
    }(helper.Helper);
    exports.PhoneNumber = PhoneNumber;
    function $get(context) {
        return context.createSingleton('PhoneNumber', function () {
            return new PhoneNumber(context);
        });
    }
    exports.$get = $get;
});