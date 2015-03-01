define(function(require, exports, module) {

    'use strict';

    /**
     *
     * @param {RCSDK} rcsdk
     * @returns {{}}
     */
    module.exports = function(rcsdk) {

        var platform = rcsdk.getPlatform(),
            cache = rcsdk.getCache();

        rcsdk.getContext()
            .useAjaxStub(true)
            .usePubnubStub(true);

        platform.pollInterval = 1;
        platform.refreshDelayMs = 1;

        /**
         * @name Mock
         */
        var Mock = {
            rcsdk: rcsdk
        };

        Mock.registerHooks = function(suite, username) {

            suite.afterEach(function(done) {

                platform
                    .logout()
                    .then(function() {
                        done();
                    })
                    .catch(done);

            });

            Mock.registerCleanup(suite);

            suite.beforeEach(function(done) {

                Mock.authentication();

                platform
                    .authorize({
                        username: username || 'whatever',
                        password: 'whatever'
                    })
                    .then(function() {
                        done();
                    })
                    .catch(done);

            });

        };

        Mock.registerCleanup = function(suite) {

            function cleanup() {

                cache.clean();

                // Clear events and all for singletons
                platform.destroy();

                rcsdk.getXhrResponse().clear();

            }

            suite.beforeEach(function(done) {
                cleanup();
                done();
            });

            suite.afterEach(function(done) {
                cleanup();
                done();
            });

        };

        require('./mocks/apiCall')(Mock);
        require('./mocks/authentication')(Mock);
        require('./mocks/subscription-generic')(Mock);
        require('./mocks/subscription-presence')(Mock);
        require('./mocks/token-refresh')(Mock);
        require('./mocks/presence-load-id')(Mock);

        return Mock;

    };

});