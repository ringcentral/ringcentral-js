import {expect, getSdk, accountGenerator, accountGeneratorHelper, spy} from '../test';

describe('Message', function() {

    var rcsdk = getSdk();
    var platform = rcsdk.platform();

    this.timeout(10000); //FIXME

    describe('SMS', function() {

        it('sends', accountGeneratorHelper.asyncTest(async function(accounts) {

            await platform.login({
                username: accounts[0].mainPhoneNumber,
                password: accounts[0].password
            });

            var number = (await platform
                .get('/account/~/extension/~/phone-number', {
                    query: {perPage: 'max'}
                }))
                .json()
                .records
                .filter((number)=> {
                    return number.features.indexOf('SmsSender');
                })[0];


            if (!number) throw new Error('No SMS-enabled phone numbers');

            var message = (await platform.post('/account/~/extension/~/sms', {
                from: {phoneNumber: number.phoneNumber},
                to: [
                    {phoneNumber: number.phoneNumber}
                ],
                text: 'foo'
            })).json();

            expect(message.subject).to.equal('foo');

        }));

    });

});