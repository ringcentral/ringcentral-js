/// <reference path="../externals.d.ts" />
/// <reference path="../core/Utils.ts" />
/// <reference path="../core/Observable.ts" />
/// <reference path="../core/Cache.ts" />
/// <reference path="../core/Log" />
/// <reference path="../http/Client.ts" />
/// <reference path="../http/ApiResponse.ts" />
/// <reference path="../externals/Externals.ts" />
/// <reference path="./Queue.ts" />

module RingCentral.sdk.platform {

    export class Platform extends core.Observable<Platform> {

        protected static _urlPrefix:string = '/restapi';
        protected static _apiVersion:string = 'v1.0';
        protected static _accessTokenTtl:number = null; // Platform server by default sets it to 60 * 60 = 1 hour
        protected static _refreshTokenTtl:number = 10 * 60 * 60; // 10 hours
        protected static _refreshTokenTtlRemember:number = 7 * 24 * 60 * 60; // 1 week
        protected static _tokenEndpoint:string = '/restapi/oauth/token';
        protected static _revokeEndpoint:string = '/restapi/oauth/revoke';
        protected static _authorizeEndpoint:string = '/restapi/oauth/authorize';

        protected _server:string;
        protected _appKey:string;
        protected _appSecret:string;

        protected _refreshDelayMs:number = 100;
        protected _clearCacheOnRefreshError:boolean = true;
        protected _cacheId:string = 'platform';

        protected _queue:Queue;
        protected _cache:core.Cache;
        protected _client:http.Client;
        protected _auth:Auth;

        public events = {
            accessViolation: 'accessViolation',
            logoutSuccess: 'logoutSuccess',
            logoutError: 'logoutError',
            authorizeSuccess: 'authorizeSuccess',
            authorizeError: 'authorizeError',
            refreshSuccess: 'refreshSuccess',
            refreshError: 'refreshError'
        };

        constructor(client:http.Client,
                    cache:core.Cache,
                    server:string,
                    appKey:string,
                    appSecret:string) {

            super();

            this._server = server;
            this._appKey = appKey;
            this._appSecret = appSecret;

            this._cache = cache;
            this._client = client;
            this._queue = new Queue(this._cache, this._cacheId + '-refresh');
            this._auth = new Auth(this._cache, this._cacheId);

        }

        auth():Auth {
            return this._auth;
        }

