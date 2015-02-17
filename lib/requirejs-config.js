require.config({
    paths: {
        'es6-promise': '../bower_components/es6-promise-polyfill/promise',
        'pubnub': '../bower_components/pubnub/web/pubnub'
    },
    packages: [
        {
            name: 'crypto-js',
            location: '../bower_components/cryptojslib',
            main: 'components/mode-ecb'
        }
    ],
    shim: {
        'pubnub': {
            exports: 'PUBNUB',
            deps: ['crypto-js/rollups/aes', 'crypto-js/rollups/sha256']
        },
        'crypto-js/components/mode-ecb': {
            exports: 'CryptoJS',
            deps: ['crypto-js/rollups/aes', 'crypto-js/rollups/sha256']
        }
    }
});