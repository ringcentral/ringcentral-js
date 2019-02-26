const createConfig = require('@ringcentral/sdk-utils/webpack');
const path = require('path');

module.exports = createConfig({
    filename: 'ringcentral',
    entry: './src/SDK.ts',
    outputPath: path.resolve(__dirname, 'dist'),
    libraryName: 'SDK',
});