        createUrl(path, options?:{addMethod?: string; addToken?: boolean; addServer?: boolean}):string {

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

        authUrl(options:{
            redirectUri:string;
            display?:string; // page|popup|touch|mobile, default 'page'
            prompt?:string; // sso|login|consent, default is 'login sso consent'
            state?:string;
            brandId?:string|number;
        }) {

            options = options || <any>{};

            return this.createUrl(Platform._authorizeEndpoint + '?' + core.utils.queryStringify({
                    'response_type': 'code',
                    'redirect_uri': options.redirectUri || '',
                    'client_id': this._appKey,
                    'state': options.state || '',
                    'brand_id': options.brandId || '',
                    'display': options.display || '',
                    'prompt': options.prompt || ''
                }), {addServer: true})

        }

        parseAuthRedirectUrl(url:string) {

            var qs = core.utils.parseQueryString(url.split('?').reverse()[0]),
                error = qs.error_description || qs.error;

            if (error) {
                var e = <IAuthError> new Error(error);
                e.error = qs.error;
                throw e;
            }

            return qs;

        }

        loggedIn():Promise<boolean> {

            return this._ensureAuthentication()
                .then(()=> {
                    return true;
                })
                .catch(()=> {
                    return false;
                });

        }

        login(options?:{
            username?:string;
            password?: string;
            extension?:string;
            endpointId?:string;
            code?:string;
            redirectUri?:string;
            clientId?:string;
            remember?:boolean
        }):Promise<http.ApiResponse> {

            options = options || <any>{};

            options.remember = options.remember || false;

            var body = <any>{
                "access_token_ttl": Platform._accessTokenTtl,
                "refresh_token_ttl": options.remember ? Platform._refreshTokenTtlRemember : Platform._refreshTokenTtl
            };

            if (!options.code) {

                body.grant_type = 'password';
                body.username = options.username;
                body.password = options.password;
                body.extension = options.extension || '';

            } else if (options.code) {

                body.grant_type = 'authorization_code';
                body.code = options.code;
                body.redirect_uri = options.redirectUri;
                //body.client_id = this.getCredentials().key; // not needed

            }

            if (options.endpointId) body.endpoint_id = options.endpointId;

            return this._tokenRequest(Platform._tokenEndpoint, body).then((res:http.ApiResponse) => {

                this._auth
                    .setData(res.json())
                    .setRemember(options.remember);

                this.emit(this.events.authorizeSuccess, res);

                return res;

            }).catch((e:http.IApiError):any => {

                this._cache.clean();

                this.emit(this.events.authorizeError, e);

                throw e;

            });

        }

        refresh():Promise<http.ApiResponse> {

            var refresh = <Promise<http.ApiResponse>>new externals._Promise((resolve, reject) => {

                if (this._queue.isPaused()) {
                    return resolve(this._refreshPolling());
                }

                this._queue.pause();

                // Make sure all existing AJAX calls had a chance to reach the server
                setTimeout(() => {

                    core.log.debug('Platform.refresh(): Performing token refresh (access token', this._auth.accessToken(), ', refresh token', this._auth.refreshToken(), ')');

                    // Perform sanity checks
                    if (!this._auth.refreshToken()) return reject(new Error('Refresh token is missing'));
                    if (!this._auth.refreshTokenValid()) return reject(new Error('Refresh token has expired'));
                    if (!this._queue.isPaused()) return reject(new Error('Queue was resumed before refresh call'));

                    resolve(this._tokenRequest(Platform._tokenEndpoint, {
                        "grant_type": "refresh_token",
                        "refresh_token": this._auth.refreshToken(),
                        "access_token_ttl": Platform._accessTokenTtl,
                        "refresh_token_ttl": this._auth.remember() ? Platform._refreshTokenTtlRemember : Platform._refreshTokenTtl
                    }));

                }, this._refreshDelayMs);

            });

            return refresh.then((res:http.ApiResponse) => {

                // This means refresh has happened elsewhere and we are here because of timeout
                if (res && res.json && res.json()) {

                    var json = res.json();

                    core.log.info('Platform.refresh(): Token was refreshed', res);

                    if (!json.refresh_token || !json.access_token) {
                        throw http.Client.makeError(new Error('Malformed OAuth response'), res);
                    }

                    this._auth.setData(json);
                    this._queue.resume();

                }

                this.emit(this.events.refreshSuccess, res);

                return res;

            }).catch((e:http.IApiError):any => {

                e = http.Client.makeError(e);

                if (this._clearCacheOnRefreshError) {
                    this._cache.clean();
                }

                this.emit(this.events.accessViolation, e);
                this.emit(this.events.refreshError, e);

                throw e;

            });

        }

        /**
         * @returns {Promise}
         */
        logout():Promise<http.ApiResponse> {

            this._queue.pause();

            return this._tokenRequest(Platform._revokeEndpoint, {
                token: this._auth.accessToken()
            }).then((res)  => {

                this._queue.resume();
                this._cache.clean();

                this.emit(this.events.logoutSuccess, res);

                return res;

            }).catch((e:http.IApiError):any => {

                this._queue.resume();

                this.emit(this.events.accessViolation, e);
                this.emit(this.events.logoutError, e);

                throw e;

            });

        }

        inflateRequest(request:Request, options?:IPlatformOptions):Promise<Request> {

            options = options || {};

            if (options.skipAuthCheck) return externals._Promise.resolve(request);

            return this
                ._ensureAuthentication()
                .then(() => {

                    request.headers.set('Authorization', this._authHeader());
                    request.url = this.createUrl(request.url, {addServer: true});

                    //TODO Add User-Agent here

                    return request;

                });

        }

        sendRequest(request:Request, options?:IPlatformOptions):Promise<http.ApiResponse> {

            return this
                .inflateRequest(request, options)
                .then((req) => {
                    return this._client.sendRequest(req);
                })
                .catch((e:http.IApiError) => {

                    // Guard is for errors that come from polling
                    if (!e.apiResponse || !e.apiResponse.response() || (e.apiResponse.response().status != 401)) throw e;

                    this._auth.cancelAccessToken();

                    return this.sendRequest(request, options);

                });

        }

        /**
         * General purpose function to send anything to server
         */
        send(url:string, options?:IPlatformCombinedOptions):Promise<http.ApiResponse> {

            try {

                //FIXME https://github.com/bitinn/node-fetch/issues/43
                url = this.createUrl(url, {addServer: true});

                return this.sendRequest(http.Client.createRequest(url, options), options);

            } catch (e) {
                return externals._Promise.reject(e);
            }

        }

        get(url:string, options?:IPlatformCombinedOptions) {
            options = options || {};
            options.method = 'GET';
            return this.send(url, options);
        }

        post(url:string, options:IPlatformCombinedOptions) {
            options = options || {};
            options.method = 'POST';
            return this.send(url, options);
        }

        put(url:string, options:IPlatformCombinedOptions) {
            options = options || {};
            options.method = 'PUT';
            return this.send(url, options);
        }

        'delete'(url:string, options?:IPlatformCombinedOptions) {
            options = options || {};
            options.method = 'DELETE';
            return this.send(url, options);
        }

        protected _tokenRequest(path:string, body:any):Promise<http.ApiResponse> {

            return this.send(path, {
                skipAuthCheck: true,
                body: body,
                method: 'POST',
                headers: {
                    'Authorization': 'Basic ' + this._apiKey(),
                    'Content-Type': 'application/x-www-form-urlencoded',
                }
            });

        }

        protected _ensureAuthentication() {

            if (this._isAccessTokenValid()) return externals._Promise.resolve(null);
            return this.refresh();

        }

        protected _isAccessTokenValid():boolean {

            return (this._auth.accessTokenValid() && !this._queue.isPaused());

        }

        protected _refreshPolling():Promise<any> {

            core.log.warn('Platform.refresh(): Refresh is already in progress, polling started');

            return this._queue.poll().then(()=> {

                if (!this._isAccessTokenValid()) {
                    throw new Error('Automatic authentification timeout');
                }

                return null;

            });

        }

        protected _apiKey() {
            var apiKey = this._appKey + ':' + this._appSecret;
            return (typeof btoa == 'function') ? btoa(apiKey) : new Buffer(apiKey).toString('base64');
        }

        protected _authHeader() {
            var token = this._auth.accessToken();
            return this._auth.tokenType() + (token ? ' ' + token : '');
        }

    }

    export interface IAuthError extends Error {
        error?:string;
    }

    export interface IPlatformOptions {
        skipAuthCheck?:boolean;
    }

    export interface IPlatformCombinedOptions extends IPlatformOptions, http.IClientRequestInit {}

}