import {apiCall, asyncTest, expect, expectThrows} from '../test/test';

const createResponse = (sdk, json, status, statusText, headers): Response => {
    const path = `/restapi/v1.0/foo${Date.now()}`;
    apiCall('GET', path, json, status, statusText, headers);
    return sdk.platform().get(path);
};

describe('RingCentral.http.Client', () => {
    describe('createRequest', () => {
        it(
            'sets default headers & properties for GET',
            asyncTest(sdk => {
                const request = sdk.client().createRequest({url: 'http://foo/bar', query: {foo: 'foo'}});

                expect(request.headers.get('Content-Type')).toEqual('application/json');
                expect(request.url).toEqual('http://foo/bar?foo=foo');
                expect(request.method).toEqual('GET');
            }),
        );

        it(
            'sets default headers & properties for POST',
            asyncTest(sdk => {
                const request = sdk.client().createRequest({url: 'http://foo/bar', method: 'POST', body: {foo: 'bar'}});

                expect(request.headers.get('Content-Type')).toEqual('application/json');
                expect(request.url).toEqual('http://foo/bar');
                expect(request.method).toEqual('POST');
                expect(request['originalBody']).toEqual(JSON.stringify({foo: 'bar'}));
            }),
        );

        it(
            'validates the method',
            asyncTest(sdk => {
                expect(() => {
                    sdk.client().createRequest({url: 'http://foo/bar', method: 'foo'});
                }).toThrow();
            }),
        );
    });

    const goodMultipartMixedResponse =
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
        '--Boundary_1245_945802293_1394135045248--\n';
    const multipartMixedResponseWithErrorPart =
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
        '--Boundary_1245_945802293_1394135045248--\n';
    const badMultipartMixedResponse =
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
        '--Boundary_1245_945802293_1394135045248--\n';
    const multipartResponseHeaders = {
        'content-type': 'multipart/mixed; boundary=Boundary_1245_945802293_1394135045248',
    };
    const jsonResponseHeaders = {'content-type': 'application/json; encoding=utf8'};

    describe('constructor tests', () => {
        it(
            'parses OK headers into object',
            asyncTest(async sdk => {
                const res = await createResponse(sdk, '{}', 200, 'OK', jsonResponseHeaders);
                expect(sdk.client().isJson(res)).toEqual(true);
            }),
        );

        it(
            'parses Multi-Status headers into object',
            asyncTest(async sdk => {
                const res = await createResponse(sdk, '{}', 207, 'Multi-Status', multipartResponseHeaders);
                expect(sdk.client().isMultipart(res)).toEqual(true);
            }),
        );
    });

    describe('multipart', () => {
        it(
            'calls the success callback after parsing a good multi-part/mixed response',
            asyncTest(async sdk => {
                const res = await createResponse(
                    sdk,
                    goodMultipartMixedResponse,
                    207,
                    'Multi-Status',
                    multipartResponseHeaders,
                );
                await sdk.client().multipart(res);
            }),
        );

        it(
            'calls the success callback for all individual parts that are parsed (including errors)',
            asyncTest(async sdk => {
                const res = await createResponse(
                    sdk,
                    multipartMixedResponseWithErrorPart,
                    207,
                    'Multi-Status',
                    multipartResponseHeaders,
                );

                const multipart = await sdk.client().multipart(res);

                expect(multipart.length).toEqual(3);

                expect((await multipart[0].json()).foo).toEqual('bar');
                expect(multipart[0].status).toEqual(200);

                expect(sdk.client().error(multipart[1])).not.toEqual(null); //FIXME

                expect((await multipart[2].json()).baz).toEqual('qux');
                expect(multipart[2].status).toEqual(200);
            }),
        );

        it(
            'calls the error callback if it fails to parse the parts info block',
            asyncTest(async sdk => {
                const res = await createResponse(
                    sdk,
                    badMultipartMixedResponse,
                    207,
                    'Multi-Status',
                    multipartResponseHeaders,
                );

                await expectThrows(async () => {
                    await sdk.client().multipart(res);
                });
            }),
        );

        it(
            'calls the error callback if it is unable to parse the JSON data, passing the error object',
            asyncTest(async sdk => {
                const res = await createResponse(sdk, 'THIS IS JUNK', 200, 'OK', jsonResponseHeaders);
                await expectThrows(async () => {
                    await res.json();
                });
            }),
        );

        it(
            'uses the error_description property of the JSON data when there is an error but no message property',
            asyncTest(async sdk => {
                await expectThrows(async () => {
                    await createResponse(sdk, '{"error_description": "ERROR"}', 404, 'Error', jsonResponseHeaders);
                }, 'ERROR');
            }),
        );

        it(
            'uses the description property of the JSON data when there is an error but no message or error_description properties',
            asyncTest(async sdk => {
                await expectThrows(async () => {
                    await await createResponse(sdk, '{"description": "ERROR"}', 404, 'Error', jsonResponseHeaders);
                }, 'ERROR');
            }),
        );

        it(
            'throws an error when no body',
            asyncTest(async sdk => {
                await expectThrows(async () => {
                    const res = await createResponse(sdk, '', 207, 'Multi-Status', multipartResponseHeaders);
                    await sdk.client().multipart(res);
                }, 'No response body');
            }),
        );

        it(
            'throws an error when not multipart',
            asyncTest(async sdk => {
                await expectThrows(async () => {
                    const res = await createResponse(sdk, '', 207, 'Multi-Status', jsonResponseHeaders);
                    await sdk.client().multipart(res);
                }, 'Response is not multipart');
            }),
        );

        it(
            'throws an error when no boundary',
            asyncTest(async sdk => {
                await expectThrows(async () => {
                    const res = await createResponse(sdk, 'foobarbaz', 207, 'Multi-Status', {
                        'content-type': 'multipart/mixed',
                    });
                    await sdk.client().multipart(res);
                }, 'Cannot find boundary');
            }),
        );
    });

    describe('toMultipart', () => {
        it(
            'returns an array with self if not multipart',
            asyncTest(async sdk => {
                const res = await createResponse(sdk, '{}', 200, 'OK', jsonResponseHeaders);
                expect((await sdk.client().toMultipart(res))[0]).toEqual(res);
            }),
        );
    });
});
