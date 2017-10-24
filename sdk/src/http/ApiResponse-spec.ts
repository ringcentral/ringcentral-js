import {apiCall, asyncTest, expect, expectThrows} from "../test/test";

const createResponse = (sdk, json, status, statusText, headers) => {
    var path = '/foo' + Date.now();
    apiCall('GET', '/restapi/v1.0' + path, json, status, statusText, headers);
    return sdk.platform().get(path);
};

describe('RingCentral.http.ApiResponse', () => {

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

        multipartResponseHeaders = {'content-type': 'multipart/mixed; boundary=Boundary_1245_945802293_1394135045248'},
        jsonResponseHeaders = {'content-type': 'application/json; encoding=utf8'};

    describe('constructor tests', () => {

        it('parses OK headers into object', asyncTest(async sdk => {

            const res = await createResponse(sdk, '{}', 200, 'OK', jsonResponseHeaders);
            expect(res._isJson()).to.equal(true);

        }));

        it('parses Multi-Status headers into object', asyncTest(async sdk => {

            const res = await createResponse(sdk, '{}', 207, 'Multi-Status', multipartResponseHeaders);
            expect(res._isMultipart()).to.equal(true);

        }));

        it('calls the success callback after parsing a good multi-part/mixed response', asyncTest(async sdk => {

            const res = await createResponse(sdk, goodMultipartMixedResponse, 207, 'Multi-Status', multipartResponseHeaders);
            return res.multipart();

        }));

        it('calls the success callback for all individual parts that are parsed (including errors)', asyncTest(async sdk => {

            const res = await createResponse(sdk, multipartMixedResponseWithErrorPart, 207, 'Multi-Status', multipartResponseHeaders);

            expect(res.text()).to.equal(multipartMixedResponseWithErrorPart);

            var multipart = res.multipart();

            expect(multipart.length).to.equal(3);

            //expect(res.data[0]).to.be.instanceOf(r.Response); //FIXME
            expect(multipart[0].error()).to.be.equal(null);
            expect(multipart[0].json().foo).to.be.equal('bar');
            expect(multipart[0].response().status).to.be.equal(200);

            //expect(res.data[1]).to.be.instanceOf(r.Response); //FIXME
            expect(multipart[1].error()).to.be.not.equal(null);

            //expect(res.data[2]).to.be.instanceOf(r.Response); //FIXME
            expect(multipart[2].error()).to.be.equal(null);
            expect(multipart[2].json().baz).to.be.equal('qux');
            expect(multipart[2].response().status).to.be.equal(200);

        }));

        it('calls the error callback if it fails to parse the parts info block', asyncTest(async sdk => {

            const res = await createResponse(sdk, badMultipartMixedResponse, 207, 'Multi-Status', multipartResponseHeaders);

            expect(() => {
                res.multipart();
            }).to.throw();

        }));

        it('calls the error callback if it is unable to parse the JSON data, passing the error object', asyncTest(async sdk => {

            const res = await createResponse(sdk, 'THIS IS JUNK', 200, 'OK', jsonResponseHeaders);

            expect(() => {
                res.json();
            }).to.throw();

        }));

        it('uses the error_description property of the JSON data when there is an error but no message property', asyncTest(async sdk => {

            await expectThrows(async () => {
                await createResponse(sdk, '{"error_description": "ERROR"}', 404, 'Error', jsonResponseHeaders);
            }, 'ERROR');

        }));

        it('uses the description property of the JSON data when there is an error but no message or error_description properties', asyncTest(async sdk => {

            await expectThrows(async () => {
                await createResponse(sdk, '{"description": "ERROR"}', 404, 'Error', jsonResponseHeaders);
            }, 'ERROR');

        }));

        it.skip('parses empty response', asyncTest(async sdk => {

            const res = await createResponse(sdk, undefined, 204, 'No Content', jsonResponseHeaders);
            expect(res.error()).to.equal(null);
            expect(res.json()).to.equal(null);

        }));

    });

    describe('multipart', () => {

        it('throws an error when no body', asyncTest(async sdk => {

            await expectThrows(async () => {
                const res = await createResponse(sdk, '', 207, 'Multi-Status', multipartResponseHeaders);
                return res.multipart();
            }, 'No response body');

        }));

        it('throws an error when not multipart', asyncTest(async sdk => {

            await expectThrows(async () => {
                const res = await createResponse(sdk, '', 207, 'Multi-Status', jsonResponseHeaders);
                return res.multipart();
            }, 'Response is not multipart');

        }));

        it('throws an error when no boundary', asyncTest(async sdk => {

            await expectThrows(async () => {
                const res = await createResponse(sdk, 'foobarbaz', 207, 'Multi-Status', {'content-type': 'multipart/mixed'});
                return res.multipart();
            }, 'Cannot find boundary');

        }));

    });

    describe('toMultipart', () => {

        it('returns an array with self if not multipart', asyncTest(async sdk => {

            const res = await  createResponse(sdk, '{}', 200, 'OK', jsonResponseHeaders);
            expect(res.toMultipart()[0]).to.equal(res);

        }));

    });

    describe('text', () => {

        it('throws an error if not text', asyncTest(async sdk => {

            const res = await createResponse(sdk, '{}', 200, 'OK', {'content-type': 'foo'});
            expect(() => {
                res.text();
            }).to.throw('Response is not text');

        }));

    });

    describe('text', () => {

        it('throws an error if not json', asyncTest((sdk) => {

            return createResponse(sdk, '{}', 200, 'OK', multipartResponseHeaders).then(function(res) {
                expect(() => {
                    res.json();
                }).to.throw('Response is not JSON');
            });

        }));

    });

});
