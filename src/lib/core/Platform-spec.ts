/// <reference path="../../typings/externals.d.ts" />

export import mocha = require('../../test/mocha');
var expect = mocha.chai.expect;
var spy = mocha.sinon.spy;
var mock = mocha.mock;
var rcsdk = mocha.rcsdk;

describe('RCSDK.core.Platform', function() {

    var platform = rcsdk.getPlatform(),
        releaseTimeout = platform.releaseTimeout,
        pollInterval = platform.pollInterval;

    afterEach(function() {
        platform.releaseTimeout = releaseTimeout;
        platform.pollInterval = pollInterval;
    });

    mock.registerHooks(this);

    describe('setCredentials', function() {

        it('should have predefined apiKey', function() {

            expect(platform.apiKey).to.equal('d2hhdGV2ZXI6d2hhdGV2ZXI='); // whatever:whatever

        });

    });

    describe('setServer', function() {

        it('should have predefined server', function() {

            expect(platform.server).to.equal('http://whatever');

        });

    });

    describe('isTokenValid', function() {

        it('is not authenticated when token has expired', function() {

            platform.cancelAccessToken();

            expect(platform.isTokenValid()).to.equal(false);

        });

        it('is not authenticated after logout', function(done) {

            platform.logout().then(function() {

                expect(platform.isTokenValid()).to.equal(false);
                done();

            }, done);

        });

        it('is not authenticated if paused', function() {

            platform.pause();
            expect(platform.isTokenValid()).to.equal(false);
            platform.resume();

        });

    });

    describe('isAuthorized', function() {

        it('initiates refresh if not authorized', function(done) {

            mock.tokenRefresh();

            expect(platform.getToken()).to.not.equal('ACCESS_TOKEN_FROM_REFRESH');

            platform
                .cancelAccessToken()
                .isAuthorized()
                .then(function() {
                    expect(platform.getToken()).to.equal('ACCESS_TOKEN_FROM_REFRESH');
                    done();
                })
                .catch(done);

        });

        it('waits for refresh to resolve from other tab', function(done) {

            var token = 'ACCESS_TOKEN_FROM_OTHER_TAB';

            expect(platform.getToken()).to.not.equal(token);

            platform
                .pause()
                .cancelAccessToken()
                .isAuthorized()
                .then(function() {
                    expect(platform.getToken()).to.equal(token);
                    done();
                })
                .catch(done);

            setTimeout(function() {

                platform.setCache({
                    access_token: token,
                    expires_in: 60 * 60 // 1 hour
                });

                platform.resume();

            }, 10);

        });

        it('produces error if refresh did not happen', function(done) {

            platform.releaseTimeout = 20;
            platform.pollInterval = 10;

            platform
                .pause()
                .cancelAccessToken()
                .isAuthorized()
                .then(function() {
                    done(new Error('This should not be reached'));
                })
                .catch(function(e) {
                    expect(e.message).to.equal('Automatic authentification timeout');
                    done();
                });

        });

    });

    describe('apiCall', function() {

        it('refreshes token when token was expired', function(done) {

            var path = '/restapi/xxx',
                refreshSpy = spy(function() {});

            mock.tokenRefresh();
            mock.apiCall(path, {});

            expect(platform.getToken()).to.not.equal('ACCESS_TOKEN_FROM_REFRESH');

            platform
                .cancelAccessToken()
                .on(platform.events.refreshSuccess, refreshSpy)
                .apiCall({
                    url: path
                }).then(function(ajax) {
                    expect(refreshSpy).to.be.calledOnce;
                    expect(platform.getToken()).to.equal('ACCESS_TOKEN_FROM_REFRESH');
                    done();
                }).catch(done);

        });

        it('tries to refresh the token if Platform returns 401 Unauthorized and re-executes the request', function(done) {

            var path = '/restapi/xxx',
                refreshSpy = spy(function() {}),
                count = 0,
                response = {foo: 'bar'},
                responseSpy = spy(function(ajax) {
                    count++;
                    ajax.setStatus(count == 1 ? 401 : 200);
                    return count == 1 ? {} : response;
                });

            mock.tokenRefresh();

            rcsdk.getXhrResponse().add({
                path: path,
                response: responseSpy
            });

            platform
                .on(platform.events.refreshSuccess, refreshSpy)
                .apiCall({
                    url: path
                }).then(function(ajax) {

                    expect(refreshSpy).to.be.calledOnce;
                    expect(responseSpy).to.be.calledTwice;
                    expect(ajax.data).to.deep.equal(response);
                    expect(platform.getToken()).to.equal('ACCESS_TOKEN_FROM_REFRESH');

                    done();

                }).catch(done);

        });

        it('fails if ajax has status other than 2xx', function(done) {

            var path = '/restapi/xxx';

            rcsdk.getXhrResponse().add({
                path: path,
                response: function(ajax) {
                    ajax.setStatus(400);
                    return {description: 'Fail'};
                }
            });

            platform
                .apiCall({
                    url: path
                }).then(function(ajax) {

                    done(new Error('This should not be reached'));

                }).catch(function(e) {

                    expect(e.message).to.equal('Fail');
                    done();

                });

        });

    });

    describe('refresh', function() {

        it('handles error in queued AJAX after unsuccessful refresh when token is killed', function(done) {

            var path = '/restapi/xxx',
                successSpy = spy(function() {}),
                errorSpy = spy(function() {});

            mock.tokenRefresh(true);
            mock.apiCall(path, {});

            platform
                .cancelAccessToken()
                .on(platform.events.refreshSuccess, successSpy)
                .on(platform.events.refreshError, errorSpy)
                .apiCall({
                    url: path
                })
                .then(function() {
                    done(new Error('This should never be called'));
                })
                .catch(function(e) {
                    expect(e.message).to.equal('Wrong token');
                    expect(errorSpy).to.be.calledOnce;
                    expect(successSpy).not.to.calledOnce;
                    done();
                });

        });

        it('sits and waits for the queue to be released, no matter how many pending refreshes there are', function(done) {

            platform.pause();

            rcsdk.getContext().getPromise()
                .all([
                    platform.refresh(),
                    platform.refresh(),
                    platform.refresh()
                ])
                .then(function() {
                    done();
                })
                .catch(function(e) {
                    done(e);
                });

            setTimeout(function() {

                platform.resume();

            }, 5);

        });

        it('handles subsequent refreshes', function(done) {

            mock.tokenRefresh();

            platform.refresh()
                .then(function() {
                    return platform.refresh();
                })
                .then(function() {
                    return rcsdk.getContext().getPromise()
                        .all([
                            platform.refresh(),
                            platform.refresh()
                        ]);
                })
                .then(function() {
                    done();
                })
                .catch(function(e) {
                    done(e);
                });

        });

        it('returns error if response is malformed', function(done) {

            rcsdk.getXhrResponse().add({
                path: '/restapi/oauth/token',
                /**
                 * @param {XhrMock} ajax
                 * @returns {Object}
                 */
                response: function(ajax) {

                    ajax.setStatus(240); // This weird status were caught on client's machine

                    return {
                        'message': 'Wrong token',
                        'error_description': 'Wrong token',
                        'description': 'Wrong token'
                    };

                }
            });

            platform.cancelAccessToken().refresh().then(function() {
                done(new Error('This should not be reached'));
            }).catch(function(e) {
                expect(e.message).to.equal('Malformed OAuth response');
                expect(e.ajax.data.message).to.equal('Wrong token');
                done();
            });

        });

        it('issues only one refresh request', function(done) {

            var Promise = rcsdk.getContext().getPromise();

            var spy1 = spy(function(ajax) {
                return new Promise(function(resolve, reject) {

                    setTimeout(function() {

                        resolve({
                            'access_token': 'ACCESS_TOKEN_FROM_REFRESH',
                            'token_type': 'bearer',
                            'expires_in': 3600,
                            'refresh_token': 'REFRESH_TOKEN_FROM_REFRESH',
                            'refresh_token_expires_in': 60480,
                            'scope': 'SMS RCM Foo Boo',
                            'expireTime': new Date().getTime() + 3600000
                        });

                    }, 50);

                });
            });

            var increment = 0;

            var spy2 = spy(function(ajax) {
                return {
                    increment: ++increment,
                    constant: 1
                };
            });

            rcsdk.getXhrResponse().add({
                path: '/restapi/oauth/token',
                /**
                 * @param {XhrMock} ajax
                 * @returns {Object}
                 */
                response: spy1
            });

            rcsdk.getXhrResponse().add({
                path: '/restapi/v1.0/foo',
                /**
                 * @param {XhrMock} ajax
                 * @returns {Object}
                 */
                response: spy2
            });

            platform.cancelAccessToken();

            Promise
                .all([
                    platform.apiCall({url: '/foo'}),
                    platform.apiCall({url: '/foo'}),
                    platform.apiCall({url: '/foo'})
                ])
                .then(function(res) {
                    expect(res[0].data.increment).to.equal(1);
                    expect(res[1].data.increment).to.equal(2);
                    expect(res[2].data.increment).to.equal(3);
                    expect(res[0].data.constant).to.equal(res[1].data.constant);
                    expect(spy1).to.be.calledOnce;
                    expect(spy2).to.be.calledThrice;
                    done();
                })
                .catch(done);

        });

        it('immediately (synchronously) pauses', function(done) {

            mock.tokenRefresh();

            var refresh = platform.refresh();

            expect(platform.isPaused()).to.equal(true);

            refresh
                .then(function() {
                    done();
                })
                .catch(function(e) {
                    done(e);
                });

        });


        it('throws error if queue was unpaused before refresh call', function(done) {

            mock.tokenRefresh();

            var refresh = platform.refresh();
            platform.resume();

            refresh
                .then(function() {
                    done(new Error('This should not be reached'));
                })
                .catch(function(e) {
                    expect(e.message).to.equal('Queue was resumed before refresh call');
                    done();
                });

        });

    });

    describe('refreshPolling', function() {

        beforeEach(function() {
            platform.releaseTimeout = 20;
            platform.pollInterval = 10;
        });

        it('polls the status of semaphor and resumes operation', function(done) {

            platform
                .pause()
                .refreshPolling(null)
                .then(function() {
                    done();
                })
                .catch(done);

            setTimeout(function() {
                platform.resume();
            }, 10);

        });

        it('resolves with error if token is not valid after releaseTimeout', function(done) {

            platform
                .pause() // resume() will not be called in this test
                .cancelAccessToken()
                .refreshPolling(null)
                .then(function() {
                    done(new Error('This should not be reached'));
                })
                .catch(function(e) {
                    expect(e.message).to.equal('Automatic authentification timeout');
                    done();
                });

        });

    });

    describe('get, post, put, delete', function() {

        it('sends request using appropriate method', function(done) {

            function test(method) {

                var path = '/foo/' + method;

                rcsdk.getXhrResponse().add({
                    path: path,
                    response: function(ajax) {

                        expect(ajax.method).to.equal(method.toUpperCase());

                        return {foo: 'bar'};

                    }
                });

                return platform[method](path).then(function(res) {
                    expect(res.data.foo).to.equal('bar');
                    return res;
                });

            }

            rcsdk.getContext().getPromise().all([
                test('get'),
                test('post'),
                test('put'),
                test('delete')
            ]).then(function() {
                done();
            }).catch(done);

        });

    });

    //TODO Add tests for this
    describe.skip('parseAuthRedirectUrl', function(){});
    describe.skip('getAuthURL', function(){});
    describe.skip('getCredentials', function(){});

});
