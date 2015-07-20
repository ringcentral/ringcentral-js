/// <reference path="../typings/externals.d.ts" />

export import mocha = require('../test/mocha');
var expect = mocha.chai.expect;
var spy = mocha.sinon.spy;
var mock = mocha.mock;

describe('RCSDK', function() {

    describe('actual connection', function() {

        it.skip('connects to sandbox', function(done) {

            this.timeout(10000); // Per SLA should be 3 seconds

            var server = mocha.RCSDK.url.sandbox,
                rcsdk = new mocha.RCSDK({server: server, appKey: '', appSecret: ''}),
                platform = rcsdk.getPlatform();

            platform.forceAuthentication();

            platform
                .apiCall({
                    url: ''
                })
                .then(function(ajax) {
                    expect(ajax.data.uri).to.equal(server + '/restapi/v1.0');
                    done();
                })
                .catch(function(e) {
                    done(e);
                });


        });

        it.skip('connects to production', function(done) {

            this.timeout(10000); // Per SLA should be 3 seconds

            var server = mocha.RCSDK.url.production,
                rcsdk = new mocha.RCSDK({server: server, appKey: '', appSecret: ''}),
                platform = rcsdk.getPlatform();

            platform.forceAuthentication();

            platform
                .apiCall({
                    url: ''
                })
                .then(function(ajax) {
                    expect(ajax.data.uri).to.equal(server + '/restapi/v1.0');
                    done();
                })
                .catch(function(e) {
                    done(e);
                });


        });

    });

});
