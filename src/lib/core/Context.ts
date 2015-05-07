/// <reference path="../../typings/externals.d.ts" />

export class Context {

    private singletons:ISingletons;
    private injections:IInjections;
    private stubPubnub:boolean;
    private stubAjax:boolean;

    constructor(injections:IInjections) {
        this.singletons = {};
        this.injections = injections;
        this.stubPubnub = false;
        this.stubAjax = false;
    }

    createSingleton(name:string, factory:()=>any) {

        if (!this.singletons[name]) this.singletons[name] = factory();
        return this.singletons[name];

    }

    usePubnubStub(flag:boolean) {
        this.stubPubnub = !!flag;
        return this;
    }

    useAjaxStub(flag:boolean) {
        this.stubAjax = !!flag;
        return this;
    }

    getPubnub():PUBNUB.PUBNUB {
        return this.stubPubnub ? this.injections.pubnubMock.$get(this) : this.getPubnubReal();
    }

    getPubnubReal():PUBNUB.PUBNUB {
        return this.injections.PUBNUB;
    }

    getLocalStorage():Storage {

        return this.createSingleton('localStorage', () => {

            if (typeof this.injections.localStorage !== 'function') {
                return this.injections.localStorage; // this is window.localStorage
            }

            return new (<any> this.injections.localStorage)(); // this is NPM dom-storage constructor

        });

    }

    getPromise():typeof Promise {
        return this.injections.Promise;
    }

    getXHR():XMLHttpRequest {
        return <XMLHttpRequest>(this.stubAjax ? this.injections.xhrMock.$get(this) : (<any>this.injections.XHR)());
    }

}

export function $get(injections:IInjections) {
    return new Context(injections);
}

export interface ISingletons {
    [name: string]: any;
}

export interface IInjections {
    pubnubMock:any;
    xhrMock:any;
    PUBNUB:any;
    localStorage:any;
    XHR:any;
    Promise:any;
}