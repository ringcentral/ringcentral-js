/// <reference path="../test.ts" />

describe('RingCentral.core.Log', function() {

    var expect = chai.expect,
        spy = sinon.spy;

    describe('Interface', function() {

        it('Enables and disables all', function() {

            var c = <any> {
                    log: spy(function() {}),
                    info: spy(function() {}),
                    warn: spy(function() {}),
                    error: spy(function() {})
                },
                log = new RingCentral.sdk.core.Log(c);

            log.enableAll();

            expect(log.logDebug).to.equal(true);
            expect(log.logInfo).to.equal(true);
            expect(log.logWarnings).to.equal(true);
            expect(log.logErrors).to.equal(true);

            log.debug('foo');
            log.info('foo');
            log.warn('foo');
            log.error('foo');

            log.disableAll();

            expect(log.logDebug).to.equal(false);
            expect(log.logInfo).to.equal(false);
            expect(log.logWarnings).to.equal(false);
            expect(log.logErrors).to.equal(false);

            log.debug('foo');
            log.info('foo');
            log.warn('foo');
            log.error('foo');

            expect(c.log).to.be.calledOnce;
            expect(c.info).to.be.calledOnce;
            expect(c.warn).to.be.calledOnce;
            expect(c.error).to.be.calledOnce;

        });

    });

});
