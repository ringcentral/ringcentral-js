import EventEmitter from 'events';
import Cache from './core/Cache';
import Externals, {ExternalsOptions} from './core/Externals';
import * as Constants from './core/Constants';
import Client, {ApiError, CreateRequestOptions} from './http/Client';
import Platform, {
    CreateUrlOptions,
    LoginOptions,
    LoginUrlOptions,
    LoginWindowOptions,
    PlatformOptions,
    SendOptions
} from './platform/Platform';
import {AuthData} from './platform/Auth';

export {
    Cache,
    Externals,
    LoginOptions,
    LoginUrlOptions,
    LoginWindowOptions,
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

    platform() {
        return this._platform;
    }

    client() {
        return this._client;
    }

    cache() {
        return this._cache;
    }

    send = async (options: SendOptions): Promise<Response> => this.platform().send(options);

    get = async (url, query?, options?: SendOptions): Promise<Response> =>
        this.platform().send({method: 'GET', url, query, ...options});

    post = async (url, body?, query?, options?: SendOptions): Promise<Response> =>
        this.platform().send({method: 'POST', url, query, body, ...options});

    put = async (url, body?, query?, options?: SendOptions): Promise<Response> =>
        this.platform().send({method: 'PUT', url, query, body, ...options});

    delete = async (url, query?, options?: SendOptions): Promise<Response> =>
        this.platform().send({method: 'DELETE', url, query, ...options});

    login = async (options: LoginOptions): Promise<Response> => this.platform().login(options);

    ensureLoggedIn = async (): Promise<Response> => this.platform().ensureLoggedIn();

    loginUrl = (options: LoginUrlOptions): string => this.platform().loginUrl(options);

    createUrl = (path, options: CreateUrlOptions): string => this.platform().createUrl(path, options);

    signUrl = async (path): Promise<string> => this.platform().signUrl(path);

    parseLoginRedirect = (url): any => this.platform().parseLoginRedirect(url);

    logout = async (): Promise<Response> => this.platform().logout();

    loginWindow = async (options: LoginWindowOptions): Promise<LoginOptions> => this.platform().loginWindow(options);

    refresh = async (): Promise<Response> => this.platform().refresh();

    multipart = async (response: Response): Promise<Response[]> => this.client().multipart(response);

    getContentType = (response: Response): string => this.client().getContentType(response);

    isMultipart = (response: Response) => this.client().isMultipart(response);

    isJson = (response: Response) => this.client().isJson(response);

    error = (response: Response): Promise<string> => this.client().error(response);
}

export interface SDKOptions extends PlatformOptions, ExternalsOptions {
    cachePrefix?: string;
    defaultRequestInit?: CreateRequestOptions;
}

export default SDK;
