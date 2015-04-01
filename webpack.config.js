var webpack = require('webpack'),
    path = require('path');

function getExternal(root, cjs) {
    var res = {};
    res[cjs] = {
        amd: cjs,
        commonjs: cjs,
        commonjs2: cjs,
        root: root
    };
    return res;
}

module.exports = {

    debug: true,
    devtool: '#source-map',

    entry: {
        'rc-sdk.js': './lib/browser.js'
    },

    output: {
        filename: './build/[name]',
        libraryTarget: 'umd', //TODO RCSDK.noConflict()
        library: 'RCSDK',
        sourcePrefix: ''
    },

    externals: [
        getExternal(['CryptoJS'], 'crypto-js/core'),
        getExternal(['CryptoJS', 'AES'], 'crypto-js/aes'),
        getExternal(['CryptoJS', 'mode', 'ECB'], 'crypto-js/mode-ecb'),
        getExternal('Promise', 'es6-promise'),
        getExternal('PUBNUB', 'pubnub')
    ],

    node: {
        buffer: false
    },

    plugins: [],

    watchDelay: 200

};
