define(function(require, exports, module) {

    'use strict';

    var Helper = require('../core/Helper').Class;

    /**
     * @extends Helper
     * @constructor
     */
    function TimezoneHelper(context) {
        Helper.call(this, context);
    }

    TimezoneHelper.prototype = Object.create(Helper.prototype);

    TimezoneHelper.prototype.createUrl = function() {
        return '/dictionary/timezone';
    };

    module.exports = {
        Class: TimezoneHelper,
        /**
         * @param {Context} context
         * @returns {TimezoneHelper}
         */
        $get: function(context) {

            return context.createSingleton('TimezoneHelper', function() {
                return new TimezoneHelper(context);
            });

        }
    };

    /**
     * @typedef {object} ITimezone
     * @property {string} id
     * @property {string} uri
     * @property {string} name
     * @property {string} description
     */

});
