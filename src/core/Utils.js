import {Promise} from "./Externals.js";
import qs from "querystring";

/**
 * @param {object} parameters
 * @returns {string}
 */
export function queryStringify(parameters) {
    return qs.stringify(parameters);
}

/**
 * @param {string} queryString
 * @returns {object}
 */
export function parseQueryString(queryString) {
    return qs.parse(queryString);
}

/**
 * @param obj
 * @return {boolean}
 */
export function isFunction(obj) {
    return typeof obj === "function";
}

/**
 * @param obj
 * @return {boolean}
 */
export function isArray(obj) {
    return Array.isArray ? Array.isArray(obj) : typeof obj === "array";
}

export function isObject(o) {
    return o != null && typeof o === 'object' && !isArray(o);
}

export function isObjectObject(o) {
    return isObject(o) === true && Object.prototype.toString.call(o) === '[object Object]';
}

export function isPlainObject(o) {
    var ctor, prot;

    if (isObjectObject(o) === false) return false;

    // If has modified constructor
    ctor = o.constructor;
    if (typeof ctor !== 'function') return false;

    // If has modified prototype
    prot = ctor.prototype;
    if (isObjectObject(prot) === false) return false;

    // If constructor does not have an Object-specific method
    if (prot.hasOwnProperty('isPrototypeOf') === false) {
        return false;
    }

    // Most likely a plain Object
    return true;
}

export function isNodeJS() {
    return (typeof process !== 'undefined');
}

export function isBrowser() {
    return (typeof window !== 'undefined');
}

export function delay(timeout) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve(null);
        }, timeout);
    });
}