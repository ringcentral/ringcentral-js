/**
 * istanbul ignore next
 * @description RingPlatform JS SDK
 * @copyright © 2014-2015 RingCentral, Inc. All rights reserved.
 */
define(function(require, exports, module) {

    'use strict';

    function WS(url) {

        this.url = url;

        this.pubnub = {
            ready: function() {}
        };

        this.onmessage = function() {};
        this.onclose = function() {};
        this.onerror = function() {};
        this.onopen = function() {};

        this.close = function(code, reason) {
            this.onclose({
                code: code,
                reason: reason,
                wasClean: true
            });
        };

        /**
         * This stub allows to simulate message arrival
         * @param data
         */
        this.receiveMessage = function(data) {
            this.onmessage({
                data: data
            });
        };

        this.onopen();

    }

    /**
     * @alias RCSDK.core.pubnub.Mock
     * @type {PUBNUB}
     */
    module.exports = {
        /**
         * @param {Context} context
         * @returns {PUBNUB}
         */
        $get: function(context) {

            return {
                ws: WS
            }

        }
    };

});
