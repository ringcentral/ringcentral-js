(function() {

    var webpack = require('webpack'),
        path = require('path'),
        externals = [
            {'mocha': createExternal('mocha')},
            {'chai': createExternal('chai', 'chai', 'chai')},
            {'sinon': createExternal('sinon', 'sinon', 'sinon')},
            {'sinon-chai': createExternal('sinon-chai', 'sinon-chai')},
            {'pubnub': createExternal('pubnub', 'pubnub')},
            {'es6-promise': createExternal('es6-promise')},
            {'node-fetch': createExternal('node-fetch')}
        ];

    function createExternal(cjs, amd, root) {
        var ext = {};
        if (cjs) ext['commonjs'] = cjs;
        if (cjs) ext['commonjs2'] = cjs;
        if (amd) ext['amd'] = amd;
        if (root) ext['root'] = root;
        return ext;
    }

    function extendConfig(conf) {

        var config = {
            context: __dirname,
            debug: true,
            devtool: '#source-map',
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
                extensions: ['', '.js']
            },
            module: {
                loaders: [
                    {test: /\.js$/, loader: 'babel?cacheDirectory', include: path.join(__dirname, 'src')}
                ]
            },
            node: {
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
                    VERSION: JSON.stringify(require('./package.json').version)
                })
            ]
        };

        Object.keys(conf).forEach(function(key) {
            config[key] = conf[key];
        });

        return config;

    }

    module.exports = [
        extendConfig({
            entry: {
                'ringcentral': ['./src/SDK.js'],
                'ringcentral.min': ['./src/SDK.js']
            },
            externals: externals
        }),
        extendConfig({
            entry: {'tests/ringcentral-tests': ['./src/test/glob.js']},
            externals: externals.concat([
                {'../SDK': createExternal('../ringcentral', '../ringcentral', ['RingCentral', 'SDK'])},
                {'./SDK': createExternal('../ringcentral', '../ringcentral', ['RingCentral', 'SDK'])}
            ])
        })
    ];

})();