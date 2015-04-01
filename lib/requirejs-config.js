require.config({
    paths: {
        'es6-promise': '../bower_components/es6-promise-polyfill/promise',
        'pubnub': '../bower_components/pubnub/web/pubnub',
        'dom-storage': 'empty:',
        'xhr2': 'empty:'
    },
    packages: [
        {
            name: 'crypto-js',
            location: '../bower_components/crypto-js',
            main: 'core'
        }
    ],
    shim: {
        'pubnub': {
            exports: 'PUBNUB'
        }
    }
});