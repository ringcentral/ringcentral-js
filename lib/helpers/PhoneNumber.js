define(function(require, exports, module) {

    'use strict';

    var List = require('../core/List'),
        Utils = require('../core/Utils'),
        Helper = require('../core/Helper').Class;

    /**
     * @extends Helper
     * @constructor
     */
    function PhoneNumberHelper(context) {
        Helper.call(this, context);
        this.extension = require('./Extension').$get(context);
    }

    PhoneNumberHelper.prototype = Object.create(Helper.prototype);

    /**
     * @param {IPhoneNumberOptions} [options]
     * @param {string} [id]
     * @returns {string}
     */
    PhoneNumberHelper.prototype.createUrl = function(options, id) {

        options = options || {};

        if (options.lookup) return '/number-pool/lookup';

        return '/account/~' +
               (options.extensionId ? '/extension/' + options.extensionId : '') +
               '/phone-number' +
               (id ? '/' + id : '');

    };

    PhoneNumberHelper.prototype.isSMS = function(phoneNumber) {
        return this.hasFeature(phoneNumber, 'SmsSender');
    };

    PhoneNumberHelper.prototype.hasFeature = function(phoneNumber, feature) {
        return (!!phoneNumber.features && phoneNumber.features.indexOf(feature) != -1);
    };

    PhoneNumberHelper.prototype.reserve = function(phoneNumber, date) {
        phoneNumber.reservedTill = new Date(date).toISOString();
    };

    PhoneNumberHelper.prototype.unreserve = function(phoneNumber) {
        phoneNumber.reservedTill = null;
    };

    /**
     * @param {IListComparatorOptions} [options]
     * @returns {function(IPhoneNumber, IPhoneNumber)}
     */
    PhoneNumberHelper.prototype.comparator = function(options) {

        return List.comparator(Utils.extend({
            /**
             * @param {IPhoneNumber} item
             * @returns {string}
             */
            extractFn: function(item) {
                return item.usageType + '-' +
                       item.paymentType + '-' +
                       item.type;
            }
        }, options));

    };

    /**
     * TODO Add other filtering methods http://jira.ringcentral.com/browse/SDK-5
     * @param {IPhoneNumberFilterOptions} options
     * @returns {function(IForwardingNumber)}
     */
    PhoneNumberHelper.prototype.filter = function(options) {

        var self = this;

        options = Utils.extend({
            usageType: '',
            paymentType: '',
            type: '',
            features: []
        }, options);

        return List.filter([
            {filterBy: 'usageType', condition: options.usageType},
            {filterBy: 'paymentType', condition: options.paymentType},
            {filterBy: 'type', condition: options.type},
            {
                condition: options.features.length, filterFn: function(item) {

                return options.features.some(function(feature) {
                    return self.hasFeature(item, feature);
                });

            }
            }
        ]);

    };

    module.exports = {
        Class: PhoneNumberHelper,
        /**
         * @param {Context} context
         * @returns {PhoneNumberHelper}
         */
        $get: function(context) {

            return context.createSingleton('PhoneNumberHelper', function() {
                return new PhoneNumberHelper(context);
            });

        }
    };

    /**
     * @typedef {object} IPhoneNumber
     * @property {string} id
     * @property {string} uri
     * @property {string} phoneNumber
     * @property {string} paymentType - External, TollFree, Local
     * @property {string} location
     * @property {string} type - VoiceFax, FaxOnly, VoiceOnly
     * @property {string} usageType - CompanyNumber, DirectNumber, CompanyFaxNumber, ForwardedNumber
     * @property {array} features - CallerId, SmsSender
     * @property {string} reservedTill - Date
     * @property {string} error
     */

    /**
     * @typedef {object} IPhoneNumberOptions
     * @property {string} extensionId
     * @property {true} lookup
     * @property {string} countryId
     * @property {string} paymentType
     * @property {string} npa
     * @property {string} nxx
     * @property {string} line
     * @property {string} exclude
     */

    /**
     * @typedef {object} IPhoneNumberFilterOptions
     * @property {string} paymentType
     * @property {string} usageType
     * @property {string} type
     * @property {string[]} features
     */

    /**
     * @typedef {object} IPhoneNumberOrder
     * @property {IPhoneNumber[]} records
     */

});
