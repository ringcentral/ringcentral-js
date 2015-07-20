/// <reference path="../../typings/externals.d.ts" />

import context = require('../core/Context');
import helper = require('../core/Helper');

export class ShippingMethod extends helper.Helper {

    /**
     * TODO Add or describe options http://jira.ringcentral.com/browse/SDK-3 id done
     */
    createUrl() {
        return '/dictionary/shipping-options';
    }

}

export function $get(context:context.Context):ShippingMethod {
    return context.createSingleton('ShippingMethod', ()=> {
        return new ShippingMethod(context);
    });
}

export interface IShippingMethodOptions {
    quantity?:number;
    servicePlanId?:number;
    brandId?:number;
}

export interface IShippingMethodInfo {
    quantity?:string;
    price?:string;
    method?:IShippingMethod;
}

/**
 * @discrepancy Methods does not have URI
 */
export interface IShippingMethod extends helper.IHelperObject {
    id?:string;
    name?:string;
}