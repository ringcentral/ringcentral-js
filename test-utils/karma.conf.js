var path = require('path');

module.exports = function(config) {

    config.set({

        basePath: '../',

        frameworks: [
            'requirejs',
            'mocha',
            'chai',
            'sinon-chai'
        ],

        files: [
            // specify but not include files
            {pattern: './build/**/*.js', included: false},
            {pattern: './lib/*/**/*.js', included: false},
            {pattern: './lib/RCSDK.js', included: false}, // need to be separately mentioned otherwise not included (*)
            {pattern: './lib/RCSDK-spec.js', included: false},
            {pattern: './test/lib/**/*.js', included: false}, // do not use * instead of lib -- skip specs-api
            {pattern: './test/mocha.js', included: false}, // need to be separately mentioned otherwise not included (*)
            {pattern: './bower_components/crypto-js/**/*.js', included: false},
            {pattern: './bower_components/pubnub/web/*.*', included: false},
            {pattern: './bower_components/es6-promise-polyfill/*.*', included: false},
            // include files
            {pattern: require.resolve('karma-chai-plugins/function-bind-polyfill'), included: true},
            {pattern: './test-utils/requirejs-config.js', included: true},
            {pattern: './test-utils/karma.js', included: true}
        ],

        exclude: [
            './lib/requirejs-wrap.js'
        ],

        reporters: [
            //'html',
            'coverage',
            'mocha'
        ],

        htmlReporter: {
            outputDir: './build/karma'
        },

        coverageReporter: {
            type: 'lcov',
            dir: './build/karma'
        },

        logLevel: config.LOG_ERROR, // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG

        preprocessors: {
            './lib/**/!(*spec).js': ['coverage']
        },

        browsers: [
            //'Chrome',
            'PhantomJS'
        ],

        plugins: [
            'karma-chrome-launcher',
            'karma-coverage',
            'karma-html-reporter',
            'karma-mocha',
            'karma-mocha-reporter',
            'karma-phantomjs-launcher',
            'karma-requirejs',
            'karma-chai-plugins'
        ],

        singleRun: true,
        captureTimeout: 5000,
        browserNoActivityTimeout: 5000,
        requireJsShowNoTimestampsError: false

    });

};
