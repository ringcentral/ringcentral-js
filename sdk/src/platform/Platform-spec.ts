import {apiCall, asyncTest, authentication, expect, expectThrows, logout, spy, tokenRefresh} from "../test/test";

const globalAny: any = global;
const windowAny: any = typeof window !== 'undefined' ? window : global;

describe('RingCentral.platform.Platform', function() {

    describe('setServer', function() {

        it('should have predefined server', asyncTest(async sdk => {

            expect(sdk.platform()['_server']).to.equal('http://whatever');

        }));

    });

    describe('isTokenValid', function() {

        it('is not authenticated when token has expired', asyncTest(async sdk => {

            const platform = sdk.platform();

            await platform.auth().cancelAccessToken();

            expect(await platform.auth().accessTokenValid()).to.equal(false);

        }));

        it('is not authenticated after logout', asyncTest(async sdk => {

            logout();

            const platform = sdk.platform();

            await platform.logout();

            expect(await platform.auth().accessTokenValid()).to.equal(false);

        }));

    });

    describe('authorized', function() {

        it('initiates refresh if not authorized', asyncTest(async sdk => {

            tokenRefresh();

            const platform = sdk.platform();

            expect((await platform.auth().data()).access_token).to.not.equal('ACCESS_TOKEN_FROM_REFRESH');

            await platform.auth().cancelAccessToken();

            await platform.loggedIn();

            expect((await platform.auth().data()).access_token).to.equal('ACCESS_TOKEN_FROM_REFRESH');

        }));

    });

    describe('login', function() {

        it('login with code', asyncTest(async sdk => {

            const platform = sdk.platform();

            await platform.auth().cancelAccessToken();

            authentication();

            await platform.login({
                code: 'foo',
                endpointId: 'xxx',
                accessTokenTtl: 100,
                refreshTokenTtl: 100
            });

            expect((await platform.auth().data()).access_token).to.equal('ACCESS_TOKEN');

        }));

        it('login with access_token', asyncTest(async sdk => {

            const platform = sdk.platform();

            await platform.auth().cancelAccessToken();

            authentication();

            await platform.login({access_token: 'foo'});

            expect((await platform.auth().data()).access_token).to.equal('foo');

        }));

        it('login error', asyncTest(async sdk => {

            const platform = sdk.platform();

            await platform.auth().cancelAccessToken();

            apiCall('POST', '/restapi/oauth/token', {'message': 'expected'}, 400);

            await expectThrows(async () => await platform.login({code: 'foo'}), 'expected');

        }));

    });

    describe('loggedIn', function() {

        it('returns false if refresh failed', asyncTest(async sdk => {

            const platform = sdk.platform();

            await platform.auth().cancelAccessToken();

            apiCall('POST', '/restapi/oauth/token', {'message': 'expected'}, 400);

            const res = await platform.loggedIn();

            expect(res).to.equal(false);

        }));


    });

    describe('sendRequest', function() {

        it('refreshes token when token was expired', asyncTest(async sdk => {

            const platform = sdk.platform(),
                path = '/restapi/xxx',
                refreshSpy = spy(function() {});

            tokenRefresh();
            apiCall('GET', path, {});

            expect((await platform.auth().data()).access_token).to.not.equal('ACCESS_TOKEN_FROM_REFRESH');

            await platform.auth().cancelAccessToken();

            await platform
                .on(platform.events.refreshSuccess, refreshSpy)
                .get(path);

            expect(refreshSpy.calledOnce).to.be.true;
            expect((await platform.auth().data()).access_token).to.equal('ACCESS_TOKEN_FROM_REFRESH');

        }));

        it('tries to refresh the token if Platform returns 401 Unauthorized and re-executes the request', asyncTest(async sdk => {

            const platform = sdk.platform(),
                path = '/restapi/xxx',
                refreshSpy = spy(function() {
                    apiCall('GET', path, response, 200);
                }),
                response = {foo: 'bar'};

            apiCall('GET', path, {message: 'time not in sync'}, 401, 'Time Not In Sync');
            tokenRefresh();

            platform.on(platform.events.refreshSuccess, refreshSpy);

            const res = await platform.get(path);

            expect(refreshSpy.calledOnce).to.be.true;
            expect(res.json()).to.deep.equal(response);
            expect((await platform.auth().data()).access_token).to.equal('ACCESS_TOKEN_FROM_REFRESH');

        }));

        it('fails if ajax has status other than 2xx', asyncTest(async sdk => {

            const platform = sdk.platform(),
                path = '/restapi/xxx';

            apiCall('GET', path, {description: 'Fail'}, 400, 'Bad Request');

            await expectThrows(async () => await platform.get(path), 'Fail');

        }));

        it('handles rate limit 429', asyncTest(async sdk => {

            const platform = sdk.platform(),
                path = '/restapi/xxx',
                rateLimitSpy = spy(function() {
                    apiCall('GET', path, response, 200);
                }),
                response = {foo: 'bar'};

            apiCall('GET', path, {message: 'expected'}, 429, 'Rate Limit Exceeded');

            platform.on(platform.events.rateLimitError, rateLimitSpy);

            const res = await platform.get(path, null, {handleRateLimit: 0.01});

            expect(rateLimitSpy.calledOnce).to.be.true;

            const e = rateLimitSpy.getCalls()[0].args[0];
            expect(e.message).to.equal('expected');
            expect(e.retryAfter).to.equal(10);

            expect(res.json()).to.deep.equal(response);

        }));

        it('emits rate limit 429 errors if they are not handled', asyncTest(async sdk => {

            const platform = sdk.platform(),
                path = '/restapi/xxx',
                rateLimitSpy = spy(function() {});

            apiCall('GET', path, {message: 'expected'}, 429, 'Rate Limit Exceeded');

            platform.on(platform.events.rateLimitError, rateLimitSpy);

            await expectThrows(async () => await platform.get(path), '', err => {

                expect(rateLimitSpy.calledOnce).to.be.true;

                const e = rateLimitSpy.getCalls()[0].args[0];
                expect(e.message).to.equal('expected');
                expect(e.retryAfter).to.equal(60000);

                expect(err).to.equal(e);

            });

        }));

    });

    describe('refresh', function() {

        it('handles error in queued AJAX after unsuccessful refresh when token is killed', asyncTest(async sdk => {

            const platform = sdk.platform(),
                path = '/restapi/xxx',
                successSpy = spy(function() {}),
                errorSpy = spy(function() {});

            tokenRefresh(true);

            await platform.auth().cancelAccessToken();

            await expectThrows(
                async () => await platform
                    .on(platform.events.refreshSuccess, successSpy)
                    .on(platform.events.refreshError, errorSpy)
                    .get(path),
                'Wrong token'
            );

            expect(errorSpy.calledOnce).to.be.true;
            expect(successSpy.calledOnce).to.be.false;

        }));

        it('handles subsequent refreshes', asyncTest(async sdk => {

            const platform = sdk.platform();

            tokenRefresh();
            tokenRefresh();
            tokenRefresh();

            await platform.refresh(); // first
            await platform.refresh();  // second
            await Promise.all([
                platform.refresh(), // third combined for two
                platform.refresh()
            ]);

        }));

        it('returns error if response is malformed', asyncTest(async sdk => {

            const platform = sdk.platform();

            apiCall('POST', '/restapi/oauth/token', {
                'message': 'Wrong token',
                'error_description': 'Wrong token',
                'description': 'Wrong token'
            }, 240); // This weird status was caught on client's machine

            await platform.auth().cancelAccessToken();

            await expectThrows(
                async () => await platform.refresh(),
                'Wrong token',
                e => {
                    expect(e['originalMessage']).to.equal('Malformed OAuth response');
                }
            );

        }));

        it('issues only one refresh request', asyncTest(async sdk => {


            tokenRefresh();
            apiCall('GET', '/restapi/v1.0/foo/1', {increment: 1});
            apiCall('GET', '/restapi/v1.0/foo/2', {increment: 2});
            apiCall('GET', '/restapi/v1.0/foo/3', {increment: 3});

            const platform = sdk.platform();

            await platform.auth().cancelAccessToken();

            const res = (await Promise.all([
                platform.get('/restapi/v1.0/foo/1'),
                platform.get('/restapi/v1.0/foo/2'),
                platform.get('/restapi/v1.0/foo/3')
            ])).map(r => r.json());

            expect((await platform.auth().data()).access_token).to.equal('ACCESS_TOKEN_FROM_REFRESH');
            expect(res[0].increment).to.equal(1);
            expect(res[1].increment).to.equal(2);
            expect(res[2].increment).to.equal(3);

        }));

    });

    describe('get, post, put, delete', function() {

        it('sends request using appropriate method', asyncTest(async sdk => {

            const platform = sdk.platform();

            const test = async (method) => {

                const path = '/restapi/v1.0/foo/' + method;

                apiCall(method, path, {foo: 'bar'});

                const res = await platform[method](path);
                expect(res.request().method).to.equal(method.toUpperCase());
                expect(res.json().foo).to.equal('bar');

            };

            await test('get');
            await test('post');
            await test('put');
            await test('delete');

        }));

    });

    describe('createUrl', function() {

        it('builds the URL', asyncTest(async sdk => {

            const platform = sdk.platform();

            expect(platform.createUrl('/restapi/v1.0/foo')).to.equal('/restapi/v1.0/foo');

            expect(platform.createUrl('/restapi/v1.0/foo', {addServer: true})).to.equal('http://whatever/restapi/v1.0/foo');

            expect(await platform.signUrl(platform.createUrl('/restapi/v1.0/foo', {
                addServer: true
            }))).to.equal('http://whatever/restapi/v1.0/foo?access_token=ACCESS_TOKEN');

            expect(await platform.signUrl(platform.createUrl('/restapi/v1.0/foo?bar', {
                addServer: true
            }))).to.equal('http://whatever/restapi/v1.0/foo?bar&access_token=ACCESS_TOKEN');

            expect(await platform.signUrl(platform.createUrl('/restapi/v1.0/foo?bar', {
                addServer: true,
                addMethod: 'POST'
            }))).to.equal('http://whatever/restapi/v1.0/foo?bar&_method=POST&access_token=ACCESS_TOKEN');

            expect(await platform.signUrl(platform.createUrl('/rcvideo/v1/foo?bar', {
                addServer: true
            }))).to.equal('http://whatever/rcvideo/v1/foo?bar&access_token=ACCESS_TOKEN');
        }));

    });

    describe('parseLoginRedirect', function() {
        describe('Authorization Code Flow', function() {
            it('parses url correctly', asyncTest(async sdk => {
                const platform = sdk.platform();
                expect(platform.parseLoginRedirect('?code=foo')).to.deep.equal({code: 'foo'});
            }));
        });
        describe('Implicit Grant Flow', function() {
            it('parses url correctly', asyncTest(async sdk => {
                const platform = sdk.platform();
                expect(platform.parseLoginRedirect('#access_token=foo')).to.deep.equal({access_token: 'foo'});
            }));
        });
    });

    describe('loginUrl', function() {

        it('simple usage', asyncTest(async sdk => {

            const platform = sdk.platform();

            expect(platform.loginUrl({
                implicit: true,
                redirectUri: 'foo',
                state: 'foo',
                brandId: 'foo',
                display: 'foo',
                prompt: 'foo'
            })).to.equal('http://whatever/restapi/oauth/authorize?response_type=token&redirect_uri=foo&client_id=whatever&state=foo&brand_id=foo&display=foo&prompt=foo');

            expect(platform.loginUrl({
                implicit: false,
                redirectUri: 'foo',
                state: 'foo',
                brandId: 'foo',
                display: 'foo',
                prompt: 'foo'
            })).to.equal('http://whatever/restapi/oauth/authorize?response_type=code&redirect_uri=foo&client_id=whatever&state=foo&brand_id=foo&display=foo&prompt=foo');

            expect(platform.loginUrl({
                implicit: false
            })).to.equal('http://whatever/restapi/oauth/authorize?response_type=code&redirect_uri=http%3A%2F%2Ffoo&client_id=whatever&state=&brand_id=&display=&prompt=');

        }));

    });

    describe('loginWindow', function() {

        const isNode = (typeof window !== 'undefined');

        if (!isNode) {
            globalAny.window = {
                screenLeft: 0,
                screenTop: 0,
                location: {
                    origin: ''
                }
            };
            globalAny.screen = {
                left: 0,
                top: 0,
                width: 0,
                height: 0
            };
            globalAny.document = {
                documentElement: {
                    clientWidth: 0,
                    clientHeight: 0
                }
            };
        }

        window.addEventListener = function(eventName, cb, bubble) {
            windowAny.triggerEvent = function(mock) {
                cb(mock);
            };
        };

        it('simple usage', asyncTest(async sdk => {

            const platform = sdk.platform();
            const close = spy();
            const focus = spy();

            window.open = spy(function() {
                return {
                    close: close,
                    focus: focus
                };
            });

            window.removeEventListener = spy();

            setTimeout(function() {
                windowAny.triggerEvent({origin: 'bar'});
                windowAny.triggerEvent({origin: 'foo', data: {foo: 'bar'}});
                windowAny.triggerEvent({origin: 'foo', data: {RCAuthorizationResponse: '#access_token=foo'}});
            }, 10);

            const res = await platform.loginWindow({
                url: 'foo',
                origin: 'foo'
            });

            expect(res.access_token).to.equal('foo');
            expect(close.calledOnce).to.be.true;
            expect(focus.calledOnce).to.be.true;
            expect(window.open['calledOnce']).to.be.true;

        }));

        it('throws an exception if no code and token', asyncTest(async sdk => {

            const platform = sdk.platform();

            window.open = spy(function() {
                return {close: spy()};
            });

            setTimeout(function() {
                windowAny.triggerEvent({origin: 'foo', data: {RCAuthorizationResponse: '#bar=foo'}});
            }, 10);

            await expectThrows(async () => {
                await platform.loginWindow({
                    url: 'foo',
                    origin: 'foo'
                });
            }, 'No authorization code or token');

            expect(window.open['calledOnce']).to.be.true;

        }));

        it('throws an exception if window cannot be open', asyncTest(async sdk => {

            const platform = sdk.platform();

            window.open = spy(function() {
                return null;
            });

            await expectThrows(async () => {
                await platform.loginWindow({
                    url: 'foo',
                    origin: 'foo'
                });
            }, 'Could not open login window. Please allow popups for this site');

            expect(window.open['calledOnce']).to.be.true;

        }));

    });

    describe('parseLoginRedirect', function() {
        it('parses redirect URIs with hash', asyncTest(async sdk => {
            const platform = sdk.platform();
            expect(platform.parseLoginRedirect('#access_token=foo').access_token).to.equal('foo');
        }));
        it('parses redirect URIs with query', asyncTest(async sdk => {
            const platform = sdk.platform();
            expect(platform.parseLoginRedirect('?access_token=foo').access_token).to.equal('foo');
        }));
        it('parses redirect URIs with errors', asyncTest(async sdk => {
            const platform = sdk.platform();
            expect(function() {
                platform.parseLoginRedirect('?error_description=foo');
            }).to.throw('foo');
            expect(function() {
                platform.parseLoginRedirect('?error=foo');
            }).to.throw('foo');
            expect(function() {
                platform.parseLoginRedirect('xxx');
            }).to.throw('Unable to parse response');
        }));
    });

});
