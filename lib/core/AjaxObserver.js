var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var observable = require('./Observable');
var AjaxObserver = (function (_super) {
    __extends(AjaxObserver, _super);
    function AjaxObserver() {
        _super.apply(this, arguments);
        this.events = {
            beforeRequest: 'beforeRequest',
            requestSuccess: 'requestSuccess',
            requestError: 'requestError' // means that request failed completely
        };
    }
    return AjaxObserver;
})(observable.Observable);
exports.AjaxObserver = AjaxObserver;
function $get(context) {
    return context.createSingleton('AjaxObserver', function () {
        return new AjaxObserver(context);
    });
}
exports.$get = $get;
