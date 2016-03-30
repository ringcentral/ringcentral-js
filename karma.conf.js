var path = require('path');

module.exports = function(config) {

    config.set({

        basePath: '.',

        frameworks: [
            'mocha',
            'chai',
            'sinon-chai'
        ],

        files: [
            require.resolve('karma-chai-plugins/function-bind-polyfill'),
            require.resolve('whatwg-fetch/fetch'),
            require.resolve('es6-promise/dist/es6-promise.js'),
            require.resolve('pubnub/modern/dist/pubnub.js'),
            './build/ringcentral.js',
            './build/tests/ringcentral-tests.js'
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

        logLevel: config.LOG_WARN,

        preprocessors: {
            './build/*.js': ['coverage']
        },

        browsers: [
            process.env.CI || process.env.TRAVIS ? 'ChromeTravis' : 'Chrome',
            'Firefox',
            'PhantomJS'
        ],

        plugins: [
            'karma-chai-plugins',
            'karma-chrome-launcher',
            'karma-coverage',
            'karma-firefox-launcher',
            'karma-html-reporter',
            'karma-mocha',
            'karma-mocha-reporter',
            'karma-phantomjs-launcher'
        ],

        customLaunchers: {
            ChromeTravis: {
                base: 'Chrome',
                flags: ['--no-sandbox']
            }
        },

        client: {
            captureConsole: true,
            showDebugMessages: true,
            mocha: {
                ui: 'bdd',
                timeout: 5000

            }
        },

        singleRun: true

    });

};
