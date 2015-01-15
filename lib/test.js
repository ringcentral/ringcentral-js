/**
 * Adapter for testing
 * @description RingPlatform JS SDK
 * @copyright © 2014-2015 RingCentral, Inc. All rights reserved.
 */
define(function(require, exports, module) {

    module.exports = function(rcsdk) {

        var platform = rcsdk.getPlatform(),
            context = rcsdk.getContext();

        platform.server = '';
        platform.apiKey = 'whatever';

        context.useAjaxStub(true);
        context.usePubnubStub(true);

    };

});
