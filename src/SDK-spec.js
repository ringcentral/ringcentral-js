describe('RingCentral', function() {

    function test(suite, server, done) {

        suite.timeout(10000); // Per SLA should be 3 seconds

        var sdk = new SDK({server: server, appKey: '', appSecret: ''});

        return sdk.platform().get('', null, {skipAuthCheck: true}).then(function(response) {

            expect(response.json().uri).to.equal(server + '/restapi/v1.0');

            sdk.cache().clean();

        });

    }

    it.skip('connects to sandbox', function() {
        return test(this, SDK.server.sandbox);
    });

    it.skip('connects to production', function() {
        return test(this, SDK.server.production);
    });

    describe('handleLoginRedirect', function() {

        var sdk = new SDK({});

        it('handles hash', function() {

            var s = spy();

            var win = {
                location: {hash: '#foo', origin: 'foo'},
                opener: {postMessage: s}
            };

            SDK.handleLoginRedirect(null, win);

            expect(s.getCalls()[0].args[0]).to.deep.equal({RCAuthorizationResponse: '#foo'});
            expect(s.getCalls()[0].args[1]).to.equal('foo');

        });

        it('handles query', function() {

            var s = spy();

            var win = {
                location: {search: '?foo'},
                opener: {postMessage: s}
            };

            SDK.handleLoginRedirect('foo', win);

            expect(s.getCalls()[0].args[0]).to.deep.equal({RCAuthorizationResponse: '?foo'});
            expect(s.getCalls()[0].args[1]).to.equal('foo');

        });

    });

});
