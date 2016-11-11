describe('RingCentral.subscription.CachedSubscription', function() {

    describe('create', function() {

        it('supports legacy definition', asyncTest(function(sdk) {

            var subscription1 = sdk.createCachedSubscription('foo');
            var subscription2 = sdk.createCachedSubscription({
                cacheKey: 'foo',
                pollInterval: 11,
                renewHandicapMs: 22
            });

            expect(subscription1._cacheKey).to.equal('foo');
            expect(subscription2._cacheKey).to.equal('foo');
            expect(subscription2._pollInterval).to.equal(11);
            expect(subscription2._renewHandicapMs).to.equal(22);

        }));

    });

    describe.skip('restore', function() {

        it('sets appropriate event filters if subscription is not alive', function() {});
        it('sets appropriate event filters if subscription is never existed', function() {});
        it('renews subscription if cache data is OK', function() {});
        it('re-subscribes with default event filters when renew fails', function() {});

    });

    describe.skip('renew', function() {});

    describe.skip('resubscribe', function() {});

});
