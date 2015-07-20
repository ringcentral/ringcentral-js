/// <reference path="../../typings/externals.d.ts" />

export import mocha = require('../../test/mocha');
var expect = mocha.chai.expect;
var spy = mocha.sinon.spy;
var mock = mocha.mock;
var rcsdk = mocha.rcsdk;

describe('RCSDK.helpers.Extension', function() {

    'use strict';

    var Extension = rcsdk.getExtensionHelper();

    var extensions = [
        {name: 'One One One', extensionNumber: 111, type: 'foo'},
        {name: 'Twenty One', extensionNumber: 21, type: 'bar'}
    ];

    describe('createUrl', function() {

        it('returns URL depending on options', function() {

            expect(Extension.createUrl()).to.equal('/account/~/extension');
            expect(Extension.createUrl({}, 'foo')).to.equal('/account/~/extension/foo');
            expect(Extension.createUrl({departmentId: 'foo'})).to.equal('/account/~/department/foo/members');
            expect(Extension.createUrl({departmentId: 'foo'}, 'bar')).to.equal('/account/~/department/foo/members/bar');

        });

    });

    describe('comparator', function() {

        it('allows to sort extensions by extensionNumber', function() {

            var exts = [].concat(extensions).sort(Extension.comparator());

            expect(exts[0]).to.equal(extensions[1]);
            expect(exts[1]).to.equal(extensions[0]);

        });

    });

    describe('filter', function() {

        it('allows to filter extensions by name and extensionNumber', function() {

            expect(extensions.filter(Extension.filter({search: 'One'})).length).to.equal(2);
            expect(extensions.filter(Extension.filter({search: '21'})).length).to.equal(1);

        });

        it('allows to filter extensions by type', function() {

            expect(extensions.filter(Extension.filter({type: 'foo'})).length).to.equal(1);

        });

    });

    describe('convenience methods', function() {

        it('provides type detection', function() {

            expect(Extension.isUser()).to.equal(undefined);
            expect(Extension.isDepartment()).to.equal(undefined);
            expect(Extension.isAnnouncement()).to.equal(undefined);
            expect(Extension.isVoicemail()).to.equal(undefined);

            expect(Extension.isUser({type: 'foo'})).to.equal(false);
            expect(Extension.isDepartment({type: 'foo'})).to.equal(false);
            expect(Extension.isAnnouncement({type: 'foo'})).to.equal(false);
            expect(Extension.isVoicemail({type: 'foo'})).to.equal(false);

            expect(Extension.isUser({type: 'User'})).to.equal(true);
            expect(Extension.isDepartment({type: 'Department'})).to.equal(true);
            expect(Extension.isAnnouncement({type: 'Announcement'})).to.equal(true);
            expect(Extension.isVoicemail({type: 'Voicemail'})).to.equal(true);

        });

    });

});
