import {asyncTest, expect} from '@ringcentral/sdk/lib/test/test';
import {createSubscriptions} from '../test/test';

describe('CachedSubscription', () => {
    describe('restore', () => {
        it(
            'sets event filters if they are not defined',
            asyncTest(async sdk => {
                const sub = createSubscriptions(sdk);
                const s = await sub.createCachedSubscription({cacheKey: 'foo'});
                s.restore(['foo']);
                expect(s.eventFilters()).to.deep.equal(['foo']);
            }),
        );

        it(
            'uses previous event filters if they are defined',
            asyncTest(async sdk => {
                const sub = createSubscriptions(sdk);
                const s = await sub.createCachedSubscription({cacheKey: 'foo'});
                s.restore(['bar']);
                s.restore(['foo']);
                expect(s.eventFilters()).to.deep.equal(['bar']);
            }),
        );

        it.skip('sets appropriate event filters if subscription is not alive', () => {});
        it.skip('sets appropriate event filters if subscription is never existed', () => {});
        it.skip('renews subscription if cache data is OK', () => {});
        it.skip('re-subscribes with default event filters when renew fails', () => {});
    });

    describe.skip('renew', () => {});

    describe.skip('resubscribe', () => {});
});
