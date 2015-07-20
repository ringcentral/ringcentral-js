import context = require('../Context');
import utils = require('../Utils');
import log = require('../Log');
import xhrResponse = require('./XhrResponse'); //FIXME Circular

export class XhrMock {

    // Service
    private context:context.Context;
    private log:log.Log;
    private utils:utils.Utils;
    private responses:xhrResponse.XhrResponse;

    // Request
    public async:boolean;
    public method:string;
    public url:string;
    public requestHeaders:any;
    public withCredentials:boolean;
    public onload:()=>any;
    public onerror:(e:Error)=>any;

    // Response
    public data:any;
    public readyState:number;
    public responseHeaders:any;
    public responseText:string;
    public status:number;

    constructor(context:context.Context) {

        // Service
        this.context = context;
        this.responses = xhrResponse.$get(context);
        this.log = log.$get(context);
        this.utils = utils.$get(context);

        // Request
        this.async = true;
        this.method = '';
        this.url = '';
        this.requestHeaders = {};
        this.withCredentials = false;

        // Response
        this.data = null;
        this.readyState = 0;
        this.responseHeaders = {};
        this.status = 0;

    }

    getResponseHeader(header:string) {
        return this.responseHeaders[header.toLowerCase()];
    }

    setRequestHeader(header:string, value:string) {
        this.requestHeaders[header.toLowerCase()] = value;
    }

    getAllResponseHeaders() {
        var res = [];
        this.utils.forEach(this.responseHeaders, (value:string, name:string) => {
            res.push(name + ':' + value);
        });
        return res.join('\n');
    }

    open(method:string, url:string, async?:boolean) {
        this.method = method;
        this.url = url;
        this.async = async;
    }

    send(data:any) {

        var contentType = this.getRequestHeader('Content-Type');

        this.data = data;

        if (this.data && typeof this.data == 'string') {
            // For convenience encoded post data will be decoded
            if (contentType == 'application/json') this.data = JSON.parse(this.data);
            if (contentType == 'application/x-www-form-urlencoded') this.data = this.utils.parseQueryString(this.data);
        }

        this.log.debug('API REQUEST', this.method, this.url);

        var currentResponse = this.responses.find(this);

        if (!currentResponse) {
            setTimeout(() => {
                if (this.onerror) this.onerror(new Error('Unknown request: ' + this.url));
            }, 1);
            return;
        }

        this.setStatus(200);
        this.setResponseHeader('Content-Type', 'application/json');

        var res = currentResponse.response(this),
            Promise = this.context.getPromise(),
            onLoad = (res) => {

                if (this.getResponseHeader('Content-Type') == 'application/json') res = JSON.stringify(res);

                this.responseText = res;

                setTimeout(() => {
                    if (this.onload) this.onload();
                }, 1);

            };

        if (res instanceof Promise) {

            res.then(onLoad.bind(this)).catch(this.onerror.bind(this));

        } else onLoad(res);

    }

    abort() {
        this.log.debug('XhrMock.destroy(): Aborted');
    }

    getRequestHeader(header:string) {
        return this.requestHeaders[header.toLowerCase()];
    }

    setResponseHeader(header:string, value:string) {
        this.responseHeaders[header.toLowerCase()] = value;
    }

    setStatus(status) {
        this.status = status;
        return this;
    }

}

export function $get(context:context.Context):XhrMock {
    return new XhrMock(context);
}