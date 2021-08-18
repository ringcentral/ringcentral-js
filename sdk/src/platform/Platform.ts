import {EventEmitter} from 'events';
import {createHash, randomBytes} from 'crypto';

import * as qs from 'querystring';
import Auth, {AuthOptions, AuthData} from './Auth';
import Discovery from './Discovery';
import * as Constants from '../core/Constants';
import Cache from '../core/Cache';
import Client, {ApiError} from '../http/Client';
import Externals from '../core/Externals';
import {delay} from './utils';

declare const screen: any; //FIXME TS Crap

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

function checkPathHasHttp(path) {
    return path.startsWith('http://') || path.startsWith('https://');
}

export default class Platform extends EventEmitter {
    public static _cacheId = 'platform';
    public static _discoveryCacheId = 'platform-discovery';

    public events = events;

    private _server: string;

    private _rcvServer: string;

    private _clientId: string;

    private _clientSecret: string;

    private _redirectUri: string;

    private _brandId: string;

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

    private _discovery?: Discovery;

    private _discoveryInitPromise: Promise<void>;

    public constructor({
        server,
        clientId,
        clientSecret,
        brandId,
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
        enableDiscovery = false,
        discoveryServer,
        discoveryInitalEndpoint = '/.well-known/entry-points/initial',
        discoveryAutoInit = true,
        authProxy = false,
        urlPrefix = '',
        handleRateLimit,
    }: PlatformOptionsConstructor) {
        super();

        this._server = server;
        this._rcvServer = server;
        this._clientId = clientId;
        this._clientSecret = clientSecret;
        this._brandId = brandId;
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
        if (enableDiscovery) {
            const initialEndpoint = discoveryServer
                ? `${discoveryServer}${discoveryInitalEndpoint}`
                : discoveryInitalEndpoint;
            this._discovery = new Discovery({
                clientId,
                brandId,
                cache: this._cache,
                cacheId: Platform._discoveryCacheId,
                initialEndpoint,
                fetchGet: this.get.bind(this),
            });
            this._discovery.on(this._discovery.events.initialized, discoveryData => {
                this._authorizeEndpoint = discoveryData.authApi.authorizationUri;
            });
            this.on(events.logoutSuccess, this._fetchDiscoveryAndUpdateAuthorizeEndpoint);
            this.on(events.logoutError, this._fetchDiscoveryAndUpdateAuthorizeEndpoint);
            this.on(events.refreshError, this._updateDiscoveryAndAuthorizeEndpointOnRefreshError);
            this.on(events.loginError, this._updateDiscoveryAndAuthorizeEndpointOnRefreshError);
            this._client.on(this._client.events.requestSuccess, response => {
                if (response.headers.get('discovery-required')) {
                    this._discovery.refreshExternalData();
                }
            });
            if (discoveryAutoInit) {
                this._discoveryInitPromise = this.initDiscovery();
            }
        }
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

    public discovery() {
        return this._discovery;
    }

    private _fetchDiscoveryAndUpdateAuthorizeEndpoint = async () => {
        const discoveryData = await this._discovery.fetchInitialData();
        this._authorizeEndpoint = discoveryData.authApi.authorizationUri;
    };

    private _updateDiscoveryAndAuthorizeEndpointOnRefreshError = async () => {
        if (this._clearCacheOnRefreshError) {
            await this._fetchDiscoveryAndUpdateAuthorizeEndpoint();
        }
    };

    public createUrl(path = '', options: CreateUrlOptions = {}) {
        let builtUrl = '';

        const hasHttp = checkPathHasHttp(path);

        if (options.addServer && !hasHttp) {
            if (path.indexOf('/rcvideo') === 0 || (this._urlPrefix && this._urlPrefix.indexOf('/rcvideo') === 0)) {
                builtUrl += this._rcvServer;
            } else {
                builtUrl += this._server;
            }
        }

        if (this._urlPrefix) builtUrl += this._urlPrefix;

        builtUrl += path;

        if (options.addMethod) builtUrl += `${path.includes('?') ? '&' : '?'}_method=${options.addMethod}`;

        return builtUrl;
    }

    public async signUrl(path: string) {
        return `${path + (path.includes('?') ? '&' : '?')}access_token=${(await this._auth.data()).access_token}`;
    }

    public async loginUrlWithDiscovery(options: LoginUrlOptions = {}) {
        if (this._discovery) {
            await this._fetchDiscoveryAndUpdateAuthorizeEndpoint();
        }
        return this.loginUrl(options);
    }

    public async initDiscovery() {
        if (!this._discovery) {
            throw new Error('Discovery is not enabled!');
        }
        try {
            await this._discovery.init();
            this._discoveryInitPromise = null;
        } catch (e) {
            this._discoveryInitPromise = null;
            throw e;
        }
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
        redirectUri,
    }: LoginUrlOptions = {}) {
        let query: AuthorizationQuery = {
            response_type: implicit ? 'token' : 'code',
            redirect_uri: redirectUri ? redirectUri : this._redirectUri,
            client_id: this._clientId,
            state,
            brand_id: brandId ? brandId : this._brandId,
            display,
            prompt,
            ui_options: uiOptions,
            ui_locales: uiLocales,
            localeId,
        };
        if (responseHint) {
            query.response_hint = responseHint;
        }
        if (this._discovery) {
            if (!this._discovery.initialized) {
                throw new Error('Discovery is not initialized');
            }
            query.discovery = true;
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
            .replace(/\+/g, '-')
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
        token_uri,
        discovery_uri,
        code_verifier,
        redirect_uri,
        ...options
    }: LoginOptions = {}): Promise<Response> {
        try {
            this.emit(this.events.beforeLogin);

            const body: any = {};
            let response = null;
            let json;
            let tokenEndpoint = this._tokenEndpoint;
            let discoveryEndpoint;
            if (this._discovery) {
                const discovery = await this._getTokenAndDiscoveryUriOnLogin({token_uri, discovery_uri});
                tokenEndpoint = discovery.tokenEndpoint;
                discoveryEndpoint = discovery.discoveryEndpoint;
            }

            const codeVerifier = code_verifier ? code_verifier : this._codeVerifier;

            if (access_token) {
                //TODO Potentially make a request to /oauth/tokeninfo
                json = {access_token, ...options};
            } else {
                if (!code) {
                    body.grant_type = 'password';
                    if (extension && extension.length > 0) {
                        body.username = `${username}*${extension}`;
                    } else {
                        body.username = username;
                    }
                    body.password = password;
                } else if (code) {
                    //@see https://developers.ringcentral.com/legacy-api-reference/index.html#!#RefAuthorizationCodeFlow
                    body.grant_type = 'authorization_code';
                    body.code = code;
                    body.redirect_uri = redirect_uri ? redirect_uri : this._redirectUri;
                    if (codeVerifier && codeVerifier.length > 0) {
                        body.code_verifier = codeVerifier;
                    }
                }

                if (access_token_ttl) body.access_token_ttl = access_token_ttl;
                if (refresh_token_ttl) body.refresh_token_ttl = refresh_token_ttl;
                if (endpoint_id) body.endpoint_id = endpoint_id;
                response = await this._tokenRequest(tokenEndpoint, body);

                json = await response.clone().json();
            }

            await this._auth.setData({
                ...json,
                code_verifier: codeVerifier,
            });

            if (discoveryEndpoint) {
                await this._discovery.fetchExternalData(discoveryEndpoint);
            }

            this.emit(this.events.loginSuccess, response);

            return response;
        } catch (e) {
            if (this._clearCacheOnRefreshError) await this._cache.clean();

            this.emit(this.events.loginError, e);

            throw e;
        }
    }

