/// <reference path="../typings/tsd.d.ts" />

if (!process.env.RCSDK_API_SERVER) throw new Error('Process.env.RCSDK_API_SERVER is undefined');
if (!process.env.RCSDK_API_KEY) throw new Error('Process.env.RCSDK_API_KEY is undefined');

import _mock = require('./lib/Mock');
import NodeSDK = require('../lib/index'); // Node version
import sdk = require('../lib/RCSDK'); // Namespace & factory
import ag = require('./lib/AccountGenerator');
import agh = require('./lib/AccountGeneratorHelper');

export import chai = require('chai');
export import sinon = require("sinon");
export import sinonChai = require('sinon-chai');
export import mocha = require('mocha');

export var RCSDK:typeof sdk.RCSDK = <typeof sdk.RCSDK>NodeSDK;

export var rcsdk:sdk.RCSDK = new (<typeof sdk.RCSDK>NodeSDK)({
    server: process.env.RCSDK_API_SERVER,
    appKey: 'whatever',
    appSecret: 'whatever'
});

rcsdk.getPlatform().apiKey = process.env.RCSDK_API_KEY;

chai.use(sinonChai);

export var accountGenerator:ag.AccountGenerator = new ag.AccountGenerator(process.env.RCSDK_AGS_SERVER);
export var accountGeneratorHelper:agh.AccountGeneratorHelper = new agh.AccountGeneratorHelper(accountGenerator, process.env.RCSDK_AGS_DBNAME);
