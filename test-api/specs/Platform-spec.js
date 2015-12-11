import {expect, getSdk, accountGenerator, accountGeneratorHelper, spy} from '../test';

describe('Platform', function() {

    var rcsdk = getSdk();
    var platform = rcsdk.platform();

    this.timeout(5000);

    describe('authorize', function() {

        it('authorizes with right credentials', accountGeneratorHelper.asyncTest(async function(accounts) {

            var data = (await platform.login({
                username: accounts[0].mainPhoneNumber,
                password: accounts[0].password
            })).json();

            expect(data).to.have.property('access_token').to.be.ok;

        }));

        it('fails to authorize with wrong data', accountGeneratorHelper.asyncTest(async function(accounts) {

            try {

                (await platform.login({
                    username: accounts[0].mainPhoneNumber,
                    password: accounts[0].password + '-random-stuff'
                }));

                throw new Error('This should not be reached');

            } catch (e) {
                expect(e.message).to.be.equal('Invalid resource owner credentials.');
            }

        }));

    });

});
