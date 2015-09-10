/// <reference path="../build/ringcentral.d.ts" />
/// <reference path="./externals.d.ts" />

function getSdk() {

    var sdk = new RingCentral.sdk.SDK({
        server: 'http://whatever',
        appKey: 'whatever',
        appSecret: 'whatever',
        useHttpMock: true,
        usePubnubMock: true
    });

    sdk.platform()['_queue'].setPollInterval(1).setReleaseTimeout(50);
    sdk.platform()['_refreshDelayMs'] = 1;

    return sdk;

}

function getMock(fn:(sdk:RingCentral.sdk.SDK)=>Promise<any>):Promise<any> {

    var sdk = getSdk();

    sdk.mockRegistry().authentication();

    function clean() {
        sdk.cache().clean();
    }

    return sdk.platform()
        .login({
            username: 'whatever',
            password: 'whatever'
        })
        .then(() => {
            return fn(sdk);  // do the test
        })
        .then(clean)
        .catch((e) => {
            clean();
            throw e;
        });

}