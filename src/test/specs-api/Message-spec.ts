/// <reference path="../../typings/externals.d.ts" />

export import mocha = require('../mocha-api');
var expect = mocha.chai.expect;
var spy = mocha.sinon.spy;
var rcsdk = mocha.rcsdk;
var accountGenerator = mocha.accountGenerator;
var accountGeneratorHelper = mocha.accountGeneratorHelper;

describe('RCSDK.helpers.Message', function() {

    var platform = rcsdk.getPlatform(),
        Message = rcsdk.getMessageHelper(),
        PhoneNumber = rcsdk.getPhoneNumberHelper();

    this.timeout(5000);

    describe('saveRequest', function() {

        accountGeneratorHelper.registerHooks(this, 'platform_messages', 1, false);

        it('sends message', function(done) {

            platform
                .authorize({
                    username: this.accounts[0].mainPhoneNumber,
                    password: this.accounts[0].password
                })
                .then(function(ajax) {

                    return platform.apiCall({
                        url: PhoneNumber.createUrl({extensionId: '~'}),
                        get: {perPage: 'max'}
                    });

                })
                .then(function(numbersAjax:any) {

                    return numbersAjax.data.records.filter(PhoneNumber.filter({
                        type: 'Sms'
                    }))[0];

                })
                .then(function(number) {

                    if (!number) throw new Error('No SMS-enabled phone numbers');

                    return platform.apiCall({
                        method: 'POST',
                        url: Message.createUrl({sms: true}),
                        post: {
                            from: number.phoneNumber,
                            to: number.phoneNumber,
                            text: 'foo'
                        }
                    });

                })
                .then(function(messageAjax:any) {

                    expect(messageAjax.data.subject).to.equal('foo');

                })
                .catch(done);

        });

    });

});