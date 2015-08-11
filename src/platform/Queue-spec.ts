/// <reference path="../test.ts" />

describe('RingCentral.platform.Queue', function() {

    var expect = chai.expect,
        spy = sinon.spy,
        pollInterval = 1,
        releaseTimeout = 10;

    function getQueue() {
        var sdk = getSdk();
        return (new RingCentral.sdk.platform.Queue(sdk.cache(), 'foo'))
            .setReleaseTimeout(releaseTimeout)
            .setPollInterval(pollInterval);
    }

    describe('poll', function() {

        it('resumes after timeout if not resumed before', function(done) {

            getQueue().pause()
                .poll()
                .then(()=> {
                    done();
                }).catch(done);

        });

        it('can be resumed externally before timeout', function(done) {

            var queue = getQueue(),
                flag = false;

            queue.pause()
                .poll()
                .then(()=> {
                    expect(flag).to.equal(true);
                    done();
                });

            setTimeout(()=> {
                flag = true;
                queue.resume();
            }, releaseTimeout / 2);

        });

    });

});
