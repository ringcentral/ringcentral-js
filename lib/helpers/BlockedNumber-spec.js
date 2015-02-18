describe('RCSDK.helpers.BlockedNumber', function() {

    'use strict';

    var BlockedNumber = rcsdk.getBlockedNumberHelper();

    describe('createUrl', function() {

        it('returns URL depending on options', function() {

            expect(BlockedNumber.createUrl()).to.equal('/account/~/extension/~/blocked-number');
            expect(BlockedNumber.createUrl({extensionId: 'foo'})).to.equal('/account/~/extension/foo/blocked-number');
            expect(BlockedNumber.createUrl({extensionId: 'foo'}, 'bar')).to.equal('/account/~/extension/foo/blocked-number/bar');

        });

    });

});
