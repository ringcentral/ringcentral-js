/// <reference path="../../typings/externals.d.ts" />

import context = require('../core/Context');
import helper = require('../core/Helper');
import list = require('../core/List');
import validator = require('../core/Validator');
import subscription = require('../core/Subscription');
import platform = require('../core/Platform');
import contact = require('./Contact');
import call = require('./Call');

export class Message extends helper.Helper {

    private list:list.List;
    private contact:contact.Contact;
    private platform:platform.Platform;
    private validator:validator.Validator;

    constructor(context:context.Context) {
        super(context);
        this.contact = contact.$get(context);
        this.list = list.$get(context);
        this.platform = platform.$get(context);
        this.validator = validator.$get(context);
    }

    /**
     *
     * @exceptionalCase Different endpoint when creating SMS/Pager
     */
    createUrl(options?:IMessageOptions, id?:string|number) {

        options = options || {};

        var root = '/account/~/extension/' + (options.extensionId || '~');

        if (options.fax) return root + '/fax';
        if (options.sms) return root + '/sms';
        if (options.pager) return root + '/company-pager';
        if (options.sync) return root + '/message-sync';

        return root + '/message-store' + (id ? '/' + id : '');

    }

    isInbound(message):IMessage {
        return (message && message.direction == 'Inbound');
    }

    isOutbound(message):IMessage {
        return !this.isInbound(message);
    }

    isSMS(message:IMessage) {
        return (message && message.type == 'SMS');
    }

    isPager(message:IMessage):IMessage {
        return (message && message.type == 'Pager');
    }

    isVoiceMail(message:IMessage) {
        return (message && message.type == 'VoiceMail');
    }

    isFax(message:IMessage) {
        return (message && message.type == 'Fax');
    }

    isAlive(message:IMessage) {
        //return (this.availability != 'Deleted' && this.availability != 'Purged');
        return (message && message.availability == 'Alive');
    }

    isRead(message:IMessage) {
        return (message.readStatus == 'Read');
    }

    setIsRead(message:IMessage, isRead:boolean):IMessage {
        message.readStatus = (!!isRead) ? 'Read' : 'Unread';
        return message;
    }

    getAttachmentUrl(message:IMessage, i:number) {
        return message.attachments[i] ? this.platform.apiUrl(message.attachments[i].uri, {
            addMethod: 'GET',
            addServer: true,
            addToken: true
        }) : '';
    }

    getAttachmentContentType(message:IMessage, i:number) {
        return message.attachments[i] ? message.attachments[i].contentType : '';
    }

    getSubscription(options?:IMessageOptions):subscription.Subscription {

        return subscription.$get(this.context).setEvents([this.createUrl(options)]);

    }

    /**
     * Returns from-phones if inbound (oterwise to-phones)
     */
    getCallerInfos(message:IMessage):call.ICallerInfo[] {
        return this.isInbound(message) ? [message.from] : message.to;
    }

    /**
     * Returns first from-phones if inbound (oterwise to-phones), then vice-versa
     */
    getAllCallerInfos(message:IMessage):call.ICallerInfo[] {
        return this.getCallerInfos(message).concat(this.isInbound(message) ? message.to : [message.from]);
    }

    /**
     * TODO Compare as dates
     */
    comparator(options?:list.IListComparatorOptions) {

        return this.list.comparator(this.utils.extend({
            sortBy: 'creationTime'
        }, options));

    }

    filter(options?:IMessageFilterOptions) {

        options = this.utils.extend({
            search: '',
            alive: true,
            direction: '',
            conversationId: '',
            readStatus: ''
        }, options);

        return this.list.filter([
            {condition: options.alive, filterFn: this.isAlive},
            {filterBy: 'type', condition: options.type},
            {filterBy: 'direction', condition: options.direction},
            {filterBy: 'conversationId', condition: options.conversationId},
            {filterBy: 'readStatus', condition: options.readStatus},
            {filterBy: 'subject', condition: options.search, filterFn: this.list.containsFilter}
        ]);

    }

    /**
     * Injects contact field with appropriate {IContact} data structure into all callerInfos found in all messages
     * Warning, this function may be performance-consuming, reduce the amount of items passed to contacts and messages
     */
    attachContacts(contacts:contact.IContact[], messages:IMessage[], options?:contact.IContactMatchOptions) {

        var self = this;

        // Flatten all caller infos from all messages
        var callerInfos = messages.reduce((callerInfos, message) => {

            return callerInfos.concat(self.getAllCallerInfos(message));

        }, []);

        this.contact.attachToCallerInfos(callerInfos, contacts, options);

    }

    shorten(message:IMessage):IMessageShort {

        return {
            from: message.from,
            to: message.to,
            text: message.subject
        };

    }

    validateSMS(item:IMessage) {

        return this.validator.validate([
            {field: 'to', validator: this.validator.required(this.utils.getProperty(item, 'to[0].phoneNumber'))},
            {field: 'from', validator: this.validator.required(this.utils.getProperty(item, 'from.phoneNumber'))},
            {field: 'subject', validator: this.validator.required(this.utils.getProperty(item, 'subject'))},
            {field: 'subject', validator: this.validator.length(this.utils.getProperty(item, 'subject'), 160)}
        ]);

    }

    validatePager(item:IMessage) {

        return this.validator.validate([
            {field: 'to', validator: this.validator.required(this.utils.getProperty(item, 'to.extensionNumber'))},
            {field: 'from', validator: this.validator.required(this.utils.getProperty(item, 'from.extensionNumber'))},
            {field: 'subject', validator: this.validator.required(this.utils.getProperty(item, 'subject'))},
            {field: 'subject', validator: this.validator.length(this.utils.getProperty(item, 'subject'), 160)}
        ]);

    }

}

export function $get(context:context.Context):Message {
    return context.createSingleton('Message', ()=> {
        return new Message(context);
    });
}

export interface IMessage extends helper.IHelperObject {
    to?:call.ICallerInfo[];
    from?:call.ICallerInfo;
    type?:string;
    creationTime?:string;
    readStatus?:string;
    priority?:string;
    attachments?:IMessageAttachment[];
    direction?:string;
    availability?:string;
    subject?:string;
    messageStatus?:string;
    conversationId?:string;
    lastModifiedTime?:string;
}

export interface IMessageShort {
    to?:call.ICallerInfo[];
    from?:call.ICallerInfo;
    text?:string;
}

export interface IMessageOptions {
    fax?:boolean;
    sync?:boolean;
    sms?:boolean;
    pager?:boolean;
    extensionId?:string;
}

export interface IMessageFilterOptions {
    alive?:boolean;
    conversationId?:string;
    direction?:string;
    readStatus?:string;
    type?:string;
    search?:string;
}

/**
 * @see http://platform-dev.dins.ru/artifacts/documentation/webhelp/dev_guide/content/ch18s01.html#MessageAttachmentInfo
 */
export interface IMessageFaxAttachment extends helper.IHelperObject {
    contentType?:string;
    content?:string;
    fileName?:string;
}
/**
 * @see http://platform-dev.dins.ru/artifacts/documentation/webhelp/dev_guide/content/ch18s01.html#MessageAttachmentInfo
 */
export interface IMessageAttachment extends helper.IHelperObject {
    contentType?:string;
    vmDuration?:string;
}