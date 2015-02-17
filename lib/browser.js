/**
 * Browser-compatible version
 */
define(function(require, exports, module) {

    'use strict';

    // ES6 Promise Polyfill only needs to be required since it modifies window object
    require('es6-promise');

    module.exports = require('./RCSDK')({
        CryptoJS: require('crypto-js'),
        PUBNUB: require('pubnub')
    });

});
