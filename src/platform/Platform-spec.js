describe('RingCentral.platform.Platform', function() {

    describe('setServer', function() {

        it('should have predefined server', asyncTest(function(sdk) {

            expect(sdk.platform()._server).to.equal('http://whatever');

        }));

    });

    describe('isTokenValid', function() {

        it('is not authenticated when token has expired', asyncTest(function(sdk) {

            var platform = sdk.platform();

            platform.auth().cancelAccessToken();

            expect(platform._isAccessTokenValid()).to.equal(false);

        }));

        it('is not authenticated after logout', asyncTest(function(sdk) {

            logout();

            var platform = sdk.platform();

            return platform.logout().then(function() {
                expect(platform._isAccessTokenValid()).to.equal(false);
            });

        }));

    });

    describe('authorized', function() {

        it('initiates refresh if not authorized', asyncTest(function(sdk) {

            tokenRefresh();

            var platform = sdk.platform();

            expect(platform.auth().accessToken()).to.not.equal('ACCESS_TOKEN_FROM_REFRESH');

            platform.auth().cancelAccessToken();

            return platform.loggedIn().then(function() {
                expect(platform.auth().accessToken()).to.equal('ACCESS_TOKEN_FROM_REFRESH');
            });

        }));

    });

    describe('login', function() {

        it('login with code', asyncTest(function(sdk) {

            var platform = sdk.platform();

            platform.auth().cancelAccessToken();

            authentication();

            return platform.login({
                code: 'foo',
                endpointId: 'xxx',
                accessTokenTtl: 100,
                refreshTokenTtl: 100
            }).then(function(res) {
                expect(platform.auth().accessToken()).to.equal('ACCESS_TOKEN');
            });

        }));

        it('login with access_token', asyncTest(function(sdk) {

            var platform = sdk.platform();

            platform.auth().cancelAccessToken();

            authentication();

            return platform.login({access_token: 'foo'}).then(function(res) {
                expect(platform.auth().accessToken()).to.equal('foo');
            });

        }));

        it('login error', asyncTest(function(sdk) {

            var platform = sdk.platform();

            platform.auth().cancelAccessToken();

            apiCall('POST', '/restapi/oauth/token', {'message': 'expected'}, 400);

            return platform.login({code: 'foo'}).then(function(res) {
                throw new Error('This should not be called');
            }).catch(function(e) {
                expect(e.message).to.equal('expected');
            });

        }));

    });

    describe('loggedIn', function() {

        it('returns false if refresh failed', asyncTest(function(sdk) {

            var platform = sdk.platform();

            platform.auth().cancelAccessToken();

            apiCall('POST', '/restapi/oauth/token', {'message': 'expected'}, 400);

            return platform.loggedIn().then(function(res) {
                expect(res).to.equal(false);
            });

        }));


    });

    describe('sendRequest', function() {

        it('refreshes token when token was expired', asyncTest(function(sdk) {

            var platform = sdk.platform(),
                path = '/restapi/xxx',
                refreshSpy = spy(function() {});

            tokenRefresh();
            apiCall('GET', path, {});

            expect(platform.auth().accessToken()).to.not.equal('ACCESS_TOKEN_FROM_REFRESH');

            platform.auth().cancelAccessToken();

            return platform
                .on(platform.events.refreshSuccess, refreshSpy)
                .get(path)
                .then(function(ajax) {
                    expect(refreshSpy).to.be.calledOnce;
                    expect(platform.auth().accessToken()).to.equal('ACCESS_TOKEN_FROM_REFRESH');
                });

        }));

        it('tries to refresh the token if Platform returns 401 Unauthorized and re-executes the request', asyncTest(function(sdk) {

            var platform = sdk.platform(),
                path = '/restapi/xxx',
                refreshSpy = spy(function() {}),
                response = {foo: 'bar'};

            apiCall('GET', path, {message: 'time not in sync'}, 401, 'Time Not In Sync');
            tokenRefresh();
            apiCall('GET', path, response, 200);

            platform.on(platform.events.refreshSuccess, refreshSpy);

            return platform.get(path).then(function(res) {
                expect(refreshSpy).to.be.calledOnce;
                expect(res.json()).to.deep.equal(response);
                expect(platform.auth().accessToken()).to.equal('ACCESS_TOKEN_FROM_REFRESH');
            });

        }));

        it('fails if ajax has status other than 2xx', asyncTest(function(sdk) {

            var platform = sdk.platform(),
                path = '/restapi/xxx';

            apiCall('GET', path, {description: 'Fail'}, 400, 'Bad Request');

            return platform
                .get(path)
                .then(function() {
                    throw new Error('This should not be reached');
                })
                .catch(function(e) {
                    expect(e.message).to.equal('Fail');
                });

        }));

        it('handles rate limit 429', asyncTest(function(sdk) {

            var platform = sdk.platform(),
                path = '/restapi/xxx',
                rateLimitSpy = spy(function() {}),
                response = {foo: 'bar'};

            apiCall('GET', path, {message: 'expected'}, 429, 'Rate Limit Exceeded');
            apiCall('GET', path, response, 200);

            platform.on(platform.events.rateLimitError, rateLimitSpy);

            return platform.get(path, null, {handleRateLimit: 0.01}).then(function(res) {

                expect(rateLimitSpy).to.be.calledOnce;

                var e = rateLimitSpy.getCalls()[0].args[0];
                expect(e.message).to.equal('expected');
                expect(e.retryAfter).to.equal(10);

                expect(res.json()).to.deep.equal(response);

            });

        }));

        it('emits rate limit 429 errors if they are not handled', asyncTest(function(sdk) {

            var platform = sdk.platform(),
                path = '/restapi/xxx',
                rateLimitSpy = spy(function() {});

            apiCall('GET', path, {message: 'expected'}, 429, 'Rate Limit Exceeded');

            platform.on(platform.events.rateLimitError, rateLimitSpy);

            return platform.get(path).then(function() {
                throw new Error('This should not be reached');
            }).catch(function(err) {

                expect(rateLimitSpy.calledOnce).to.equal(true);

                var e = rateLimitSpy.getCalls()[0].args[0];
                expect(e.message).to.equal('expected');
                expect(e.retryAfter).to.equal(60000);

                expect(err).to.equal(e);

            });

        }));

    });

    describe('refresh', function() {

        it('handles error in queued AJAX after unsuccessful refresh when token is killed', asyncTest(function(sdk) {

            var platform = sdk.platform(),
                path = '/restapi/xxx',
                successSpy = spy(function() {}),
                errorSpy = spy(function() {});

            tokenRefresh(true);

            platform.auth().cancelAccessToken();

            return platform
                .on(platform.events.refreshSuccess, successSpy)
                .on(platform.events.refreshError, errorSpy)
                .get(path)
                .then(function() {
                    throw new Error('This should never be called');
                })
                .catch(function(e) {
                    expect(e.message).to.equal('Wrong token');
                    expect(errorSpy).to.be.calledOnce;
                    expect(successSpy).not.to.calledOnce;
                });

        }));

        it('handles subsequent refreshes', asyncTest(function(sdk) {

            var platform = sdk.platform();

            tokenRefresh();
            tokenRefresh();
            tokenRefresh();

            return platform
                .refresh() // first
                .then(function() {
                    return platform.refresh();  // second
                })
                .then(function() {
                    return Promise.all([
                        platform.refresh(),  // third combined for two
                        platform.refresh()
                    ]);
                });

        }));

        it('returns error if response is malformed', asyncTest(function(sdk) {

            var platform = sdk.platform();

            apiCall('POST', '/restapi/oauth/token', {
                'message': 'Wrong token',
                'error_description': 'Wrong token',
                'description': 'Wrong token'
            }, 240); // This weird status was caught on client's machine

            platform.auth().cancelAccessToken();

            return platform
                .refresh()
                .then(function() {
                    throw new Error('This should not be reached');
                })
                .catch(function(e) {
                    expect(e.originalMessage).to.equal('Malformed OAuth response');
                    expect(e.message).to.equal('Wrong token');
                });

        }));

        it('issues only one refresh request', asyncTest(function(sdk) {


            tokenRefresh();
            apiCall('GET', '/restapi/v1.0/foo', {increment: 1});
            apiCall('GET', '/restapi/v1.0/foo', {increment: 2});
            apiCall('GET', '/restapi/v1.0/foo', {increment: 3});

            var platform = sdk.platform();

            platform.auth().cancelAccessToken();

            return Promise.all([
                platform.get('/foo'),
                platform.get('/foo'),
                platform.get('/foo')
            ])
                .then(function(res) {
                    return res.map(function(r) { return r.json(); });
                })
                .then(function(res) {
                    expect(platform.auth().accessToken()).to.equal('ACCESS_TOKEN_FROM_REFRESH');
                    expect(res[0].increment).to.equal(1);
                    expect(res[1].increment).to.equal(2);
                    expect(res[2].increment).to.equal(3);
                });

        }));

    });

    describe('get, post, put, delete', function() {

        it('sends request using appropriate method', asyncTest(function(sdk) {

            var platform = sdk.platform();

            function test(method) {

                var path = '/foo/' + method;

                apiCall(method, '/restapi/v1.0' + path, {foo: 'bar'});

                return platform[method](path).then(function(res) {
                    expect(res.request().method).to.equal(method.toUpperCase());
                    expect(res.json().foo).to.equal('bar');
                });

            }

            return test('get')
                .then(function() {
                    return test('post');
                })
                .then(function() {
                    return test('put');
                })
                .then(function() {
                    return test('delete');
                });

        }));

    });

    describe('apiUrl', function() {

        it('builds the URL', asyncTest(function(sdk) {

            var platform = sdk.platform();

            expect(platform.createUrl('/foo')).to.equal('/restapi/v1.0/foo');

            expect(platform.createUrl('/foo', {addServer: true})).to.equal('http://whatever/restapi/v1.0/foo');

            expect(platform.createUrl('/foo', {
                addServer: true,
                addToken: true
            })).to.equal('http://whatever/restapi/v1.0/foo?access_token=ACCESS_TOKEN');

            expect(platform.createUrl('/foo?bar', {
                addServer: true,
                addToken: true
            })).to.equal('http://whatever/restapi/v1.0/foo?bar&access_token=ACCESS_TOKEN');

            expect(platform.createUrl('/foo?bar', {
                addServer: true,
                addToken: true,
                addMethod: 'POST'
            })).to.equal('http://whatever/restapi/v1.0/foo?bar&_method=POST&access_token=ACCESS_TOKEN');

            expect(platform.createUrl('/rcvideo/v1/foo?bar', {
                addServer: true,
                addToken: true,
            })).to.equal('http://whatever/rcvideo/v1/foo?bar&access_token=ACCESS_TOKEN');
        }));

    });

    describe('parseLoginRedirect', function() {
        describe('Authorization Code Flow', function() {
            it('parses url correctly', asyncTest(function(sdk) {
                var platform = sdk.platform();
                expect(platform.parseLoginRedirect('?code=foo')).to.deep.equal({code: 'foo'});
            }));
        });
        describe('Implicit Grant Flow', function() {
            it('parses url correctly', asyncTest(function(sdk) {
                var platform = sdk.platform();
                expect(platform.parseLoginRedirect('#access_token=foo')).to.deep.equal({access_token: 'foo'});
            }));
        });
    });

    describe('loginUrl', function() {

        it('simple usage', asyncTest(function(sdk) {

            var platform = sdk.platform();

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

        var isNode = (typeof window !== 'undefined');

        if (!isNode) {
            global.window = {
                screenLeft: 0,
                screenTop: 0,
                location: {
                    origin: ''
                }
            };
            global.screen = {
                left: 0,
                top: 0,
                width: 0,
                height: 0
            };
            global.document = {
                documentElement: {
                    clientWidth: 0,
                    clientHeight: 0
                }
            };
        }

        window.addEventListener = function(eventName, cb, bubble) {
            window.triggerEvent = function(mock) {
                cb(mock);
            };
        };

        it('simple usage', asyncTest(function(sdk) {

            var platform = sdk.platform();
            var close = spy();
            var focus = spy();

            window.open = spy(function() {
                return {
                    close: close,
                    focus: focus
                };
            });

            window.removeEventListener = spy();

            setTimeout(function() {
                window.triggerEvent({origin: 'bar'});
                window.triggerEvent({origin: 'foo', data: {foo: 'bar'}});
                window.triggerEvent({origin: 'foo', data: {RCAuthorizationResponse: '#access_token=foo'}});
            }, 10);

            return platform.loginWindow({
                url: 'foo',
                origin: 'foo'
            }).then(function(res) {
                expect(res.access_token).to.equal('foo');
                expect(close).to.be.calledOnce;
                expect(focus).to.be.calledOnce;
            });

        }));

        it('throws an exception if no code and token', asyncTest(function(sdk) {

            var platform = sdk.platform();

            window.open = spy(function() {
                return {close: spy()};
            });

            setTimeout(function() {
                window.triggerEvent({origin: 'foo', data: {RCAuthorizationResponse: '#bar=foo'}});
            }, 10);

            return platform.loginWindow({
                url: 'foo',
                origin: 'foo'
            }).then(function(res) {
                throw new Error('This should not be reached');
            }).catch(function(e) {
                expect(e.message).to.equal('No authorization code or token');
            });

        }));

        it('throws an exception if window cannot be open', asyncTest(function(sdk) {

            var platform = sdk.platform();

            window.open = spy(function() {
                return null;
            });

            return platform.loginWindow({
                url: 'foo',
                origin: 'foo'
            }).then(function(res) {
                throw new Error('This should not be reached');
            }).catch(function(e) {
                expect(e.message).to.equal('Could not open login window. Please allow popups for this site');
            });

        }));

        it('throws an exception if no uri option', asyncTest(function(sdk) {

            var platform = sdk.platform();

            window.open = spy(function() {
                return null;
            });

            return platform.loginWindow({
            }).then(function(res) {
                throw new Error('This should not be reached');
            }).catch(function(e) {
                expect(e.message).to.equal('Missing mandatory URL parameter');
            });

        }));

    });

    describe('parseLoginRedirect', function() {
        it('parses redirect URIs with hash', asyncTest(function(sdk) {
            var platform = sdk.platform();
            expect(platform.parseLoginRedirect('#access_token=foo').access_token).to.equal('foo');
        }));
        it('parses redirect URIs with query', asyncTest(function(sdk) {
            var platform = sdk.platform();
            expect(platform.parseLoginRedirect('?access_token=foo').access_token).to.equal('foo');
        }));
        it('parses redirect URIs with errors', asyncTest(function(sdk) {
            var platform = sdk.platform();
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
