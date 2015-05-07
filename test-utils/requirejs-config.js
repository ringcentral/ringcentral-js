requirejs.config({
    paths: {
        'es6-promise': '../bower_components/es6-promise-polyfill/promise',
        'pubnub': '../bower_components/pubnub/web/pubnub'
    },
    shim: {
        'pubnub': {
            exports: 'PUBNUB'
        }
    }
});