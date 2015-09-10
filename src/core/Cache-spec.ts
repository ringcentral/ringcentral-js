/// <reference path="../test.ts" />

describe('RingCentral.core.Cache', function() {

    var expect = chai.expect;

    describe('getItem', function() {

        it('returns a previously set item', function() {

            var cache = new RingCentral.sdk.core.Cache({'rc-foo': '"bar"'});

            expect(cache.getItem('foo')).to.equal('bar');

        });

        it('returns null if item not found', function() {

            var cache = new RingCentral.sdk.core.Cache({});

            expect(cache.getItem('foo')).to.equal(null);

        });

    });

    describe('setItem', function() {

        it('sets an item in storage', function() {

            var cache = new RingCentral.sdk.core.Cache({});

            expect(cache.setItem('foo', {foo: 'bar'}).getItem('foo')).to.deep.equal({foo: 'bar'});

        });

    });

});
