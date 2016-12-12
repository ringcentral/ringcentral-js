describe('RingCentral.http.Client', function() {

    describe('createRequest', function() {

        it('sets default headers & properties for GET', asyncTest(function(sdk) {

            var request = sdk.platform().client().createRequest({url: 'http://foo/bar'});

            expect(request.headers.get('Content-Type')).to.equal('application/json');
            expect(request.headers.get('Accept')).to.equal('application/json');
            expect(request.url).to.equal('http://foo/bar');
            expect(request.method).to.equal('GET');

        }));

        it('sets default headers & properties for POST', asyncTest(function(sdk) {

            var request = sdk.platform().client().createRequest({url: 'http://foo/bar', method: 'POST', body: {foo: 'bar'}});

            expect(request.headers.get('Accept')).to.equal('application/json');
            expect(request.headers.get('Content-Type')).to.equal('application/json');
            expect(request.url).to.equal('http://foo/bar');
            expect(request.method).to.equal('POST');
            expect(request.originalBody).to.equal(JSON.stringify({foo: 'bar'}));

        }));

        it('validates the method', asyncTest(function(sdk) {

            expect(function() {
                sdk.platform().client().createRequest({url: 'http://foo/bar', method: 'foo'});
            }).to.throw(Error);

        }));

    });

});
