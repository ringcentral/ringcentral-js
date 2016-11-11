describe('RingCentral.core.Cache', function() {

    describe('getItem', function() {

        it('returns null if item not found', asyncTest(function(sdk) {

            var cache = sdk.cache();

            expect(cache.getItem('foo')).to.equal(null);

        }));

    });

    describe('setItem', function() {

        it('sets an item in storage', asyncTest(function(sdk) {

            var cache = sdk.cache();
            var json = {foo: 'bar'};

            expect(cache.setItem('foo', json).getItem('foo')).to.deep.equal(json);

        }));

    });

});
