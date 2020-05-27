import {EventEmitter} from 'events';
import {createHash, randomBytes} from 'crypto';

import * as qs from 'querystring';
import Auth, {AuthOptions} from './Auth';
import * as Constants from '../core/Constants';
import Cache from '../core/Cache';
import Client, {ApiError} from '../http/Client';
import Externals from '../core/Externals';

declare const screen: any; //FIXME TS Crap

const delay = (timeout): Promise<any> =>
    new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve(null);
        }, timeout);
    });

const getParts = (url, separator) => url.split(separator).reverse()[0];

export enum events {
    beforeLogin = 'beforeLogin',
    loginSuccess = 'loginSuccess',
    loginError = 'loginError',
    beforeRefresh = 'beforeRefresh',
    refreshSuccess = 'refreshSuccess',
    refreshError = 'refreshError',
    beforeLogout = 'beforeLogout',
    logoutSuccess = 'logoutSuccess',
    logoutError = 'logoutError',
    rateLimitError = 'rateLimitError',
}

export default class Platform extends EventEmitter {
    public static _cacheId = 'platform';

    public events = events;

    private _server: string;

    private _clientId: string;

    private _clientSecret: string;

    private _redirectUri: string;

    private _refreshDelayMs: number;

    private _clearCacheOnRefreshError: boolean;

    private _userAgent: string;

    private _externals: Externals;

    private _cache: Cache;

    private _client: Client;

    private _refreshPromise: Promise<any>;

    private _auth: Auth;

    private _tokenEndpoint;

    private _revokeEndpoint;

    private _authorizeEndpoint;

    private _authProxy;

    private _urlPrefix;

    private _handleRateLimit: boolean | number;

    private _codeVerifier: string;

    public constructor({
        server,
        clientId,
        clientSecret,
        redirectUri = '',
        refreshDelayMs = 100,
        clearCacheOnRefreshError = true,
        appName = '',
        appVersion = '',
        externals,
        cache,
        client,
        refreshHandicapMs,
        tokenEndpoint = '/restapi/oauth/token',
        revokeEndpoint = '/restapi/oauth/revoke',
        authorizeEndpoint = '/restapi/oauth/authorize',
        authProxy = false,
        urlPrefix = '',
        handleRateLimit,
    }: PlatformOptionsConstructor) {
        super();

        this._server = server;
        this._clientId = clientId;
        this._clientSecret = clientSecret;
        this._redirectUri = redirectUri;
        this._refreshDelayMs = refreshDelayMs;
        this._clearCacheOnRefreshError = clearCacheOnRefreshError;
        this._authProxy = authProxy;
        this._urlPrefix = urlPrefix;
        this._userAgent = `${appName ? `${appName + (appVersion ? `/${appVersion}` : '')} ` : ''}RCJSSDK/${
            Constants.version
        }`;

        this._externals = externals;
        this._cache = cache;
        this._client = client;
        this._refreshPromise = null;
        this._auth = new Auth({
            cache: this._cache,
            cacheId: Platform._cacheId,
            refreshHandicapMs,
        });
        this._tokenEndpoint = tokenEndpoint;
        this._revokeEndpoint = revokeEndpoint;
        this._authorizeEndpoint = authorizeEndpoint;
        this._handleRateLimit = handleRateLimit;
        this._codeVerifier = '';
    }

    public on(event: events.beforeLogin, listener: () => void);
    public on(event: events.loginSuccess, listener: (response: Response) => void);
    public on(event: events.loginError, listener: (error: ApiError | Error) => void);
    public on(event: events.beforeRefresh, listener: () => void);
    public on(event: events.refreshSuccess, listener: (response: Response) => void);
    public on(event: events.refreshError, listener: (error: ApiError | Error) => void);
    public on(event: events.beforeLogout, listener: () => void);
    public on(event: events.logoutSuccess, listener: (response: Response) => void);
    public on(event: events.logoutError, listener: (error: ApiError | Error) => void);
    public on(event: events.rateLimitError, listener: (error: ApiError | Error) => void);
    public on(event: string, listener: (...args) => void) {
        return super.on(event, listener);
    }

