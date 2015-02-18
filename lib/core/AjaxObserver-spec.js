describe('RCSDK.core.AjaxObserver', function() {

    var o = rcsdk.getAjaxObserver(),
        platform = rcsdk.getPlatform(),
        path = '/restapi/xxx';

    describe('events fire when Ajax happen', function() {

        Mock.registerHooks(this);

        afterEach(function() {
            o.offAll();
        });

        beforeEach(function() {
            o.offAll();
        });

        it('beforeRequest', function(done) {

            Mock.apiCall(path, {});

            var spy = chai.spy(function(ajax) {});

            o.on(o.events.beforeRequest, spy);

            platform
                .apiCall({url: path})
                .then(function() {
                    expect(spy).to.be.called.once();
                    done();
                })
                .catch(function(e) { done(e); });

        });

        it('requestSuccess', function(done) {

            Mock.apiCall(path, {});

            var spy = chai.spy(function(ajax) {});

            o.on(o.events.requestSuccess, spy);

            platform
                .apiCall({url: path})
                .then(function() {
                    expect(spy).to.be.called.once();
                    done();
                })
                .catch(function(e) { done(e); });

        });

        it('requestError', function(done) {

            var spy = chai.spy(function(ajax) {});

            o.on(o.events.requestError, spy);

            platform
                .apiCall({url: path})
                .then(function() {
                    done(new Error('This should never be reached'));
                })
                .catch(function(e) {
                    expect(spy).to.be.called.once();
                    done();
                });

        });

    });

});
