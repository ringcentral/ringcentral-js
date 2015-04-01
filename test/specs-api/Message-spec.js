/// <reference path="../../typings/tsd.d.ts" />
exports.mocha = require('../mocha-api');
var expect = exports.mocha.chai.expect;
var spy = exports.mocha.sinon.spy;
var rcsdk = exports.mocha.rcsdk;
var accountGenerator = exports.mocha.accountGenerator;
var accountGeneratorHelper = exports.mocha.accountGeneratorHelper;
describe('RCSDK.helpers.Message', function () {
    var platform = rcsdk.getPlatform(), Message = rcsdk.getMessageHelper(), PhoneNumber = rcsdk.getPhoneNumberHelper();
    this.timeout(5000);
    describe('saveRequest', function () {
        accountGeneratorHelper.registerHooks(this, 'platform_messages', 1, false);
        it('sends message', function (done) {
            platform.authorize({
                username: this.accounts[0].mainPhoneNumber,
                password: this.accounts[0].password
            }).then(function (ajax) {
                return platform.apiCall({
                    url: PhoneNumber.createUrl({ extensionId: '~' }),
                    get: { perPage: 'max' }
                });
            }).then(function (numbersAjax) {
                return numbersAjax.data.records.filter(PhoneNumber.filter({
                    type: 'Sms'
                }))[0];
            }).then(function (number) {
                if (!number)
                    throw new Error('No SMS-enabled phone numbers');
                return platform.apiCall({
                    method: 'POST',
                    url: Message.createUrl({ sms: true }),
                    post: {
                        from: number.phoneNumber,
                        to: number.phoneNumber,
                        text: 'foo'
                    }
                });
            }).then(function (messageAjax) {
                expect(messageAjax.data.subject).to.equal('foo');
            }).catch(done);
        });
    });
});