    private async _getTokenAndDiscoveryUriOnLogin({token_uri, discovery_uri}) {
        let tokenEndpoint = token_uri;
        let discoveryEndpoint = discovery_uri;
        if (tokenEndpoint && discoveryEndpoint) {
            return {tokenEndpoint, discoveryEndpoint};
        }
        // wait discovery initial finished
        if (this._discoveryInitPromise) {
            await this._discoveryInitPromise;
        }
        const discoveryData = await this._discovery.initialData();
        if (!tokenEndpoint) {
            tokenEndpoint = discoveryData.authApi.defaultTokenUri;
        }
        if (!discoveryEndpoint) {
            discoveryEndpoint = discoveryData.discoveryApi.defaultExternalUri;
        }
        return {tokenEndpoint, discoveryEndpoint};
    }

    private async _refresh(): Promise<Response> {
        try {
            this.emit(this.events.beforeRefresh);

            await delay(this._refreshDelayMs);

            const authData = await this.auth().data();

            // Perform sanity checks
            if (!authData.refresh_token) throw new Error('Refresh token is missing');
            const refreshTokenValid = await this._auth.refreshTokenValid();
            if (!refreshTokenValid) throw new Error('Refresh token has expired');
            const body: RefreshTokenBody = {
                grant_type: 'refresh_token',
                refresh_token: authData.refresh_token,
                access_token_ttl: parseInt(authData.expires_in),
                refresh_token_ttl: parseInt(authData.refresh_token_expires_in),
            };
            let tokenEndpoint = this._tokenEndpoint;
            if (this._discovery) {
                const discoveryData = await this._discovery.externalData();
                if (discoveryData) {
                    tokenEndpoint = discoveryData.authApi.tokenUri;
                } else {
                    // For user who logged before discovery enabled. Need to refresh token firstly, then get discovery data
                    if (this._discoveryInitPromise) {
                        await this._discoveryInitPromise;
                    }
                    const initialDiscoveryData = await this._discovery.initialData();
                    tokenEndpoint = initialDiscoveryData.authApi.defaultTokenUri;
                }
            }
            const res = await this._tokenRequest(tokenEndpoint, body);

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

            const revokeEndpoint = await this._getRevokeEndpoint();
            if (revokeEndpoint) {
                const authData = await this._auth.data();
                const body: RevokeTokenBody = {
                    token: authData.access_token,
                };
                // Support to revoke token without client secret with client id in body
                res = await this._tokenRequest(revokeEndpoint, body);
            }

            await this._cache.clean();
            this.emit(this.events.logoutSuccess, res);
            return res;
        } catch (e) {
            this.emit(this.events.logoutError, e);

            throw e;
        }
    }

