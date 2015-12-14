(function() {

    var webpack = require('webpack'),
        path = require('path'),
        externals = [
            {'resumer': createExternal('resumer')},
            {'mocha': createExternal('mocha')},
            {'chai': createExternal('chai', 'chai', 'chai')},
            {'sinon': createExternal('sinon', 'sinon', 'sinon')},
            {'sinon-chai': createExternal('sinon-chai', 'sinon-chai')}
        ],
        bundleExternals = [
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
                extensions: ['', '.js'],
                alias: {
                    'pubnub': require.resolve('./bower_components/pubnub/web/pubnub.js'),
                    'node-fetch': require.resolve('./bower_components/fetch/fetch.js'),
                    'es6-promise': require.resolve('./bower_components/es6-promise/promise.js')
                }
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
            }
        };

        Object.keys(conf).forEach(function(key) {
            config[key] = conf[key];
        });

        return config;

    }

    module.exports = [
        extendConfig({
            entry: {'ringcentral': ['babel-regenerator-runtime', './src/SDK.js']},
            externals: externals.concat(bundleExternals)
        }),
        extendConfig({
            entry: {'ringcentral-bundle': ['babel-regenerator-runtime', './src/SDK.js']},
            externals: externals
        }),
        extendConfig({
            entry: {'tests/ringcentral-tests': ['babel-regenerator-runtime', './src/test/glob.js']},
            externals: externals.concat(bundleExternals).concat([
                {'../SDK': createExternal('../ringcentral', '../ringcentral', ['RingCentral', 'SDK'])},
                {'./SDK': createExternal('../ringcentral', '../ringcentral', ['RingCentral', 'SDK'])}
            ])
        })
    ];

})();