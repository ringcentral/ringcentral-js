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

    describe('prefix', function() {

        it('different prefixes dont overlap', asyncTest(function(sdk1, createSdk) {

            var sdk2 = createSdk({cachePrefix: 'foo'});

            var cache1 = sdk1.cache();

            cache1.setItem('foo', {foo: 'bar'});

            expect(sdk2.cache().getItem('foo')).to.equal(null);

        }));

    });

});
