/// <reference path="../../typings/externals.d.ts" />

import context = require('./Context');
import observable = require('./Observable');

export class PageVisibility extends observable.Observable<PageVisibility> {

    public events = {
        change: 'change'
    };

    public visible:boolean;

    constructor(context:context.Context) {

        super(context);

        var hidden = "hidden",
            onchange = (evt) => {

                evt = evt || window.event;

                var v = 'visible',
                    h = 'hidden',
                    evtMap = {
                        focus: v, focusin: v, pageshow: v, blur: h, focusout: h, pagehide: h
                    };

                this.visible = (evt.type in evtMap) ? evtMap[evt.type] == v : !document[hidden];

                this.emit(this.events.change, this.visible);

            };

        this.visible = true;

        if (typeof document == 'undefined' || typeof window == 'undefined') return;

        // Standards:

        if (hidden in document)
            document.addEventListener("visibilitychange", onchange);
        else if ((hidden = "mozHidden") in document)
            document.addEventListener("mozvisibilitychange", onchange);
        else if ((hidden = "webkitHidden") in document)
            document.addEventListener("webkitvisibilitychange", onchange);
        else if ((hidden = "msHidden") in document)
            document.addEventListener("msvisibilitychange", onchange);
        // IE 9 and lower:
        else if ('onfocusin' in <any>document)
            (<any>document).onfocusin = (<any>document).onfocusout = onchange;
        // All others:
        else
            window.onpageshow = window.onpagehide = window.onfocus = window.onblur = onchange;

    }

    isVisible() {
        return this.visible;
    }

}

export function $get(context:context.Context):PageVisibility {
    return new PageVisibility(context);
}