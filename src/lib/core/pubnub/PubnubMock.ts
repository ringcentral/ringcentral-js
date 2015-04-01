/// <reference path="../../../typings/externals.d.ts" />

import context = require('../Context');

export class PubnubMock implements PUBNUB.PubnubInstance {

    onMessage:(message, env, channel) => void;

    ready() {}

    unsubscribe(options) {}

    subscribe(options:{message:(message, env, channel) => void}) {
        this.onMessage = options.message;
    }

    receiveMessage(msg) {
        this.onMessage(msg, 'env', 'channel');
    }

}

export class PubnubFactory implements PUBNUB.PUBNUB {

    context:context.Context;

    constructor(context:context.Context) {
        this.context = context;
    }

    init(options) {
        return new PubnubMock();
    }

}

export function $get(context:context.Context):PubnubFactory {
    return new PubnubFactory(context);
}