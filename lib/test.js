/**
 * Adapter for testing
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
