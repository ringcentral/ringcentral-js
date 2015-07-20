/// <reference path="../../typings/externals.d.ts" />

export import mocha = require('../../test/mocha');
var expect = mocha.chai.expect;
var spy = mocha.sinon.spy;
var mock = mocha.mock;
var rcsdk = mocha.rcsdk;

describe('RCSDK.helpers.dictionaries.Timezone', function() {

    'use strict';

    var Timezone = rcsdk.getTimezoneHelper();

    describe('createUrl', function() {

        it('returns URL depending on options', function() {

            expect(Timezone.createUrl()).to.equal('/dictionary/timezone');

        });

    });

});
