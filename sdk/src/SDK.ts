import EventEmitter from "events";
import Cache from "./core/Cache";
import Externals, {ExternalsOptions} from "./core/Externals";
import * as Constants from "./core/Constants";
import Client from "./http/Client";
import ApiResponse from "./http/ApiResponse";
import Platform, {
    CreateUrlOptions,
    LoginOptions,
    LoginUrlOptions,
    PlatformOptions,
    SendOptions
} from "./platform/Platform";
import {AuthData} from "./platform/Auth";

declare const window: any; //FIXME TS Crap

export {
    Cache,
    ApiResponse,
    Externals,
    LoginOptions,
    LoginUrlOptions,
    CreateUrlOptions,
    SendOptions,
    AuthData,
    EventEmitter
}

export class SDK {

    private _externals: Externals;
    private _cache: Cache;
    private _client: Client;
    private _platform: Platform;

    constructor(options: SDKOptions = {}) {

        this._externals = new Externals(options);

        this._cache = new Cache({
            externals: this._externals,
            prefix: options.cachePrefix
        });

        this._client = new Client(this._externals);

        // extract known options
        const {
            server,
            appKey,
            appSecret,
            redirectUri,
            refreshDelayMs,
            refreshHandicapMs,
            clearCacheOnRefreshError,
            appName,
            appVersion
        } = options;

        this._platform = new Platform({
            server,
            appKey,
            appSecret,
            redirectUri,
            refreshDelayMs,
            refreshHandicapMs,
            clearCacheOnRefreshError,
            appName,
            appVersion,
            externals: this._externals,
            cache: this._cache,
            client: this._client
        });

    }

    static version = Constants.version;

    static server = {
        sandbox: 'https://platform.devtest.ringcentral.com',
        production: 'https://platform.ringcentral.com'
    };

    externals() {
        return this._externals;
    }

    platform() {
        return this._platform;
    }

    cache() {
        return this._cache;
    }

    static handleLoginRedirect(origin, win) {

        win = win || window;

        var response = win.location.hash ? win.location.hash : win.location.search;
        var msg = {};
        msg[Constants.authResponseProperty] = response;
        win.opener.postMessage(msg, origin || win.location.origin);

    }

}

export interface SDKOptions extends PlatformOptions, ExternalsOptions {
    cachePrefix?: string;
}

export default SDK;

namespace RingCentral.sdk {
    declare const SDK;
}