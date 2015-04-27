var define = typeof define === 'function' && define.amd ? define : function (factory) {
    factory(require, exports, module);
};
define(function (require, exports, module) {
    var __extends = this.__extends || function (d, b) {
        for (var p in b)
            if (b.hasOwnProperty(p))
                d[p] = b[p];
        function __() {
            this.constructor = d;
        }
        __.prototype = b.prototype;
        d.prototype = new __();
    };
    var req = require('./Request');
    var MultipartRequest = function (_super) {
        __extends(MultipartRequest, _super);
        function MultipartRequest() {
            _super.apply(this, arguments);
            this.attachments = [];
        }
        MultipartRequest.prototype.addAttachment = function (attachment) {
            this.attachments.push(attachment);
            return this;
        };
        MultipartRequest.prototype.setBoundary = function (boundary) {
            this.boundary = boundary;
            return this;
        };
        MultipartRequest.prototype.createNodeMessage = function () {
            var _this = this;
            this.boundary = this.boundary || 'Boundary_' + Date.now();
            var messageParts = [];
            messageParts.push('--' + this.boundary + '\n');
            messageParts.push('Content-Type: application/json\n');
            messageParts.push('\n');
            messageParts.push(JSON.stringify(this.body) + '\n');
            this.attachments.forEach(function (attachment) {
                if (!attachment.contentType)
                    attachment.contentType = 'text/plain';
                messageParts.push('--' + _this.boundary + '\n');
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
            this.body = Buffer.concat(messageParts.map(function (msg) {
                return msg instanceof Buffer ? msg : new Buffer(msg, 'utf-8');
            }));
        };
        MultipartRequest.prototype.createBrowserMessage = function () {
            var formData = new FormData();
            formData.append('platform-json-payload', new File([JSON.stringify(this.body)], 'request.json', { type: 'application/json' }));
            this.attachments.forEach(function (attachment) {
                formData.append(attachment.name, attachment);
            });
            this.setContentType('');
            this.body = formData;
        };
        MultipartRequest.prototype.send = function () {
            if (typeof Buffer == 'function') {
                this.createNodeMessage();
            } else {
                this.createBrowserMessage();
            }
            return _super.prototype.send.call(this);
        };
        return MultipartRequest;
    }(req.Request);
    exports.MultipartRequest = MultipartRequest;
    function $get(context) {
        return new MultipartRequest(context);
    }
    exports.$get = $get;
});