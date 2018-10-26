import Externals from "./Externals";

export interface CacheOptions {
    prefix?: string;
    externals: Externals
}

export default class Cache {

    static defaultPrefix = 'rc-';

    private _prefix = null;

    private _externals = null;

    constructor({prefix = Cache.defaultPrefix, externals}: CacheOptions) {
        this._prefix = prefix;
        this._externals = externals;
    }

    setItem(key, data) {
        this._externals.localStorage[this._prefixKey(key)] = JSON.stringify(data);
        return this;
    }

    removeItem(key) {
        delete this._externals.localStorage[this._prefixKey(key)];
        return this;
    }

    getItem(key) {
        const item = this._externals.localStorage[this._prefixKey(key)];
        if (!item) return null;
        return JSON.parse(item);
    }

    clean() {

        for (const key in this._externals.localStorage) {

            /* istanbul ignore next */
            if (!this._externals.localStorage.hasOwnProperty(key)) continue;

            if (key.indexOf(this._prefix) === 0) {
                delete this._externals.localStorage[key];
            }

        }

        return this;

    }

    private _prefixKey(key: string) {
        return this._prefix + key;
    }

}
