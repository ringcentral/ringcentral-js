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
    var h = require('./Headers');
    var ajaxObserver = require('../AjaxObserver');
    var r = require('./Response');
    /**
 * TODO @see https://github.com/github/fetch/blob/master/fetch.js
 */
    var Request = function (_super) {
        __extends(Request, _super);
        function Request(context) {
            _super.call(this, context);
            this.async = true;
            this.method = '';
            this.url = '';
            this.query = null;
            this.body = {};
            this.context = context;
            this.xhr = null;
            this.observer = ajaxObserver.$get(context);
        }
        Request.prototype.isLoaded = function () {
            return !!this.xhr;
        };
        //TODO Remove
        Request.prototype.setHeader = function (name, value) {
            _super.prototype.setHeader.call(this, name, value);
            return this;
        };
        //TODO Remove
        Request.prototype.setHeaders = function (headers) {
            _super.prototype.setHeaders.call(this, headers);
            return this;
        };
        Request.prototype.setOptions = function (options) {
            options = options || {};
            // backwards compatibility
            if (!('body' in options) && options.post)
                options.body = options.post;
            if (!('query' in options) && options.get)
                options.query = options.get;
            if ('method' in options)
                this.method = options.method;
            if ('url' in options)
                this.url = options.url;
            if ('query' in options)
                this.query = options.query;
            if ('body' in options)
                this.body = options.body;
            if ('headers' in options)
                this.setHeaders(options.headers);
            if ('async' in options)
                this.async = !!options.async;
            return this;
        };
        /**
     * Checks the send options, defaulting various of the options,
     * and consuming / transforming some of the options (like get).
     */
        Request.prototype.checkOptions = function () {
            if (!this.url)
                throw new Error('Url is not defined');
            if (!this.hasHeader('Accept'))
                this.setHeader('Accept', h.Headers.jsonContentType);
            if (!this.hasHeader('Content-Type'))
                this.setHeader('Content-Type', h.Headers.jsonContentType);
            this.method = this.method ? this.method.toUpperCase() : 'GET';
            if ([
                    'GET',
                    'POST',
                    'PUT',
                    'DELETE',
                    'PATCH',
                    'OPTIONS',
                    'HEAD'
                ].indexOf(this.method) < 0)
                throw new Error('Method has wrong value');
            return this;
        };
        Request.prototype.getEncodedBody = function () {
            if (this.method === 'GET')
                return null;
            if (typeof this.body === 'string') {
                return this.body;
            } else if (this.isJson()) {
                return JSON.stringify(this.body);
            } else if (this.isUrlEncoded()) {
                return this.utils.queryStringify(this.body);
            } else {
                return this.body;
            }
        };
        Request.prototype.send = function () {
            var _this = this;
            this.observer.emit(this.observer.events.beforeRequest, this);
            var responsePromise = new (this.context.getPromise())(function (resolve, reject) {
                _this.checkOptions();
                var xhr = _this.getXHR(), url = _this.url + (!!_this.query ? (_this.url.indexOf('?') > -1 ? '&' : '?') + _this.utils.queryStringify(_this.query) : '');
                xhr.open(_this.method, url, _this.async);
                //@see http://stackoverflow.com/questions/19666809/cors-withcredentials-support-limited
                xhr.withCredentials = true;
                xhr.onload = function () {
                    //TODO http://jira.ringcentral.com/browse/PLA-10585
                    var response = r.$get(_this.context, xhr.status, xhr.statusText, xhr.responseText, xhr.getAllResponseHeaders());
                    if (response.error) {
                        var e = response.error;
                        e.ajax = response;
                        // backwards compatibility
                        e.response = response;
                        //FIXME Circular
                        e.request = _this;
                        reject(e);
                    } else {
                        resolve(response);
                    }
                };
                xhr.onerror = function (event) {
                    var e = new Error('The request cannot be sent' + (event ? ' (' + event.toString() + ')' : ''));
                    e.request = _this;
                    e.response = null;
                    e.ajax = null;
                    // backwards compatibility
                    reject(e);
                };
                _this.utils.forEach(_this.headers, function (value, header) {
                    if (!!value)
                        xhr.setRequestHeader(header, value);
                });
                xhr.send(_this.getEncodedBody());
                _this.xhr = xhr;
            });
            return responsePromise.then(function (response) {
                _this.observer.emit(_this.observer.events.requestSuccess, response, _this);
                return response;
            }).catch(function (e) {
                _this.observer.emit(_this.observer.events.requestError, e);
                throw e;
            });
        };
        Request.prototype.getXHR = function () {
            return this.context.getXHR();
        };
        Request.prototype.destroy = function () {
            if (this.xhr)
                this.xhr.abort();
        };
        return Request;
    }(h.Headers);
    exports.Request = Request;
    function $get(context) {
        return new Request(context);
    }
    exports.$get = $get;
});