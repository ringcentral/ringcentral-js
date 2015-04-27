/// <reference path="../../../typings/externals.d.ts" />

import req = require('./Request');
import utils = require('../Utils');
import log = require('../Log');
import context = require('../Context');
import ajaxObserver = require('../AjaxObserver');
import r = require('./Response');

export class MultipartRequest extends req.Request {

    private attachments:IAttachment[] = [];
    private boundary:string;

    public addAttachment(attachment:IAttachment|File) {
        this.attachments.push(<IAttachment>attachment);
        return this;
    }

    public setBoundary(boundary:string) {
        this.boundary = boundary;
        return this;
    }

    public createNodeMessage() {

        this.boundary = this.boundary || 'Boundary_' + Date.now();

        var messageParts = [];

        messageParts.push('--' + this.boundary + '\n');
        messageParts.push('Content-Type: application/json\n');
        messageParts.push('\n');
        messageParts.push(JSON.stringify(this.body) + '\n');

        this.attachments.forEach((attachment:IAttachment) => {

            if (!attachment.contentType) attachment.contentType = 'text/plain';

            messageParts.push('--' + this.boundary + '\n');
            messageParts.push('Content-Type: ' + attachment.contentType + '\n');

            if (attachment.contentType != 'text/plain' || !!attachment.name) {
                messageParts.push('Content-Disposition: attachment; filename=' + (attachment.name || 'file.txt') + '\n');
            }

            messageParts.push('\n');

            messageParts.push(attachment.content || '');

            messageParts.push('\n');

        });

        messageParts.push('--' + this.boundary + '--');

        this.setContentType('multipart/mixed; boundary=' + this.boundary);

        this.body = Buffer.concat(messageParts.map((msg) => {
            return (msg instanceof Buffer) ? msg : new Buffer(msg, 'utf-8')
        }));

    }

    public createBrowserMessage() {

        var formData = new FormData();

        formData.append('platform-json-payload', new (<any>File)([JSON.stringify(this.body)], 'request.json', {type: 'application/json'}));

        this.attachments.forEach((attachment:IAttachment) => {
            formData.append(attachment.name, attachment);
        });

        this.setContentType('');

        this.body = formData;

    }

    public send():Promise<r.Response> {
        if (typeof Buffer == 'function') {
            this.createNodeMessage();
        } else {
            this.createBrowserMessage();
        }
        return super.send();
    }

}

export function $get(context:context.Context):MultipartRequest {
    return new MultipartRequest(context);
}

export interface IAttachment {
    name?:string;
    contentType?:string;
    content:string|Buffer;
}