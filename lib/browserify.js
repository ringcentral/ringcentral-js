/**
 * Browserify/Webpack version
 */
define(function(require, exports, module) {

    'use strict';

    require('crypto-js/aes');
    require('crypto-js/sha256');
    require('crypto-js/mode-ecb');

    var promise = require('es6-promise'),
        CryptoJS = require('crypto-js/core');

    // Exports

    module.exports = require('./RCSDK')({
        CryptoJS: CryptoJS,
        localStorage: window.localStorage,
        Promise: (promise && 'Promise' in promise) ? promise.Promise : window.Promise,
        PUBNUB: require('pubnub'),
        XHR: window.XMLHttpRequest
    });

});