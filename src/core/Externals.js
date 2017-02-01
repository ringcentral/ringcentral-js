var pubnub = require("pubnub");
var es6Promise = require("es6-promise");
var FetchPonyfill = require("fetch-ponyfill");

var root = (typeof window !== "undefined" && window) ||
           (typeof global !== "undefined" && global) ||
           (function(){ return this; })();

/**
 * @constructor
 * @param {PubNub} [options.PubNub]
 * @param {function(new:Promise)} [options.Promise]
 * @param {Storage} [options.localStorage]
 * @param {fetch} [options.fetch]
 * @param {function(new:Request)} [options.Request]
 * @param {function(new:Response)} [options.Response]
 * @param {function(new:Headers)} [options.Headers]
 * @property {PubNub} PubNub
 * @property {Storage} localStorage
 * @property {function(new:Promise)} Promise
 * @property {fetch} fetch
 * @property {function(new:Request)} Request
 * @property {function(new:Response)} Response
 * @property {function(new:Headers)} Headers
 */
function Externals(options) {

    options = options || {};

    this.PubNub = options.PubNub || root.PubNub || pubnub;
    this.localStorage = options.localStorage || ((typeof root.localStorage !== 'undefined') ? root.localStorage : {});
    this.Promise = options.Promise || root.Promise || (es6Promise && es6Promise.Promise);

    var fetchPonyfill = FetchPonyfill ? FetchPonyfill({Promise: this.Promise}) : {};

    this.fetch = options.fetch || root.fetch || fetchPonyfill.fetch;
    this.Request = options.Request || root.Request || fetchPonyfill.Request;
    this.Response = options.Response || root.Response || fetchPonyfill.Response;
    this.Headers = options.Headers || root.Headers || fetchPonyfill.Headers;

    if (!this.fetch || !this.Response || !this.Request || !this.Headers) {
        throw new Error('Fetch API is missing');
    }

    if (!this.Promise) {
        throw new Error('Promise is missing');
    }

    if (!this.localStorage) {
        throw new Error('LocalStorage is missing');
    }

    if (!this.PubNub) {
        throw new Error('PubNub is missing');
    }

}

module.exports = Externals;
