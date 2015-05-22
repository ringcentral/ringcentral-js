var define = typeof define === 'function' && define.amd ? define : function (factory) {
    factory(require, exports, module);
};
define(function (require, exports, module) {
    exports.mocha = require('../test/mocha');
    var expect = exports.mocha.chai.expect;
    var spy = exports.mocha.sinon.spy;
    var mock = exports.mocha.mock;
    var rcsdk = exports.mocha.rcsdk;
    describe('RCSDK', function () {
        describe('actual connection', function () {
            it.skip('connects to sandbox', function (done) {
                this.timeout(10000);
                // Per SLA should be 3 seconds
                var server = exports.mocha.RCSDK.url.sandbox, rcsdk = new exports.mocha.RCSDK({
                        server: server,
                        appKey: '',
                        appSecret: ''
                    }), platform = rcsdk.getPlatform();
                platform.forceAuthentication();
                platform.apiCall({ url: '' }).then(function (ajax) {
                    expect(ajax.data.uri).to.equal(server + '/restapi/v1.0');
                    done();
                }).catch(function (e) {
                    done(e);
                });
            });
            it('connects to production', function (done) {
                this.timeout(10000);
                // Per SLA should be 3 seconds
                var server = exports.mocha.RCSDK.url.production, rcsdk = new exports.mocha.RCSDK({
                        server: server,
                        appKey: '',
                        appSecret: ''
                    }), platform = rcsdk.getPlatform();
                platform.forceAuthentication();
                platform.apiCall({ url: '' }).then(function (ajax) {
                    expect(ajax.data.uri).to.equal(server + '/restapi/v1.0');
                    done();
                }).catch(function (e) {
                    done(e);
                });
            });
        });
    });
});