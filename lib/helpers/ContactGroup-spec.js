var define = typeof define === 'function' && define.amd ? define : function (factory) {
    factory(require, exports, module);
};
define(function (require, exports, module) {
    exports.mocha = require('../../test/mocha');
    var expect = exports.mocha.chai.expect;
    var spy = exports.mocha.sinon.spy;
    var mock = exports.mocha.mock;
    var rcsdk = exports.mocha.rcsdk;
    describe('RCSDK.helpers.ContactGroup', function () {
        'use strict';
        var ContactGroup = rcsdk.getContactGroupHelper();
        describe('createUrl', function () {
            it('returns URL depending on options', function () {
                expect(ContactGroup.createUrl()).to.equal('/account/~/extension/~/address-book/group');
                expect(ContactGroup.createUrl({}, 'foo')).to.equal('/account/~/extension/~/address-book/group/foo');
            });
        });
        describe('validate', function () {
            it('performs basic validation', function () {
                var res = ContactGroup.validate({});
                expect(res.isValid).to.equal(false);
                expect(res.errors['groupName'][0]).to.be.instanceOf(Error);
                expect(res.errors['groupName'].length).to.equal(1);
            });
            it('passes validation if values are correct', function () {
                var res = ContactGroup.validate({ groupName: 'foo' });
                expect(res.isValid).to.equal(true);
                expect(res.errors).to.deep.equal({});
            });
        });
    });
});