/// <reference path="../test.ts" />

describe('RingCentral.http.Client', function() {

    "use strict";

    var expect = chai.expect;
    var spy = sinon.spy;

    function getClient(cb?) {

        var client = new RingCentral.sdk.http.Client();

        // hijack into private property to bypass any fetch-related stuff
        client['_loadResponse'] = cb ? cb : function() {
            return Promise.reject(new Error('No resolver provided for _loadResponse'));
        };

        return client;

    }

    describe('createRequest', function() {

        it('sets default headers & properties', function() {

            var request = RingCentral.sdk.http.Client.createRequest('http://foo/bar');

            expect(request.headers.get('Content-Type')).to.equal('application/json');
            expect(request.headers.get('Accept')).to.equal('application/json');

            expect(request.url).to.equal('http://foo/bar');
            expect(request.method).to.equal('GET');

        });

        it('validates the method', function() {

            expect(() => {
                RingCentral.sdk.http.Client.createRequest('http://foo/bar', {method: 'foo'});
            }).to.throw(Error);

        });

    });

    describe('send', function() {

        it('allows to read original response', function() {

            return getMock((sdk)=> {

                var platform = sdk.platform(),
                    path = '/restapi/xxx';

                sdk.mockRegistry().apiCall('GET', path, {foo: 'bar'});

                return platform
                    .get(path)
                    .then(function(ajax) {

                        var response = ajax.response();

                        // Must have same headers'n'stuff
                        expect(response.headers.get('Content-Type')).to.equal('application/json');
                        expect(response.status).to.equal(200);
                        expect(response.statusText).to.equal('OK');

                        return Promise.all([
                            <any>ajax.text(),
                            <any>response.text() // re-stream, should be no error here
                        ]);

                    })
                    .then(function(responses) {
                        expect(responses[0]).to.equal('{"foo":"bar"}');
                        expect(responses[1]).to.equal('{"foo":"bar"}');
                    });

            });

        });

    });

});
