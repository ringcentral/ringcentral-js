/// <reference path="../../typings/externals.d.ts" />

export import mocha = require('../../test/mocha');
var expect = mocha.chai.expect;
var spy = mocha.sinon.spy;
var mock = mocha.mock;
var rcsdk = mocha.rcsdk;

describe('RCSDK.helpers.Call', function() {

    'use strict';

    var Call = rcsdk.getCallHelper();

    describe('createUrl', function() {

        it('returns URL depending on options', function() {

            expect(Call.createUrl()).to.equal('/account/~/extension/~/call-log');
            expect(Call.createUrl({personal: true})).to.equal('/account/~/extension/~/call-log');
            expect(Call.createUrl({extensionId: '12345'})).to.equal('/account/~/extension/12345/call-log');
            expect(Call.createUrl({extensionId: '12345'}, '67890')).to.equal('/account/~/extension/12345/call-log/67890');

            expect(Call.createUrl({active: true})).to.equal('/account/~/extension/~/active-calls');
            expect(Call.createUrl({active: true, personal: true})).to.equal('/account/~/extension/~/active-calls');
            expect(Call.createUrl({active: true}, 'foo')).to.equal('/account/~/extension/~/active-calls/foo');
            expect(Call.createUrl({
                active: true,
                extensionId: 'bar'
            }, 'foo')).to.equal('/account/~/extension/bar/active-calls/foo');

        });

    });

    describe('attachContacts', function() {

        it('attaches contacts to all callerInfo structures found in each call', function() {

            var contacts = [
                    {id: 'foo', homePhone: 'foo'},
                    {id: 'bar', homePhone: 'bar'},
                    {id: 'baz', homePhone: 'baz'}
                ],
                calls = <any>[
                    {
                        direction: 'Outbound',
                        from: {phoneNumber: 'foo'},
                        to: {phoneNumber: 'bar'}
                    },
                    {
                        direction: 'Inbound',
                        from: {phoneNumber: 'baz'},
                        to: {phoneNumber: 'notfound'}
                    }
                ];

            Call.attachContacts(contacts, calls);

            expect(calls[0].from.contact).to.equal(contacts[0]);
            expect(calls[0].to.contact).to.equal(contacts[1]);
            expect(calls[1].from.contact).to.equal(contacts[2]);
            expect(calls[1].to.contact).to.be.an('undefined');

        });

    });

    describe('getCallerInfo', function() {

        var calls = <any>[
            {
                direction: 'Outbound',
                from: {phoneNumber: 'foo'},
                to: {phoneNumber: 'bar'}
            },
            {
                direction: 'Inbound',
                from: {phoneNumber: 'baz'},
                to: {phoneNumber: 'qux'}
            }
        ];

        it('returns callerInfo of from or to properties depending on direction', function() {

            expect(Call.getCallerInfo(calls[0]).phoneNumber).to.equal('bar');
            expect(Call.getCallerInfo(calls[1]).phoneNumber).to.equal('baz');

        });

        it('returms all callerInfos in an order depending on direction', function() {

            expect(Call.getAllCallerInfos(calls[0])[0].phoneNumber).to.equal('bar');
            expect(Call.getAllCallerInfos(calls[0])[1].phoneNumber).to.equal('foo');
            expect(Call.getAllCallerInfos(calls[1])[0].phoneNumber).to.equal('baz');
            expect(Call.getAllCallerInfos(calls[1])[1].phoneNumber).to.equal('qux');

        });

    });

    describe('formatDuration', function() {

        it('formats duration', function() {

            expect(Call.formatDuration({duration: 0.5})).to.equal('00:00');
            expect(Call.formatDuration({duration: 0})).to.equal('00:00');
            expect(Call.formatDuration({duration: 1})).to.equal('00:01');
            expect(Call.formatDuration({duration: 1.5})).to.equal('00:01');
            expect(Call.formatDuration({duration: 10})).to.equal('00:10');
            expect(Call.formatDuration({duration: 60})).to.equal('01:00');
            expect(Call.formatDuration({duration: 70})).to.equal('01:10');
            expect(Call.formatDuration({duration: 60 * 60})).to.equal('1:00:00');
            expect(Call.formatDuration({duration: 60 * 60 * 10 + 70})).to.equal('10:01:10');

        });

    });

    var calls = <any>[
        {type: 'Voice', direction: 'Inbound', startTime: '2014-08-26T09:46:06.781Z'},
        {type: 'Voice', direction: 'Outbound', startTime: '2014-08-26T08:46:06.781Z'},
        {type: 'Voip', direction: 'Inbound', startTime: '2014-08-26T07:46:06.781Z'},
        {type: 'Voip', direction: 'Outbound', startTime: '2014-08-26T06:46:06.781Z'}
    ];

    describe('filter', function() {

        it('allows to filter calls by type and direction', function() {

            expect(calls.filter(Call.filter({type: 'Voice', direction: 'Inbound'})).length).to.equal(1);
            expect(calls.filter(Call.filter({type: 'Voice'})).length).to.equal(2);
            expect(calls.filter(Call.filter({direction: 'Inbound'})).length).to.equal(2);

        });

    });

    describe('sort', function() {

        it('allows to sort calls by startTime by default', function() {

            var sorted = [].concat(calls).sort(Call.comparator());

            expect(sorted[0]).to.equal(calls[3]);
            expect(sorted[1]).to.equal(calls[2]);
            expect(sorted[2]).to.equal(calls[1]);
            expect(sorted[3]).to.equal(calls[0]);

        });

    });

    var mocks = <any>{
        initial: {
            presence: {
                "uri": "https://api.ringcentral.com/restapi/v1.0/account/123/extension/321/presence",
                "extension": {
                    "uri": "https://api.ringcentral.com/restapi/v1.0/account/123/extension/321",
                    "id": 62480591,
                    "extensionNumber": "4166"
                },
                "presenceStatus": "Available",
                "telephonyStatus": "NoCall",
                "userStatus": "Available",
                "dndStatus": "TakeAllCalls",
                "message": "Waka waka",
                "allowSeeMyPresence": true,
                "ringOnMonitoredCall": false,
                "pickUpCallsOnHold": false
            },
            activeCalls: [],
            calls: [
                {
                    "uri": "https://api.ringcentral.com/restapi/v1.0/account/123/extension/321/call-log/B0iTLeNN-expL4g",
                    "id": "B0iTLeNN-expL4g",
                    "sessionId": "88052061020",
                    "startTime": "2014-12-11T00:48:08.000Z",
                    "duration": 11,
                    "type": "Voice",
                    "direction": "Inbound",
                    "action": "Phone Call",
                    "result": "Accepted",
                    "to": {"phoneNumber": "1855COMPANY", "name": "Called Ext Name"},
                    "from": {"phoneNumber": "1650CALLER0", "name": "Called Ext Name", "location": "San Mateo, CA"}
                },
                {
                    "uri": "https://api.ringcentral.com/restapi/v1.0/account/123/extension/321/call-log/B0iNkuy10B0FLG0",
                    "id": "B0iNkuy10B0FLG0",
                    "sessionId": "88051027020",
                    "startTime": "2014-12-11T00:40:13.000Z",
                    "duration": 11,
                    "type": "Voice",
                    "direction": "Inbound",
                    "action": "Phone Call",
                    "result": "Accepted",
                    "to": {"phoneNumber": "1855COMPANY", "name": "Called Ext Name"},
                    "from": {"phoneNumber": "1650CALLER0", "name": "Called Ext Name", "location": "San Mateo, CA"}
                }
            ]
        },
        ringing: {
            presence: {
                "extensionId": 62480591,
                "telephonyStatus": "Ringing",
                "activeCalls": [
                    {
                        "id": "1e8b5e8847924ab49f383bc8d355ee33",
                        "direction": "Inbound",
                        "from": "1650CALLER0",
                        "to": "1855COMPANY",
                        "telephonyStatus": "Ringing",
                        "sessionId": "88052513020"
                    }
                ],
                "sequence": 7272442
            },
            activeCalls: [
                {
                    "uri": "https://api.ringcentral.com/restapi/v1.0/account/123/extension/321/call-log/B0iVoSn2fxQRMMM",
                    "id": "B0iVoSn2fxQRMMM",
                    "sessionId": "88052513020",
                    "startTime": "2014-12-11T00:51:23.000Z",
                    "type": "Voice",
                    "direction": "Inbound",
                    "action": "Phone Call",
                    "result": "In Progress",
                    "to": {"phoneNumber": "1855COMPANY", "name": "Called Ext Name"},
                    "from": {"phoneNumber": "1650CALLER0", "name": "Called Ext Name", "location": "San Mateo, CA"},
                    wayToDetermineOverwrite: true
                }
            ],
            calls: [
                {
                    "uri": "https://api.ringcentral.com/restapi/v1.0/account/123/extension/321/call-log/B0iVoSn2fxQRMMM",
                    "id": "B0iVoSn2fxQRMMM",
                    "sessionId": "88052513020",
                    "startTime": "2014-12-11T00:51:23.000Z",
                    "type": "Voice",
                    "direction": "Inbound",
                    "action": "Phone Call",
                    "result": "In Progress",
                    "to": {"phoneNumber": "1855COMPANY", "name": "Called Ext Name"},
                    "from": {"phoneNumber": "1650CALLER0", "name": "Called Ext Name", "location": "San Mateo, CA"},
                    wayToDetermineItsACall: true
                },
                {
                    "uri": "https://api.ringcentral.com/restapi/v1.0/account/123/extension/321/call-log/B0iTLeNN-expL4g",
                    "id": "B0iTLeNN-expL4g",
                    "sessionId": "88052061020",
                    "startTime": "2014-12-11T00:48:08.000Z",
                    "duration": 11,
                    "type": "Voice",
                    "direction": "Inbound",
                    "action": "Phone Call",
                    "result": "Accepted",
                    "to": {"phoneNumber": "1855COMPANY", "name": "Called Ext Name"},
                    "from": {"phoneNumber": "1650CALLER0", "name": "Called Ext Name", "location": "San Mateo, CA"}
                },
                {
                    "uri": "https://api.ringcentral.com/restapi/v1.0/account/123/extension/321/call-log/B0iNkuy10B0FLG0",
                    "id": "B0iNkuy10B0FLG0",
                    "sessionId": "88051027020",
                    "startTime": "2014-12-11T00:40:13.000Z",
                    "duration": 11,
                    "type": "Voice",
                    "direction": "Inbound",
                    "action": "Phone Call",
                    "result": "Accepted",
                    "to": {"phoneNumber": "1855COMPANY", "name": "Called Ext Name"},
                    "from": {"phoneNumber": "1650CALLER0", "name": "Called Ext Name", "location": "San Mateo, CA"}
                }
            ]
        },
        pickup: {
            presence: {
                "extensionId": 62480591,
                "telephonyStatus": "CallConnected",
                "activeCalls": [
                    {
                        "id": "1e8b5e8847924ab49f383bc8d355ee33",
                        "direction": "Inbound",
                        "from": "1650CALLER0",
                        "to": "1855COMPANY",
                        "telephonyStatus": "CallConnected",
                        "sessionId": "88052513020"
                    }
                ],
                "sequence": 7272469
            },
            activeCalls: [
                {
                    "uri": "https://api.ringcentral.com/restapi/v1.0/account/123/extension/321/call-log/B0iVoSn2fxQRMMM",
                    "id": "B0iVoSn2fxQRMMM",
                    "sessionId": "88052513020",
                    "startTime": "2014-12-11T00:51:23.000Z",
                    "type": "Voice",
                    "direction": "Inbound",
                    "action": "Phone Call",
                    "result": "In Progress",
                    "to": {"phoneNumber": "1855COMPANY", "name": "Called Ext Name"},
                    "from": {"phoneNumber": "1650CALLER0", "name": "Called Ext Name", "location": "San Mateo, CA"}
                }
            ],
            calls: [
                {
                    "uri": "https://api.ringcentral.com/restapi/v1.0/account/123/extension/321/call-log/B0iVoSn2fxQRMMM",
                    "id": "B0iVoSn2fxQRMMM",
                    "sessionId": "88052513020",
                    "startTime": "2014-12-11T00:51:23.000Z",
                    "type": "Voice",
                    "direction": "Inbound",
                    "action": "Phone Call",
                    "result": "In Progress",
                    "to": {"phoneNumber": "1855COMPANY", "name": "Called Ext Name"},
                    "from": {"phoneNumber": "1650CALLER0", "name": "Called Ext Name", "location": "San Mateo, CA"}
                },
                {
                    "uri": "https://api.ringcentral.com/restapi/v1.0/account/123/extension/321/call-log/B0iTLeNN-expL4g",
                    "id": "B0iTLeNN-expL4g",
                    "sessionId": "88052061020",
                    "startTime": "2014-12-11T00:48:08.000Z",
                    "duration": 11,
                    "type": "Voice",
                    "direction": "Inbound",
                    "action": "Phone Call",
                    "result": "Accepted",
                    "to": {"phoneNumber": "1855COMPANY", "name": "Called Ext Name"},
                    "from": {"phoneNumber": "1650CALLER0", "name": "Called Ext Name", "location": "San Mateo, CA"}
                },
                {
                    "uri": "https://api.ringcentral.com/restapi/v1.0/account/123/extension/321/call-log/B0iNkuy10B0FLG0",
                    "id": "B0iNkuy10B0FLG0",
                    "sessionId": "88051027020",
                    "startTime": "2014-12-11T00:40:13.000Z",
                    "duration": 11,
                    "type": "Voice",
                    "direction": "Inbound",
                    "action": "Phone Call",
                    "result": "Accepted",
                    "to": {"phoneNumber": "1855COMPANY", "name": "Called Ext Name"},
                    "from": {"phoneNumber": "1650CALLER0", "name": "Called Ext Name", "location": "San Mateo, CA"}
                }
            ]
        },
        hangup: {
            presence: {
                "extensionId": 62480591,
                "telephonyStatus": "NoCall",
                "activeCalls": [
                    {
                        "id": "1e8b5e8847924ab49f383bc8d355ee33",
                        "direction": "Inbound",
                        "from": "1650CALLER0",
                        "to": "1855COMPANY",
                        "telephonyStatus": "NoCall",
                        "sessionId": "88052513020"
                    }
                ],
                "sequence": 7272495
            },
            activeCalls: [],
            calls: [
                {
                    "uri": "https://api.ringcentral.com/restapi/v1.0/account/123/extension/321/call-log/B0iVoSn2fxQRMMQ",
                    "id": "B0iVoSn2fxQRMMQ",
                    "sessionId": "88052513020",
                    "startTime": "2014-12-11T00:51:24.000Z",
                    "duration": 42,
                    "type": "Voice",
                    "direction": "Inbound",
                    "action": "Phone Call",
                    "result": "Accepted",
                    "to": {"phoneNumber": "1855COMPANY", "name": "Called Ext Name"},
                    "from": {"phoneNumber": "1650CALLER0", "name": "Called Ext Name", "location": "San Mateo, CA"}
                },
                {
                    "uri": "https://api.ringcentral.com/restapi/v1.0/account/123/extension/321/call-log/B0iTLeNN-expL4g",
                    "id": "B0iTLeNN-expL4g",
                    "sessionId": "88052061020",
                    "startTime": "2014-12-11T00:48:08.000Z",
                    "duration": 11,
                    "type": "Voice",
                    "direction": "Inbound",
                    "action": "Phone Call",
                    "result": "Accepted",
                    "to": {"phoneNumber": "1855COMPANY", "name": "Called Ext Name"},
                    "from": {"phoneNumber": "1650CALLER0", "name": "Called Ext Name", "location": "San Mateo, CA"}
                },
                {
                    "uri": "https://api.ringcentral.com/restapi/v1.0/account/123/extension/321/call-log/B0iNkuy10B0FLG0",
                    "id": "B0iNkuy10B0FLG0",
                    "sessionId": "88051027020",
                    "startTime": "2014-12-11T00:40:13.000Z",
                    "duration": 11,
                    "type": "Voice",
                    "direction": "Inbound",
                    "action": "Phone Call",
                    "result": "Accepted",
                    "to": {"phoneNumber": "1855COMPANY", "name": "Called Ext Name"},
                    "from": {"phoneNumber": "1650CALLER0", "name": "Called Ext Name", "location": "San Mateo, CA"}
                }
            ]
        }
    };


    describe('mergePresenceCalls', function() {

        it('merges known presence calls', function(done) {

            var presenceCalls = [];

            presenceCalls = Call.mergePresenceCalls(presenceCalls, mocks.initial.presence);

            presenceCalls = Call.mergePresenceCalls(presenceCalls, mocks.ringing.presence);

            expect(presenceCalls.length).to.equal(1);
            expect(presenceCalls[0].startTime).to.not.equal('');
            expect(presenceCalls[0].result).to.equal('In Progress');

            var oldTime = presenceCalls[0].startTime;

            setTimeout(function() {

                presenceCalls = Call.mergePresenceCalls(presenceCalls, mocks.pickup.presence);

                expect(presenceCalls.length).to.equal(1);
                expect(presenceCalls[0].startTime).to.equal(oldTime);

                done();

            }, 10);

        });

        it('sets appropriate statuses', function(done) {

            var presenceCalls = Call.mergePresenceCalls([], mocks.initial.presence);

            presenceCalls = Call.mergePresenceCalls(presenceCalls, mocks.ringing.presence);

            expect(presenceCalls[0].result).to.equal('In Progress');
            expect(presenceCalls[0].telephonyStatus).to.equal('Ringing');

            setTimeout(function() {

                presenceCalls = Call.mergePresenceCalls(presenceCalls, mocks.pickup.presence);

                expect(presenceCalls[0].result).to.equal('In Progress');
                expect(presenceCalls[0].telephonyStatus).to.equal('CallConnected');

            }, 10);

            setTimeout(function() {

                presenceCalls = Call.mergePresenceCalls(presenceCalls, mocks.hangup.presence);
                expect(presenceCalls[0].result).to.equal('NoCall');
                expect(presenceCalls[0].telephonyStatus).to.equal('NoCall');

                done();

            }, 20);

        });

    });

    describe('mergeAll', function() {

        it('merges together calls from presence, active calls, calls', function() {

            var presenceCalls = Call.mergePresenceCalls([], mocks.ringing.presence),
                allCalls = Call.mergeAll(presenceCalls, mocks.ringing.calls, mocks.ringing.activeCalls)
                    .sort(Call.comparator())
                    .reverse();

            expect(allCalls.length).to.equal(3);

            expect(allCalls[0].result).to.equal('In Progress');
            expect((<any>allCalls[0]).wayToDetermineItsACall).to.equal(true);
            expect((<any>allCalls[0]).wayToDetermineOverwrite).to.equal(true);

        });

    });

});
