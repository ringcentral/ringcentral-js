define(function(require, exports, module) {

    'use strict';

    var Helper = require('../core/Helper').Class;

    /**
     * @extends Helper
     * @constructor
     */
    function ShippingMethodHelper(context) {
        Helper.call(this, context);
    }

    ShippingMethodHelper.prototype = Object.create(Helper.prototype);

    /**
     * TODO Remove when http://jira.ringcentral.com/browse/SDK-3 id done
     * @type {IShippingMethod[]}
     */
    ShippingMethodHelper.prototype.shippingMethods = [
        {
            id: '1',
            name: 'Ground Shipping (5-7 business days)'
        },
        {
            id: '2',
            name: '2-days Shipping'
        },
        {
            id: '3',
            name: 'Overnight Shipping'
        }
    ];

    module.exports = {
        Class: ShippingMethodHelper,
        /**
         * @param {Context} context
         * @returns {ShippingMethodHelper}
         */
        $get: function(context) {

            return context.createSingleton('ShippingMethodHelper', function() {
                return new ShippingMethodHelper(context);
            });

        }
    };

    /**
     * @typedef {object} IShippingMethod
     * @property {string} id
     * @property {string} name
     */

});
