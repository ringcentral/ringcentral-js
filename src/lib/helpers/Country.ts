/// <reference path="../../typings/externals.d.ts" />

import context = require('../core/Context');
import helper = require('../core/Helper');

export class Country extends helper.Helper {

    createUrl(options?:any, id?:string) {
        return '/dictionary/country';
    }

}

export function $get(context:context.Context):Country {
    return context.createSingleton('Country', ()=> {
        return new Country(context);
    });
}

export interface ICountry extends helper.IHelperObject {
    name?:string;
    isoCode?:string;
    callingCode?:string;
}