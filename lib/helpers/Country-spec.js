describe('RCSDK.helpers.dictionaries.Country', function() {

    'use strict';

    var Country = rcsdk.getCountryHelper();

    describe('createUrl', function() {

        it('returns URL depending on options', function() {

            expect(Country.createUrl()).to.equal('/dictionary/country');

        });

    });

});
