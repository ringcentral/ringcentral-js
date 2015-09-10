/// <reference path="../externals.d.ts" />
/// <reference path="../core/Utils.ts" />
/// <reference path="../core/Observable.ts" />

module RingCentral.sdk.http {

    /**
     * @TODO Bring back tests
     */
    export class ApiResponse {

        static contentType = 'Content-Type';
        static jsonContentType = 'application/json';
        static multipartContentType = 'multipart/mixed';
        static urlencodedContentType = 'application/x-www-form-urlencoded';
        static headerSeparator = ':';
        static bodySeparator = '\n\n';
        static boundarySeparator = '--';

        protected _json:any;
        protected _text:string;
        protected _request:Request;
        protected _response:Response;
        protected _multipartTransactions:ApiResponse[];

        constructor(request?:Request, response?:Response, responseText?:string) {

            this._text = responseText;
            this._request = request;
            this._response = response;
            this._json = null;
            this._multipartTransactions = null;

        }

        response() {
            return this._response;
        }

        request() {
            return this._request;
        }

        ok() {
            return this._response && this._response.ok;
        }

        text() {
            return this._text;
        }

        json() {

            if (!this._isJson()) throw new Error('Response is not JSON');

            if (!this._json) {
                this._json = this._text ? JSON.parse(this._text) : null;
            }

            return this._json;

        }

        error(skipOKCheck?:boolean) {

            if (this.ok() && !skipOKCheck) return null;

            var message = (this._response && this._response.status ? this._response.status + ' ' : '') +
                          (this._response && this._response.statusText ? this._response.statusText : '');

            try {

                var json = this.json();

                if (json.message) message = json.message;
                if (json.error_description) message = json.error_description;
                if (json.description) message = json.description;

            } catch (ex) {}

            return message;

        }

        multipart():ApiResponse[] {

            if (!this._isMultipart()) throw new Error('Response is not multipart');

            if (null === this._multipartTransactions) {

                // Step 1. Split multipart response

                if (!this._text) throw new Error('No response body');

                var boundary = this._response.headers.get('Content-Type').match(/boundary=([^;]+)/i)[1];

                if (!boundary) throw new Error('Cannot find boundary');

                var parts = this._text.toString().split(ApiResponse.boundarySeparator + boundary);

                if (parts[0].trim() === '') parts.shift();
                if (parts[parts.length - 1].trim() == ApiResponse.boundarySeparator) parts.pop();

                if (parts.length < 1) throw new Error('No parts in body');

                // Step 2. Parse status info

                var statusInfo = ApiResponse.create(parts.shift(), this._response.status, this._response.statusText);

                // Step 3. Parse all other parts

                this._multipartTransactions = parts.map((part:string, i) => { //FIXME It will not work since parts contain both headers and body

                    var status = statusInfo.json().response[i].status;

                    return ApiResponse.create(part, status);

                });

            }

            return this._multipartTransactions;

        }

        /**
         * Short-hand method to get only JSON content of responses
         */
        multipartJson():any[] {

            return this.multipart().map((res)=> {
                return res.json();
            });

        }

        protected _isContentType(contentType:string):boolean {
            return this._getContentType().indexOf(contentType) > -1;
        }

        protected _getContentType():string {
            return this._response.headers.get(ApiResponse.contentType) || '';
        }

        protected _isMultipart():boolean {
            return this._isContentType(ApiResponse.multipartContentType);
        }

        protected _isUrlEncoded():boolean {
            return this._isContentType(ApiResponse.urlencodedContentType);
        }

        protected _isJson():boolean {
            return this._isContentType(ApiResponse.jsonContentType);
        }

        /**
         * Method is used to create Transaction objects from string parts of multipart/mixed response
         * @param text
         * @param status
         * @param statusText
         * @return {ApiResponse}
         */
        static create(text?:string, status?:number, statusText?:string):ApiResponse {

            status = status || 200;
            statusText = statusText || 'OK';

            text = text.replace(/\r/g, '');

            var headers = new externals._Headers(),
                headersAndBody = text.split(ApiResponse.bodySeparator),
                headersText = (headersAndBody.length > 1) ? headersAndBody.shift() : '';

            text = headersAndBody.join(ApiResponse.bodySeparator);

            (headersText || '')
                .split('\n')
                .forEach((header:string) => {

                    var split = header.trim().split(ApiResponse.headerSeparator),
                        key = split.shift().trim(),
                        value = split.join(ApiResponse.headerSeparator).trim();

                    if (key) headers.append(key, value);

                });

            return new ApiResponse(null, Client.createResponse(text, {
                headers: headers,
                status: status,
                statusText: statusText
            }), text);

        }

    }

}