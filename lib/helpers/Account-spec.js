/// <reference path="../../typings/tsd.d.ts" />
exports.mocha = require('../../test/mocha');
var expect = exports.mocha.chai.expect;
var spy = exports.mocha.sinon.spy;
var mock = exports.mocha.mock;
var rcsdk = exports.mocha.rcsdk;
describe('RCSDK.helpers.Account', function () {
    'use strict';
    var Account = rcsdk.getAccountHelper();
    describe('createUrl', function () {
        it('returns URL depending on options', function () {
            expect(Account.createUrl()).to.equal('/account/~');
        });
    });
});
