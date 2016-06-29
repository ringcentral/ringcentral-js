import EventEmitter from "events";
import {PUBNUB} from "../core/Externals";

export default class PubnubMock extends EventEmitter {

    constructor(options) {
        super();
        this.options = options;
        this.crypto_obj = PUBNUB.crypto_obj;
    }

    init(options) {
        this.options = options;
    }

    ready() {}

    subscribe(options) {
        this.on('message-' + options.channel, options.message);
    }

    unsubscribe(options) {
        this.removeAllListeners('message-' + options.channel);
    }

    receiveMessage(msg, channel) {
        this.emit('message-' + channel, msg, 'env', channel);
    }

}