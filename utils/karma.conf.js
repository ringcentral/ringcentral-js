var path = require('path');

module.exports = function(config) {

    config.set({

        basePath: '../',

        frameworks: [
            'mocha',
            'chai',
            'sinon-chai'
        ],

        files: [
            {pattern: require.resolve('karma-chai-plugins/function-bind-polyfill'), included: true},
            {pattern: './bower_components/pubnub/web/*.*', included: true},
            {pattern: './bower_components/es6-promise/promise.js', included: true},
            {pattern: './bower_components/fetch/fetch.js', included: true},
            {pattern: './build/ringcentral.js', included: true},
            {pattern: './build/tests/specs.js', included: true}
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
            'karma-chai-plugins'
        ],

        singleRun: true,
        captureTimeout: 5000,
        browserNoActivityTimeout: 5000,
        requireJsShowNoTimestampsError: false

    });

};
