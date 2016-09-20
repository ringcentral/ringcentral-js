import {Promise} from "../core/Externals";
import EventEmitter from "events";
import Auth from "./Auth";
import {queryStringify, parseQueryString, isBrowser, delay} from "../core/Utils";
import constants from "../core/Constants";

export default class Platform extends EventEmitter {

    static _urlPrefix = '/restapi';
    static _apiVersion = 'v1.0';
    static _tokenEndpoint = '/restapi/oauth/token';
    static _revokeEndpoint = '/restapi/oauth/revoke';
    static _authorizeEndpoint = '/restapi/oauth/authorize';
    static _refreshDelayMs = 100;
    static _cacheId = 'platform';
    static _clearCacheOnRefreshError = false;

    events = {
        beforeLogin: 'beforeLogin',
        loginSuccess: 'loginSuccess',
        loginError: 'loginError',
        beforeRefresh: 'beforeRefresh',
        refreshSuccess: 'refreshSuccess',
        refreshError: 'refreshError',
        beforeLogout: 'beforeLogout',
        logoutSuccess: 'logoutSuccess',
        logoutError: 'logoutError'
    };

    constructor({client, cache, server, appKey, appSecret, appName, appVersion, sdkVersion, redirectUri}) {

        super();

        this._server = server;
        this._appKey = appKey;
        this._appSecret = appSecret;

        /** @type {Cache} */
        this._cache = cache;

        /** @type {Client} */
        this._client = client;

        /** @type {Promise<ApiResponse>} */
        this._refreshPromise = null;

        this._auth = new Auth(this._cache, Platform._cacheId);

        this._userAgent = (appName ? (appName + (appVersion ? '/' + appVersion : '')) + ' ' : '') + 'RCJSSDK/' + sdkVersion;

        this._redirectUri = redirectUri || '';

    }

    /**
     * @return {Auth}
     */
    auth() {
        return this._auth;
    }

    /**
     * @return {Client}
     */
    client() {
        return this._client;
    }

    /**
     * @param {string} path
     * @param {object} [options]
     * @param {boolean} [options.addServer]
     * @param {string} [options.addMethod]
     * @param {boolean} [options.addToken]
     * @return {string}
     */
    createUrl(path, options) {

        path = path || '';
        options = options || {};

        var builtUrl = '',
            hasHttp = path.indexOf('http://') != -1 || path.indexOf('https://') != -1;

        if (options.addServer && !hasHttp) builtUrl += this._server;

        if (path.indexOf(Platform._urlPrefix) == -1 && !hasHttp) builtUrl += Platform._urlPrefix + '/' + Platform._apiVersion;

        builtUrl += path;

        if (options.addMethod || options.addToken) builtUrl += (path.indexOf('?') > -1 ? '&' : '?');

        if (options.addMethod) builtUrl += '_method=' + options.addMethod;
        if (options.addToken) builtUrl += (options.addMethod ? '&' : '') + 'access_token=' + this._auth.accessToken();

        return builtUrl;

    }

    /**
     * @param {string} options.redirectUri
     * @param {string} options.state
     * @param {string} options.brandId
     * @param {string} options.display
     * @param {string} options.prompt
     * @param {boolean} options.implicit
     * @param {object} [options]
     * @return {string}
     */
    loginUrl(options) {

        options = options || {};

        return this.createUrl(Platform._authorizeEndpoint + '?' + queryStringify({
                'response_type': options.implicit ? 'token' : 'code',
                'redirect_uri': options.redirectUri || this._redirectUri,
                'client_id': this._appKey,
                'state': options.state || '',
                'brand_id': options.brandId || '',
                'display': options.display || '',
                'prompt': options.prompt || ''
            }), {addServer: true})

    }

    /**
     * @param {string} url
     * @return {Object}
     */
    parseLoginRedirect(url) {

        function getParts(url, separator) {
            return url.split(separator).reverse()[0];
        }

        var response = getParts(url, '#') || getParts(url, '?');

        if (!response) throw new Error('Unable to parse response');

        var qs = parseQueryString(response);

        if (!qs) throw new Error('Unable to parse response');

        var error = qs.error_description || qs.error;

        if (error) {
            var e = new Error(error);
            e.error = qs.error;
            throw e;
        }

        return qs;

    }

