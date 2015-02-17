define(function(require, exports, module) {

    'use strict';

    var Helper = require('../core/Helper').Class,
        Validator = require('../core/Validator');

    /**
     * @extends Helper
     * @constructor
     */
    function BlockedNumberHelper(context) {
        Helper.call(this, context);
    }

    BlockedNumberHelper.prototype = Object.create(Helper.prototype);

    /**
     *
     * @param {IBlockedNumberOptions} [options]
     * @param {string} [id]
     * @returns {string}
     */
    BlockedNumberHelper.prototype.createUrl = function(options, id) {

        options = options || {};

        return '/account/~/extension/' +
               (options.extensionId ? options.extensionId : '~') +
               '/blocked-number' +
               (id ? '/' + id : '');

    };

    /**
     * @param {IBlockedNumber} item
     */
    BlockedNumberHelper.prototype.validate = function(item) {

        return Validator.validate([
            {field: 'phoneNumber', validator: Validator.phone(item.phoneNumber)},
            {field: 'phoneNumber', validator: Validator.required(item.phoneNumber)},
            {field: 'name', validator: Validator.required(item.name)}
        ]);

    };

    module.exports = {
        Class: BlockedNumberHelper,
        /**
         * @param {Context} context
         * @returns {BlockedNumberHelper}
         */
        $get: function(context) {

            return context.createSingleton('BlockedNumberHelper', function() {
                return new BlockedNumberHelper(context);
            });

        }
    };

    /**
     * @typedef {object} IBlockedNumber
     * @property {string} name
     * @property {string} phoneNumber
     */

    /**
     * @typedef {object} IBlockedNumberOptions
     * @property {string} extensionId
     */

});
