/**
 * NodeJS version
 */
(function() {

    'use strict';

    // Exports

    module.exports = require('requirejs').config({baseUrl: __dirname, nodeRequire: require})('./RCSDK')({
        CryptoJS: require('crypto-js'),
        localStorage: require('dom-storage'),
        Promise: require('es6-promise').Promise,
        PUBNUB: require('pubnub'),
        XHR: require('xhr2')
    });

})();