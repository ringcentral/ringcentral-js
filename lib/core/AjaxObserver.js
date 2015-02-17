define(function(require, exports, module) {

    'use strict';

    var Observable = require('./Observable').Class;

    /**
     * @constructor
     * @extends Observable
     * @alias RCSDK.core.AjaxObserver
     */
    function AjaxObserver() {

        Observable.call(this);

    }

    AjaxObserver.prototype = Object.create(Observable.prototype);

    AjaxObserver.prototype.events = {
        beforeRequest: 'beforeRequest', // parameters: ajax
        requestSuccess: 'requestSuccess', // means that response was successfully fetched from server
        requestError: 'requestError' // means that request failed completely
    };

    module.exports = {
        Class: AjaxObserver,
        /**
         * @param {Context} context
         * @returns {AjaxObserver}
         */
        $get: function(context) {

            return context.createSingleton('AjaxObserver', function() {
                return new AjaxObserver();
            });

        }
    };

});