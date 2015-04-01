/// <reference path="../../typings/tsd.d.ts" />
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var helper = require('../core/Helper');
var list = require('../core/List');
var country = require('./Country');
var State = (function (_super) {
    __extends(State, _super);
    function State(context) {
        _super.call(this, context);
        this.countryHelper = country.$get(context);
        this.list = list.$get(context);
    }
    State.prototype.createUrl = function () {
        return '/dictionary/state';
    };
    State.prototype.filter = function (options) {
        var _this = this;
        options = this.utils.extend({
            countryId: ''
        }, options);
        return this.list.filter([
            {
                condition: options.countryId,
                filterFn: function (item, opts) {
                    return (_this.countryHelper.getId(item.country) == opts.condition);
                }
            }
        ]);
    };
    return State;
})(helper.Helper);
exports.State = State;
function $get(context) {
    return context.createSingleton('State', function () {
        return new State(context);
    });
}
exports.$get = $get;
