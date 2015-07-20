/// <reference path="../../typings/externals.d.ts" />

import context = require('../core/Context');
import helper = require('../core/Helper');

export class DeviceModel extends helper.Helper {


    getId(device:IDeviceModel) {

        return device ? device.sku : null;

    }

    createUrl(options?:any, id?:string) {

        return '/dictionary/device';

    }

}

export function $get(context:context.Context):DeviceModel {
    return context.createSingleton('DeviceModel', ()=> {
        return new DeviceModel(context);
    });
}

export interface IDeviceModel extends helper.IHelperObject {
    sku?:string;
    type?:string;
    model?:{
        id?:string;
        name?:string;
        deviceClass?:string;
        lineCount?:number;
        addons?:IDeviceModelAddon[];
    };
}

export interface IDeviceModelAddon extends helper.IHelperObject {
    name?:string;
    count?:string;
}