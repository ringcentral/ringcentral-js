/// <reference path="../../typings/externals.d.ts" />

import context = require('../core/Context');
import helper = require('../core/Helper');
import validator = require('../core/Validator');
import extension = require('./Extension');
import deviceModel = require('./DeviceModel');
import shippingMethod = require('./ShippingMethod');
import phoneNumber = require('./PhoneNumber');

export class Device extends helper.Helper {

    private validator:validator.Validator;
    private extension:extension.Extension;
    private deviceModel:deviceModel.DeviceModel;

    constructor(context:context.Context) {
        super(context);
        this.validator = validator.$get(context);
        this.extension = extension.$get(context);
        this.deviceModel = deviceModel.$get(context);
    }

    createUrl(options?:IDeviceOptions, id?:string) {

        options = options || {};

        if (options.order) return '/account/~/order';

        return '/account/~' +
               (options.extensionId ? '/extension/' + options.extensionId : '') +
               '/device' +
               (id ? '/' + id : '');

    }

    /**
     * @param {IDevice} item
     */
    validate(item:IDevice) {

        return this.validator.validate([
            {
                field: 'emergencyServiceAddress-street',
                validator: this.validator.required(item && item.emergencyServiceAddress && item.emergencyServiceAddress.street)
            },
            {
                field: 'emergencyServiceAddress-city',
                validator: this.validator.required(item && item.emergencyServiceAddress && item.emergencyServiceAddress.city)
            },
            {
                field: 'emergencyServiceAddress-state',
                validator: this.validator.required(item && item.emergencyServiceAddress && item.emergencyServiceAddress.state)
            },
            {
                field: 'emergencyServiceAddress-country',
                validator: this.validator.required(item && item.emergencyServiceAddress && item.emergencyServiceAddress.country)
            },
            {
                field: 'emergencyServiceAddress-zip',
                validator: this.validator.required(item && item.emergencyServiceAddress && item.emergencyServiceAddress.zip)
            },
            {
                field: 'emergencyServiceAddress-customerName',
                validator: this.validator.required(item && item.emergencyServiceAddress && item.emergencyServiceAddress.customerName)
            },
            {field: 'extension', validator: this.validator.required(this.extension.getId(item && item.extension))},
            {field: 'model', validator: this.validator.required(this.deviceModel.getId(item && item.model))}
        ]);

    }

}

export function $get(context:context.Context):Device {
    return context.createSingleton('Device', ()=> {
        return new Device(context);
    });
}

export interface IContactGroup extends helper.IHelperObject {
    notes?:string;
    groupName?:string;
    contactsCount?:number;
}

export interface IDevice extends helper.IHelperObject {
    type?:string;
    name?:string;
    serial?:string;
    model?:deviceModel.IDeviceModel;
    extension?:extension.IExtensionShort; //TODO IExtension?
    emergencyServiceAddress?:IDeviceAddress;
    shipping?:IDeviceShipping;
    phoneLines?:IDevicePhoneLine[];
}

export interface IDeviceOrder {
    devices?:IDevice[];
}

export interface IDeviceAddress {
    street?:string;
    street2?:string;
    city?:string;
    state?:string;
    country?:string;
    zip?:string;
    customerName?:string;
}

export interface IDeviceShipping {
    address?:IDeviceAddress;
    method?:shippingMethod.IShippingMethod;
    status?:string;
}

export interface IDevicePhoneLine {
    lineType?:string;
    phoneInfo?:phoneNumber.IPhoneNumber;
}

export interface IDeviceOptions {
    extensionId?:string;
    order?:boolean;
}