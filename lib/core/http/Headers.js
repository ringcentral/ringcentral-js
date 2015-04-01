/// <reference path="../../../typings/tsd.d.ts" />
var utils = require('../Utils');
var Headers = (function () {
    function Headers(context) {
        this.headers = {};
        this.context = context;
        this.utils = utils.$get(context);
    }
    Headers.prototype.setHeader = function (name, value) {
        this.headers[name.toLowerCase()] = value;
        return this;
    };
    Headers.prototype.getHeader = function (name) {
        return this.headers[name.toLowerCase()];
    };
    Headers.prototype.hasHeader = function (name) {
        return (name.toLowerCase() in this.headers);
    };
    Headers.prototype.setHeaders = function (headers) {
        var _this = this;
        this.utils.forEach(headers, function (value, name) {
            _this.setHeader(name, value);
        });
        return this;
    };
    Headers.prototype.isContentType = function (contentType) {
        return this.getContentType().indexOf(contentType) > -1;
    };
    Headers.prototype.getContentType = function () {
        return this.getHeader(Headers.contentType) || '';
    };
    Headers.prototype.isMultipart = function () {
        return this.isContentType(Headers.multipartContentType);
    };
    Headers.prototype.isUrlEncoded = function () {
        return this.isContentType(Headers.urlencodedContentType);
    };
    Headers.prototype.isJson = function () {
        return this.isContentType(Headers.jsonContentType);
    };
    Headers.contentType = 'Content-Type';
    Headers.jsonContentType = 'application/json';
    Headers.multipartContentType = 'multipart/mixed';
    Headers.urlencodedContentType = 'application/x-www-form-urlencoded';
    return Headers;
})();
exports.Headers = Headers;
