module.exports = function(config) {

    var webpackConfig = require('./webpack.config')[0];

    delete webpackConfig.entry;
    // delete webpackConfig.externals;
    // delete webpackConfig.output.library;
    // delete webpackConfig.output.libraryTarget;
    webpackConfig.devtool = 'inline-source-map';

    require('./karma.conf')(config);

    config.set({

        webpack: webpackConfig,

        webpackMiddleware: {
            noInfo: true
        },

        files: config.files.slice(0, 4).concat([
            require.resolve('babel-regenerator-runtime'),
            './src/test/glob.js'
        ]),

        preprocessors: {
            './src/test/glob.js': ['webpack', 'sourcemap']
        },

        plugins: config.plugins.concat([
            'karma-sourcemap-loader',
            'karma-webpack'
        ]),

        reporters: ['mocha'],
        browsers: ['PhantomJS'],
        singleRun: false,
        autoWatch: true

    });

};
