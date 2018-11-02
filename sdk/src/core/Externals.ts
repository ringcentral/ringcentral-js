const root =
    (typeof window !== 'undefined' && window) ||
    (typeof global !== 'undefined' && global) ||
    (function getRoot() {
        return this;
    })();

export interface ExternalsOptions {
    fetch?: typeof fetch;
    Request?: typeof Request;
    Response?: typeof Response;
    Headers?: typeof Headers;
    localStorage?: Storage;
}

let storage = null;

const getStorage = () => {
    if (typeof root.localStorage !== 'undefined') return root.localStorage;
    if (storage) return storage;
    const DomStorage = require('dom-storage');
    storage = new DomStorage(null, {strict: true});
    return storage;
};

export default class Externals implements ExternalsOptions {
    fetch = root.fetch;
    Request = root.Request;
    Response = root.Response;
    Headers = root.Headers;
    localStorage = getStorage();

    constructor({
        fetch: fetchImpl,
        Request: RequestImpl,
        Response: ResponseImpl,
        Headers: HeadersImpl,
        localStorage
    }: ExternalsOptions = {}) {
        if (fetchImpl) this.fetch = fetchImpl;
        if (RequestImpl) this.Request = RequestImpl;
        if (ResponseImpl) this.Response = ResponseImpl;
        if (HeadersImpl) this.Headers = HeadersImpl;
        if (localStorage) this.localStorage = localStorage;

        /* istanbul ignore next */
        if (!this.fetch || !this.Response || !this.Request || !this.Headers) {
            throw new Error('Fetch API is missing');
        }

        /* istanbul ignore next */
        if (!this.localStorage) {
            throw new Error('LocalStorage is missing');
        }
    }
}
