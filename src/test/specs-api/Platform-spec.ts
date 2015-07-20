/// <reference path="../../typings/externals.d.ts" />

export import mocha = require('../mocha-api');

var expect = mocha.chai.expect;
var spy = mocha.sinon.spy;
var rcsdk = mocha.rcsdk;
var accountGenerator = mocha.accountGenerator;
var accountGeneratorHelper = mocha.accountGeneratorHelper;

describe('RCSDK.core.Plafrorm', function() {

    var platform = rcsdk.getPlatform();

    this.timeout(5000);

    describe('authorize', function() {

        accountGeneratorHelper.registerHooks(this, 'platform_messages', 1, false);

        it('authorizes with right credentials', function(done) {

            platform
                .authorize({
                    username: this.accounts[0].mainPhoneNumber,
                    password: this.accounts[0].password
                })
                .then(function(ajax) {
                    expect(ajax.data).to.have.property('access_token').to.be.ok;
                    done();
                })
                .catch(function(e) {
                    done(e);
                });

        });

        it('fails to authorize with wrong data', function(done) {

            platform
                .authorize({
                    username: this.accounts[0].mainPhoneNumber,
                    password: this.accounts[0].password + '-random-stuff'
                })
                .then(function(ajax) {
                    done(new Error('This should not be reached'));
                })
                .catch(function(e) {
                    expect(e.message).to.be.equal('Invalid resource owner credentials.');
                    done();
                });

        });

    });

});
