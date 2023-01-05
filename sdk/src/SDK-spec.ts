import {expect, SDK, spy} from './test/test';

describe('RingCentral.SDK', () => {
    it('connects to sandbox', async function theTest() {
        this.timeout(20000);
        const server = SDK.server.sandbox;
        const sdk = new SDK({
            server,
            clientId: '',
            clientSecret: '',
        });

        // sandbox's /restapi/v1.0 throws a weird error, but /restapi/v1.0/status works fine
        const res = await sdk.platform().get('/restapi/v1.0/status', null, {skipAuthCheck: true});

        await sdk.cache().clean();

        expect(res.status).to.equal(200);
    });

    it('connects to production', async function theTest() {
        this.timeout(20000);
        const server = SDK.server.production;
        const sdk = new SDK({
            server,
            clientId: '',
            clientSecret: '',
        });

        // production's /restapi/v1.0/status triggers service overloaded very easily, but /restapi/v1.0 works fine
        const res = await sdk.platform().get('/restapi/v1.0', null, {skipAuthCheck: true});

        await sdk.cache().clean();

        expect(res.status).to.equal(200);
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
