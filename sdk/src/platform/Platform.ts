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

    static _urlPrefix = '/restapi';
    static _apiVersion = 'v1.0';
    static _knownPrefixes = ['/rcvideo'];
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
    private _appKey: string;
    private _appSecret: string;
    private _redirectUri: string;
    private _refreshDelayMs: number;
    private _clearCacheOnRefreshError: boolean;
    private _userAgent: string;
    private _externals: Externals;
    private _cache: Cache;
    private _client: Client;
    private _knownPrefixes: string[];
    private _refreshPromise: Promise<any>;
    private _auth: Auth;

    constructor({server, appKey, appSecret, redirectUri = '', refreshDelayMs = 100, clearCacheOnRefreshError = true, appName = '', appVersion = '', externals, cache, client, knownPrefixes = Platform._knownPrefixes, refreshHandicapMs}: PlatformOptionsConstructor) {

        super();

        this._server = server;
        this._appKey = appKey;
        this._appSecret = appSecret;
        this._redirectUri = redirectUri;
        this._refreshDelayMs = refreshDelayMs;
        this._clearCacheOnRefreshError = clearCacheOnRefreshError;
        this._userAgent = (appName ?
                          (appName + (appVersion ? '/' + appVersion : '')) + ' ' :
                           '') + 'RCJSSDK/' + Constants.version;

        this._externals = externals;
        this._cache = cache;
        this._client = client;
        this._knownPrefixes = knownPrefixes;
        this._refreshPromise = null;
        this._auth = new Auth({
            cache: this._cache,
            cacheId: Platform._cacheId,
            refreshHandicapMs: refreshHandicapMs
        });

    }

    delay(timeout): Promise<any> {
        return new this._externals.Promise((resolve, reject) => {
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

        var builtUrl = '',
            hasHttp = path.indexOf('http://') != -1 || path.indexOf('https://') != -1,
            alreadyPrefixed = this._knownPrefixes.some(function(prefix) {
                return path.indexOf(prefix) === 0;
            });

        if (options.addServer && !hasHttp) builtUrl += this._server;

        if (path.indexOf(Platform._urlPrefix) == -1 && !hasHttp && !alreadyPrefixed) {
            builtUrl += Platform._urlPrefix + '/' + Platform._apiVersion;
        }

        builtUrl += path;

        if (options.addMethod || options.addToken) builtUrl += (path.indexOf('?') > -1 ? '&' : '?');

        if (options.addMethod) builtUrl += '_method=' + options.addMethod;
        if (options.addToken) builtUrl += (options.addMethod ? '&' : '') + 'access_token=' + this._auth.accessToken();

        return builtUrl;

    }

    /**
     * @param {string} [options.redirectUri] Overrides default RedirectURI
     * @param {string} [options.state]
     * @param {string} [options.brandId]
     * @param {string} [options.display]
     * @param {string} [options.prompt]
     * @param {boolean} [options.implicit] Use Implicit Grant flow
     * @return {string}
     */
    loginUrl(options: LoginUrlOptions) {

        options = options || {};

        return this.createUrl(Platform._authorizeEndpoint + '?' + qs.stringify({
            'response_type': options.implicit ? 'token' : 'code',
            'redirect_uri': options.redirectUri || this._redirectUri,
            'client_id': this._appKey,
            'state': options.state || '',
            'brand_id': options.brandId || '',
            'display': options.display || '',
            'prompt': options.prompt || ''
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

        var response = (url.indexOf('#') === 0 && getParts(url, '#')) ||
                       (url.indexOf('?') === 0 && getParts(url, '?')) ||
                       null;

        if (!response) throw new Error('Unable to parse response');

        var queryString = qs.parse(response);

        if (!queryString) throw new Error('Unable to parse response');

        var error = queryString.error_description || queryString.error;

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
     * @experimental
     * @param {string} options.url
     * @param {number} [options.width]
     * @param {number} [options.height]
     * @param {object} [options.login] additional options for login()
     * @param {string} [options.origin]
     * @param {string} [options.property] name of window.postMessage's event data property
     * @param {string} [options.target] target for window.open()
     * @return {Promise}
     */
    loginWindow(options): Promise<LoginOptions> {

        return new this._externals.Promise((resolve, reject) => {

            if (typeof window === 'undefined') throw new Error('This method can be used only in browser');

            if (!options.url) throw new Error('Missing mandatory URL parameter');

            options = options || {};
            options.width = options.width || 400;
            options.height = options.height || 600;
            options.origin = options.origin || window.location.origin;
            options.property = options.property || Constants.authResponseProperty;
            options.target = options.target || '_blank';

            var dualScreenLeft = window.screenLeft !== undefined ? window.screenLeft : screen.left;
            var dualScreenTop = window.screenTop !== undefined ? window.screenTop : screen.top;

            var width = window.innerWidth ? window.innerWidth : document.documentElement.clientWidth ? document.documentElement.clientWidth : screen.width;
            var height = window.innerHeight ? window.innerHeight : document.documentElement.clientHeight ? document.documentElement.clientHeight : screen.height;

            var left = ((width / 2) - (options.width / 2)) + dualScreenLeft;
            var top = ((height / 2) - (options.height / 2)) + dualScreenTop;
            var win = window.open(options.url, '_blank', (options.target == '_blank') ? 'scrollbars=yes, status=yes, width=' + options.width + ', height=' + options.height + ', left=' + left + ', top=' + top : '');

            if (!win) {
                throw new Error('Could not open login window. Please allow popups for this site');
            }

            if (win.focus) win.focus();

            var eventMethod = window.addEventListener ? 'addEventListener' : 'attachEvent';
            var eventRemoveMethod = eventMethod == 'addEventListener' ? 'removeEventListener' : 'detachEvent';
            var messageEvent = eventMethod == 'addEventListener' ? 'message' : 'onmessage';

            var eventListener = (e) => {

                try {

                    if (e.origin != options.origin) return;
                    if (!e.data || !e.data[options.property]) return; // keep waiting

                    win.close();
                    window[eventRemoveMethod](messageEvent, eventListener);


                    var loginOptions = this.parseLoginRedirect(e.data[options.property]);

                    if (!loginOptions.code && !loginOptions.access_token) throw new Error('No authorization code or token');

                    resolve(loginOptions);

                    /* jshint -W002 */
                } catch (e) {
                    reject(e);
                }

            };

            window[eventMethod](messageEvent, eventListener, false);

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

    /**
     * @param {string} options.username
     * @param {string} options.password
     * @param {string} [options.extension]
     * @param {string} [options.code]
     * @param {string} [options.redirectUri]
     * @param {string} [options.endpointId]
     * @param {string} [options.accessTokenTtl]
     * @param {string} [options.refreshTokenTtl]
     * @param {string} [options.access_token]
     * @returns {Promise<ApiResponse>}
     */
    async login(options: LoginOptions) {

        try {

            options = options || {};

            this.emit(this.events.beforeLogin);

            let body: any = {};
            let apiResponse = null;
            let json;

            if (options.access_token) {

                //TODO Potentially make a request to /oauth/tokeninfo
                json = options;

            } else {

                if (!options.code) {

                    body.grant_type = 'password';
                    body.username = options.username;
                    body.password = options.password;
                    body.extension = options.extension || '';

                } else if (options.code) {

                    body.grant_type = 'authorization_code';
                    body.code = options.code;
                    body.redirect_uri = options.redirectUri || this._redirectUri;
                    //body.client_id = this.getCredentials().key; // not needed

                }

                if (options.endpointId) body.endpoint_id = options.endpointId;
                if (options.accessTokenTtl) body.accessTokenTtl = options.accessTokenTtl;
                if (options.refreshTokenTtl) body.refreshTokenTtl = options.refreshTokenTtl;

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

            var json = res.json();

            if (!json.access_token) {
                throw this._client.makeError(new Error('Malformed OAuth response'), res);
            }

            this._auth.setData(json);

            this.emit(this.events.refreshSuccess, res);

            return res;

        } catch (e) {

            e = this._client.makeError(e);

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
        request.headers.set('Client-Id', this._appKey);
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

    /**
     * @param url
     * @param body
     * @return {Promise.<ApiResponse>}
     * @private
     */
    async _tokenRequest(url, body) {

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

    /**
     * @return {boolean}
     * @private
     */
    _isAccessTokenValid() {
        return this._auth.accessTokenValid();
    }

    /**
     * @return {string}
     * @private
     */
    _apiKey() {
        var apiKey = this._appKey + ':' + this._appSecret;
        return (typeof btoa == 'function') ? btoa(apiKey) : new Buffer(apiKey).toString('base64');
    }

    /**
     * @return {string}
     * @private
     */
    _authHeader() {
        var token = this._auth.accessToken();
        return this._auth.tokenType() + (token ? ' ' + token : '');
    }

}

export interface PlatformOptions extends AuthOptions {
    server?: string;
    appKey?: string;
    appSecret?: string;
    redirectUri?: string;
    refreshDelayMs?: number;
    refreshHandicapMs?: number;
    clearCacheOnRefreshError?: boolean;
    appName?: string;
    appVersion?: string;
    knownPrefixes?: string[];
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
