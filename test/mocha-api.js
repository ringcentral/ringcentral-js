var define = typeof define === 'function' && define.amd ? define : function (factory) {
    factory(require, exports, module);
};
define(function (require, exports, module) {
    if (!process.env.RCSDK_API_SERVER)
        throw new Error('Process.env.RCSDK_API_SERVER is undefined');
    if (!process.env.RCSDK_API_KEY)
        throw new Error('Process.env.RCSDK_API_KEY is undefined');
    var ag = require('./lib/AccountGenerator');
    var agh = require('./lib/AccountGeneratorHelper');
    exports.chai = require('chai');
    exports.sinon = require('sinon');
    exports.sinonChai = require('sinon-chai');
    exports.mocha = require('mocha');
    exports.RCSDK = require('../lib/RCSDK');
    exports.rcsdk = new exports.RCSDK({
        server: process.env.RCSDK_API_SERVER,
        appKey: 'whatever',
        appSecret: 'whatever'
    });
    exports.rcsdk.getPlatform().apiKey = process.env.RCSDK_API_KEY;
    exports.chai.use(exports.sinonChai);
    exports.accountGenerator = new ag.AccountGenerator(process.env.RCSDK_AGS_SERVER);
    exports.accountGeneratorHelper = new agh.AccountGeneratorHelper(exports.accountGenerator, process.env.RCSDK_AGS_DBNAME);
});