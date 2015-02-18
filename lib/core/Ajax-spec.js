describe('RCSDK.core.Ajax', function() {
    "use strict";

    describe('checkOptions method', function() {

        it('calls error callback if the URL is not specified or is falsy', function(done) {

            rcsdk.getAjax().send().catch(function(e) {
                expect(e).to.be.instanceOf(Error);
                done();
            });

        });

        it('defaults the method option to GET', function() {

            var ajax = rcsdk.getAjax().setOptions({url: '/foo/bar'});
            ajax.checkOptions();
            expect(ajax.options.method).to.equal('GET');

        });

        it('it uppercases the method option, if specified', function() {

            var ajax = rcsdk.getAjax().setOptions({url: '/foo/bar', method: 'get'});
            ajax.checkOptions();
            expect(ajax.options.method).to.equal('GET');

        });

        it('it uses the value of the async option, if specified', function() {

            var ajax = rcsdk.getAjax().setOptions({url: '/foo/bar', async: false});
            ajax.checkOptions();
            expect(ajax.options.async).to.equal(false);

        });

        it('it defaults the async option to true, if not specified', function() {

            var ajax = rcsdk.getAjax().setOptions({url: '/foo/bar'});
            ajax.checkOptions();
            expect(ajax.options.async).to.equal(true);

        });

        it('it defaults the post option to an empty string, if not specified', function() {

            var ajax = rcsdk.getAjax().setOptions({url: '/foo/bar'});
            ajax.checkOptions();
            expect(ajax.options.post).to.equal('');

        });

        it('it defaults the headers option to an empty object, and then merges it with the default headers', function() {

            var ajax = rcsdk.getAjax().setOptions({url: '/foo/bar'});
            ajax.checkOptions();
            expect(ajax.getRequestHeader('Accept')).to.equal('application/json');
            expect(ajax.getRequestHeader('Content-Type')).to.equal('application/json');

        });

        it('it merges the specified headers with the default headers, giving the specified headers priority', function() {

            var ajax = rcsdk.getAjax().setOptions({
                url: '/foo/bar',
                headers: {
                    'Accept': 'application/foo-bar',
                    'Transfer-Encoding': 'chunked'
                }
            });
            ajax.checkOptions();
            expect(ajax.getRequestHeader('Accept')).to.equal('application/foo-bar');
            expect(ajax.getRequestHeader('Content-Type')).to.equal('application/json');
            expect(ajax.getRequestHeader('Transfer-Encoding')).to.equal('chunked');

        });

        it('consumes the params specified in the get option, adds them to the URL, and then deletes the get option', function() {

            var ajax = rcsdk.getAjax().setOptions({
                url: '/foo/bar',
                get: {
                    baz: 'qux',
                    hello: 'world'
                }
            });
            ajax.checkOptions();
            expect(ajax.options).to.not.haveOwnProperty('get');
            expect(ajax.options.url).to.equal('/foo/bar?baz=qux&hello=world');

        })
    });

    describe('parseResponse method', function() {

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

            multipartResponseHeader = 'multipart/mixed; boundary=Boundary_1245_945802293_1394135045248',
            responseHeader = 'application/json';

        it('calls the success callback after parsing a good multi-part/mixed response', function() {

            var ajax = rcsdk.getAjax();

            ajax.response = goodMultipartMixedResponse;
            ajax.setResponseHeader('Content-Type', multipartResponseHeader);
            ajax.status = 200;

            var result = ajax.parseResponse();

            expect(result.error).to.equal(null);

        });

        it('calls the success callback for all individual parts that are parsed (including errors)', function() {

            var ajax = rcsdk.getAjax();

            ajax.response = multipartMixedResponseWithErrorPart;
            ajax.setResponseHeader('Content-Type', multipartResponseHeader);
            ajax.status = 200;

            var result = ajax.parseResponse();

            expect(result.error).to.equal(null);

            expect(ajax.data.length).to.equal(3);

            expect(ajax.data[0]).to.be.instanceOf(ajax.constructor);
            expect(ajax.data[0].error).to.be.equal(null);
            expect(ajax.data[0].data.foo).to.be.equal('bar');
            expect(ajax.data[0].status).to.be.equal(200);

            expect(ajax.data[1]).to.be.instanceOf(ajax.constructor);
            expect(ajax.data[1].error).to.be.instanceOf(Error);

            expect(ajax.data[2]).to.be.instanceOf(ajax.constructor);
            expect(ajax.data[2].error).to.be.equal(null);
            expect(ajax.data[2].data.baz).to.be.equal('qux');
            expect(ajax.data[2].status).to.be.equal(200);


        });

        it('does not call the error callback even if parts have an error status if overall response was parsed', function() {

            var ajax = rcsdk.getAjax();

            ajax.response = multipartMixedResponseWithErrorPart;
            ajax.setResponseHeader('Content-Type', multipartResponseHeader);
            ajax.status = 200;

            var result = ajax.parseResponse();

            expect(result.error).to.equal(null);

        });

        it('calls the error callback if it fails to parse the parts info block', function() {

            var ajax = rcsdk.getAjax();

            ajax.response = badMultipartMixedResponse;
            ajax.setResponseHeader('Content-Type', multipartResponseHeader);
            ajax.status = 200;

            ajax.parseResponse();

            expect(ajax.error).to.be.an.instanceof(Error);

        });

        it('calls the error callback if it is unable to parse the JSON data, passing the error object', function() {

            var ajax = rcsdk.getAjax();

            ajax.response = 'THIS IS JUNK AND CANNOT BE PARSED AS JSON';
            ajax.status = 200;
            ajax.setResponseHeader('Content-Type', responseHeader);

            ajax.parseResponse();

            expect(ajax.error).to.be.an.instanceof(Error);

        });

        it('uses the error_description property of the JSON data when there is an error but no message property', function() {

            var ajax = rcsdk.getAjax();

            ajax.response = '{"error_description": "THIS IS THE ERROR"}';
            ajax.status = 404;
            ajax.setResponseHeader('Content-Type', responseHeader);

            ajax.parseResponse();

            expect(ajax.error).to.be.an.instanceof(Error);
            expect(ajax.error.message).to.equal('THIS IS THE ERROR');

        });

        it('uses the description property of the JSON data when there is an error but no message or error_description properties', function() {

            var ajax = rcsdk.getAjax();

            ajax.response = '{"description": "THIS IS THE ERROR"}';
            ajax.status = 404;
            ajax.setResponseHeader('Content-Type', responseHeader);

            ajax.parseResponse();

            expect(ajax.error).to.be.an.instanceof(Error);
            expect(ajax.error.message).to.equal('THIS IS THE ERROR');

        });

    });

    describe('send', function() {

        it('calls the error callback if the transport reports an error with a request', function(done) {

            var ajax = rcsdk.getAjax().setOptions({
                url: '/foo/bar'
            });

            ajax.request = function() {
                return rcsdk.getContext().getPromise().reject(new Error('foo'));
            };

            ajax.send().then(function() {
                done(new Error('This should never be called'));
            }).catch(function(e) {
                expect(e).to.be.an.instanceOf(Error);
                expect(e.message).to.equal('foo');
                done();

            });

        });

        it('calls the error callback if the transport reports an error with a request', function(done) {

            var ajax = rcsdk.getAjax().setOptions({
                url: '/foo/bar'
            });

            ajax.request = function() {
                return rcsdk.getContext().getPromise().reject(new Error('foo'));
            };

            ajax.send().then(function() {
                done(new Error('This should never be called'));
            }).catch(function(e) {
                expect(e).to.be.an.instanceOf(Error);
                expect(e.message).to.equal('foo');
                done();

            });

        });

        describe('destroy', function() {

            it('aborts the native XHR object', function(done) {

                var ajax = rcsdk.getAjax();

                // Mock the XHR object

                ajax.xhr = {
                    abort: function() {
                        done();
                    }
                };

                ajax.destroy();

            });

        });

    });

});
