/// <reference path="../../typings/externals.d.ts" />

export import mocha = require('../../test/mocha');
var expect = mocha.chai.expect;
var spy = mocha.sinon.spy;
var mock = mocha.mock;
var rcsdk = mocha.rcsdk;

describe('RCSDK.helpers.dictionaries.DeviceModel', function() {

    'use strict';

    var DeviceModel = rcsdk.getDeviceModelHelper();

    describe('getId', function() {

        it('provides artificial IDs', function() {

            expect(DeviceModel.getId({
                sku: '23',
                name: 'Polycom IP 321 Basic IP phone',
                deviceClass: 'Desk Phone'
            })).to.equal('23');

        });

    });

});
