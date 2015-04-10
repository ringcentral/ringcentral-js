/// <reference path="../../../typings/externals.d.ts" />

import context = require('../Context');
import observable = require('../Observable')

export class PubnubMock extends observable.Observable<PubnubMock> implements PUBNUB.PubnubInstance {

    private options:PUBNUB.InitOptions;

    constructor(context, options:PUBNUB.InitOptions) {
        this.options = options;
        super(context);
    }

    ready() {}

    subscribe(options:PUBNUB.SubscribeOptions) {
        this.on('message-' + options.channel, options.message);
    }

    unsubscribe(options:PUBNUB.UnsubscribeOptions) {
        this.off('message-' + options.channel);
    }

    receiveMessage(msg, channel) {
        this.emit('message-' + channel, msg, 'env', channel);
    }

}

export class PubnubFactory implements PUBNUB.PUBNUB {

    context:context.Context;

    constructor(context:context.Context) {
        this.context = context;
    }

    init(options:PUBNUB.InitOptions) {
        return new PubnubMock(this.context, options);
    }

}

export function $get(context:context.Context):PubnubFactory {
    return new PubnubFactory(context);
}