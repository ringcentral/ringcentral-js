/// <reference path="../../typings/externals.d.ts" />

export import mocha = require('../../test/mocha');
var expect = mocha.chai.expect;
var spy = mocha.sinon.spy;
var mock = mocha.mock;
var rcsdk = mocha.rcsdk;

describe('RCSDK.helpers.dictionaries.Location', function() {

    'use strict';

    var Location = rcsdk.getLocationHelper();

    var locations = [
        {npa: '888', nxx: '222', state: {id: '1'}},
        {npa: '888', nxx: '111', state: {id: '1'}},
        {npa: '777', nxx: '111', state: {id: '2'}}
    ];

    describe('filter', function() {

        it('filters by unique NPA', function() {

            var filtered = locations.filter(Location.filter({onlyUniqueNPA: true}));

            expect(filtered.length).to.equal(2);
            expect(filtered[0]).to.equal(locations[0]);
            expect(filtered[1]).to.equal(locations[2]);

        });

        it('filters by stateId', function() {

            var filtered = locations.filter(Location.filter({stateId: '2'}));

            expect(filtered.length).to.equal(1);
            expect(filtered[0]).to.equal(locations[2]);

        });

    });

    describe('comparator', function() {

        it('sorts by NPA', function() {

            var sorted = [].concat(locations).sort(Location.comparator());

            expect(sorted[0]).to.equal(locations[2]);
            expect(sorted[1]).to.equal(locations[0]);
            expect(sorted[2]).to.equal(locations[1]);

        });

        it('sorts by NXX', function() {

            var sorted = [].concat(locations).sort(Location.comparator({sortBy: 'nxx'}));

            expect(sorted[0]).to.equal(locations[2]);
            expect(sorted[1]).to.equal(locations[1]);
            expect(sorted[2]).to.equal(locations[0]);

        });

    });

    describe('createUrl', function() {

        it('returns URL depending on options', function() {

            expect(Location.createUrl()).to.equal('/dictionary/location');

        });

    });

});
