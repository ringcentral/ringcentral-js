/// <reference path="../../../typings/tsd.d.ts" />

import utils = require('../Utils');
import context = require('../Context');

export class Headers {

    protected headers:IHeadersObject;
    protected context:context.Context;
    protected utils:utils.Utils;

    constructor(context:context.Context) {
        this.headers = {};
        this.context = context;
        this.utils = utils.$get(context);
    }

    static contentType = 'Content-Type';
    static jsonContentType = 'application/json';
    static multipartContentType = 'multipart/mixed';
    static urlencodedContentType = 'application/x-www-form-urlencoded';

    setHeader(name:string, value:string) {

        this.headers[name.toLowerCase()] = value;

        return this;

    }

    getHeader(name:string) {

        return this.headers[name.toLowerCase()];

    }

    hasHeader(name:string):boolean {

        return (name.toLowerCase() in this.headers);

    }

    setHeaders(headers:IHeadersObject) {

        this.utils.forEach(headers, (value:string, name:string) => {
            this.setHeader(name, value);
        });

        return this;

    }

    isContentType(contentType:string):boolean {
        return this.getContentType().indexOf(contentType) > -1;
    }

    getContentType():string {
        return this.getHeader(Headers.contentType) || '';
    }

    isMultipart():boolean {
        return this.isContentType(Headers.multipartContentType);
    }

    isUrlEncoded():boolean {
        return this.isContentType(Headers.urlencodedContentType);
    }

    isJson():boolean {
        return this.isContentType(Headers.jsonContentType);
    }

}

export interface IHeadersObject {
    [name: string]: string;
}
