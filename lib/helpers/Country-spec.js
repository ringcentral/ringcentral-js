/// <reference path="../../typings/tsd.d.ts" />
exports.mocha = require('../../test/mocha');
var expect = exports.mocha.chai.expect;
var spy = exports.mocha.sinon.spy;
var mock = exports.mocha.mock;
var rcsdk = exports.mocha.rcsdk;
describe('RCSDK.helpers.dictionaries.Country', function () {
    'use strict';
    var Country = rcsdk.getCountryHelper();
    describe('createUrl', function () {
        it('returns URL depending on options', function () {
            expect(Country.createUrl()).to.equal('/dictionary/country');
        });
    });
});
