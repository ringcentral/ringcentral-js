describe('RCSDK', function() {

    describe('production server', function() {

        it('returns info', function(done) {

            this.timeout(10000); // Per SLA should be 3 seconds

            var server = 'https://platform.devtest.ringcentral.com',
                rcsdk = new RCSDK(),
                platform = rcsdk.getPlatform();

            platform.forceAuthentication();
            platform.server = server;
            platform.apiKey = '';

            platform
                .apiCall({
                    url: ''
                })
                .then(function(ajax) {
                    expect(ajax.data.uri).to.equal(server + '/restapi/v1.0');
                    done();
                })
                .catch(function(e) {
                    done(e);
                });


        });

    });

});
