/// <reference path="../../typings/externals.d.ts" />

export import mocha = require('../../test/mocha');
var expect = mocha.chai.expect;
var spy = mocha.sinon.spy;
var mock = mocha.mock;
var rcsdk = mocha.rcsdk;

describe('RCSDK.helpers.dictionaries.State', function() {

    'use strict';

    var State = rcsdk.getStateHelper();

    var states = [
        {id: 1, country: {id: '1'}},
        {id: 2, country: {id: '2'}},
        {id: 3, country: {id: '2'}},
        {id: 4, country: {id: '1'}}
    ];

    describe('filter', function() {

        it('filters by countryId', function() {

            var filtered = states.filter(State.filter({countryId: '2'}));

            expect(filtered.length).to.equal(2);
            expect(filtered[0]).to.equal(states[1]);
            expect(filtered[1]).to.equal(states[2]);

        });

    });

    describe('createUrl', function() {

        it('returns URL depending on options', function() {

            expect(State.createUrl()).to.equal('/dictionary/state');

        });

    });

});
