import {expect, fetchMock, spy} from '@ringcentral/sdk-utils/test';

import {SDK, SDKOptions} from '../SDK';

fetchMock.config.fallbackToNetwork = true;

export function apiCall(method, path, json, status = 200, statusText = 'OK', headers = null) {
    const isJson = typeof json !== 'string';

    if (isJson && !headers) {headers = {'Content-Type': 'application/json'};}

    fetchMock.mock({
        method,
        matcher: `http://whatever${path}`,
        repeat: 1,
        overwriteRoutes: false,
        response: new fetchMock.config.Response(isJson ? JSON.stringify(json) : json, {
            status,
            statusText,
            headers,
        }),
    });
}

export function authentication(status = 200) {
    apiCall(
        'POST',
        '/restapi/oauth/token',
        {
            access_token: 'ACCESS_TOKEN',
            token_type: 'bearer',
            expires_in: 3600,
            refresh_token: 'REFRESH_TOKEN',
            refresh_token_expires_in: 604800,
            scope: 'SMS RCM Foo Boo',
        },
        status,
    );
}

export function logout(status = 200) {
    apiCall('POST', '/restapi/oauth/revoke', {}, status);
}

export function tokenRefresh(failure = false) {
    if (!failure) {
        apiCall('POST', '/restapi/oauth/token', {
            access_token: 'ACCESS_TOKEN_FROM_REFRESH',
            token_type: 'bearer',
            expires_in: 3600,
            refresh_token: 'REFRESH_TOKEN_FROM_REFRESH',
            refresh_token_expires_in: 604800,
            scope: 'SMS RCM Foo Boo',
        });
    } else {
        apiCall(
            'POST',
            '/restapi/oauth/token',
            {
                message: 'Wrong token',
                error_description: 'Wrong token',
                description: 'Wrong token',
            },
            400,
        );
    }
}

export function createSdk(options: SDKOptions = {}) {
    return new SDK({
        server: 'http://whatever',
        clientId: 'whatever',
        clientSecret: 'whatever',
        Request: fetchMock.config.Request,
        Response: fetchMock.config.Response,
        Headers: fetchMock.config.Headers,
        fetch: fetchMock.fetchHandler,
        refreshDelayMs: 1,
        redirectUri: 'http://foo',
        handleRateLimit: false,
        ...options,
    });
}

export function asyncTest(fn: (sdk: SDK) => any, sdkOption: SDKOptions = {}) {
    return async () => {
        const sdk = createSdk(sdkOption); // {cachePrefix: 'prefix-' + Date.now()}

        const clean = async () => {
            fetchMock.restore();
            await sdk.cache().clean();
        };

        try {
            await clean();

            authentication();

            const platform = sdk.platform();

            await platform.login({
                jwt: 'jwt_string',
            });

            await fn(sdk);

            expect(fetchMock.done()).toEqual(true);

            await clean();
        } catch (e) {
            await clean();
            console.error(e.stack); //eslint-disable-line
            throw e;
        }
    };
}

export async function expectThrows(fn, errorText = '', additional = (e?: Error) => {}) {
    try {
        await fn();
        throw new Error('This should not be reached');
    } catch (e) {
        expect(e.message).toContain(errorText);
        await additional(e);
    }
}

export function cleanFetchMock() {
    fetchMock.restore();
}

export function getInitialDiscoveryMockData() {
    return {
        version: '1.0.0',
        retryCount: 3,
        retryInterval: 3,
        discoveryApi: {
            defaultExternalUri: 'http://whatever/.well-known/entry-points/external',
        },
        authApi: {
            authorizationUri: 'http://whatever/restapi/oauth/authorize',
            oidcDiscoveryUri: 'http://whatever/.well-known/openid-configuration',
            defaultTokenUri: 'http://whatever/restapi/oauth/token',
        },
        coreApi: {
            baseUri: 'http://whatever',
        },
    };
}

export function getExternalDiscoveryMockData() {
    return {
        version: '1.0.0',
        expiresIn: 86400,
        retryCount: 3,
        retryInterval: 3,
        retryCycleDelay: 824,
        discoveryApi: {
            initialUri: 'http://whatever/.well-known/entry-points/initial',
            externalUri: 'http://whatever/.well-known/entry-points/external',
        },
        authApi: {
            authorizationUri: 'http://whatever/restapi/oauth/authorize',
            oidcDiscoveryUri: 'http://whatever/.well-known/openid-configuration',
            baseUri: 'http://whatever',
            tokenUri: 'http://whatever/restapi/oauth/token',
        },
        rcv: {
            baseApiUri: 'http://whatever',
        },
        coreApi: {
            baseUri: 'http://whatever',
            pubnubOrigin: 'whatever',
        },
    };
}

export {expect, SDK, spy};
