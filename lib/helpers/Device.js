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
    var extension = require('./Extension');
    var deviceModel = require('./DeviceModel');
    var Device = function (_super) {
        __extends(Device, _super);
        function Device(context) {
            _super.call(this, context);
            this.validator = validator.$get(context);
            this.extension = extension.$get(context);
            this.deviceModel = deviceModel.$get(context);
        }
        Device.prototype.createUrl = function (options, id) {
            options = options || {};
            if (options.order)
                return '/account/~/order';
            return '/account/~' + (options.extensionId ? '/extension/' + options.extensionId : '') + '/device' + (id ? '/' + id : '');
        };
        /**
     * @param {IDevice} item
     */
        Device.prototype.validate = function (item) {
            return this.validator.validate([
                {
                    field: 'emergencyServiceAddress-street',
                    validator: this.validator.required(item && item.emergencyServiceAddress && item.emergencyServiceAddress.street)
                },
                {
                    field: 'emergencyServiceAddress-city',
                    validator: this.validator.required(item && item.emergencyServiceAddress && item.emergencyServiceAddress.city)
                },
                {
                    field: 'emergencyServiceAddress-state',
                    validator: this.validator.required(item && item.emergencyServiceAddress && item.emergencyServiceAddress.state)
                },
                {
                    field: 'emergencyServiceAddress-country',
                    validator: this.validator.required(item && item.emergencyServiceAddress && item.emergencyServiceAddress.country)
                },
                {
                    field: 'emergencyServiceAddress-zip',
                    validator: this.validator.required(item && item.emergencyServiceAddress && item.emergencyServiceAddress.zip)
                },
                {
                    field: 'emergencyServiceAddress-customerName',
                    validator: this.validator.required(item && item.emergencyServiceAddress && item.emergencyServiceAddress.customerName)
                },
                {
                    field: 'extension',
                    validator: this.validator.required(this.extension.getId(item && item.extension))
                },
                {
                    field: 'model',
                    validator: this.validator.required(this.deviceModel.getId(item && item.model))
                }
            ]);
        };
        return Device;
    }(helper.Helper);
    exports.Device = Device;
    function $get(context) {
        return context.createSingleton('Device', function () {
            return new Device(context);
        });
    }
    exports.$get = $get;
});