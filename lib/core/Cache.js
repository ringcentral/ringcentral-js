var define = typeof define === 'function' && define.amd ? define : function (factory) {
    factory(require, exports, module);
};
define(function (require, exports, module) {
    var Cache = function () {
        function Cache(context) {
            this.setPrefix();
            this.context = context;
            this.storage = context.getLocalStorage();    // storage must be defined from outside
        }
        Cache.prototype.setPrefix = function (prefix) {
            this.prefix = prefix || 'rc-';
            return this;
        };
        Cache.prototype.prefixKey = function (key) {
            return this.prefix + key;
        };
        Cache.prototype.setItem = function (key, data) {
            this.storage.setItem(this.prefixKey(key), JSON.stringify(data));
            return this;
        };
        Cache.prototype.removeItem = function (key) {
            this.storage.removeItem(this.prefixKey(key));
            return this;
        };
        Cache.prototype.getItem = function (key) {
            var item = this.storage.getItem(this.prefixKey(key));
            if (!item)
                return null;
            return JSON.parse(item);
        };
        Cache.prototype.clean = function () {
            for (var key in this.storage) {
                if (!this.storage.hasOwnProperty(key))
                    continue;
                if (key.indexOf(this.prefix) === 0) {
                    this.storage.removeItem(key);
                    delete this.storage[key];
                }
            }
            return this;
        };
        return Cache;
    }();
    exports.Cache = Cache;
    function $get(context) {
        return context.createSingleton('Cache', function () {
            return new Cache(context);
        });
    }
    exports.$get = $get;
});