/// <reference path="../test.ts" />

describe('RingCentral.subscription.Subscription', function() {

    var expect = chai.expect,
        spy = sinon.spy;

    describe('subscribe', function() {

        it('automatically renews subscription', function() {

            return getMock((sdk)=> {

                var subscription = sdk.createSubscription();

                sdk.mockRegistry().subscribeGeneric(60);

                return subscription
                    .register({
                        events: ['foo', 'bar']
                    })
                    .then((res)=> {
                        expect(res.json().expiresIn).to.equal(60);
                    });

            });

        });

    });

    describe.skip('destroy', function() {});

    describe('notify method', function() {

        it('fires a notification event when the notify method is called and passes the message object', function() {

            return getMock((sdk)=> {

                return new Promise((resolve)=> {

                    var subscription = sdk.createSubscription();

                    subscription.setSubscription({
                        id: 'foo',
                        deliveryMode: {
                            subscriberKey: 'foo',
                            address: 'foo'
                        }
                    });

                    subscription.on(subscription.events.notification, function(event) {
                        expect(event).to.deep.equal({foo: 'bar'});
                        resolve();
                    });

                    subscription['_notify']({foo: 'bar'}); // using private API

                })

            });

        });

    });

    describe('renew', function() {

        it('fails when no subscription', function() {

            return getMock((sdk)=> {

                return sdk.createSubscription()
                    .renew()
                    .then(function() {
                        throw new Error('This should not be reached');
                    })
                    .catch(function(e) {
                        expect(e.message).to.equal('Subscription is not alive');
                    });

            });

        });

        it('fails when no eventFilters', function() {

            return getMock((sdk)=> {

                var subscription = sdk.createSubscription();

                subscription.setSubscription({
                    id: 'foo',
                    deliveryMode: {
                        subscriberKey: 'foo',
                        address: 'foo'
                    }
                });

                return subscription
                    .renew()
                    .then(function() {
                        throw new Error('This should not be reached');
                    })
                    .catch(function(e) {
                        expect(e.message).to.equal('Events are undefined');
                    });

            });

        });

    });

    describe('subscribe', function() {

        it('fails when no eventFilters', function() {

            return getMock((sdk)=> {

                return sdk.createSubscription()
                    .subscribe()
                    .then(function() {
                        throw new Error('This should not be reached');
                    })
                    .catch(function(e) {
                        expect(e.message).to.equal('Events are undefined');
                    });

            });

        });

        it('calls the success callback and passes the subscription provided from the platform', function() {

            return getMock((sdk)=> {

                var event = 'foo',
                    subscription = sdk.createSubscription();

                sdk.mockRegistry().subscribeGeneric();

                return subscription
                    .subscribe({
                        events: [event]
                    })
                    .then(function() {
                        expect(subscription.subscription().eventFilters.length).to.equal(1);
                    });

            });

        });

        it('calls the error callback and passes the error provided from the platform', function() {

            return getMock((sdk)=> {

                var subscription = sdk.createSubscription();

                sdk.mockRegistry()
                    .apiCall('POST', '/restapi/v1.0/subscription', {'message': 'Subscription failed'}, 400, 'Bad Request');

                return subscription
                    .subscribe({
                        events: ['foo']
                    })
                    .then(function() {
                        throw new Error('This should never be reached');
                    })
                    .catch(function(e) {

                        expect(e.message).to.equal('Subscription failed');
                        expect(e).to.be.an.instanceOf(Error);

                    });

            });

        });

    });

    describe('decrypt method', function() {

        it('decrypts AES-encrypted messages when the subscription has an encryption key', function() {

            var subscription = getSdk().createSubscription(),
                aesMessage = 'gkw8EU4G1SDVa2/hrlv6+0ViIxB7N1i1z5MU/Hu2xkIKzH6yQzhr3vIc27IAN558kTOkacqE5DkLpRdnN1orwtI' +
                             'BsUHmPMkMWTOLDzVr6eRk+2Gcj2Wft7ZKrCD+FCXlKYIoa98tUD2xvoYnRwxiE2QaNywl8UtjaqpTk1+WDImBrt' +
                             '6uabB1WICY/qE0It3DqQ6vdUWISoTfjb+vT5h9kfZxWYUP4ykN2UtUW1biqCjj1Rb6GWGnTx6jPqF77ud0XgV1r' +
                             'k/Q6heSFZWV/GP23/iytDPK1HGJoJqXPx7ErQU=';

            subscription['_subscription'] = {
                id: 'foo',
                deliveryMode: {
                    encryptionKey: 'e0bMTqmumPfFUbwzppkSbA==',
                    subscriberKey: 'foo',
                    address: 'foo'
                }
            };

            expect(subscription['_decrypt'](aesMessage)).to.deep.equal({
                "timestamp": "2014-03-12T20:47:54.712+0000",
                "body": {
                    "extensionId": 402853446008,
                    "telephonyStatus": "OnHold"
                },
                "event": "/restapi/v1.0/account/~/extension/402853446008/presence",
                "uuid": "db01e7de-5f3c-4ee5-ab72-f8bd3b77e308"
            });

        });

    });

    describe('destroy', function() {

        it('unsubscribes', function() {

            return getMock((sdk)=> {

                var subscription = sdk.createSubscription(),
                    destroySpy = spy(function() {});

                sdk.mockRegistry().subscribeGeneric();

                return subscription
                    .subscribe({
                        events: ['foo']
                    })
                    .then(function() {

                        expect(subscription['_subscription']).not.to.equal(null);

                        subscription['_pubnub'].unsubscribe = destroySpy;

                        subscription.destroy();

                        expect(destroySpy).to.be.calledOnce;

                    });

            });

        });

    });

});
