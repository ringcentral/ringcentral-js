import {asyncTest, createSdk, expect} from '../test/test';

describe('RingCentral.core.Cache', () => {
    describe('getItem', () => {
        it(
            'returns null if item not found',
            asyncTest(async sdk => {
                const cache = sdk.cache();

                expect(await cache.getItem('foo')).toEqual(null);
            }),
        );
    });

    describe('setItem', () => {
        it(
            'sets an item in storage',
            asyncTest(async sdk => {
                const cache = sdk.cache();
                const json = {foo: 'bar'};

                await cache.setItem('foo', json);
                expect(await cache.getItem('foo')).toEqual(json);

                await cache.removeItem('foo');

                expect(await cache.getItem('foo')).toEqual(null);
            }),
        );
    });

    describe('clean', () => {
        it(
            'removes all prefixed entries from cache leaving non-prefixed ones untouched',
            asyncTest(async sdk => {
                const cache = sdk.cache();

                cache['_externals'].localStorage.setItem('rc-foo', '"foo"');
                cache['_externals'].localStorage.setItem('foo', '"foo"');

                expect(await cache.getItem('foo')).toEqual('foo');

                await cache.clean();

                expect(await cache.getItem('foo')).toEqual(null);

                // prettier-ignore
                expect(cache['_externals'].localStorage.getItem('foo')).toEqual('"foo"');
            }),
        );
    });

    describe('prefix', () => {
        it(
            'different prefixes dont overlap',
            asyncTest(async sdk1 => {
                const sdk2 = createSdk({cachePrefix: 'foo'});

                const cache1 = sdk1.cache();

                await cache1.setItem('foo', {foo: 'bar'});

                expect(await sdk2.cache().getItem('foo')).toEqual(null);
            }),
        );
    });
});
