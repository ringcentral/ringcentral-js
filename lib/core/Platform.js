var define = typeof define === 'function' && define.amd ? define : function (factory) {
    factory(require, exports, module);
};
define(function (require, exports, module) {
    var __extends = this.__extends || function (d, b) {
        for (var p in b)
            if (b.hasOwnProperty(p))
                d[p] = b[p];
        function __() {
            this.constructor = d;
        }
        __.prototype = b.prototype;
        d.prototype = new __();
    };
    var observable = require('./Observable');
    var cache = require('./Cache');
    var request = require('./http/Request');
    var Platform = function (_super) {
        __extends(Platform, _super);
        function Platform(context) {
            _super.call(this, context);
            this.events = {
                accessViolation: 'accessViolation',
                logoutSuccess: 'logoutSuccess',
                logoutError: 'logoutError',
                authorizeSuccess: 'authorizeSuccess',
                authorizeError: 'authorizeError',
                refreshSuccess: 'refreshSuccess',
                refreshError: 'refreshError'
            };
            this.server = '';
            this.apiKey = '';
            this.account = '~';
            this.urlPrefix = '/restapi';
            this.apiVersion = 'v1.0';
            this.accountPrefix = '/account/';
            this.accessTokenTtl = null;
            // Platform server by default sets it to 60 * 60 = 1 hour
            this.refreshTokenTtl = 10 * 60 * 60;
            // 10 hours
            this.refreshTokenTtlRemember = 7 * 24 * 60 * 60;
            // 1 week
            this.refreshHandicapMs = 60 * 1000;
            // 1 minute
            this.refreshDelayMs = 100;
            this.clearCacheOnRefreshError = true;
            this.refreshPromise = null;
            this.cacheId = 'platform';
            this.pollInterval = 250;
            this.releaseTimeout = 5000;    // If queue was not released then force it to do so after some timeout
        }
        Platform.prototype.getStorage = function () {
            return cache.$get(this.context);
        };
        Platform.prototype.getRequest = function () {
            return request.$get(this.context);
        };
        Platform.prototype.clearStorage = function () {
            this.getStorage().clean();
            return this;
        };
        Platform.prototype.setCredentials = function (appKey, appSecret) {
            var apiKey = (appKey || '') + ':' + (appSecret || '');
            if (apiKey == ':')
                return this;
            this.apiKey = typeof btoa == 'function' ? btoa(apiKey) : new Buffer(apiKey).toString('base64');
            return this;
        };
        Platform.prototype.getCredentials = function () {
            var credentials = (typeof atob == 'function' ? atob(this.apiKey) : new Buffer(this.apiKey, 'base64').toString('utf-8')).split(':');
            return {
                key: credentials[0],
                secret: credentials[1]
            };
        };
        Platform.prototype.setServer = function (server) {
            this.server = server || '';
            return this;
        };
        Platform.prototype.remember = function (remember) {
            var key = this.cacheId + '-remember';
            if (remember !== undefined) {
                this.getStorage().setItem(key, remember);
                return this;
            }
            return this.getStorage().getItem(key) || false;
        };
        Platform.prototype.getAuthURL = function (options) {
            options = options || {};
            return this.apiUrl('/restapi/oauth/authorize?' + this.utils.queryStringify({
                'response_type': 'code',
                'redirect_uri': options.redirectUri || '',
                'client_id': this.getCredentials().key,
                'state': options.state || '',
                'brand_id': options.brandId || '',
                'display': options.display || '',
                'prompt': options.prompt || ''
            }), { addServer: true });
        };
        Platform.prototype.parseAuthRedirectUrl = function (url) {
            var qs = this.utils.parseQueryString(url.split('?').reverse()[0]), error = qs.error_description || qs.error;
            if (error) {
                var e = new Error(error);
                e.error = qs.error;
                throw e;
            }
            return qs;
        };
        Platform.prototype.authorize = function (options) {
            var _this = this;
            options = options || {};
            options.remember = options.remember || false;
            var body = {
                'access_token_ttl': this.accessTokenTtl,
                'refresh_token_ttl': options.remember ? this.refreshTokenTtlRemember : this.refreshTokenTtl
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
            } else {
                return this.context.getPromise().reject(new Error('Unsupported authorization flow'));
            }
            return this.authCall({
                url: '/restapi/oauth/token',
                post: body
            }).then(function (response) {
                _this.setCache(response.data).remember(options.remember).emitAndCallback(_this.events.authorizeSuccess, []);
                return response;
            }).catch(function (e) {
                _this.clearStorage().emitAndCallback(_this.events.authorizeError, [e]);
                throw e;
            });
        };
        Platform.prototype.isPaused = function () {
            var storage = this.getStorage(), cacheId = this.cacheId + '-refresh';
            return !!storage.getItem(cacheId) && Date.now() - parseInt(storage.getItem(cacheId)) < this.releaseTimeout;
        };
        Platform.prototype.pause = function () {
            this.getStorage().setItem(this.cacheId + '-refresh', Date.now());
            return this;
        };
        /**
     * If the queue is unpaused internally, polling will be cancelled
     * @returns {Platform}
     */
        Platform.prototype.resume = function () {
            this.getStorage().removeItem(this.cacheId + '-refresh');
            return this;
        };
        Platform.prototype.refresh = function () {
            var _this = this;
            var refresh = new (this.context.getPromise())(function (resolve, reject) {
                if (_this.isPaused()) {
                    return resolve(_this.refreshPolling(null));
                } else {
                    _this.pause();
                }
                // Make sure all existing AJAX calls had a chance to reach the server
                setTimeout(function () {
                    var authData = _this.getAuthData();
                    _this.log.debug('Platform.refresh(): Performing token refresh (access token', authData.access_token, ', refresh token', authData.refresh_token, ')');
                    if (!authData || !authData.refresh_token)
                        return reject(new Error('Refresh token is missing'));
                    if (Date.now() > authData.refreshExpireTime)
                        return reject(new Error('Refresh token has expired'));
                    if (!_this.isPaused())
                        return reject(new Error('Queue was resumed before refresh call'));
                    resolve(_this.authCall({
                        url: '/restapi/oauth/token',
                        post: {
                            'grant_type': 'refresh_token',
                            'refresh_token': authData.refresh_token,
                            'access_token_ttl': _this.accessTokenTtl,
                            'refresh_token_ttl': _this.remember() ? _this.refreshTokenTtlRemember : _this.refreshTokenTtl
                        }
                    }));
                }, _this.refreshDelayMs);
            });
            return refresh.then(function (response) {
                // This means refresh has happened elsewhere and we are here because of timeout
                if (!response || !response.data)
                    return response;
                _this.log.info('Platform.refresh(): Token was refreshed');
                if (!response.data.refresh_token || !response.data.access_token) {
                    var e = new Error('Malformed OAuth response');
                    e.ajax = response;
                    throw e;
                }
                _this.setCache(response.data).resume();
                return response;
            }).then(function (result) {
                _this.emit(_this.events.refreshSuccess, result);
                return result;
            }).catch(function (e) {
                if (_this.clearCacheOnRefreshError)
                    _this.clearStorage();
                _this.emitAndCallback(_this.events.accessViolation, [e]).emitAndCallback(_this.events.refreshError, [e]);
                throw e;
            });
        };
        /**
     * @returns {Promise}
     */
        Platform.prototype.logout = function () {
            var _this = this;
            this.pause();
            return this.authCall({
                url: '/restapi/oauth/revoke',
                post: { token: this.getToken() }
            }).then(function (response) {
                _this.resume().clearStorage().emit(_this.events.logoutSuccess, response);
                return response;
            }).catch(function (e) {
                _this.resume().emitAndCallback(_this.events.accessViolation, [e]).emitAndCallback(_this.events.logoutError, [e]);
                throw e;
            });
        };
        Platform.prototype.refreshPolling = function (result) {
            var _this = this;
            if (this.refreshPromise)
                return this.refreshPromise;
            this.refreshPromise = new (this.context.getPromise())(function (resolve, reject) {
                _this.log.warn('Platform.refresh(): Refresh is already in progress polling started');
                _this.utils.poll(function (next) {
                    if (_this.isPaused())
                        return next();
                    _this.refreshPromise = null;
                    _this.resume();
                    if (_this.isTokenValid()) {
                        resolve(result);
                    } else {
                        reject(new Error('Automatic authentification timeout'));
                    }
                }, _this.pollInterval);
            });
            return this.refreshPromise;
        };
        Platform.prototype.getToken = function () {
            return this.getAuthData().access_token;
        };
        Platform.prototype.getTokenType = function () {
            return this.getAuthData().token_type;
        };
        Platform.prototype.getAuthData = function () {
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
     */
        Platform.prototype.isTokenValid = function () {
            var authData = this.getAuthData();
            return authData.token_type == Platform.forcedTokenType || new Date(authData.expireTime).getTime() - this.refreshHandicapMs > Date.now() && !this.isPaused();
        };
        /**
     * Checks if user is authorized
     * If there is no access token, refresh will be performed
     */
        Platform.prototype.isAuthorized = function () {
            if (this.isTokenValid())
                return this.context.getPromise().resolve(true);
            return this.refresh();
        };
        Platform.prototype.cancelAccessToken = function () {
            return this.setCache(this.utils.extend(this.getAuthData(), {
                access_token: '',
                expires_in: 0
            }));
        };
        Platform.prototype.setCache = function (authData) {
            var oldAuthData = this.getAuthData();
            this.log.info('Platform.setCache(): Tokens were updated, new:', authData, ', old:', oldAuthData);
            authData.expireTime = Date.now() + authData.expires_in * 1000;
            authData.refreshExpireTime = Date.now() + authData.refresh_token_expires_in * 1000;
            this.getStorage().setItem(this.cacheId, authData);
            return this;
        };
        Platform.prototype.forceAuthentication = function () {
            this.setCache({
                token_type: Platform.forcedTokenType,
                access_token: '',
                expires_in: 0,
                refresh_token: '',
                refresh_token_expires_in: 0
            });
            return this;
        };
        Platform.prototype.apiCall = function (options) {
            var _this = this;
            options = options || {};
            options.url = this.apiUrl(options.url, { addServer: true });
            return this.isAuthorized().then(function () {
                var token = _this.getToken();
                return _this.getRequest().setOptions(options).setHeader('Authorization', _this.getTokenType() + (token ? ' ' + token : '')).send();
            }).catch(function (e) {
                if (!e.response || !e.response.isUnauthorized())
                    throw e;
                _this.cancelAccessToken();
                return _this.refresh().then(function () {
                    // Re-send with same options
                    return _this.apiCall(options);
                });
            });
        };
        Platform.prototype.get = function (url, options) {
            options = options || {};
            options.url = url;
            options.method = 'GET';
            return this.apiCall(options);
        };
        Platform.prototype.post = function (url, options) {
            options = options || {};
            options.url = url;
            options.method = 'POST';
            return this.apiCall(options);
        };
        Platform.prototype.put = function (url, options) {
            options = options || {};
            options.url = url;
            options.method = 'PUT';
            return this.apiCall(options);
        };
        Platform.prototype['delete'] = function (url, options) {
            options = options || {};
            options.url = url;
            options.method = 'DELETE';
            return this.apiCall(options);
        };
        Platform.prototype.authCall = function (options) {
            options = options || {};
            options.method = options.method || 'POST';
            options.url = this.apiUrl(options.url, { addServer: true });
            return this.getRequest().setOptions(options).setHeader('Content-Type', 'application/x-www-form-urlencoded').setHeader('Accept', 'application/json').setHeader('Authorization', 'Basic ' + this.apiKey).send();
        };
        Platform.prototype.apiUrl = function (url, options) {
            url = url || '';
            options = options || {};
            var builtUrl = '', hasHttp = url.indexOf('http://') != -1 || url.indexOf('https://') != -1;
            if (options.addServer && !hasHttp)
                builtUrl += this.server;
            if (url.indexOf(this.urlPrefix) == -1 && !hasHttp)
                builtUrl += this.urlPrefix + '/' + this.apiVersion;
            if (url.indexOf(this.accountPrefix) > -1)
                builtUrl.replace(this.accountPrefix + '~', this.accountPrefix + this.account);
            builtUrl += url;
            if (options.addMethod || options.addToken)
                builtUrl += url.indexOf('?') > -1 ? '&' : '?';
            if (options.addMethod)
                builtUrl += '_method=' + options.addMethod;
            if (options.addToken)
                builtUrl += (options.addMethod ? '&' : '') + 'access_token=' + this.getToken();
            return builtUrl;
        };
        Platform.forcedTokenType = 'forced';
        return Platform;
    }(observable.Observable);
    exports.Platform = Platform;
    function $get(context) {
        return context.createSingleton('Platform', function () {
            return new Platform(context);
        });
    }
    exports.$get = $get;
});