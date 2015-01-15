/**
 * This is a simple test file to ensure built version is working in NodeJS env
 */
(function(){

    var RCSDK = require('../build/rc-sdk'), // require of the build
        rcsdk = new RCSDK(),
        platform = rcsdk.getPlatform();

    platform.forceAuthentication();
    platform.server = 'https://platform.devtest.ringcentral.com';
    platform.apiKey = '';

    platform
        .apiCall({
            url: ''
        })
        .then(function(ajax) {
            console.log('HEADERS');
            console.log('-------');
            console.log(ajax.headers);
            console.log('DATA');
            console.log('----');
            console.log(ajax.data);
        })
        .catch(function(e) {
            console.error(e);
        });


})();