describe('RCSDK.helpers.Account', function() {

    'use strict';

    var Account = rcsdk.getAccountHelper();

    describe('createUrl', function() {

        it('returns URL depending on options', function() {

            expect(Account.createUrl()).to.equal('/account/~');

        });

    });

});
