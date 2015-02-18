describe('RCSDK.helpers.dictionaries.DeviceModel', function() {

    'use strict';

    var DeviceModel = rcsdk.getDeviceModelHelper();

    describe('cleanForSaving', function() {

        it('removes unnecessary properties from object', function() {

            expect(DeviceModel.cleanForSaving({
                id: '23',
                name: 'Polycom IP 321 Basic IP phone',
                deviceClass: 'Desk Phone'
            })).to.deep.equal({id: '23'});

            expect(DeviceModel.cleanForSaving({
                id: '23',
                name: 'Polycom IP 321 Basic IP phone',
                deviceClass: 'Desk Phone',
                addons: []
            })).to.deep.equal({id: '23'});

            expect(DeviceModel.cleanForSaving({
                id: '16',
                name: 'Cisco SPA-508G Desk Phone with 2 Expansion Modules',
                deviceClass: 'Desk Phone',
                addons: [
                    {
                        id: '2',
                        name: 'Cisco Sidecar',
                        count: '2'
                    },
                    {
                        id: '2',
                        name: 'Cisco Sidecar',
                        count: '1'
                    }
                ]
            })).to.deep.equal({
                    id: '16',
                    addons: [{id: '2', count: '2'}, {id: '2', count: '1'}]
                });

        });

    });

    describe('getId', function() {

        it('provides artificial IDs', function() {

            expect(DeviceModel.getId({
                id: '23',
                name: 'Polycom IP 321 Basic IP phone',
                deviceClass: 'Desk Phone'
            })).to.equal('23');

            expect(DeviceModel.getId({
                id: '23',
                name: 'Polycom IP 321 Basic IP phone',
                deviceClass: 'Desk Phone',
                addons: []
            })).to.equal('23');

            expect(DeviceModel.getId({
                id: '16',
                name: 'Cisco SPA-508G Desk Phone with 2 Expansion Modules',
                deviceClass: 'Desk Phone',
                addons: [
                    {
                        id: '2',
                        name: 'Cisco Sidecar',
                        count: '2'
                    },
                    {
                        id: '2',
                        name: 'Cisco Sidecar',
                        count: '1'
                    }
                ]
            })).to.equal('16-2-2');

        });

    });

});
