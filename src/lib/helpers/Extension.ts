/// <reference path="../../typings/externals.d.ts" />

import context = require('../core/Context');
import helper = require('../core/Helper');
import list = require('../core/List');
import contact = require('./Contact');
import service = require('./Service');
import country = require('./Country');
import timezone = require('./Timezone');
import language = require('./Language');
import presence = require('./Presence');

export class Extension extends helper.Helper {

    private list:list.List;

    type = {
        department: 'Department',
        user: 'User',
        announcement: 'Announcement',
        voicemail: 'Voicemail'
    };

    constructor(context:context.Context) {
        super(context);
        this.list = list.$get(context);
    }

    createUrl(options?:IExtensionOptions, id?:string) {

        options = options || {};

        return '/account/~' +
               (options.departmentId ? '/department/' + options.departmentId + '/members' : '/extension') +
               (id ? '/' + id : '');

    }

    isUser(extension?:IExtension) {
        return extension && extension.type == this.type.user;
    }

    isDepartment(extension?:IExtension) {
        return extension && extension.type == this.type.department;
    }

    isAnnouncement(extension?:IExtension) {
        return extension && extension.type == this.type.announcement;
    }

    isVoicemail(extension?:IExtension) {
        return extension && extension.type == this.type.voicemail;
    }

    comparator(options?:list.IListComparatorOptions) {

        return this.list.comparator(this.utils.extend({
            sortBy: 'extensionNumber',
            compareFn: this.list.numberComparator
        }, options));

    }

    filter(options?:IExtensionFilterOptions) {

        options = this.utils.extend({
            search: '',
            type: ''
        }, options);

        return this.list.filter([
            {filterBy: 'type', condition: options.type},
            {
                condition: options.search.toLocaleLowerCase(),
                filterFn: this.list.containsFilter,
                extractFn: (item) => {
                    return (item.name && (item.name.toLocaleLowerCase() + ' ')) +
                           (item.extensionNumber && item.extensionNumber.toString().toLocaleLowerCase());
                }
            }
        ]);

    }

}

export function $get(context:context.Context):Extension {
    return context.createSingleton('Extension', ()=> {
        return new Extension(context);
    });
}

export interface IExtensionOptions {
    departmentId?:string;
}

export interface IExtensionFilterOptions {
    search?:string;
    type?:string;
}

export interface IExtensionRegionalSettings {
    timezone?:timezone.ITimezone;
    language?:language.ILanguage;
    homeCountry?:country.ICountry;
}

/**
 * @see http://platform-dev.dins.ru/artifacts/documentation/latest/webhelp/dev_guide_advanced/ch18s04.html#ShortExtensionInfo
 */
export interface IExtensionShort extends helper.IHelperObject {
    extensionNumber?:string;
}

/**
 * @see http://platform-dev.dins.ru/artifacts/documentation/latest/webhelp/dev_guide_advanced/ch18s04.html#ExtensionInfo
 */
export interface IExtension extends helper.IHelperObject {
    extensionNumber?:string;
    name?:string;
    type?:string;
    status?:string;
    setupWizardState?:string;
    contact?:contact.IContactBrief;
    regionalSettings?:IExtensionRegionalSettings;
    serviceFeatures?:service.IServiceFeature[];
    presence?:presence.IPresence; // added by helper
}