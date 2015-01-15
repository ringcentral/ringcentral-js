(function() {

    var chai = require('chai'),
        spies = require('chai-spies'),
        requirejs = require('requirejs'),
        RCSDK = require('../lib/index'),
        rcsdk = new RCSDK();

    chai.use(spies);

    global.chai = chai;
    global.expect = chai.expect;
    global.define = requirejs.define;
    global.requirejs = requirejs;
    global.rcsdk = rcsdk;
    global.RCSDK = RCSDK;
    global.Mock = requirejs('../test/lib/Mock')(rcsdk);

})();