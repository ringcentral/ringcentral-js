describe('RingCentral', function() {

    function test(suite, server, done) {

        suite.timeout(10000); // Per SLA should be 3 seconds

        var sdk = new SDK({server: server, appKey: '', appSecret: ''});

        return sdk.platform().get('', null, {skipAuthCheck: true}).then(function(response) {

            expect(response.json().uri).to.equal(server + '/restapi/v1.0');

            sdk.cache().clean();

        });

    }

    it('connects to sandbox', function() {
        return test(this, SDK.server.sandbox);
    });

    it('connects to production', function() {
        return test(this, SDK.server.production);
    });

});
