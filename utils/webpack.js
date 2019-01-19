function createConfig({entry, filename, outputPath, libraryName, externals}) {
    const common = {
        mode: 'production',
        devtool: '#source-map',
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
        resolve: {
            extensions: ['.tsx', '.ts', '.js'],
        },
        output: {
            path: outputPath,
            library: ['RingCentral', libraryName],
            libraryTarget: 'umd',
        },
        externals,
    };

    return [
        {
            ...common,
            output: {
                ...common.output,
                filename: filename + '.js'
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