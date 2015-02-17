describe('RCSDK.core.Log', function() {

    var log = rcsdk.getLog();

    describe('Interface', function() {

        it('Enables and disables all', function() {

            var originalConsole = console;

            var c = log.console = {
                log: chai.spy(function() {}),
                info: chai.spy(function() {}),
                warn: chai.spy(function() {}),
                error: chai.spy(function() {})
            };

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

            expect(c.log).to.be.called.once();
            expect(c.info).to.be.called.once();
            expect(c.warn).to.be.called.once();
            expect(c.error).to.be.called.once();

            log.console = originalConsole;

        });

    });

});
