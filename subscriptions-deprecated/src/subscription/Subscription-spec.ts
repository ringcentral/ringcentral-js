import {apiCall, asyncTest, expect, expectThrows} from '@ringcentral/sdk/lib/test/test';

import {createSubscriptions, subscribeGeneric} from '../test/test';

const pollInterval = 1; // ms
const renewHandicapMs = 30; // ms
const expiresIn = 10; // s
const quickExpiresIn = 0.1; // s

const createSubscription = sdk =>
    createSubscriptions(sdk).createSubscription({
        pollInterval,
        renewHandicapMs,
    });

describe('Subscription', () => {
    describe('register', () => {
        it(
            'automatically renews subscription',
            asyncTest(async sdk => {
                subscribeGeneric(quickExpiresIn);
                subscribeGeneric(10, 'foo-bar-baz'); // should be a good value for future response

                const subscription = createSubscription(sdk);

                await subscription.setEventFilters(['foo', 'bar']).register();

                expect(subscription.subscription().expiresIn).toEqual(quickExpiresIn);

                await new Promise((resolve, reject) => {
                    subscription.on(subscription.events.automaticRenewError, e => {
                        reject(e);
                    });
                    subscription.on(subscription.events.automaticRenewSuccess, () => {
                        resolve(null);
                    });
                });

                subscription.reset();
            }),
        );

        it(
            'automatically renews subscription with +0000 timezone format',
            asyncTest(async sdk => {
                subscribeGeneric(quickExpiresIn, null, null, '+0000');
                subscribeGeneric(10, 'foo-bar-baz'); // should be a good value for future response

                const subscription = createSubscription(sdk);

                await subscription.setEventFilters(['foo', 'bar']).register();

                expect(subscription.subscription().expiresIn).toEqual(quickExpiresIn);

                await new Promise((resolve, reject) => {
                    subscription.on(subscription.events.automaticRenewError, e => {
                        reject(e);
                    });
                    subscription.on(subscription.events.automaticRenewSuccess, () => {
                        resolve(null);
                    });
                });

                subscription.reset();
            }),
        );

        it(
            'captures automatic subscription renew errors',
            asyncTest(async sdk => {
                subscribeGeneric(quickExpiresIn);
                apiCall('PUT', '/restapi/v1.0/subscription/foo-bar-baz', {message: 'expected'}, 400, 'Bad Request');

                const subscription = createSubscription(sdk);

                const res = await subscription.setEventFilters(['foo', 'bar']).register();

                await new Promise((resolve, reject) => {
                    subscription.on(subscription.events.automaticRenewError, e => {
                        expect(e.message).toEqual('expected');
                        resolve(null);
                    });
                    subscription.on(subscription.events.automaticRenewSuccess, () => {
                        reject(new Error('This should not be reached'));
                    });
                });

                subscription.reset();
            }),
        );
    });

    describe('resubscribe', () => {
        it(
            'resets and resubscribes',
            asyncTest(async sdk => {
                subscribeGeneric(expiresIn);

                const s = createSubscription(sdk).setEventFilters(['foo', 'bar']);

                await s.resubscribe();
                expect(s.subscription().expiresIn).toEqual(expiresIn);
                s.reset();
            }),
        );
    });

    describe('resubscribeAtPubNub', () => {
        it(
            'resubscribe pubnub instance',
            asyncTest(async sdk => {
                subscribeGeneric(expiresIn);

                const s = createSubscription(sdk).setEventFilters(['foo', 'bar']);
                await s.register();
                const oldPubNub = s.pubnub();
                subscribeGeneric(expiresIn + 10, s.subscription().id);
                await s.resubscribeAtPubNub();
                expect(s.subscription().expiresIn).toEqual(expiresIn + 10);
                expect(!!s.pubnub()).toEqual(true);
                expect(s.pubnub()).not.toEqual(oldPubNub);
                s.reset();
            }),
        );
    });

    describe('notify', () => {
        it(
            'fires a notification event when the notify method is called and passes the message object',
            asyncTest(
                sdk =>
                    new Promise(resolve => {
                        const subscription = createSubscription(sdk);

                        subscription.setSubscription({
                            id: 'foo',
                            expirationTime: new Date(Date.now() + expiresIn * 1000).toISOString(),
                            deliveryMode: {
                                subscriberKey: 'foo',
                                address: 'foo',
                            },
                        });

                        subscription.on(subscription.events.notification, event => {
                            expect(event).toEqual({foo: 'bar'});
                            resolve(1);
                        });

                        subscription['_notify']({foo: 'bar'});

                        subscription.reset();
                    }),
            ),
        );
    });

    describe('renew', () => {
        it(
            'fails when no subscription',
            asyncTest(async sdk => {
                const s = createSubscription(sdk);

                await expectThrows(async () => {
                    await s.renew();
                }, 'No subscription');
                s.reset();
            }),
        );

        it(
            'fails when no eventFilters',
            asyncTest(async sdk => {
                const s = createSubscription(sdk);

                await expectThrows(async () => {
                    await s
                        .setSubscription({
                            id: 'foo',
                            expirationTime: new Date(Date.now() + expiresIn * 1000).toISOString(),
                            deliveryMode: {
                                subscriberKey: 'foo',
                                address: 'foo',
                            },
                        })
                        .renew();
                }, 'Events are undefined');

                s.reset();
            }),
        );

        it(
            'renews successfully',
            asyncTest(async sdk => {
                subscribeGeneric(expiresIn, 'foo');

                const subscription = createSubscription(sdk);

                subscription.setSubscription({
                    id: 'foo',
                    expirationTime: new Date(Date.now() + expiresIn * 1000).toISOString(),
                    eventFilters: ['foo'],
                    deliveryMode: {
                        subscriberKey: 'foo',
                        address: 'foo',
                    },
                });

                await subscription.renew();
                subscription.reset();
            }),
        );
    });

    describe('remove', () => {
        it(
            'fails when no subscription',
            asyncTest(async sdk => {
                const s = createSubscription(sdk);

                await expectThrows(async () => {
                    await s.remove();
                }, 'No subscription');
                s.reset();
            }),
        );

        it(
            'removes successfully',
            asyncTest(async sdk => {
                subscribeGeneric(expiresIn, 'foo', true);

                const subscription = createSubscription(sdk);

                subscription.setSubscription({
                    id: 'foo',
                    expirationTime: new Date(Date.now() + expiresIn * 1000).toISOString(),
                    eventFilters: ['foo'],
                    deliveryMode: {
                        subscriberKey: 'foo',
                        address: 'foo',
                    },
                });

                await subscription.remove();
                subscription.reset();
            }),
        );

        it(
            'removes successfully',
            asyncTest(async sdk => {
                subscribeGeneric(expiresIn, 'foo', true);

                const subscription = createSubscription(sdk);

                subscription.setSubscription({
                    id: 'foo',
                    expirationTime: new Date(Date.now() + expiresIn * 1000).toISOString(),
                    eventFilters: ['foo'],
                    deliveryMode: {
                        subscriberKey: 'foo',
                        address: 'foo',
                    },
                });

                await subscription.remove();
                subscription.reset();
            }),
        );
    });

    describe('subscribe', () => {
        it(
            'fails when no eventFilters',
            asyncTest(async sdk => {
                const s = createSubscription(sdk);

                await expectThrows(async () => {
                    await s.subscribe();
                }, 'Events are undefined');
                s.reset();
            }),
        );

        it(
            'calls the success callback and passes the subscription provided from the platform',
            asyncTest(async sdk => {
                const event = 'foo';
                const subscription = createSubscription(sdk);

                subscribeGeneric();

                await subscription.setEventFilters([event]).subscribe();
                expect(subscription.subscription().eventFilters.length).toEqual(1);
                subscription.reset();
            }),
        );

        it(
            'calls the error callback and passes the error provided from the platform',
            asyncTest(async sdk => {
                apiCall('POST', '/restapi/v1.0/subscription', {message: 'Subscription failed'}, 400, 'Bad Request');

                const s = createSubscription(sdk);

                await expectThrows(async () => {
                    await s.setEventFilters(['foo']).subscribe();
                }, 'Subscription failed');
                s.reset();
            }),
        );
    });

    describe('decrypt', () => {
        it(
            'decrypts AES-encrypted messages when the subscription has an encryption key',
            asyncTest(sdk => {
                const subscription = createSubscription(sdk);

                const aesMessage =
                    'gkw8EU4G1SDVa2/hrlv6+0ViIxB7N1i1z5MU/Hu2xkIKzH6yQzhr3vIc27IAN558kTOkacqE5DkLpRdnN1orwtI' +
                    'BsUHmPMkMWTOLDzVr6eRk+2Gcj2Wft7ZKrCD+FCXlKYIoa98tUD2xvoYnRwxiE2QaNywl8UtjaqpTk1+WDImBrt' +
                    '6uabB1WICY/qE0It3DqQ6vdUWISoTfjb+vT5h9kfZxWYUP4ykN2UtUW1biqCjj1Rb6GWGnTx6jPqF77ud0XgV1r' +
                    'k/Q6heSFZWV/GP23/iytDPK1HGJoJqXPx7ErQU=';

                subscription.setSubscription({
                    id: 'foo',
                    expirationTime: new Date(Date.now() + expiresIn * 1000).toISOString(),
                    deliveryMode: {
                        encryptionKey: 'e0bMTqmumPfFUbwzppkSbA==',
                        subscriberKey: 'foo',
                        address: 'foo',
                    },
                });

                expect(subscription._decrypt(aesMessage)).toEqual({
                    timestamp: '2014-03-12T20:47:54.712+0000',
                    body: {
                        extensionId: 402853446008,
                        telephonyStatus: 'OnHold',
                    },
                    event: '/restapi/v1.0/account/~/extension/402853446008/presence',
                    uuid: 'db01e7de-5f3c-4ee5-ab72-f8bd3b77e308',
                });

                subscription.reset();
            }),
        );
    });
});
