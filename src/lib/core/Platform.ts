/// <reference path="../../typings/externals.d.ts" />

declare class Buffer {
    constructor(str:string, encoding?:string);
    toString(encoding:string):string;
}

import context = require('./Context');
import utils = require('./Utils');
import observable = require('./Observable');
import cache = require('./Cache');
import log = require('./Log');
import request = require('./http/Request');
import r = require('./http/Response');

export class Platform extends observable.Observable<Platform> {

    public server:string;
    public apiKey:string;
    public account:string;
    public urlPrefix:string;
    public apiVersion:string;
    public accountPrefix:string;
    public accessTokenTtl:number;
    public refreshTokenTtl:number;
    public refreshTokenTtlRemember:number;
    public refreshHandicapMs:number;
    public refreshDelayMs:number;
    public clearCacheOnRefreshError:boolean;
    public refreshPromise:Promise<any>;

    public cacheId:string;
    public pollInterval:number;
    public releaseTimeout:number;

    public events = {
        accessViolation: 'accessViolation',
        logoutSuccess: 'logoutSuccess',
        logoutError: 'logoutError',
        authorizeSuccess: 'authorizeSuccess',
        authorizeError: 'authorizeError',
        refreshSuccess: 'refreshSuccess',
        refreshError: 'refreshError'
    };

    static forcedTokenType = 'forced';

    constructor(context:context.Context) {

        super(context);

        this.server = '';
        this.apiKey = '';
        this.account = '~';
        this.urlPrefix = '/restapi';
        this.apiVersion = 'v1.0';
        this.accountPrefix = '/account/';
        this.accessTokenTtl = null; // Platform server by default sets it to 60 * 60 = 1 hour
        this.refreshTokenTtl = 10 * 60 * 60; // 10 hours
        this.refreshTokenTtlRemember = 7 * 24 * 60 * 60; // 1 week
        this.refreshHandicapMs = 60 * 1000; // 1 minute
        this.refreshDelayMs = 100;
        this.clearCacheOnRefreshError = true;
        this.refreshPromise = null;

        this.cacheId = 'platform';
        this.pollInterval = 250;
        this.releaseTimeout = 5000; // If queue was not released then force it to do so after some timeout

    }

    getStorage():cache.Cache {

        return cache.$get(this.context);

    }

    getRequest():request.Request {

        return request.$get(this.context);

    }

    clearStorage() {

        this.getStorage().clean();

        return this;

    }

    setCredentials(appKey, appSecret) {

        var apiKey = (appKey || '') + ':' + (appSecret || '');

        if (apiKey == ':') return this;

        this.apiKey = (typeof btoa == 'function') ? btoa(apiKey) : new Buffer(apiKey).toString('base64');

        return this;

    }

    getCredentials():{key:string; secret:string} {

        var credentials = (
            (typeof atob == 'function')
                ? atob(this.apiKey)
                : new Buffer(this.apiKey, 'base64').toString('utf-8')
        ).split(':');

        return {
            key: credentials[0],
            secret: credentials[1]
        };

    }

    setServer(server) {

        this.server = server || '';

        return this;

    }

    remember(remember?:boolean):Platform {

        var key = this.cacheId + '-remember';

        if (remember !== undefined) {

            this.getStorage().setItem(key, remember);
            return this;

        }

        return this.getStorage().getItem(key) || false;

    }

    getAuthURL(options:{
        redirectUri:string;
        display?:string; // page|popup|touch|mobile, default 'page'
        prompt?:string; // sso|login|consent, default is 'login sso consent'
        state?:string;
        brandId?:string|number;
    }) {

        options = options || <any>{};

        return this.apiUrl('/restapi/oauth/authorize?' + this.utils.queryStringify({
                'response_type': 'code',
                'redirect_uri': options.redirectUri || '',
                'client_id': this.getCredentials().key,
                'state': options.state || '',
                'brand_id': options.brandId || '',
                'display': options.display || '',
                'prompt': options.prompt || ''
            }), {addServer: true})

    }

    parseAuthRedirectUrl(url:string) {

        var qs = this.utils.parseQueryString(url.split('?').reverse()[0]),
            error = qs.error_description || qs.error;

        if (error) {
            var e = <IAuthError> new Error(error);
            e.error = qs.error;
            throw e;
        }

        return qs;

    }

