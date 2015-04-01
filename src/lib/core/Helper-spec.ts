/// <reference path="../../typings/externals.d.ts" />

export import mocha = require('../../test/mocha');
import r = require('./http/Response');
var expect = mocha.chai.expect;
var spy = mocha.sinon.spy;
var mock = mocha.mock;
var rcsdk = mocha.rcsdk;

describe('RCSDK.core.Helper', function() {

    'use strict';

    var Helper = rcsdk.getHelper(),
        defaultUrl = 'default',
        defaultSyncUrl = 'default-sync';

    function attachSpy(suite) {

        suite.beforeEach(function() {
            this._createUrl = Helper.createUrl.bind(Helper);
            Helper.createUrl = spy(function(options) {
                options = options || {};
                return (options.sync ? defaultSyncUrl : defaultUrl);
            });
        });

        suite.afterEach(function() {
            Helper.createUrl = this._createUrl;
        });

    }

    describe('getId', function() {

        it('return value of object.id', function() {

            expect(Helper.getId({id: 'foo'})).to.equal('foo');
            expect(Helper.getId({})).to.be.an('undefined');

        });

    });

    describe('isNew', function() {

        it('returns true if object does not have id or url', function() {

            expect(Helper.isNew({id: 'foo'})).to.equal(true);
            expect(Helper.isNew({uri: 'foo'})).to.equal(true);
            expect(Helper.isNew({})).to.equal(true);
            expect(Helper.isNew({id: 'foo', uri: 'bar'})).to.equal(false);

        });

    });

    describe('loadRequest', function() {

        attachSpy(this);

        it('provides given url, if not - object.url, if not - default url', function() {

            expect(Helper.loadRequest({uri: 'object-uri'}, {url: 'given-url'}).url).to.equal('given-url');
            expect(Helper.loadRequest(null, {url: 'given-url'}).url).to.equal('given-url');
            expect(Helper.loadRequest({uri: 'object-uri'}).url).to.equal('object-uri');
            expect(Helper.loadRequest().url).to.equal(defaultUrl);
            expect(Helper.createUrl).to.be.calledOnce;

        });

    });

    describe('saveRequest', function() {

        attachSpy(this);

        it('provides given url, if not - object.url, if not - default url', function() {

            expect(Helper.saveRequest({uri: 'object-uri'}, {url: 'given-url'}).url).to.equal('given-url');
            expect(Helper.saveRequest({uri: 'object-uri'}).url).to.equal('object-uri');
            expect(Helper.saveRequest({}, {}).url).to.equal(defaultUrl);
            expect(Helper.createUrl).to.be.calledOnce;

        });

        it('throws exceptions if no object is provided', function() {

            expect(function() { Helper.saveRequest(); }).to.throw(Error);

        });

    });

    describe('deleteRequest', function() {

        attachSpy(this);

        it('provides given url, if not - object.url, if not - exception', function() {

            expect(Helper.deleteRequest({uri: 'object-uri'}, {url: 'given-url'}).url).to.equal('given-url');
            expect(Helper.deleteRequest({uri: 'object-uri'}).url).to.equal('object-uri');
            expect(function() { Helper.deleteRequest({}); }).to.throw(Error);

        });

        it('throws exceptions if no object is provided', function() {

            expect(function() { Helper.deleteRequest(); }).to.throw(Error);

        });

    });

    describe('syncRequest', function() {

        attachSpy(this);

        it('provides default sync url if nothing was given', function() {

            expect(Helper.syncRequest({url: 'given-url'}).url).to.equal('given-url');
            expect(Helper.syncRequest().url).to.equal(defaultSyncUrl);
            expect(Helper.createUrl).to.be.calledOnce;

        });

        it('sets syncType to FSync if no syncToken was given', function() {

            expect(Helper.syncRequest().query.syncType).to.equal('FSync');

        });

        it('sets syncType to ISync if syncToken was given and deletes all other options.get', function() {

            var options = {
                    get: {
                        syncToken: 'foo',
                        foo: 'foo'
                    }
                },
                request = Helper.syncRequest(options);

            expect(request.query.foo).to.be.an('undefined');
            expect(request.query.syncType).to.equal('ISync');
            expect(request.query.syncToken).to.equal(options.get.syncToken);

        });

    });
    describe('index', function() {

        it('creates an indexed object of given array items', function() {

            var array = [
                    {id: 'foo', name: 'foo'},
                    {id: 'bar', name: 'bar'}
                ],
                index = <any>Helper.index(array);

            expect(index.foo).to.equal(array[0]);
            expect(index.bar).to.equal(array[1]);

        });

        it('creates an indexed object using given getId callback of given array items', function() {

            // array items should not have name property to ensure test is real
            var array = [
                    {name: 'foo'},
                    {name: 'bar'}
                ],
                index = <any>Helper.index(array, function(item:any) { return item.name; });

            expect(index.foo).to.equal(array[0]);
            expect(index.bar).to.equal(array[1]);

        });

        it('if two or more items have same id the first wins by default', function() {

            var array = [
                    {id: 'foo', name: 'foo'},
                    {id: 'foo', name: 'bar'}
                ],
                index = <any>Helper.index(array);

            expect(index.foo).to.equal(array[0]);
            expect(Object.keys(index)).to.deep.equal(['foo']);
            expect(Object.keys(index).length).to.equal(1);

        });

        it('if two or more items have same id resulting index will contain an array of them if flag is provided', function() {

            var array = [
                    {id: 'foo', name: 'foo'},
                    {id: 'foo', name: 'bar'}
                ],
                index = <any>Helper.index(array, null, true);

            expect(index.foo).to.deep.equal(array);

            expect(Object.keys(index)).to.deep.equal(['foo']);
            expect(Object.keys(index).length).to.equal(1);

        });

        it('if items do not have id resulting index will not contain them', function() {

            var array = [
                    {id: 'foo', name: 'foo'},
                    {name: 'bar'}
                ],
                index = <any>Helper.index(array);

            expect(index.foo).to.equal(array[0]);
            expect(Object.keys(index)).to.deep.equal(['foo']);
            expect(Object.keys(index).length).to.equal(1);

        });

    });

    describe('merge', function() {

        it('replaces target items with supplement ones if they same ids, original target items stay untouched', function() {

            var target = [
                    {id: 'foo', name: 'foo'},
                    {id: 'bar', name: 'bar'}
                ],
                supplement = [
                    {id: 'foo', name: 'foo-x'}
                ],
                merged = Helper.merge(target, supplement);

            // merged first item belongs to supplement
            expect(merged[0]).to.equal(supplement[0]);

            // target item is not in merged array
            expect(merged.indexOf(target[0])).to.equal(-1);

            expect(merged[0].id).to.equal('foo');
            expect(merged[0].name).to.equal('foo-x');

            // target item stays untouched
            expect(target[0].name).to.equal('foo');

            expect(merged.length).to.equal(2);

        });

        it('applies properties of supplement to target items if they have same ids (target items are mutated)', function() {

            var target = [
                    {id: 'foo', name: 'foo'},
                    {id: 'bar', name: 'bar'}
                ],
                supplement = [
                    {id: 'foo', name: 'foo-x'}
                ],
                merged = Helper.merge(target, supplement, null, true);

            // merged first item belongs to target
            expect(merged[0]).to.not.equal(supplement[0]);
            expect(merged[0]).to.equal(target[0]);

            // merged item has new properties and proper id
            expect(merged[0].id).to.equal('foo');
            expect(merged[0].name).to.equal('foo-x');

            // target item was mutated
            expect(target[0].name).to.equal('foo-x');

            expect(merged.length).to.equal(2);

        });

        it('allows to provide custom getId function)', function() {

            var target = [
                    {id: 'foo', name: 'foo'},
                    {id: 'bar', name: 'bar'}
                ],
                supplement = [
                    {id: 'foo-x', name: 'foo'}
                ],
                merged = Helper.merge(target, supplement, function(item:any) { return item.name; });

            // merged first item belongs to supplement
            expect(merged[0]).to.equal(supplement[0]);

            // target item is not in merged array
            expect(merged.indexOf(target[0])).to.equal(-1);

            // merged item has new properties and proper id
            expect(merged[0].name).to.equal('foo');
            expect(merged[0].id).to.equal('foo-x');

            // target item stays untouched
            expect(target[0].id).to.equal('foo');

            expect(merged.length).to.equal(2);

        });

        it('appends supplement', function() {

            var target = [
                    {id: 'foo', name: 'foo'},
                    {id: 'bar', name: 'bar'}
                ],
                supplement = [
                    {id: 'foo-x', name: 'foo'}
                ],
                merged = Helper.merge(target, supplement);

            expect(merged.length).to.equal(3);
            expect(merged[2].name).to.equal('foo');
            expect(merged[2].id).to.equal('foo-x');

        });

    });

    describe('parseMultipartResponse', function() {

        it('evaluates multipart response', function() {

            var ajax = <r.Response>{
                isMultipart: function() {
                    return true;
                },
                data: [
                    {data: 'foo'},
                    {data: 'bar'},
                    {error: new Error('this is skipped')}
                ]
            };

            var items = Helper.parseMultipartResponse(ajax);

            expect(ajax.isMultipart()).to.equal(true);
            expect(items).to.deep.equal(['foo', 'bar']);
            expect(items.length).to.equal(2);

        });

        it('evaluates one-item response', function() {

            var ajax = r.$get(rcsdk.getContext(), 200, 'OK', {foo: 'foo'}),
                items = Helper.parseMultipartResponse(ajax);

            expect(items).to.deep.equal([{foo: 'foo'}]);
            expect(items.length).to.equal(1);

        });

    });

});
