import {asyncTest, expect, createSdk} from "../test/test";

describe('RingCentral.core.Cache', () => {

    describe('getItem', () => {

        it('returns null if item not found', asyncTest(sdk => {

            const cache = sdk.cache();

            expect(cache.getItem('foo')).to.equal(null);

        }));

    });

    describe('setItem', () => {

        it('sets an item in storage', asyncTest(sdk => {

            const cache = sdk.cache();
            const json = {foo: 'bar'};

            expect(cache.setItem('foo', json).getItem('foo')).to.deep.equal(json);

            cache.removeItem('foo');

            expect(cache.getItem('foo')).to.equal(null);

        }));

    });

    describe('clean', () => {

        it('removes all prefixed entries from cache leaving non-prefixed ones untouched', asyncTest(sdk => {

            const cache = sdk.cache();

            cache['_externals'].localStorage['rc-foo'] = '"foo"';
            cache['_externals'].localStorage.foo = '"foo"';

            expect(cache.getItem('foo')).to.equal('foo');

            cache.clean();

            expect(cache.getItem('foo')).to.equal(null);
            expect(cache['_externals'].localStorage.foo).to.equal('"foo"');

        }));

    });

    describe('prefix', () => {

        it('different prefixes dont overlap', asyncTest(sdk1 => {

            const sdk2 = createSdk({cachePrefix: 'foo'});

            const cache1 = sdk1.cache();

            cache1.setItem('foo', {foo: 'bar'});

            expect(sdk2.cache().getItem('foo')).to.equal(null);

        }));

    });

});
