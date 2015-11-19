module.exports = function(config) {

    var webpackConfig = require('../webpack.config')[0];

    delete webpackConfig.entry;
    //delete webpackConfig.externals;
    delete webpackConfig.output.library;
    delete webpackConfig.output.libraryTarget;
    webpackConfig.devtool = 'inline-source-map';

    config.set({
        basePath: '../',
        frameworks: ['mocha', 'chai', 'sinon-chai'],
        files: [
            require.resolve('karma-chai-plugins/function-bind-polyfill'),
            './bower_components/pubnub/web/pubnub.js',
            './bower_components/es6-promise/promise.js',
            './bower_components/fetch/fetch.js',
            './src/test/glob.js'
        ],
        preprocessors: {
            './src/test/glob.js': ['webpack', 'sourcemap']
        },
        webpack: webpackConfig,
        webpackMiddleware: {
            noInfo: true
        },
        exclude: [],
        reporters: ['mocha'],
        port: 9876,
        colors: true,
        logLevel: config.LOG_INFO,
        autoWatch: true,
        plugins: [
            'karma-chrome-launcher',
            'karma-mocha',
            'karma-mocha-reporter',
            'karma-phantomjs-launcher',
            'karma-chai-plugins',
            'karma-webpack',
            'karma-sourcemap-loader'
        ],
        browsers: [
            //'Chrome',
            'PhantomJS'
        ],
        singleRun: false,
        client: {
            captureConsole: true,
            showDebugMessages: true,
            mocha: {
                ui: "bdd",
                timeout: 5000

            }
        }
    })
};
