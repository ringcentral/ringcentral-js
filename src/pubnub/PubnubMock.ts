/// <reference path="../externals.d.ts" />
/// <reference path="../core/Observable.ts" />
/// <reference path="../externals/Externals.ts" />

module RingCentral.sdk.pubnub {

    export class PubnubMock extends core.Observable<PubnubMock> implements PUBNUBInstance {

        private options:PUBNUBInitOptions;
        crypto_obj:PUBNUBCryptoObj;

        constructor(options:PUBNUBInitOptions) {
            super();
            this.options = options;
            this.crypto_obj = externals._PUBNUB.crypto_obj;
        }

        ready() {}

        subscribe(options:PUBNUBSubscribeOptions) {
            this.on('message-' + options.channel, options.message);
        }

        unsubscribe(options:PUBNUBUnsubscribeOptions) {
            this.off('message-' + options.channel);
        }

        receiveMessage(msg, channel) {
            this.emit('message-' + channel, msg, 'env', channel);
        }

    }

    export class PubnubMockFactory implements PUBNUB {

        crypto_obj:PUBNUBCryptoObj;

        constructor() {
            this.crypto_obj = externals._PUBNUB.crypto_obj;
        }

        init(options:PUBNUBInitOptions) {
            return new PubnubMock(options);
        }

    }

}