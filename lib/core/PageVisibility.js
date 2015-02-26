/**
 * istanbul ignore next
 */
define(function(require, exports, module) {
    'use strict';

    var Observable = require('./Observable').Class;

    /**
     * @constructor
     * @extends Observable
     * @alias RCSDK.core.PageVisibility
     */
    function PageVisibility() {

        Observable.call(this);

        var hidden = "hidden",
            onchange = function(evt) {

                evt = evt || window.event;

                var v = 'visible',
                    h = 'hidden',
                    evtMap = {
                        focus: v, focusin: v, pageshow: v, blur: h, focusout: h, pagehide: h
                    };

                this.visible = (evt.type in evtMap) ? evtMap[evt.type] == v : !document[hidden];

                this.emit(this.events.change, this.visible);

            }.bind(this);

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
        else if ('onfocusin' in document)
            document.onfocusin = document.onfocusout = onchange;
        // All others:
        else
            window.onpageshow = window.onpagehide = window.onfocus = window.onblur = onchange;

    }

    PageVisibility.prototype = Object.create(Observable.prototype);
    Object.defineProperty(PageVisibility.prototype, 'constructor', {value: PageVisibility, enumerable: false});

    PageVisibility.prototype.events = {
        change: 'change'
    };

    PageVisibility.prototype.isVisible = function() {
        return this.visible;
    };

    module.exports = {
        Class: PageVisibility,
        /**
         * @param {Context} context
         * @returns {PageVisibility}
         */
        $get: function(context) {
            return new PageVisibility();
        }
    };

});
