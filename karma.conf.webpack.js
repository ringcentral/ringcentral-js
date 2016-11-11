module.exports = function(config) {

    var webpackConfig = require('./webpack.config');
    var karmaConf = require('./karma.conf');

    delete webpackConfig.entry;
    webpackConfig.externals = ['sinon', 'chai', 'sinon-chai']; // these are provided by plugins
    webpackConfig.devtool = 'inline-source-map';

    karmaConf(config);

    config.set({

        webpack: webpackConfig,

        webpackMiddleware: {
            noInfo: true
        },

        files: [
            require.resolve('whatwg-fetch/fetch') //FIXME We need to add it manually for fetch-mock
        ].concat(karmaConf.specs),

        preprocessors: {
            './src/test/test.js': ['webpack', 'sourcemap']
        },

        plugins: config.plugins.concat([
            'karma-sourcemap-loader',
            'karma-webpack'
        ]),

        reporters: ['mocha'],
        browsers: ['PhantomJS']

    });

};
