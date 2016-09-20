import {expect} from "../test/test";
import SDK from "../SDK";

describe('RingCentral.core.Utils', function() {

    var utils = SDK.core.Utils;

    describe('parseQueryString & queryStringify', function() {

        it('parses queryStrings', function() {

            expect(utils.parseQueryString('foo=bar&bar=baz')).to.deep.equal({foo: 'bar', bar: 'baz'});
            expect(utils.parseQueryString('foo=bar&foo=baz')).to.deep.equal({foo: ['bar', 'baz']});
            expect(utils.parseQueryString('foo')).to.deep.equal({foo: ''});

        });

        it('builds queryStrings', function() {

            expect(utils.queryStringify({foo: 'bar', bar: 'baz'})).to.equal('foo=bar&bar=baz');
            expect(utils.queryStringify({foo: ['bar', 'baz']})).to.equal('foo=bar&foo=baz');

        });

        it('decodes pre-encoded string representation of object to be equal to original object', function() {

            function encodeDecode(v) {
                return utils.parseQueryString(utils.queryStringify(v));
            }

            var simple = {foo: 'bar'},
                array = {foo: ['bar', 'baz']};

            expect(encodeDecode(simple)).to.deep.equal(simple);
            expect(encodeDecode(array)).to.deep.equal(array);

        });

    });

    describe('delay', function() {

        it('delays the promise', async function() {
            var res = await utils.delay(1);
            expect(res).to.equal(null);
        });

    });


});
