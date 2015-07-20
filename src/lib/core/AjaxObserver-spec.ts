/// <reference path="../../typings/externals.d.ts" />

export import mocha = require('../../test/mocha');
var expect = mocha.chai.expect;
var spy = mocha.sinon.spy;
var mock = mocha.mock;
var rcsdk = mocha.rcsdk;

describe('RCSDK.core.AjaxObserver', function() {

    var o = rcsdk.getAjaxObserver(),
        platform = rcsdk.getPlatform(),
        path = '/restapi/xxx';

    describe('events fire when Ajax happen', function() {

        mock.registerHooks(this);

        afterEach(function() {
            o.offAll();
        });

        beforeEach(function() {
            o.offAll();
        });

        it('beforeRequest', function(done) {

            mock.apiCall(path, {});

            var xspy = spy(function(ajax) {});

            o.on(o.events.beforeRequest, xspy);

            platform
                .apiCall({url: path})
                .then(function() {
                    expect(xspy).to.be.calledOnce;
                    done();
                })
                .catch(function(e) { done(e); });

        });

        it('requestSuccess', function(done) {

            mock.apiCall(path, {});

            var xspy = spy(function(ajax) {});

            o.on(o.events.requestSuccess, xspy);

            platform
                .apiCall({url: path})
                .then(function() {
                    expect(xspy).to.be.calledOnce;
                    done();
                })
                .catch(function(e) { done(e); });

        });

        it('requestError', function(done) {

            var xspy = spy(function(ajax) {});

            o.on(o.events.requestError, xspy);

            platform
                .apiCall({url: path})
                .then(function() {
                    done(new Error('This should never be reached'));
                })
                .catch(function(e) {
                    expect(xspy).to.be.calledOnce;
                    done();
                });

        });

    });

});
