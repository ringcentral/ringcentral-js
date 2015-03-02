define(function(require, exports, module) {

    'use strict';

    var Utils = require('./Utils');

    /**
     * @typedef {object} IValidator
     * @property {string} field
     * @property {function} validator
     */

    /**
     * @typedef {object} IValidatorResult
     * @property {boolean} isValid
     * @property {Object.<number, Error[]>} errors
     */

    /**
     * @alias RCSDK.core.Validator
     * @name Validator
     */
    var Validator = module.exports = {
        /**
         * @param {IValidator[]} validators
         * @returns {IValidatorResult}
         */
        validate: function(validators) {

            /** @type {IValidatorResult} */
            var result = {
                errors: {},
                isValid: true
            };

            result.errors = validators.reduce(function(errors, validator) {

                var res = validator.validator();

                if (res.length > 0) {
                    result.isValid = false;
                    errors[validator.field] = errors[validator.field] || [];
                    errors[validator.field] = errors[validator.field].concat(res);
                }

                return errors;

            }, {});

            return result;

        },
        /**
         * It is not recommended to have any kinds of complex validators at front end
         * @deprecated
         * @param value
         * @param multiple
         * @returns {Function}
         */
        email: function(value, multiple) {
            return function() {
                if (!value) return [];
                return Utils.isEmail(value, multiple) ? [] : [new Error('Value has to be a valid email')];
            };
        },
        /**
         * It is not recommended to have any kinds of complex validators at front end
         * TODO International phone numbers
         * @deprecated
         * @param value
         * @returns {Function}
         */
        phone: function(value) {
            return function() {
                if (!value) return [];
                return Utils.isPhoneNumber(value) ? [] : [new Error('Value has to be a valid US phone number')];
            };
        },
        required: function(value) {
            return function() {
                return !value ? [new Error('Field is required')] : [];
            };
        },
        length: function(value, max, min) {
            return function() {

                var errors = [];

                if (!value) return errors;

                value = value.toString();

                if (min && value.length < min) errors.push(new Error('Minimum length of ' + min + ' characters is required'));
                if (max && value.length > max) errors.push(new Error('Maximum length of ' + max + ' characters is required'));

                return errors;

            };
        },
        $get: function(context) {
            return Validator;
        }
    };

});
