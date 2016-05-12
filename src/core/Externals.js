import es6Promise from "es6-promise";
import nodeFetch from "node-fetch";
import pubnub from "pubnub";

var root = (typeof window !== "undefined" && window) ||
           (typeof global !== "undefined" && global) ||
           Function("return this;")();

var Promise = (es6Promise && es6Promise.Promise) || root.Promise;

var fetch = (nodeFetch && typeof nodeFetch == 'function')  ? nodeFetch : root.fetch;
var Request = fetch.Request || root.Request;
var Response = fetch.Response || root.Response;
var Headers = fetch.Headers || root.Headers;

var PUBNUB = pubnub || root.PUBNUB;

var localStorage = (typeof root.localStorage !== 'undefined') ? root.localStorage : {};

export {Promise, fetch, Request, Response, Headers, PUBNUB, localStorage};