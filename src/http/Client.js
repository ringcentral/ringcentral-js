import {fetch, Request} from "../core/Externals";
import {uuid, queryStringify, isPlainObject, isArray, isNodeJS} from "../core/Utils";
import Observable from "../core/Observable";
import ApiResponse from "./ApiResponse";

export default class Client extends Observable {

    static _allowedMethods = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS', 'HEAD'];

    events = {
        beforeRequest: 'beforeRequest',
        requestSuccess: 'requestSuccess',
        requestError: 'requestError'
    };

    /**
     * @param {Request} request
     * @return {Promise<ApiResponse>}
     */
    async sendRequest(request) {

        var apiResponse = new ApiResponse(request);

        try {

            //TODO Stop request if listeners return false
            this.emit(this.events.beforeRequest, apiResponse);

            apiResponse._response = await this._loadResponse(request);

            await apiResponse._init();

            if (!apiResponse.ok()) throw new Error('Response has unsuccessful status');

            this.emit(this.events.requestSuccess, apiResponse);

            return apiResponse;

        } catch (e) {

            if (!e.apiResponse) e = this.makeError(e, apiResponse);

            this.emit(this.events.requestError, e);

            throw e;

        }

    }

    /**
     * @param {Request} request
     * @return {Promise<Response>}
     * @private
     */
    async _loadResponse(request) {
        return await fetch.call(null, request);
    }

    /**
     * Wraps the JS Error object with transaction information
     * @param {Error|IApiError} e
     * @param {ApiResponse} apiResponse
     * @return {IApiError}
     */
    makeError(e, apiResponse) {

        // Wrap only if regular error
        if (!e.hasOwnProperty('apiResponse') && !e.hasOwnProperty('originalMessage')) {

            e.apiResponse = apiResponse;
            e.originalMessage = e.message;
            e.message = (apiResponse && apiResponse.error(true)) || e.originalMessage;

        }

        return e;

    }

    /**
     *
     * @param {object} init
     * @param {object} [init.url]
     * @param {object} [init.body]
     * @param {string} [init.method]
     * @param {object} [init.query]
     * @param {object} [init.headers]
     * @return {Request}
     */
    createRequest(init) {

        init = init || {};
        init.headers = init.headers || {};

        // Sanity checks
        if (!init.url) throw new Error('Url is not defined');
        if (!init.method) init.method = 'GET';
        if (init.method && Client._allowedMethods.indexOf(init.method.toUpperCase()) < 0) {
            throw new Error('Method has wrong value: ' + init.method);
        }

        // Defaults
        init.credentials = init.credentials || 'include';
        init.mode = init.mode || 'cors';

        // Append Query String
        if (init.query) {
            init.url = init.url + (init.url.indexOf('?') > -1 ? '&' : '?') + queryStringify(init.query);
        }

        if (!(findHeaderName('Accept', init.headers))) {
            init.headers['Accept'] = ApiResponse._jsonContentType;
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
                init.body = JSON.stringify(init.body);
            } else if (contentType.indexOf(ApiResponse._urlencodedContentType) > -1) {
                init.body = queryStringify(init.body);
            }

        }
        
        // Batch request via PUT
        if (init.batch && init.method === 'PUT' && isArray(init.body)) {
          
          let boundry = 'Boundary_' + uuid();
          
          init.headers[ApiResponse._contentType] = `${ApiResponse._multipartContentType}; boundary=${boundry}`;
          
          init.body = init.body.reduce((body, item) => {

            item.headers = item.headers || {};
            
            var contentTypeHeaderName = findHeaderName(ApiResponse._contentType, item.headers);

            if (!contentTypeHeaderName) {
                contentTypeHeaderName = ApiResponse._contentType;
                item.headers[contentTypeHeaderName] = ApiResponse._jsonContentType;
            }

            var contentType = item.headers[contentTypeHeaderName];
            
            body += `--${boundry}\r\n`;
            
            if (contentType.indexOf(ApiResponse._jsonContentType) > -1) {
              body += `${ApiResponse._contentType}: ${ApiResponse._jsonContentType}\r\n\r\n`;
              body += `${JSON.stringify(item.body)}\r\n`;
            } else if (contentType.indexOf(ApiResponse._urlencodedContentType) > -1) {
              body += `${ApiResponse._contentType}: ${ApiResponse._urlencodedContentType}\r\n\r\n`;
              body += `${queryStringify(item.body)}\r\n`;
            }
            
            return body;
            
          }, '');
          
          init.body += `--${boundry}--`;
          
        }

        // Create a request with encoded body
        var req = new Request(init.url, init);

        // Keep the original body accessible directly (for mocks)
        req.originalBody = init.body;

        return req;

    }

}

export function findHeaderName(name, headers) {
    name = name.toLowerCase();
    return Object.keys(headers).reduce(function(res, key) {
        if (res) return res;
        if (name == key.toLowerCase()) return key;
        return res;
    }, null);
}

/**
 * @name IApiError
 * @property {string} stack
 * @property {string} originalMessage
 * @property {ApiResponse} apiResponse
 */