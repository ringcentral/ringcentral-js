/// <reference path="../../typings/externals.d.ts" />

import observable = require('./Observable');
import context = require('./Context');

export class AjaxObserver extends observable.Observable<AjaxObserver> {

    public events = {
        beforeRequest: 'beforeRequest', // parameters: ajax
        requestSuccess: 'requestSuccess', // means that response was successfully fetched from server
        requestError: 'requestError' // means that request failed completely
    };

}

export function $get(context:context.Context):AjaxObserver {

    return context.createSingleton('AjaxObserver', ()=> {
        return new AjaxObserver(context);
    });

}