(function() {

    'use strict';

    var karma = window.__karma__;

    function tests(file) {
        return /-spec\.js$/.test(file);
    }

    function normalize(file) {
        return file.replace('/base/', '../').replace('.js', '');
    }

    /**
     * Make Chai global
     */

    window.expect = chai.expect;
    window.chai = chai;

    /**
     * RequireJS Config
     */

    require.config({
        baseUrl: '/base/lib',
        nodeIdCompat: true,
        waitSeconds: 1
    });

    require([
        '../build/rc-sdk.min', // or simply browser
        '../test/lib/Mock',
        '../node_modules/chai-spies/chai-spies' //TODO Get rid of it
    ], function(RCSDK, Mock, spies) {

        chai.use(spies);

        var rcsdk = new RCSDK({
            server: 'http://whatever',
            appKey: 'whatever',
            appSecret: 'whatever'
        });

        /**
         * @type {RCSDK}
         */
        window.rcsdk = rcsdk;
        window.RCSDK = RCSDK;
        window.Mock = Mock(rcsdk);

        require(Object.keys(karma.files).filter(tests).map(normalize), function() {
            karma.start();
        });

    });

})();