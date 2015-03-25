module.exports = function(config) {

    config.set({

        basePath: '../',

        frameworks: [
            'mocha',
            'requirejs',
            'chai'
        ],

        files: [
            // specify but not include files
            {pattern: './build/**/*.js', included: false},
            {pattern: './test/lib/**/*.js', included: false},
            {pattern: './lib/*/**/*.js', included: false},
            {pattern: './lib/browser.js', included: false},
            {pattern: './lib/RCSDK.js', included: false},
            {pattern: './lib/RCSDK-spec.js', included: false},
            {pattern: './lib/test.js', included: false},
            {pattern: './bower_components/cryptojslib/**/*.js', included: false},
            {pattern: './bower_components/pubnub/web/*.*', included: false},
            {pattern: './bower_components/es6-promise-polyfill/*.*', included: false},
            {pattern: './node_modules/chai-spies/chai-spies.js', included: false},
            // include files
            {pattern: './test/phantomjs-bind.js', included: true},
            {pattern: './lib/requirejs-config.js', included: true},
            {pattern: './test/karma.js', included: true}
        ],

        exclude: [
            './lib/requirejs-wrap.js',
            './lib/index.js',
            './lib/index-test.js'
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
            './lib/browser.js': ['coverage'],
            './lib/RCSDK.js': ['coverage'],
            './lib/*/**/!(*spec).js': ['coverage']
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
            'karma-chai'
        ],

        singleRun: true,
        captureTimeout: 5000,
        browserNoActivityTimeout: 5000,
        requireJsShowNoTimestampsError: false

    });

};
