/**
 * @description RingPlatform JS SDK
 * @copyright © 2014-2015 RingCentral, Inc. All rights reserved.
 */
define(function(require, exports, module) {

    'use strict';

    var Observable = require('./Observable').Class,
        Utils = require('./Utils'),
        Log = require('./Log'),
        boundarySeparator = '--',
        headerSeparator = ':',
        bodySeparator = '\n\n';

    /**
     * @typedef {Object} IAjaxOptions
     * @property {string} url
     * @property {string} method?
     * @property {boolean} async?
     * @property {Object} post?
     * @property {Object} headers?
     */

    /**
     * @constructor
     * @extends Observable
     * @alias RCSDK.core.Ajax
     * @param {Context} [context]
     */
    function Ajax(context) {
        Observable.call(this);
        /** @type {Ajax[]|object} */
        this.data = null;
        /** @type {Error|null} */
        this.error = null;
        this.response = '';
        this.headers = {};
        this.status = 0;
        /**
         * @type {IAjaxOptions}
         * @protected
         */
        this.options = {};
        this.context = context;
        this.observer = require('./AjaxObserver').$get(context);
        /** @type {XMLHttpRequest} */
        this.xhr = null;
    }

    Ajax.prototype = Object.create(Observable.prototype);
    Object.defineProperty(Ajax.prototype, 'constructor', {value: Ajax, enumerable: false});

    /**
     * @returns {IAjaxOptions}
     */
    Ajax.prototype.getOptions = function() {
        return this.options;
    };

    /**
     * @param {IAjaxOptions} [options]
     * @returns {Ajax}
     */
    Ajax.prototype.setOptions = function(options) {
        if (options) this.options = options;
        return this;
    };

    /**
     * @returns {string}
     */
    Ajax.prototype.getContentType = function() {
        return (this.headers['Content-Type'] || '');
    };

    Ajax.prototype.isMultipart = function() {
        return (this.getContentType().indexOf('multipart/mixed') > -1);
    };

    Ajax.prototype.isUnauthorized = function() {
        return (this.status == 401);
    };

    Ajax.prototype.isLoaded = function() {
        return !!this.status;
    };

    /**
     * Checks the send options, defaulting various of the options,
     * and consuming / transforming some of the options (like get).
     * @returns {Ajax}
     */
    Ajax.prototype.checkOptions = function() {

        if (!this.options.url) throw new Error('Url is not defined');

        var defaultHeaders = {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        };

        this.options.method = this.options.method ? this.options.method.toUpperCase() : 'GET';
        this.options.async = (this.options.async !== undefined) ? this.options.async : true;
        this.options.get = this.options.get || null;
        this.options.headers = Utils.extend(defaultHeaders, this.options.headers);
        this.options.post = this.options.post ? (
            (typeof this.options.post !== 'string' && this.options.headers['Content-Type'] === 'application/json')
                ? JSON.stringify(this.options.post)
                : this.options.post
        ) : '';
        this.options.url = this.options.url + (this.options.get ? ((this.options.url.indexOf('?') > -1 ? '&' : '?') + Utils.queryStringify(this.options.get)) : '');

        if (['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'].indexOf(this.options.method) < 0) throw new Error('Method has wrong value');

        delete this.options.get;

        return this;

    };

    /**
     * @returns {Promise}
     */
    Ajax.prototype.send = function() {

        this.observer.emit(this.observer.events.beforeRequest, this);

        return this.context.getPromise().resolve(this)
            .then(this.checkOptions.bind(this))
            .then(this.request.bind(this))
            .then(function(ajax) {

                ajax.parseResponse();
                if (ajax.error) throw ajax.error;
                return ajax;

            }.bind(this))
            .then(function(ajax) {

                this.observer.emit(this.observer.events.requestSuccess, ajax);

                return ajax;

            }.bind(this))
            .catch(function(e) {

                e.ajax = this;

                this.observer.emit(this.observer.events.requestError, e);

                throw e;

            }.bind(this));

    };

    Ajax.prototype.getXHR = function() {
        return this.context.getXHR();
    };

    /**
     * @returns {Promise}
     */
    Ajax.prototype.request = function() {

        return new (this.context.getPromise())(function(resolve, reject) {

            var options = this.options,
                xhr = this.getXHR();

            xhr.open(options.method, options.url, options.async);

            //@see http://stackoverflow.com/questions/19666809/cors-withcredentials-support-limited
            xhr.withCredentials = true;

            xhr.onload = function() {

                this.response = xhr.responseText;
                this.headers = {
                    //'RoutingKey': xhr.getResponseHeader('RoutingKey'),
                    //'Date': xhr.getResponseHeader('Date'),
                    'Content-Type': xhr.getResponseHeader('Content-Type')
                };

                this.status = xhr.status;

                resolve(this);

            }.bind(this);

            xhr.onerror = function(event) {
                reject(new Error('The request cannot be sent')); // CORS or network issue
            };

            Utils.forEach(options.headers, function(value, header) {
                xhr.setRequestHeader(header, value);
            });

            xhr.send(options.method === 'GET' ? null : options.post);

            this.xhr = xhr;

        }.bind(this));

    };

    Ajax.prototype.checkStatus = function(status) {
        return status.toString().substr(0, 1) == '2';
    };

    Ajax.prototype.parseResponse = function() {

        if (!this.isMultipart()) {

            try {

                if (typeof(this.response) == 'string' && this.getContentType().indexOf('application/json') != -1) {

                    this.data = JSON.parse(this.response);

                } else {

                    this.data = this.response; //TODO Add more parsers

                }

                if (!this.checkStatus(this.status)) this.error = new Error(this.data.message || this.data.error_description || this.data.description || 'Unknown error');

            } catch (e) { // Capture parse errors

                Log.error('Ajax.parseResponse(): Unable to parse data');
                Log.error(e.stack || e);
                Log.error(this.response);

                this.error = e;

            }

        } else {

            try {

                var boundary = this.getContentType().match(/boundary=([^;]+)/i)[1],
                    parts = this.response.split(boundarySeparator + boundary);

                if (parts[0].trim() == '') parts.shift();
                if (parts[parts.length - 1].trim() == boundarySeparator) parts.pop();

                // Step 1. Parse all parts into Ajax objects
                parts = parts.map(function(part) {

                    var subParts = part.trim().replace(/\r/g, '').split(bodySeparator),
                        ajaxPart = new Ajax(this.context);

                    ajaxPart.headers = (subParts.length > 1 ? subParts.shift() : '')
                        .split('\n')
                        .reduce(function(res, header) {

                            if (header.length == 0) return res;

                            var headerParts = header.split(headerSeparator),
                                name = headerParts.shift().trim();

                            res[name] = headerParts.join(headerSeparator).trim();

                            return res;

                        }, {});

                    ajaxPart.response = subParts.join(bodySeparator);

                    return ajaxPart;

                }, this);

                // Step 2. Claim first part as statuses, assign status from this and parse the response
                var statusInfo = parts.shift();
                statusInfo.status = this.status;
                statusInfo.parseResponse();

                // Steo 3. For the rest of parts assign status and parse the response
                this.data = parts.map(function(part, i) {

                    part.status = statusInfo.data.response[i].status;
                    part.parseResponse();

                    return part;

                }, this);

            } catch (e) {

                Log.error('Ajax.parseResponse(): Unable to parse batch response');
                Log.error(e.stack || e);
                Log.error(this.response);

                this.error = e;

            }

        }

        return this;

    };

    Ajax.prototype.destroy = function() {
        this.xhr && this.xhr.abort();
        return Observable.prototype.destroy.call(this);
    };

    module.exports = {
        Class: Ajax,
        /**
         * @static
         * @param {Context} context
         * @returns {Ajax}
         */
        $get: function(context) {
            return new Ajax(context);

        }
    };

});
