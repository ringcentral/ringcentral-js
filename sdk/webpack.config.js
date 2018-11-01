const createConfig = require('@ringcentral/sdk-utils/webpack');
const path = require('path');

module.exports = createConfig({
    filename: 'ringcentral',
    entry: './src/SDK.ts',
    outputPath: path.resolve(__dirname, 'dist'),
    libraryName: 'sdk',
    externals: {
        'dom-storage': {
            commonjs: 'dom-storage',
            commonjs2: 'dom-storage',
            amd: null,
            root: null
        }
    }

});