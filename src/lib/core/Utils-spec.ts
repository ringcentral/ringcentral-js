/// <reference path="../../typings/externals.d.ts" />

export import mocha = require('../../test/mocha');
var expect = mocha.chai.expect;
var mock = mocha.mock;
var rcsdk = mocha.rcsdk;

describe('RCSDK.core.Utils', function() {

    'use strict';

    var Utils = rcsdk.getUtils();

    describe('parseQueryString & queryStringify', function() {

        it('parses queryStrings', function() {

            expect(Utils.parseQueryString('foo=bar&bar=baz')).to.deep.equal({foo: 'bar', bar: 'baz'});
            expect(Utils.parseQueryString('foo=bar&foo=baz')).to.deep.equal({foo: ['bar', 'baz']});
            expect(Utils.parseQueryString('foo')).to.deep.equal({foo: true});

        });

        it('builds queryStrings', function() {

            expect(Utils.queryStringify({foo: 'bar', bar: 'baz'})).to.equal('foo=bar&bar=baz');
            expect(Utils.queryStringify({foo: ['bar', 'baz']})).to.equal('foo=bar&foo=baz');

        });

        it('decodes pre-encoded string representation of object to be equal to original object', function() {

            function encodeDecode(v) {
                return Utils.parseQueryString(Utils.queryStringify(v));
            }

            var simple = {foo: 'bar'},
                array = {foo: ['bar', 'baz']};

            expect(encodeDecode(simple)).to.deep.equal(simple);
            expect(encodeDecode(array)).to.deep.equal(array);

        });

    });

    describe('extend', function() {

        it('applies properties of sources to target (only first level)', function() {

            var target = {
                    foo: {
                        id: 0,
                        name: 'name'
                    }
                },
                source1 = {
                    foo: {
                        id: 1
                    },
                    bar: {
                        id: 1
                    }
                },
                source2 = {
                    foo: {
                        id: 2
                    }
                },
                result = Utils.extend(target, source1, source2);

            // make sure result is target
            expect(result).to.equal(target);

            // make sure source2 has overrided source1 and target
            expect(result.foo.id).to.equal(2);
            expect(result.foo.name).to.be.an('undefined');

            // make sure other properties of source 1 are copied
            expect(result.bar.id).to.equal(1);

        });

        it('applies all properties of sources to target in deep mode', function() {

            var target = {
                    foo: {
                        id: 0,
                        name: 'name'
                    }
                },
                source1 = {
                    foo: {
                        id: 1
                    },
                    bar: {
                        id: 1
                    }
                },
                source2 = {
                    foo: {
                        id: 2
                    }
                },
                result = Utils.extend(true, target, source1, source2);

            // make sure result is target
            expect(result).to.equal(target);

            // make sure original target properties that does not exist in sources are still available
            expect(result.foo.name).to.equal('name');

            // make sure source2 has overrided source1 and target
            expect(result.foo.id).to.equal(2);

            // make sure other properties of source 1 are copied
            expect(result.bar.id).to.equal(1);

        });

        it('copies all kinds of values', function() {

            var target = <any> {
                    'array': []
                },
                source = {
                    'object': {
                        bar: {
                            baz: 'baz'
                        }
                    },
                    'null': null,
                    'array': [1, 2, 3],
                    'date': new Date(),
                    'string': 'string'
                };

            Utils.extend(true, target, source);

            // Deep equality
            expect(target).to.deep.equal(source);

            // Dates are linked
            expect(target.date).to.equal(source.date);

            // Arrays are cloned
            expect(target.array).not.to.equal(source.array);

        });

    });

    describe('poll & stopPolling', function() {

        it('allows to set custom delay', function(done) {

            Utils.poll(function(next, delay) {

                expect(delay).to.equal(10);
                done();

            }, 10);

        });

        it('provides a method to do it continuously', function(done) {

            var i = 0;

            Utils.poll(function(next) {

                i++;

                if (i < 3) next(); else done();

            }, 1);

            after(function() {

                expect(i).to.equal(3);

            });

        });

        it('provides a method stop', function(done) {

            var timeout = Utils.poll(function(next) {

                done(new Error('This should never be reached'));

            }, 10);

            Utils.stopPolling(timeout);

            done();

        });

        it('cancels a previous timeout if provided', function(done) {

            var timeout = Utils.poll(function(next) {

                done(new Error('This should never be reached'));

            }, 10);

            var timeout2 = Utils.poll(function(next) {

                done();

            }, 10, timeout);

        });

    });

    describe('parseNumber', function() {

        it('extracts object itself as number if no options given', function() {

            expect(Utils.parseNumber(1)).to.equal(1);
            expect(Utils.parseNumber('1')).to.equal(1);
            expect(Utils.parseNumber('0')).to.equal(0);
            expect(Utils.parseNumber([])).to.equal(0);
            expect(Utils.parseNumber([1])).to.equal(1);
            expect(Utils.parseNumber([1, 1])).to.equal(1);
            expect(Utils.parseNumber('not-a-number')).to.equal(0);
            expect(Utils.parseNumber(null)).to.equal(0);

        });

    });

    describe('stringExtractor', function() {

        it('extracts object itself as string if no options given', function() {

            expect(Utils.parseString(1)).to.equal('1');
            expect(Utils.parseString(0)).to.equal('');
            expect(Utils.parseString([])).to.equal('');
            expect(Utils.parseString([1, 2])).to.equal('1,2');
            expect(Utils.parseString(null)).to.equal('');
            expect(Utils.parseString({})).to.equal('[object Object]');

        });

    });

    describe('isEmail', function() {

        function emailValidator(description, multiple, valueToTest, expectedValidationResult) {

            it(description, function() {

                expect(Utils.isEmail(valueToTest, multiple)).to.equal(expectedValidationResult);

            });

        }

        describe('positive tests', function() {

            emailValidator('should validate simple addresses', false, 'foo@bar.com', true);
            emailValidator('should validate addresses with digits', false, '123@456.789', true);
            emailValidator('should validate addresses with special characters', false, '!#$%&\'*+/=?^_`{|}~-@qux.com', true);
            emailValidator('should validate addresses with multiple host segments', false, 'foo@bar.baz.qux.com', true);
            emailValidator('should validate multiple addresses when true is specified for the multiple constructor argument', true, 'foo@bar.com; baz@qux.com', true);

        });

        describe('negative tests', function() {

            emailValidator('should not validate addresses with multiple @ symbols', false, 'foo@bar@baz.com', false);
            emailValidator('should not validate addresses with invalid characters', false, 'foo bar@baz.com', false);
            emailValidator('should not validate addresses with malformed host segment', false, 'foo@bar.baz.', false);
            emailValidator('should not validate addresses with missing host segment', false, 'foo@', false);
            emailValidator('should not validate multiple addresses when false is specified for the multiple constructor argument', false, 'foo@bar.com; baz@qux.com', false);

        });

    });

    describe('isPhone', function() {

        function phoneValidator(description, valueToTest, expectedValidationResult) {

            it(description, function() {

                expect(Utils.isPhoneNumber(valueToTest)).to.equal(expectedValidationResult);

            });

        }

        describe('positive tests', function() {

            phoneValidator('should validate a phone number with no formatting characters', '16501234567', true);
            phoneValidator('should validate a phone number with typical formatting characters', '1 (650) 123-4567', true);
            phoneValidator('should validate a phone number with periods as digit separators', '1.650.123.4567', true);
            phoneValidator('should validate a phone number with optional + prefix', '+1 650 123 4567', true);
            phoneValidator('should validate a vanity phone number', '+1 800 FOR HELP', true);

        });

        describe('negative tests', function() {

            phoneValidator('should not validate a phone number that is missing the country code', '(650) 123-4567', false);
            phoneValidator('should not validate a phone number that has too few digits', '1 (650) 123-456', false);
            phoneValidator('should not validate a phone number with letters in area code', '+1 FOO FOR HELP', false);

        });

    });

    describe('is*', function() {

        describe('isDate', function() {

            expect(Utils.isDate(new Date())).to.equal(true);

        });

        describe('isFunction', function() {

            expect(Utils.isFunction(Date)).to.equal(true);
            expect(Utils.isFunction(function() {})).to.equal(true);

        });

        describe('isArray', function() {

            expect(Utils.isArray([])).to.equal(true);

        });

        describe('isNaN', function() {

            expect(Utils.isNaN(NaN)).to.equal(true);

        });

    });

    describe('getProperty', function() {

        it('returns a nested property', function() {

            var foo = {
                bar: {
                    baz: 'qux'
                },
                arr: ['zero', 'one', 'two', {foo: 'bar'}]
            };

            expect(Utils.getProperty(foo, 'bar.baz')).to.equal('qux');
            expect(Utils.getProperty(foo, 'arr[0]')).to.equal('zero');
            expect(Utils.getProperty(foo, 'arr[1]')).to.equal('one');
            expect(Utils.getProperty(foo, 'arr[3].foo')).to.equal('bar');
            expect(Utils.getProperty(foo, 'nonexistent')).to.equal(undefined);

        });

    });

});
