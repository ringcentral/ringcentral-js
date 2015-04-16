/// <reference path="../../typings/externals.d.ts" />

import context = require('../core/Context');
import helper = require('../core/Helper');

export class Timezone extends helper.Helper {

    createUrl() {
        return '/dictionary/timezone';
    }

}

export function $get(context:context.Context):Timezone {
    return context.createSingleton('Timezone', ()=> {
        return new Timezone(context);
    });
}

export interface ITimezone extends helper.IHelperObject {
    name?:string;
    description?:string;
}