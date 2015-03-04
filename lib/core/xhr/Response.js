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
     * @param {Request} [request]
     * @param {number} [status]
     * @param {string} [body]
     * @param {object|string} [headers]
     */
    function Response(context, request, status, body, headers) {

        Headers.call(this);

        if (typeof(body) === 'string') {

            body = body.replace(/\r/g, '');

            if (!headers) {

                var tmp = body.split(bodySeparator);

                headers = (tmp.length > 1) ? tmp.shift() : {};
                body = tmp.join(bodySeparator);

            }

        }

        this.request = request;

        /** @type {Response[]|object} */
        this.data = null;

        /** @type {Error|null} */
        this.error = null;

        this.status = status;
        this.body = body;
        this.headers = {};

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

            // Step 2. Parse body

            if (this.isJson() && !!this.body && typeof(this.body) === 'string') { // Handle 204 No Content -- response may be empty

                this.data = JSON.parse(this.body);

                if (!this.checkStatus()) this.error = new Error(this.data.message || this.data.error_description || this.data.description || 'Unknown error');

            } else if (this.isMultipart()) {

                // Step 2.1. Split multipart response

                var boundary = this.getContentType().match(/boundary=([^;]+)/i)[1],
                    parts = this.body.split(boundarySeparator + boundary);

                if (parts[0].trim() === '') parts.shift();
                if (parts[parts.length - 1].trim() == boundarySeparator) parts.pop();

                // Step 2.2. Parse status info

                var statusInfo = new Response(this.context, null, this.status, parts.shift());

                // Step 2.3. Parse all other parts

                this.data = parts.map(function(part, i) {

                    var status = statusInfo.data.response[i].status;

                    return new Response(this.context, null, status, part);

                }, this);

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
        return this.status.toString().substr(0, 1) == '2';
    };

    module.exports = {
        Class: Response,
        /**
         * @static
         * @param {Context} [context]
         * @param {Request} [request]
         * @param {number} [status]
         * @param {string} [body]
         * @param {object|string} [headers]
         * @returns {Response}
         */
        $get: function(context, request, status, body, headers) {
            return new Response(context, request, status, body, headers);

        }
    };

});
