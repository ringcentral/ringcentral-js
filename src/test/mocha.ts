/// <reference path="../typings/externals.d.ts" />

import _mock = require('./lib/Mock');

export import chai = require('chai');
export import sinon = require("sinon");
export import sinonChai = require('sinon-chai');
export import mocha = require('mocha');

export import RCSDK = require('../lib/RCSDK');

export var rcsdk = new RCSDK({
    server: 'http://whatever',
    appKey: 'whatever',
    appSecret: 'whatever'
});

export var mock = new _mock.Mock(rcsdk);

chai.use(sinonChai);