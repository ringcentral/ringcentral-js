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
        'rc-sdk.js': './lib/index.js'
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
        'xhr2': getExternal('XMLHttpRequest', 'xhr2', 'empty:'),
        'dom-storage': getExternal('localStorage', 'dom-storage', 'empty:')
    },

    node: {
        buffer: false
    },

    plugins: [],

    watchDelay: 200

};
