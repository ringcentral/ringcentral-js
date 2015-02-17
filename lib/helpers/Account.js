define(function(require, exports, module) {

    'use strict';

    var Helper = require('../core/Helper').Class;

    /**
     * @extends Helper
     * @constructor
     */
    function AccountHelper(context) {
        Helper.call(this, context);
    }

    AccountHelper.prototype = Object.create(Helper.prototype);

    AccountHelper.prototype.createUrl = function() {
        return '/account/~';
    };

    module.exports = {
        Class: AccountHelper,
        /**
         * @param {Context} context
         * @returns {AccountHelper}
         */
        $get: function(context) {

            return context.createSingleton('AccountHelper', function() {
                return new AccountHelper(context);
            });

        }
    };

});
