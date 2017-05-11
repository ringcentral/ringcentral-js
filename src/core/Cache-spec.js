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

            cache.removeItem('foo');

            expect(cache.getItem('foo')).to.equal(null);

        }));

    });

    describe('clean', function() {

        it('removes all prefixed entries from cache leaving non-prefixed ones untouched', asyncTest(function(sdk) {

            var cache = sdk.cache();

            cache._externals.localStorage['rc-foo'] = '"foo"';
            cache._externals.localStorage.foo = '"foo"';

            expect(cache.getItem('foo')).to.equal('foo');

            cache.clean();

            expect(cache.getItem('foo')).to.equal(null);
            expect(cache._externals.localStorage.foo).to.equal('"foo"');

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
