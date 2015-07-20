/// <reference path="../../../typings/externals.d.ts" />

export import mocha = require('../../../test/mocha');
import r = require('./Request');
var expect = mocha.chai.expect;
var rcsdk = mocha.mock.rcsdk;

describe('RCSDK.core.http.Request', function() {

    describe('send', function() {

        it('calls error callback if the URL is not specified or is falsy', function(done) {

            r.$get(rcsdk.getContext()).send().catch(function(e) {
                expect(e).to.be.instanceOf(Error);
                done();
            });

        });

    });

    describe('checkOptions', function() {

        it('defaults the method option to GET', function() {

            var ajax = r.$get(rcsdk.getContext()).setOptions({url: '/foo/bar'});
            ajax.checkOptions();
            expect(ajax.method).to.equal('GET');

        });

        it('it uppercases the method option, if specified', function() {

            var ajax = r.$get(rcsdk.getContext()).setOptions({url: '/foo/bar', method: 'get'});
            ajax.checkOptions();
            expect(ajax.method).to.equal('GET');

        });

        it('it uses the value of the async option, if specified', function() {

            var ajax = r.$get(rcsdk.getContext()).setOptions({url: '/foo/bar', async: false});
            ajax.checkOptions();
            expect(ajax.async).to.equal(false);

        });

        it('it defaults the async option to true, if not specified', function() {

            var ajax = r.$get(rcsdk.getContext()).setOptions({url: '/foo/bar'});
            ajax.checkOptions();
            expect(ajax.async).to.equal(true);

        });

        it('it defaults the headers option to an empty object, and then merges it with the default headers', function() {

            var ajax = r.$get(rcsdk.getContext()).setOptions({url: '/foo/bar'});
            ajax.checkOptions();
            expect(ajax.getHeader('Accept')).to.equal('application/json');
            expect(ajax.getHeader('Content-Type')).to.equal('application/json');

        });

        it('it merges the specified headers with the default headers, giving the specified headers priority', function() {

            var ajax = r.$get(rcsdk.getContext()).setOptions({
                url: '/foo/bar',
                headers: {
                    'Accept': 'application/foo-bar',
                    'Transfer-Encoding': 'chunked'
                }
            });
            ajax.checkOptions();
            expect(ajax.getHeader('Accept')).to.equal('application/foo-bar');
            expect(ajax.getHeader('Content-Type')).to.equal('application/json');
            expect(ajax.getHeader('Transfer-Encoding')).to.equal('chunked');

        });

    });

    describe('destroy', function() {

        it('aborts the native XHR object', function(done) {

            var ajax = r.$get(rcsdk.getContext());

            // Mock the XHR object

            ajax.xhr = <XMLHttpRequest> {
                abort: function() {
                    done();
                }
            };

            ajax.destroy();

        });

    });

});
