import EventEmitter from "events";
import * as qs from "querystring";
import ApiResponse from "../http/ApiResponse";
import Auth, {AuthOptions} from "./Auth";
import * as Constants from "../core/Constants";
import Cache from "../core/Cache";
import Client from "../http/Client";
import Externals from "../core/Externals";

declare const screen: any; //FIXME TS Crap

export default class Platform extends EventEmitter {

    static _tokenEndpoint = '/restapi/oauth/token';
    static _revokeEndpoint = '/restapi/oauth/revoke';
    static _authorizeEndpoint = '/restapi/oauth/authorize';
    static _cacheId = 'platform';

    events = {
        beforeLogin: 'beforeLogin',
        loginSuccess: 'loginSuccess',
        loginError: 'loginError',
        beforeRefresh: 'beforeRefresh',
        refreshSuccess: 'refreshSuccess',
        refreshError: 'refreshError',
        beforeLogout: 'beforeLogout',
        logoutSuccess: 'logoutSuccess',
        logoutError: 'logoutError',
        rateLimitError: 'rateLimitError'
    };

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

    constructor({
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
                    refreshHandicapMs
                }: PlatformOptionsConstructor) {

        super();

        this._server = server;
        this._clientId = clientId;
        this._clientSecret = clientSecret;
        this._redirectUri = redirectUri;
        this._refreshDelayMs = refreshDelayMs;
        this._clearCacheOnRefreshError = clearCacheOnRefreshError;
        this._userAgent = (appName ?
                          (appName + (appVersion ? '/' + appVersion : '')) + ' ' :
                           '') + 'RCJSSDK/' + Constants.version;

        this._externals = externals;
        this._cache = cache;
        this._client = client;
        this._refreshPromise = null;
        this._auth = new Auth({
            cache: this._cache,
            cacheId: Platform._cacheId,
            refreshHandicapMs: refreshHandicapMs
        });

    }

    delay(timeout): Promise<any> {
        return new Promise((resolve, reject) => {
            setTimeout(function() {
                resolve(null);
            }, timeout);
        });
    }

    auth() {
        return this._auth;
    }

    client() {
        return this._client;
    }

    createUrl(path = '', options: CreateUrlOptions = {}) {

        let builtUrl = '';
        const hasHttp = path.indexOf('http://') != -1 || path.indexOf('https://') != -1;

        if (options.addServer && !hasHttp) builtUrl += this._server;

        builtUrl += path;

        if (options.addMethod || options.addToken) builtUrl += (path.indexOf('?') > -1 ? '&' : '?');

        if (options.addMethod) builtUrl += '_method=' + options.addMethod;
        if (options.addToken) builtUrl += (options.addMethod ? '&' : '') + 'access_token=' + this._auth.accessToken();

        return builtUrl;

    }

    loginUrl({
                 implicit,
                 redirectUri,
                 state,
                 brandId = '',
                 display = '',
                 prompt = ''
             }: LoginUrlOptions) {

        return this.createUrl(Platform._authorizeEndpoint + '?' + qs.stringify({
            response_type: implicit ? 'token' : 'code',
            redirect_uri: redirectUri || this._redirectUri,
            client_id: this._clientId,
            state,
            brand_id: brandId,
            display,
            prompt
        }), {addServer: true});

    }

