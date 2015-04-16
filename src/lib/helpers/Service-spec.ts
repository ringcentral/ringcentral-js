/// <reference path="../../typings/externals.d.ts" />

export import mocha = require('../../test/mocha');
var expect = mocha.chai.expect;
var spy = mocha.sinon.spy;
var mock = mocha.mock;
var rcsdk = mocha.rcsdk;

describe('RCSDK.helpers.Service', function() {

    describe('Convenience methods', function() {

        it('allows to determine account features availability via set of methods', function() {

            function testMethods(value) {

                var features = [
                        {"featureName": "SMS", "enabled": value},
                        {"featureName": "SMSReceiving", "enabled": value},
                        {"featureName": "Pager", "enabled": value},
                        {"featureName": "PagerReceiving", "enabled": value},
                        {"featureName": "Voicemail", "enabled": value},
                        {"featureName": "Fax", "enabled": value},
                        {"featureName": "FaxReceiving", "enabled": value},
                        {"featureName": "DND", "enabled": value},
                        {"featureName": "RingOut", "enabled": value},
                        {"featureName": "InternationalCalling", "enabled": value},
                        {"featureName": "Presence", "enabled": value},
                        {"featureName": "VideoConferencing", "enabled": value},
                        {"featureName": "SalesForce", "enabled": value},
                        {"featureName": "Intercom", "enabled": value},
                        {"featureName": "Paging", "enabled": value},
                        {"featureName": "Conferencing", "enabled": value},
                        {"featureName": "VoipCalling", "enabled": value},
                        {"featureName": "FreeSoftPhoneLines", "enabled": value},
                        {"featureName": "HipaaCompliance", "enabled": value},
                        {"featureName": "CallPark", "enabled": value},
                        {"featureName": "OnDemandCallRecording", "enabled": value}
                    ],
                    service = rcsdk.getServiceHelper();

                expect(service.isSmsEnabled(features)).to.equal(value);
                expect(service.isSmsReceivingEnabled(features)).to.equal(value);
                expect(service.isPagerEnabled(features)).to.equal(value);
                expect(service.isPagerReceivingEnabled(features)).to.equal(value);
                expect(service.isVoicemailEnabled(features)).to.equal(value);
                expect(service.isFaxEnabled(features)).to.equal(value);
                expect(service.isFaxReceivingEnabled(features)).to.equal(value);
                expect(service.isDndEnabled(features)).to.equal(value);
                expect(service.isRingOutEnabled(features)).to.equal(value);
                expect(service.isInternationalCallingEnabled(features)).to.equal(value);
                expect(service.isPresenceEnabled(features)).to.equal(value);
                expect(service.isVideoConferencingEnabled(features)).to.equal(value);
                expect(service.isSalesForceEnabled(features)).to.equal(value);
                expect(service.isIntercomEnabled(features)).to.equal(value);
                expect(service.isPagingEnabled(features)).to.equal(value);
                expect(service.isConferencingEnabled(features)).to.equal(value);
                expect(service.isVoipCallingEnabled(features)).to.equal(value);
                expect(service.isFreeSoftPhoneLinesEnabled(features)).to.equal(value);
                expect(service.isHipaaComplianceEnabled(features)).to.equal(value);
                expect(service.isCallParkEnabled(features)).to.equal(value);
                expect(service.isOnDemandCallRecordingEnabled(features)).to.equal(value);

            }

            testMethods(true);
            testMethods(false);

        });
    });

});
