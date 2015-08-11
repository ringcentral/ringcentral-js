/// <reference path="./test.ts" />

describe('RingCentral', function() {

    var expect = chai.expect;

    function test(suite, server, done) {

        suite.timeout(10000); // Per SLA should be 3 seconds

        var sdk = new RingCentral.sdk.SDK({server: server, appKey: '', appSecret: ''});

        sdk.platform()
            .get('', {skipAuthCheck: true})
            .then(function(ajax) {

                expect(ajax.json().uri).to.equal(server + '/restapi/v1.0');

                sdk.cache().clean();

                done();

            }).catch(done);

    }

    it('connects to sandbox', function(done) {

        test(this, RingCentral.sdk.SDK.server.sandbox, done);

    });

    it('connects to production', function(done) {

        test(this, RingCentral.sdk.SDK.server.production, done);

    });

});
