/// <reference path="../../typings/externals.d.ts" />

import context = require('../core/Context');
import helper = require('../core/Helper');

export class Language extends helper.Helper {

    createUrl(options?:any, id?:string) {

        return '/dictionary/language';

    }

}

export function $get(context:context.Context):Language {
    return context.createSingleton('Language', ()=> {
        return new Language(context);
    });
}

export interface ILanguage extends helper.IHelperObject {
    name?:string;
    isoCode?:string;
    localeCode?:string;
}
