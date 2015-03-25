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

    entry: ['./lib/browser'],

    output: {
        filename: './build/rc-sdk.js',
        libraryTarget: 'umd', //TODO RCSDK.noConflict()
        library: 'RCSDK',
        sourcePrefix: ''
    },

    externals: [
        getExternal("CryptoJS", "crypto-js"),
        getExternal("Promise", "es6-promise"),
        getExternal("PUBNUB", "pubnub")
    ],

    node: {
        buffer: false
    },

    plugins: [],

    watchDelay: 200

};
