/// <reference path="../../typings/externals.d.ts" />

export import mocha = require('../../test/mocha');
var expect = mocha.chai.expect;
var spy = mocha.sinon.spy;
var mock = mocha.mock;
var rcsdk = mocha.rcsdk;

describe('RCSDK.helpers.Conferencing', function() {

    'use strict';

    var Conferencing = rcsdk.getConferencingHelper();

    describe('createUrl', function() {

        it('returns URL depending on options', function() {

            expect(Conferencing.createUrl()).to.equal('/account/~/extension/~/conferencing');

        });

    });

});
