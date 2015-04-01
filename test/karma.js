(function() {

    'use strict';

    var karma = window.__karma__;

    function tests(file) {
        return /-spec\.js$/.test(file);
    }

    function normalize(file) {
        return file.replace('/base/', '../').replace('.js', '');
        //return file.replace('.js', '');
    }

    /**
     * RequireJS Config
     */

    require.config({
        baseUrl: '/base/lib',
        nodeIdCompat: true,
        waitSeconds: 1
    });

    require(Object.keys(karma.files).filter(tests).map(normalize), function() {
        console.log('Tests loaded');
        karma.start();
    });

})();