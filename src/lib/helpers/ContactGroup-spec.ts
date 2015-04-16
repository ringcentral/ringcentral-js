/// <reference path="../../typings/externals.d.ts" />

export import mocha = require('../../test/mocha');
var expect = mocha.chai.expect;
var spy = mocha.sinon.spy;
var mock = mocha.mock;
var rcsdk = mocha.rcsdk;

describe('RCSDK.helpers.ContactGroup', function() {

    'use strict';

    var ContactGroup = rcsdk.getContactGroupHelper();

    describe('createUrl', function() {

        it('returns URL depending on options', function() {

            expect(ContactGroup.createUrl()).to.equal('/account/~/extension/~/address-book/group');
            expect(ContactGroup.createUrl({}, 'foo')).to.equal('/account/~/extension/~/address-book/group/foo');

        });

    });

    describe('validate', function() {

        it('performs basic validation', function() {

            var res = ContactGroup.validate({});

            expect(res.isValid).to.equal(false);
            expect(res.errors['groupName'][0]).to.be.instanceOf(Error);
            expect(res.errors['groupName'].length).to.equal(1);

        });

        it('passes validation if values are correct', function() {

            var res = ContactGroup.validate({groupName: 'foo'});

            expect(res.isValid).to.equal(true);
            expect(res.errors).to.deep.equal({});

        });

    });

});
