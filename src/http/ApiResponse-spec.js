describe('RingCentral.http.ApiResponse', function() {

    function createResponse(sdk, json, status, statusText, headers) {
        var path = '/foo' + Date.now();
        apiCall('GET', '/restapi/v1.0' + path, json, status, statusText, headers);
        return sdk.platform().get(path);
    }

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

    describe('constructor tests', function() {

        it('parses OK headers into object', asyncTest(function(sdk) {

            return createResponse(sdk, '{}', 200, 'OK', jsonResponseHeaders).then(function(res) {
                expect(res._isJson()).to.equal(true);
            });

        }));

        it('parses Multi-Status headers into object', asyncTest(function(sdk) {

            return createResponse(sdk, '{}', 207, 'Multi-Status', multipartResponseHeaders).then(function(res) {
                expect(res._isMultipart()).to.equal(true);
            });

        }));

        it('calls the success callback after parsing a good multi-part/mixed response', asyncTest(function(sdk) {

            return createResponse(sdk, goodMultipartMixedResponse, 207, 'Multi-Status', multipartResponseHeaders).then(function(res) {
                return res.multipart();
            });

        }));

        it('calls the success callback for all individual parts that are parsed (including errors)', asyncTest(function(sdk) {

            return createResponse(sdk, multipartMixedResponseWithErrorPart, 207, 'Multi-Status', multipartResponseHeaders).then(function(res) {

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

            });

        }));

        it('calls the error callback if it fails to parse the parts info block', asyncTest(function(sdk) {

            return createResponse(sdk, badMultipartMixedResponse, 207, 'Multi-Status', multipartResponseHeaders).then(function(response) {
                expect(function() {
                    response.multipart();
                }).to.throw(Error);
            });

        }));

        it('calls the error callback if it is unable to parse the JSON data, passing the error object', asyncTest(function(sdk) {

            return createResponse(sdk, 'THIS IS JUNK', 200, 'OK', jsonResponseHeaders).then(function(response) {
                expect(function() {
                    response.json();
                }).to.throw(Error);
            });

        }));

        it('uses the error_description property of the JSON data when there is an error but no message property', asyncTest(function(sdk) {

            return createResponse(sdk, '{"error_description": "ERROR"}', 404, 'Error', jsonResponseHeaders).then(function(response) {
                throw new Error('This should never be reached');
            }).catch(function(e) {
                expect(e.apiResponse.error()).to.equal('ERROR');
            });

        }));

        it('uses the description property of the JSON data when there is an error but no message or error_description properties', asyncTest(function(sdk) {

            return createResponse(sdk, '{"description": "ERROR"}', 404, 'Error', jsonResponseHeaders).then(function(response) {
                throw new Error('This should never be reached');
            }).catch(function(e) {
                expect(e.apiResponse.error()).to.equal('ERROR');
            });

        }));

        it('parses empty response', asyncTest(function(sdk) {

            return createResponse(sdk, undefined, 204, 'No Content', jsonResponseHeaders).then(function(response) {
                expect(response.error()).to.equal(null);
                expect(response.json()).to.equal(null);
            });

        }));

    });

});
