/// <reference path="../../../typings/externals.d.ts" />

import utils = require('../Utils');
import context = require('../Context');

/**
 * @see https://github.com/Microsoft/TypeScript/issues/275
 */
export class Headers<T extends Headers<any>> {

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

    setHeader(name:string, value:string):T {

        this.headers[name.toLowerCase()] = value;

        return <any>this;

    }

    getHeader(name:string) {

        return this.headers[name.toLowerCase()];

    }

    hasHeader(name:string):boolean {

        return (name.toLowerCase() in this.headers);

    }

    setHeaders(headers:IHeadersObject):T {

        this.utils.forEach(headers, (value:string, name:string) => {
            this.setHeader(name, value);
        });

        return <any>this;

    }

    isContentType(contentType:string):boolean {
        return this.getContentType().indexOf(contentType) > -1;
    }

    setContentType(contentType:string):T {
        this.setHeader(Headers.contentType, contentType);
        return <any>this;
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
