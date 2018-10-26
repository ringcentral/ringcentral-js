import {apiCall} from "@ringcentral/sdk/src/test/test";
import {Subscriptions} from "../Subscriptions";
import PubNub from "pubnub";

class PubNubMock extends PubNub {
    subscribe = (params: PubNub.SubscribeParameters) => {} //FIXME Actual subscribe slows down test teardown
}

export const createSubscriptions = (sdk) => new Subscriptions({sdk, PubNub: PubNubMock});

export function presenceLoad(id) {

    apiCall('GET', '/restapi/v1.0/account/~/extension/' + id + '/presence', {
        "uri": "https://platform.ringcentral.com/restapi/v1.0/account/123/extension/" + id + "/presence",
        "extension": {
            "uri": "https://platform.ringcentral.com/restapi/v1.0/account/123/extension/" + id,
            "id": id,
            "extensionNumber": "101"
        },
        "activeCalls": [],
        "presenceStatus": "Available",
        "telephonyStatus": "Ringing",
        "userStatus": "Available",
        "dndStatus": "TakeAllCalls",
        "extensionId": id
    });

}

export function subscribeGeneric(expiresIn = 15 * 60 * 60, id = null, remove = false, timeZoneString = null) {

    var date = new Date();

    var method = 'POST';
    if (id) method = 'PUT';
    if (remove) method = 'DELETE';

    var expirationTime = new Date(date.getTime() + (expiresIn * 1000)).toISOString();
    if (timeZoneString) {
        expirationTime = expirationTime.replace('Z', timeZoneString);
    }

    apiCall(method, '/restapi/v1.0/subscription' + (id ? '/' + id : ''), remove ? '' : {
        'eventFilters': [
            '/restapi/v1.0/account/~/extension/~/presence'
        ],
        'expirationTime': expirationTime,
        'expiresIn': expiresIn,
        'deliveryMode': {
            'transportType': 'PubNub',
            'encryption': false,
            'address': '123_foo',
            'subscriberKey': 'sub-c-foo',
            'secretKey': 'sec-c-bar'
        },
        'id': 'foo-bar-baz',
        'creationTime': date.toISOString(),
        'status': 'Active',
        'uri': 'https://platform.ringcentral.com/restapi/v1.0/subscription/foo-bar-baz'
    });

}

export function subscribeOnPresence(id = '1', detailed = false) {

    var date = new Date();

    apiCall('POST', '/restapi/v1.0/subscription', {
        'eventFilters': ['/restapi/v1.0/account/~/extension/' + id + '/presence' + (detailed ? '?detailedTelephonyState=true' : '')],
        'expirationTime': new Date(date.getTime() + (15 * 60 * 60 * 1000)).toISOString(),
        'deliveryMode': {
            'transportType': 'PubNub',
            'encryption': true,
            'address': '123_foo',
            'subscriberKey': 'sub-c-foo',
            'secretKey': 'sec-c-bar',
            'encryptionAlgorithm': 'AES',
            'encryptionKey': 'VQwb6EVNcQPBhE/JgFZ2zw=='
        },
        'creationTime': date.toISOString(),
        'id': 'foo-bar-baz',
        'status': 'Active',
        'uri': 'https://platform.ringcentral.com/restapi/v1.0/subscription/foo-bar-baz'
    });

}