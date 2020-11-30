import {expect, SDK, spy} from './test/test';

describe('RingCentral.SDK', () => {
    const test = async (suite, server) => {
        suite.timeout(20000); // Per SLA should be 3 seconds

        const sdk = new SDK({
            server,
            clientId: '',
            clientSecret: '',
        });

        const res = await sdk.platform().get('/restapi/v1.0', null, {skipAuthCheck: true});

        await sdk.cache().clean();

        expect((await res.json()).uri).to.equal(`${server}/restapi/v1.0`);
    };

    it('connects to sandbox', async function theTest() {
        return test(this, SDK.server.sandbox);
    });

    it('connects to production', async function theTest() {
        return test(this, SDK.server.production);
    });

    it('sets rate limit', async function rateLimitTest() {
        const sdk = new SDK({handleRateLimit: 60});
        expect(sdk.platform()['_handleRateLimit']).to.equal(60);
    });

    describe('handleLoginRedirect', () => {
        const sdk = new SDK();

        it('handles hash', () => {
            const s = spy();

            const win = {
                location: {hash: '#foo', origin: 'foo'},
                opener: {postMessage: s},
            };

            SDK.handleLoginRedirect(null, win);

            expect(s.getCalls()[0].args[0]).to.deep.equal({RCAuthorizationResponse: '#foo'});
            expect(s.getCalls()[0].args[1]).to.equal('foo');
        });

        it('handles query', () => {
            const s = spy();

            const win = {
                location: {search: '?foo'},
                opener: {postMessage: s},
            };

            SDK.handleLoginRedirect('foo', win);

            expect(s.getCalls()[0].args[0]).to.deep.equal({RCAuthorizationResponse: '?foo'});
            expect(s.getCalls()[0].args[1]).to.equal('foo');
        });
    });
});
