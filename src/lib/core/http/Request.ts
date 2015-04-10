/// <reference path="../../../typings/externals.d.ts" />

import h = require('./Headers');
import utils = require('../Utils');
import log = require('../Log');
import context = require('../Context');
import ajaxObserver = require('../AjaxObserver');
import r = require('./Response');

/**
 * TODO @see https://github.com/github/fetch/blob/master/fetch.js
 */
export class Request extends h.Headers<Request> {

    public async:boolean;
    public method:string;
    public url:string;
    public query:any;
    public body:any;
    public xhr:XMLHttpRequest;

    private observer:ajaxObserver.AjaxObserver;

    constructor(context:context.Context) {

        super(context);

        this.async = true;
        this.method = '';
        this.url = '';
        this.query = null;
        this.body = {};
        this.context = context;
        this.xhr = null;

        this.observer = ajaxObserver.$get(context);

    }

    isLoaded():boolean {
        return !!this.xhr;
    }

    setOptions(options?:IAjaxOptions):Request {

        options = options || {};

        // backwards compatibility
        if (!('body' in options) && options.post) options.body = options.post;
        if (!('query' in options) && options.get) options.query = options.get;

        if ('method' in options) this.method = options.method;
        if ('url' in options) this.url = options.url;
        if ('query' in options) this.query = options.query;
        if ('body' in options) this.body = options.body;
        if ('headers' in options) this.setHeaders(options.headers);
        if ('async' in options) this.async = !!options.async;

        return this;

    }

    /**
     * Checks the send options, defaulting various of the options,
     * and consuming / transforming some of the options (like get).
     */
    checkOptions() {

        if (!this.url) throw new Error('Url is not defined');

        if (!this.hasHeader('Accept')) this.setHeader('Accept', h.Headers.jsonContentType);
        if (!this.hasHeader('Content-Type')) this.setHeader('Content-Type', h.Headers.jsonContentType);

        this.method = this.method ? this.method.toUpperCase() : 'GET';

        if (['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS', 'HEAD'].indexOf(this.method) < 0) throw new Error('Method has wrong value');

        return this;

    }

    getEncodedBody() {

        if (this.method === 'GET') return null;

        if (typeof this.body === 'string') {
            return this.body;
        } else if (this.isJson()) {
            return JSON.stringify(this.body);
        } else if (this.isUrlEncoded()) {
            return this.utils.queryStringify(this.body);
        } else {
            return this.body;
        }

    }

    send():Promise<r.Response> {

        this.observer.emit(this.observer.events.beforeRequest, this);

        var responsePromise = new (this.context.getPromise())((resolve, reject) => {

            this.checkOptions();

            var xhr = this.getXHR(),
                url = this.url + (!!this.query ? ((this.url.indexOf('?') > -1 ? '&' : '?') + this.utils.queryStringify(this.query)) : '');

            xhr.open(this.method, url, this.async);

            //@see http://stackoverflow.com/questions/19666809/cors-withcredentials-support-limited
            xhr.withCredentials = true;

            xhr.onload = () => {

                //TODO http://jira.ringcentral.com/browse/PLA-10585
                var response = r.$get(this.context, xhr.status, xhr.statusText, xhr.responseText, xhr.getAllResponseHeaders());

                if (response.error) {
                    var e = <IAjaxError> response.error;
                    e.ajax = response; // backwards compatibility
                    e.response = response; //FIXME Circular
                    e.request = this;
                    reject(e);
                } else {
                    resolve(response);
                }

            };

            xhr.onerror = (event) => { // CORS or network issue
                var e = <IAjaxError> new Error('The request cannot be sent' + (event ? ' (' + event.toString() + ')' : ''));
                e.request = this;
                e.response = null;
                e.ajax = null; // backwards compatibility
                reject(e);
            };

            this.utils.forEach(this.headers, (value, header) => {
                if (!!value) xhr.setRequestHeader(header, value);
            });

            xhr.send(this.getEncodedBody());

            this.xhr = xhr;

        });

        return responsePromise.then((response:r.Response) => {

            this.observer.emit(this.observer.events.requestSuccess, response, this);

            return response;

        }).catch((e):any => { //TODO Replace any with something

            this.observer.emit(this.observer.events.requestError, e);

            throw e;

        });

    }

    getXHR():XMLHttpRequest {
        return this.context.getXHR();
    }

    destroy() {
        if (this.xhr) this.xhr.abort();
    }

}

export function $get(context:context.Context):Request {
    return new Request(context);
}

export interface IAjaxError extends Error {
    ajax?:r.Response;
    response?:r.Response;
    request?:Request;
}

export interface IAjaxOptions {
    url?:string;
    method?:string;
    async?:boolean;
    query?:any;
    body?:any;
    headers?:h.IHeadersObject;
    post?:any; // @deprecated
    get?:any; // @deprecated
}
