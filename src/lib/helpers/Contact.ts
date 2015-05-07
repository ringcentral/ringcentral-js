/// <reference path="../../typings/externals.d.ts" />

import context = require('../core/Context');
import helper = require('../core/Helper');
import validator = require('../core/Validator');
import list = require('../core/List');
import call = require('./Call');

export class Contact extends helper.Helper {

    private list:list.List;
    private validator:validator.Validator;

    constructor(context:context.Context) {
        super(context);
        this.list = list.$get(context);
        this.validator = validator.$get(context);
    }

    createUrl(options?:IContactOptions, id?:string) {

        options = options || {};

        var root = '/account/~/extension/' +
                   (options.extensionId ? options.extensionId : '~') +
                   '/address-book';

        if (options.sync) return root + '-sync';

        return root +
               (options.groupId ? '/group/' + options.groupId + '/contact' : '/contact') +
               (id ? '/' + id : '');

    }

    /**
     * Returns all values of the given fields if value exists
     */
    protected getFieldValues(where:IContact, fields?:string[], asHash?:boolean):any {

        return fields.reduce((result:string[], field:string) => {

            if (where && where[field]) {
                if (asHash) {
                    result[field] = where[field];
                } else {
                    result.push(where[field]);
                }
            }

            return result;

        }, asHash ? {} : []);

    }

    getFullName(contact:IContact) {
        return this.getFieldValues(contact, this.nameFields).join(' ');
    }

    getEmails(contact:IContact, asHash?:boolean):string[] {
        return this.getFieldValues(contact, this.emailFields, asHash);
    }

    getPhones(contact:IContact, asHash?:boolean):string[] {
        return this.getFieldValues(contact, this.phoneFields, asHash);
    }

    getFaxes(contact:IContact, asHash?:boolean):string[] {
        return this.getFieldValues(contact, this.faxFields, asHash);
    }

    getAddresses(contact:IContact, asHash?:boolean):IContactAddress[] {
        return this.getFieldValues(contact, this.addressFields, asHash);
    }

    isAlive(contact:IContact) {
        return (contact.availability == 'Alive');
    }

    /**
     * Matches a contact against a given string, returns null if nothing found
     */
    match(contact:IContact, string:string, options?:IContactMatchOptions):any {

        options = this.utils.extend({
            fields: [].concat(this.nameFields, this.emailFields, this.phoneFields, this.faxFields, this.otherFields),
            inAddresses: true,
            transformFn: (value, options) => {
                return value ? value.toString().toLocaleLowerCase() : '';
            },
            strict: false
        }, options);

        string = options.transformFn(string, options);

        var found = null;

        if (!string) return found;

        var matchWith = (value) => {

            // skip unnecessary cycles if match has been found
            if (found) return;

            var transformed = options.transformFn(value, options);

            if (!transformed) return;

            var match = (options.strict ? transformed == string : transformed.indexOf(string) > -1);

            if (match) found = value;

        };

        // Search in fields
        options.fields.forEach((field) => {
            matchWith(contact[field]);
        });

        // Search in addresses, skip unnecessary cycles if match has been found
        if (options.inAddresses && !found) this.addressFields.forEach((field) => {

            // skip unnecessary cycles if match has been found or no field value
            if (!contact[field] || found) return;

            this.addressSubFields.forEach((subField) => {
                matchWith(contact[field][subField]);
            });

        });

        return found;

    }

    /**
     * Matches a contact against a given phone number, returns null if nothing found
     */
    matchAsPhone(contact:IContact, phone:string, options?:IContactMatchOptions) {

        return this.match(contact, phone, this.utils.extend({
            fields: [].concat(this.phoneFields, this.faxFields),
            inAddresses: false,
            transformFn: (value, options) => {
                return value ? value.toString().replace(/[^\d\w]/ig, '') : ''; //TODO Trickier removal reqired;
            },
            strict: false
        }, options));

    }


    /**
     * Injects contact field with appropriate {IContact} data structure into all given {ICallerInfo}
     * Warning, this function may be performance-consuming, reduce the amount of items passed to contacts and callerInfos
     */
    attachToCallerInfos(callerInfos:call.ICallerInfo[], contacts:IContact[], options?:IContactMatchOptions) {

        var self = this,
            callerInfoIndex = this.index(callerInfos, (callerInfo:call.ICallerInfo) => {
                return callerInfo.phoneNumber;
            }, true);

        this.utils.forEach(callerInfoIndex, (indexedCallerInfos, phoneNumber) => {

            var foundContact:IContact = null,
                foundPhone = null;

            contacts.some((contact:IContact) => {

                foundPhone = self.matchAsPhone(contact, phoneNumber, options);

                if (foundPhone) foundContact = contact;

                return foundPhone;

            });

            if (foundContact) {

                indexedCallerInfos.forEach((callerInfo:call.ICallerInfo) => {
                    callerInfo.contact = foundContact;
                    callerInfo.contactPhone = foundPhone;
                });

            }

        });

    }

