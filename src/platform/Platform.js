var EventEmitter = require("events").EventEmitter;
var qs = require("querystring");
var objectAssign = require('object-assign');
var Auth = require("./Auth");
var Constants = require("../core/Constants");
var ApiResponse = require("../http/ApiResponse");

/**
 * @constructor
 * @param {string} options.server
 * @param {string} options.appSecret
 * @param {string} options.appKey
 * @param {string} [options.appName]
 * @param {string} [options.appVersion]
 * @param {string} [options.redirectUri]
 * @param {int} [options.refreshDelayMs]
 * @param {int} [options.refreshHandicapMs]
 * @param {boolean} [options.clearCacheOnRefreshError]
 * @param {Externals} options.externals
 * @param {Cache} options.cache
 * @param {Client} options.client
 * @property {Externals} _externals
 * @property {Cache} _cache
 * @property {Client} _client
 * @property {Promise<ApiResponse>} _refreshPromise
 * @property {Auth} _auth
 */
function Platform(options) {

    EventEmitter.call(this);

    this.events = {
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

    options = options || {};

    /** @private */
    this._server = options.server;

    /** @private */
    this._appKey = options.appKey;

    /** @private */
    this._appSecret = options.appSecret;

    /** @private */
    this._redirectUri = options.redirectUri || '';

    /** @private */
    this._refreshDelayMs = options.refreshDelayMs || 100;

    /** @private */
    this._clearCacheOnRefreshError = typeof options.clearCacheOnRefreshError !== 'undefined' ?
                                     options.clearCacheOnRefreshError :
                                     true;

    /** @private */
    this._userAgent = (options.appName ?
                      (options.appName + (options.appVersion ? '/' + options.appVersion : '')) + ' ' :
                       '') + 'RCJSSDK/' + Constants.version;

    /** @private */
    this._externals = options.externals;

    /** @private */
    this._cache = options.cache;

    /** @private */
    this._client = options.client;

    /** @private */
    this._refreshPromise = null;

    /** @private */
    this._auth = new Auth({
        cache: this._cache,
        cacheId: Platform._cacheId,
        refreshHandicapMs: options.refreshHandicapMs
    });

}

Platform._urlPrefix = '/restapi';
Platform._apiVersion = 'v1.0';
Platform._tokenEndpoint = '/restapi/oauth/token';
Platform._revokeEndpoint = '/restapi/oauth/revoke';
Platform._authorizeEndpoint = '/restapi/oauth/authorize';
Platform._cacheId = 'platform';

Platform.prototype = Object.create(EventEmitter.prototype);

Platform.prototype.delay = function(timeout) {
    return new this._externals.Promise(function(resolve, reject) {
        setTimeout(function() {
            resolve(null);
        }, timeout);
    });
};

/**
 * @return {Auth}
 */
Platform.prototype.auth = function() {
    return this._auth;
};

/**
 * @return {Client}
 */
Platform.prototype.client = function() {
    return this._client;
};

/**
 * @param {string} path
 * @param {object} [options]
 * @param {boolean} [options.addServer]
 * @param {string} [options.addMethod]
 * @param {boolean} [options.addToken]
 * @return {string}
 */
Platform.prototype.createUrl = function(path, options) {

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

};

/**
 * @param {string} [options.redirectUri] Overrides default RedirectURI
 * @param {string} [options.state]
 * @param {string} [options.brandId]
 * @param {string} [options.display]
 * @param {string} [options.prompt]
 * @param {boolean} [options.implicit] Use Implicit Grant flow
 * @return {string}
 */
Platform.prototype.loginUrl = function(options) {

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

};

/**
 * @param {string} url
 * @return {Object}
 */
Platform.prototype.parseLoginRedirect = function(url) {

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
        var e = new Error(error);
        e.error = queryString.error;
        throw e;
    }

    return queryString;

};

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
Platform.prototype.loginWindow = function(options) {

    return new this._externals.Promise(function(resolve, reject) {

        if (typeof window === 'undefined') throw new Error('This method can be used only in browser');

        if (!options.url) throw new Error('Missing mandatory URL parameter');

        options = options || {};
        options.url = options.url || 400;
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

        if(!win) {
            throw new Error('Could not open login window. Please allow popups for this site');
        }

        if (win.focus) win.focus();

        var eventMethod = window.addEventListener ? 'addEventListener' : 'attachEvent';
        var eventRemoveMethod = eventMethod == 'addEventListener' ? 'removeEventListener' : 'detachEvent';
        var messageEvent = eventMethod == 'addEventListener' ? 'message' : 'onmessage';

        var eventListener = function(e) {

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

        }.bind(this);

        window[eventMethod](messageEvent, eventListener, false);

    }.bind(this));

};

