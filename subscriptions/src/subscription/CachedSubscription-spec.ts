import {asyncTest, expect} from '@ringcentral/sdk/src/test/test';
import {createSubscriptions} from '../test/test';

describe('RingCentral.subscription.CachedSubscription', () => {
    describe('create', () => {
        it(
            'supports legacy definition',
            asyncTest(sdk => {
                const sub = createSubscriptions(sdk);

                const subscription1 = sub.createCachedSubscription({cacheKey: 'foo'});
                const subscription2 = sub.createCachedSubscription({
                    cacheKey: 'foo',
                    pollInterval: 11,
                    renewHandicapMs: 22
                });

                const data = {
                    id: 'foo',
                    expirationTime: new Date(Date.now() + 10000).toISOString(),
                    deliveryMode: {
                        subscriberKey: 'foo',
                        address: 'foo'
                    }
                };

                expect(subscription1._cacheKey).to.equal('foo'); // prettier-ignore
                expect(subscription2._cacheKey).to.equal('foo'); // prettier-ignore
                expect(subscription2._pollInterval).to.equal(11); // prettier-ignore
                expect(subscription2._renewHandicapMs).to.equal(22); // prettier-ignore

                subscription1._setSubscription(data);
                expect(subscription2.subscription()).to.deep.equal(data); // prettier-ignore
            })
        );
    });

    describe('restore', () => {
        it(
            'sets event filters if they are not defined',
            asyncTest(sdk => {
                const sub = createSubscriptions(sdk);
                const s = sub.createCachedSubscription({cacheKey: 'foo'});
                s.restore(['foo']);
                expect(s.eventFilters()).to.deep.equal(['foo']);
            })
        );

        it(
            'uses previous event filters if they are defined',
            asyncTest(sdk => {
                const sub = createSubscriptions(sdk);
                const s = sub.createCachedSubscription({cacheKey: 'foo'});
                s.restore(['bar']);
                s.restore(['foo']);
                expect(s.eventFilters()).to.deep.equal(['bar']);
            })
        );

        it.skip('sets appropriate event filters if subscription is not alive', () => {});
        it.skip('sets appropriate event filters if subscription is never existed', () => {});
        it.skip('renews subscription if cache data is OK', () => {});
        it.skip('re-subscribes with default event filters when renew fails', () => {});
    });

    describe.skip('renew', () => {});

    describe.skip('resubscribe', () => {});
});
