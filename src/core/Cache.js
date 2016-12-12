/**
 * @param {Externals} options.externals
 * @param {string} [options.prefix]
 * @property {Externals} _externals
 */
function Cache(options) {

    /** @private */
    this._prefix = options.prefix || Cache.defaultPrefix;

    /** @private */
    this._externals = options.externals;

}

Cache.defaultPrefix = 'rc-';

Cache.prototype.setItem = function(key, data) {
    this._externals.localStorage[this._prefixKey(key)] = JSON.stringify(data);
    return this;
};

Cache.prototype.removeItem = function(key) {
    delete this._externals.localStorage[this._prefixKey(key)];
    return this;
};

Cache.prototype.getItem = function(key) {
    var item = this._externals.localStorage[this._prefixKey(key)];
    if (!item) return null;
    return JSON.parse(item);
};

Cache.prototype.clean = function() {

    for (var key in this._externals.localStorage) {

        if (!this._externals.localStorage.hasOwnProperty(key)) continue;

        if (key.indexOf(this._prefix) === 0) {
            delete this._externals.localStorage[key];
        }

    }

    return this;

};

Cache.prototype._prefixKey = function(key) {
    return this._prefix + key;
};

module.exports = Cache;