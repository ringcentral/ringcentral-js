define(function(require, exports, module) {

    'use strict';

    var Helper = require('../core/Helper').Class;

    /**
     * @extends Helper
     * @constructor
     */
    function LanguageHelper(context) {
        Helper.call(this, context);
    }

    LanguageHelper.prototype = Object.create(Helper.prototype);

    /**
     * @type {ILanguage[]}
     */
    LanguageHelper.prototype.languages = [
        {
            id: '1033',
            name: 'English (US)'
        },
        {
            id: '3084',
            name: 'French (Canada)'
        }
    ];

    module.exports = {
        Class: LanguageHelper,
        /**
         * @param {Context} context
         * @returns {LanguageHelper}
         */
        $get: function(context) {

            return context.createSingleton('LanguageHelper', function() {
                return new LanguageHelper(context);
            });

        }
    };

    /**
     * @typedef {object} ILanguage
     * @property {string} id
     * @property {string} name
     */

});
