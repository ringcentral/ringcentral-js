import {expect, SDK, spy} from './test/test';

describe('RingCentral.SDK', () => {
    it('connects to production', async function theTest() {
        const server = SDK.server.production;
        const sdk = new SDK({
            server,
            clientId: '',
            clientSecret: '',
        });

        // production's /restapi/v1.0/status triggers service overloaded very easily, but /restapi/v1.0 works fine
        const res = await sdk.platform().get('/restapi/v1.0', null, {skipAuthCheck: true});

        await sdk.cache().clean();

        expect(res.status).toEqual(200);
    });

    it('sets rate limit', async function rateLimitTest() {
        const sdk = new SDK({handleRateLimit: 60});
        expect(sdk.platform()['_handleRateLimit']).toEqual(60);
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

            expect(s.mock.calls[0][0]).toEqual({RCAuthorizationResponse: '#foo'});
            expect(s.mock.calls[0][1]).toEqual('foo');
        });

        it('handles query', () => {
            const s = spy();

            const win = {
                location: {search: '?foo'},
                opener: {postMessage: s},
            };

            SDK.handleLoginRedirect('foo', win);

            expect(s.mock.calls[0][0]).toEqual({RCAuthorizationResponse: '?foo'});
            expect(s.mock.calls[0][1]).toEqual('foo');
        });
    });
});
