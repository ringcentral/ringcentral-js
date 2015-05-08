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
    var log = require('../Log');
    var Response = function (_super) {
        __extends(Response, _super);
        function Response(context, status, statusText, body, headers) {
            var _this = this;
            _super.call(this, context);
            this.log = log.$get(context);
            if (typeof body === 'string') {
                body = body.replace(/\r/g, '');
                if (!headers) {
                    var tmp = body.split(Response.bodySeparator);
                    headers = tmp.length > 1 ? tmp.shift() : {};
                    body = tmp.join(Response.bodySeparator);
                }
            }
            /** @type {Response[]|object} */
            this.data = null;
            /** @type {object} */
            this.json = null;
            /** @type {Response[]} */
            this.responses = [];
            /** @type {Error} */
            this.error = null;
            //@see http://stackoverflow.com/questions/10046972/msie-returns-status-code-of-1223-for-ajax-request
            if (status == 1223)
                status = 204;
            this.status = status;
            this.statusText = statusText;
            this.body = body;
            try {
                // Step 1. Parse headers
                if (typeof headers === 'string') {
                    (headers || '').split('\n').forEach(function (header) {
                        if (!header)
                            return;
                        var parts = header.split(Response.headerSeparator), name = parts.shift().trim();
                        _this.setHeader(name, parts.join(Response.headerSeparator).trim());
                    });
                } else {
                    this.setHeaders(headers);
                }
                // Step 1.1. JEDI proxy sometimes may omit Content-Type header
                if (!this.hasHeader(h.Headers.contentType))
                    this.setHeader(h.Headers.contentType, h.Headers.jsonContentType);
                // Step 2. Parse body
                if (this.isJson() && !!this.body && typeof this.body === 'string') {
                    this.json = JSON.parse(this.body);
                    this.data = this.json;
                    // backwards compatibility
                    if (!this.checkStatus())
                        this.error = new Error(this.getError());
                } else if (this.isMultipart()) {
                    // Step 2.1. Split multipart response
                    var boundary = this.getContentType().match(/boundary=([^;]+)/i)[1], parts = this.body.split(Response.boundarySeparator + boundary);
                    if (parts[0].trim() === '')
                        parts.shift();
                    if (parts[parts.length - 1].trim() == Response.boundarySeparator)
                        parts.pop();
                    // Step 2.2. Parse status info
                    var statusInfo = new Response(this.context, this.status, '', parts.shift());
                    // Step 2.3. Parse all other parts
                    this.responses = parts.map(function (part, i) {
                        var status = statusInfo.data.response[i].status;
                        return new Response(_this.context, status, '', part);
                    });
                    this.data = this.responses;    // backwards compatibility
                } else {
                    this.data = this.body;
                }
            } catch (e) {
                this.log.error('Response.parseResponse(): Unable to parse data');
                this.log.error(e.stack || e);
                this.log.error(this.body);
                this.error = e;
            }
        }
        /**
     * @returns {boolean}
     */
        Response.prototype.isUnauthorized = function () {
            return this.status == 401;
        };
        Response.prototype.checkStatus = function () {
            return this.status >= 200 && this.status < 300;
        };
        Response.prototype.getError = function () {
            return this.data.message || this.data.error_description || this.data.description || 'Unknown error';
        };
        Response.boundarySeparator = '--';
        Response.headerSeparator = ':';
        Response.bodySeparator = '\n\n';
        return Response;
    }(h.Headers);
    exports.Response = Response;
    function $get(context, status, statusText, body, headers) {
        return new Response(context, status, statusText, body, headers);
    }
    exports.$get = $get;
});