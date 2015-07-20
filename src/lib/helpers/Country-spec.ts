/// <reference path="../../typings/externals.d.ts" />

export import mocha = require('../../test/mocha');
var expect = mocha.chai.expect;
var spy = mocha.sinon.spy;
var mock = mocha.mock;
var rcsdk = mocha.rcsdk;

describe('RCSDK.helpers.dictionaries.Country', function() {

    'use strict';

    var Country = rcsdk.getCountryHelper();

    describe('createUrl', function() {

        it('returns URL depending on options', function() {

            expect(Country.createUrl()).to.equal('/dictionary/country');

        });

    });

});
