// Type definitions for fetch API
// Project: https://github.com/github/fetch
// Definitions by: Ryan Graham <https://github.com/ryan-codingintrigue>
// Definitions: https://github.com/borisyankov/DefinitelyTyped

/// <reference path="../../typings/es6-promise/es6-promise.d.ts" />

declare class Request extends Body {
    constructor(input:string|Request, init?:RequestInit);

    method:string;
    url:string;
    headers:Headers;
    context:RequestContext;
    referrer:string;
    mode:RequestMode|string;
    credentials:RequestCredentials|string;
    cache:RequestCache|string;
    body:any;
}

interface RequestInit {
    method?: string;
    headers?: HeaderInit|{ [index: string]: string|any };
    body?: BodyInit;
    mode?: RequestMode|string;
    credentials?: RequestCredentials|string;
    cache?: RequestCache|string;
}

declare enum RequestContext {
    "audio", "beacon", "cspreport", "download", "embed", "eventsource", "favicon", "fetch",
    "font", "form", "frame", "hyperlink", "iframe", "image", "imageset", "import",
    "internal", "location", "manifest", "object", "ping", "plugin", "prefetch", "script",
    "serviceworker", "sharedworker", "subresource", "style", "track", "video", "worker",
    "xmlhttprequest", "xslt"
}
declare enum RequestMode { "same-origin", "no-cors", "cors" }
declare enum RequestCredentials { "omit", "same-origin", "include" }
declare enum RequestCache { "default", "no-store", "reload", "no-cache", "force-cache", "only-if-cached" }

declare class Headers {
    constructor(headers?:HeaderInit);

    append(name:string, value:string):void;

    delete(name:string):void;

    get(name:string):string;

    getAll(name:string):Array<string>;

    has(name:string):boolean;

    set(name:string, value:string):void;
}

declare class Body {
    bodyUsed:boolean;

    arrayBuffer():Promise<ArrayBuffer>;

    blob():Promise<Blob>;

    formData():Promise<FormData>;

    json():Promise<any>;

    text():Promise<string>;
}
declare class Response extends Body {
    constructor(body?:BodyInit|any, init?:ResponseInit);

    error():Response;

    redirect(url:string, status:number):Response;

    type:ResponseType;
    url:string;
    status:number;
    ok:boolean;
    statusText:string;
    headers:Headers;

    clone():Response;
}

declare enum ResponseType { "basic", "cors", "default", "error", "opaque" }

interface ResponseInit {
    status: number;
    statusText: string;
    headers: HeaderInit;
}

declare type HeaderInit = Headers|Array<string>|{ [index: string]: string|any };
declare type BodyInit = Blob|FormData|string|any;
declare type RequestInfo = Request|string;

declare type Fetch = (url:string|Request, init?:RequestInit) => Promise<Response>;
declare var fetch:Fetch;
