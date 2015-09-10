/// <reference path="./externals.d.ts" />
/// <reference path="./core/Cache.ts" />
/// <reference path="./core/Log.ts" />
/// <reference path="./core/Observable.ts" />
/// <reference path="./core/PageVisibility.ts" />
/// <reference path="./core/Utils.ts" />
/// <reference path="./http/Client.ts" />
/// <reference path="./platform/Platform.ts" />
/// <reference path="./platform/Queue.ts" />
/// <reference path="./subscription/Subscription.ts" />
/// <reference path="./pubnub/PubnubFactory.ts" />
/// <reference path="./externals/Externals.ts" />

module RingCentral.sdk {

    export class SDK {

        static version = '2.0.0';

        static server = {
            sandbox: 'https://platform.devtest.ringcentral.com',
            production: 'https://platform.ringcentral.com'
        };

        private _platform:platform.Platform;
        private _cache:core.Cache;
        private _queue:platform.Queue;
        private _client:http.Client;
        private _pubnubFactory:pubnub.PubnubFactory;
        private _mockRegistry:mocks.Registry;

        constructor(options?:{
            server:string;
            appKey:string;
            appSecret:string;
            appName?:string;
            appVersion?:string;
            cachePrefix?:string;
            useHttpMock?:boolean;
            usePubnubMock?:boolean;
        }) {

            options = options || <any>{};

            externals.get();

            this._mockRegistry = new mocks.Registry();

            this._cache = new core.Cache(typeof localStorage !== 'undefined' ? localStorage : <Storage>{}, options.cachePrefix);

            this._client = options.useHttpMock ? new http.ClientMock(this._mockRegistry) : new http.Client();

            this._platform = new platform.Platform(this._client, this._cache, options.server, options.appKey, options.appSecret);

            this._pubnubFactory = new pubnub.PubnubFactory(options.usePubnubMock);

            //TODO Link Platform events with Subscriptions and the rest

        }

        platform():platform.Platform {
            return this._platform;
        }

        cache():core.Cache {
            return this._cache;
        }

        createSubscription():subscription.Subscription {
            return new subscription.Subscription(this._pubnubFactory, this._platform);
        }

        createPageVisibility() {
            return new core.PageVisibility();
        }

        createObservable() {
            return new core.Observable();
        }

        log() {
            return core.log;
        }

        utils() {
            return core.utils;
        }

        mockRegistry() { return this._mockRegistry; }

    }

}

var e = RingCentral.sdk.externals.get();

if (typeof define === 'function' && define.amd) {

    define(['pubnub'], function(PUBNUB) {
        e._PUBNUB = PUBNUB;
        return RingCentral.sdk;
    });

} else if (typeof module === 'object' && module.exports) {

    e._PUBNUB = require('pubnub');
    e._Promise = typeof (Promise) !== 'undefined' ? Promise : require('es6-promise').Promise;
    e._fetch = require('node-fetch');
    e._Request = e._fetch['Request'];
    e._Response = e._fetch['Response'];
    e._Headers = e._fetch['Headers'];

    module.exports = RingCentral.sdk;

} else {

    //TODO noConflict

}