/**
 * @return {Promise<boolean>}
 */
Platform.prototype.loggedIn = function() {

    return this.ensureLoggedIn().then(function() {
        return true;
    }).catch(function() {
        return false;
    });

};

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
Platform.prototype.login = function(options) {

    return (new this._externals.Promise(function(resolve) {

        options = options || {};

        this.emit(this.events.beforeLogin);

        var body = {};

        if (options.access_token) {

            //TODO Potentially make a request to /oauth/tokeninfo
            return resolve(options);

        }

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

        resolve(this._tokenRequest(Platform._tokenEndpoint, body));

    }.bind(this))).then(function(res) {

        var apiResponse = res.json ? res : null;
        var json = apiResponse && apiResponse.json() || res;

        this._auth.setData(json);

        this.emit(this.events.loginSuccess, apiResponse);

        return apiResponse;

    }.bind(this)).catch(function(e) {

        if (this._clearCacheOnRefreshError) {
            this._cache.clean();
        }

        this.emit(this.events.loginError, e);

        throw e;

    }.bind(this));

};

/**
 * @returns {Promise<ApiResponse>}
 * @private
 */
Platform.prototype._refresh = function() {

    return this.delay(this._refreshDelayMs).then(function() {

        this.emit(this.events.beforeRefresh);

        // Perform sanity checks
        if (!this._auth.refreshToken()) throw new Error('Refresh token is missing');
        if (!this._auth.refreshTokenValid()) throw new Error('Refresh token has expired');

        return this._tokenRequest(Platform._tokenEndpoint, {
            "grant_type": "refresh_token",
            "refresh_token": this._auth.refreshToken(),
            "access_token_ttl": this._auth.data().expires_in + 1,
            "refresh_token_ttl": this._auth.data().refresh_token_expires_in + 1
        });

    }.bind(this)).then(function(/** @type {ApiResponse} */ res) {

        var json = res.json();

        if (!json.access_token) {
            throw this._client.makeError(new Error('Malformed OAuth response'), res);
        }

        this._auth.setData(json);

        this.emit(this.events.refreshSuccess, res);

        return res;

    }.bind(this)).catch(function(e) {

        e = this._client.makeError(e);

        if (this._clearCacheOnRefreshError) {
            this._cache.clean();
        }

        this.emit(this.events.refreshError, e);

        throw e;

    }.bind(this));

};

/**
 * @returns {Promise<ApiResponse>}
 */
Platform.prototype.refresh = function() {

    if (!this._refreshPromise) {

        this._refreshPromise = this._refresh()
            .then(function(res) {
                this._refreshPromise = null;
                return res;
            }.bind(this))
            .catch(function(e) {
                this._refreshPromise = null;
                throw e;
            }.bind(this));

    }

    return this._refreshPromise;

};

/**
 * @returns {Promise<ApiResponse>}
 */
Platform.prototype.logout = function() {

    return (new this._externals.Promise(function(resolve) {

        this.emit(this.events.beforeLogout);

        resolve(this._tokenRequest(Platform._revokeEndpoint, {
            token: this._auth.accessToken()
        }));

    }.bind(this))).then(function(res) {

        this._cache.clean();

        this.emit(this.events.logoutSuccess, res);

        return res;

    }.bind(this)).catch(function(e) {

        this.emit(this.events.logoutError, e);

        throw e;

    }.bind(this));

};

/**
 * @param {Request} request
 * @param {object} [options]
 * @param {boolean} [options.skipAuthCheck]
 * @return {Promise<Request>}
 */
