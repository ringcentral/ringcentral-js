/// <reference path="../typings/externals.d.ts" />

if (!process.env.RCSDK_API_SERVER) throw new Error('Process.env.RCSDK_API_SERVER is undefined');
if (!process.env.RCSDK_API_KEY) throw new Error('Process.env.RCSDK_API_KEY is undefined');

import _mock = require('./lib/Mock');
import ag = require('./lib/AccountGenerator');
import agh = require('./lib/AccountGeneratorHelper');

export import chai = require('chai');
export import sinon = require("sinon");
export import sinonChai = require('sinon-chai');
export import mocha = require('mocha');

export import RCSDK = require('../lib/RCSDK');

export var rcsdk = new RCSDK({
    server: process.env.RCSDK_API_SERVER,
    appKey: 'whatever',
    appSecret: 'whatever'
});

rcsdk.getPlatform().apiKey = process.env.RCSDK_API_KEY;

chai.use(sinonChai);

export var accountGenerator:ag.AccountGenerator = new ag.AccountGenerator(process.env.RCSDK_AGS_SERVER);
export var accountGeneratorHelper:agh.AccountGeneratorHelper = new agh.AccountGeneratorHelper(accountGenerator, process.env.RCSDK_AGS_DBNAME);
