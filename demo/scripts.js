(function() {

    /**
     * @return {RingCentral.SDK}
     */
    window.getSDK = function() {

        var appKey = localStorage.getItem('ringcentral-demo-appKey');
        var appSecret = localStorage.getItem('ringcentral-demo-appSecret');
        var server = localStorage.getItem('ringcentral-demo-server');

        if (!appSecret || !appKey || !server) {
            if (location.href.indexOf('apiKey.html') == -1) {
                location.assign('apiKey.html');
            }
        }

        var sdk = new RingCentral.SDK({
            server: server,
            appKey: appKey,
            appSecret: appSecret,
            appName: 'Demo',
            appVersion: RingCentral.SDK.version,
            redirectUri: decodeURIComponent(window.location.href.split('login', 1) + 'oauth/redirect.html')
        });

        var platform = sdk.platform();

        platform.on(platform.events.refreshError, function() {
            if (location.href.indexOf('login.html') == -1) {
                location.assign('login.html');
            }
        });

        platform.on(platform.events.logoutSuccess, function() {
            if (location.href.indexOf('login.html') == -1) {
                location.assign('login.html');
            }
        });

        return sdk;

    };

})();