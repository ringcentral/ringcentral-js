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
    var helper = require('../core/Helper');
    var list = require('../core/List');
    var validator = require('../core/Validator');
    var subscription = require('../core/Subscription');
    var platform = require('../core/Platform');
    var contact = require('./Contact');
    var Message = function (_super) {
        __extends(Message, _super);
        function Message(context) {
            _super.call(this, context);
            this.contact = contact.$get(context);
            this.list = list.$get(context);
            this.platform = platform.$get(context);
            this.validator = validator.$get(context);
        }
        /**
     *
     * @exceptionalCase Different endpoint when creating SMS/Pager
     */
        Message.prototype.createUrl = function (options, id) {
            options = options || {};
            var root = '/account/~/extension/' + (options.extensionId || '~');
            if (options.fax)
                return root + '/fax';
            if (options.sms)
                return root + '/sms';
            if (options.pager)
                return root + '/company-pager';
            if (options.sync)
                return root + '/message-sync';
            return root + '/message-store' + (id ? '/' + id : '');
        };
        Message.prototype.isInbound = function (message) {
            return message && message.direction == 'Inbound';
        };
        Message.prototype.isOutbound = function (message) {
            return !this.isInbound(message);
        };
        Message.prototype.isSMS = function (message) {
            return message && message.type == 'SMS';
        };
        Message.prototype.isPager = function (message) {
            return message && message.type == 'Pager';
        };
        Message.prototype.isVoiceMail = function (message) {
            return message && message.type == 'VoiceMail';
        };
        Message.prototype.isFax = function (message) {
            return message && message.type == 'Fax';
        };
        Message.prototype.isAlive = function (message) {
            //return (this.availability != 'Deleted' && this.availability != 'Purged');
            return message && message.availability == 'Alive';
        };
        Message.prototype.isRead = function (message) {
            return message.readStatus == 'Read';
        };
        Message.prototype.setIsRead = function (message, isRead) {
            message.readStatus = !!isRead ? 'Read' : 'Unread';
            return message;
        };
        Message.prototype.getAttachmentUrl = function (message, i) {
            return message.attachments[i] ? this.platform.apiUrl(message.attachments[i].uri, {
                addMethod: 'GET',
                addServer: true,
                addToken: true
            }) : '';
        };
        Message.prototype.getAttachmentContentType = function (message, i) {
            return message.attachments[i] ? message.attachments[i].contentType : '';
        };
        Message.prototype.getSubscription = function (options) {
            return subscription.$get(this.context).setEvents([this.createUrl(options)]);
        };
        /**
     * Returns from-phones if inbound (oterwise to-phones)
     */
        Message.prototype.getCallerInfos = function (message) {
            return this.isInbound(message) ? [message.from] : message.to;
        };
        /**
     * Returns first from-phones if inbound (oterwise to-phones), then vice-versa
     */
        Message.prototype.getAllCallerInfos = function (message) {
            return this.getCallerInfos(message).concat(this.isInbound(message) ? message.to : [message.from]);
        };
        /**
     * TODO Compare as dates
     */
        Message.prototype.comparator = function (options) {
            return this.list.comparator(this.utils.extend({ sortBy: 'creationTime' }, options));
        };
        Message.prototype.filter = function (options) {
            options = this.utils.extend({
                search: '',
                alive: true,
                direction: '',
                conversationId: '',
                readStatus: ''
            }, options);
            return this.list.filter([
                {
                    condition: options.alive,
                    filterFn: this.isAlive
                },
                {
                    filterBy: 'type',
                    condition: options.type
                },
                {
                    filterBy: 'direction',
                    condition: options.direction
                },
                {
                    filterBy: 'conversationId',
                    condition: options.conversationId
                },
                {
                    filterBy: 'readStatus',
                    condition: options.readStatus
                },
                {
                    filterBy: 'subject',
                    condition: options.search,
                    filterFn: this.list.containsFilter
                }
            ]);
        };
        /**
     * Injects contact field with appropriate {IContact} data structure into all callerInfos found in all messages
     * Warning, this function may be performance-consuming, reduce the amount of items passed to contacts and messages
     */
        Message.prototype.attachContacts = function (contacts, messages, options) {
            var self = this;
            // Flatten all caller infos from all messages
            var callerInfos = messages.reduce(function (callerInfos, message) {
                return callerInfos.concat(self.getAllCallerInfos(message));
            }, []);
            this.contact.attachToCallerInfos(callerInfos, contacts, options);
        };
        Message.prototype.shorten = function (message) {
            return {
                from: message.from,
                to: message.to,
                text: message.subject
            };
        };
        Message.prototype.validateSMS = function (item) {
            return this.validator.validate([
                {
                    field: 'to',
                    validator: this.validator.required(this.utils.getProperty(item, 'to[0].phoneNumber'))
                },
                {
                    field: 'from',
                    validator: this.validator.required(this.utils.getProperty(item, 'from.phoneNumber'))
                },
                {
                    field: 'subject',
                    validator: this.validator.required(this.utils.getProperty(item, 'subject'))
                },
                {
                    field: 'subject',
                    validator: this.validator.length(this.utils.getProperty(item, 'subject'), 160)
                }
            ]);
        };
        Message.prototype.validatePager = function (item) {
            return this.validator.validate([
                {
                    field: 'to',
                    validator: this.validator.required(this.utils.getProperty(item, 'to.extensionNumber'))
                },
                {
                    field: 'from',
                    validator: this.validator.required(this.utils.getProperty(item, 'from.extensionNumber'))
                },
                {
                    field: 'subject',
                    validator: this.validator.required(this.utils.getProperty(item, 'subject'))
                },
                {
                    field: 'subject',
                    validator: this.validator.length(this.utils.getProperty(item, 'subject'), 160)
                }
            ]);
        };
        return Message;
    }(helper.Helper);
    exports.Message = Message;
    function $get(context) {
        return context.createSingleton('Message', function () {
            return new Message(context);
        });
    }
    exports.$get = $get;
});