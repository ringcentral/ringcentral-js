/// <reference path="../../typings/externals.d.ts" />

import context = require('../core/Context');
import helper = require('../core/Helper');
import list = require('../core/List');
import extension = require('./Extension');

export class PhoneNumber extends helper.Helper {

    private extension:extension.Extension;
    private list:list.List;

    public tollFreeAreaCodes = ['800', '844', '855', '866', '877', '888'];

    constructor(context:context.Context) {
        super(context);
        this.extension = extension.$get(context);
        this.list = list.$get(context);
    }

    createUrl(options?:IPhoneNumberOptions, id?:string) {

        options = options || {};

        if (options.lookup) return '/number-pool/lookup';

        return '/account/~' +
               (options.extensionId ? '/extension/' + options.extensionId : '') +
               '/phone-number' +
               (id ? '/' + id : '');

    }

    isSMS(phoneNumber:IPhoneNumber) {
        return this.hasFeature(phoneNumber, 'SmsSender');
    }

    hasFeature(phoneNumber:IPhoneNumber, feature:string) {
        return (!!phoneNumber.features && phoneNumber.features.indexOf(feature) != -1);
    }

    reserve(phoneNumber:IPhoneNumber, date:any) {
        phoneNumber.reservedTill = new Date(date).toISOString();
    }

    unreserve(phoneNumber:IPhoneNumber) {
        phoneNumber.reservedTill = null;
    }

    comparator(options?:list.IListComparatorOptions) {

        return this.list.comparator(this.utils.extend({
            extractFn: (item:IPhoneNumber) => {
                return item.usageType + '-' +
                       item.paymentType + '-' +
                       item.type;
            }
        }, options));

    }

    /**
     * TODO Add other filtering methods http://jira.ringcentral.com/browse/SDK-5
     */
    filter(options?:IPhoneNumberFilterOptions) {

        options = this.utils.extend({
            usageType: '',
            paymentType: '',
            type: '',
            features: []
        }, options);

        return this.list.filter([
            {filterBy: 'usageType', condition: options.usageType},
            {filterBy: 'paymentType', condition: options.paymentType},
            {filterBy: 'type', condition: options.type},
            {
                condition: options.features.length,
                filterFn: (item:IPhoneNumber) => {

                    return options.features.some((feature:string) => {
                        return this.hasFeature(item, feature);
                    });

                }
            }
        ]);

    }

}

export function $get(context:context.Context):PhoneNumber {
    return context.createSingleton('PhoneNumber', ()=> {
        return new PhoneNumber(context);
    });
}

export interface IPhoneNumber extends helper.IHelperObject {
    phoneNumber?:string;
    paymentType?:string; // External, TollFree, Local
    location?:string;
    type?:string; // VoiceFax, FaxOnly, VoiceOnly
    usageType?:string; // CompanyNumber, DirectNumber, CompanyFaxNumber, ForwardedNumber
    features?:string[]; // CallerId, SmsSender
    reservedTill?:string;
    error?:string;
}

export interface IPhoneNumberOptions {
    extensionId?:string;
    lookup?:boolean;
    countryId?:string;
    paymentType?:string;
    npa?:string;
    nxx?:string;
    line?:string;
    exclude?:string;
}

export interface IPhoneNumberFilterOptions {
    paymentType?:string;
    usageType?:string;
    type?:string;
    features?:string[];
}

export interface IPhoneNumberOrder {
    records?:IPhoneNumber[];
}