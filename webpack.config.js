(function() {

    process.env.NODE_ENV = 'production';

    var webpack = require('webpack');
    var path = require('path');

    module.exports = {

        context: __dirname,
        debug: true,
        devtool: '#source-map',
        target: 'web',

        entry: {
            'ringcentral': './src/SDK.js',
            'ringcentral.min': './src/SDK.js'
        },

        externals: [
            {'es6-promise': {amd: 'es6-promise'}},
            {'fetch-ponyfill': {amd: 'fetch-ponyfill'}},
            {'pubnub': {amd: 'pubnub'}}
        ],

        output: {
            library: ['RingCentral', 'SDK'],
            libraryTarget: 'umd',
            path: __dirname + '/build',
            publicPath: '/build/',
            sourcePrefix: '',
            filename: "[name].js",
            chunkFilename: "[id].chunk.js"
        },

        resolve: {
            extensions: ['', '.js'],
            alias: {
                //FIXME @see https://github.com/wheresrhys/fetch-mock/issues/150
                'fetch-mock/es5/server': 'fetch-mock/es5/client'
            }
        },

        module: {
            loaders: [
                {test: /\.json$/, loader: 'json'}
            ]
        },

        node: {
            http: false,
            Buffer: false,
            process: false,
            timers: false
        },

        plugins: [
            new webpack.optimize.UglifyJsPlugin({
                include: /\.min\.js$/,
                minimize: true
            }),
            new webpack.DefinePlugin({
                "process.env": {
                    NODE_ENV: JSON.stringify(process.env.NODE_ENV),
                    RCSDK_VERSION: JSON.stringify(require('./package.json').version)
                }
            })
        ]

    };

})();