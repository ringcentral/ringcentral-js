/// <reference path="../../typings/externals.d.ts" />

import context = require('../core/Context');
import helper = require('../core/Helper');

export class Conferencing extends helper.Helper {

    createUrl() {
        return '/account/~/extension/~/conferencing';
    }

}

export function $get(context:context.Context):Conferencing {
    return context.createSingleton('Conferencing', ()=> {
        return new Conferencing(context);
    });
}