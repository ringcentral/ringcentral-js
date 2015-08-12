declare module PUBNUB {

    export interface PubnubInstance {

        crypto_obj:CryptoObj;

        ready():void;

        subscribe(options:SubscribeOptions);

        unsubscribe(options:UnsubscribeOptions);

        receiveMessage(message:string, channel:string); //TODO Remove

    }

    export interface PUBNUB {

        init(options:InitOptions):PubnubInstance;
        crypto_obj:CryptoObj;

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

    export interface CryptoObj {
        encrypt:(message:string, key:string, options:CryptoOptions)=>string;
        decrypt:(message:string, key:string, options:CryptoOptions)=>any;
    }

    export interface CryptoOptions {
        encryptKey?:boolean;
        keyEncoding?:string;
        keyLength?:number|string;
        mode?:string
    }

}

declare module 'pubnub' {
    export var PUBNUB:PUBNUB.PUBNUB;
}
