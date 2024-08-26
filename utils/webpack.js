const webpack = require('webpack');

function createConfig({ entry, filename, outputPath, libraryName, externals }) {
    const common = {
        mode: 'production',
        devtool: 'source-map',
        entry,
        module: {
            rules: [
                {
                    test: /\.tsx?$/,
                    use: 'ts-loader',
                    exclude: /node_modules/,
                },
            ],
        },
        plugins: [
            // Workaround for Buffer is undefined:
            new webpack.ProvidePlugin({
                Buffer: ['buffer', 'Buffer'],
            }),
            // Workaround for process is undefined:
            new webpack.ProvidePlugin({
                process: 'process/browser',
            }),
        ],
        resolve: {
            extensions: ['.tsx', '.ts', '.js'],
            fallback: {
                crypto: require.resolve('crypto-browserify'),
                stream: require.resolve('stream-browserify'),
                vm: require.resolve('vm-browserify'),
                process: require.resolve('process/browser'),
                buffer: require.resolve('buffer'),
                events: require.resolve('events'),
                path: require.resolve('path-browserify'),
                url: require.resolve('url'),
            },
        },
        output: {
            path: outputPath,
            library: ['RingCentral', libraryName],
            libraryTarget: 'umd',
            libraryExport: 'default',
        },
        externals,
    };

    return [
        {
            ...common,
            output: {
                ...common.output,
                filename: filename + '.js',
            },
            optimization: {
                minimize: false,
            },
        },
        {
            ...common,
            output: {
                ...common.output,
                filename: filename + '.min.js',
            },
        },
    ];
}

module.exports = createConfig;
