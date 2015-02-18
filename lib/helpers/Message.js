define(function(require, exports, module) {

    'use strict';

    var Helper = require('../core/Helper').Class,
        Validator = require('../core/Validator'),
        Utils = require('../core/Utils'),
        List = require('../core/List');

    /**
     * @extends Helper
     * @constructor
     */
    function MessageHelper(context) {
        Helper.call(this, context);
        this.platform = require('../core/Platform').$get(context);
        this.contact = require('./Contact').$get(context);
    }

    MessageHelper.prototype = Object.create(Helper.prototype);

    /**
     *
     * @param {IMessageOptions} [options]
     * @param {string} [id]
     * @returns {string}
     * @exceptionalCase Different endpoint when creating SMS/Pager
     */
    MessageHelper.prototype.createUrl = function(options, id) {

        options = options || {};

        var root = '/account/~/extension/' + (options.extensionId || '~');

        if (options.fax) return root + '/fax';
        if (options.sms) return root + '/sms';
        if (options.pager) return root + '/company-pager';
        if (options.sync) return root + '/message-sync';

        return root + '/message-store' + (id ? '/' + id : '');

    };

    MessageHelper.prototype.isInbound = function(message) {
        return (message && message.direction == 'Inbound');
    };

    MessageHelper.prototype.isOutbound = function(message) {
        return !this.isInbound(message);
    };

    MessageHelper.prototype.isSMS = function(message) {
        return (message && message.type == 'SMS');
    };

    MessageHelper.prototype.isPager = function(message) {
        return (message && message.type == 'Pager');
    };

    MessageHelper.prototype.isVoiceMail = function(message) {
        return (message && message.type == 'VoiceMail');
    };

    MessageHelper.prototype.isFax = function(message) {
        return (message && message.type == 'Fax');
    };

    MessageHelper.prototype.isAlive = function(message) {
        //return (this.availability != 'Deleted' && this.availability != 'Purged');
        return (message && message.availability == 'Alive');
    };

    MessageHelper.prototype.isRead = function(message) {
        return (message.readStatus == 'Read');
    };

    MessageHelper.prototype.setIsRead = function(message, isRead) {
        message.readStatus = (!!isRead) ? 'Read' : 'Unread';
        return message;
    };

    MessageHelper.prototype.getAttachmentUrl = function(message, i) {
        return message.attachments[i] ? this.platform.apiUrl(message.attachments[i].uri, {addMethod: 'GET', addServer: true, addToken: true}) : '';
    };

    MessageHelper.prototype.getAttachmentContentType = function(message, i) {
        return message.attachments[i] ? message.attachments[i].contentType : '';
    };

    /**
     * @returns {Subscription}
     */
    MessageHelper.prototype.getSubscription = function(options) {

        return (require('../core/Subscription').$get(this.context)).setEvents([this.createUrl(options)]);

    };

    /**
     * Returns from-phones if inbound (oterwise to-phones)
     * @returns {ICallerInfo[]}
     */
    MessageHelper.prototype.getCallerInfos = function(message) {
        return this.isInbound(message) ? [message.from] : message.to;
    };

    /**
     * Returns first from-phones if inbound (oterwise to-phones), then vice-versa
     * @returns {ICallerInfo[]}
     */
    MessageHelper.prototype.getAllCallerInfos = function(message) {
        return this.getCallerInfos(message).concat(this.isInbound(message) ? message.to : [message.from]);
    };

    /**
     * TODO Compare as dates
     * @param {IListComparatorOptions} [options]
     * @returns {function(object, object)}
     */
    MessageHelper.prototype.comparator = function(options) {

        return List.comparator(Utils.extend({
            sortBy: 'creationTime'
        }, options));

    };

    /**
     * @param {IMessageFilterOptions} [options]
     * @returns {function(IMessage)}
     */
    MessageHelper.prototype.filter = function(options) {

        options = Utils.extend({
            search: '',
            alive: true,
            direction: '',
            conversationId: '',
            readStatus: ''
        }, options);

        return List.filter([
            {condition: options.alive, filterFn: this.isAlive},
            {filterBy: 'type', condition: options.type},
            {filterBy: 'direction', condition: options.direction},
            {filterBy: 'conversationId', condition: options.conversationId},
            {filterBy: 'readStatus', condition: options.readStatus},
            {filterBy: 'subject', condition: options.search, filterFn: List.containsFilter}
        ]);

    };

    /**
     * Injects contact field with appropriate {IContact} data structure into all callerInfos found in all messages
     * Warning, this function may be performance-consuming, reduce the amount of items passed to contacts and messages
     * @param {IContact[]} contacts
     * @param {IMessage[]} messages
     * @param {IContactMatchOptions} [options]
     */
    MessageHelper.prototype.attachContacts = function(contacts, messages, options) {

        var self = this;

        // Flatten all caller infos from all messages
        var callerInfos = messages.reduce(function(callerInfos, message) {

            return callerInfos.concat(self.getAllCallerInfos(message));

        }, []);

        this.contact.attachToCallerInfos(callerInfos, contacts, options);

    };

    /**
     *
     * @param message
     * @returns {IMessageShort}
     */
    MessageHelper.prototype.shorten = function(message) {

        return {
            from: message.from,
            to: message.to,
            text: message.subject
        };

    };


    /**
     * @param {IMessage} item
     */
    MessageHelper.prototype.validateSMS = function(item) {

        return Validator.validate([
            {field: 'to', validator: Validator.required(Utils.getProperty(item, 'to[0].phoneNumber'))},
            {field: 'from', validator: Validator.required(Utils.getProperty(item, 'from.phoneNumber'))},
            {field: 'subject', validator: Validator.required(Utils.getProperty(item, 'subject'))},
            {field: 'subject', validator: Validator.length(Utils.getProperty(item, 'subject'), 160)}
        ]);

    };

    /**
     * @param {IMessage} item
     */
    MessageHelper.prototype.validatePager = function(item) {

        return Validator.validate([
            {field: 'to', validator: Validator.required(Utils.getProperty(item, 'to.extensionNumber'))},
            {field: 'from', validator: Validator.required(Utils.getProperty(item, 'from.extensionNumber'))},
            {field: 'subject', validator: Validator.required(Utils.getProperty(item, 'subject'))},
            {field: 'subject', validator: Validator.length(Utils.getProperty(item, 'subject'), 160)}
        ]);

    };

    module.exports = {
        Class: MessageHelper,
        /**
         * @param {Context} context
         * @returns {MessageHelper}
         */
        $get: function(context) {

            return context.createSingleton('MessageHelper', function() {
                return new MessageHelper(context);
            });

        }
    };

    /**
     * @typedef {object} IMessage
     * @property {string} id
     * @property {string} uri
     * @property {ICallerInfo[]} to
     * @property {ICallerInfo} from
     * @property {string} type
     * @property {string} creationTime
     * @property {string} readStatus
     * @property {string} priority
     * @property {IMessageAttachment} attachments
     * @property {string} direction
     * @property {string} availability
     * @property {string} subject
     * @property {string} messageStatus
     * @property {string} conversationId
     * @property {string} lastModifiedTime
     */

    /**
     * @typedef {object} IMessageShort
     * @property {ICallerInfo[]} to
     * @property {ICallerInfo} from
     * @property {string} text
     */

    /**
     * @typedef {object} IMessageOptions
     * @property {boolean} fax
     * @property {boolean} sync
     * @property {boolean} sms
     * @property {boolean} pager
     * @property {string} extensionId
     */

    /**
     * @typedef {object} IMessageFilterOptions
     * @property {boolean} alive
     * @property {string} conversationId
     * @property {string} direction
     * @property {string} readStatus
     * @property {string} type
     */

    /**
     * @typedef {object} IMessageFaxAttachment
     * @property {string} contentType
     * @property {string} content
     * @property {string} fileName
     */

    /**
     * @see http://platform-dev.dins.ru/artifacts/documentation/webhelp/dev_guide/content/ch18s01.html#MessageAttachmentInfo
     * @typedef {Object} IMessageAttachment
     * @property {string} id
     * @property {string} uri
     * @property {string} contentType
     * @property {string} vmDuration
     */

});
