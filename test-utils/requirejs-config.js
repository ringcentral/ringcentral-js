require.config({
    paths: {
        'es6-promise': '../bower_components/es6-promise-polyfill/promise',
        'pubnub': '../bower_components/pubnub/web/pubnub',
    },
    packages: [
        {
            name: 'crypto-js',
            location: '../bower_components/crypto-js',
            main: 'index'
        }
    ],
    shim: {
        'pubnub': {
            exports: 'PUBNUB'
        }
    }
});