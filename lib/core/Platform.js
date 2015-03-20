define(function(require, exports, module) {

    'use strict';

    var Utils = require('./Utils'),
        Observable = require('./Observable').Class,
        Log = require('./Log'),
        forcedTokenType = 'forced';

    /**
     * @typedef {Object} PlatformAuthInfo
     * @property {string} token_type
     * @property {string} access_token
     * @property {string} expires_in
     * @property {int} expireTime
     * @property {string} refresh_token
     * @property {string} refresh_token_expires_in
     * @property {int} refreshExpireTime
     * @property {string} scope
     */

    /**
     * @constructor
     * @extends Observable
     * @alias RCSDK.core.Platform
     * @param {Context} context
     */
    function Platform(context) {
        Observable.call(this);
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
        /** @type {Promise} */
        this.refreshPromise = null;
        this.context = context;
    }

    Platform.prototype = Object.create(Observable.prototype);
    Object.defineProperty(Platform.prototype, 'constructor', {value: Platform, enumerable: false});

    Platform.prototype.cacheId = 'platform';

    Platform.prototype.pollInterval = 250;

    Platform.prototype.releaseTimeout = 5000; // If queue was not released then force it to do so after some timeout

    Platform.prototype.events = {
        accessViolation: 'accessViolation',
        logoutSuccess: 'logoutSuccess',
        logoutError: 'logoutError',
        authorizeSuccess: 'authorizeSuccess',
        authorizeError: 'authorizeError',
        refreshSuccess: 'refreshSuccess',
        refreshError: 'refreshError'
    };

    /**
     * @returns {Cache}
     */
    Platform.prototype.getStorage = function() {

        return require('./Cache').$get(this.context);

    };

    /**
     * @returns {Request}
     */
    Platform.prototype.getRequest = function() {

        return require('./http/Request').$get(this.context);

    };

    /**
     * @returns {Platform}
     */
    Platform.prototype.clearStorage = function() {

        this.getStorage().clean();

        return this;

    };

    /**
     * @returns {Platform}
     */
    Platform.prototype.setCredentials = function(appKey, appSecret) {

        var apiKey = (appKey || '') + ':' + (appSecret || '');

        if (apiKey == ':') return this;

        this.apiKey = (typeof btoa == 'function') ? btoa(apiKey) : new Buffer(apiKey).toString('base64');

        return this;

    };

    /**
     * @returns {Platform}
     */
    Platform.prototype.setServer = function(server) {

        this.server = server || '';

        return this;

    };

    /**
     * @param {boolean} [remember]
     * @returns {Platform|boolean}
     */
    Platform.prototype.remember = function(remember) {

        var key = this.cacheId + '-remember';

        if (remember !== undefined) {

            this.getStorage().setItem(key, remember);
            return this;

        }

        return this.getStorage().getItem(key) || false;

    };

    /**
     * @param {string} options.username
     * @param {string} options.password
     * @param {string} [options.extension]
     * @param {boolean} [options.remember]
     * @returns {Promise}
     */
    Platform.prototype.authorize = function(options) {

        options = options || {};

        options.remember = options.remember || false;

        return this
            .authCall({
                url: '/restapi/oauth/token',
                post: {
                    "grant_type": "password",
                    "username": options.username,
                    "extension": options.extension || '',
                    "password": options.password,
                    "access_token_ttl": this.accessTokenTtl,
                    "refresh_token_ttl": options.remember ? this.refreshTokenTtlRemember : this.refreshTokenTtl
                }
            })
            .then(function(response) {

                this.setCache(response.data)
                    .remember(options.remember)
                    .emitAndCallback(this.events.authorizeSuccess, []);

                return response;

            }.bind(this))
            .catch(function(e) {

                this.clearStorage()
                    .emitAndCallback(this.events.authorizeError, [e]);

                throw e;

            }.bind(this));

    };

    Platform.prototype.isPaused = function() {
        var storage = this.getStorage(),
            cacheId = this.cacheId + '-refresh';
        return !!storage.getItem(cacheId) && Date.now() - parseInt(storage.getItem(cacheId)) < this.releaseTimeout;
    };

    Platform.prototype.pause = function() {
        this.getStorage().setItem(this.cacheId + '-refresh', Date.now());
        return this;
    };

    /**
     * If the queue is unpaused internally, polling will be cancelled
     * @returns {Platform}
     */
    Platform.prototype.resume = function() {
        this.getStorage().removeItem(this.cacheId + '-refresh');
        return this;
    };

    /**
     * Gets resolved into Ajax or null if refresh resolved from elsewhere
     * @returns {Promise}
     */
    Platform.prototype.refresh = function() {

        var refresh = new (this.context.getPromise())(function(resolve, reject) {

            if (this.isPaused()) {
                return resolve(this.refreshPolling(null));
            } else {
                this.pause();
            }

            // Make sure all existing AJAX calls had a chance to reach the server
            setTimeout(function() {

                var authData = this.getAuthData();

                Log.debug('Platform.refresh(): Performing token refresh (access token', authData.access_token, ', refresh token', authData.refresh_token, ')');

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

            }.bind(this), this.refreshDelayMs);

        }.bind(this));

        return refresh
            .then(function(response) {

                // This means refresh has happened elsewhere and we are here because of timeout
                if (!response || !response.data) return response;

                Log.info('Platform.refresh(): Token was refreshed');

                if (!response.data.refresh_token || !response.data.access_token) {
                    var e = new Error('Malformed OAuth response');
                    e.ajax = response;
                    throw e;
                }

                this.setCache(response.data)
                    .resume();

                return response;

            }.bind(this))
            .then(function(result) {

                this.emit(this.events.refreshSuccess, result);
                return result;

            }.bind(this))
            .catch(function(e) {

                if (this.clearCacheOnRefreshError) this.clearStorage();

                this.emitAndCallback(this.events.accessViolation, [e])
                    .emitAndCallback(this.events.refreshError, [e]);

                throw e;

            }.bind(this));

    };

    /**
     * @returns {Promise}
     */
    Platform.prototype.logout = function() {

        this.pause();

        return this
            .authCall({
                url: '/restapi/oauth/revoke',
                post: {
                    token: this.getToken()
                }
            })
            .then(function(response) {

                this.resume()
                    .clearStorage()
                    .emit(this.events.logoutSuccess, response);

                return response;

            }.bind(this))
            .catch(function(e) {

                this.resume()
                    .emitAndCallback(this.events.accessViolation, [e])
                    .emitAndCallback(this.events.logoutError, [e]);

                throw e;

            }.bind(this));

    };

    Platform.prototype.refreshPolling = function(result) {

        if (this.refreshPromise) return this.refreshPromise;

        this.refreshPromise = new (this.context.getPromise())(function(resolve, reject) {

            Log.warn('Platform.refresh(): Refresh is already in progress polling started');

            Utils.poll(function(next) {

                if (this.isPaused()) return next();

                this.refreshPromise = null;
                this.resume();

                if (this.isTokenValid()) {
                    resolve(result);
                } else {
                    reject(new Error('Automatic authentification timeout'));
                }

            }.bind(this), this.pollInterval);

        }.bind(this));

        return this.refreshPromise;

    };

    Platform.prototype.getToken = function() {

        return this.getAuthData().access_token;

    };

    Platform.prototype.getTokenType = function() {

        return this.getAuthData().token_type;

    };

    /**
     * @returns {PlatformAuthInfo}
     */
    Platform.prototype.getAuthData = function() {

        return this.getStorage().getItem(this.cacheId) || {
                token_type: '',
                access_token: '',
                expires_in: 0,
                refresh_token: '',
                refresh_token_expires_in: 0
            };

    };

    /**
     * Check if there is a valid (not expired) access token
     * @returns {boolean}
     */
    Platform.prototype.isTokenValid = function() {

        var authData = this.getAuthData();
        return (authData.token_type == forcedTokenType || (new Date(authData.expireTime).getTime() - this.refreshHandicapMs) > Date.now() && !this.isPaused());

    };

    /**
     * Checks if user is authorized
     * If there is no access token, refresh will be performed
     * @returns {Promise}
     */
    Platform.prototype.isAuthorized = function() {

        if (this.isTokenValid()) return this.context.getPromise().resolve(true);
        return this.refresh();

    };

    /**
     * @returns {Platform}
     */
    Platform.prototype.cancelAccessToken = function() {

        return this.setCache(Utils.extend(this.getAuthData(), {
            access_token: '',
            expires_in: 0
        }));

    };

    /**
     * @param {object} authData
     * @returns {Platform}
     */
    Platform.prototype.setCache = function(authData) {

        var oldAuthData = this.getAuthData();

        Log.info('Platform.setCache(): Tokens were updated, new:', authData, ', old:', oldAuthData);

        authData.expireTime = Date.now() + (authData.expires_in * 1000);
        authData.refreshExpireTime = Date.now() + (authData.refresh_token_expires_in * 1000);

        this.getStorage().setItem(this.cacheId, authData);

        return this;

    };

    /**
     * @returns {Platform}
     */
    Platform.prototype.forceAuthentication = function() {

        this.setCache({
            token_type: forcedTokenType,
            access_token: '',
            expires_in: 0,
            refresh_token: '',
            refresh_token_expires_in: 0
        });

        return this;

    };

    /**
     * @param {IAjaxOptions} options
     * @returns {Promise}
     */
    Platform.prototype.apiCall = function(options) {

        options = options || {};
        options.url = this.apiUrl(options.url, {addServer: true});

        return this
            .isAuthorized() // Refresh will occur inside
            .then(function() {

                var token = this.getToken();

                return this.getRequest()
                    .setOptions(options)
                    .setHeader('Authorization', this.getTokenType() + (token ? ' ' + token : ''))
                    .send();

            }.bind(this))
            .catch(function(e) {

                if (!e.ajax || !e.ajax.isUnauthorized()) throw e;

                this.cancelAccessToken();

                return this
                    .refresh()
                    .then(function() {

                        // Re-send with same options
                        return this.apiCall(options);

                    }.bind(this));

            }.bind(this));

    };

    /**
     * @param {string} url
     * @param {IAjaxOptions} [options]
     * @returns {Promise}
     */
    Platform.prototype.get = function(url, options) {
        options = options || {};
        options.url = url;
        options.method = 'GET';
        return this.apiCall(options);
    };

    /**
     * @param {string} url
     * @param {IAjaxOptions} options
     * @returns {Promise}
     */
    Platform.prototype.post = function(url, options) {
        options = options || {};
        options.url = url;
        options.method = 'POST';
        return this.apiCall(options);
    };

    /**
     * @param {string} url
     * @param {IAjaxOptions} options
     * @returns {Promise}
     */
    Platform.prototype.put = function(url, options) {
        options = options || {};
        options.url = url;
        options.method = 'PUT';
        return this.apiCall(options);
    };

    /**
     * @param {string} url
     * @param {IAjaxOptions} [options]
     * @returns {Promise}
     */
    Platform.prototype['delete'] = function(url, options) {
        options = options || {};
        options.url = url;
        options.method = 'DELETE';
        return this.apiCall(options);
    };

    /**
     * @param {IAjaxOptions} options
     * @returns {Promise}
     */
    Platform.prototype.authCall = function(options) {

        options = options || {};
        options.method = options.method || 'POST';
        options.url = this.apiUrl(options.url, {addServer: true});

        return this.getRequest()
            .setOptions(options)
            .setHeader('Content-Type', 'application/x-www-form-urlencoded')
            .setHeader('Accept', 'application/json')
            .setHeader('Authorization', 'Basic ' + this.apiKey)
            .send();

    };

    /**
     *
     * @param url
     * @param {{addMethod?: string, addToken?: boolean, addServer?: boolean}} [options]
     * @returns {string}
     */
    Platform.prototype.apiUrl = function(url, options) {

        url = url || '';
        options = options || {};

        var builtUrl = '';

        if (options.addServer && url.indexOf('http://') == -1 && url.indexOf('https://') == -1) builtUrl += this.server;

        if (url.indexOf(this.urlPrefix) == -1) builtUrl += this.urlPrefix + '/' + this.apiVersion;

        if (url.indexOf(this.accountPrefix) > -1) builtUrl.replace(this.accountPrefix + '~', this.accountPrefix + this.account);

        builtUrl += url;

        if (options.addMethod || options.addToken) builtUrl += (url.indexOf('?') > -1 ? '&' : '?');

        if (options.addMethod) builtUrl += '_method=' + options.addMethod;
        if (options.addToken) builtUrl += (options.addMethod ? '&' : '') + 'access_token=' + this.getToken();

        return builtUrl;

    };

    module.exports = {
        Class: Platform,
        /**
         * @param {Context} context
         * @returns {Platform}
         */
        $get: function(context) {

            return context.createSingleton('Platform', function() {
                return new Platform(context);
            });

        }
    };

});
