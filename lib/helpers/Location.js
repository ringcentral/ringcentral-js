var define = typeof define === 'function' && define.amd ? define : function (factory) {
    factory(require, exports, module);
};
define(function (require, exports, module) {
    var __extends = this.__extends || function (d, b) {
        for (var p in b)
            if (b.hasOwnProperty(p))
                d[p] = b[p];
        function __() {
            this.constructor = d;
        }
        __.prototype = b.prototype;
        d.prototype = new __();
    };
    var helper = require('../core/Helper');
    var list = require('../core/List');
    var state = require('./State');
    var Location = function (_super) {
        __extends(Location, _super);
        function Location(context) {
            _super.call(this, context);
            this.list = list.$get(context);
            this.state = state.$get(context);
        }
        Location.prototype.createUrl = function () {
            return '/dictionary/location';
        };
        Location.prototype.filter = function (options) {
            var _this = this;
            var uniqueNPAs = [];
            options = this.utils.extend({
                stateId: '',
                onlyUniqueNPA: false
            }, options);
            return this.list.filter([
                {
                    condition: options.stateId,
                    filterFn: function (item, opts) {
                        return _this.state.getId(item.state) == opts.condition;
                    }
                },
                {
                    condition: options.onlyUniqueNPA,
                    filterFn: function (item, opts) {
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
        Location.prototype.comparator = function (options) {
            options = this.utils.extend({ sortBy: 'npa' }, options);
            if (options.sortBy == 'nxx') {
                options.extractFn = function (item) {
                    return parseInt(item.npa) * 1000000 + parseInt(item.nxx);
                };
                options.compareFn = this.list.numberComparator;
            }
            return this.list.comparator(options);
        };
        return Location;
    }(helper.Helper);
    exports.Location = Location;
    function $get(context) {
        return context.createSingleton('Location', function () {
            return new Location(context);
        });
    }
    exports.$get = $get;
});