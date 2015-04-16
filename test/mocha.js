var define = typeof define === 'function' && define.amd ? define : function (factory) {
    factory(require, exports, module);
};
define(function (require, exports, module) {
    var _mock = require('./lib/Mock');
    exports.chai = require('chai');
    exports.sinon = require('sinon');
    exports.sinonChai = require('sinon-chai');
    exports.mocha = require('mocha');
    exports.RCSDK = require('../lib/RCSDK');
    exports.rcsdk = new exports.RCSDK({
        server: 'http://whatever',
        appKey: 'whatever',
        appSecret: 'whatever'
    });
    exports.mock = new _mock.Mock(exports.rcsdk);
    exports.chai.use(exports.sinonChai);
});