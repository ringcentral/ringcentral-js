define(function(require, exports, module) {

    'use strict';

    var Helper = require('../core/Helper').Class,
        List = require('../core/List'),
        Utils = require('../core/Utils');

    /**
     * @extends Helper
     * @constructor
     */
    function StateHelper(context) {
        Helper.call(this, context);
        this.countryHelper = require('./Country').$get(context);
    }

    StateHelper.prototype = Object.create(Helper.prototype);

    StateHelper.prototype.createUrl = function() {
        return '/dictionary/state';
    };

    /**
     * @param {IStateOptions} options
     * @returns {function(IState)}
     */
    StateHelper.prototype.filter = function(options) {

        options = Utils.extend({
            countryId: ''
        }, options);

        return List.filter([
            {
                condition: options.countryId,
                filterFn: function(item, opts) {
                    return (this.countryHelper.getId(item.country) == opts.condition);
                }.bind(this)
            }
        ]);

    };

    module.exports = {
        Class: StateHelper,
        /**
         * @param {Context} context
         * @returns {StateHelper}
         */
        $get: function(context) {

            return context.createSingleton('StateHelper', function() {
                return new StateHelper(context);
            });

        }
    };

    /**
     * @typedef {object} IState
     * @property {string} id
     * @property {string} uri
     * @property {string} name
     * @property {string} isoCode
     * @property {ICountry} country
     */

    /**
     * @typedef {object} IStateOptions
     * @property {string} countryId
     */

});
