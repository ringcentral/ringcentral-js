/// <reference path="../../typings/tsd.d.ts" />
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var helper = require('../core/Helper');
var Language = (function (_super) {
    __extends(Language, _super);
    function Language() {
        _super.apply(this, arguments);
        this.languages = [
            {
                id: '1033',
                name: 'English (US)'
            },
            {
                id: '3084',
                name: 'French (Canada)'
            }
        ];
    }
    return Language;
})(helper.Helper);
exports.Language = Language;
function $get(context) {
    return context.createSingleton('Language', function () {
        return new Language(context);
    });
}
exports.$get = $get;
