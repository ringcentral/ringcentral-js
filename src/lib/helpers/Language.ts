/// <reference path="../../typings/tsd.d.ts" />

import context = require('../core/Context');
import helper = require('../core/Helper');

export class Language extends helper.Helper {

    languages:ILanguage[] = [
        {
            id: '1033',
            name: 'English (US)'
        },
        {
            id: '3084',
            name: 'French (Canada)'
        }
    ];

}

export function $get(context:context.Context):Language {
    return context.createSingleton('Language', ()=> {
        return new Language(context);
    });
}

export interface ILanguage extends helper.IHelperObject {
    name?:string;
}
