import context = require('../Context');
import r = require('../http/Response');
import xhrMock = require('./XhrMock'); //FIXME Circular

export class XhrResponse {

    private responses:IXhrResponse[];

    constructor(context:context.Context) {
        this.responses = [];
    }

    add(response:any) {
        this.responses.push(response);
    }

    clear() {
        this.responses = [];
    }

    find(ajax:xhrMock.XhrMock):IXhrResponse {

        var currentResponse:IXhrResponse = null;

        this.responses.forEach((response:IXhrResponse) => {

            if (ajax.url.indexOf(response.path) > -1 && (!response.test || response.test(ajax))) {
                currentResponse = response;
            }

        });

        return currentResponse;

    }
}

export interface IXhrResponse {
    path?:string;
    response?:(xhr?:xhrMock.XhrMock)=>Promise<r.Response>;
    test?:(xhr:xhrMock.XhrMock)=>boolean;
}

export function $get(context:context.Context):XhrResponse {
    return context.createSingleton('XhrResponse', ()=> {
        return new XhrResponse(context);
    });
}