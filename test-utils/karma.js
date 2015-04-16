(function() {

    'use strict';

    function tests(file) {
        return /-spec/.test(file);
    }

    function normalize(file) {
        // Because of require-config.js which is relative to lib
        // If breaks see node_modules/karma-cajon/lib/adapter.js
        return file.replace('/base/', '../').replace('.js', '');
    }

    var karma = window.__karma__,
        files = Object.keys(karma.files).filter(tests).map(normalize);

    /**
     * RequireJS Config
     */

    define('xhr2', [], function() { return XMLHttpRequest; });
    define('dom-storage', [], function() { return localStorage; });
    define('sinon', [], function() { return sinon; });
    define('chai', [], function() { return chai; });
    define('mocha', [], function() { return mocha; });

    require.config({
        baseUrl: '/base/lib',
        nodeIdCompat: true,
        waitSeconds: 5
    });

    require(files, function() {
        console.log('Tests loaded');
        karma.start();
    });

})();