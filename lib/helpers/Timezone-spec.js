describe('RCSDK.helpers.dictionaries.Timezone', function() {

    'use strict';

    var Timezone = rcsdk.getTimezoneHelper();

    describe('createUrl', function() {

        it('returns URL depending on options', function() {

            expect(Timezone.createUrl()).to.equal('/dictionary/timezone');

        });

    });

});
