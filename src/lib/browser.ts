/// <reference path="../typings/tsd.d.ts" />
/// <amd-dependency path="es6-promise"/>
/// <amd-dependency path="pubnub"/>
/// <amd-dependency path="crypto-js/aes"/>
/// <amd-dependency path="crypto-js/core"/>
/// <amd-dependency path="crypto-js/mode-aes"/>

declare
var require:(name:string)=>any;

import promise = require('es6-promise');
import pubnub = require('pubnub');
import rcsdk = require('./RCSDK');

require('crypto-js/aes');
require('crypto-js/mode-ecb');

var CryptoJS = require('crypto-js/core');

var XHR = (XMLHttpRequest || function () {
    try { return new ActiveXObject("Msxml2.XMLHTTP.6.0"); } catch (e1) {}
    try { return new ActiveXObject("Msxml2.XMLHTTP.3.0"); } catch (e2) {}
    try { return new ActiveXObject("Msxml2.XMLHTTP"); } catch (e3) {}
    throw new Error("This browser does not support XMLHttpRequest.");
});

exports = module.exports = <typeof rcsdk.RCSDK>rcsdk.factory({
    CryptoJS: CryptoJS,
    localStorage: localStorage,
    Promise: typeof(Promise) !== 'undefined' ? Promise : promise.Promise,
    PUBNUB: pubnub,
    XHR: XHR
});