    comparator(options?:list.IListComparatorOptions) {

        return this.list.comparator(this.utils.extend({
            extractFn: (contact:IContact, options) => {
                return this.getFullName(contact);
            }
        }, options));

    }

    /**
     * TODO Add filtering by group http://jira.ringcentral.com/browse/SDK-4
     */
    filter(options?:IContactFilterOptions) {

        options = this.utils.extend({
            alive: true,
            startsWith: '',
            phonesOnly: false,
            faxesOnly: false
        }, options);

        return this.list.filter([
            {condition: options.alive, filterFn: this.isAlive},
            {condition: options.startsWith, filterFn: (item, opts) => { return this.match(item, opts.condition); }},
            {condition: options.phonesOnly, filterFn: (item, opts) => { return (this.getPhones(item).length > 0); }},
            {condition: options.faxesOnly, filterFn: (item, opts) => { return (this.getFaxes(item).length > 0); }}
        ]);

    }

    validate(item:IContact) {

        return this.validator.validate([
            {field: 'firstName', validator: this.validator.required(item.firstName)},
            {field: 'lastName', validator: this.validator.required(item.lastName)},
            {field: 'email', validator: this.validator.email(item.email)},
            {field: 'email2', validator: this.validator.email(item.email2)},
            {field: 'email3', validator: this.validator.email(item.email3)}
        ]);

    }

    phoneFields = [
        'homePhone',
        'homePhone2',
        'businessPhone',
        'businessPhone2',
        'mobilePhone',
        'companyPhone',
        'assistantPhone',
        'carPhone',
        'otherPhone',
        'callbackPhone'
    ];

    faxFields = [
        'businessFax',
        'otherFax'
    ];

    addressFields = [
        'homeAddress',
        'businessAddress',
        'otherAddress'
    ];

    addressSubFields = [
        'street',
        'city',
        'state',
        'zip'
    ];

    nameFields = [
        'firstName',
        'middleName',
        'lastName',
        'nickName'
    ];

    otherFields = [
        'company',
        'jobTitle',
        'webPage',
        'notes'
    ];

    emailFields = [
        'email',
        'email2',
        'email3'
    ];


}

export function $get(context:context.Context):Contact {
    return context.createSingleton('Contact', ()=> {
        return new Contact(context);
    });
}

export interface IContactOptions {
    extensionId?:string;
    groupId?:string;
    sync?:boolean;
}

export interface IContactFilterOptions {
    startsWith?:string;
    alive?:boolean;
    phonesOnly?:boolean;
    faxesOnly?:boolean;
}

export interface IContactMatchOptions {
    transformFn?:(object:IContact, options?:IContactMatchOptions)=>any;
    strict?:boolean;
    inAddresses?:boolean;
    fields?:string[];
}

/**
 * @see http://platform-dev.dins.ru/artifacts/documentation/webhelp/dev_guide/content/ch16s04.html#ContactAddressInfo
 */
export interface IContactAddress {
    country?:string;
    street?:string;
    city?:string;
    state?:string;
    zip?:string;
}

/**
 * @see http://platform-dev.dins.ru/artifacts/documentation/latest/webhelp/dev_guide_advanced/ch18s04.html#ContactInfo
 */
export interface IContactBrief {
    firstName?:string;
    lastName?:string;
    company?:string;
    email?:string;
    businessAddress?:IContactAddress;
}

/**
 * @see http://platform-dev.dins.ru/artifacts/documentation/webhelp/dev_guide/content/ch16s04.html#ContactInfo
 */
export interface IContact extends helper.IHelperObject {
    availability?:string;

    // Names:
    firstName?:string;
    lastName?:string;
    company?:string;
    nickName?:string;
    middleName?:string;

    // Emails:
    email?:string;
    email2?:string;
    email3?:string;

    // Addresses:
    businessAddress?:IContactAddress;
    homeAddress?:IContactAddress;
    otherAddress?:IContactAddress;

    // Phones:
    homePhone?:string;
    homePhone2?:string;
    businessPhone?:string;
    businessPhone2?:string;
    mobilePhone?:string;
    companyPhone?:string;
    assistantPhone?:string;
    carPhone?:string;
    otherPhone?:string;
    callbackPhone?:string;

    // Faxes:
    businessFax?:string;
    otherFax?:string;

}