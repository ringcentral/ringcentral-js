/// <reference path="../../typings/externals.d.ts" />

import context = require('./Context');
import utils = require('./Utils');

export class Validator {

    private utils:utils.Utils;
    private context:context.Context;

    constructor(context:context.Context) {
        this.context = context;
        this.utils = utils.$get(context);
    }

    validate(validators:IValidator[]):IValidatorResult {

        var result = <IValidatorResult>{
            errors: {},
            isValid: true
        };

        result.errors = <any>validators.reduce((errors, validator) => {

            var res = validator.validator();

            if (res.length > 0) {
                result.isValid = false;
                errors[validator.field] = errors[validator.field] || [];
                errors[validator.field] = errors[validator.field].concat(res);
            }

            return errors;

        }, {});

        return result;

    }

    /**
     * It is not recommended to have any kinds of complex validators at front end
     * @deprecated
     */
    email(value:string, multiple?:boolean) {
        return ():Error[] => {
            if (!value) return [];
            return this.utils.isEmail(value, multiple) ? [] : [new Error('Value has to be a valid email')];
        };
    }

    /**
     * It is not recommended to have any kinds of complex validators at front end
     * TODO International phone numbers
     * @deprecated
     */
    phone(value:string) {
        return ():Error[] => {
            if (!value) return [];
            return this.utils.isPhoneNumber(value) ? [] : [new Error('Value has to be a valid US phone number')];
        };
    }

    required(value:any) {
        return ():Error[] => {
            return !value ? [new Error('Field is required')] : [];
        };
    }

    length(value:string, max?:number, min?:number) {
        return ():Error[] => {

            var errors = [];

            if (!value) return errors;

            value = value.toString();

            if (min && value.length < min) errors.push(new Error('Minimum length of ' + min + ' characters is required'));
            if (max && value.length > max) errors.push(new Error('Maximum length of ' + max + ' characters is required'));

            return errors;

        };
    }


}

export function $get(context:context.Context):Validator {
    return context.createSingleton('Validator', ()=> {
        return new Validator(context);
    });
}

export interface IValidator {
    field:string;
    validator:(...args)=>Error[];
}

export interface IValidatorErrors {
    [id:string]: Error[];
}

export interface IValidatorResult {
    isValid:boolean;
    errors:IValidatorErrors;
}