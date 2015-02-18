define(function(require, exports, module) {

    'use strict';

    var Helper = require('../core/Helper').Class,
        Validator = require('../core/Validator');

    /**
     * @extends Helper
     * @constructor
     */
    function RingoutHelper(context) {
        Helper.call(this, context);
        this.extension = require('./Extension').$get(context);
    }

    RingoutHelper.prototype = Object.create(Helper.prototype);

    RingoutHelper.prototype.createUrl = function(options, id) {

        options = options || {};

        return '/account/~/extension/' + (options.extensionId || '~') + '/ringout' + (id ? '/' + id : '');

    };

    RingoutHelper.prototype.resetAsNew = function(object) {
        object = Helper.prototype.resetAsNew.call(this, object);
        if (object) {
            delete object.status;
        }
        return object;
    };

    RingoutHelper.prototype.isInProgress = function(ringout) {
        return ringout && !this.isNew(ringout) && ringout.status && ringout.status.callStatus == 'InProgress';
    };

    RingoutHelper.prototype.isSuccess = function(ringout) {
        return ringout && !this.isNew(ringout) && ringout.status && ringout.status.callStatus == 'Success';
    };

    RingoutHelper.prototype.isError = function(ringout) {
        return !this.isNew(ringout) && !this.isInProgress(ringout) && !this.isSuccess(ringout);
    };

    /**
     * @param {IRingout} item
     */
    RingoutHelper.prototype.validate = function(item) {

        return Validator.validate([
            {field: 'to', validator: Validator.required(item && item.to && item.to.phoneNumber)},
            {field: 'from', validator: Validator.required(item && item.from && item.from.phoneNumber)}
        ]);

    };

    module.exports = {
        Class: RingoutHelper,
        /**
         * @param {Context} context
         * @returns {RingoutHelper}
         */
        $get: function(context) {

            return context.createSingleton('RingoutHelper', function() {
                return new RingoutHelper(context);
            });

        }
    };

    /**
     * @typedef {object} IRingout
     * @property {ICallerInfo} [from] (!) ONLY PHONE NUMBER
     * @property {ICallerInfo} [to] (!) ONLY PHONE NUMBER
     * @property {ICallerInfo} [callerId] (!) ONLY PHONE NUMBER
     * @property {boolean} [playPrompt]
     * @property {{callStatus:boolean, callerStatus:boolean, calleeStatus:boolean}} [status]
     */

});