    /**
     * Convenience method to handle 3-legged OAuth
     *
     * Attention! This is an experimental method and it's signature and behavior may change without notice.
     *
     * @experimental
     * @param {number} [options.width]
     * @param {number} [options.height]
     * @param {object} [options.login] additional options for login()
     * @param {string} [options.origin]
     * @param {string} [options.property] name of window.postMessage's event data property
     * @param {string} [options.target] target for window.open()
     * @param {string} options.url
     * @return {Promise}
     */
    loginWindow(options) {

        return new Promise((resolve, reject) => {

            if (!isBrowser()) throw new Error('This method can be used only in browser');

            if (!options.url) throw new Error('Missing mandatory URL parameter');

            options = options || {};
            options.url = options.url || 400;
            options.width = options.width || 400;
            options.height = options.height || 600;
            options.origin = options.origin || window.location.origin;
            options.property = options.property || constants.authResponseProperty;
            options.target = options.target || '_blank';

            var dualScreenLeft = window.screenLeft != undefined ? window.screenLeft : screen.left;
            var dualScreenTop = window.screenTop != undefined ? window.screenTop : screen.top;

            var width = window.innerWidth ? window.innerWidth : document.documentElement.clientWidth ? document.documentElement.clientWidth : screen.width;
            var height = window.innerHeight ? window.innerHeight : document.documentElement.clientHeight ? document.documentElement.clientHeight : screen.height;

            var left = ((width / 2) - (options.width / 2)) + dualScreenLeft;
            var top = ((height / 2) - (options.height / 2)) + dualScreenTop;
            var win = window.open(options.url, '_blank', (options.target == '_blank') ? 'scrollbars=yes, status=yes, width=' + options.width + ', height=' + options.height + ', left=' + left + ', top=' + top : '');

            if (window.focus) win.focus();

            var eventMethod = window.addEventListener ? 'addEventListener' : 'attachEvent';
            var eventRemoveMethod = eventMethod == 'addEventListener' ? 'removeEventListener' : 'detachEvent';
            var messageEvent = eventMethod == 'addEventListener' ? 'message' : 'onmessage';

            var eventListener = (e) => {

                if (e.origin != options.origin) return;
                if (!e.data || !e.data[options.property]) return; // keep waiting

                win.close();
                window[eventRemoveMethod](messageEvent, eventListener);

                try {

                    var loginOptions = this.parseLoginRedirect(e.data[options.property]);

                    if (!loginOptions.code && !loginOptions.access_token) throw new Error('No authorization code or token');

                    resolve(loginOptions);

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
     * @param {string} options.extension
     * @param {string} options.code
     * @param {string} options.redirectUri
     * @param {string} options.endpointId
     * @param {string} options.remember
     * @param {string} options.accessTokenTtl
     * @param {string} options.refreshTokenTtl
     * @param {string} options.access_token
     * @returns {Promise<ApiResponse>}
     */
    async login(options) {

        try {

            options = options || {};

            this.emit(this.events.beforeLogin);

            var body = {};

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

            var apiResponse;
            var json;

            if (options.access_token) {

                //TODO Potentially make a request to /oauth/tokeninfo
                json = options;

            } else {

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

            this._cache.clean();

            this.emit(this.events.loginError, e);

            throw e;

        }

    }

    /**
     * @returns {Promise<ApiResponse>}
     * @private
     */
    async _refresh() {

        try {

            this.emit(this.events.beforeRefresh);

            await delay(Platform._refreshDelayMs);

            // Perform sanity checks
            if (!this._auth.refreshToken()) throw new Error('Refresh token is missing');
            if (!this._auth.refreshTokenValid()) throw new Error('Refresh token has expired');

            /** @type {ApiResponse} */
            var res = await this._tokenRequest(Platform._tokenEndpoint, {
                    "grant_type": "refresh_token",
                    "refresh_token": this._auth.refreshToken(),
                    "access_token_ttl": this._auth.data().expires_in + 1,
                    "refresh_token_ttl": this._auth.data().refresh_token_expires_in + 1
                }),
                json = res.json();

            if (!json.access_token) {
                throw this._client.makeError(new Error('Malformed OAuth response'), res);
            }

            this._auth.setData(json);

            this.emit(this.events.refreshSuccess, res);

            return res;

        } catch (e) {

            e = this._client.makeError(e);

            if (Platform._clearCacheOnRefreshError) {
                this._cache.clean();
            }

            this.emit(this.events.refreshError, e);

            throw e;

        }

    }

    /**
     * @returns {Promise<ApiResponse>}
     */
    async refresh() {

        if (this._refreshPromise) {
            return this._refreshPromise;
        }

        try {

            this._refreshPromise = this._refresh()
                .then((res) => {
                    this._refreshPromise = null;
                    return res;
                });

            return this._refreshPromise;

        } catch (e) {

            this._refreshPromise = null;
            throw e;

        }

    }

    /**
     * @returns {Promise<ApiResponse>}
     */
    async logout() {

        try {

            this.emit(this.events.beforeLogout);

            var res = await this._tokenRequest(Platform._revokeEndpoint, {
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

    /**
     * @param {Request} request
     * @param {object} [options]
     * @param {boolean} [options.skipAuthCheck]
     * @return {Promise<Request>}
     */
    async inflateRequest(request, options) {

        options = options || {};

        if (options.skipAuthCheck) return request;

        await this.ensureLoggedIn();

        request.headers.set('X-User-Agent', this._userAgent);
        request.headers.set('Client-Id', this._appKey);
        request.headers.set('Authorization', this._authHeader());
        //request.url = this.createUrl(request.url, {addServer: true}); //FIXME Spec prevents this...

        return request;

    }

    /**
     * @param {Request} request
     * @param {object} [options]
     * @param {boolean} [options.skipAuthCheck]
     * @return {Promise<ApiResponse>}
     */
    async sendRequest(request, options) {

        try {

            request = await this.inflateRequest(request, options);

            return (await this._client.sendRequest(request));

        } catch (e) {

            // Guard is for errors that come from polling
            if (!e.apiResponse || !e.apiResponse.response() || (e.apiResponse.response().status != 401) || options.retry) throw e;

            this._auth.cancelAccessToken();

            options.retry = true;

            return (await this.sendRequest(request, options));

        }

    }

    /**
     * General purpose function to send anything to server
     * @param {string} options.url
     * @param {object} [options.body]
     * @param {string} [options.method]
     * @param {object} [options.query]
     * @param {object} [options.headers]
     * @param {boolean} [options.skipAuthCheck]
     * @return {Promise<ApiResponse>}
     */
    async send(options = {}) {

        //FIXME https://github.com/bitinn/node-fetch/issues/43
        options.url = this.createUrl(options.url, {addServer: true});

        return await this.sendRequest(this._client.createRequest(options), options);

    }

    /**
     * @param {string} url
     * @param {object} [query]
     * @param {object} [options]
     * @param {object} [options.headers]
     * @param {boolean} [options.skipAuthCheck]
     * @return {Promise<ApiResponse>}
     */
    async get(url, query, options) {
        options = options || {};
        options.method = 'GET';
        options.url = url;
        options.query = query;
        return await this.send(options);
    }

    /**
     * @param {string} url
     * @param {object} body
     * @param {object} [query]
     * @param {object} [options]
     * @param {object} [options.headers]
     * @param {boolean} [options.skipAuthCheck]
     * @return {Promise<ApiResponse>}
     */
    async post(url, body, query, options) {
        options = options || {};
        options.method = 'POST';
        options.url = url;
        options.query = query;
        options.body = body;
        return await this.send(options);
    }

    /**
     * @param {string} url
     * @param {object} [body]
     * @param {object} [query]
     * @param {object} [options]
     * @param {object} [options.headers]
     * @param {boolean} [options.skipAuthCheck]
     * @return {Promise<ApiResponse>}
     */
    async put(url, body, query, options) {
        options = options || {};
        options.method = 'PUT';
        options.url = url;
        options.query = query;
        options.body = body;
        return await this.send(options);
    }

    /**
     * @param {string} url
     * @param {string} [query]
     * @param {object} [options]
     * @param {object} [options.headers]
     * @param {boolean} [options.skipAuthCheck]
     * @return {Promise<ApiResponse>}
     */
    async 'delete'(url, query, options) {
        options = options || {};
        options.method = 'DELETE';
        options.url = url;
        options.query = query;
        return await this.send(options);
    }

    async _tokenRequest(path, body) {

        return await this.send({
            url: path,
            skipAuthCheck: true,
            body: body,
            method: 'POST',
            headers: {
                'Authorization': 'Basic ' + this._apiKey(),
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        });

    }

    async ensureLoggedIn() {
        if (this._isAccessTokenValid()) return null;
        return await this.refresh();
    }

    _isAccessTokenValid() {
        return (this._auth.accessTokenValid());
    }

    _apiKey() {
        var apiKey = this._appKey + ':' + this._appSecret;
        return (typeof btoa == 'function') ? btoa(apiKey) : new Buffer(apiKey).toString('base64');
    }

    _authHeader() {
        var token = this._auth.accessToken();
        return this._auth.tokenType() + (token ? ' ' + token : '');
    }

}