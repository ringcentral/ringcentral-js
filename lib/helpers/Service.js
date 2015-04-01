var define = typeof define === 'function' && define.amd ? define : function (factory) {
    factory(require, exports, module);
};
define(function (require, exports, module) {
    var __extends = this.__extends || function (d, b) {
        for (var p in b)
            if (b.hasOwnProperty(p))
                d[p] = b[p];
        function __() {
            this.constructor = d;
        }
        __.prototype = b.prototype;
        d.prototype = new __();
    };
    var helper = require('../core/Helper');
    var Service = function (_super) {
        __extends(Service, _super);
        function Service() {
            _super.apply(this, arguments);
            this.isSmsEnabled = this.isServiceFeatureEnabledMethod('SMS');
            this.isSmsReceivingEnabled = this.isServiceFeatureEnabledMethod('SMSReceiving');
            this.isPresenceEnabled = this.isServiceFeatureEnabledMethod('Presence');
            this.isRingOutEnabled = this.isServiceFeatureEnabledMethod('RingOut');
            this.isInternationalCallingEnabled = this.isServiceFeatureEnabledMethod('InternationalCalling');
            this.isDndEnabled = this.isServiceFeatureEnabledMethod('DND');
            this.isFaxEnabled = this.isServiceFeatureEnabledMethod('Fax');
            this.isFaxReceivingEnabled = this.isServiceFeatureEnabledMethod('FaxReceiving');
            this.isVoicemailEnabled = this.isServiceFeatureEnabledMethod('Voicemail');
            this.isPagerEnabled = this.isServiceFeatureEnabledMethod('Pager');
            this.isPagerReceivingEnabled = this.isServiceFeatureEnabledMethod('PagerReceiving');
            this.isVoipCallingEnabled = this.isServiceFeatureEnabledMethod('VoipCalling');
            this.isVideoConferencingEnabled = this.isServiceFeatureEnabledMethod('VideoConferencing');
            this.isSalesForceEnabled = this.isServiceFeatureEnabledMethod('SalesForce');
            this.isIntercomEnabled = this.isServiceFeatureEnabledMethod('Intercom');
            this.isPagingEnabled = this.isServiceFeatureEnabledMethod('Paging');
            this.isConferencingEnabled = this.isServiceFeatureEnabledMethod('Conferencing');
            this.isFreeSoftPhoneLinesEnabled = this.isServiceFeatureEnabledMethod('FreeSoftPhoneLines');
            this.isHipaaComplianceEnabled = this.isServiceFeatureEnabledMethod('HipaaCompliance');
            this.isCallParkEnabled = this.isServiceFeatureEnabledMethod('CallPark');
            this.isOnDemandCallRecordingEnabled = this.isServiceFeatureEnabledMethod('OnDemandCallRecording');
        }
        Service.prototype.createUrl = function () {
            return '/account/~/service-info';
        };
        Service.prototype.isEnabled = function (feature, serviceFeatures) {
            return serviceFeatures.reduce(function (value, f) {
                if (f.featureName == feature)
                    value = f.enabled;
                return value;
            }, false);
        };
        Service.prototype.isServiceFeatureEnabledMethod = function (feature) {
            var _this = this;
            return function (serviceFeatures) {
                return _this.isEnabled(feature, serviceFeatures);
            };
        };
        return Service;
    }(helper.Helper);
    exports.Service = Service;
    function $get(context) {
        return context.createSingleton('Service', function () {
            return new Service(context);
        });
    }
    exports.$get = $get;
});