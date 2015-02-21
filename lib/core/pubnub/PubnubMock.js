define(function(require, exports, module) {

    'use strict';

    function PubnubMock(options) {}

    PubnubMock.prototype.ready = function() {};

    PubnubMock.prototype.unsubscribe = function(options) {};

    PubnubMock.prototype.subscribe = function(options) {
        this.onMessage = options.message;
    };

    PubnubMock.prototype.receiveMessage = function(msg) {
        this.onMessage(msg, 'env', 'channel');
    };

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
                init: function(options) {
                    return new PubnubMock(options);
                }
            };

        }
    };

});
