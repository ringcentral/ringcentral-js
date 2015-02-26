define(function(require, exports, module) {

    'use strict';

    var Helper = require('../core/Helper').Class;

    /**
     * @extends Helper
     * @constructor
     */
    function ServiceHelper(context) {
        Helper.call(this, context);
    }

    ServiceHelper.prototype = Object.create(Helper.prototype);

    ServiceHelper.prototype.createUrl = function() {
        return '/account/~/service-info';
    };

    /**
     * @param {string} feature
     * @param {IServiceFeature[]} serviceFeatures
     * @returns {*}
     */
    ServiceHelper.prototype.isEnabled = function(feature, serviceFeatures) {

        return serviceFeatures.reduce(function(value, f) {

            if (f.featureName == feature) value = f.enabled;
            return value;

        }, false);

    };

    function isServiceFeatureEnabledMethod(feature) {
        return function(serviceFeatures) {
            return this.isEnabled(feature, serviceFeatures);
        };
    }

    ServiceHelper.prototype.isSmsEnabled = isServiceFeatureEnabledMethod('SMS');
    ServiceHelper.prototype.isSmsReceivingEnabled = isServiceFeatureEnabledMethod('SMSReceiving');
    ServiceHelper.prototype.isPresenceEnabled = isServiceFeatureEnabledMethod('Presence');
    ServiceHelper.prototype.isRingOutEnabled = isServiceFeatureEnabledMethod('RingOut');
    ServiceHelper.prototype.isInternationalCallingEnabled = isServiceFeatureEnabledMethod('InternationalCalling');
    ServiceHelper.prototype.isDndEnabled = isServiceFeatureEnabledMethod('DND');
    ServiceHelper.prototype.isFaxEnabled = isServiceFeatureEnabledMethod('Fax');
    ServiceHelper.prototype.isFaxReceivingEnabled = isServiceFeatureEnabledMethod('FaxReceiving');
    ServiceHelper.prototype.isVoicemailEnabled = isServiceFeatureEnabledMethod('Voicemail');
    ServiceHelper.prototype.isPagerEnabled = isServiceFeatureEnabledMethod('Pager');
    ServiceHelper.prototype.isPagerReceivingEnabled = isServiceFeatureEnabledMethod('PagerReceiving');
    ServiceHelper.prototype.isVoipCallingEnabled = isServiceFeatureEnabledMethod('VoipCalling');
    ServiceHelper.prototype.isVideoConferencingEnabled = isServiceFeatureEnabledMethod('VideoConferencing');
    ServiceHelper.prototype.isSalesForceEnabled = isServiceFeatureEnabledMethod('SalesForce');
    ServiceHelper.prototype.isIntercomEnabled = isServiceFeatureEnabledMethod('Intercom');
    ServiceHelper.prototype.isPagingEnabled = isServiceFeatureEnabledMethod('Paging');
    ServiceHelper.prototype.isConferencingEnabled = isServiceFeatureEnabledMethod('Conferencing');
    ServiceHelper.prototype.isFreeSoftPhoneLinesEnabled = isServiceFeatureEnabledMethod('FreeSoftPhoneLines');
    ServiceHelper.prototype.isHipaaComplianceEnabled = isServiceFeatureEnabledMethod('HipaaCompliance');
    ServiceHelper.prototype.isCallParkEnabled = isServiceFeatureEnabledMethod('CallPark');
    ServiceHelper.prototype.isOnDemandCallRecordingEnabled = isServiceFeatureEnabledMethod('OnDemandCallRecording');

    module.exports = {
        Class: ServiceHelper,
        /**
         * @param {Context} context
         * @returns {ServiceHelper}
         */
        $get: function(context) {

            return context.createSingleton('serviceHelper', function() {
                return new ServiceHelper(context);
            });

        }
    };

    /**
     * @typedef {object} IServiceFeature
     * @property {string} featureName
     * @property {boolean} enabled
     */

    /**
     * @typedef {object} IService
     * @property {IServiceFeature[]} serviceFeatures
     * @property {string} servicePlanName
     */

});
