require('es6-promise/dist/es6-promise.auto');
require('isomorphic-fetch');

let fetchMock;

if (typeof window !== 'undefined') {
    fetchMock = require('fetch-mock/es5/client');
} else {
    fetchMock = require('fetch-mock/es5/server');
}

exports.expect = global.expect;
exports.spy = f => jest.fn(f);
exports.fetchMock = fetchMock;
