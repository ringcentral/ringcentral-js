define(function(require, exports, module) {

    'use strict';

    var Headers = require('./Headers').Class,
        Utils = require('../Utils'),
        Log = require('../Log'),
        boundarySeparator = '--',
        headerSeparator = ':',
        bodySeparator = '\n\n';

    /**
     * @typedef {Object} IResponseOptions
     * @property {string} url
     * @property {string} method?
     * @property {boolean} async?
     * @property {Object} post?
     * @property {Object} get?
     * @property {Object} headers?
     */

    /**
     * @constructor
     * @extends Observable
     * @alias RCSDK.core.Response
     * @param {Context} [context]
     * @param {number} [status]
     * @param {string} [statusText]
     * @param {string} [body]
     * @param {object|string} [headers]
     */
    function Response(context, status, statusText, body, headers) {

        Headers.call(this);

        if (typeof(body) === 'string') {

            body = body.replace(/\r/g, '');

            if (!headers) {

                var tmp = body.split(bodySeparator);

                headers = (tmp.length > 1) ? tmp.shift() : {};
                body = tmp.join(bodySeparator);

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

        if (status == 1223) status = 204; //@see http://stackoverflow.com/questions/10046972/msie-returns-status-code-of-1223-for-ajax-request

        this.status = status;
        this.statusText = statusText;
        this.body = body;

        this.context = context;

        try {

            // Step 1. Parse headers

            if (typeof(headers) === 'string') {

                (headers || '')
                    .split('\n')
                    .forEach(/** @param {string} header */ function(header) {

                        if (!header) return;

                        /** @type {string[]} */
                        var parts = header.split(headerSeparator),
                            name = parts.shift().trim();

                        this.setHeader(name, parts.join(headerSeparator).trim());

                    }, this);

            } else {

                this.setHeaders(headers);

            }

            // Step 1.1. JEDI proxy sometimes may omit Content-Type header

            if (!this.hasHeader(Headers.contentType)) this.setHeader(Headers.contentType, Headers.jsonContentType);

            // Step 2. Parse body

            if (this.isJson() && !!this.body && typeof(this.body) === 'string') { // Handle 204 No Content -- response may be empty

                this.json = JSON.parse(this.body);
                this.data = this.json; // backwards compatibility

                if (!this.checkStatus()) this.error = new Error(this.getError());

            } else if (this.isMultipart()) { // Handle 207 Multi-Status

                // Step 2.1. Split multipart response

                var boundary = this.getContentType().match(/boundary=([^;]+)/i)[1],
                    parts = this.body.split(boundarySeparator + boundary);

                if (parts[0].trim() === '') parts.shift();
                if (parts[parts.length - 1].trim() == boundarySeparator) parts.pop();

                // Step 2.2. Parse status info

                var statusInfo = new Response(this.context, this.status, '', parts.shift());

                // Step 2.3. Parse all other parts

                this.responses = parts.map(function(part, i) {

                    var status = statusInfo.data.response[i].status;

                    return new Response(this.context, status, '', part);

                }, this);

                this.data = this.responses; // backwards compatibility

            } else { //TODO Add more parsers

                this.data = this.body;

            }

        } catch (e) { // Capture parse errors

            Log.error('Response.parseResponse(): Unable to parse data');
            Log.error(e.stack || e);
            Log.error(this.body);

            this.error = e;

        }

    }

    Response.prototype = Object.create(Headers.prototype);
    Object.defineProperty(Response.prototype, 'constructor', {value: Response, enumerable: false});

    /**
     * @returns {boolean}
     */
    Response.prototype.isUnauthorized = function() {
        return (this.status == 401);
    };

    Response.prototype.checkStatus = function() {
        return this.status >= 200 && this.status < 300;
    };

    Response.prototype.getError = function() {
        return this.data.message ||
               this.data.error_description ||
               this.data.description ||
               'Unknown error';
    };

    module.exports = {
        Class: Response,
        /**
         * @static
         * @param {Context} [context]
         * @param {number} [status]
         * @param {string} [statusText]
         * @param {string} [body]
         * @param {object|string} [headers]
         * @returns {Response}
         */
        $get: function(context, status, statusText, body, headers) {
            return new Response(context, status, statusText, body, headers);

        }
    };

});
