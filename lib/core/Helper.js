define(function(require, exports, module) {

    'use strict';

    var Utils = require('./Utils');

    /**
     * @alias RCSDK.core.Helper
     * @constructor
     * @param {Context} context
     */
    function Helper(context) {
        this.context = context;
    }

    Helper.prototype.defaultProperty = 'id';

    /**
     * @returns {Context}
     */
    Helper.prototype.getContext = function() {
        return this.context;
    };

    /**
     * @param {object} [options]
     * @param {string} [id]
     */
    Helper.prototype.createUrl = function(options, id) {
        return '';
    };

    /**
     * @param {IHelperObject} object
     * @returns {string}
     */
    Helper.prototype.getId = function(object) {
        return object && object[this.defaultProperty];
    };

    /**
     *
     * @param {IHelperObject} object
     * @returns {boolean}
     */
    Helper.prototype.isNew = function(object) {
        return !this.getId(object) || !this.getUri(object);
    };

    /**
     *
     * @param {IHelperObject} object
     * @returns {IHelperObject}
     */
    Helper.prototype.resetAsNew = function(object) {
        if (object) {
            delete object.id;
            delete object.uri;
        }
        return object;
    };

    /**
     * @param {IHelperObject} object
     * @returns {string}
     */
    Helper.prototype.getUri = function(object) {
        return object && object.uri;
    };

    /**
     * @param {Response} ajax
     * @return {IHelperObject[]}
     */
    Helper.prototype.parseMultipartResponse = function(ajax) {

        if (ajax.isMultipart()) {

            // ajax.data has full array, leave only successful
            return ajax.data.filter(function(result) {
                return (!result.error);
            }).map(function(result) {
                return result.data;
            });

        } else { // Single ID

            return [ajax.data];

        }

    };

    /**
     * Options have higher priority, if object.url and options.url were provided, options.url will be returned
     * If no URL was provided, default will be returned
     * @param {IHelperObject} [object]
     * @param {IAjaxOptions} [options]
     * @return {IAjaxOptions}
     */
    Helper.prototype.loadRequest = function(object, options) {

        return Utils.extend(options || {}, {
            url: (options && options.url) || (object && this.getUri(object)) || this.createUrl(),
            method: (options && options.method) || 'GET'
        });

    };

    /**
     * Options have higher priority, if object.url and options.url were provided, options.url will be returned
     * If no URL was provided, default will be returned
     * @param {IHelperObject} object
     * @param {IAjaxOptions} [options]
     * @return {IAjaxOptions}
     */
    Helper.prototype.saveRequest = function(object, options) {

        if (!object && !(options && (options.post || options.body))) throw new Error('No Object');

        return Utils.extend(options || {}, {
            method: (options && options.method) || (this.isNew(object) ? 'POST' : 'PUT'),
            url: (options && options.url) || this.getUri(object) || this.createUrl(),
            body: (options && (options.body || options.post)) || object
        });

    };

    /**
     * Options have higher priority, if object.url and options.url were provided, options.url will be returned
     * If no URL was provided exception will be thrown
     * @param {IHelperObject} object
     * @param {IAjaxOptions} [options]
     * @return {IAjaxOptions}
     */
    Helper.prototype.deleteRequest = function(object, options) {

        options = options || {};

        if (!this.getUri(object) && !(options && options.url)) throw new Error('Object has to be not new or URL must be provided');

        return Utils.extend(options || {}, {
            method: (options && options.method) || 'DELETE',
            url: (options && options.url) || this.getUri(object)
        });

    };

    /**
     * If no url was provided, default SYNC url will be returned
     * @param {IAjaxOptions} [options]
     * @return {IAjaxOptions}
     */
    Helper.prototype.syncRequest = function(options) {

        options = options || {};

        options.url = options.url || this.createUrl({sync: true});
        options.query = options.query || options.get || {};

        if (!!options.query.syncToken) {
            options.query = {
                syncType: 'ISync',
                syncToken: options.get.syncToken
            };
        } else {
            options.query.syncType = 'FSync';
        }

        return options;

    };

    Helper.prototype.nextPageExists = function(data) {

        return (data && data.navigation && ('nextPage' in data.navigation));

    };

    /**
     * @param {IHelperObject[]} array - an array to be indexed
     * @param {function(object)} [getIdFn] - must return an ID for each array item
     * @param {boolean} [gather] - if true, then each index will have an array of items, that has same ID, otherwise the first indexed item wins
     * @returns {*}
     */
    Helper.prototype.index = function(array, getIdFn, gather) {

        getIdFn = getIdFn || this.getId.bind(this);
        array = array || [];

        return array.reduce(function(index, item) {

            var id = getIdFn(item);

            if (!id || (index[id] && !gather)) return index;

            if (gather) {
                if (!index[id]) index[id] = [];
                index[id].push(item);
            } else {
                index[id] = item;
            }

            return index;

        }, {});

    };

    /**
     * Returns a shallow copy of merged _target_ array plus _supplement_ array
     * @param {IHelperObject[]} target
     * @param {IHelperObject[]} supplement
     * @param {function(IHelperObject)} [getIdFn]
     * @param {boolean} [mergeItems] - if true, properties of _supplement_ item will be applied to _target_ item, otherwise _target_ item will be replaced
     * @returns {*}
     */
    Helper.prototype.merge = function(target, supplement, getIdFn, mergeItems) {

        getIdFn = getIdFn || this.getId.bind(this);
        target = target || [];
        supplement = supplement || [];

        var supplementIndex = this.index(supplement, getIdFn),
            updatedIDs = [];

        var result = target.map(function(item) {

            var id = getIdFn(item),
                newItem = supplementIndex[id];

            if (newItem) updatedIDs.push(id);

            return newItem ? (mergeItems ? Utils.extend(item, newItem) : newItem) : item;

        });

        supplement.forEach(function(item) {

            if (updatedIDs.indexOf(getIdFn(item)) == -1) result.push(item);

        });

        return result;

    };

    module.exports = {
        Class: Helper,
        /**
         * @param {Context} context
         * @returns {Helper}
         */
        $get: function(context) {
            return new Helper(context);
        }
    };

    /**
     * @typedef {object} IHelperObject
     * @property {string} id
     * @property {string} uri
     */

});
