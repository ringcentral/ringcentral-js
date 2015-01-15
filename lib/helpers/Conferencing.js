/**
 * @description RingPlatform JS SDK
 * @copyright © 2014-2015 RingCentral, Inc. All rights reserved.
 */
define(function(require, exports, module) {

    'use strict';

    var Helper = require('../core/Helper').Class;

    /**
     * @extends Helper
     * @constructor
     */
    function ConferencingHelper(context) {
        Helper.call(this, context);
    }

    ConferencingHelper.prototype = Object.create(Helper.prototype);

    ConferencingHelper.prototype.createUrl = function() {
        return '/account/~/extension/~/conferencing';
    };

    module.exports = {
        Class: ConferencingHelper,
        /**
         * @param {Context} context
         * @returns {ConferencingHelper}
         */
        $get: function(context) {

            return context.createSingleton('ConferencingHelper', function() {
                return new ConferencingHelper(context);
            });

        }
    };

});
