describe('RCSDK.helpers.Conferencing', function() {

    'use strict';

    var Conferencing = rcsdk.getConferencingHelper();

    describe('createUrl', function() {

        it('returns URL depending on options', function() {

            expect(Conferencing.createUrl()).to.equal('/account/~/extension/~/conferencing');

        });

    });

});
