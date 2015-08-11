/// <reference path="../pubnub/PubnubMock.ts" />
/// <reference path="../externals/Externals.ts" />

module RingCentral.sdk.pubnub {

    export class PubnubFactory {

        private _useMock:boolean = false;
        private _mock:PubnubMockFactory;

        constructor(flag:boolean) {
            this._useMock = !!flag;
            this._mock = new PubnubMockFactory();
        }

        getPubnub():PUBNUB {
            return this._useMock ? this._mock : externals._PUBNUB;
        }

    }

}