    authorize(options?:{
        username?:string;
        password?: string;
        extension?:string;
        code?:string;
        redirectUri?:string;
        clientId?:string;
        remember?:boolean
    }) {

        options = options || <any>{};

        options.remember = options.remember || false;

        var body = <any>{
            "access_token_ttl": this.accessTokenTtl,
            "refresh_token_ttl": options.remember ? this.refreshTokenTtlRemember : this.refreshTokenTtl
        };

        if (options.username) {

            body.grant_type = 'password';
            body.username = options.username;
            body.password = options.password;
            body.extension = options.extension || '';

        } else if (options.code) {

            body.grant_type = 'authorization_code';
            body.code = options.code;
            body.redirect_uri = options.redirectUri;
            //body.client_id = this.getCredentials().key; // not needed

        } else {

            return this.context.getPromise().reject(new Error('Unsupported authorization flow'));

        }

        return this.authCall({
            url: '/restapi/oauth/token',
            post: body
        }).then((response) => {

            this.setCache(response.data)
                .remember(options.remember)
                .emitAndCallback(this.events.authorizeSuccess, []);

            return response;

        }).catch((e:request.IAjaxError):any => {

            this.clearStorage()
                .emitAndCallback(this.events.authorizeError, [e]);

            throw e;

        });

    }

    isPaused() {
        var storage = this.getStorage(),
            cacheId = this.cacheId + '-refresh';
        return !!storage.getItem(cacheId) && Date.now() - parseInt(storage.getItem(cacheId)) < this.releaseTimeout;
    }

    pause() {
        this.getStorage().setItem(this.cacheId + '-refresh', Date.now());
        return this;
    }

    /**
     * If the queue is unpaused internally, polling will be cancelled
     * @returns {Platform}
     */
    resume() {
        this.getStorage().removeItem(this.cacheId + '-refresh');
        return this;
    }

    refresh() {

        var refresh = new (this.context.getPromise())((resolve, reject) => {

            if (this.isPaused()) {
                return resolve(this.refreshPolling(null));
            } else {
                this.pause();
            }

            // Make sure all existing AJAX calls had a chance to reach the server
            setTimeout(() => {

                var authData = this.getAuthData();

                this.log.debug('Platform.refresh(): Performing token refresh (access token', authData.access_token, ', refresh token', authData.refresh_token, ')');

                if (!authData || !authData.refresh_token) return reject(new Error('Refresh token is missing'));
                if (Date.now() > authData.refreshExpireTime) return reject(new Error('Refresh token has expired'));
                if (!this.isPaused()) return reject(new Error('Queue was resumed before refresh call'));

                resolve(this.authCall({
                    url: '/restapi/oauth/token',
                    post: {
                        "grant_type": "refresh_token",
                        "refresh_token": authData.refresh_token,
                        "access_token_ttl": this.accessTokenTtl,
                        "refresh_token_ttl": this.remember() ? this.refreshTokenTtlRemember : this.refreshTokenTtl
                    }
                }));

            }, this.refreshDelayMs);

        });

        return refresh.then((response:r.Response) => {

            // This means refresh has happened elsewhere and we are here because of timeout
            if (!response || !response.data) return response;

            this.log.info('Platform.refresh(): Token was refreshed');

            if (!response.data.refresh_token || !response.data.access_token) {
                var e = <request.IAjaxError>new Error('Malformed OAuth response');
                e.ajax = response;
                throw e;
            }

            this.setCache(response.data)
                .resume();

            return response;

        }).then((result) => {

            this.emit(this.events.refreshSuccess, result);
            return result;

        }).catch((e:request.IAjaxError):any => {

            if (this.clearCacheOnRefreshError) this.clearStorage();

            this.emitAndCallback(this.events.accessViolation, [e])
                .emitAndCallback(this.events.refreshError, [e]);

            throw e;

        });

    }

    /**
     * @returns {Promise}
     */
    logout():Promise<r.Response> {

        this.pause();

        return this.authCall({
            url: '/restapi/oauth/revoke',
            post: {
                token: this.getToken()
            }
        }).then((response)  => {

            this.resume()
                .clearStorage()
                .emit(this.events.logoutSuccess, response);

            return response;

        }).catch((e:request.IAjaxError):any => {

            this.resume()
                .emitAndCallback(this.events.accessViolation, [e])
                .emitAndCallback(this.events.logoutError, [e]);

            throw e;

        });

    }

    refreshPolling(result) {

        if (this.refreshPromise) return this.refreshPromise;

        this.refreshPromise = new (this.context.getPromise())((resolve, reject) => {

            this.log.warn('Platform.refresh(): Refresh is already in progress polling started');

            this.utils.poll((next) => {

                if (this.isPaused()) return next();

                this.refreshPromise = null;
                this.resume();

                if (this.isTokenValid()) {
                    resolve(result);
                } else {
                    reject(new Error('Automatic authentification timeout'));
                }

            }, this.pollInterval);

        });

        return this.refreshPromise;

    }

    getToken() {

        return this.getAuthData().access_token;

    }

    getTokenType() {

        return this.getAuthData().token_type;

    }

    getAuthData():IPlatformAuthInfo {

        return this.getStorage().getItem(this.cacheId) || {
                token_type: '',
                access_token: '',
                expires_in: 0,
                refresh_token: '',
                refresh_token_expires_in: 0
            };

    }

