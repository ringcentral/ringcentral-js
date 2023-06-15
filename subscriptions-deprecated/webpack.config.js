const createConfig = require('@ringcentral/sdk-utils/webpack');
const path = require('path');

module.exports = createConfig({
    filename: 'ringcentral-subscriptions-deprecated',
    entry: './src/Subscriptions.ts',
    outputPath: path.resolve(__dirname, 'dist'),
    libraryName: 'SubscriptionsDeprecated',
    externals: {
        '@ringcentral/sdk': {
            commonjs: '@ringcentral/sdk',
            commonjs2: '@ringcentral/sdk',
            amd: 'ringcentral',
            root: 'RingCentral',
        },
        pubnub: {
            commonjs: 'pubnub',
            commonjs2: 'pubnub',
            amd: 'pubnub',
            root: 'PubNub',
        },
    },
});
