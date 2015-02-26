define(function(require, exports, module) {

    'use strict';

    var Utils = require('./Utils');

    /**
     * @alias RCSDK.core.List
     * @name List
     */
    var List = module.exports = {

        /**
         * @param {string} property
         * @returns {function(object)}
         */
        propertyExtractor: function(property) {
            return function(item, options) {
                return property ? ((item && item[property]) || null) : item;
            };
        },

        /**
         * Non-string types are converted to string
         * Non-string types are extracted as an empty string if they could be converted to false
         * If no options.sortBy given the item itself is extracted
         * Compares strings:
         * - if (a is less than b) return -1;
         * - if (a is greater than b) return 1;
         * - else (a must be equal to b) return 0;
         * Exceptions in will be suppressed, if any - a is assumed to be less than b
         * @param {string} a
         * @param {string} b
         * @param {IListComparatorOptions} [options]
         * @returns {number}
         */
        stringComparator: function(a, b, options) {

            return Utils.parseString(a).localeCompare(Utils.parseString(b));

        },

        /**
         * Non-numeric types are extracted as 0 if they could be converted to false
         * Objects that could not be converted to number are extracted as 0
         * If no options.sortBy given the item itself is extracted
         * See parseFloat for more info
         * Compares numbers:
         * - if (a is less than b) return -1;
         * - if (a is greater than b) return 1;
         * - else (a must be equal to b) return 0;
         * Function does not check types
         * Exceptions in will be suppressed, if any - a is assumed to be less than b
         * @param {number} a
         * @param {number} b
         * @param {IListComparatorOptions} [options]
         * @returns {number}
         */
        numberComparator: function(a, b, options) {

            return (Utils.parseNumber(a) - Utils.parseNumber(b));

        },

        /**
         * Function extracts (using _extractFn_ option) values of a property (_sortBy_ option) and compares them using
         * compare function (_compareFn_ option, by default Helper.stringComparator)
         * Merged options are provided to _extractFn_ and _compareFn_
         * TODO Check memory leaks for all that options links
         * @param {IListComparatorOptions} [options]
         * @returns {function(object, object)}
         */
        comparator: function(options) {

            options = Utils.extend({
                extractFn: this.propertyExtractor((options && options.sortBy) || null),
                compareFn: this.stringComparator
            }, options);

            /**
             * @param {object} item1
             * @param {object} item2
             * @returns {number}
             */
            function comparator(item1, item2) {

                return options.compareFn(options.extractFn(item1, options), options.extractFn(item2, options), options);

            }

            return comparator;

        },

        /**
         * @param {string} obj
         * @param {IListFilterOptions} options
         * @returns {boolean}
         */
        equalsFilter: function(obj, options) {
            return (options.condition === obj);
        },

        /**
         * @param {string} obj
         * @param {IListFilterOptions} options
         * @returns {boolean}
         */
        containsFilter: function(obj, options) {
            return (obj && obj.toString().indexOf(options.condition) > -1);
        },

        /**
         * @param {string} obj
         * @param {IListFilterOptions} options - `condition` must be an instance of RegExp
         * @returns {boolean}
         */
        regexpFilter: function(obj, options) {
            if (!(options.condition instanceof RegExp)) throw new Error('Condition must be an instance of RegExp');
            return (options.condition.test(obj));
        },

        /**
         * Function extracts (using `extractFn` option) values of a property (`filterBy` option) and filters them using
         * compare function (`filterFn` option, by default Helper.equalsFilter)
         * Merged options are provided to `extractFn` and `compareFn`
         * Set `filterBy` to null to force `propertyExtractor` to return object itself
         * TODO Check memory leaks for all that options links
         * @param {IListFilterOptions[]} [filterConfigs]
         * @returns {function(object)}
         */
        filter: function(filterConfigs) {

            var self = this;

            filterConfigs = (filterConfigs || []).map(function(opt) {

                return Utils.extend({
                    condition: '',
                    extractFn: self.propertyExtractor((opt && opt.filterBy) || null),
                    filterFn: self.equalsFilter
                }, opt);

            });

            /**
             * @param {object} item
             * @returns {boolean}
             */
            function filter(item) {

                return filterConfigs.reduce(function(pass, opt) {

                    if (!pass || !opt.condition) return pass;
                    return opt.filterFn(opt.extractFn(item, opt), opt);

                }, true);

            }

            return filter;

        },

        $get: function(context) {
            return List;
        }

    };

    /**
     * @typedef {object} IListComparatorOptions
     * @property {string} sortBy
     * @property {function(object, IListComparatorOptions)} extractFn
     * @property {function(object, object)} compareFn
     */

    /**
     * @typedef {object} IListFilterOptions
     * @property {string} filterBy
     * @property {object} condition
     * @property {function(object, IListComparatorOptions)} extractFn
     * @property {function(object, object)} filterFn
     */

});
