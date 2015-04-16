/// <reference path="../../typings/externals.d.ts" />

import context = require('../core/Context');
import helper = require('../core/Helper');

export class ShippingMethod extends helper.Helper {

    /**
     * TODO Remove when http://jira.ringcentral.com/browse/SDK-3 id done
     */
    shippingMethods:IShippingMethod[] = [
        {
            id: '1',
            name: 'Ground Shipping (5-7 business days)'
        },
        {
            id: '2',
            name: '2-days Shipping'
        },
        {
            id: '3',
            name: 'Overnight Shipping'
        }
    ];

}

export function $get(context:context.Context):ShippingMethod {
    return context.createSingleton('ShippingMethod', ()=> {
        return new ShippingMethod(context);
    });
}

export interface IShippingMethod extends helper.IHelperObject {
    name?:string;
}