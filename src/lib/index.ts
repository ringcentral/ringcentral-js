declare
var require:(name:string)=>any;

import rcsdk = require('./RCSDK');

exports = module.exports = <typeof rcsdk.RCSDK>rcsdk.factory({
    CryptoJS: require('crypto-js'),
    localStorage: require('dom-storage'),
    Promise: require('es6-promise').Promise,
    PUBNUB: require('pubnub'),
    XHR: require('xhr2')
});
