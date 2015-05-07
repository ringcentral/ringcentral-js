/// <reference path="../../typings/externals.d.ts" />

import context = require('../core/Context');
import helper = require('../core/Helper');
import list = require('../core/List');
import state = require('./State');

export class Location extends helper.Helper {

    private list:list.List;
    private state:state.State;

    constructor(context:context.Context) {
        super(context);
        this.list = list.$get(context);
        this.state = state.$get(context);
    }

    createUrl() {
        return '/dictionary/location';
    }

    filter(options?:ILocationFilterOptions) {

        var uniqueNPAs = [];

        options = this.utils.extend({
            stateId: '',
            onlyUniqueNPA: false
        }, options);

        return this.list.filter([
            {
                condition: options.stateId,
                filterFn: (item:ILocation, opts) => {
                    return (this.state.getId(item.state) == opts.condition);
                }
            },
            {
                condition: options.onlyUniqueNPA,
                filterFn: (item:ILocation, opts) => {
                    if (uniqueNPAs.indexOf(item.npa) == -1) {
                        uniqueNPAs.push(item.npa);
                        return true;
                    } else {
                        return false;
                    }
                }
            }
        ]);

    }

    comparator(options?:list.IListComparatorOptions) {

        options = this.utils.extend({
            sortBy: 'npa'
        }, options);

        if (options.sortBy == 'nxx') {

            options.extractFn = (item:ILocation) => {
                return (parseInt(item.npa) * 1000000) + parseInt(item.nxx);
            };

            options.compareFn = this.list.numberComparator;

        }

        return this.list.comparator(options);

    }

}

export function $get(context:context.Context):Location {
    return context.createSingleton('Location', ()=> {
        return new Location(context);
    });
}

export interface ILocation extends helper.IHelperObject {
    name?:string;
    isoCode?:string;
    npa?:string;
    nxx?:string;
    state?:state.IState;
}

export interface ILocationFilterOptions {
    stateId?:string;
    onlyUniqueNPA?:boolean;
}
