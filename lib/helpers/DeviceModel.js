/// <reference path="../../typings/tsd.d.ts" />
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var helper = require('../core/Helper');
var DeviceModel = (function (_super) {
    __extends(DeviceModel, _super);
    function DeviceModel() {
        _super.apply(this, arguments);
        /**
         * TODO Remove when http://jira.ringcentral.com/browse/SDK-1 is done
         */
        this.devices = [
            {
                id: '-1',
                name: 'Softphone'
            },
            {
                id: '0',
                name: 'Existing device'
            },
            {
                id: '19',
                name: 'Cisco SPA-525G2 Desk Phone',
                deviceClass: 'Desk Phone'
            },
            {
                id: '23',
                name: 'Polycom IP 321 Basic IP phone',
                deviceClass: 'Desk Phone'
            },
            {
                id: '30',
                name: 'Polycom IP 550 HD Manager IP phone',
                deviceClass: 'Desk Phone'
            },
            {
                id: '37',
                name: 'Polycom IP 6000 Conference Phone',
                deviceClass: 'Conference Phone'
            },
            {
                id: '40',
                name: 'Polycom IP 335 HD IP phone',
                deviceClass: 'Desk Phone'
            },
            {
                id: '51',
                name: 'Cisco SPA-303 Desk Phone',
                deviceClass: 'Desk Phone'
            },
            {
                id: '16',
                name: 'Cisco SPA-508G Desk Phone with 1 Expansion Module',
                deviceClass: 'Desk Phone',
                addons: [
                    {
                        id: '2',
                        name: 'Cisco Sidecar',
                        count: '1'
                    }
                ]
            },
            {
                id: '16',
                name: 'Cisco SPA-508G Desk Phone with 2 Expansion Modules',
                deviceClass: 'Desk Phone',
                addons: [
                    {
                        id: '2',
                        name: 'Cisco Sidecar',
                        count: '2'
                    }
                ]
            },
            {
                id: '16',
                name: 'Cisco SPA-508G Desk Phone',
                deviceClass: 'Desk Phone'
            },
            {
                id: '19',
                name: 'Cisco SPA-525G2 Desk Phone with 1 Expansion Module',
                deviceClass: 'Desk Phone',
                addons: [
                    {
                        id: '2',
                        name: 'Cisco Sidecar',
                        count: '1'
                    }
                ]
            },
            {
                id: '19',
                name: 'Cisco SPA-525G2 Desk Phone with 2 Expansion Modules	Desk Phone',
                addons: [
                    {
                        id: '2',
                        name: 'Cisco Sidecar',
                        count: '2'
                    }
                ]
            },
            {
                id: '34',
                name: 'Polycom IP 650 HD Executive IP phone with 1 Expansion Module',
                deviceClass: 'Desk Phone',
                addons: [
                    {
                        id: '1',
                        name: 'Plolycom Expansion',
                        count: '1'
                    }
                ]
            },
            {
                id: '34',
                name: 'Polycom IP 650 HD Executive IP phone with 2 Expansion Modules',
                deviceClass: 'Desk Phone',
                addons: [
                    {
                        id: '1',
                        name: 'Plolycom Expansion',
                        count: '2'
                    }
                ]
            },
            {
                id: '34',
                name: 'Polycom IP 650 HD Executive IP phone with 3 Expansion Modules',
                deviceClass: 'Desk Phone',
                addons: [
                    {
                        id: '1',
                        name: 'Plolycom Expansion',
                        count: '3'
                    }
                ]
            },
            {
                id: '34',
                name: 'Polycom IP 650 HD Executive IP phone',
                deviceClass: 'Desk Phone'
            },
            {
                id: '52',
                name: 'Cisco SPA-122 ATA',
                deviceClass: 'Analog Adapter'
            },
            {
                id: '53',
                name: 'Polycom VVX-500 Color Touchscreen',
                deviceClass: 'Desk Phone'
            },
            {
                id: '54',
                name: 'Polycom VVX-310 Gigabit Ethernet Phone',
                deviceClass: 'Desk Phone'
            },
            {
                id: '55',
                name: 'Polycom VVX-410 Color Gigabit Ethernet Phone',
                deviceClass: 'Desk Phone'
            }
        ];
    }
    DeviceModel.prototype.getId = function (device) {
        if (!device)
            return null;
        return device.id + (device.addons && device.addons[0] ? '-' + device.addons[0].id + '-' + device.addons[0].count : '');
    };
    /**
     * Remove extra textual information from device
     * @exceptionalCase Platform does not understand full device info
     */
    DeviceModel.prototype.cleanForSaving = function (device) {
        if (!device)
            return null;
        delete device.name;
        delete device.deviceClass;
        if (device.addons && device.addons.length > 0) {
            device.addons.forEach(function (addon, i) {
                delete device.addons[i].name;
            });
        }
        else {
            delete device.addons;
        }
        return device;
    };
    return DeviceModel;
})(helper.Helper);
exports.DeviceModel = DeviceModel;
function $get(context) {
    return context.createSingleton('DeviceModel', function () {
        return new DeviceModel(context);
    });
}
exports.$get = $get;
