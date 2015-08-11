(function(r, factory) {

    if (typeof define === 'function' && define.amd) {

        define(['ringcentral', 'mocha', 'chai', 'sinon', 'sinon-chai'], function(SDK, mocha, chai, sinon, sinonChai) {
            mocha.setup('bdd');
            factory({sdk: SDK}, r.Promise, mocha, chai, sinon, sinonChai);
        });

    } else if (typeof exports === 'object' && typeof exports.nodeName !== 'string') {

        var rq = require;
        factory({sdk: rq('../ringcentral')}, rq('es6-promise').Promise, rq('mocha'), rq('chai'), rq('sinon'), rq('sinon-chai'));

    } else {

        factory(r.RingCentral, r.Promise, r.mocha, r.chai, r.sinon);

    }

}(this, function(RingCentral, Promise, mocha, chai, sinon, sinonChai) {/*{%= body %}*/}));