function clone(obj) {

    return Object.keys(obj).reduce(function(res, v) {
        res[v] = obj[v];
        return res;
    }, {});

}

var config = clone(require('./webpack.config')),
    path = require('path');

config.entry = {'rc-sdk-bundle.js': './src/lib/RCSDK.ts'};

config.externals = clone(config.externals);
delete config.externals['crypto-js/core'];
delete config.externals['crypto-js/aes'];
delete config.externals['crypto-js/mode-ecb'];
delete config.externals['es6-promise'];
delete config.externals['pubnub'];

module.exports = config;