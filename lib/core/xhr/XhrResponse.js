define(function(require, exports, module) {

    'use strict';

    /**
     * Ajax Response Manager
     * @constructor
     * @alias RCSDK.core.XhrResponse
     */
    function XhrResponse() {
        /** @type {IXhrResponse[]} */
        this.responses = [];
    }

    /**
     * @param {IXhrResponse} response
     */
    XhrResponse.prototype.add = function(response) {
        this.responses.push(response);
    };

    XhrResponse.prototype.clear = function() {
        this.responses = [];
    };

    /**
     * @param {XhrMock} ajax
     * @returns {IXhrResponse}
     */
    XhrResponse.prototype.find = function(ajax) {

        var currentResponse = null;

        this.responses.forEach(function(response) {

            if (ajax.url.indexOf(response.path) > -1 && (!response.test || response.test(ajax))) {
                currentResponse = response;
            }

        });

        return currentResponse;

    };

    module.exports = {
        Class: XhrResponse,
        /**
         * @static
         * @param {Context} context
         * @returns {XhrResponse}
         */
        $get: function(context) {

            return context.createSingleton('XhrResponse', function() {
                return new XhrResponse(context);
            });

        }
    };

    /**
     * @typedef {Object} IXhrResponse
     * @property {string} path
     * @property {function(Ajax)} response Response mock function
     * @property {function(Ajax)} test? This will be executed to determine, whether this mock is applicable
     */

});
