import EventEmitter from 'events';
import Cache from './core/Cache';
import Externals, {ExternalsOptions} from './core/Externals';
import * as Constants from './core/Constants';
import Client, {CreateRequestOptions} from './http/Client';
import ApiResponse from './http/ApiResponse';
import Platform, {
    CreateUrlOptions,
    LoginOptions,
    LoginUrlOptions,
    PlatformOptions,
    SendOptions
} from './platform/Platform';
import {AuthData} from './platform/Auth';

export {
    Cache,
    ApiResponse,
    Externals,
    LoginOptions,
    LoginUrlOptions,
    CreateUrlOptions,
    SendOptions,
    AuthData,
    EventEmitter,
    ExternalsOptions,
    CreateRequestOptions
};

let defaultExternals: ExternalsOptions = {};

export const setDefaultExternals = (externals: ExternalsOptions) => (defaultExternals = externals);

export class SDK {
    private _externals: Externals;
    private _cache: Cache;
    private _client: Client;
    private _platform: Platform;

    static version = Constants.version;

    static server = {
        sandbox: 'https://platform.devtest.ringcentral.com',
        production: 'https://platform.ringcentral.com'
    };

    static handleLoginRedirect(origin, win) {
        win = win || window;
        const response = win.location.search ? win.location.search : win.location.hash;
        const msg = {};
        msg[Constants.authResponseProperty] = response;
        win.opener.postMessage(msg, origin || win.location.origin);
    }

    constructor(options: SDKOptions = {}) {
        const {cachePrefix, defaultRequestInit} = options;

        this._externals = new Externals({
            ...defaultExternals,
            ...options
        });

        this._cache = new Cache({
            externals: this._externals,
            prefix: cachePrefix
        });

        this._client = new Client({
            externals: this._externals,
            defaultRequestInit
        });

        this._platform = new Platform({
            ...options,
            externals: this._externals,
            client: this._client,
            cache: this._cache
        });
    }

    externals() {
        return this._externals;
    }

    platform() {
        return this._platform;
    }

    cache() {
        return this._cache;
    }
}

export interface SDKOptions extends PlatformOptions, ExternalsOptions {
    cachePrefix?: string;
    defaultRequestInit?: CreateRequestOptions;
}

export default SDK;