    /**
     * @param {string} url
     * @return {Object}
     */
    parseLoginRedirect(url) {

        function getParts(url, separator) {
            return url.split(separator).reverse()[0];
        }

        const response = (url.indexOf('#') === 0 && getParts(url, '#')) ||
                         (url.indexOf('?') === 0 && getParts(url, '?')) ||
                         null;

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
     *
     * @param {string} url
     * @param {number} [width]
     * @param {number} [height]
     * @param {object} [login] additional options for login()
     * @param {string} [origin]
     * @param {string} [property] name of window.postMessage's event data property
     * @param {string} [target] target for window.open()
     * @return {Promise}
     */
    loginWindow({
                    url,
                    width = 400,
                    height = 600,
                    origin = window.location.origin,
                    property = Constants.authResponseProperty,
                    target = '_blank'
                }): Promise<LoginOptions> {

        return new Promise((resolve, reject) => {

            if (typeof window === 'undefined') throw new Error('This method can be used only in browser');

            if (!url) throw new Error('Missing mandatory URL parameter');

            const dualScreenLeft = window.screenLeft !== undefined ? window.screenLeft : screen.left;
            const dualScreenTop = window.screenTop !== undefined ? window.screenTop : screen.top;

            const width = window.innerWidth ? window.innerWidth : document.documentElement.clientWidth ? document.documentElement.clientWidth : screen.width;
            const height = window.innerHeight ? window.innerHeight : document.documentElement.clientHeight ? document.documentElement.clientHeight : screen.height;

            const left = ((width / 2) - (width / 2)) + dualScreenLeft;
            const top = ((height / 2) - (height / 2)) + dualScreenTop;
            const win = window.open(url, '_blank', (target == '_blank') ? (
                'scrollbars=yes, status=yes, ' +
                'width=' + width + ', ' +
                'height=' + height + ', ' +
                'left=' + left + ', ' +
                'top=' + top
            ) : '');

            if (!win) {
                throw new Error('Could not open login window. Please allow popups for this site');
            }

            if (win.focus) win.focus();

            const eventListener = (e) => {

                try {

                    if (e.origin != origin) return;
                    if (!e.data || !e.data[property]) return; // keep waiting

                    win.close();
                    window.addEventListener('message', eventListener);

                    const loginOptions = this.parseLoginRedirect(e.data[property]);

                    if (!loginOptions.code && !loginOptions.access_token) throw new Error('No authorization code or token');

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
    async loggedIn() {

        try {
            await this.ensureLoggedIn();
            return true;
        } catch (e) {
            return false;
        }

    }

    async login({
                    username,
                    password,
                    extension = '',
                    code,
                    redirectUri,
                    endpointId,
                    accessTokenTtl,
                    refreshTokenTtl,
                    access_token,
                    ...options
                }: LoginOptions): Promise<ApiResponse> {

        try {

            this.emit(this.events.beforeLogin);

            let body: any = {};
            let apiResponse = null;
            let json;

            if (access_token) {

                //TODO Potentially make a request to /oauth/tokeninfo
                json = {access_token, ...options};

            } else {

                if (!code) {

                    body.grant_type = 'password';
                    body.username = username;
                    body.password = password;
                    body.extension = extension;

                } else if (code) {

                    body.grant_type = 'authorization_code';
                    body.code = code;
                    body.redirect_uri = redirectUri || this._redirectUri;
                    //body.client_id = this.getCredentials().key; // not needed

                }

                if (endpointId) body.endpoint_id = endpointId;
                if (accessTokenTtl) body.accessTokenTtl = accessTokenTtl;
                if (refreshTokenTtl) body.refreshTokenTtl = refreshTokenTtl;

                apiResponse = await this._tokenRequest(Platform._tokenEndpoint, body);

                json = apiResponse.json();

            }

            this._auth.setData(json);

            this.emit(this.events.loginSuccess, apiResponse);

            return apiResponse;

        } catch (e) {

            if (this._clearCacheOnRefreshError) this._cache.clean();

            this.emit(this.events.loginError, e);

            throw e;

        }

    }

    private async _refresh(): Promise<ApiResponse> {

        try {

            this.emit(this.events.beforeRefresh);

            await this.delay(this._refreshDelayMs);

            // Perform sanity checks
            if (!this._auth.refreshToken()) throw new Error('Refresh token is missing');
            if (!this._auth.refreshTokenValid()) throw new Error('Refresh token has expired');

            const res = await this._tokenRequest(Platform._tokenEndpoint, {
                "grant_type": "refresh_token",
                "refresh_token": this._auth.refreshToken(),
                "access_token_ttl": this._auth.data().expires_in + 1,
                "refresh_token_ttl": this._auth.data().refresh_token_expires_in + 1
            });

            const json = res.json();

            if (!json.access_token) {
                throw this._client.makeError(new Error('Malformed OAuth response'), res);
            }

            this._auth.setData(json);

            this.emit(this.events.refreshSuccess, res);

            return res;

        } catch (e) {

            if (this._clearCacheOnRefreshError) {
                this._cache.clean();
            }

            this.emit(this.events.refreshError, e);

            throw e;

        }

    }

    async refresh(): Promise<ApiResponse> {

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

        return await this._refreshPromise;

    }

    async logout(): Promise<ApiResponse> {

        try {

            this.emit(this.events.beforeLogout);

            const res = await this._tokenRequest(Platform._revokeEndpoint, {
                token: this._auth.accessToken()
            });

            this._cache.clean();

            this.emit(this.events.logoutSuccess, res);

            return res;

        } catch (e) {

            this.emit(this.events.logoutError, e);

            throw e;

        }

    }

    async inflateRequest(request: Request, options: SendOptions = {}): Promise<Request> {

        options = options || {};

        if (options.skipAuthCheck) return request;

        await this.ensureLoggedIn();

        request.headers.set('X-User-Agent', this._userAgent);
        request.headers.set('Client-Id', this._clientId);
        request.headers.set('Authorization', this._authHeader());
        //request.url = this.createUrl(request.url, {addServer: true}); //FIXME Spec prevents this...

        return request;

    }

    async sendRequest(request: Request, options: SendOptions = {}): Promise<ApiResponse> {

        try {

            request = await this.inflateRequest(request, options);
            return await this._client.sendRequest(request);

        } catch (e) {

            // Guard is for errors that come from polling
            if (!e.apiResponse || !e.apiResponse.response() || options.retry) throw e;

            const response = e.apiResponse.response();
            const status = response.status;

            if ((status != ApiResponse._unauthorizedStatus) &&
                (status != ApiResponse._rateLimitStatus)) throw e;

            options.retry = true;

            let retryAfter = 0;

            if (status == ApiResponse._unauthorizedStatus) {
                this._auth.cancelAccessToken();
            }

            if (status == ApiResponse._rateLimitStatus) {

                const defaultRetryAfter = (!options.handleRateLimit || typeof options.handleRateLimit == 'boolean' ? 60 : options.handleRateLimit);

                // FIXME retry-after is custom header, by default, it can't be retrieved. Server should add header: 'Access-Control-Expose-Headers: retry-after'.
                retryAfter = parseFloat(response.headers.get('retry-after') || defaultRetryAfter) * 1000;

                e.retryAfter = retryAfter;

                this.emit(this.events.rateLimitError, e);

                if (!options.handleRateLimit) throw e;

            }

            await this.delay(retryAfter);
            return await this.sendRequest(request, options);

        }

    }

    send(options: SendOptions) {

        options = options || {};

        //FIXME https://github.com/bitinn/node-fetch/issues/43
        options.url = this.createUrl(options.url, {addServer: true});

        return this.sendRequest(this._client.createRequest(options), options);

    }

    get(url, query?, options?: SendOptions): Promise<ApiResponse> {
        return this.send({method: 'GET', url, query, ...options});
    }

    post(url, body?, query?, options?: SendOptions): Promise<ApiResponse> {
        return this.send({method: 'POST', url, query, body, ...options});
    }

    put(url, body?, query?, options?: SendOptions): Promise<ApiResponse> {
        return this.send({method: 'PUT', url, query, body, ...options});
    }

    'delete'(url, query?, options?: SendOptions): Promise<ApiResponse> {
        return this.send({method: 'DELETE', url, query, ...options});
    }

    async ensureLoggedIn(): Promise<ApiResponse | null> {
        if (this._isAccessTokenValid()) return null;
        await this.refresh();
        return null;
    }

    protected async _tokenRequest(url, body): Promise<ApiResponse> {

        return await this.send({
            url,
            body,
            skipAuthCheck: true,
            method: 'POST',
            headers: {
                'Authorization': 'Basic ' + this._apiKey(),
                'Content-Type': ApiResponse._urlencodedContentType
            }
        });

    }

    protected _isAccessTokenValid() {
        return this._auth.accessTokenValid();
    }

    protected _apiKey() {
        const apiKey = this._clientId + ':' + this._clientSecret;
        return (typeof btoa == 'function') ? btoa(apiKey) : Buffer.from(apiKey).toString('base64');
    }

    protected _authHeader() {
        const token = this._auth.accessToken();
        return this._auth.tokenType() + (token ? ' ' + token : '');
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
    redirectUri?: string;
    endpointId?: string;
    accessTokenTtl?: number;
    refreshTokenTtl?: number;
    access_token?: string;
}

export interface LoginUrlOptions {
    redirectUri?: string; // Overrides default RedirectURI
    state?: string;
    brandId?: string;
    display?: string;
    prompt?: string;
    implicit?: boolean;
}

export interface CreateUrlOptions {
    addServer?: boolean;
    addMethod?: string;
    addToken?: boolean;
}
