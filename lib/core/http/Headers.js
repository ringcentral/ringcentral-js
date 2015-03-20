define(function(require, exports, module) {

    'use strict';

    var Utils = require('../Utils');

    /**
     * @constructor
     * @alias RCSDK.core.Headers
     */
    function Headers() {
        /** @private */
        this.headers = {};
    }

    Object.defineProperty(Headers.prototype, 'constructor', {value: Headers, enumerable: false});

    Headers.contentType = 'Content-Type';
    Headers.jsonContentType = 'application/json';
    Headers.multipartContentType = 'multipart/mixed';
    Headers.urlencodedContentType = 'application/x-www-form-urlencoded';

    /**
     * @param {string} name
     * @param {string} value
     * @returns {Headers}
     */
    Headers.prototype.setHeader = function(name, value) {

        this.headers[name.toLowerCase()] = value;

        return this;

    };

    /**
     * @param {string} name
     * @returns {string}
     */
    Headers.prototype.getHeader = function(name) {

        return this.headers[name.toLowerCase()];

    };

    /**
     * @param {string} name
     * @returns {boolean}
     */
    Headers.prototype.hasHeader = function(name) {

        return (name.toLowerCase() in this.headers);

    };

    /**
     * @param {object} headers
     * @returns {Headers}
     */
    Headers.prototype.setHeaders = function(headers) {

        Utils.forEach(headers, function(value, name) {
            this.setHeader(name, value);
        }.bind(this));

        return this;

    };

    /**
     * @param {string} type
     * @returns {boolean}
     */
    Headers.prototype.isContentType = function(type) {
        return this.getContentType().indexOf(type) > -1;
    };

    /**
     * @returns {string}
     */
    Headers.prototype.getContentType = function() {
        return this.getHeader(Headers.contentType) || '';
    };

    /**
     * @returns {boolean}
     */
    Headers.prototype.isMultipart = function() {
        return this.isContentType(Headers.multipartContentType);
    };

    /**
     * @returns {boolean}
     */
    Headers.prototype.isUrlEncoded = function() {
        return this.isContentType(Headers.urlencodedContentType);
    };

    /**
     * @returns {boolean}
     */
    Headers.prototype.isJson = function() {
        return this.isContentType(Headers.jsonContentType);
    };

    module.exports = {
        Class: Headers
    };

});
