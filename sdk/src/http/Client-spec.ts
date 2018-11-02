import {asyncTest, expect} from '../test/test';

describe('RingCentral.http.Client', () => {
    describe('createRequest', () => {
        it(
            'sets default headers & properties for GET',
            asyncTest(sdk => {
                const request = sdk
                    .platform()
                    .client()
                    .createRequest({url: 'http://foo/bar', query: {foo: 'foo'}});

                expect(request.headers.get('Content-Type')).to.equal('application/json');
                expect(request.headers.get('Accept')).to.equal('application/json');
                expect(request.url).to.equal('http://foo/bar?foo=foo');
                expect(request.method).to.equal('GET');
            })
        );

        it(
            'sets default headers & properties for POST',
            asyncTest(sdk => {
                const request = sdk
                    .platform()
                    .client()
                    .createRequest({url: 'http://foo/bar', method: 'POST', body: {foo: 'bar'}});

                expect(request.headers.get('Accept')).to.equal('application/json');
                expect(request.headers.get('Content-Type')).to.equal('application/json');
                expect(request.url).to.equal('http://foo/bar');
                expect(request.method).to.equal('POST');
                expect(request['originalBody']).to.equal(JSON.stringify({foo: 'bar'}));
            })
        );

        it(
            'validates the method',
            asyncTest(sdk => {
                expect(() => {
                    sdk.platform()
                        .client()
                        .createRequest({url: 'http://foo/bar', method: 'foo'});
                }).to.throw();
            })
        );
    });
});
