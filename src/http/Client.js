var isPlainObject = require("is-plain-object");
var EventEmitter = require("events").EventEmitter;
var ApiResponse = require("./ApiResponse");
var qs = require("querystring");

function findHeaderName(name, headers) {
    name = name.toLowerCase();
    return Object.keys(headers).reduce(function(res, key) {
        if (res) return res;
        if (name == key.toLowerCase()) return key;
        return res;
    }, null);
}

/**
 * @param {Externals} externals
 * @property {Externals} _externals
 */
function Client(externals) {

    EventEmitter.call(this);

    /** @private */
    this._externals = externals;

    this.events = {
        beforeRequest: 'beforeRequest',
        requestSuccess: 'requestSuccess',
        requestError: 'requestError'
    };

}

Client._allowedMethods = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS', 'HEAD'];

Client.prototype = Object.create(EventEmitter.prototype);

/**
 * @param {Request} request
 * @return {Promise<ApiResponse>}
 */
Client.prototype.sendRequest = function(request) {

    var apiResponse = new ApiResponse({
        externals: this._externals,
        request: request
    });

    return (new this._externals.Promise(function(resolve) {

        //TODO Stop request if listeners return false
        this.emit(this.events.beforeRequest, apiResponse);

        resolve(this._loadResponse(request));

    }.bind(this))).then(function(response) {

        return apiResponse.receiveResponse(response);

    }).then(function() {

        if (!apiResponse.ok()) throw new Error('Response has unsuccessful status');

        this.emit(this.events.requestSuccess, apiResponse);

        return apiResponse;

    }.bind(this)).catch(function(e) {

        if (!e.apiResponse) e = this.makeError(e, apiResponse);

        this.emit(this.events.requestError, e);

        throw e;

    }.bind(this));

};

/**
 * @param {Request} request
 * @return {Promise<Response>}
 * @private
 */
Client.prototype._loadResponse = function(request) {
    return this._externals.fetch.call(null, request);
};

/**
 * Wraps the JS Error object with transaction information
 * @param {Error|IApiError} e
 * @param {ApiResponse} apiResponse
 * @return {IApiError}
 */
Client.prototype.makeError = function(e, apiResponse) {

    // Wrap only if regular error
    if (!e.hasOwnProperty('apiResponse') && !e.hasOwnProperty('originalMessage')) {

        e.apiResponse = apiResponse;
        e.originalMessage = e.message;
        e.message = (apiResponse && apiResponse.error(true)) || e.originalMessage;

    }

    return e;

};

/**
 *
 * @param {object} init
 * @param {object} [init.url]
 * @param {object} [init.body]
 * @param {string} [init.method]
 * @param {object} [init.query]
 * @param {object} [init.headers]
 * @param {object} [init.credentials]
 * @param {object} [init.mode]
 * @return {Request}
 */
Client.prototype.createRequest = function(init) {

    init = init || {};
    init.headers = init.headers || {};

    // Sanity checks
    if (!init.url) throw new Error('Url is not defined');
    if (!init.method) init.method = 'GET';
    init.method = init.method.toUpperCase();
    if (init.method && Client._allowedMethods.indexOf(init.method) < 0) {
        throw new Error('Method has wrong value: ' + init.method);
    }

    // Defaults
    init.credentials = init.credentials || 'include';
    init.mode = init.mode || 'cors';

    // Append Query String
    if (init.query) {
        init.url = init.url + (init.url.indexOf('?') > -1 ? '&' : '?') + qs.stringify(init.query);
    }

    if (!(findHeaderName('Accept', init.headers))) {
        init.headers.Accept = ApiResponse._jsonContentType;
    }

    // Serialize body
    if (isPlainObject(init.body) || !init.body) {

        var contentTypeHeaderName = findHeaderName(ApiResponse._contentType, init.headers);

        if (!contentTypeHeaderName) {
            contentTypeHeaderName = ApiResponse._contentType;
            init.headers[contentTypeHeaderName] = ApiResponse._jsonContentType;
        }

        var contentType = init.headers[contentTypeHeaderName];

        // Assign a new encoded body
        if (contentType.indexOf(ApiResponse._jsonContentType) > -1) {
            if ((init.method === 'GET' || init.method === 'HEAD') && !!init.body) {
                // oddly setting body to null still result in TypeError in phantomjs
                init.body = undefined;
            } else {
                init.body = JSON.stringify(init.body);
            }

        } else if (contentType.indexOf(ApiResponse._urlencodedContentType) > -1) {
            init.body = qs.stringify(init.body);
        }

    }

    // Create a request with encoded body
    var req = new this._externals.Request(init.url, init);

    // Keep the original body accessible directly (for mocks)
    req.originalBody = init.body;

    return req;

};

/**
 * @typedef {object} IApiError
 * @property {string} stack
 * @property {string} originalMessage
 * @property {ApiResponse} apiResponse
 */

module.exports = Client;