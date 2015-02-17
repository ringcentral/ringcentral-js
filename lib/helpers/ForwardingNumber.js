define(function(require, exports, module) {

    'use strict';

    var Helper = require('../core/Helper').Class,
        Utils = require('../core/Utils'),
        List = require('../core/List');

    /**
     * @extends Helper
     * @constructor
     */
    function ForwardingNumberHelper(context) {
        Helper.call(this, context);
    }

    ForwardingNumberHelper.prototype = Object.create(Helper.prototype);


    ForwardingNumberHelper.prototype.createUrl = function(options, id) {

        options = options || {};

        return '/account/~/extension/' + (options.extensionId || '~') + '/forwarding-number' + (id ? '/' + id : '');

    };

    ForwardingNumberHelper.prototype.getId = function(forwardingNumber) {
        return forwardingNumber.id || (forwardingNumber.phoneNumber);
    };

    ForwardingNumberHelper.prototype.hasFeature = function(phoneNumber, feature) {
        return (!!phoneNumber.features && phoneNumber.features.indexOf(feature) != -1);
    };

    /**
     * @param {IListComparatorOptions} [options]
     * @returns {function(object, object)}
     */
    ForwardingNumberHelper.prototype.comparator = function(options) {

        return List.comparator(Utils.extend({
            sortBy: 'label'
        }, options));

    };

    /**
     * @param options
     * @returns {function(IForwardingNumber)}
     */
    ForwardingNumberHelper.prototype.filter = function(options) {

        var self = this;

        options = Utils.extend({
            features: []
        }, options);

        return List.filter([
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
        Class: ForwardingNumberHelper,
        /**
         * @param {Context} context
         * @returns {ForwardingNumberHelper}
         */
        $get: function(context) {

            return context.createSingleton('ForwardingNumberHelper', function() {
                return new ForwardingNumberHelper(context);
            });

        }
    };

    /**
     *
     * @typedef {object} IForwardingNumber
     * @property {string} id
     * @property {string} uri
     * @property {string} label
     * @property {string} phoneNumber
     * @property {string} flipNumber
     */

});
