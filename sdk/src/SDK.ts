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
    SendOptions,
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
    CreateRequestOptions,
};

let defaultExternals: ExternalsOptions = {};

export const setDefaultExternals = (externals: ExternalsOptions) => (defaultExternals = externals);

export class SDK {
    private _externals: Externals;

    private _cache: Cache;

    private _client: Client;

    private _platform: Platform;

    public static version = Constants.version;

    public static server = {
        sandbox: 'https://platform.devtest.ringcentral.com',
        production: 'https://platform.ringcentral.com',
    };

    public static handleLoginRedirect(origin, win) {
        win = win || window;
        const response = win.location.search ? win.location.search : win.location.hash;
        const msg = {};
        msg[Constants.authResponseProperty] = response;
        win.opener.postMessage(msg, origin || win.location.origin);
    }

    public constructor(options: SDKOptions = {}) {
        const {cachePrefix, defaultRequestInit} = options;

        this._externals = new Externals({
            ...defaultExternals,
            ...options,
        });

        this._cache = new Cache({
            externals: this._externals,
            prefix: cachePrefix,
        });

        this._client = new Client({
            externals: this._externals,
            defaultRequestInit,
        });

        this._platform = new Platform({
            ...options,
            externals: this._externals,
            client: this._client,
            cache: this._cache,
        });
    }

    public platform() {
        return this._platform;
    }

    public client() {
        return this._client;
    }

    public cache() {
        return this._cache;
    }

    public send = async (options: SendOptions): Promise<Response> => this.platform().send(options);

    public get = async (url, query?, options?: SendOptions): Promise<Response> =>
        this.platform().send({method: 'GET', url, query, ...options});

    public post = async (url, body?, query?, options?: SendOptions): Promise<Response> =>
        this.platform().send({method: 'POST', url, query, body, ...options});

    public put = async (url, body?, query?, options?: SendOptions): Promise<Response> =>
        this.platform().send({method: 'PUT', url, query, body, ...options});

    public delete = async (url, query?, options?: SendOptions): Promise<Response> =>
        this.platform().send({method: 'DELETE', url, query, ...options});

    public login = async (options: LoginOptions): Promise<Response> => this.platform().login(options);

    public ensureLoggedIn = async (): Promise<Response> => this.platform().ensureLoggedIn();

    public loginUrl = (options: LoginUrlOptions): string => this.platform().loginUrl(options);

    public createUrl = (path, options: CreateUrlOptions): string => this.platform().createUrl(path, options);

    public signUrl = async (path): Promise<string> => this.platform().signUrl(path);

    public parseLoginRedirect = (url): any => this.platform().parseLoginRedirect(url);

    public logout = async (): Promise<Response> => this.platform().logout();

    public loginWindow = async (options: LoginWindowOptions): Promise<LoginOptions> =>
        this.platform().loginWindow(options);

    public refresh = async (): Promise<Response> => this.platform().refresh();

    public multipart = async (response: Response): Promise<Response[]> => this.client().multipart(response);

    public getContentType = (response: Response): string => this.client().getContentType(response);

    public isMultipart = (response: Response) => this.client().isMultipart(response);

    public isJson = (response: Response) => this.client().isJson(response);

    public error = (response: Response): Promise<string> => this.client().error(response);
}

export interface SDKOptions extends PlatformOptions, ExternalsOptions {
    cachePrefix?: string;
    defaultRequestInit?: CreateRequestOptions;
}

export default SDK;
