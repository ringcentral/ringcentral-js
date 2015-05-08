/// <reference path="../../../typings/externals.d.ts" />

import h = require('./Headers');
import utils = require('../Utils');
import log = require('../Log');
import context = require('../Context');

export class Response extends h.Headers<Response> {

    static boundarySeparator = '--';
    static headerSeparator = ':';
    static bodySeparator = '\n\n';

    public data:any;
    public json:any;
    public responses:Response[];
    public error:Error;
    public status:number;
    public statusText:string;
    public body:any;

    private log:log.Log;

    constructor(context:context.Context, status:number, statusText:string, body:any, headers?:any) {

        super(context);

        this.log = log.$get(context);

        if (typeof(body) === 'string') {

            body = body.replace(/\r/g, '');

            if (!headers) {

                var tmp = body.split(Response.bodySeparator);

                headers = (tmp.length > 1) ? tmp.shift() : {};
                body = tmp.join(Response.bodySeparator);

            }

        }

        /** @type {Response[]|object} */
        this.data = null;

        /** @type {object} */
        this.json = null;

        /** @type {Response[]} */
        this.responses = [];

        /** @type {Error} */
        this.error = null;

        //@see http://stackoverflow.com/questions/10046972/msie-returns-status-code-of-1223-for-ajax-request
        if (status == 1223) status = 204;

        this.status = status;
        this.statusText = statusText;
        this.body = body;

        try {

            // Step 1. Parse headers

            if (typeof(headers) === 'string') {

                (headers || '')
                    .split('\n')
                    .forEach((header:string) => {

                        if (!header) return;

                        var parts = <string[]>header.split(Response.headerSeparator),
                            name = parts.shift().trim();

                        this.setHeader(name, parts.join(Response.headerSeparator).trim());

                    });

            } else {

                this.setHeaders(headers);

            }

            // Step 1.1. JEDI proxy sometimes may omit Content-Type header

            if (!this.hasHeader(h.Headers.contentType)) this.setHeader(h.Headers.contentType, h.Headers.jsonContentType);

            // Step 2. Parse body

            if (this.isJson() && !!this.body && typeof(this.body) === 'string') { // Handle 204 No Content -- response may be empty

                this.json = JSON.parse(this.body);
                this.data = this.json; // backwards compatibility

                if (!this.checkStatus()) this.error = new Error(this.getError());

            } else if (this.isMultipart()) { // Handle 207 Multi-Status

                // Step 2.1. Split multipart response

                var boundary = this.getContentType().match(/boundary=([^;]+)/i)[1],
                    parts = this.body.split(Response.boundarySeparator + boundary);

                if (parts[0].trim() === '') parts.shift();
                if (parts[parts.length - 1].trim() == Response.boundarySeparator) parts.pop();

                // Step 2.2. Parse status info

                var statusInfo = new Response(this.context, this.status, '', parts.shift());

                // Step 2.3. Parse all other parts

                this.responses = parts.map((part:string, i) => {

                    var status = statusInfo.data.response[i].status;

                    return new Response(this.context, status, '', part);

                });

                this.data = this.responses; // backwards compatibility

            } else { //TODO Add more parsers

                this.data = this.body;

            }

        } catch (e) { // Capture parse errors

            this.log.error('Response.parseResponse(): Unable to parse data');
            this.log.error(e.stack || e);
            this.log.error(this.body);

            this.error = e;

        }

    }

    /**
     * @returns {boolean}
     */
    isUnauthorized() {
        return (this.status == 401);
    }

    checkStatus() {
        return this.status >= 200 && this.status < 300;
    }


    getError() {
        return this.data.message ||
               this.data.error_description ||
               this.data.description ||
               'Unknown error';
    }

}

export function $get(context:context.Context, status:number, statusText:string, body:any, headers?:any):Response {

    return new Response(context, status, statusText, body, headers);

}