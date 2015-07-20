/// <reference path="../../typings/externals.d.ts" />

import context = require('../core/Context');
import helper = require('../core/Helper');

export class Service extends helper.Helper {

    createUrl() {
        return '/account/~/service-info';
    }

    isEnabled(feature:string, serviceFeatures:IServiceFeature[]) {

        return serviceFeatures.reduce((value, f) => {

            if (f.featureName == feature) value = f.enabled;
            return value;

        }, false);

    }

    isServiceFeatureEnabledMethod(feature) {
        return (serviceFeatures) => {
            return this.isEnabled(feature, serviceFeatures);
        };
    }

    isSmsEnabled = this.isServiceFeatureEnabledMethod('SMS');
    isSmsReceivingEnabled = this.isServiceFeatureEnabledMethod('SMSReceiving');
    isPresenceEnabled = this.isServiceFeatureEnabledMethod('Presence');
    isRingOutEnabled = this.isServiceFeatureEnabledMethod('RingOut');
    isInternationalCallingEnabled = this.isServiceFeatureEnabledMethod('InternationalCalling');
    isDndEnabled = this.isServiceFeatureEnabledMethod('DND');
    isFaxEnabled = this.isServiceFeatureEnabledMethod('Fax');
    isFaxReceivingEnabled = this.isServiceFeatureEnabledMethod('FaxReceiving');
    isVoicemailEnabled = this.isServiceFeatureEnabledMethod('Voicemail');
    isPagerEnabled = this.isServiceFeatureEnabledMethod('Pager');
    isPagerReceivingEnabled = this.isServiceFeatureEnabledMethod('PagerReceiving');
    isVoipCallingEnabled = this.isServiceFeatureEnabledMethod('VoipCalling');
    isVideoConferencingEnabled = this.isServiceFeatureEnabledMethod('VideoConferencing');
    isSalesForceEnabled = this.isServiceFeatureEnabledMethod('SalesForce');
    isIntercomEnabled = this.isServiceFeatureEnabledMethod('Intercom');
    isPagingEnabled = this.isServiceFeatureEnabledMethod('Paging');
    isConferencingEnabled = this.isServiceFeatureEnabledMethod('Conferencing');
    isFreeSoftPhoneLinesEnabled = this.isServiceFeatureEnabledMethod('FreeSoftPhoneLines');
    isHipaaComplianceEnabled = this.isServiceFeatureEnabledMethod('HipaaCompliance');
    isCallParkEnabled = this.isServiceFeatureEnabledMethod('CallPark');
    isOnDemandCallRecordingEnabled = this.isServiceFeatureEnabledMethod('OnDemandCallRecording');

}

export function $get(context:context.Context):Service {
    return context.createSingleton('Service', ()=> {
        return new Service(context);
    });
}

export interface IService extends helper.IHelperObject {
    serviceFeatures?:IServiceFeature[];
    servicePlanName?:string;
}

export interface IServiceFeature {
    featureName?:string;
    enabled?:boolean;
}