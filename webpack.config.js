var webpack = require('webpack'),
    path = require('path');

function getExternal(root, cjs, amd) {
    return {
        amd: amd || cjs,
        commonjs: cjs,
        commonjs2: cjs,
        root: root
    };
}

module.exports = {

    debug: true,
    devtool: '#source-map',

    entry: {
        'rc-sdk.js': './src/lib/RCSDK.ts'
    },

    output: {
        filename: './build/[name]',
        libraryTarget: 'umd', //TODO RCSDK.noConflict()
        library: 'RCSDK',
        sourcePrefix: ''
    },

    externals: {
        'crypto-js/core': getExternal(['CryptoJS'], 'crypto-js/core'),
        'crypto-js/aes': getExternal(['CryptoJS', 'AES'], 'crypto-js/aes'),
        'crypto-js/mode-ecb': getExternal(['CryptoJS', 'mode', 'ECB'], 'crypto-js/mode-ecb'),
        'es6-promise': getExternal('Promise', 'es6-promise'),
        'pubnub': getExternal('PUBNUB', 'pubnub'),
        'xhr2': getExternal('XMLHttpRequest', 'xhr2', 'exports'), // exports will give an empty var in AMD
        'dom-storage': getExternal('localStorage', 'dom-storage', 'exports')
    },

    resolve: {
        extensions: ['', '.ts', '.js', '.json'],
        alias: {
            //'crypto-js': path.resolve('./bower_components/crypto-js'),
            //'es6-promise': path.resolve('./bower_components/es6-promise/promise.js'), // or es6-promise-polyfill
            'pubnub': path.resolve('./bower_components/pubnub/web/pubnub.js') // smaller size than NPM version
        }
    },

    module: {
        loaders: [
            {
                test: /\.ts$/,
                loader: 'ts-loader?sourceMap&target=ES5'
            }
        ]
    },

    node: {
        buffer: false
    },

    plugins: [],

    watchDelay: 200

};
