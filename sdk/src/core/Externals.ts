const root = (typeof window !== "undefined" && window) ||
             (typeof global !== "undefined" && global) ||
             (function() { return this; })();

export interface ExternalsOptions {
    Promise?: typeof Promise,
    fetch?: typeof fetch,
    Request?: typeof Request,
    Response?: typeof Response,
    Headers?: typeof Headers,
    localStorage?: Storage
}

export default class Externals {

    Promise: any = root.Promise;
    fetch: typeof window.fetch = root.fetch;
    Request: any = root.Request;
    Response: any = root.Response;
    Headers: any = root.Headers;
    localStorage: Storage = ((typeof root.localStorage !== 'undefined') ? root.localStorage : {});

    constructor({Promise, fetch, Request, Response, Headers, localStorage}: ExternalsOptions = {}) {

        if (Promise) this.Promise = Promise;
        if (fetch) this.fetch = fetch;
        if (Request) this.Request = Request;
        if (Response) this.Response = Response;
        if (Headers) this.Headers = Headers;
        if (localStorage) this.localStorage = localStorage;

        /* istanbul ignore next */
        if (!this.fetch || !this.Response || !this.Request || !this.Headers) {
            throw new Error('Fetch API is missing');
        }

        /* istanbul ignore next */
        if (!this.Promise) {
            throw new Error('Promise is missing');
        }

        /* istanbul ignore next */
        if (!this.localStorage) {
            throw new Error('LocalStorage is missing');
        }

    }

}