Platform.prototype.inflateRequest = function(request, options) {

    options = options || {};

    if (options.skipAuthCheck) return this._externals.Promise.resolve(request);

    return this.ensureLoggedIn().then(function() {

        request.headers.set('X-User-Agent', this._userAgent);
        request.headers.set('Client-Id', this._appKey);
        request.headers.set('Authorization', this._authHeader());
        //request.url = this.createUrl(request.url, {addServer: true}); //FIXME Spec prevents this...

        return request;

    }.bind(this));

};

/**
 * @param {Request} request
 * @param {object} [options]
 * @param {boolean} [options.skipAuthCheck]
 * @param {boolean} [options.retry] Will be set by this method if SDK makes second request
 * @return {Promise<ApiResponse>}
 */
Platform.prototype.sendRequest = function(request, options) {

    return this.inflateRequest(request, options).then(function(request) {

        options = options || {};

        return this._client.sendRequest(request);

    }.bind(this)).catch(function(e) {

        // Guard is for errors that come from polling
        if (!e.apiResponse || !e.apiResponse.response() ||
            (e.apiResponse.response().status != ApiResponse._unauthorizedStatus) ||
            options.retry) throw e;

        this._auth.cancelAccessToken();

        options.retry = true;

        return this.sendRequest(request, options);

    }.bind(this));

};

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
Platform.prototype.send = function(options) {

    options = options || {};

    //FIXME https://github.com/bitinn/node-fetch/issues/43
    options.url = this.createUrl(options.url, {addServer: true});

    return this.sendRequest(this._client.createRequest(options), options);

};

/**
 * @param {string} url
 * @param {object} [query]
 * @param {object} [options]
 * @param {object} [options.headers]
 * @param {boolean} [options.skipAuthCheck]
 * @return {Promise<ApiResponse>}
 */
Platform.prototype.get = function(url, query, options) {
    return this.send(objectAssign({}, {method: 'GET', url: url, query: query}, options));
};

/**
 * @param {string} url
 * @param {object} body
 * @param {object} [query]
 * @param {object} [options]
 * @param {object} [options.headers]
 * @param {boolean} [options.skipAuthCheck]
 * @return {Promise<ApiResponse>}
 */
Platform.prototype.post = function(url, body, query, options) {
    return this.send(objectAssign({}, {method: 'POST', url: url, query: query, body: body}, options));
};

/**
 * @param {string} url
 * @param {object} [body]
 * @param {object} [query]
 * @param {object} [options]
 * @param {object} [options.headers]
 * @param {boolean} [options.skipAuthCheck]
 * @return {Promise<ApiResponse>}
 */
Platform.prototype.put = function(url, body, query, options) {
    return this.send(objectAssign({}, {method: 'PUT', url: url, query: query, body: body}, options));
};

/**
 * @param {string} url
 * @param {string} [query]
 * @param {object} [options]
 * @param {object} [options.headers]
 * @param {boolean} [options.skipAuthCheck]
 * @return {Promise<ApiResponse>}
 */
Platform.prototype['delete'] = function(url, query, options) {
    return this.send(objectAssign({}, {method: 'DELETE', url: url, query: query}, options));
};

Platform.prototype.ensureLoggedIn = function() {
    if (this._isAccessTokenValid()) return this._externals.Promise.resolve();
    return this.refresh();
};

/**
 * @param path
 * @param body
 * @return {Promise.<ApiResponse>}
 * @private
 */
Platform.prototype._tokenRequest = function(path, body) {

    return this.send({
        url: path,
        skipAuthCheck: true,
        body: body,
        method: 'POST',
        headers: {
            'Authorization': 'Basic ' + this._apiKey(),
            'Content-Type': ApiResponse._urlencodedContentType
        }
    });

};

/**
 * @return {boolean}
 * @private
 */
Platform.prototype._isAccessTokenValid = function() {
    return this._auth.accessTokenValid();
};

/**
 * @return {string}
 * @private
 */
Platform.prototype._apiKey = function() {
    var apiKey = this._appKey + ':' + this._appSecret;
    return (typeof btoa == 'function') ? btoa(apiKey) : new Buffer(apiKey).toString('base64');
};

/**
 * @return {string}
 * @private
 */
Platform.prototype._authHeader = function() {
    var token = this._auth.accessToken();
    return this._auth.tokenType() + (token ? ' ' + token : '');
};

module.exports = Platform;