/// <reference path="../../typings/externals.d.ts" />

export import mocha = require('../../test/mocha');
var expect = mocha.chai.expect;
var mock = mocha.mock;
var rcsdk = mocha.rcsdk;

describe('RCSDK.core.Observable', function() {

    describe('Regular events', function() {

        it('binds and fires events', function() {

            var o = rcsdk.getObservable(),
                a = 0;

            o.on('event', function() {
                a++;
            });

            o.emit('event');
            expect(a).to.be.equal(1);

            o.emit('event');
            expect(a).to.be.equal(2);

        });

        it('binds and unbinds events', function() {

            var o = rcsdk.getObservable(),
                a = 0,
                c = function() {
                    a++;
                };

            o.on('event', c);
            o.off('event', c);

            o.emit('event');
            expect(a).to.be.equal(0);

        });

        it('don\'t share events', function() {

            var o1 = rcsdk.getObservable(),
                o2 = rcsdk.getObservable(),
                a = 0,
                c = function() {
                    a++;
                };

            o1.on('event', c);
            o2.on('event', c);

            o1.emit('event');
            o2.emit('event');

            expect(a).to.be.equal(2);

        });

        it('executes event and then callback when emitAndCallback() is called', function() {

            var o = rcsdk.getObservable(),
                r = '';

            o.on('event', function(a, b) {
                r += '1-' + a + '-' + b;
            });

            o.emitAndCallback('event', [2, 3], function() {
                r += '-4';
            });

            expect(r).to.equal('1-2-3-4');

        });

    });

    describe('Disposable events', function() {

        it('executes callback immediately if event has been fired before', function() {

            var o = rcsdk.getObservable(),
                a = 0;

            o.registerOneTimeEvent('event');

            o.on('event', function() {
                a++;
            });

            o.emit('event');
            expect(a).to.be.equal(1);

            o.on('event', function() { a++; });
            expect(a).to.be.equal(2);

        });

    });

});
