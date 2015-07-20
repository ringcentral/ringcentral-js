/// <reference path="../../typings/externals.d.ts" />

export import mocha = require('../../test/mocha');
var expect = mocha.chai.expect;
var spy = mocha.sinon.spy;
var mock = mocha.mock;
var rcsdk = mocha.rcsdk;

describe('RCSDK.core.List', function() {

    'use strict';

    var List = rcsdk.getList();

    describe('stringComparator', function() {

        it('compares values as strings', function() {

            // numbers with different amount of digits
            expect(List.stringComparator('12', '2')).to.equal(-1);
            expect(List.stringComparator('2', '12')).to.equal(1);

            // numbers with same amount of digits
            expect(List.stringComparator('1', '2')).to.equal(-1);
            expect(List.stringComparator('2', '1')).to.equal(1);

            // same numbers
            expect(List.stringComparator('1', '1')).to.equal(0);

            // english strings
            expect(List.stringComparator('a', 'b')).to.equal(-1);
            expect(List.stringComparator('b', 'a')).to.equal(1);
            expect(List.stringComparator('a', 'a')).to.equal(0);

            // russian strings
            expect(List.stringComparator('в', 'г')).to.equal(-1);
            expect(List.stringComparator('г', 'в')).to.equal(1);
            expect(List.stringComparator('г', 'г')).to.equal(0);

        });

        it('compares values as numbers', function() {

            // numbers with different amount of digits as strings, <number> is used to convince TS
            expect(List.numberComparator('12', '2')).to.equal(10);
            expect(List.numberComparator('2', '12')).to.equal(-10);

            // numbers with different amount of digits
            expect(List.numberComparator(12, 2)).to.equal(10);
            expect(List.numberComparator(2, 12)).to.equal(-10);

            // numbers with same amount of digits
            expect(List.numberComparator(1, 2)).to.equal(-1);
            expect(List.numberComparator(2, 1)).to.equal(1);

            // same numbers
            expect(List.numberComparator(1, 1)).to.equal(0);

        });

    });

    describe('comparator', function() {

        it('by default provides comparator function which calls stringComparator with pre-bound extract functions', function() {

            var array = [
                    {id: '3'},
                    {id: '2'},
                    {id: '1'}
                ],
                sortFn = List.comparator({sortBy: 'id'}),
                result = array
                    .map(function(item) {return item;}) // we need a copy, original array is sorted in-place
                    .sort(sortFn);

            expect(result[0]).to.equal(array[2]);
            expect(result[1]).to.equal(array[1]);
            expect(result[2]).to.equal(array[0]);

        });

        it('allows to provide custom sortBy property', function() {

            var array = [
                    {name: '3'},
                    {name: '2'},
                    {name: '1'}
                ],
                sortFn = List.comparator({sortBy: 'name'}),
                result = array
                    .map(function(item) {return item;}) // we need a copy, original array is sorted in-place
                    .sort(sortFn);

            expect(result[0]).to.equal(array[2]);
            expect(result[1]).to.equal(array[1]);
            expect(result[2]).to.equal(array[0]);


        });

        it('allows to provide custom extract and compare functions', function() {

            var array = [
                    {id: '13'},
                    {id: '2'},
                    {id: '1'}
                ],
                sortFn = List.comparator({
                    compareFn: List.numberComparator,
                    sortBy: 'id'
                }),
                result = array
                    .map(function(item) {return item;}) // we need a copy, original array is sorted in-place
                    .sort(sortFn);

            expect(result[0]).to.equal(array[2]);
            expect(result[1]).to.equal(array[1]);
            expect(result[2]).to.equal(array[0]);

        });

        it('provides options to custom extract and compare functions', function() {

            var array = [
                    {id: '3'},
                    {id: '2'},
                    {id: '1'}
                ],
                options = {
                    sortBy: 'id',
                    extractFn: spy(function(item, opts) {

                        expect(opts.extractFn).to.equal(options.extractFn);
                        expect(opts.compareFn).to.equal(options.compareFn);

                        return List.propertyExtractor('id')(item, opts);

                    }),
                    compareFn: spy(function(a, b, opts) {

                        expect(opts.extractFn).to.equal(options.extractFn);
                        expect(opts.compareFn).to.equal(options.compareFn);

                        return List.numberComparator(a, b, opts);

                    })
                },
                sortFn = List.comparator(options),
                result = array
                    .map(function(item) {return item;}) // we need a copy, original array is sorted in-place
                    .sort(sortFn);

            expect(result[0]).to.equal(array[2]);
            expect(result[1]).to.equal(array[1]);
            expect(result[2]).to.equal(array[0]);

            expect((<SinonSpy>options.extractFn).callCount).to.be.equal(array.length * 2);
            expect((<SinonSpy>options.compareFn).callCount).to.be.equal(array.length);

        });

    });

    describe('propertyExtractor', function() {

        it('returns a value of property', function() {

            expect((<any>List.propertyExtractor('id'))({id: 'foo'})).to.equal('foo');
            expect((<any>List.propertyExtractor('id'))(undefined)).to.equal(null);
            expect((<any>List.propertyExtractor(null))('foo')).to.equal('foo');
            expect((<any>List.propertyExtractor(null))({id: 'foo'})).to.deep.equal({id: 'foo'});

        });

    });

});
