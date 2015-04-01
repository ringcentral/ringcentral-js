var config = JSON.parse(JSON.stringify(require('./webpack.config'))), // Make a clone
    path = require('path');

config.entry = {'rc-sdk-bundle.js': './lib/index.js'};

config.resolve = config.resolve || {};
config.resolve.alias = config.resolve.alias || {};
config.resolve.alias.pubnub = path.resolve('./bower_components/pubnub/web/pubnub.js');

delete config.externals['crypto-js/core'];
delete config.externals['crypto-js/aes'];
delete config.externals['crypto-js/mode-ecb'];
delete config.externals['es6-promise'];
delete config.externals['pubnub'];

module.exports = config;