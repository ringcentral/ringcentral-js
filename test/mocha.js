/// <reference path="../typings/tsd.d.ts" />
var _mock = require('./lib/Mock');
var NodeSDK = require('../lib/index'); // Node version
exports.chai = require('chai');
exports.sinon = require("sinon");
exports.sinonChai = require('sinon-chai');
exports.mocha = require('mocha');
exports.RCSDK = NodeSDK;
exports.rcsdk = new NodeSDK({
    server: 'http://whatever',
    appKey: 'whatever',
    appSecret: 'whatever'
});
exports.mock = new _mock.Mock(exports.rcsdk);
exports.chai.use(exports.sinonChai);
