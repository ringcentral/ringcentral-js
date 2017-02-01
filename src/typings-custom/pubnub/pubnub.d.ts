interface PubNub {

    init(options:PubNubInitOptions):PubNubInstance;
    crypto_obj:PubNubCryptoObj;

}

interface PubNubInstance {

    crypto_obj:PubNubCryptoObj;

    ready():void;

    subscribe(options:PubNubSubscribeOptions);

    unsubscribe(options:PubNubUnsubscribeOptions);

    receiveMessage(message:string, channel:string); //TODO Remove

}

interface PubNubSubscribeOptions {
    channel:string;
    message?:(message, env, channel) => any;
    connect?:(...args)=>void
}

interface PubNubUnsubscribeOptions {
    channel:string;
}

interface PubNubInitOptions {
    ssl?:boolean;
    subscribe_key?:string
}

interface PubNubCryptoObj {
    encrypt:(message:string, key:string, options:PubNubCryptoOptions)=>string;
    decrypt:(message:string, key:string, options:PubNubCryptoOptions)=>any;
}

interface PubNubCryptoOptions {
    encryptKey?:boolean;
    keyEncoding?:string;
    keyLength?:number|string;
    mode?:string
}

declare module 'pubnub' {
    var PubNub:PubNub;
}

declare var PubNub:PubNub;