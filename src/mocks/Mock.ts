/// <reference path="../externals.d.ts" />
/// <reference path="../core/Observable.ts" />

module RingCentral.sdk.mocks {

    export class Mock {

        protected _method:string;
        protected _path:string;
        protected _delay:number;
        protected _json:any;
        protected _status:number;
        protected _statusText:string;

        constructor(method:string, path:string, json?:any, status?:number, statusText?:string, delay?:number) {
            this._method = method.toUpperCase();
            this._path = path;
            this._json = json || {};
            this._delay = delay || 10;
            this._status = status || 200;
            this._statusText = statusText || 'OK';
        }

        path() {
            return this._path;
        }

        method() {
            return this._method;
        }

        test(request:Request) {

            return request.url.indexOf(this._path) > -1 &&
                   request.method.toUpperCase() == this._method;

        }

        getResponse(request:Request):Response|Promise<Response> {

            return new externals._Promise((resolve, reject) => {

                setTimeout(() => {

                    resolve(this.createResponse(this._json));

                }, this._delay);

            });

        }

        createResponse(json?:any, init?:ResponseInit|any) {

            init = init || {};

            init.status = init.status || this._status;
            init.statusText = init.statusText || this._statusText;

            var str = JSON.stringify(json),
                res = http.Client.createResponse(str, init);

            res.headers.set(http.ApiResponse.contentType, http.ApiResponse.jsonContentType);

            return res;

        }

    }

}