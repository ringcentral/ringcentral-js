/// <reference path="../../typings/externals.d.ts" />

import RCSDK = require('../../lib/RCSDK');
import xhrResponse = require('../../lib/core/xhr/XhrResponse');
import xhrMock = require('../../lib/core/xhr/XhrMock');

export class Mock {

    public rcsdk:RCSDK;

    constructor(rcsdk:RCSDK) {

        this.rcsdk = rcsdk;

        var platform = rcsdk.getPlatform();

        rcsdk.getContext()
            .useAjaxStub(true)
            .usePubnubStub(true);

        platform.pollInterval = 1;
        platform.refreshDelayMs = 1;

    }

    registerHooks(suite:any, username?:string) {

        suite.afterEach((done) => {

            //this.rcsdk.getPlatform()
            //    .logout()
            //    .then(function() {
            //        done();
            //    })
            //    .catch(done);

            done();

        });

        this.registerCleanup(suite);

        suite.beforeEach((done) => {

            this.authentication();

            this.rcsdk.getPlatform()
                .authorize({
                    username: username || 'whatever',
                    password: 'whatever'
                })
                .then(function() {
                    done();
                })
                .catch(done);

        });

    }

    registerCleanup(suite:any) {

        var cleanup = () => {

            this.rcsdk.getCache().clean();

            // Clear events and all for singletons
            this.rcsdk.getPlatform().destroy();

            this.rcsdk.getXhrResponse().clear();

        };

        suite.beforeEach((done) => {
            cleanup();
            done();
        });

        suite.afterEach((done) => {
            cleanup();
            done();
        });

    }

    apiCall(path:string, response:any, status?:number) {

        this.rcsdk.getXhrResponse().add({
            path: path,
            response: function(ajax:xhrMock.XhrMock) {

                ajax.setStatus(status || 200);

                return response;

            }
        });

    }

    authentication() {

        this.rcsdk.getXhrResponse().add({
            path: '/restapi/oauth/token',
            response: (ajax:xhrMock.XhrMock) => {

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
            test: function(ajax) {

                return (!ajax.data || !ajax.data['refresh_token']);

            }
        });

        this.rcsdk.getXhrResponse().add({
            path: '/restapi/oauth/revoke',
            response: function(ajax:xhrMock.XhrMock) {

                return {};

            }
        });

    }

    presenceLoad(id, detailed) {

        this.rcsdk.getXhrResponse().add({
            path: '/restapi/v1.0/account/~/extension/' + id + '/presence',
            response: function(ajax:xhrMock.XhrMock) {

                return {
                    "uri": "https://platform.ringcentral.com/restapi/v1.0/account/123/extension/" + id + "/presence",
                    "extension": {
                        "uri": "https://platform.ringcentral.com/restapi/v1.0/account/123/extension/" + id,
                        "id": id,
                        "extensionNumber": "101"
                    },
                    "activeCalls": [],
                    "presenceStatus": "Available",
                    "telephonyStatus": "Ringing",
                    "userStatus": "Available",
                    "dndStatus": "TakeAllCalls",
                    "extensionId": id
                };

            }
        });

    }

    subscribeGeneric(expiresIn?:number) {

        this.rcsdk.getXhrResponse().add({
            path: '/restapi/v1.0/subscription',
            response: function(ajax:xhrMock.XhrMock) {

                expiresIn = expiresIn || 15 * 60 * 60;

                var date = new Date();

                return {
                    'eventFilters': ajax.data.eventFilters,
                    'expirationTime': new Date(date.getTime() + (expiresIn * 1000)).toISOString(),
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

    }

    subscribeOnPresence(id?:string, detailed?:boolean) {

        id = id || '1';

        this.rcsdk.getXhrResponse().add({
            path: '/restapi/v1.0/subscription',
            response: function(ajax:xhrMock.XhrMock) {

                var date = new Date();

                return {
                    'eventFilters': ['/restapi/v1.0/account/~/extension/' + id + '/presence' + (detailed ? '?detailedTelephonyState=true' : '')],
                    'expirationTime': new Date(date.getTime() + (15 * 60 * 60 * 1000)).toISOString(),
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

    }

    tokenRefresh(failure?:boolean) {

        this.rcsdk.getXhrResponse().add({
            path: '/restapi/oauth/token',
            response: function(ajax:xhrMock.XhrMock):any {

                if (!failure) return {
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
            test: function(ajax) {

                return (ajax.data && ajax.data['refresh_token']);

            }
        });

    }

}