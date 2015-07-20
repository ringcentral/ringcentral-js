/// <reference path="../../typings/externals.d.ts" />

import context = require('../core/Context');
import helper = require('../core/Helper');
import list = require('../core/List');
import country = require('./Country');

export class State extends helper.Helper {

    private countryHelper:country.Country;
    private list:list.List;

    constructor(context:context.Context) {
        super(context);
        this.countryHelper = country.$get(context);
        this.list = list.$get(context);
    }

    createUrl() {
        return '/dictionary/state';
    }

    filter(options?:IStateOptions) {

        options = this.utils.extend({
            countryId: ''
        }, options);

        return this.list.filter([
            {
                condition: options.countryId,
                filterFn: (item:IState, opts) => {
                    return (this.countryHelper.getId(item.country) == opts.condition);
                }
            }
        ]);

    }

}

export function $get(context:context.Context):State {
    return context.createSingleton('State', ()=> {
        return new State(context);
    });
}

export interface IState extends helper.IHelperObject {
    name?:string;
    isoCode?:string;
    country?:country.ICountry;
}

export interface IStateOptions {
    countryId?:string;
}