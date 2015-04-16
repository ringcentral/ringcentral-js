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
    var validator = require('../core/Validator');
    var list = require('../core/List');
    var Contact = function (_super) {
        __extends(Contact, _super);
        function Contact(context) {
            _super.call(this, context);
            this.phoneFields = [
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
            this.faxFields = [
                'businessFax',
                'otherFax'
            ];
            this.addressFields = [
                'homeAddress',
                'businessAddress',
                'otherAddress'
            ];
            this.addressSubFields = [
                'street',
                'city',
                'state',
                'zip'
            ];
            this.nameFields = [
                'firstName',
                'middleName',
                'lastName',
                'nickName'
            ];
            this.otherFields = [
                'company',
                'jobTitle',
                'webPage',
                'notes'
            ];
            this.emailFields = [
                'email',
                'email2',
                'email3'
            ];
            this.list = list.$get(context);
            this.validator = validator.$get(context);
        }
        Contact.prototype.createUrl = function (options, id) {
            options = options || {};
            var root = '/account/~/extension/' + (options.extensionId ? options.extensionId : '~') + '/address-book';
            if (options.sync)
                return root + '-sync';
            return root + (options.groupId ? '/group/' + options.groupId + '/contact' : '/contact') + (id ? '/' + id : '');
        };
        /**
     * Returns all values of the given fields if value exists
     */
        Contact.prototype.getFieldValues = function (where, fields, asHash) {
            return fields.reduce(function (result, field) {
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
        Contact.prototype.getFullName = function (contact) {
            return this.getFieldValues(contact, this.nameFields).join(' ');
        };
        Contact.prototype.getEmails = function (contact, asHash) {
            return this.getFieldValues(contact, this.emailFields, asHash);
        };
        Contact.prototype.getPhones = function (contact, asHash) {
            return this.getFieldValues(contact, this.phoneFields, asHash);
        };
        Contact.prototype.getFaxes = function (contact, asHash) {
            return this.getFieldValues(contact, this.faxFields, asHash);
        };
        Contact.prototype.getAddresses = function (contact, asHash) {
            return this.getFieldValues(contact, this.addressFields, asHash);
        };
        Contact.prototype.isAlive = function (contact) {
            return contact.availability == 'Alive';
        };
        /**
     * Matches a contact against a given string, returns null if nothing found
     */
        Contact.prototype.match = function (contact, string, options) {
            var _this = this;
            options = this.utils.extend({
                fields: [].concat(this.nameFields, this.emailFields, this.phoneFields, this.faxFields, this.otherFields),
                inAddresses: true,
                transformFn: function (value, options) {
                    return value ? value.toString().toLocaleLowerCase() : '';
                },
                strict: false
            }, options);
            string = options.transformFn(string, options);
            var found = null;
            if (!string)
                return found;
            var matchWith = function (value) {
                // skip unnecessary cycles if match has been found
                if (found)
                    return;
                var transformed = options.transformFn(value, options);
                if (!transformed)
                    return;
                var match = options.strict ? transformed == string : transformed.indexOf(string) > -1;
                if (match)
                    found = value;
            };
            // Search in fields
            options.fields.forEach(function (field) {
                matchWith(contact[field]);
            });
            // Search in addresses, skip unnecessary cycles if match has been found
            if (options.inAddresses && !found)
                this.addressFields.forEach(function (field) {
                    // skip unnecessary cycles if match has been found or no field value
                    if (!contact[field] || found)
                        return;
                    _this.addressSubFields.forEach(function (subField) {
                        matchWith(contact[field][subField]);
                    });
                });
            return found;
        };
        /**
     * Matches a contact against a given phone number, returns null if nothing found
     */
        Contact.prototype.matchAsPhone = function (contact, phone, options) {
            return this.match(contact, phone, this.utils.extend({
                fields: [].concat(this.phoneFields, this.faxFields),
                inAddresses: false,
                transformFn: function (value, options) {
                    return value ? value.toString().replace(/[^\d\w]/gi, '') : '';    //TODO Trickier removal reqired;
                },
                strict: false
            }, options));
        };
        /**
     * Injects contact field with appropriate {IContact} data structure into all given {ICallerInfo}
     * Warning, this function may be performance-consuming, reduce the amount of items passed to contacts and callerInfos
     */
        Contact.prototype.attachToCallerInfos = function (callerInfos, contacts, options) {
            var self = this, callerInfoIndex = this.index(callerInfos, function (callerInfo) {
                    return callerInfo.phoneNumber;
                }, true);
            this.utils.forEach(callerInfoIndex, function (indexedCallerInfos, phoneNumber) {
                var foundContact = null, foundPhone = null;
                contacts.some(function (contact) {
                    foundPhone = self.matchAsPhone(contact, phoneNumber, options);
                    if (foundPhone)
                        foundContact = contact;
                    return foundPhone;
                });
                if (foundContact) {
                    indexedCallerInfos.forEach(function (callerInfo) {
                        callerInfo.contact = foundContact;
                        callerInfo.contactPhone = foundPhone;
                    });
                }
            });
        };
        Contact.prototype.comparator = function (options) {
            var _this = this;
            return this.list.comparator(this.utils.extend({
                extractFn: function (contact, options) {
                    return _this.getFullName(contact);
                }
            }, options));
        };
        /**
     * TODO Add filtering by group http://jira.ringcentral.com/browse/SDK-4
     */
        Contact.prototype.filter = function (options) {
            var _this = this;
            options = this.utils.extend({
                alive: true,
                startsWith: '',
                phonesOnly: false,
                faxesOnly: false
            }, options);
            return this.list.filter([
                {
                    condition: options.alive,
                    filterFn: this.isAlive
                },
                {
                    condition: options.startsWith,
                    filterFn: function (item, opts) {
                        return _this.match(item, opts.condition);
                    }
                },
                {
                    condition: options.phonesOnly,
                    filterFn: function (item, opts) {
                        return _this.getPhones(item).length > 0;
                    }
                },
                {
                    condition: options.faxesOnly,
                    filterFn: function (item, opts) {
                        return _this.getFaxes(item).length > 0;
                    }
                }
            ]);
        };
        Contact.prototype.validate = function (item) {
            return this.validator.validate([
                {
                    field: 'firstName',
                    validator: this.validator.required(item.firstName)
                },
                {
                    field: 'lastName',
                    validator: this.validator.required(item.lastName)
                },
                {
                    field: 'email',
                    validator: this.validator.email(item.email)
                },
                {
                    field: 'email2',
                    validator: this.validator.email(item.email2)
                },
                {
                    field: 'email3',
                    validator: this.validator.email(item.email3)
                }
            ]);
        };
        return Contact;
    }(helper.Helper);
    exports.Contact = Contact;
    function $get(context) {
        return context.createSingleton('Contact', function () {
            return new Contact(context);
        });
    }
    exports.$get = $get;
});