/**
 * Browser-compatible version
 */
define(function(require, exports, module) {

    'use strict';

    var promise = require('es6-promise');

    module.exports = require('./RCSDK')({
        CryptoJS: require('crypto-js'),
        localStorage: window.localStorage,
        Promise: (promise && 'Promise' in promise) ? promise.Promise : window.Promise,
        PUBNUB: require('pubnub'),
        XHR: window.XMLHttpRequest
    });

});
