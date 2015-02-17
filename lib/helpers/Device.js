define(function(require, exports, module) {

    'use strict';

    var Helper = require('../core/Helper').Class,
        Validator = require('../core/Validator');

    /**
     * @extends Helper
     * @constructor
     */
    function DeviceHelper(context) {
        Helper.call(this, context);
        this.extension = require('./Extension').$get(context);
        this.deviceModel = require('./DeviceModel').$get(context);
    }

    DeviceHelper.prototype = Object.create(Helper.prototype);

    /**
     * @param {IDeviceOptions} [options]
     * @param {string} [id]
     * @returns {string}
     */
    DeviceHelper.prototype.createUrl = function(options, id) {

        options = options || {};

        if (options.order) return '/account/~/order';

        return '/account/~' +
               (options.extensionId ? '/extension/' + options.extensionId : '') +
               '/device' +
               (id ? '/' + id : '');

    };

    /**
     * @param {IDevice} item
     */
    DeviceHelper.prototype.validate = function(item) {

        return Validator.validate([
            {field: 'emergencyServiceAddress-street', validator: Validator.required(item && item.emergencyServiceAddress && item.emergencyServiceAddress.street)},
            {field: 'emergencyServiceAddress-city', validator: Validator.required(item && item.emergencyServiceAddress && item.emergencyServiceAddress.city)},
            {field: 'emergencyServiceAddress-state', validator: Validator.required(item && item.emergencyServiceAddress && item.emergencyServiceAddress.state)},
            {field: 'emergencyServiceAddress-country', validator: Validator.required(item && item.emergencyServiceAddress && item.emergencyServiceAddress.country)},
            {field: 'emergencyServiceAddress-zip', validator: Validator.required(item && item.emergencyServiceAddress && item.emergencyServiceAddress.zip)},
            {field: 'emergencyServiceAddress-customerName', validator: Validator.required(item && item.emergencyServiceAddress && item.emergencyServiceAddress.customerName)},
            {field: 'extension', validator: Validator.required(this.extension.getId(item && item.extension))},
            {field: 'model', validator: Validator.required(this.deviceModel.getId(item && item.model))}
        ]);

    };

    module.exports = {
        Class: DeviceHelper,
        /**
         * @param {Context} context
         * @returns {DeviceHelper}
         */
        $get: function(context) {

            return context.createSingleton('DeviceHelper', function() {
                return new DeviceHelper(context);
            });

        }
    };

    /**
     * @typedef {Object} IDevice
     * @property {string} id
     * @property {string} uri
     * @property {string} type
     * @property {string} name
     * @property {string} serial
     * @property {IDeviceModel} model
     * @property {IExtensionShort} extension TODO IExtension?
     * @property {IDeviceAddress} emergencyServiceAddress
     * @property {IDeviceShipping} shipping
     * @property {IDevicePhoneLine[]} phoneLines
     */

    /**
     * @typedef {Object} IDeviceOrder
     * @property {IDevice[]} devices
     */

    /**
     * @typedef {Object} IDeviceAddress
     * @property {string} street
     * @property {string} street2
     * @property {string} city
     * @property {string} state
     * @property {string} country
     * @property {string} zip
     * @property {string} customerName
     */

    /**
     * @typedef {Object} IDeviceShipping
     * @property {IDeviceAddress} address
     * @property {IShippingMethod} method
     * @property {string} status
     */

    /**
     * @typedef {Object} IDevicePhoneLine
     * @property {string} lineType
     * @property {IPhoneNumber} phoneInfo
     */

    /**
     * @typedef {Object} IDeviceOptions
     * @property {string} extensionId
     */

});
