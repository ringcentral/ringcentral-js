var config = JSON.parse(JSON.stringify(require('./webpack.config'))), // Make a clone
    path = require('path');

config.entry = {'rc-sdk-bundle.js': './lib/browser.js'};

config.resolve = config.resolve || {};
config.resolve.alias = config.resolve.alias || {};
config.resolve.alias.pubnub = path.resolve('./bower_components/pubnub/web/pubnub.js');

delete config.externals;

module.exports = config;