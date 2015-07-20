/// <reference path="../../../typings/externals.d.ts" />

export import mocha = require('../../../test/mocha');
import r = require('./Response');
var expect = mocha.chai.expect;
var rcsdk = mocha.mock.rcsdk;

describe('RCSDK.core.http.Response', function() {

    "use strict";

    describe('constructor tests', function() {

        var goodMultipartMixedResponse =
                '--Boundary_1245_945802293_1394135045248\n' +
                'Content-Type: application/json\r\n' +
                '\r\n' +
                '{\n' +
                '  "response" : [ {\n' +
                '    "status" : 200\n' +
                '  }, {\n' +
                '    "status" : 200\n' +
                '  } ]\n' +
                '}\n' +
                '--Boundary_1245_945802293_1394135045248\n' +
                'Content-Type: application/json\n' +
                '\n' +
                '{\n' +
                '  "foo" : "bar"\n' +
                '}\n' +
                '--Boundary_1245_945802293_1394135045248\n' +
                'Content-Type: application/json\n' +
                '\n' +
                '{\n' +
                '  "baz" : "qux"\n' +
                '}\n' +
                '--Boundary_1245_945802293_1394135045248--\n',

            multipartMixedResponseWithErrorPart =
                '--Boundary_1245_945802293_1394135045248\n' +
                'Content-Type: application/json\n' +
                '\n' +
                '{\n' +
                '  "response" : [ {\n' +
                '    "status" : 200\n' +
                '  }, {\n' +
                '    "status" : 404\n' +
                '  }, {\n' +
                '    "status" : 200\n' +
                '  } ]\n' +
                '}\n' +
                '--Boundary_1245_945802293_1394135045248\n' +
                'Content-Type: application/json\n' +
                '\n' +
                '{\n' +
                '  "foo" : "bar"\n' +
                '}\n' +
                '--Boundary_1245_945802293_1394135045248\n' +
                'Content-Type: application/json\n' +
                '\n' +
                '{\n' +
                '  "message" : "object not found"\n' +
                '}\n' +
                '--Boundary_1245_945802293_1394135045248\n' +
                'Content-Type: application/json\n' +
                '\n' +
                '{\n' +
                '  "baz" : "qux"\n' +
                '}\n' +
                '--Boundary_1245_945802293_1394135045248--\n',

            badMultipartMixedResponse =
                '--Boundary_1245_945802293_1394135045248\n' +
                'Content-Type: application/json\n' +
                '\n' +
                'THIS IS JUNK AND CANNOT BE PARSED AS JSON\n' +
                '--Boundary_1245_945802293_1394135045248\n' +
                'Content-Type: application/json\n' +
                '\n' +
                '{\n' +
                '  "foo" : "bar"\n' +
                '}\n' +
                '--Boundary_1245_945802293_1394135045248\n' +
                'Content-Type: application/json\n' +
                '\n' +
                '{\n' +
                '  "baz" : "qux"\n' +
                '}\n' +
                '--Boundary_1245_945802293_1394135045248--\n',

            multipartResponseHeaders = <any>{
                'content-type': 'multipart/mixed; boundary=Boundary_1245_945802293_1394135045248'
            },
            jsonResponseHeaders = <any>{
                'content-type': 'application/json; encoding=utf8'
            };


        it('parses headers into object', function() {

            expect(r.$get(rcsdk.getContext(), 200, 'OK', '{}', jsonResponseHeaders).isJson()).to.equal(true);
            expect(r.$get(rcsdk.getContext(), 207, 'Multi-Status', '{}', multipartResponseHeaders).isMultipart()).to.equal(true);

        });

        it('calls the success callback after parsing a good multi-part/mixed response', function() {

            var response = r.$get(rcsdk.getContext(), 207, 'Multi-Status', goodMultipartMixedResponse, multipartResponseHeaders);

            expect(response.error).to.equal(null);

        });

        it('calls the success callback for all individual parts that are parsed (including errors)', function() {

            var res = r.$get(rcsdk.getContext(), 207, 'Multi-Status', multipartMixedResponseWithErrorPart, multipartResponseHeaders);

            expect(res.error).to.equal(null);

            expect(res.data.length).to.equal(3);

            //expect(res.data[0]).to.be.instanceOf(r.Response); //FIXME
            expect(res.data[0].error).to.be.equal(null);
            expect(res.data[0].data.foo).to.be.equal('bar');
            expect(res.data[0].status).to.be.equal(200);

            //expect(res.data[1]).to.be.instanceOf(r.Response); //FIXME
            expect(res.data[1].error).to.be.instanceOf(Error);

            //expect(res.data[2]).to.be.instanceOf(r.Response); //FIXME
            expect(res.data[2].error).to.be.equal(null);
            expect(res.data[2].data.baz).to.be.equal('qux');
            expect(res.data[2].status).to.be.equal(200);


        });

        it('calls the error callback if it fails to parse the parts info block', function() {

            var response = r.$get(rcsdk.getContext(), 207, 'Multi-Status', badMultipartMixedResponse, multipartResponseHeaders);

            expect(response.error).to.be.an.instanceof(Error);

        });

        it('calls the error callback if it is unable to parse the JSON data, passing the error object', function() {

            var response = r.$get(rcsdk.getContext(), 200, 'OK', 'THIS IS JUNK', jsonResponseHeaders);

            expect(response.error).to.be.an.instanceof(Error);
            expect(response.body).to.equal('THIS IS JUNK');

        });

        it('uses the error_description property of the JSON data when there is an error but no message property', function() {

            var response = r.$get(rcsdk.getContext(), 404, 'Error', '{"error_description": "ERROR"}', jsonResponseHeaders);

            expect(response.error).to.be.an.instanceof(Error);
            expect(response.error.message).to.equal('ERROR');

        });

        it('uses the description property of the JSON data when there is an error but no message or error_description properties', function() {

            var response = r.$get(rcsdk.getContext(), 404, 'Error', '{"description": "ERROR"}', jsonResponseHeaders);

            expect(response.error).to.be.an.instanceof(Error);
            expect(response.error.message).to.equal('ERROR');

        });

        it('parses empty response', function() {

            var response = r.$get(rcsdk.getContext(), 204, 'No Content', '', jsonResponseHeaders);

            expect(response.error).to.equal(null);
            expect(response.data).to.equal('');

        });

        it('parses empty response', function() {

            var response = r.$get(rcsdk.getContext(), 200, 'OK', '{"foo":"bar"}', null);

            expect(response.error).to.equal(null);
            expect(response.data).to.deep.equal({foo: 'bar'});
            expect(response.getHeader('content-type')).to.equal('application/json');

        });

    });

});
