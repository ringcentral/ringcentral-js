declare module PUBNUB {

    export interface PubnubInstance {

        ready(options?:{
            ssl?:boolean;
            subscribe_key?:string
        });

        subscribe(options:{
            channel?:string;
            message?:(message, env, channel) => void;
            connect?:()=>void
        });

        unsubscribe(options:{
            channel?:string
        });

        receiveMessage(message:string); //TODO Remove

    }

    export interface PUBNUB {

        init(options):PubnubInstance;

    }

}

declare module 'pubnub' {
	var PUBNUB: typeof PUBNUB;
}
