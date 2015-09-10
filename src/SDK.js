import * as Utils from './core/Utils';
import Cache from './core/Cache';
import * as Externals from './core/Externals';
import Observable from './core/Observable';

import Client from './http/Client';
import ApiResponse from './http/ApiResponse';
import * as HttpUtils from './http/Utils';

import {default as ClientMock} from './mocks/ClientMock';
import Mock from './mocks/Mock';
import Registry from './mocks/Registry';

import Platform from './platform/Platform';
import Auth from './platform/Auth';
import Queue from './platform/Queue';

import PubnubMockFactory from './pubnub/PubnubFactory';

import Subscription from './subscription/Subscription';

require("regenerator/runtime");

export default class SDK {

    static version = '2.0.0';

    static server = {
        sandbox: 'https://platform.devtest.ringcentral.com',
        production: 'https://platform.ringcentral.com'
    };

    /**
     * @constructor
     * @param {object} [options]
     * @param {string} [options.server]
     * @param {string} [options.cachePrefix]
     * @param {string} [options.appSecret]
     * @param {string} [options.appKey]
     * @param {string} [options.appName]
     * @param {string} [options.appVersion]
     * @param {string} [options.pubnubFactory]
     * @param {string} [options.client]
     */
    constructor(options) {

        options = options || {};

        this._cache = new Cache(Externals.localStorage, options.cachePrefix);

        this._client = options.client || new Client();

        this._platform = new Platform(this._client, this._cache, options.server, options.appKey, options.appSecret);

        this._pubnubFactory = options.pubnubFactory || Externals.PUBNUB;

    }

    /**
     * @return {Platform}
     */
    platform() {
        return this._platform;
    }

    /**
     * @return {Subscription}
     */
    createSubscription() {
        return new Subscription(this._pubnubFactory, this._platform, this._cache);
    }

    /**
     * @return {Cache}
     */
    cache() {
        return this._cache;
    }

    static core = {
        Cache: Cache,
        Observable: Observable,
        Utils: Utils,
        Externals: Externals
    };

    static http = {
        Client: Client,
        ApiResponse: ApiResponse,
        Utils: HttpUtils
    };

    static platform = {
        Auth: Auth,
        Platform: Platform,
        Queue: Queue
    };

    static subscription = {
        Subscription: Subscription
    };

    static mocks = {
        Client: ClientMock,
        Registry: Registry,
        Mock: Mock
    };

    static pubnub = {
        PubnubMockFactory: PubnubMockFactory
    };

}