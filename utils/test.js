require('es6-promise/dist/es6-promise.auto');
require('isomorphic-fetch');

const chai = require('chai');
const sinon = require('sinon');
const fetchMock = require('fetch-mock/es5/server');

exports.expect = chai.expect;
exports.spy = sinon.spy;
exports.fetchMock = typeof window !== 'undefined' ? window['fetchMock'] : fetchMock;
