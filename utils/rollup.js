const replace = require('rollup-plugin-replace');
const commonjs = require('rollup-plugin-commonjs');
const resolve = require('rollup-plugin-node-resolve');
const builtins = require('rollup-plugin-node-builtins');
const typescript = require('rollup-plugin-typescript2');
const sourcemaps = require('rollup-plugin-sourcemaps');

function createConfig(className, pkg) {

    return {
        input: './src/' + className + '.ts',
        output: {
            file: pkg.browser,
            format: 'umd',
            name: 'RingCentral' + className,
            sourcemap: true,
            globals: {
                '@ringcentral/sdk': 'RingCentralSDK',
                'pubnub': 'PubNub'
            },
            exports: 'named'
        },
        plugins: [
            //FIXME Replace with rollup-plugin-virtual @see https://github.com/rollup/rollup-plugin-virtual/issues/3
            replace({
                "require('../../package.json').version": JSON.stringify(pkg.version)
            }),
            typescript(),
            builtins(), // adds qs and events
            resolve(), // adds is-plain-object
            commonjs(), // support of commonjs modules
            sourcemaps(),
        ],
        external: ['pubnub', '@ringcentral/sdk']
    };

}

module.exports = createConfig;