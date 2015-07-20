/// <reference path="../../typings/externals.d.ts" />

import context = require('../core/Context');
import helper = require('../core/Helper');

export class Account extends helper.Helper {

    createUrl() {
        return '/account/~';
    }

}

export function $get(context:context.Context):Account {
    return context.createSingleton('Account', ()=> {
        return new Account(context);
    });
}
