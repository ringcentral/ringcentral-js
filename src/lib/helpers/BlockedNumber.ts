/// <reference path="../../typings/externals.d.ts" />

import context = require('../core/Context');
import helper = require('../core/Helper');
import validator = require('../core/Validator');

export class BlockedNumber extends helper.Helper {

    private validator:validator.Validator;

    constructor(context:context.Context) {
        super(context);
        this.validator = validator.$get(context);
    }

    createUrl(options?:IBlockedNumberOptions, id?:string) {

        options = options || {};

        return '/account/~/extension/' +
               (options.extensionId ? options.extensionId : '~') +
               '/blocked-number' +
               (id ? '/' + id : '');

    }

    validate(item:IBlockedNumber) {

        return this.validator.validate([
            {field: 'phoneNumber', validator: this.validator.phone(item.phoneNumber)},
            {field: 'phoneNumber', validator: this.validator.required(item.phoneNumber)},
            {field: 'name', validator: this.validator.required(item.name)}
        ]);

    }

}

export function $get(context:context.Context):BlockedNumber {
    return context.createSingleton('BlockedNumber', ()=> {
        return new BlockedNumber(context);
    });
}

export interface IBlockedNumber extends helper.IHelperObject {
    name:string;
    phoneNumber:string;
}

export interface IBlockedNumberOptions {
    extensionId?:string;
}
