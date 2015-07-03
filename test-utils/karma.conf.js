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
            {pattern: './build/rc-sdk.js', included: false},
            {pattern: './build/tests/specs.js', included: false},
            {pattern: './bower_components/pubnub/web/*.*', included: false},
            {pattern: './bower_components/es6-promise-polyfill/*.*', included: false},
            // include files
            {pattern: require.resolve('karma-chai-plugins/function-bind-polyfill'), included: true},
            {pattern: './test-utils/requirejs-config.js', included: true},
            {pattern: './test-utils/karma.js', included: true}
        ],

        exclude: [],

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
            './build/*.js': ['coverage']
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