    /**
     * Check if there is a valid (not expired) access token
     */
    isTokenValid():boolean {

        var authData = this.getAuthData();
        return (authData.token_type == Platform.forcedTokenType || (new Date(authData.expireTime).getTime() - this.refreshHandicapMs) > Date.now() && !this.isPaused());

    }

    /**
     * Checks if user is authorized
     * If there is no access token, refresh will be performed
     */
    isAuthorized():Promise<any> {

        if (this.isTokenValid()) return this.context.getPromise().resolve(true);
        return this.refresh();

    }

    cancelAccessToken() {

        return this.setCache(this.utils.extend(this.getAuthData(), {
            access_token: '',
            expires_in: 0
        }));

    }

    setCache(authData:IPlatformAuthInfo) {

        var oldAuthData = this.getAuthData();

        this.log.info('Platform.setCache(): Tokens were updated, new:', authData, ', old:', oldAuthData);

        authData.expireTime = Date.now() + (authData.expires_in * 1000);
        authData.refreshExpireTime = Date.now() + (authData.refresh_token_expires_in * 1000);

        this.getStorage().setItem(this.cacheId, authData);

        return this;

    }

    forceAuthentication() {

        this.setCache(<IPlatformAuthInfo>{
            token_type: Platform.forcedTokenType,
            access_token: '',
            expires_in: 0,
            refresh_token: '',
            refresh_token_expires_in: 0
        });

        return this;

    }

    apiCall(options?:request.IAjaxOptions):Promise<r.Response> {

        options = options || {};
        options.url = this.apiUrl(options.url, {addServer: true});

        return this.isAuthorized().then(() => { // Refresh will occur inside

            var token = this.getToken();

            return this.getRequest()
                .setOptions(options)
                .setHeader('Authorization', this.getTokenType() + (token ? ' ' + token : ''))
                .send();

        }).catch((e:request.IAjaxError) => {

            if (!e.response || !e.response.isUnauthorized()) throw e;

            this.cancelAccessToken();

            return this
                .refresh()
                .then(() => {

                    // Re-send with same options
                    return this.apiCall(options);

                });

        });

    }

    get(url:string, options?:request.IAjaxOptions) {
        options = options || {};
        options.url = url;
        options.method = 'GET';
        return this.apiCall(options);
    }

    post(url:string, options:request.IAjaxOptions) {
        options = options || {};
        options.url = url;
        options.method = 'POST';
        return this.apiCall(options);
    }

    put(url:string, options:request.IAjaxOptions) {
        options = options || {};
        options.url = url;
        options.method = 'PUT';
        return this.apiCall(options);
    }

    'delete'(url:string, options?:request.IAjaxOptions) {
        options = options || {};
        options.url = url;
        options.method = 'DELETE';
        return this.apiCall(options);
    }

    authCall(options?:request.IAjaxOptions):Promise<r.Response> {

        options = options || {};
        options.method = options.method || 'POST';
        options.url = this.apiUrl(options.url, {addServer: true});

        return this.getRequest()
            .setOptions(options)
            .setHeader('Content-Type', 'application/x-www-form-urlencoded')
            .setHeader('Accept', 'application/json')
            .setHeader('Authorization', 'Basic ' + this.apiKey)
            .send();

    }

    apiUrl(url, options?:{addMethod?: string; addToken?: boolean; addServer?: boolean}):string {

        url = url || '';
        options = options || {};

        var builtUrl = '',
            hasHttp = url.indexOf('http://') != -1 || url.indexOf('https://') != -1;

        if (options.addServer && !hasHttp) builtUrl += this.server;

        if (url.indexOf(this.urlPrefix) == -1 && !hasHttp) builtUrl += this.urlPrefix + '/' + this.apiVersion;

        if (url.indexOf(this.accountPrefix) > -1) builtUrl.replace(this.accountPrefix + '~', this.accountPrefix + this.account);

        builtUrl += url;

        if (options.addMethod || options.addToken) builtUrl += (url.indexOf('?') > -1 ? '&' : '?');

        if (options.addMethod) builtUrl += '_method=' + options.addMethod;
        if (options.addToken) builtUrl += (options.addMethod ? '&' : '') + 'access_token=' + this.getToken();

        return builtUrl;

    }

}

export interface IAuthError extends Error {
    error?:string;
}

export interface IPlatformAuthInfo {
    token_type?:string;
    access_token?:string;
    expires_in?:number; // actually it's string
    expireTime?:number;
    refresh_token?:string;
    refresh_token_expires_in?:number; // actually it's string
    refreshExpireTime?:number;
    scope?:string;
}

export function $get(context:context.Context):Platform {
    return context.createSingleton('Platform', ()=> {
        return new Platform(context);
    });
}