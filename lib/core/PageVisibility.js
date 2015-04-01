/// <reference path="../../typings/tsd.d.ts" />
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var observable = require('./Observable');
var PageVisibility = (function (_super) {
    __extends(PageVisibility, _super);
    function PageVisibility(context) {
        var _this = this;
        _super.call(this, context);
        this.events = {
            change: 'change'
        };
        var hidden = "hidden", onchange = function (evt) {
            evt = evt || window.event;
            var v = 'visible', h = 'hidden', evtMap = {
                focus: v,
                focusin: v,
                pageshow: v,
                blur: h,
                focusout: h,
                pagehide: h
            };
            _this.visible = (evt.type in evtMap) ? evtMap[evt.type] == v : !document[hidden];
            _this.emit(_this.events.change, _this.visible);
        };
        this.visible = true;
        if (typeof document == 'undefined' || typeof window == 'undefined')
            return;
        // Standards:
        if (hidden in document)
            document.addEventListener("visibilitychange", onchange);
        else if ((hidden = "mozHidden") in document)
            document.addEventListener("mozvisibilitychange", onchange);
        else if ((hidden = "webkitHidden") in document)
            document.addEventListener("webkitvisibilitychange", onchange);
        else if ((hidden = "msHidden") in document)
            document.addEventListener("msvisibilitychange", onchange);
        else if ('onfocusin' in document)
            document.onfocusin = document.onfocusout = onchange;
        else
            window.onpageshow = window.onpagehide = window.onfocus = window.onblur = onchange;
    }
    PageVisibility.prototype.isVisible = function () {
        return this.visible;
    };
    return PageVisibility;
})(observable.Observable);
exports.PageVisibility = PageVisibility;
function $get(context) {
    return new PageVisibility(context);
}
exports.$get = $get;
