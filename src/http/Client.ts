/// <reference path="../externals.d.ts" />
/// <reference path="../core/Utils.ts" />
/// <reference path="../core/Observable.ts" />
/// <reference path="../mocks/Registry.ts" />
/// <reference path="../externals/Externals.ts" />
/// <reference path="./ApiResponse.ts" />

module RingCentral.sdk.http {

    var allowedMethods = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS', 'HEAD'];

    export class Client extends core.Observable<Client> {

        public events = {
            beforeRequest: 'beforeRequest', // parameters: ajax
            requestSuccess: 'requestSuccess', // means that response was successfully fetched from server
            requestError: 'requestError' // means that request failed completely
        };

        sendRequest(request:Request):Promise<ApiResponse> {

            var res = new ApiResponse(request); //FIXME Potential leak

            return new externals._Promise((resolve) => {

                //TODO Stop request if listeners return false
                this.emit(this.events.beforeRequest, res);

                resolve(this._loadResponse(request));

            })
                .then((response:Response) => {

                    res['_response'] = Client.cloneResponse(response);

                    return response.text();

                })
                .then((text:string) => {

                    res['_text'] = text;

                    if (!res.ok()) throw Client.makeError(new Error('Response has unsuccessful status'), res);

                    this.emit(this.events.requestSuccess, res);

                    return res;

                })
                .catch((e:IApiError):any=> {

                    if (!e.apiResponse) {
                        // we don't pass response since most likely it's parsing caused an error
                        e = Client.makeError(e, res);
                    }

                    this.emit(this.events.requestError, e);

                    throw e;

                });

        }

        protected _loadResponse(request:Request):Promise<Response> {
            return externals._fetch.call(null, request);
        }

        /**
         * Wraps the JS Error object with transaction information
         * @param {Error} e
         * @param {ApiResponse} apiResponse
         * @return {IApiError}
         */
        static makeError(e:Error, apiResponse?:ApiResponse) {

            var error = <IApiError>e;

            // Wrap only if regular error
            if (!error.hasOwnProperty('apiResponse') && !error.hasOwnProperty('originalMessage')) {

                error.apiResponse = apiResponse;
                error.originalMessage = error.message;
                error.message = (apiResponse && apiResponse.error(true)) || error.originalMessage;

            }

            return error;

        }

        /**
         * TODO Wait for
         *   - https://github.com/github/fetch/issues/185
         *   - https://github.com/bitinn/node-fetch/issues/34
         * @param {Response} response
         * @return {Response}
         */
        static cloneResponse(response:Response):Response {

            if (core.utils.isFunction(response.clone)) return response.clone();

            var body = '';

            if (response.hasOwnProperty('_bodyInit')) body = response['_bodyInit'];
            if (response.hasOwnProperty('_bodyText')) body = response['_bodyText'];
            if (response.hasOwnProperty('_bodyBlob')) body = response['_bodyBlob'].slice();
            if (response.hasOwnProperty('_bodyFormData')) body = response['_bodyFormData'];

            if (response.hasOwnProperty('_raw')) body = response['_raw'].join('');

            var clone = new externals._Response(body, response);

            if (response.hasOwnProperty('body')) clone['body'] = response['body']; // accessing non-standard properties

            return clone;

        }

        /**
         * Creates a response
         * @param stringBody
         * @param init
         * @return {Response}
         */
        static createResponse(stringBody?:string, init?:ResponseInit):Response {

            init = init || <ResponseInit>{};

            return new externals._Response(stringBody, init);

        }

        static createRequest(input:string|Request, init?:IClientRequestInit) {

            init = init || {};

            var body = init.body;

            // Assign request with empty body, Github's fetch throws errors if it cannot recognize the body type
            var req = new externals._Request(input, core.utils.extend({}, init, {body: null}));

            if (!req.url) throw new Error('Url is not defined');
            if (!req.method) req.method = 'GET';
            if (req.method && allowedMethods.indexOf(req.method) < 0) throw new Error('Method has wrong value: ' + req.method);

            if (!req.headers.has('Accept')) req.headers.set('Accept', 'application/json');

            // Serialize body
            if (core.utils.isPlainObject(init.body) || !init.body) {

                if (!req.headers.has('Content-Type')) req.headers.set('Content-Type', 'application/json');

                var contentType = req.headers.get('Content-Type');

                if (contentType.indexOf('application/json') > -1) {

                    body = JSON.stringify(init.body);

                } else if (contentType.indexOf('application/x-www-form-urlencoded') > -1) {

                    body = core.utils.queryStringify(init.body);

                }

            }

            req.credentials = 'include';
            req.mode = 'cors';

            if (init.query) {
                req.url = req.url + (req.url.indexOf('?') > -1 ? '&' : '?') + core.utils.queryStringify(init.query);
            }

            // Create another request with encoded body
            req = new externals._Request(req.url, core.utils.extend(req, {body: body}));

            // Keep the original body accessible directly (for mocks)
            req.body = init.body;

            return req;

        }

    }

    export interface IApiError extends Error {
        stack?:string;
        originalMessage:string;
        apiResponse:ApiResponse;
    }

    export interface IClientRequestInit extends RequestInit {
        query?: string;
    }

}