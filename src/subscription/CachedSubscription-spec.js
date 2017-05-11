describe('RingCentral.subscription.CachedSubscription', function() {

    describe('create', function() {

        it('supports legacy definition', asyncTest(function(sdk) {

            var subscription1 = sdk.createCachedSubscription('foo');
            var subscription2 = sdk.createCachedSubscription({
                cacheKey: 'foo',
                pollInterval: 11,
                renewHandicapMs: 22
            });

            var data = {
                id: 'foo',
                expirationTime: new Date(Date.now() + 10000).toISOString(),
                deliveryMode: {
                    subscriberKey: 'foo',
                    address: 'foo'
                }
            };

            expect(subscription1._cacheKey).to.equal('foo');
            expect(subscription2._cacheKey).to.equal('foo');
            expect(subscription2._pollInterval).to.equal(11);
            expect(subscription2._renewHandicapMs).to.equal(22);

            subscription1._setSubscription(data);
            expect(subscription2.subscription()).to.deep.equal(data);

        }));

        it('throws an error if no cache key provided', asyncTest(function(sdk) {
            expect(function() {
                sdk.createCachedSubscription();
            }).to.throw('Cached Subscription requires cacheKey parameter to be defined');
        }));

    });

    describe('restore', function() {

        it('sets event filters if they are not defined', asyncTest(function(sdk) {
            var s = sdk.createCachedSubscription('foo');
            s.restore(['foo']);
            expect(s.eventFilters()).to.deep.equal(['foo']);
        }));

        it('uses previous event filters if they are defined', asyncTest(function(sdk) {
            var s = sdk.createCachedSubscription('foo');
            s.restore(['bar']);
            s.restore(['foo']);
            expect(s.eventFilters()).to.deep.equal(['bar']);
        }));

        it.skip('sets appropriate event filters if subscription is not alive', function() {});
        it.skip('sets appropriate event filters if subscription is never existed', function() {});
        it.skip('renews subscription if cache data is OK', function() {});
        it.skip('re-subscribes with default event filters when renew fails', function() {});

    });

    describe.skip('renew', function() {});

    describe.skip('resubscribe', function() {});

});