    public auth() {
        return this._auth;
    }

    public createUrl(path = '', options: CreateUrlOptions = {}) {
        let builtUrl = '';

        const hasHttp = path.startsWith('http://') || path.startsWith('https://');

        if (options.addServer && !hasHttp) builtUrl += this._server;

        if (this._urlPrefix) builtUrl += this._urlPrefix;

        builtUrl += path;

        if (options.addMethod) builtUrl += `${path.includes('?') ? '&' : '?'}_method=${options.addMethod}`;

        return builtUrl;
    }

    public async signUrl(path: string) {
        return `${path + (path.includes('?') ? '&' : '?')}access_token=${(await this._auth.data()).access_token}`;
    }

    public loginUrl({
        implicit,
        state,
        brandId,
        display,
        prompt,
        uiOptions,
        uiLocales,
        localeId,
        usePKCE,
        responseHint,
    }: LoginUrlOptions = {}) {
        let query: AuthorizationQuery = {
            response_type: implicit ? 'token' : 'code',
            redirect_uri: this._redirectUri,
            client_id: this._clientId,
            state,
            brand_id: brandId,
            display,
            prompt,
            ui_options: uiOptions,
            ui_locales: uiLocales,
            localeId,
        };
        if (responseHint) {
            query.response_hint = responseHint;
        }
        if (usePKCE && implicit) {
            throw new Error('PKCE only works with Authrization Code Flow');
        }
        this._codeVerifier = '';
        if (usePKCE) {
            this._codeVerifier = this._generateCodeVerifier();
            query.code_challenge = createHash('sha256')
                .update(this._codeVerifier)
                .digest()
                .toString('base64')
                .replace(/\+/g, '-')
                .replace(/\//g, '_')
                .replace(/=/g, '');
            query.code_challenge_method = 'S256';
        }
        return this.createUrl(`${this._authorizeEndpoint}?${qs.stringify(query)}`, {addServer: true});
    }

    /**
     * @return {string}
     */
    private _generateCodeVerifier() {
        let codeVerifier: any = randomBytes(32);
        codeVerifier = codeVerifier
            .toString('base64')
            .replace(/\//g, '_')
            .replace(/=/g, '');
        return codeVerifier;
    }

    /**
     * @param {string} url
     * @return {Object}
     */
    public parseLoginRedirect(url: string) {
        const response =
            (url.startsWith('#') && getParts(url, '#')) || (url.startsWith('?') && getParts(url, '?')) || null;

        if (!response) throw new Error('Unable to parse response');

        const queryString = qs.parse(response);

        if (!queryString) throw new Error('Unable to parse response');

        const error = queryString.error_description || queryString.error;

        if (error) {
            const e: any = new Error(error.toString());
            e.error = queryString.error;
            throw e;
        }

        return queryString;
    }

    /**
     * Convenience method to handle 3-legged OAuth
     *
     * Attention! This is an experimental method and it's signature and behavior may change without notice.
     */
    public loginWindow({
        url,
        width = 400,
        height = 600,
        origin = window.location.origin,
        property = Constants.authResponseProperty,
        target = '_blank',
    }: LoginWindowOptions): Promise<LoginOptions> {
        return new Promise((resolve, reject) => {
            if (typeof window === 'undefined') throw new Error('This method can be used only in browser');

            if (!url) throw new Error('Missing mandatory URL parameter');

            const dualScreenLeft = window.screenLeft !== undefined ? window.screenLeft : 0;
            const dualScreenTop = window.screenTop !== undefined ? window.screenTop : 0;

            const screenWidth = screen.width;
            const screenHeight = screen.height;

            const left = screenWidth / 2 - width / 2 + dualScreenLeft;
            const top = screenHeight / 2 - height / 2 + dualScreenTop;

            const win = window.open(
                url,
                '_blank',
                target === '_blank'
                    ? `scrollbars=yes, status=yes, width=${width}, height=${height}, left=${left}, top=${top}`
                    : '',
            );

            if (!win) {
                throw new Error('Could not open login window. Please allow popups for this site');
            }

            if (win.focus) win.focus();

            const eventListener = e => {
                try {
                    if (e.origin !== origin) return;
                    if (!e.data || !e.data[property]) return; // keep waiting

                    win.close();
                    window.addEventListener('message', eventListener);

                    const loginOptions = this.parseLoginRedirect(e.data[property]);

                    if (!loginOptions.code && !loginOptions.access_token)
                        throw new Error('No authorization code or token');

                    resolve(loginOptions);
                } catch (e) {
                    reject(e);
                }
            };

            window.addEventListener('message', eventListener, false);
        });
    }

    /**
     * @return {Promise<boolean>}
     */
    public async loggedIn() {
        try {
            if (this._authProxy) {
                await this.get('/restapi/v1.0/client-info'); // we only can determine the status if we actually make request
            } else {
                await this.ensureLoggedIn();
            }
            return true;
        } catch (e) {
            return false;
        }
    }

    public async login({
        username,
        password,
        extension = '',
        code,
        access_token_ttl,
        refresh_token_ttl,
        access_token,
        endpoint_id,
        ...options
    }: LoginOptions = {}): Promise<Response> {
        try {
            this.emit(this.events.beforeLogin);

            const body: any = {};
            let response = null;
            let json;

            if (access_token) {
                //TODO Potentially make a request to /oauth/tokeninfo
                json = {access_token, ...options};
            } else {
                let skipAuthHeader = false;
                if (!code) {
                    body.grant_type = 'password';
                    body.username = username;
                    body.password = password;
                    body.extension = extension;
                } else if (code) {
                    //@see https://developers.ringcentral.com/legacy-api-reference/index.html#!#RefAuthorizationCodeFlow
                    body.grant_type = 'authorization_code';
                    body.code = code;
                    body.redirect_uri = this._redirectUri;
                    if (this._codeVerifier && this._codeVerifier.length > 0) {
                        body.client_id = this._clientId;
                        body.code_verifier = this._codeVerifier;
                        skipAuthHeader = true;
                    }
                }

                if (access_token_ttl) body.access_token_ttl = access_token_ttl;
                if (refresh_token_ttl) body.refresh_token_ttl = refresh_token_ttl;
                if (endpoint_id) body.endpoint_id = endpoint_id;

                response = await this._tokenRequest(this._tokenEndpoint, body, skipAuthHeader);

                json = await response.clone().json();
            }

            await this._auth.setData(json);

            this.emit(this.events.loginSuccess, response);

            return response;
        } catch (e) {
            if (this._clearCacheOnRefreshError) await this._cache.clean();

            this.emit(this.events.loginError, e);

            throw e;
        }
    }

    private async _refresh(): Promise<Response> {
        try {
            this.emit(this.events.beforeRefresh);

            await delay(this._refreshDelayMs);

            const authData = await this.auth().data();

            // Perform sanity checks
            if (!authData.refresh_token) throw new Error('Refresh token is missing');
            if (!this._auth.refreshTokenValid()) throw new Error('Refresh token has expired');

            const res = await this._tokenRequest(this._tokenEndpoint, {
                grant_type: 'refresh_token',
                refresh_token: authData.refresh_token,
                access_token_ttl: authData.expires_in + 1,
                refresh_token_ttl: authData.refresh_token_expires_in + 1,
            });

            const json = await res.clone().json();

            if (!json.access_token) {
                throw await this._client.makeError(new Error('Malformed OAuth response'), res);
            }

            await this._auth.setData(json);

            this.emit(this.events.refreshSuccess, res);

            return res;
        } catch (e) {
            if (this._clearCacheOnRefreshError) {
                await this._cache.clean();
            }

            this.emit(this.events.refreshError, e);

            throw e;
        }
    }

    public async refresh(): Promise<Response> {
        if (this._authProxy) {
            throw new Error('Refresh is not supported in Auth Proxy mode');
        }
        if (!this._refreshPromise) {
            this._refreshPromise = (async () => {
                try {
                    const res = await this._refresh();
                    this._refreshPromise = null;
                    return res;
                } catch (e) {
                    this._refreshPromise = null;
                    throw e;
                }
            })();
        }

        return this._refreshPromise;
    }

    public async logout(): Promise<Response> {
        if (this._authProxy) {
            throw new Error('Logout is not supported in Auth Proxy mode');
        }
        try {
            this.emit(this.events.beforeLogout);

            let res = null;

            //FIXME https://developers.ringcentral.com/legacy-api-reference/index.html#!#RefRevokeToken.html requires secret
            if (this._revokeEndpoint && this._clientSecret) {
                res = await this._tokenRequest(this._revokeEndpoint, {
                    token: (await this._auth.data()).access_token,
                });
            }

            await this._cache.clean();

            this.emit(this.events.logoutSuccess, res);

            return res;
        } catch (e) {
            this.emit(this.events.logoutError, e);

            throw e;
        }
    }

    public async inflateRequest(request: Request, options: SendOptions = {}): Promise<Request> {
        options = options || {};

        request.headers.set('X-User-Agent', this._userAgent);

        if (options.skipAuthCheck) return request;

        await this.ensureLoggedIn();

        request.headers.set('Client-Id', this._clientId);
        if (!this._authProxy) request.headers.set('Authorization', await this.authHeader());

        return request;
    }

    public async sendRequest(request: Request, options: SendOptions = {}): Promise<Response> {
        try {
            request = await this.inflateRequest(request, options);
            return await this._client.sendRequest(request);
        } catch (e) {
            let {retry, handleRateLimit} = options;

            // Guard is for errors that come from polling
            if (!e.response || retry) throw e;

            const {response} = e;
            const {status} = response;

            if ((status !== Client._unauthorizedStatus && status !== Client._rateLimitStatus) || this._authProxy)
                throw e;

            options.retry = true;

            let retryAfter = 0;

            if (status === Client._unauthorizedStatus) {
                await this._auth.cancelAccessToken();
            }

            if (status === Client._rateLimitStatus) {
                handleRateLimit = handleRateLimit || this._handleRateLimit;

                const defaultRetryAfter =
                    !handleRateLimit || typeof handleRateLimit === 'boolean' ? 60 : handleRateLimit;

                // FIXME retry-after is custom header, by default, it can't be retrieved. Server should add header: 'Access-Control-Expose-Headers: retry-after'.
                retryAfter = parseFloat(response.headers.get('retry-after') || defaultRetryAfter) * 1000;

                e.retryAfter = retryAfter;

                this.emit(this.events.rateLimitError, e);

                if (!handleRateLimit) throw e;
            }

            await delay(retryAfter);
            return this.sendRequest(this._client.createRequest(options), options);
        }
    }

    public send(options: SendOptions = {}) {
        //FIXME https://github.com/bitinn/node-fetch/issues/43
        options.url = this.createUrl(options.url, {addServer: true});

        return this.sendRequest(this._client.createRequest(options), options);
    }

    public async get(url, query?, options?: SendOptions): Promise<Response> {
        return this.send({method: 'GET', url, query, ...options});
    }

    public async post(url, body?, query?, options?: SendOptions): Promise<Response> {
        return this.send({method: 'POST', url, query, body, ...options});
    }

    public async put(url, body?, query?, options?: SendOptions): Promise<Response> {
        return this.send({method: 'PUT', url, query, body, ...options});
    }

    public async patch(url, body?, query?, options?: SendOptions): Promise<Response> {
        return this.send({method: 'PATCH', url, query, body, ...options});
    }

    public async delete(url, query?, options?: SendOptions): Promise<Response> {
        return this.send({method: 'DELETE', url, query, ...options});
    }

    public async ensureLoggedIn(): Promise<Response | null> {
        if (this._authProxy) return null;
        if (await this._auth.accessTokenValid()) return null;
        await this.refresh();
        return null;
    }

    protected async _tokenRequest(url, body, skipAuthHeader: boolean = false): Promise<Response> {
        let headers: TokenRequestHeaders = {
            'Content-Type': Client._urlencodedContentType,
        };
        if (!skipAuthHeader) {
            headers.Authorization = this.basicAuthHeader();
        }
        return this.send({
            url,
            body,
            skipAuthCheck: true,
            method: 'POST',
            headers,
        });
    }

    public basicAuthHeader(): string {
        const apiKey = this._clientId + (this._clientSecret ? `:${this._clientSecret}` : '');
        return `Basic ${typeof btoa === 'function' ? btoa(apiKey) : Buffer.from(apiKey).toString('base64')}`;
    }

    public async authHeader(): Promise<string> {
        const data = await this._auth.data();
        return (data.token_type || 'Bearer') + (data.access_token ? ` ${data.access_token}` : '');
    }
}

export interface PlatformOptions extends AuthOptions {
    server?: string;
    clientId?: string;
    clientSecret?: string;
    redirectUri?: string;
    refreshDelayMs?: number;
    refreshHandicapMs?: number;
    clearCacheOnRefreshError?: boolean;
    appName?: string;
    appVersion?: string;
    tokenEndpoint?: string;
    revokeEndpoint?: string;
    authorizeEndpoint?: string;
    authProxy?: boolean;
    urlPrefix?: string;
    handleRateLimit?: boolean | number;
}

export interface PlatformOptionsConstructor extends PlatformOptions {
    externals: Externals;
    cache: Cache;
    client: Client;
}

export interface SendOptions {
    url?: any;
    body?: any;
    method?: string;
    query?: any;
    headers?: any;
    skipAuthCheck?: boolean;
    handleRateLimit?: boolean | number;
    retry?: boolean; // Will be set by this method if SDK makes second request
}

export interface LoginOptions {
    username?: string;
    password?: string;
    extension?: string;
    code?: string;
    access_token?: string;
    access_token_ttl?: number;
    refresh_token_ttl?: number;
    endpoint_id?: string;
}

export interface LoginUrlOptions {
    state?: string;
    brandId?: string;
    display?: LoginUrlDisplay | string;
    prompt?: LoginUrlPrompt | string;
    implicit?: boolean;
    uiOptions?: string | string[];
    uiLocales?: string;
    localeId?: string;
    usePKCE?: boolean;
    responseHint?: string | string[];
}

export enum LoginUrlPrompt {
    login = 'login',
    sso = 'sso',
    consent = 'consent',
    none = 'none',
}

export enum LoginUrlDisplay {
    page = 'page',
    popup = 'popup',
    touch = 'touch',
    mobile = 'mobile',
}

export interface CreateUrlOptions {
    addServer?: boolean;
    addMethod?: string;
}

export interface LoginWindowOptions {
    url: string;
    width?: number;
    height?: number;
    origin?: string;
    property?: string;
    target?: string;
}

export interface AuthorizationQuery {
    response_type: 'token' | 'code';
    response_hint?: string | string[];
    redirect_uri: string;
    client_id: string;
    state?: string;
    brand_id?: string;
    display?: LoginUrlDisplay | string;
    prompt?: LoginUrlPrompt | string;
    ui_options?: string | string[];
    ui_locales?: string;
    localeId?: string;
    code_challenge?: string;
    code_challenge_method?: string;
}

export interface TokenRequestHeaders {
    'Content-Type': string;
    Authorization?: string;
}
