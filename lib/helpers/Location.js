define(function(require, exports, module) {

    'use strict';

    var Helper = require('../core/Helper').Class,
        List = require('../core/List'),
        Utils = require('../core/Utils');

    /**
     * @extends Helper
     * @constructor
     */
    function LocationHelper(context) {
        Helper.call(this, context);
        this.state = require('./State').$get(context);
    }

    LocationHelper.prototype = Object.create(Helper.prototype);

    LocationHelper.prototype.createUrl = function() {
        return '/dictionary/location';
    };

    /**
     * @param {ILocationFilterOptions} options
     * @returns {function(ILocation)}
     */
    LocationHelper.prototype.filter = function(options) {

        var uniqueNPAs = [];

        options = Utils.extend({
            stateId: '',
            onlyUniqueNPA: false
        }, options);

        return List.filter([
            {
                condition: options.stateId,
                filterFn: function(item, opts) {
                    return (this.state.getId(item.state) == opts.condition);
                }.bind(this)
            },
            {
                condition: options.onlyUniqueNPA,
                filterFn: function(item, opts) {
                    if (uniqueNPAs.indexOf(item.npa) == -1) {
                        uniqueNPAs.push(item.npa);
                        return true;
                    } else {
                        return false;
                    }
                }
            }
        ]);

    };

    /**
     * @param {IListComparatorOptions} [options]
     * @returns {comparator}
     */
    LocationHelper.prototype.comparator = function(options) {

        options = Utils.extend({
            sortBy: 'npa'
        }, options);

        if (options.sortBy == 'nxx') {

            /**
             * @param {ILocation} item
             * @returns {number}
             */
            options.extractFn = function(item) {
                return (parseInt(item.npa) * 1000000) + parseInt(item.nxx);
            };

            options.compareFn = List.numberComparator;

        }

        return List.comparator(options);

    };

    module.exports = {
        Class: LocationHelper,
        /**
         * @param {Context} context
         * @returns {LocationHelper}
         */
        $get: function(context) {

            return context.createSingleton('LocationHelper', function() {
                return new LocationHelper(context);
            });

        }
    };

    /**
     * @typedef {object} ILocation
     * @property {string} id
     * @property {string} uri
     * @property {string} name
     * @property {string} isoCode
     * @property {string} npa
     * @property {string} nxx
     * @property {IState} state
     */

    /**
     * @typedef {object} ILocationFilterOptions
     * @property {string} stateId
     * @property {boolean} onlyUniqueNPA
     */

});
