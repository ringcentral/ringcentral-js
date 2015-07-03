var webpack = require('webpack'),
    path = require('path'),
    glob = require('glob'),
    libExternals = {
        'es6-promise': getExternal('Promise', 'es6-promise'),
        'pubnub': getExternal('PUBNUB', 'pubnub'),
        'xhr2': getExternal('XMLHttpRequest', 'xhr2', 'exports'), // exports will give an empty var in AMD
        'dom-storage': getExternal('localStorage', 'dom-storage', 'exports')
    },
    testExternals = {
        '../lib/RCSDK': getExternal('RCSDK', '../rc-sdk'),
        'soap': getExternal('soap'),
        'chai': getExternal('chai'),
        'sinon': getExternal('sinon'),
        'sinon-chai': getExternal('sinonChai', 'sinon-chai'),
        'mocha': getExternal('mocha')
    };

function getExternal(root, cjs, amd) {
    if (!cjs) cjs = root;
    return {
        amd: amd || cjs,
        commonjs: cjs,
        commonjs2: cjs,
        root: root
    };
}

function createConfig(config) {

    var result = {

        debug: true,
        devtool: '#source-map',

        output: {
            filename: './build/[name]',
            libraryTarget: 'umd', //TODO RCSDK.noConflict()
            library: 'RCSDK',
            sourcePrefix: ''
        },

        resolve: {
            extensions: ['', '.ts', '.js', '.json'],
            alias: {
                'es6-promise': path.resolve('./bower_components/es6-promise-polyfill/promise.js'),
                'pubnub': path.resolve('./bower_components/pubnub/web/pubnub.js') // smaller size than NPM version
            }
        },

        module: {
            loaders: [
                {
                    test: /\.ts$/,
                    loader: 'ts-loader?sourceMap&target=ES5' //TODO Use typescript-loader and tsconfig.json
                }
            ]
        },

        node: {
            buffer: false
        },

        plugins: [],

        watchDelay: 200

    };

    result.externals = config.externals;
    result.entry = config.entry;

    return result;

}

module.exports = [
    createConfig({
        entry: {
            'rc-sdk.js': ['./src/lib/RCSDK.ts'],
            'tests/specs.js': glob
                .sync('src/lib/**/*-spec.ts')
                .sort(function(a, b) { return b.localeCompare(a); })
                .concat('src/test/mocha.ts') // this one will be exported
                .map(function(f) {
                    return './' + f;
                }),
            'tests/specs-api.js': glob
                .sync('src/test/specs-api/**/*-spec.ts')
                .sort(function(a, b) { return b.localeCompare(a); })
                .concat('src/test/mocha-api.ts') // this one will be exported
                .map(function(f) {
                    return './' + f;
                })
        },
        externals: (function() {

            var externals = {};

            Object.keys(libExternals).forEach(function(key) {
                externals[key] = libExternals[key];
            });

            Object.keys(testExternals).forEach(function(key) {
                externals[key] = testExternals[key];
            });

            return externals;

        })()
    }),
    createConfig({
        entry: {
            'rc-sdk-bundle.js': './src/lib/RCSDK.ts'
        },
        externals: (function() {

            var externals = {};

            Object.keys(libExternals).forEach(function(key) {
                if (['es6-promise', 'pubnub'].indexOf(key) == -1) externals[key] = libExternals[key];
            });

            return externals;

        })()
    })
];

//console.log('Webpack Config');
//console.log(JSON.stringify(module.exports, null, 2));
