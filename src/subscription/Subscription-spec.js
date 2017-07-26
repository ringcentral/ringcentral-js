describe('RingCentral.subscription.Subscription', function() {

    var pollInterval = 1;
    var renewHandicapMs = 30;
    var expiresIn = 100; // 100 seconds
    var quickExpiresIn = 0.5; // 50 ms

    function createSubscription(sdk) {
        return sdk.createSubscription({
            pollInterval: pollInterval,
            renewHandicapMs: renewHandicapMs
        });
    }

    describe('subscribe', function() {

        it('automatically renews subscription', asyncTest(function(sdk) {

            subscribeGeneric(quickExpiresIn);
            subscribeGeneric(10, 'foo-bar-baz'); // should be a good value for future response

            var subscription = createSubscription(sdk);

            return subscription
                .setEventFilters(['foo', 'bar'])
                .register()
                .then(function(res) {

                    expect(res.json().expiresIn).to.equal(quickExpiresIn);

                    return new Promise(function(resolve, reject) {
                        subscription.on(subscription.events.automaticRenewError, function(e) {
                            reject(e);
                        });
                        subscription.on(subscription.events.automaticRenewSuccess, function() {
                            resolve(null);
                        });
                    });

                });

        }));

        it('automatically renews subscription with +0000 timezone format', asyncTest(function(sdk) {

            subscribeGeneric(quickExpiresIn, null, null, '+0000');
            subscribeGeneric(10, 'foo-bar-baz'); // should be a good value for future response

            var subscription = createSubscription(sdk);

            return subscription
                .setEventFilters(['foo', 'bar'])
                .register()
                .then(function(res) {

                    expect(res.json().expiresIn).to.equal(quickExpiresIn);

                    return new Promise(function(resolve, reject) {
                        subscription.on(subscription.events.automaticRenewError, function(e) {
                            reject(e);
                        });
                        subscription.on(subscription.events.automaticRenewSuccess, function() {
                            resolve(null);
                        });
                    });

                });

        }));

        it('captures automatic subscription renew errors', asyncTest(function(sdk) {

            subscribeGeneric(quickExpiresIn);
            apiCall('PUT', '/restapi/v1.0/subscription/foo-bar-baz', {'message': 'expected'}, 400, 'Bad Request');

            var subscription = createSubscription(sdk);

            return subscription
                .setEventFilters(['foo', 'bar'])
                .register()
                .then(function(res) {

                    return new Promise(function(resolve, reject) {
                        subscription.on(subscription.events.automaticRenewError, function(e) {
                            expect(e.message).to.equal('expected');
                            resolve(null);
                        });
                        subscription.on(subscription.events.automaticRenewSuccess, function() {
                            reject(new Error('This should not be reached'));

                        });
                    });

                });

        }));

    });

    describe('resubscribe', function() {

        it('resets and resubscribes', asyncTest(function(sdk) {

            subscribeGeneric(expiresIn);

            return createSubscription(sdk)
                .setEventFilters(['foo', 'bar'])
                .resubscribe()
                .then(function(res) {
                    expect(res.json().expiresIn).to.equal(expiresIn);
                });

        }));

    });

    describe('notify', function() {

        it('fires a notification event when the notify method is called and passes the message object', asyncTest(function(sdk) {

            return new Promise(function(resolve) {

                var subscription = createSubscription(sdk);

                subscription.setSubscription({
                    id: 'foo',
                    expirationTime: new Date(Date.now() + expiresIn).toISOString(),
                    deliveryMode: {
                        subscriberKey: 'foo',
                        address: 'foo'
                    }
                });

                subscription.on(subscription.events.notification, function(event) {
                    expect(event).to.deep.equal({foo: 'bar'});
                    resolve();
                });

                subscription._notify({foo: 'bar'}); // using private API

            });

        }));

    });

    describe('renew', function() {

        it('fails when no subscription', asyncTest(function(sdk) {

            return createSubscription(sdk)
                .renew()
                .then(function() {
                    throw new Error('This should not be reached');
                })
                .catch(function(e) {
                    expect(e.message).to.equal('No subscription');
                });

        }));

        it('fails when no eventFilters', asyncTest(function(sdk) {

            return createSubscription(sdk)
                .setSubscription({
                    id: 'foo',
                    expirationTime: new Date(Date.now() + expiresIn).toISOString(),
                    deliveryMode: {
                        subscriberKey: 'foo',
                        address: 'foo'
                    }
                })
                .renew()
                .then(function() {
                    throw new Error('This should not be reached');
                })
                .catch(function(e) {
                    expect(e.message).to.equal('Events are undefined');
                });

        }));

        it('renews successfully', asyncTest(function(sdk) {

            subscribeGeneric(expiresIn, 'foo');

            var subscription = createSubscription(sdk);

            subscription.setSubscription({
                id: 'foo',
                expirationTime: new Date(Date.now() + expiresIn).toISOString(),
                eventFilters: ['foo'],
                deliveryMode: {
                    subscriberKey: 'foo',
                    address: 'foo'
                }
            });

            return subscription.renew();

        }));

    });

    describe('remove', function() {

        it('fails when no subscription', asyncTest(function(sdk) {

            return createSubscription(sdk)
                .remove()
                .then(function() {
                    throw new Error('This should not be reached');
                })
                .catch(function(e) {
                    expect(e.message).to.equal('No subscription');
                });

        }));

        it('removes successfully', asyncTest(function(sdk) {

            subscribeGeneric(expiresIn, 'foo', true);

            var subscription = createSubscription(sdk);

            subscription.setSubscription({
                id: 'foo',
                expirationTime: new Date(Date.now() + expiresIn).toISOString(),
                eventFilters: ['foo'],
                deliveryMode: {
                    subscriberKey: 'foo',
                    address: 'foo'
                }
            });

            return subscription.remove();

        }));

        it('removes successfully', asyncTest(function(sdk) {

            subscribeGeneric(expiresIn, 'foo', true);

            var subscription = createSubscription(sdk);

            subscription.setSubscription({
                id: 'foo',
                expirationTime: new Date(Date.now() + expiresIn).toISOString(),
                eventFilters: ['foo'],
                deliveryMode: {
                    subscriberKey: 'foo',
                    address: 'foo'
                }
            });

            return subscription.remove();

        }));

    });

    describe('subscribe', function() {

        it('fails when no eventFilters', asyncTest(function(sdk) {

            return createSubscription(sdk)
                .subscribe()
                .then(function() {
                    throw new Error('This should not be reached');
                })
                .catch(function(e) {
                    expect(e.message).to.equal('Events are undefined');
                });

        }));

        it('calls the success callback and passes the subscription provided from the platform', asyncTest(function(sdk) {

            var event = 'foo',
                subscription = createSubscription(sdk);

            subscribeGeneric();

            return subscription
                .setEventFilters([event])
                .subscribe()
                .then(function() {
                    expect(subscription.subscription().eventFilters.length).to.equal(1);
                });

        }));

        it('calls the error callback and passes the error provided from the platform', asyncTest(function(sdk) {

            apiCall('POST', '/restapi/v1.0/subscription', {'message': 'Subscription failed'}, 400, 'Bad Request');

            return createSubscription(sdk)
                .setEventFilters(['foo'])
                .subscribe()
                .then(function() {
                    throw new Error('This should never be reached');
                })
                .catch(function(e) {

                    expect(e.message).to.equal('Subscription failed');
                    expect(e).to.be.an.instanceOf(Error);

                });

        }));

    });

    describe('decrypt', function() {

        it('decrypts AES-encrypted messages when the subscription has an encryption key', asyncTest(function(sdk) {

            var subscription = createSubscription(sdk);

            var aesMessage = 'gkw8EU4G1SDVa2/hrlv6+0ViIxB7N1i1z5MU/Hu2xkIKzH6yQzhr3vIc27IAN558kTOkacqE5DkLpRdnN1orwtI' +
                             'BsUHmPMkMWTOLDzVr6eRk+2Gcj2Wft7ZKrCD+FCXlKYIoa98tUD2xvoYnRwxiE2QaNywl8UtjaqpTk1+WDImBrt' +
                             '6uabB1WICY/qE0It3DqQ6vdUWISoTfjb+vT5h9kfZxWYUP4ykN2UtUW1biqCjj1Rb6GWGnTx6jPqF77ud0XgV1r' +
                             'k/Q6heSFZWV/GP23/iytDPK1HGJoJqXPx7ErQU=';

            subscription.setSubscription({
                id: 'foo',
                expirationTime: new Date(Date.now() + expiresIn).toISOString(),
                deliveryMode: {
                    encryptionKey: 'e0bMTqmumPfFUbwzppkSbA==',
                    subscriberKey: 'foo',
                    address: 'foo'
                }
            });

            expect(subscription._decrypt(aesMessage)).to.deep.equal({
                "timestamp": "2014-03-12T20:47:54.712+0000",
                "body": {
                    "extensionId": 402853446008,
                    "telephonyStatus": "OnHold"
                },
                "event": "/restapi/v1.0/account/~/extension/402853446008/presence",
                "uuid": "db01e7de-5f3c-4ee5-ab72-f8bd3b77e308"
            });

        }));

    });

});
