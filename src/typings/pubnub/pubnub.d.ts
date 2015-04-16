declare module PUBNUB {

    export interface PubnubInstance {

        ready():void;

        subscribe(options:SubscribeOptions);

        unsubscribe(options:UnsubscribeOptions);

        receiveMessage(message:string, channel:string); //TODO Remove

    }

    export interface PUBNUB {

        init(options:InitOptions):PubnubInstance;

    }

    export interface SubscribeOptions {
        channel:string;
        message?:(message, env, channel) => any;
        connect?:(...args)=>void
    }

    export interface UnsubscribeOptions {
        channel:string;
    }

    export interface InitOptions {
        ssl?:boolean;
        subscribe_key?:string
    }

}

declare module 'pubnub' {
    var PUBNUB:typeof PUBNUB;
}
