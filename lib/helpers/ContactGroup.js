define(function(require, exports, module) {

    'use strict';

    var Helper = require('../core/Helper').Class,
        Validator = require('../core/Validator');

    /**
     * @extends Helper
     * @constructor
     */
    function ContactGroupHelper(context) {
        Helper.call(this, context);
    }

    ContactGroupHelper.prototype = Object.create(Helper.prototype);
    ContactGroupHelper.prototype.createUrl = function(options, id) {
        return '/account/~/extension/~/address-book/group' + (id ? '/' + id : '');
    };

    /**
     * @param {IContactGroup} item
     */
    ContactGroupHelper.prototype.validate = function(item) {

        return Validator.validate([
            {field: 'groupName', validator: Validator.required(item && item.groupName)}
        ]);

    };

    module.exports = {
        Class: ContactGroupHelper,
        /**
         * @param {Context} context
         * @returns {ContactGroupHelper}
         */
        $get: function(context) {

            return context.createSingleton('ContactGroupHelper', function() {
                return new ContactGroupHelper(context);
            });

        }
    };

    /**
     * @typedef {object} IContactGroup
     * @property {string} id
     * @property {string} uri
     * @property {string} notes
     * @property {string} groupName
     * @property {number} contactsCount
     */

});
