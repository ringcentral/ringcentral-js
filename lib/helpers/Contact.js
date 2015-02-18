define(function(require, exports, module) {

    'use strict';

    var Utils = require('../core/Utils'),
        Validator = require('../core/Validator'),
        Helper = require('../core/Helper').Class,
        List = require('../core/List');

    /**
     * @extends Helper
     * @constructor
     */
    function ContactHelper(context) {
        Helper.call(this, context);
    }

    ContactHelper.prototype = Object.create(Helper.prototype);

    /**
     * @param {IContactOptions} [options]
     * @param {string} [id]
     * @returns {string}
     */
    ContactHelper.prototype.createUrl = function(options, id) {

        options = options || {};

        var root = '/account/~/extension/' +
                   (options.extensionId ? options.extensionId : '~') +
                   '/address-book';

        if (options.sync) return root + '-sync';

        return root +
               (options.groupId ? '/group/' + options.groupId + '/contact' : '/contact') +
               (id ? '/' + id : '');

    };

    /**
     * Returns all values of the given fields if value exists
     * @param {(IContact|object)} where
     * @param {Array} fields
     * @param {boolean} [asHash]
     * @protected
     * @returns {Object}
     */
    ContactHelper.prototype.getFieldValues = function(where, fields, asHash) {

        return fields.reduce(function(result, field) {

            if (where && where[field]) {
                if (asHash) {
                    result[field] = where[field];
                } else {
                    result.push(where[field]);
                }
            }

            return result;

        }, asHash ? {} : []);

    };

    /**
     * @param {IContact} contact
     * @returns {string}
     */
    ContactHelper.prototype.getFullName = function(contact) {
        return this.getFieldValues(contact, this.nameFields).join(' ');
    };

    /**
     * @param {IContact} contact
     * @param {boolean} [asHash]
     * @returns {IContact}
     */
    ContactHelper.prototype.getEmails = function(contact, asHash) {
        return this.getFieldValues(contact, this.emailFields, asHash);
    };

    /**
     * @param {IContact} contact
     * @param {boolean} [asHash]
     * @returns {IContact}
     */
    ContactHelper.prototype.getPhones = function(contact, asHash) {
        return this.getFieldValues(contact, this.phoneFields, asHash);
    };

    /**
     * @param {IContact} contact
     * @param {boolean} [asHash]
     * @returns {IContact}
     */
    ContactHelper.prototype.getFaxes = function(contact, asHash) {
        return this.getFieldValues(contact, this.faxFields, asHash);
    };

    /**
     * @param {IContact} contact
     * @param {boolean} [asHash]
     * @returns {IContact}
     */
    ContactHelper.prototype.getAddresses = function(contact, asHash) {
        return this.getFieldValues(contact, this.addressFields, asHash);
    };

    /**
     * @param {IContact} contact
     * @returns {boolean}
     */
    ContactHelper.prototype.isAlive = function(contact) {
        return (contact.availability == 'Alive');
    };

    /**
     * Matches a contact against a given string, returns null if nothing found
     * @param {IContact} contact
     * @param {string} string
     * @param {IContactMatchOptions} [options]
     * @returns {(string|null)}
     */
    ContactHelper.prototype.match = function(contact, string, options) {

        options = Utils.extend({
            fields: [].concat(this.nameFields, this.emailFields, this.phoneFields, this.faxFields, this.otherFields),
            inAddresses: true,
            transformFn: function(value, options) {
                return value ? value.toString().toLocaleLowerCase() : '';
            },
            strict: false
        }, options);

        string = options.transformFn(string, options);

        var found = null;

        if (!string) return found;

        function matchWith(value) {

            // skip unnecessary cycles if match has been found
            if (found) return;

            var transformed = options.transformFn(value, options);

            if (!transformed) return;

            var match = (options.strict ? transformed == string : transformed.indexOf(string) > -1);

            if (match) found = value;

        }

        // Search in fields
        options.fields.forEach(function(field) {
            matchWith(contact[field]);
        });

        // Search in addresses, skip unnecessary cycles if match has been found
        if (options.inAddresses && !found) this.addressFields.forEach(function(field) {

            // skip unnecessary cycles if match has been found or no field value
            if (!contact[field] || found) return;

            this.addressSubFields.forEach(function(subField) {
                matchWith(contact[field][subField]);
            });

        }, this);

        return found;

    };

    /**
     * Matches a contact against a given phone number, returns null if nothing found
     * @param {IContact} contact
     * @param {string} phone
     * @param {IContactMatchOptions} [options]
     * @returns {string|null}
     */
    ContactHelper.prototype.matchAsPhone = function(contact, phone, options) {

        return this.match(contact, phone, Utils.extend({
            fields: [].concat(this.phoneFields, this.faxFields),
            inAddresses: false,
            transformFn: function(value, options) {
                return value ? value.toString().replace(/[^\d\w]/ig, '') : ''; //TODO Trickier removal reqired;
            },
            strict: false
        }, options));

    };


    /**
     * Injects contact field with appropriate {IContact} data structure into all given {ICallerInfo}
     * Warning, this function may be performance-consuming, reduce the amount of items passed to contacts and callerInfos
     * @param {ICallerInfo[]} callerInfos
     * @param {IContact[]} contacts
     * @param {IContactMatchOptions} [options]
     */
    ContactHelper.prototype.attachToCallerInfos = function(callerInfos, contacts, options) {

        var self = this,
            callerInfoIndex = this.index(callerInfos, function(callerInfo) { return callerInfo.phoneNumber; }, true);

        Utils.forEach(callerInfoIndex, function(indexedCallerInfos, phoneNumber) {

            var foundContact = null,
                foundPhone = null;

            contacts.some(function(contact) {

                foundPhone = self.matchAsPhone(contact, phoneNumber, options);

                if (foundPhone) foundContact = contact;

                return foundPhone;

            });

            if (foundContact) {

                indexedCallerInfos.forEach(function(callerInfo) {
                    callerInfo.contact = foundContact;
                    callerInfo.contactPhone = foundPhone;
                });

            }

        });

    };

    /**
     * @param {IListComparatorOptions} [options]
     * @returns {function(object, object)}
     */
    ContactHelper.prototype.comparator = function(options) {

        var self = this;

        return List.comparator(Utils.extend({
            extractFn: function(contact, options) {
                return self.getFullName(contact);
            }
        }, options));

    };

    /**
     * TODO Add filtering by group http://jira.ringcentral.com/browse/SDK-4
     * @param {IContactOptions} [options]
     * @returns {function(IContact)}
     */
    ContactHelper.prototype.filter = function(options) {

        var self = this;

        options = Utils.extend({
            alive: true,
            startsWith: '',
            phonesOnly: false,
            faxesOnly: false
        }, options);

        return List.filter([
            {condition: options.alive, filterFn: this.isAlive},
            {condition: options.startsWith, filterFn: function(item, opts) { return self.match(item, opts.condition); }},
            {condition: options.phonesOnly, filterFn: function(item, opts) { return (self.getPhones(item).length > 0); }},
            {condition: options.faxesOnly, filterFn: function(item, opts) { return (self.getFaxes(item).length > 0); }}
        ]);

    };

    /**
     * @param {IContact} item
     */
    ContactHelper.prototype.validate = function(item) {

        return Validator.validate([
            {field: 'firstName', validator: Validator.required(item.firstName)},
            {field: 'lastName', validator: Validator.required(item.lastName)},
            {field: 'email', validator: Validator.email(item.email)},
            {field: 'email2', validator: Validator.email(item.email2)},
            {field: 'email3', validator: Validator.email(item.email3)}
        ]);

    };

    ContactHelper.prototype.phoneFields = [
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

    ContactHelper.prototype.faxFields = [
        'businessFax',
        'otherFax'
    ];

    ContactHelper.prototype.addressFields = [
        'homeAddress',
        'businessAddress',
        'otherAddress'
    ];

    ContactHelper.prototype.addressSubFields = [
        'street',
        'city',
        'state',
        'zip'
    ];

    ContactHelper.prototype.nameFields = [
        'firstName',
        'middleName',
        'lastName',
        'nickName'
    ];

    ContactHelper.prototype.otherFields = [
        'company',
        'jobTitle',
        'webPage',
        'notes'
    ];

    ContactHelper.prototype.emailFields = [
        'email',
        'email2',
        'email3'
    ];

    module.exports = {
        Class: ContactHelper,
        /**
         * @param {Context} context
         * @returns {ContactHelper}
         */
        $get: function(context) {

            return context.createSingleton('ContactHelper', function() {
                return new ContactHelper(context);
            });

        }
    };

    /**
     * @typedef {object} IContactOptions
     * @property {string} extensionId
     * @property {string} groupId
     */

    /**
     * @typedef {object} IContactFilterOptions
     * @property {string} startsWith
     * @property {boolean} alive
     */

    /**
     * @typedef {object} IContactMatchOptions
     * @property {function(object, IContactMatchOptions)} transformFn
     * @property {boolean} strict - if false look for as sub string
     * @property {boolean} inAddresses - look in addresses as well
     * @property {string[]} fields - in which fields to look for
     */

    /**
     * @see http://platform-dev.dins.ru/artifacts/documentation/webhelp/dev_guide/content/ch16s04.html#ContactAddressInfo
     * @typedef {Object} IContactAddress
     * @property {string} country
     * @property {string} street
     * @property {string} city
     * @property {string} state
     * @property {string} zip
     */

    /**
     * @see http://platform-dev.dins.ru/artifacts/documentation/latest/webhelp/dev_guide_advanced/ch18s04.html#ContactInfo
     * @typedef {Object} IContactBrief
     * @property {string} firstName
     * @property {string} lastName
     * @property {string} company
     * @property {string} email
     * @property {IContactAddress} businessAddress
     */

    /**
     * @see http://platform-dev.dins.ru/artifacts/documentation/webhelp/dev_guide/content/ch16s04.html#ContactInfo
     * @typedef {Object} IContact
     *
     * Shared:
     * @property {string} id
     * @property {string} uri
     *
     * Names:
     * @property {string} firstName
     * @property {string} lastName
     * @property {string} company
     * @property {string} nickName
     * @property {string} middleName
     *
     * Emails:
     * @property {string} email
     * @property {string} email2
     * @property {string} email3
     *
     * Addresses:
     * @property {IContactAddress} businessAddress
     * @property {IContactAddress} homeAddress
     * @property {IContactAddress} otherAddress
     *
     * Phones:
     * @property {string} homePhone
     * @property {string} homePhone2
     * @property {string} businessPhone
     * @property {string} businessPhone2
     * @property {string} mobilePhone
     * @property {string} companyPhone
     * @property {string} assistantPhone
     * @property {string} carPhone
     * @property {string} otherPhone
     * @property {string} callbackPhone
     *
     * @property {string} businessFax
     * @property {string} otherFax
     */

});
