/// <reference path="../../typings/externals.d.ts" />

export import mocha = require('../../test/mocha');
var expect = mocha.chai.expect;
var spy = mocha.sinon.spy;
var mock = mocha.mock;
var rcsdk = mocha.rcsdk;

describe('RCSDK.helpers.Ringout', function() {

    'use strict';

    var Ringout = rcsdk.getRingoutHelper();

    describe('createUrl', function() {

        it('returns URL depending on options', function() {

            expect(Ringout.createUrl()).to.equal('/account/~/extension/~/ringout');
            expect(Ringout.createUrl({}, 'foo')).to.equal('/account/~/extension/~/ringout/foo');
            expect(Ringout.createUrl({extensionId: 'foo'})).to.equal('/account/~/extension/foo/ringout');
            expect(Ringout.createUrl({extensionId: 'foo'}, 'bar')).to.equal('/account/~/extension/foo/ringout/bar');

        });

    });

    describe('status helpers', function() {

        it('unsaved ringout is not inProgress/error/success', function() {

            expect(Ringout.isSuccess({status: {callStatus: 'InProgress'}})).to.equal(false);
            expect(Ringout.isError({status: {callStatus: 'Error'}})).to.equal(false);
            expect(Ringout.isInProgress({status: {callStatus: 'Success'}})).to.equal(false);

        });

        it('provides interfaces to determine statuses', function() {

            expect(Ringout.isSuccess({id: 'foo', uri: 'bar', status: {callStatus: 'InProgress'}})).to.equal(false);
            expect(Ringout.isError({id: 'foo', uri: 'bar', status: {callStatus: 'InProgress'}})).to.equal(false);
            expect(Ringout.isInProgress({id: 'foo', uri: 'bar', status: {callStatus: 'InProgress'}})).to.equal(true);

            expect(Ringout.isSuccess({id: 'foo', uri: 'bar', status: {callStatus: 'Success'}})).to.equal(true);
            expect(Ringout.isError({id: 'foo', uri: 'bar', status: {callStatus: 'Success'}})).to.equal(false);
            expect(Ringout.isInProgress({id: 'foo', uri: 'bar', status: {callStatus: 'Success'}})).to.equal(false);

            expect(Ringout.isSuccess({id: 'foo', uri: 'bar', status: {callStatus: 'Error'}})).to.equal(false);
            expect(Ringout.isError({id: 'foo', uri: 'bar', status: {callStatus: 'Error'}})).to.equal(true);
            expect(Ringout.isInProgress({id: 'foo', uri: 'bar', status: {callStatus: 'Error'}})).to.equal(false);

        });

    });

    describe('validate', function() {

        it('performs basic validation', function() {

            var res = Ringout.validate({});

            expect(res.isValid).to.equal(false);
            expect(res.errors['to'][0]).to.be.instanceOf(Error);
            expect(res.errors['to'].length).to.equal(1);
            expect(res.errors['from'][0]).to.be.instanceOf(Error);
            expect(res.errors['from'].length).to.equal(1);

        });

        it('passes validation if values are correct', function() {

            var res = Ringout.validate({to: {phoneNumber: 'foo'}, from: {phoneNumber: 'foo'}});

            expect(res.isValid).to.equal(true);
            expect(res.errors).to.deep.equal({});

        });

    });

});
