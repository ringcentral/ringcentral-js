define(function(require, exports, module) {

    'use strict';

    var Headers = require('./Headers').Class,
        Response = require('./Response'),
        Utils = require('../Utils'),
        Log = require('../Log');

    /**
     * @typedef {Object} IAjaxOptions
     * @property {string} url
     * @property {string} method?
     * @property {boolean} async?
     * @property {Object} body?
     * @property {Object} query?
     * @property {Object} headers?
     * @property {Object} post? // @deprecated
     * @property {Object} get? // @deprecated
     */

    /**
     * TODO @see https://github.com/github/fetch/blob/master/fetch.js
     * @constructor
     * @extends Observable
     * @alias RCSDK.core.Request
     * @param {Context} [context]
     */
    function Request(context) {
        Headers.call(this);
        this.async = true;
        this.method = '';
        this.url = '';
        this.query = null;
        this.body = {};
        this.context = context;
        /** @type {XMLHttpRequest} */
        this.xhr = null;
        /** @type {AjaxObserver} */
        this.observer = require('../AjaxObserver').$get(context);
    }

    Request.prototype = Object.create(Headers.prototype);
    Object.defineProperty(Request.prototype, 'constructor', {value: Request, enumerable: false});

    /**
     * @returns {boolean}
     */
    Request.prototype.isLoaded = function() {
        return !!this.xhr;
    };

    /**
     * @param {IAjaxOptions} [options]
     * @returns {Request}
     */
    Request.prototype.setOptions = function(options) {

        options = options || {};

        // backwards compatibility
        if (!('body' in options) && options.post) options.body = options.post;
        if (!('query' in options) && options.get) options.query = options.get;

        if ('method' in options) this.method = options.method;
        if ('url' in options) this.url = options.url;
        if ('query' in options) this.query = options.query;
        if ('body' in options) this.body = options.body;
        if ('headers' in options) this.setHeaders(options.headers);
        if ('async' in options) this.async = !!options.async;

        return this;

    };

    /**
     * Checks the send options, defaulting various of the options,
     * and consuming / transforming some of the options (like get).
     * @returns {Request}
     */
    Request.prototype.checkOptions = function() {

        if (!this.url) throw new Error('Url is not defined');

        if (!this.hasHeader('Accept')) this.setHeader('Accept', Headers.jsonContentType);
        if (!this.hasHeader('Content-Type')) this.setHeader('Content-Type', Headers.jsonContentType);

        this.method = this.method ? this.method.toUpperCase() : 'GET';

        if (['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS', 'HEAD'].indexOf(this.method) < 0) throw new Error('Method has wrong value');

        return this;

    };

    Request.prototype.getEncodedBody = function() {

        if (this.method === 'GET') return null;

        if (typeof this.body === 'string') {
            return this.body;
        } else if (this.isJson()) {
            return JSON.stringify(this.body);
        } else if (this.isUrlEncoded()) {
            return Utils.queryStringify(this.body);
        } else {
            return this.body;
        }

    };

    /**
     * @returns {Promise}
     */
    Request.prototype.send = function() {

        this.observer.emit(this.observer.events.beforeRequest, this);

        var responsePromise = new (this.context.getPromise())(function(resolve, reject) {

            this.checkOptions();

            var xhr = this.getXHR(),
                url = this.url + (!!this.query ? ((this.url.indexOf('?') > -1 ? '&' : '?') + Utils.queryStringify(this.query)) : '');

            xhr.open(this.method, url, this.async);

            //@see http://stackoverflow.com/questions/19666809/cors-withcredentials-support-limited
            xhr.withCredentials = true;

            xhr.onload = function() {

                //TODO http://jira.ringcentral.com/browse/PLA-10585
                var response = Response
                    .$get(this.context, xhr.status, xhr.statusText, xhr.responseText, xhr.getAllResponseHeaders());

                if (response.error) {
                    var e = response.error;
                    e.ajax = response; // backwards compatibility
                    e.response = response; //FIXME Circular
                    e.request = this;
                    reject(e);
                } else {
                    resolve(response);
                }

            }.bind(this);

            xhr.onerror = function(event) { // CORS or network issue
                var e = new Error('The request cannot be sent');
                e.request = this;
                e.response = null;
                e.ajax = null; // backwards compatibility
                reject(e);
            }.bind(this);

            Utils.forEach(this.headers, function(value, header) {
                if (!!value) xhr.setRequestHeader(header, value);
            });

            xhr.send(this.getEncodedBody());

            this.xhr = xhr;

        }.bind(this));

        return responsePromise
            .then(function(response) {

                this.observer.emit(this.observer.events.requestSuccess, response, this);

                return response;

            }.bind(this))
            .catch(function(e) {

                this.observer.emit(this.observer.events.requestError, e);

                throw e;

            }.bind(this));

    };

    /**
     * @returns {XMLHttpRequest}
     */
    Request.prototype.getXHR = function() {
        return this.context.getXHR();
    };

    Request.prototype.destroy = function() {
        if (this.xhr) this.xhr.abort();
    };

    module.exports = {
        Class: Request,
        /**
         * @static
         * @param {Context} context
         * @returns {Request}
         */
        $get: function(context) {
            return new Request(context);

        }
    };

});
