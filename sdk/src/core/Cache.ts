import Externals from "./Externals";

export interface CacheOptions {
    prefix?: string;
    externals: Externals
}

export default class Cache {

    static defaultPrefix = 'rc-';

    private readonly _prefix = null;

    private _externals = null;

    constructor({prefix = Cache.defaultPrefix, externals}: CacheOptions) {
        this._prefix = prefix;
        this._externals = externals;
    }

    setItemSync(key, data) {
        this._externals.localStorage.setItem(this._prefixKey(key), JSON.stringify(data));
        return this;
    }

    async setItem(key, data) {
        await this.setItemSync(key, data);
    }

    removeItemSync(key) {
        this._externals.localStorage.removeItem(this._prefixKey(key));
        return this;
    }

    async removeItem(key) {
        await this.removeItemSync(key);
    }

    getItemSync(key) {
        const item = this._externals.localStorage.getItem(this._prefixKey(key));
        if (!item) return null;
        return JSON.parse(item);
    }

    async getItem(key) {
        return await this.getItemSync(key);
    }

    private async _keys(): Promise<string[]> {
        return ('keys' in this._externals.localStorage)
               ? await this._externals.localStorage.keys()
               : Object.keys(this._externals.localStorage);
    }

    async clean() {

        await Promise.all((await this._keys()).map(async key => {
            if (key.indexOf(this._prefix) === 0) {
                await this._externals.localStorage.removeItem(key);
            }
        }));

        return this;

    }

    private _prefixKey(key: string) {
        return this._prefix + key;
    }

}
