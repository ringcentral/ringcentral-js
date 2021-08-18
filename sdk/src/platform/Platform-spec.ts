import {
    apiCall,
    asyncTest,
    authentication,
    expect,
    expectThrows,
    logout,
    spy,
    tokenRefresh,
    createSdk,
    cleanFetchMock,
    getInitialDiscoveryMockData,
    getExternalDiscoveryMockData,
} from '../test/test';

const globalAny: any = global;
const windowAny: any = typeof window !== 'undefined' ? window : global;

describe('RingCentral.platform.Platform', () => {
    describe('isTokenValid', () => {
        it(
            'is not authenticated when token has expired',
            asyncTest(async sdk => {
                const platform = sdk.platform();

                await platform.auth().cancelAccessToken();

                expect(await platform.auth().accessTokenValid()).to.equal(false);
            }),
        );

        it(
            'is not authenticated after logout',
            asyncTest(async sdk => {
                logout();

                const platform = sdk.platform();

                await platform.logout();

                expect(await platform.auth().accessTokenValid()).to.equal(false);
            }),
        );
    });

    describe('authorized', () => {
        it(
            'initiates refresh if not authorized',
            asyncTest(async sdk => {
                tokenRefresh();

                const platform = sdk.platform();

                expect((await platform.auth().data()).access_token).to.not.equal('ACCESS_TOKEN_FROM_REFRESH');

                await platform.auth().cancelAccessToken();

                await platform.loggedIn();

                expect((await platform.auth().data()).access_token).to.equal('ACCESS_TOKEN_FROM_REFRESH');
            }),
        );
    });

    describe('login', () => {
        it(
            'login with code',
            asyncTest(async sdk => {
                const platform = sdk.platform();

                await platform.auth().cancelAccessToken();

                authentication();

                await platform.login({
                    code: 'foo',
                    access_token_ttl: 100,
                    refresh_token_ttl: 100,
                });

                expect((await platform.auth().data()).access_token).to.equal('ACCESS_TOKEN');
            }),
        );

        it(
            'login with code from usePKCE flow without client secret',
            asyncTest(
                async sdk => {
                    const platform = sdk.platform();

                    await platform.auth().cancelAccessToken();
                    platform.loginUrl({usePKCE: true});
                    authentication();

                    await platform.login({
                        code: 'foo',
                        access_token_ttl: 100,
                        refresh_token_ttl: 100,
                    });
                    const authData = await platform.auth().data();
                    expect(authData.access_token).to.equal('ACCESS_TOKEN');
                    expect(authData.code_verifier).not.to.be.empty;
                },
                {
                    clientSecret: '',
                },
            ),
        );

        it(
            'login with code and code_verifier',
            asyncTest(
                async sdk => {
                    authentication();
                    const platform = sdk.platform();
                    await platform.login({code: 'test', code_verifier: 'test_code_verifier'});
                    const authData = await platform.auth().data();
                    expect(authData.code_verifier).to.equal('test_code_verifier');
                },
                {
                    clientSecret: '',
                },
            ),
        );

        it(
            'login with code and code_verifier with client secret',
            asyncTest(async sdk => {
                authentication();
                const platform = sdk.platform();
                const client = sdk.client();
                let request;
                client.on(client.events.requestSuccess, (_, r) => {
                    request = r;
                });
                await platform.login({code: 'test', code_verifier: 'test_code_verifier'});
                expect(request.headers.get('authorization')).not.to.equal(null);
                const authData = await platform.auth().data();
                expect(authData.access_token).to.equal('ACCESS_TOKEN');
                expect(authData.code_verifier).to.equal('test_code_verifier');
            }),
        );

        it(
            'login with code without clientSecret',
            asyncTest(
                async sdk => {
                    authentication();
                    const platform = sdk.platform();
                    const client = sdk.client();
                    let request;
                    client.on(client.events.requestSuccess, (_, r) => {
                        request = r;
                    });
                    await platform.login({code: 'test'});
                    expect(request.headers.get('authorization')).to.equal(null);
                    expect(request.body || request.originalBody).have.string('client_id=whatever');
                    const authData = await platform.auth().data();
                    expect(authData.access_token).to.equal('ACCESS_TOKEN');
                },
                {
                    clientSecret: '',
                },
            ),
        );

        it(
            'login with access_token',
            asyncTest(async sdk => {
                const platform = sdk.platform();

                await platform.auth().cancelAccessToken();

                authentication();

                await platform.login({access_token: 'foo'});

                expect((await platform.auth().data()).access_token).to.equal('foo');
            }),
        );

        it(
            'login error',
            asyncTest(async sdk => {
                const platform = sdk.platform();

                await platform.auth().cancelAccessToken();

                apiCall('POST', '/restapi/oauth/token', {message: 'expected'}, 400);

                await expectThrows(async () => platform.login({code: 'foo'}), 'expected');
            }),
        );
    });

    describe('loggedIn', () => {
        it(
            'returns false if refresh failed',
            asyncTest(async sdk => {
                const platform = sdk.platform();

                await platform.auth().cancelAccessToken();

                apiCall('POST', '/restapi/oauth/token', {message: 'expected'}, 400);

                const res = await platform.loggedIn();

                expect(res).to.equal(false);
            }),
        );
    });

    describe('sendRequest', () => {
        it(
            'refreshes token when token was expired',
            asyncTest(async sdk => {
                const platform = sdk.platform();
                const path = '/restapi/xxx';
                const refreshSpy = spy(() => {});

                tokenRefresh();
                apiCall('GET', path, {});

                expect((await platform.auth().data()).access_token).to.not.equal('ACCESS_TOKEN_FROM_REFRESH');

                await platform.auth().cancelAccessToken();

                await platform.on(platform.events.refreshSuccess, refreshSpy).get(path);

                expect(refreshSpy.calledOnce).to.be.true;
                expect((await platform.auth().data()).access_token).to.equal('ACCESS_TOKEN_FROM_REFRESH');
            }),
        );

        it(
            'tries to refresh the token if Platform returns 401 Unauthorized and re-executes the request',
            asyncTest(async sdk => {
                const platform = sdk.platform();
                const path = '/restapi/xxx';
                const response = {foo: 'bar'};
                const refreshSpy = spy(() => {
                    apiCall('GET', path, response, 200);
                });

                apiCall('GET', path, {message: 'time not in sync'}, 401, 'Time Not In Sync');
                tokenRefresh();

                platform.on(platform.events.refreshSuccess, refreshSpy);

                const res = await platform.get(path);

                expect(refreshSpy.calledOnce).to.be.true;
                expect(await res.json()).to.deep.equal(response);
                expect((await platform.auth().data()).access_token).to.equal('ACCESS_TOKEN_FROM_REFRESH');
            }),
        );

        it(
            'fails if ajax has status other than 2xx',
            asyncTest(async sdk => {
                const platform = sdk.platform();
                const path = '/restapi/xxx';

                apiCall('GET', path, {description: 'Fail'}, 400, 'Bad Request');

                await expectThrows(async () => platform.get(path), 'Fail');
            }),
        );

        it(
            'handles rate limit 429',
            asyncTest(async sdk => {
                const platform = sdk.platform();
                const path = '/restapi/xxx';
                const response = {foo: 'bar'};
                const rateLimitSpy = spy(() => {
                    apiCall('GET', path, response, 200);
                });

                apiCall('GET', path, {message: 'expected'}, 429, 'Rate Limit Exceeded');

                platform.on(platform.events.rateLimitError, rateLimitSpy);

                const res = await platform.get(path, null, {handleRateLimit: 0.01});

                expect(rateLimitSpy.calledOnce).to.be.true;

                const e = rateLimitSpy.getCalls()[0].args[0];
                expect(e.message).to.equal('expected');
                expect(e.retryAfter).to.equal(10);

                expect(await res.json()).to.deep.equal(response);
            }),
        );

        it(
            'handles default rate limit 429',
            asyncTest(async sdk => {
                const platform = sdk.platform();
                const path = '/restapi/xxx';
                const response = {foo: 'bar'};
                const rateLimitSpy = spy(() => {
                    apiCall('GET', path, response, 200);
                });

                platform['_handleRateLimit'] = 0.01;

                apiCall('GET', path, {message: 'expected'}, 429, 'Rate Limit Exceeded');

                platform.on(platform.events.rateLimitError, rateLimitSpy);

                const res = await platform.get(path);

                expect(rateLimitSpy.calledOnce).to.be.true;

                const e = rateLimitSpy.getCalls()[0].args[0];
                expect(e.message).to.equal('expected');
                expect(e.retryAfter).to.equal(10);

                expect(await res.json()).to.deep.equal(response);
            }),
        );

        it(
            'emits rate limit 429 errors if they are not handled',
            asyncTest(async sdk => {
                const platform = sdk.platform();
                const path = '/restapi/xxx';
                const rateLimitSpy = spy(() => {});

                apiCall('GET', path, {message: 'expected'}, 429, 'Rate Limit Exceeded');

                platform.on(platform.events.rateLimitError, rateLimitSpy);

                await expectThrows(async () => platform.get(path), '', err => {
                    expect(rateLimitSpy.calledOnce).to.be.true;

                    const e = rateLimitSpy.getCalls()[0].args[0];
                    expect(e.message).to.equal('expected');
                    expect(e.retryAfter).to.equal(60000);

                    expect(err).to.equal(e);
                });
            }),
        );
    });

    describe('refresh', () => {
        it(
            'handles error in queued AJAX after unsuccessful refresh when token is killed',
            asyncTest(async sdk => {
                const platform = sdk.platform();
                const path = '/restapi/xxx';
                const successSpy = spy(() => {});
                const errorSpy = spy(() => {});

                tokenRefresh(true);

                await platform.auth().cancelAccessToken();

                await expectThrows(
                    async () =>
                        platform
                            .on(platform.events.refreshSuccess, successSpy)
                            .on(platform.events.refreshError, errorSpy)
                            .get(path),
                    'Wrong token',
                );

                expect(errorSpy.calledOnce).to.be.true;
                expect(successSpy.calledOnce).to.be.false;
            }),
        );

        it(
            'handles subsequent refreshes',
            asyncTest(async sdk => {
                const platform = sdk.platform();

                tokenRefresh();
                tokenRefresh();
                tokenRefresh();

                await platform.refresh(); // first
                await platform.refresh(); // second
                await Promise.all([
                    platform.refresh(), // third combined for two
                    platform.refresh(),
                ]);
            }),
        );

        it(
            'returns error if response is malformed',
            asyncTest(async sdk => {
                const platform = sdk.platform();

                apiCall(
                    'POST',
                    '/restapi/oauth/token',
                    {
                        message: 'Wrong token',
                        error_description: 'Wrong token',
                        description: 'Wrong token',
                    },
                    240,
                ); // This weird status was caught on client's machine

                await platform.auth().cancelAccessToken();

                await expectThrows(async () => platform.refresh(), 'Wrong token', (e: any) => {
                    expect(e.originalMessage).to.equal('Malformed OAuth response');
                });
            }),
        );

        it(
            'issues only one refresh request',
            asyncTest(async sdk => {
                tokenRefresh();
                apiCall('GET', '/restapi/v1.0/foo/1', {increment: 1});
                apiCall('GET', '/restapi/v1.0/foo/2', {increment: 2});
                apiCall('GET', '/restapi/v1.0/foo/3', {increment: 3});

                const platform = sdk.platform();

                await platform.auth().cancelAccessToken();

                const res = await Promise.all(
                    (await Promise.all([
                        platform.get('/restapi/v1.0/foo/1'),
                        platform.get('/restapi/v1.0/foo/2'),
                        platform.get('/restapi/v1.0/foo/3'),
                    ])).map(r => r.json()),
                );

                expect((await platform.auth().data()).access_token).to.equal('ACCESS_TOKEN_FROM_REFRESH');
                expect(res[0].increment).to.equal(1);
                expect(res[1].increment).to.equal(2);
                expect(res[2].increment).to.equal(3);
            }),
        );

        it(
            'not skip auth header when auth data with clientSecret',
            asyncTest(async sdk => {
                tokenRefresh();

                const platform = sdk.platform();
                const client = sdk.client();
                await platform.auth().cancelAccessToken();
                let request;
                client.on(client.events.requestSuccess, (_, r) => {
                    request = r;
                });
                await platform.refresh();
                expect(request.headers.get('authorization')).not.to.equal(null);
                expect((await platform.auth().data()).access_token).to.equal('ACCESS_TOKEN_FROM_REFRESH');
            }),
        );

        it(
            'skip auth header when auth data without client secret',
            asyncTest(
                async sdk => {
                    tokenRefresh();

                    const platform = sdk.platform();
                    const client = sdk.client();
                    await platform.auth().cancelAccessToken();
                    let request;
                    client.on(client.events.requestSuccess, (_, r) => {
                        request = r;
                    });
                    await platform.refresh();
                    expect(request.headers.get('authorization')).to.equal(null);
                    expect(request.body || request.originalBody).have.string('client_id=whatever');
                    const authData = await platform.auth().data();
                    expect(authData.access_token).to.equal('ACCESS_TOKEN_FROM_REFRESH');
                },
                {
                    clientSecret: '',
                },
            ),
        );
    });

    describe('get, post, put, patch, delete', () => {
        it(
            'sends request using appropriate method',
            asyncTest(async sdk => {
                const platform = sdk.platform();

                const test = async method => {
                    const path = `/restapi/v1.0/foo/${method}`;

                    apiCall(method, path, {foo: 'bar'});

                    const res = await platform[method](path);
                    expect((await res.json()).foo).to.equal('bar');
                };

                await test('get');
                await test('post');
                await test('put');
                await test('patch');
                await test('delete');
            }),
        );

        it(
            'send request with user agent option',
            asyncTest(async sdk => {
                const platform = sdk.platform();
                const client = sdk.client();
                const path = `/restapi/v1.0/foo/get`;

                apiCall('get', path, {foo: 'bar'});
                let request;
                client.on(client.events.requestSuccess, (_, r) => {
                    request = r;
                });
                await platform.get(path, null, {userAgent: 'TestAgent'});
                expect(request.headers.get('x-user-agent')).have.string('TestAgent');
            }),
        );
    });

    describe('createUrl', () => {
        it(
            'builds the URL',
            asyncTest(async sdk => {
                const platform = sdk.platform();

                expect(platform.createUrl('/restapi/v1.0/foo')).to.equal('/restapi/v1.0/foo');

                expect(platform.createUrl('/restapi/v1.0/foo', {addServer: true})).to.equal(
                    'http://whatever/restapi/v1.0/foo',
                );

                expect(
                    await platform.signUrl(
                        platform.createUrl('/restapi/v1.0/foo', {
                            addServer: true,
                        }),
                    ),
                ).to.equal('http://whatever/restapi/v1.0/foo?access_token=ACCESS_TOKEN');

                expect(
                    await platform.signUrl(
                        platform.createUrl('/restapi/v1.0/foo?bar', {
                            addServer: true,
                        }),
                    ),
                ).to.equal('http://whatever/restapi/v1.0/foo?bar&access_token=ACCESS_TOKEN');

                expect(
                    await platform.signUrl(
                        platform.createUrl('/restapi/v1.0/foo?bar', {
                            addServer: true,
                            addMethod: 'POST',
                        }),
                    ),
                ).to.equal('http://whatever/restapi/v1.0/foo?bar&_method=POST&access_token=ACCESS_TOKEN');

                expect(
                    await platform.signUrl(
                        platform.createUrl('/rcvideo/v1/foo?bar', {
                            addServer: true,
                        }),
                    ),
                ).to.equal('http://whatever/rcvideo/v1/foo?bar&access_token=ACCESS_TOKEN');
            }),
        );
    });

    describe('parseLoginRedirect', () => {
        describe('Authorization Code Flow', () => {
            it(
                'parses url correctly',
                asyncTest(async sdk => {
                    const platform = sdk.platform();
                    expect(platform.parseLoginRedirect('?code=foo')).to.deep.equal({code: 'foo'});
                }),
            );
        });
        describe('Implicit Grant Flow', () => {
            it(
                'parses url correctly',
                asyncTest(async sdk => {
                    const platform = sdk.platform();
                    expect(platform.parseLoginRedirect('#access_token=foo')).to.deep.equal({access_token: 'foo'});
                }),
            );
        });
    });

    describe('loginUrl', () => {
        it(
            'simple usage',
            asyncTest(async sdk => {
                const platform = sdk.platform();

                expect(
                    platform.loginUrl({
                        implicit: true,
                        state: 'foo',
                        brandId: 'foo',
                        display: 'foo',
                        prompt: 'foo',
                    }),
                ).to.equal(
                    'http://whatever/restapi/oauth/authorize?response_type=token&redirect_uri=http%3A%2F%2Ffoo&client_id=whatever&state=foo&brand_id=foo&display=foo&prompt=foo&ui_options=&ui_locales=&localeId=',
                );

                expect(
                    platform.loginUrl({
                        implicit: false,
                        state: 'foo',
                        brandId: 'foo',
                        display: 'foo',
                        prompt: 'foo',
                    }),
                ).to.equal(
                    'http://whatever/restapi/oauth/authorize?response_type=code&redirect_uri=http%3A%2F%2Ffoo&client_id=whatever&state=foo&brand_id=foo&display=foo&prompt=foo&ui_options=&ui_locales=&localeId=',
                );

                expect(
                    platform.loginUrl({
                        implicit: false,
                    }),
                ).to.equal(
                    'http://whatever/restapi/oauth/authorize?response_type=code&redirect_uri=http%3A%2F%2Ffoo&client_id=whatever&state=&brand_id=&display=&prompt=&ui_options=&ui_locales=&localeId=',
                );

                expect(
                    platform.loginUrl({
                        usePKCE: true,
                    }),
                ).to.have.string('code_challenge');

                expect(
                    platform.loginUrl.bind(platform, {
                        implicit: true,
                        usePKCE: true,
                    }),
                ).to.throw('PKCE only works with Authrization Code Flow');

                expect(
                    platform.loginUrl({
                        implicit: false,
                        uiOptions: ['foo', 'bar'],
                        responseHint: ['baz', 'quux'],
                    }),
                ).to.equal(
                    'http://whatever/restapi/oauth/authorize?response_type=code&redirect_uri=http%3A%2F%2Ffoo&client_id=whatever&state=&brand_id=&display=&prompt=&ui_options=foo&ui_options=bar&ui_locales=&localeId=&response_hint=baz&response_hint=quux',
                );

                expect(
                    platform.loginUrl({
                        implicit: false,
                        uiOptions: 'foo',
                        responseHint: 'bar',
                    }),
                ).to.equal(
                    'http://whatever/restapi/oauth/authorize?response_type=code&redirect_uri=http%3A%2F%2Ffoo&client_id=whatever&state=&brand_id=&display=&prompt=&ui_options=foo&ui_locales=&localeId=&response_hint=bar',
                );
            }),
        );
    });

    describe('loginWindow', () => {
        const isNode = typeof window !== 'undefined';

        if (!isNode) {
            globalAny.window = {
                screenLeft: 0,
                screenTop: 0,
                location: {
                    origin: '',
                },
            };
            globalAny.screen = {
                left: 0,
                top: 0,
                width: 0,
                height: 0,
            };
            globalAny.document = {
                documentElement: {
                    clientWidth: 0,
                    clientHeight: 0,
                },
            };
        }

        window.addEventListener = (eventName, cb, bubble) => {
            windowAny.triggerEvent = mock => {
                cb(mock);
            };
        };

        it(
            'simple usage',
            asyncTest(async sdk => {
                const platform = sdk.platform();
                const close = spy();
                const focus = spy();
                const openSpy = spy(() => ({
                    close,
                    focus,
                }));

                window.open = openSpy;

                window.removeEventListener = spy();

                setTimeout(() => {
                    windowAny.triggerEvent({origin: 'bar'});
                    windowAny.triggerEvent({origin: 'foo', data: {foo: 'bar'}});
                    windowAny.triggerEvent({origin: 'foo', data: {RCAuthorizationResponse: '#access_token=foo'}});
                }, 10);

                const res = await platform.loginWindow({
                    url: 'foo',
                    origin: 'foo',
                });

                expect(res.access_token).to.equal('foo');
                expect(close.calledOnce).to.be.true;
                expect(focus.calledOnce).to.be.true;
                expect(openSpy.calledOnce).to.be.true;
            }),
        );

        it(
            'throws an exception if no code and token',
            asyncTest(async sdk => {
                const platform = sdk.platform();
                const openSpy = spy(() => ({close: spy()}));

                window.open = openSpy;

                setTimeout(() => {
                    windowAny.triggerEvent({origin: 'foo', data: {RCAuthorizationResponse: '#bar=foo'}});
                }, 10);

                await expectThrows(async () => {
                    await platform.loginWindow({
                        url: 'foo',
                        origin: 'foo',
                    });
                }, 'No authorization code or token');

                expect(openSpy.calledOnce).to.be.true;
            }),
        );

        it(
            'throws an exception if window cannot be open',
            asyncTest(async sdk => {
                const platform = sdk.platform();
                const openSpy = spy(() => null);

                window.open = openSpy;

                await expectThrows(async () => {
                    await platform.loginWindow({
                        url: 'foo',
                        origin: 'foo',
                    });
                }, 'Could not open login window. Please allow popups for this site');

                expect(openSpy.calledOnce).to.be.true;
            }),
        );
    });

    describe('parseLoginRedirect', () => {
        it(
            'parses redirect URIs with hash',
            asyncTest(async sdk => {
                const platform = sdk.platform();
                expect(platform.parseLoginRedirect('#access_token=foo').access_token).to.equal('foo');
            }),
        );
        it(
            'parses redirect URIs with query',
            asyncTest(async sdk => {
                const platform = sdk.platform();
                expect(platform.parseLoginRedirect('?access_token=foo').access_token).to.equal('foo');
            }),
        );
        it(
            'parses redirect URIs with errors',
            asyncTest(async sdk => {
                const platform = sdk.platform();
                expect(() => {
                    platform.parseLoginRedirect('?error_description=foo');
                }).to.throw('foo');
                expect(() => {
                    platform.parseLoginRedirect('?error=foo');
                }).to.throw('foo');
                expect(() => {
                    platform.parseLoginRedirect('xxx');
                }).to.throw('Unable to parse response');
            }),
        );
    });

    describe('logout', () => {
        it(
            'should skip auth header when auth without client secret',
            asyncTest(
                async sdk => {
                    logout();
                    const platform = sdk.platform();
                    const client = sdk.client();
                    await platform.auth().setData({
                        code_verifier: '1212121',
                    });
                    let request;
                    client.on(client.events.requestSuccess, (_, r) => {
                        request = r;
                    });
                    await platform.logout();
                    expect(request.headers.get('authorization')).to.equal(null);
                    expect(request.body || request.originalBody).have.string('client_id=whatever');
                    expect(await platform.auth().accessTokenValid()).to.equal(false);
                },
                {clientSecret: ''},
            ),
        );
    });

    describe('discovery initial', () => {
        let sdk;

        beforeEach(() => {
            cleanFetchMock();
        });

        afterEach(async () => {
            await sdk.cache().clean();
        });

        it('should fetch initial discovery and set auth endpoint on init', async () => {
            const initialDiscoveryData = getInitialDiscoveryMockData();
            apiCall('GET', '/.well-known/entry-points/initial?clientId=whatever', initialDiscoveryData);
            sdk = createSdk({enableDiscovery: true, discoveryServer: 'http://whatever', server: ''});
            const platform = sdk.platform();
            if (platform.discoveryInitPromise) {
                await platform.discoveryInitPromise;
            }
            const loginUrl = platform.loginUrl();
            expect(loginUrl.indexOf(initialDiscoveryData.authApi.authorizationUri)).to.equal(0);
            expect(loginUrl.indexOf('discovery=true') > -1).to.equal(true);
            expect((await platform.discovery().initialData()).discoveryApi.defaultExternalUri).to.equal(
                initialDiscoveryData.discoveryApi.defaultExternalUri,
            );
        });

        it('should throw error when client id is blank', async () => {
            const initialDiscoveryData = getInitialDiscoveryMockData();
            apiCall('GET', '/.well-known/entry-points/initial?clientId=whatever', initialDiscoveryData);
            sdk = createSdk({
                enableDiscovery: true,
                discoveryServer: 'http://whatever',
                discoveryAutoInit: false,
                server: '',
                clientId: '',
            });
            const platform = sdk.platform();
            let error;
            try {
                await platform.initDiscovery();
            } catch (e) {
                error = e;
            }
            expect(error.message).to.equal('Client Id is required for discovery');
        });

        it('should emit initialFetchError error after 3 retry', async function() {
            this.timeout(20000);
            apiCall('GET', '/.well-known/entry-points/initial?clientId=whatever', {description: 'Fail'}, 500);
            apiCall('GET', '/.well-known/entry-points/initial?clientId=whatever', {description: 'Fail'}, 500);
            apiCall('GET', '/.well-known/entry-points/initial?clientId=whatever', {description: 'Fail'}, 500);
            const sdk = createSdk({enableDiscovery: true, discoveryServer: 'http://whatever', server: ''});
            const platform = sdk.platform();
            const requestErrorSpy = spy(() => {});
            sdk.client().on(sdk.client().events.requestError, requestErrorSpy);
            if (platform.discoveryInitPromise) {
                try {
                    await platform.discoveryInitPromise;
                } catch (e) {
                    // ignore
                }
            }
            const discovery = platform.discovery();
            expect(discovery.initialized).to.equal(false);
            expect(requestErrorSpy.calledThrice).to.equal(true);
            let loginUrlError = false;
            try {
                platform.loginUrl();
            } catch (e) {
                loginUrlError = true;
            }
            expect(loginUrlError).to.equal(true);
        });

        it('should fetch initial discovery on loginUrlWithDiscovery', async () => {
            const initialDiscoveryData = getInitialDiscoveryMockData();
            apiCall('GET', '/.well-known/entry-points/initial?clientId=whatever', initialDiscoveryData);
            const sdk = createSdk({enableDiscovery: true, discoveryServer: 'http://whatever', server: ''});
            const platform = sdk.platform();
            expect(
                (await platform.loginUrlWithDiscovery()).indexOf(initialDiscoveryData.authApi.authorizationUri),
            ).to.equal(0);
        });

        it('should fetch external discovery when login with discovery_uri and token_uri', async () => {
            // mock
            const initialDiscoveryData = getInitialDiscoveryMockData();
            const externalDiscoveryData = getExternalDiscoveryMockData();
            apiCall('GET', '/.well-known/entry-points/initial?clientId=whatever', initialDiscoveryData);
            apiCall('GET', '/.well-known/entry-points/external', externalDiscoveryData);
            authentication();

            const sdk = createSdk({enableDiscovery: true, discoveryServer: 'http://whatever', server: ''});
            const platform = sdk.platform();
            await platform.login({
                code: 'whatever',
                discovery_uri: 'http://whatever/.well-known/entry-points/external',
                token_uri: 'http://whatever/restapi/oauth/token',
            });
            const externalData = await platform.discovery().externalData();
            expect(externalData.coreApi.baseUri).to.equal(externalDiscoveryData.coreApi.baseUri);
            expect(await platform.discovery().externalDataExpired()).to.equal(false);
        });

        it('should fetch external discovery when login with discovery_uri and token_uri when discoveryInitPromise finished', async () => {
            // mock
            const initialDiscoveryData = getInitialDiscoveryMockData();
            const externalDiscoveryData = getExternalDiscoveryMockData();
            apiCall('GET', '/.well-known/entry-points/initial?clientId=whatever', initialDiscoveryData);
            apiCall('GET', '/.well-known/entry-points/external', externalDiscoveryData);
            authentication();

            const sdk = createSdk({enableDiscovery: true, discoveryServer: 'http://whatever', server: ''});
            const platform = sdk.platform();
            if (platform.discoveryInitPromise) {
                await platform.discoveryInitPromise;
            }
            await platform.login({
                code: 'whatever',
                discovery_uri: 'http://whatever/.well-known/entry-points/external',
                token_uri: 'http://whatever/restapi/oauth/token',
            });
            const externalData = await platform.discovery().externalData();
            expect(externalData.coreApi.baseUri).to.equal(externalDiscoveryData.coreApi.baseUri);
            expect(await platform.discovery().externalDataExpired()).to.equal(false);
        });

        it('should fetch external discovery when login without discovery_uri and token_uri', async () => {
            // mock
            const initialDiscoveryData = getInitialDiscoveryMockData();
            const externalDiscoveryData = getExternalDiscoveryMockData();
            apiCall('GET', '/.well-known/entry-points/initial?clientId=whatever', initialDiscoveryData);
            apiCall('GET', '/.well-known/entry-points/external', externalDiscoveryData);
            authentication();

            const sdk = createSdk({enableDiscovery: true, discoveryServer: 'http://whatever', server: ''});
            const platform = sdk.platform();
            await platform.login({code: 'whatever'});
            const externalData = await platform.discovery().externalData();
            expect(externalData.coreApi.baseUri).to.equal(externalDiscoveryData.coreApi.baseUri);
            expect(await platform.discovery().externalDataExpired()).to.equal(false);
        });

        it('should not be expired when not expireIn in external discovery data', async () => {
            const externalDiscoveryData = getExternalDiscoveryMockData();
            delete externalDiscoveryData.expiresIn;
            // mock
            const initialDiscoveryData = getInitialDiscoveryMockData();
            apiCall('GET', '/.well-known/entry-points/initial?clientId=whatever', initialDiscoveryData);
            apiCall('GET', '/.well-known/entry-points/external', externalDiscoveryData);
            authentication();

            const sdk = createSdk({enableDiscovery: true, discoveryServer: 'http://whatever', server: ''});
            const platform = sdk.platform();
            if (platform.discoveryInitPromise) {
                await platform.discoveryInitPromise;
            }
            await platform.login({
                code: 'whatever',
                discovery_uri: 'http://whatever/.well-known/entry-points/external',
                token_uri: 'http://whatever/restapi/oauth/token',
            });
            const externalData = await platform.discovery().externalData();
            expect(externalData.coreApi.baseUri).to.equal(externalDiscoveryData.coreApi.baseUri);
            expect(await platform.discovery().externalDataExpired()).to.equal(false);
        });

        it('should fetch external discovery fail with 3 retry', async function() {
            this.timeout(20000);
            // mock
            const initialDiscoveryData = getInitialDiscoveryMockData();
            apiCall('GET', '/.well-known/entry-points/initial?clientId=whatever', initialDiscoveryData);
            apiCall('GET', '/.well-known/entry-points/initial?clientId=whatever', initialDiscoveryData);
            apiCall('GET', '/.well-known/entry-points/external', null, 500);
            apiCall('GET', '/.well-known/entry-points/external', null, 500);
            apiCall('GET', '/.well-known/entry-points/external', null, 500);
            authentication();

            const sdk = createSdk({enableDiscovery: true, discoveryServer: 'http://whatever', server: ''});
            const platform = sdk.platform();
            if (platform.discoveryInitPromise) {
                await platform.discoveryInitPromise;
            }
            const clientFetchErrorSpy = spy(() => {});
            sdk.client().on(sdk.client().events.requestError, clientFetchErrorSpy);
            let hasError = false;
            try {
                await platform.login({
                    code: 'whatever',
                    discovery_uri: 'http://whatever/.well-known/entry-points/external',
                    token_uri: 'http://whatever/restapi/oauth/token',
                });
            } catch (e) {
                hasError = true;
            }
            expect(hasError).to.equal(true);
            expect(clientFetchErrorSpy.calledThrice).to.equal(true);
            await platform.discovery().init();
        });
    });

    describe('API request with discovery', () => {
        let platform;

        beforeEach(async () => {
            cleanFetchMock();
            const initialDiscoveryData = getInitialDiscoveryMockData();
            const externalDiscoveryData = getExternalDiscoveryMockData();
            // mock
            apiCall('GET', '/.well-known/entry-points/initial?clientId=whatever', initialDiscoveryData);
            apiCall('GET', '/.well-known/entry-points/external', externalDiscoveryData);
            authentication();

            const sdk = createSdk({enableDiscovery: true, discoveryServer: 'http://whatever', server: ''});
            platform = sdk.platform();
            await platform.discovery().init();
            await platform.login({
                code: 'whatever',
                discovery_uri: 'http://whatever/.well-known/entry-points/external',
                token_uri: 'http://whatever/restapi/oauth/token',
            });
        });

        it('should fetch api request successfully', async () => {
            apiCall('GET', '/restapi/v1.0/foo/1', {increment: 1});
            const res = await platform.get('/restapi/v1.0/foo/1');
            const data = await res.json();
            expect(data.increment).to.equal(1);
        });

        it('should fetch rcv api request successfully', async () => {
            apiCall('GET', '/rcvideo/v1/bridges', {id: 123});
            const res = await platform.get('/rcvideo/v1/bridges');
            const data = await res.json();
            expect(data.id).to.equal(123);
        });

        it('should refresh token successfully', async () => {
            tokenRefresh();
            const noErrors = true;
            await platform.refresh();
            expect(noErrors).to.equal(true);
        });

        it('should logout successfully', async () => {
            cleanFetchMock();
            logout();
            const initialDiscoveryData = getInitialDiscoveryMockData();
            initialDiscoveryData.authApi.authorizationUri = 'http://whatever1/restapi/oauth/authorize';
            apiCall('GET', '/.well-known/entry-points/initial?clientId=whatever', initialDiscoveryData);
            const noErrors = true;
            await platform.logout();
            expect(noErrors).to.equal(true);
            const loginUrl = await platform.loginUrlWithDiscovery();
            const initialData = await platform.discovery().initialData();
            expect(loginUrl.indexOf(initialDiscoveryData.authApi.authorizationUri)).to.equal(0);
        });

        it('should trigger refresh external discovery data when Discovery-Required', async () => {
            apiCall('GET', '/restapi/v1.0/foo/1', {increment: 1}, 200, 'OK', {
                'Discovery-Required': 1,
                'Access-Control-Expose-Headers': 'Discovery-Required',
            });
            const externalDiscoveryData = getExternalDiscoveryMockData();
            externalDiscoveryData.version = '1.0.1';
            // mock
            apiCall('GET', '/.well-known/entry-points/external', externalDiscoveryData);
            const res = await platform.get('/restapi/v1.0/foo/1');
            await res.json();
            if (platform.discovery().refreshingExternalData) {
                await platform.discovery().refreshExternalData();
            }
            const discovery = await platform.discovery().externalData();
            expect(discovery.version).to.equal(externalDiscoveryData.version);
        });

        it('should trigger refresh external discovery data when external data removed', async () => {
            apiCall('GET', '/restapi/v1.0/foo/1', {increment: 1}, 200, 'OK');
            const externalDiscoveryData = getExternalDiscoveryMockData();
            externalDiscoveryData.version = '1.0.1';
            // mock
            apiCall('GET', '/.well-known/entry-points/external', externalDiscoveryData);
            await platform.discovery().removeExternalData();
            const res = await platform.get('/restapi/v1.0/foo/1');
            await res.json();
            if (platform.discovery().refreshingExternalData) {
                await platform.discovery().refreshExternalData();
            }
            const discovery = await platform.discovery().externalData();
            expect(discovery.version).to.equal(externalDiscoveryData.version);
        });

        it('should not throw error when refresh error and start retry cycle', async function() {
            this.timeout(20000);
            apiCall('GET', '/restapi/v1.0/foo/1', {increment: 1}, 200, 'OK', {
                'Discovery-Required': 1,
                'Access-Control-Expose-Headers': 'Discovery-Required',
            });
            // mock
            apiCall('GET', '/.well-known/entry-points/external', null, 500);
            apiCall('GET', '/.well-known/entry-points/external', null, 500);
            apiCall('GET', '/.well-known/entry-points/external', null, 500);
            const res = await platform.get('/restapi/v1.0/foo/1');
            await res.json();
            if (platform.discovery().refreshingExternalData) {
                await platform.discovery().refreshExternalData();
            }
            const discovery = await platform.discovery().externalData();
            expect(discovery.version).to.equal('1.0.0');
            expect(platform.discovery().externalRetryCycleScheduled).to.equal(true);
            platform.discovery().cancelExternalRetryCycleTimeout();
        });
    });

    describe('API request with discovery tag', () => {
        let platform;
        let sdk;
        const discoveryTag = '123312121';
        beforeEach(async () => {
            cleanFetchMock();
            const initialDiscoveryData = getInitialDiscoveryMockData();
            const externalDiscoveryData = getExternalDiscoveryMockData();
            // mock
            apiCall('GET', '/.well-known/entry-points/initial?clientId=whatever', initialDiscoveryData);
            apiCall('GET', '/.well-known/entry-points/external', externalDiscoveryData, 200, 'OK', {
                'Discovery-Tag': discoveryTag,
            });
            authentication();

            sdk = createSdk({enableDiscovery: true, discoveryServer: 'http://whatever', server: ''});
            platform = sdk.platform();
            await platform.discovery().init();
            await platform.login({
                code: 'whatever',
                discovery_uri: 'http://whatever/.well-known/entry-points/external',
                token_uri: 'http://whatever/restapi/oauth/token',
            });
        });

        it('should save tag in external discovery data', async () => {
            const externalData = await platform.discovery().externalData();
            expect(externalData.tag).to.equal(discoveryTag);
        });

        it('should send Discovery-Tag header in api request', async () => {
            apiCall('GET', '/restapi/v1.0/foo/1', {increment: 1});
            let request;
            sdk.client().on(sdk.client().events.requestSuccess, (_, r) => {
                request = r;
            });
            const res = await platform.get('/restapi/v1.0/foo/1');
            expect(request.headers.get('discovery-tag')).to.equal(discoveryTag);
        });
    });
});
