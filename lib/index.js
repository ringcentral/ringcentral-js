var rcsdk = require('./RCSDK');
exports = module.exports = rcsdk.factory({
    CryptoJS: require('crypto-js'),
    localStorage: require('dom-storage'),
    Promise: require('es6-promise').Promise,
    PUBNUB: require('pubnub'),
    XHR: require('xhr2')
});
