/// <reference path="../../typings/externals.d.ts" />

import context = require('../core/Context');
import helper = require('../core/Helper');
import validator = require('../core/Validator');

export class ContactGroup extends helper.Helper {

    private validator:validator.Validator;

    constructor(context:context.Context) {
        super(context);
        this.validator = validator.$get(context);
    }

    createUrl(options?:any, id?:string) {
        return '/account/~/extension/~/address-book/group' + (id ? '/' + id : '');
    }

    validate(item:IContactGroup) {

        return this.validator.validate([
            {field: 'groupName', validator: this.validator.required(item && item.groupName)}
        ]);

    }

}

export function $get(context:context.Context):ContactGroup {
    return context.createSingleton('ContactGroup', ()=> {
        return new ContactGroup(context);
    });
}

export interface IContactGroup extends helper.IHelperObject {
    notes?:string;
    groupName?:string;
    contactsCount?:number;
}
