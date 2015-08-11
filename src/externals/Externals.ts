/// <reference path="../externals.d.ts" />

module RingCentral.sdk.externals {

    export var _Promise:typeof Promise;
    export var _fetch:Fetch;
    export var _Response:typeof Response;
    export var _Request:typeof Request;
    export var _Headers:typeof Headers;
    export var _PUBNUB:PUBNUB;

    export function get() {

        var root = Function('return this')();

        if (!_PUBNUB) _PUBNUB = root.PUBNUB;
        if (!_Promise) _Promise = root.Promise;
        if (!_fetch) _fetch = root.fetch;
        if (!_Headers) _Headers = root.Headers;
        if (!_Request) _Request = root.Request;
        if (!_Response) _Response = root.Response;

        return externals;

    }

}

