/// <reference path="../typings/tsd.d.ts" />

import _mock = require('./lib/Mock');
import NodeSDK = require('../lib/index'); // Node version
import sdk = require('../lib/RCSDK'); // Namespace & factory

export import chai = require('chai');
export import sinon = require("sinon");
export import sinonChai = require('sinon-chai');
export import mocha = require('mocha');

export var RCSDK:typeof sdk.RCSDK = <typeof sdk.RCSDK>NodeSDK;

export var rcsdk:sdk.RCSDK = new (<typeof sdk.RCSDK>NodeSDK)({
    server: 'http://whatever',
    appKey: 'whatever',
    appSecret: 'whatever'
});

export var mock = new _mock.Mock(rcsdk);

chai.use(sinonChai);