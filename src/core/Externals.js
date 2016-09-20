import es6Promise from "es6-promise";
import fetchPonyfill from "fetch-ponyfill";
import pubnub from "pubnub";

var root = (typeof window !== "undefined" && window) ||
           (typeof global !== "undefined" && global) ||
           Function("return this;")();

var Promise = (es6Promise && es6Promise.Promise) || root.Promise;

var fetchParts = fetchPonyfill ? fetchPonyfill({Promise: Promise}) : {};

var fetch = fetchParts.fetch || root.fetch;
var Request = fetchParts.Request || root.Request;
var Response = fetchParts.Response || root.Response;
var Headers = fetchParts.Headers || root.Headers;

var PUBNUB = pubnub || root.PUBNUB;

var localStorage = (typeof root.localStorage !== 'undefined') ? root.localStorage : {};

export {Promise, fetch, Request, Response, Headers, PUBNUB, localStorage};