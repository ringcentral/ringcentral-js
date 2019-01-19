import DomStorage from 'dom-storage';
import fetch, {Request, Response, Headers} from 'node-fetch';
import {setDefaultExternals} from './SDK';

export * from './SDK';

const localStorage = new DomStorage(null, {strict: true});

setDefaultExternals({
    localStorage,
    fetch,
    Request,
    Response,
    Headers,
});
