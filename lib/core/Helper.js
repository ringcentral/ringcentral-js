var define = typeof define === 'function' && define.amd ? define : function (factory) {
    factory(require, exports, module);
};
define(function (require, exports, module) {
    var utils = require('./Utils');
    var Helper = function () {
        function Helper(context) {
            this.defaultProperty = 'id';
            this.context = context;
            this.utils = utils.$get(context);
        }
        Helper.prototype.getContext = function () {
            return this.context;
        };
        Helper.prototype.createUrl = function (options, id) {
            return '';
        };
        Helper.prototype.getId = function (object) {
            return object && object[this.defaultProperty];
        };
        Helper.prototype.isNew = function (object) {
            return !this.getId(object) || !this.getUri(object);
        };
        Helper.prototype.resetAsNew = function (object) {
            if (object) {
                delete object.id;
                delete object.uri;
            }
            return object;
        };
        Helper.prototype.getUri = function (object) {
            return object && object.uri;
        };
        Helper.prototype.parseMultipartResponse = function (ajax) {
            if (ajax.isMultipart()) {
                // ajax.data has full array, leave only successful
                return ajax.data.filter(function (result) {
                    return !result.error;
                }).map(function (result) {
                    return result.data;
                });
            } else {
                return [ajax.data];
            }
        };
        /**
     * Options have higher priority, if object.url and options.url were provided, options.url will be returned
     * If no URL was provided, default will be returned
     */
        Helper.prototype.loadRequest = function (object, options) {
            return this.utils.extend(options || {}, {
                url: options && options.url || object && this.getUri(object) || this.createUrl(),
                method: options && options.method || 'GET'
            });
        };
        /**
     * Options have higher priority, if object.url and options.url were provided, options.url will be returned
     * If no URL was provided, default will be returned
     */
        Helper.prototype.saveRequest = function (object, options) {
            if (!object && !(options && (options.post || options.body)))
                throw new Error('No Object');
            return this.utils.extend(options || {}, {
                method: options && options.method || (this.isNew(object) ? 'POST' : 'PUT'),
                url: options && options.url || this.getUri(object) || this.createUrl(),
                body: options && (options.body || options.post) || object
            });
        };
        /**
     * Options have higher priority, if object.url and options.url were provided, options.url will be returned
     * If no URL was provided exception will be thrown
     */
        Helper.prototype.deleteRequest = function (object, options) {
            options = options || {};
            if (!this.getUri(object) && !(options && options.url))
                throw new Error('Object has to be not new or URL must be provided');
            return this.utils.extend(options || {}, {
                method: options && options.method || 'DELETE',
                url: options && options.url || this.getUri(object)
            });
        };
        /**
     * If no url was provided, default SYNC url will be returned
     */
        Helper.prototype.syncRequest = function (options) {
            options = options || {};
            options.url = options.url || this.createUrl({ sync: true });
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
        Helper.prototype.nextPageExists = function (data) {
            return data && data.navigation && 'nextPage' in data.navigation;
        };
        /**
     * array - an array to be indexed
     * getIdFn - must return an ID for each array item
     * gather - if true, then each index will have an array of items, that has same ID, otherwise the first indexed
     * item wins
     */
        Helper.prototype.index = function (array, getIdFn, gather) {
            getIdFn = getIdFn || this.getId.bind(this);
            array = array || [];
            return array.reduce(function (index, item) {
                var id = getIdFn(item);
                if (!id || index[id] && !gather)
                    return index;
                if (gather) {
                    if (!index[id])
                        index[id] = [];
                    index[id].push(item);
                } else {
                    index[id] = item;
                }
                return index;
            }, {});
        };
        /**
     * Returns a shallow copy of merged _target_ array plus _supplement_ array
     * mergeItems
     * - if true, properties of _supplement_ item will be applied to _target_ item,
     * - otherwise _target_ item will be replaced
     */
        Helper.prototype.merge = function (target, supplement, getIdFn, mergeItems) {
            var _this = this;
            getIdFn = getIdFn || this.getId.bind(this);
            target = target || [];
            supplement = supplement || [];
            var supplementIndex = this.index(supplement, getIdFn), updatedIDs = [], result = target.map(function (item) {
                    var id = getIdFn(item), newItem = supplementIndex[id];
                    if (newItem)
                        updatedIDs.push(id);
                    return newItem ? mergeItems ? _this.utils.extend(item, newItem) : newItem : item;
                });
            supplement.forEach(function (item) {
                if (updatedIDs.indexOf(getIdFn(item)) == -1)
                    result.push(item);
            });
            return result;
        };
        return Helper;
    }();
    exports.Helper = Helper;
    function $get(context) {
        return new Helper(context);
    }
    exports.$get = $get;
});