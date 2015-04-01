var define = typeof define === 'function' && define.amd ? define : function (factory) {
    factory(require, exports, module);
};
define(function (require, exports, module) {
    var Mock = function () {
        function Mock(rcsdk) {
            this.rcsdk = rcsdk;
            var platform = rcsdk.getPlatform();
            rcsdk.getContext().useAjaxStub(true).usePubnubStub(true);
            platform.pollInterval = 1;
            platform.refreshDelayMs = 1;
        }
        Mock.prototype.registerHooks = function (suite, username) {
            var _this = this;
            suite.afterEach(function (done) {
                //this.rcsdk.getPlatform()
                //    .logout()
                //    .then(function() {
                //        done();
                //    })
                //    .catch(done);
                done();
            });
            this.registerCleanup(suite);
            suite.beforeEach(function (done) {
                _this.authentication();
                _this.rcsdk.getPlatform().authorize({
                    username: username || 'whatever',
                    password: 'whatever'
                }).then(function () {
                    done();
                }).catch(done);
            });
        };
        Mock.prototype.registerCleanup = function (suite) {
            var _this = this;
            var cleanup = function () {
                _this.rcsdk.getCache().clean();
                // Clear events and all for singletons
                _this.rcsdk.getPlatform().destroy();
                _this.rcsdk.getXhrResponse().clear();
            };
            suite.beforeEach(function (done) {
                cleanup();
                done();
            });
            suite.afterEach(function (done) {
                cleanup();
                done();
            });
        };
        Mock.prototype.apiCall = function (path, response, status) {
            this.rcsdk.getXhrResponse().add({
                path: path,
                response: function (ajax) {
                    ajax.setStatus(status || 200);
                    return response;
                }
            });
        };
        Mock.prototype.authentication = function () {
            this.rcsdk.getXhrResponse().add({
                path: '/restapi/oauth/token',
                response: function (ajax) {
                    return {
                        'access_token': 'ACCESS_TOKEN',
                        'token_type': 'bearer',
                        'expires_in': 3600,
                        'refresh_token': 'REFRESH_TOKEN',
                        'refresh_token_expires_in': 60480,
                        'scope': 'SMS RCM Foo Boo',
                        'expireTime': new Date().getTime() + 3600000
                    };
                },
                test: function (ajax) {
                    return !ajax.data || !ajax.data['refresh_token'];
                }
            });
            this.rcsdk.getXhrResponse().add({
                path: '/restapi/oauth/revoke',
                response: function (ajax) {
                    return {};
                }
            });
        };
        Mock.prototype.presenceLoad = function (id, detailed) {
            this.rcsdk.getXhrResponse().add({
                path: '/restapi/v1.0/account/~/extension/' + id + '/presence',
                response: function (ajax) {
                    return {
                        'uri': 'https://platform.ringcentral.com/restapi/v1.0/account/123/extension/' + id + '/presence',
                        'extension': {
                            'uri': 'https://platform.ringcentral.com/restapi/v1.0/account/123/extension/' + id,
                            'id': id,
                            'extensionNumber': '101'
                        },
                        'activeCalls': [],
                        'presenceStatus': 'Available',
                        'telephonyStatus': 'Ringing',
                        'userStatus': 'Available',
                        'dndStatus': 'TakeAllCalls',
                        'extensionId': id
                    };
                }
            });
        };
        Mock.prototype.subscribeGeneric = function (expiresIn) {
            this.rcsdk.getXhrResponse().add({
                path: '/restapi/v1.0/subscription',
                response: function (ajax) {
                    expiresIn = expiresIn || 15 * 60 * 60;
                    var date = new Date();
                    return {
                        'eventFilters': ajax.data.eventFilters,
                        'expirationTime': new Date(date.getTime() + expiresIn * 1000).toISOString(),
                        'expiresIn': expiresIn,
                        'deliveryMode': {
                            'transportType': 'PubNub',
                            'encryption': false,
                            'address': '123_foo',
                            'subscriberKey': 'sub-c-foo',
                            'secretKey': 'sec-c-bar'
                        },
                        'id': 'foo-bar-baz',
                        'creationTime': date.toISOString(),
                        'status': 'Active',
                        'uri': 'https://platform.ringcentral.com/restapi/v1.0/subscription/foo-bar-baz'
                    };
                }
            });
        };
        Mock.prototype.subscribeOnPresence = function (id, detailed) {
            id = id || '1';
            this.rcsdk.getXhrResponse().add({
                path: '/restapi/v1.0/subscription',
                response: function (ajax) {
                    var date = new Date();
                    return {
                        'eventFilters': ['/restapi/v1.0/account/~/extension/' + id + '/presence' + (detailed ? '?detailedTelephonyState=true' : '')],
                        'expirationTime': new Date(date.getTime() + 15 * 60 * 60 * 1000).toISOString(),
                        'deliveryMode': {
                            'transportType': 'PubNub',
                            'encryption': true,
                            'address': '123_foo',
                            'subscriberKey': 'sub-c-foo',
                            'secretKey': 'sec-c-bar',
                            'encryptionAlgorithm': 'AES',
                            'encryptionKey': 'VQwb6EVNcQPBhE/JgFZ2zw=='
                        },
                        'creationTime': date.toISOString(),
                        'id': 'foo-bar-baz',
                        'status': 'Active',
                        'uri': 'https://platform.ringcentral.com/restapi/v1.0/subscription/foo-bar-baz'
                    };
                }
            });
        };
        Mock.prototype.tokenRefresh = function (failure) {
            this.rcsdk.getXhrResponse().add({
                path: '/restapi/oauth/token',
                response: function (ajax) {
                    if (!failure)
                        return {
                            'access_token': 'ACCESS_TOKEN_FROM_REFRESH',
                            'token_type': 'bearer',
                            'expires_in': 3600,
                            'refresh_token': 'REFRESH_TOKEN_FROM_REFRESH',
                            'refresh_token_expires_in': 60480,
                            'scope': 'SMS RCM Foo Boo',
                            'expireTime': new Date().getTime() + 3600000
                        };
                    ajax.setStatus(400);
                    return {
                        'message': 'Wrong token',
                        'error_description': 'Wrong token',
                        'description': 'Wrong token'
                    };
                },
                test: function (ajax) {
                    return ajax.data && ajax.data['refresh_token'];
                }
            });
        };
        return Mock;
    }();
    exports.Mock = Mock;
});