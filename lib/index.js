/**
 * NodeJS version
 */
(function() {

    'use strict';

    var requirejs = require('requirejs').config({
        baseUrl: __dirname,
        nodeRequire: require
    });

    // Exports

    module.exports = requirejs('./RCSDK')({
        CryptoJS: require('crypto-js'),
        localStorage: new (require('dom-storage'))(),
        Promise: require('es6-promise').Promise,
        PUBNUB: require('pubnub'),
        XHR: require('xhr2')
    });

})();