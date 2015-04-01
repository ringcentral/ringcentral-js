/// <reference path="../../typings/externals.d.ts" />

export import mocha = require('../../test/mocha');
var expect = mocha.chai.expect;
var spy = mocha.sinon.spy;
var mock = mocha.mock;
var rcsdk = mocha.rcsdk;

describe('RCSDK.helpers.Account', function() {

    'use strict';

    var Account = rcsdk.getAccountHelper();

    describe('createUrl', function() {

        it('returns URL depending on options', function() {

            expect(Account.createUrl()).to.equal('/account/~');

        });

    });

});
