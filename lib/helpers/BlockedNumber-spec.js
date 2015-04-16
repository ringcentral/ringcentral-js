var define = typeof define === 'function' && define.amd ? define : function (factory) {
    factory(require, exports, module);
};
define(function (require, exports, module) {
    exports.mocha = require('../../test/mocha');
    var expect = exports.mocha.chai.expect;
    var spy = exports.mocha.sinon.spy;
    var mock = exports.mocha.mock;
    var rcsdk = exports.mocha.rcsdk;
    describe('RCSDK.helpers.BlockedNumber', function () {
        'use strict';
        var BlockedNumber = rcsdk.getBlockedNumberHelper();
        describe('createUrl', function () {
            it('returns URL depending on options', function () {
                expect(BlockedNumber.createUrl()).to.equal('/account/~/extension/~/blocked-number');
                expect(BlockedNumber.createUrl({ extensionId: 'foo' })).to.equal('/account/~/extension/foo/blocked-number');
                expect(BlockedNumber.createUrl({ extensionId: 'foo' }, 'bar')).to.equal('/account/~/extension/foo/blocked-number/bar');
            });
        });
    });
});