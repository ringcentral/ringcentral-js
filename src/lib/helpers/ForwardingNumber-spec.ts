/// <reference path="../../typings/externals.d.ts" />

export import mocha = require('../../test/mocha');
var expect = mocha.chai.expect;
var spy = mocha.sinon.spy;
var mock = mocha.mock;
var rcsdk = mocha.rcsdk;

describe('RCSDK.helpers.ForwardingNumber', function() {

    'use strict';

    var ForwardingNumber = rcsdk.getForwardingNumberHelper();

    var forwardingNumbers = [
        {label: '3', phoneNumber: '1', features: ['CallForwarding', 'CallFlip']},
        {label: '2', phoneNumber: '2', features: ['CallFlip']},
        {label: '1', phoneNumber: '2', features: ['CallForwarding']},
        {label: '4', phoneNumber: '2', features: []}
    ];

    describe('createUrl', function() {

        it('returns URL depending on options', function() {

            expect(ForwardingNumber.createUrl()).to.equal('/account/~/extension/~/forwarding-number');
            expect(ForwardingNumber.createUrl({extensionId: 'foo'})).to.equal('/account/~/extension/foo/forwarding-number');
            expect(ForwardingNumber.createUrl({}, 'foo')).to.equal('/account/~/extension/~/forwarding-number/foo');
            expect(ForwardingNumber.createUrl({extensionId: 'foo'}, 'bar')).to.equal('/account/~/extension/foo/forwarding-number/bar');

        });

    });

    describe('getId', function() {

        it('returns either ID or phoneNumber', function() {

            expect(ForwardingNumber.getId({id: 'foo', phoneNumber: 'bar'})).to.equal('foo');
            expect(ForwardingNumber.getId({phoneNumber: 'bar'})).to.equal('bar');
            expect(ForwardingNumber.getId({})).to.equal(undefined);

        });

    });

    describe('comparator', function() {

        it('sorts by label by default', function() {

            var sorted = [].concat(forwardingNumbers).sort(ForwardingNumber.comparator());

            expect(sorted[0]).to.equal(forwardingNumbers[2]);
            expect(sorted[1]).to.equal(forwardingNumbers[1]);
            expect(sorted[2]).to.equal(forwardingNumbers[0]);

        });

    });

    describe('filter', function() {

        it('provides functionality to filter by feature', function() {

            var filtered = [];

            filtered = forwardingNumbers.filter(ForwardingNumber.filter({features: ['CallForwarding', 'CallFlip']}));
            expect(filtered.length).to.equal(3);
            expect(filtered[0]).to.equal(forwardingNumbers[0]);
            expect(filtered[1]).to.equal(forwardingNumbers[1]);
            expect(filtered[2]).to.equal(forwardingNumbers[2]);

            filtered = forwardingNumbers.filter(ForwardingNumber.filter({features: ['CallForwarding']}));
            expect(filtered[0]).to.equal(forwardingNumbers[0]);
            expect(filtered[1]).to.equal(forwardingNumbers[2]);

        });

    });

});
