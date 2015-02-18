define(function(require, exports, module) {

    'use strict';

    var Helper = require('../core/Helper').Class;

    /**
     * @extends Helper
     * @constructor
     */
    function CountryHelper(context) {
        Helper.call(this, context);
    }

    CountryHelper.prototype = Object.create(Helper.prototype);

    CountryHelper.prototype.createUrl = function() {
        return '/dictionary/country';
    };

    module.exports = {
        Class: CountryHelper,
        /**
         * @param {Context} context
         * @returns {CountryHelper}
         */
        $get: function(context) {

            return context.createSingleton('CountryHelper', function() {
                return new CountryHelper(context);
            });

        }
    };

    /**
     * @typedef {object} ICountry
     * @property {string} id
     * @property {string} uri
     * @property {string} name
     * @property {string} isoCode
     * @property {string} callingCode
     */

});
