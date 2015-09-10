import ES6Promise from 'es6-promise';
import nodeFetch from 'node-fetch';
import pubnub from 'pubnub';

export var Promise = (ES6Promise && ES6Promise.Promise) || window.Promise;

export var fetch = nodeFetch || window.fetch;
export var Request = fetch.Request || window.Request;
export var Response = fetch.Response || window.Response;
export var Headers = fetch.Headers || window.Headers;

export var PUBNUB = pubnub || window.PUBNUB;

export var localStorage = (typeof window !== 'undefined' &&
                           typeof window.localStorage !== 'undefined') ? window.localStorage : {};
