/// <reference path="../../../typings/externals.d.ts" />

export import mocha = require('../../../test/mocha');
import r = require('./MultipartRequest');
var expect = mocha.chai.expect;
var rcsdk = mocha.mock.rcsdk;

describe('RCSDK.core.http.MultipartRequest', function() {

    describe.skip('createNodeMessage', function() {

        it('assembles message', function() {

            var req = r.$get(rcsdk.getContext()),
                expected = '--Boundary_1428971641708\n' +
                           'Content-Type: application/json\n' +
                           '\n' +
                           '{}\n' +
                           '--Boundary_1428971641708\n' +
                           'Content-Type: text/plain\n' +
                           '\n' +
                           'Foo\n' +
                           '--Boundary_1428971641708--';

            req.setBoundary('Boundary_1428971641708')
                .addAttachment({content: 'Foo'})
                .createNodeMessage();

            expect(req.body).to.be.instanceOf(Buffer);
            expect(req.body.toString('utf-8')).to.equal(expected)

        });

        it('assembles message', function() {

            var req = r.$get(rcsdk.getContext()),
                expected = '--Boundary_1428971641708\n' +
                           'Content-Type: application/json\n' +
                           '\n' +
                           '{}\n' +
                           '--Boundary_1428971641708\n' +
                           'Content-Type: application/json\n' +
                           'Content-Disposition: attachment; filename=file.txt\n' +
                           '\n' +
                           '{"foo":"bar"}\n' +
                           '--Boundary_1428971641708--';

            req.setBoundary('Boundary_1428971641708')
                .addAttachment({contentType: 'application/json', content: new Buffer('{"foo":"bar"}', 'utf-8')})
                .createNodeMessage();

            expect(req.body).to.be.instanceOf(Buffer);
            expect(req.body.toString('utf-8')).to.equal(expected)

        });

        it('assembles message', function() {

            var req = r.$get(rcsdk.getContext()),
                expected = '--Boundary_1428971641708\n' +
                           'Content-Type: application/json\n' +
                           '\n' +
                           '{"to":[{"phoneNumber":"12223334455"}],"faxResolution":"Low"}\n' +
                           '--Boundary_1428971641708\n' +
                           'Content-Type: application/json\n' +
                           'Content-Disposition: attachment; filename=file.txt\n' +
                           '\n' +
                           '{"foo":"bar"}\n' +
                           '--Boundary_1428971641708--';

            req.body = {
                "to": [{"phoneNumber": "12223334455"}],
                "faxResolution": "Low"
            };

            req.setBoundary('Boundary_1428971641708')
                .addAttachment({contentType: 'application/json', content: new Buffer('{"foo":"bar"}', 'utf-8')})
                .createNodeMessage();

            expect(req.body).to.be.instanceOf(Buffer);
            expect(req.body.toString('utf-8')).to.equal(expected)

        });

    });

});