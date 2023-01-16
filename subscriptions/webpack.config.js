const createConfig = require('@ringcentral/sdk-utils/webpack');
const path = require('path');

module.exports = createConfig({
    filename: 'ringcentral-subscriptions',
    entry: './src/Subscriptions.ts',
    outputPath: path.resolve(__dirname, 'dist'),
    libraryName: 'Subscriptions',
    externals: {
        '@ringcentral/sdk': {
            commonjs: '@ringcentral/sdk',
            commonjs2: '@ringcentral/sdk',
            amd: 'ringcentral',
            root: 'RingCentral',
        },
    },
});
