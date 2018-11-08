import EventEmitter from 'events';
import * as qs from 'querystring';
import isPlainObject from 'is-plain-object';
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
    response?: Response;
}

export interface ClientOptions {
    externals: Externals;
    defaultRequestInit: CreateRequestOptions;
}

export default class Client extends EventEmitter {
    static _contentType = 'Content-Type';

    static _jsonContentType = 'application/json';

    static _multipartContentType = 'multipart/mixed';

    static _urlencodedContentType = 'application/x-www-form-urlencoded';

    static _headerSeparator = ':';

    static _bodySeparator = '\n\n';

    static _boundarySeparator = '--';

    static _unauthorizedStatus = 401;

    static _rateLimitStatus = 429;

    static _allowedMethods = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS', 'HEAD'];

    static _defaultRequestInit: CreateRequestOptions = {
        credentials: 'include',
        mode: 'cors'
    };

    events = {
        beforeRequest: 'beforeRequest',
        requestSuccess: 'requestSuccess',
        requestError: 'requestError'
    };

    private _externals: Externals;

    private _defaultRequestInit: CreateRequestOptions = {};

    constructor({externals, defaultRequestInit = {}}: ClientOptions) {
        super();
        this._defaultRequestInit = defaultRequestInit;
        this._externals = externals;
    }

    async sendRequest(request: Request): Promise<Response> {
        let response;
        try {
            //TODO Stop request if listeners return false
            this.emit(this.events.beforeRequest, request);

            response = await this._loadResponse(request);

            if (!response.ok) throw new Error('Response has unsuccessful status');

            this.emit(this.events.requestSuccess, response);

            return response;
        } catch (e) {
            const error = !e.response ? await this.makeError(e, response, request) : e;

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
    async makeError(e: any, response: Response = null, request: Request = null): Promise<ApiError> {
        // Wrap only if regular error
        if (!e.response && !e.originalMessage) {
            e.response = response;
            e.request = request;
            e.originalMessage = e.message;
            e.message = (response && (await this.error(response, true))) || e.originalMessage;
        }

        return e;
    }

    createRequest(init: CreateRequestOptions = Client._defaultRequestInit): Request {
        init = {...this._defaultRequestInit, ...init};
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
            init.headers.Accept = Client._jsonContentType;
        }

        // Serialize body
        if (isPlainObject(init.body) || !init.body) {
            let contentTypeHeaderName = findHeaderName(Client._contentType, init.headers);

            if (!contentTypeHeaderName) {
                contentTypeHeaderName = Client._contentType;
                init.headers[contentTypeHeaderName] = Client._jsonContentType;
            }

            const contentType = init.headers[contentTypeHeaderName];

            // Assign a new encoded body
            if (contentType.indexOf(Client._jsonContentType) > -1) {
                if ((init.method === 'GET' || init.method === 'HEAD') && !!init.body) {
                    // oddly setting body to null still result in TypeError in phantomjs
                    init.body = undefined;
                } else {
                    init.body = JSON.stringify(init.body);
                }
            } else if (contentType.indexOf(Client._urlencodedContentType) > -1) {
                init.body = qs.stringify(init.body);
            }
        }

        // Create a request with encoded body
        const req = new this._externals.Request(init.url, init);

        // Keep the original body accessible directly (for mocks)
        req.originalBody = init.body;

        return req;
    }

    private _isContentType(contentType, response) {
        return !!~this.getContentType(response).indexOf(contentType);
    }

    getContentType(response) {
        return response.headers.get(Client._contentType) || '';
    }

    isMultipart(response) {
        return this._isContentType(Client._multipartContentType, response);
    }

    isJson(response) {
        return this._isContentType(Client._jsonContentType, response);
    }

    async toMultipart(response: Response): Promise<Response[]> {
        return this.isMultipart(response) ? this.multipart(response) : [response];
    }

    async multipart(response: Response): Promise<Response[]> {
        if (!this.isMultipart(response)) throw new Error('Response is not multipart');

        // Step 1. Split multipart response

        const text = await response.text();

        if (!text) throw new Error('No response body');

        let boundary;

        try {
            boundary = this.getContentType(response).match(/boundary=([^;]+)/i)[1]; //eslint-disable-line
        } catch (e) {
            throw new Error('Cannot find boundary');
        }

        if (!boundary) throw new Error('Cannot find boundary');

        const parts = text.toString().split(Client._boundarySeparator + boundary);

        if (parts[0].trim() === '') parts.shift();
        if (parts[parts.length - 1].trim() === Client._boundarySeparator) parts.pop();

        if (parts.length < 1) throw new Error('No parts in body');

        // Step 2. Parse status info

        const statusInfo = await this._create(parts.shift(), response.status, response.statusText).json();

        // Step 3. Parse all other parts

        return parts.map((part, i) => this._create(part, statusInfo.response[i].status));
    }

    /**
     * Method is used to create Response object from string parts of multipart/mixed response
     */
    private _create(text = '', status = 200, statusText = 'OK'): Response {
        text = text.replace(/\r/g, '');

        const headers = new this._externals.Headers();
        const headersAndBody = text.split(Client._bodySeparator);
        const headersText = headersAndBody.length > 1 ? headersAndBody.shift() : '';

        text = headersAndBody.length > 0 ? headersAndBody.join(Client._bodySeparator) : null;

        (headersText || '').split('\n').forEach(header => {
            const split = header.trim().split(Client._headerSeparator);
            const key = split.shift().trim();
            const value = split.join(Client._headerSeparator).trim();

            if (key) headers.append(key, value);
        });

        return new this._externals.Response(text, {
            headers,
            status,
            statusText
        });
    }

    async error(response: Response, skipOKCheck = false): Promise<string> {
        if (response.ok && !skipOKCheck) return null;

        let msg = (response.status ? `${response.status} ` : '') + (response.statusText ? response.statusText : '');

        try {
            const {message, error_description, description} = await response.clone().json();

            if (message) msg = message;
            if (error_description) msg = error_description;
            if (description) msg = description;
        } catch (e) {} //eslint-disable-line

        return msg;
    }
}

export interface CreateRequestOptions extends RequestInit {
    url?: string;
    body?: any;
    query?: any;
    headers?: any;
}
