import {expect, SDK, spy} from "./test/test";

describe('RingCentral', () => {

    const test = async (suite, server) => {

        suite.timeout(10000); // Per SLA should be 3 seconds

        var sdk = new SDK({
            server: server,
            appKey: '',
            appSecret: ''
        });

        const res = await sdk.platform().get('/restapi/v1.0', null, {skipAuthCheck: true});

        sdk.cache().clean();

        expect(res.json().uri).to.equal(server + '/restapi/v1.0');

    };

    it('connects to sandbox', function() {
        return test(this, SDK.server.sandbox);
    });

    it('connects to production', function() {
        return test(this, SDK.server.production);
    });

    describe('handleLoginRedirect', () => {

        const sdk = new SDK();

        it('handles hash', () => {

            var s = spy();

            var win = {
                location: {hash: '#foo', origin: 'foo'},
                opener: {postMessage: s}
            };

            SDK.handleLoginRedirect(null, win);

            expect(s.getCalls()[0].args[0]).to.deep.equal({RCAuthorizationResponse: '#foo'});
            expect(s.getCalls()[0].args[1]).to.equal('foo');

        });

        it('handles query', () => {

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