    private async _getRevokeEndpoint() {
        let revokeEndpoint = this._revokeEndpoint;
        if (!this._discovery || checkPathHasHttp(revokeEndpoint)) {
            return revokeEndpoint;
        }
        const discoveryData = await this._discovery.externalData();
        const baseUri = discoveryData.authApi.baseUri;
        revokeEndpoint = `${baseUri}${revokeEndpoint}`;
        return revokeEndpoint;
    }

    public async inflateRequest(request: Request, options: SendOptions = {}): Promise<Request> {
        options = options || {};
        let userAgent = this._userAgent;
        if (options.userAgent) {
            userAgent = `${options.userAgent} ${userAgent}`;
        }
        request.headers.set('X-User-Agent', userAgent);

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

    public async send(options: SendOptions = {}) {
        if (!options.skipAuthCheck && !options.skipDiscoveryCheck && this._discovery) {
            const discoveryExpired = await this._discovery.externalDataExpired();
            if (discoveryExpired) {
                await this._discovery.refreshExternalData();
            }
            const discoveryData = await this._discovery.externalData();
            if (!discoveryData) {
                throw new Error('Discovery data is missing');
            }
            this._server = discoveryData.coreApi.baseUri;
            this._rcvServer = discoveryData.rcv.baseApiUri;
            if (discoveryData.tag) {
                options.headers = options.headers || {};
                options.headers['Discovery-Tag'] = discoveryData.tag;
            }
        }
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

    protected async _tokenRequest(url, body): Promise<Response> {
        let headers: TokenRequestHeaders = {
            'Content-Type': Client._urlencodedContentType,
        };
        if (this._clientSecret && this._clientSecret.length > 0) {
            headers.Authorization = this.basicAuthHeader();
        } else {
            // Put client_id in body when no app secret
            body.client_id = this._clientId;
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

    public get discoveryInitPromise() {
        return this._discoveryInitPromise;
    }

    public get codeVerifier() {
        return this._codeVerifier;
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
    enableDiscovery?: boolean;
    discoveryServer?: string;
    discoveryInitalEndpoint?: string;
    discoveryAuthorizedEndpoint?: string;
    discoveryAutoInit?: boolean;
    brandId?: string;
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
    userAgent?: string;
    skipAuthCheck?: boolean;
    skipDiscoveryCheck?: boolean;
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
    token_uri?: string;
    discovery_uri?: string;
    code_verifier?: string;
    redirect_uri?: string;
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
    redirectUri?: string;
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
    discovery?: boolean;
}

export interface TokenRequestHeaders {
    'Content-Type': string;
    Authorization?: string;
}

export interface RefreshTokenBody {
    grant_type: 'refresh_token';
    refresh_token: string;
    access_token_ttl: number;
    refresh_token_ttl: number;
    client_id?: string;
}

export interface RevokeTokenBody {
    token: string;
    client_id?: string;
}
