var utils = require('../Utils');
var log = require('../Log');
var xhrResponse = require('./XhrResponse');
var XhrMock = (function () {
    function XhrMock(context) {
        // Service
        this.context = context;
        this.responses = xhrResponse.$get(context);
        this.log = log.$get(context);
        this.utils = utils.$get(context);
        // Request
        this.async = true;
        this.method = '';
        this.url = '';
        this.requestHeaders = {};
        this.withCredentials = false;
        // Response
        this.data = null;
        this.readyState = 0;
        this.responseHeaders = {};
        this.status = 0;
    }
    XhrMock.prototype.getResponseHeader = function (header) {
        return this.responseHeaders[header.toLowerCase()];
    };
    XhrMock.prototype.setRequestHeader = function (header, value) {
        this.requestHeaders[header.toLowerCase()] = value;
    };
    XhrMock.prototype.getAllResponseHeaders = function () {
        var res = [];
        this.utils.forEach(this.responseHeaders, function (value, name) {
            res.push(name + ':' + value);
        });
        return res.join('\n');
    };
    XhrMock.prototype.open = function (method, url, async) {
        this.method = method;
        this.url = url;
        this.async = async;
    };
    XhrMock.prototype.send = function (data) {
        var _this = this;
        var contentType = this.getRequestHeader('Content-Type');
        this.data = data;
        if (this.data && typeof this.data == 'string') {
            // For convenience encoded post data will be decoded
            if (contentType == 'application/json')
                this.data = JSON.parse(this.data);
            if (contentType == 'application/x-www-form-urlencoded')
                this.data = this.utils.parseQueryString(this.data);
        }
        this.log.debug('API REQUEST', this.method, this.url);
        var currentResponse = this.responses.find(this);
        if (!currentResponse) {
            setTimeout(function () {
                if (_this.onerror)
                    _this.onerror(new Error('Unknown request: ' + _this.url));
            }, 1);
            return;
        }
        this.setStatus(200);
        this.setResponseHeader('Content-Type', 'application/json');
        var res = currentResponse.response(this), Promise = this.context.getPromise(), onLoad = function (res) {
            if (_this.getResponseHeader('Content-Type') == 'application/json')
                res = JSON.stringify(res);
            _this.responseText = res;
            setTimeout(function () {
                if (_this.onload)
                    _this.onload();
            }, 1);
        };
        if (res instanceof Promise) {
            res.then(onLoad.bind(this)).catch(this.onerror.bind(this));
        }
        else
            onLoad(res);
    };
    XhrMock.prototype.abort = function () {
        this.log.debug('XhrMock.destroy(): Aborted');
    };
    XhrMock.prototype.getRequestHeader = function (header) {
        return this.requestHeaders[header.toLowerCase()];
    };
    XhrMock.prototype.setResponseHeader = function (header, value) {
        this.responseHeaders[header.toLowerCase()] = value;
    };
    XhrMock.prototype.setStatus = function (status) {
        this.status = status;
        return this;
    };
    return XhrMock;
})();
exports.XhrMock = XhrMock;
function $get(context) {
    return new XhrMock(context);
}
exports.$get = $get;
