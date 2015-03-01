/// <reference path="../typings/tsd.d.ts" />

module RCSDK {

    interface IOptions {
        server:string;
        appKey:string;
        appSecret:string;
        cachePrefix?:string;
    }

    interface IInjections {
        PUBNUB:any; //PUBNUB;
        CryptoJS:CryptoJS.CryptoJSStatic;
        localStorage:Storage;
        XHR:XMLHttpRequest;
        Promise:Promise;
    }

}