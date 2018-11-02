import EventEmitter from 'events';
import * as qs from 'querystring';
import isPlainObject from 'is-plain-object';
import ApiResponse from './ApiResponse';
import Externals from '../core/Externals';

function findHeaderName(name, headers) {
    name = name.toLowerCase();
    return Object.keys(headers).reduce((res, key) => {
        if (res) return res;
        if (name === key.toLowerCase()) return key;
        return res;
    }, null);
}

export interface ApiError extends Error {
    originalMessage?: string;
    apiResponse?: ApiResponse;
}

export default class Client extends EventEmitter {
    static _allowedMethods = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS', 'HEAD'];

    events = {
        beforeRequest: 'beforeRequest',
        requestSuccess: 'requestSuccess',
        requestError: 'requestError'
    };

    private _externals: Externals;

    constructor(externals: Externals) {
        super();

        this._externals = externals;
    }

    async sendRequest(request: Request): Promise<ApiResponse> {
        let apiResponse;

        try {
            apiResponse = new ApiResponse({
                externals: this._externals,
                request
            });

            //TODO Stop request if listeners return false
            this.emit(this.events.beforeRequest, apiResponse);

            const response = await this._loadResponse(request);
            await apiResponse.receiveResponse(response);

            if (!apiResponse.ok()) throw new Error('Response has unsuccessful status');

            this.emit(this.events.requestSuccess, apiResponse);

            return apiResponse;
        } catch (e) {
            const error = !e.apiResponse ? this.makeError(e, apiResponse) : e;

            this.emit(this.events.requestError, error);

            throw error;
        }
    }

    async _loadResponse(request: Request): Promise<Response> {
        return this._externals.fetch.call(null, request); // fixed illegal invocation in Chrome
    }

    /**
     * Wraps the JS Error object with transaction information
     */
    makeError(e: any, apiResponse: ApiResponse = null): ApiError {
        // Wrap only if regular error
        if (!e.apiResponse && !e.originalMessage) {
            e.apiResponse = apiResponse;
            e.originalMessage = e.message;
            e.message = (apiResponse && apiResponse.error(true)) || e.originalMessage;
        }

        return e;
    }

    createRequest(init: CreateRequestOptions = {}): Request {
        init.headers = init.headers || {};

        // Sanity checks
        if (!init.url) throw new Error('Url is not defined');
        if (!init.method) init.method = 'GET';
        init.method = init.method.toUpperCase();
        if (init.method && Client._allowedMethods.indexOf(init.method) < 0) {
            throw new Error(`Method has wrong value: ${init.method}`);
        }

        // Defaults
        init.credentials = init.credentials || 'include';
        init.mode = init.mode || 'cors';

        // Append Query String
        if (init.query) {
            init.url = init.url + (init.url.indexOf('?') > -1 ? '&' : '?') + qs.stringify(init.query);
        }

        if (!findHeaderName('Accept', init.headers)) {
            init.headers.Accept = ApiResponse._jsonContentType;
        }

        // Serialize body
        if (isPlainObject(init.body) || !init.body) {
            let contentTypeHeaderName = findHeaderName(ApiResponse._contentType, init.headers);

            if (!contentTypeHeaderName) {
                contentTypeHeaderName = ApiResponse._contentType;
                init.headers[contentTypeHeaderName] = ApiResponse._jsonContentType;
            }

            const contentType = init.headers[contentTypeHeaderName];

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
        const req = new this._externals.Request(init.url, init);

        // Keep the original body accessible directly (for mocks)
        req.originalBody = init.body;

        return req;
    }
}

export interface CreateRequestOptions extends RequestInit {
    url?: string;
    body?: any;
    query?: any;
    headers?: any;
}
