import Externals from './Externals';

export interface CacheOptions {
    prefix?: string;
    externals: Externals;
}

export default class Cache {
    public static defaultPrefix = 'rc-';

    private readonly _prefix = null;

    private _externals = null;

    public constructor({prefix = Cache.defaultPrefix, externals}: CacheOptions) {
        this._prefix = prefix;
        this._externals = externals;
    }

    public setItemSync(key, data) {
        this._externals.localStorage.setItem(this._prefixKey(key), JSON.stringify(data));
        return this;
    }

    public async setItem(key, data) {
        await this._externals.localStorage.setItem(this._prefixKey(key), JSON.stringify(data));
        //this.setItemSync(key, data);
    }

    public removeItemSync(key) {
        this._externals.localStorage.removeItem(this._prefixKey(key));
        return this;
    }

    public async removeItem(key) {
        await this._externals.localStorage.removeItem(this._prefixKey(key));
        //await this.removeItemSync(key);
    }

    public getItemSync(key) {
        const item = this._externals.localStorage.getItem(this._prefixKey(key));
        if (!item) {return null;}
        return JSON.parse(item);
    }

    public async getItem(key) {
        const item = await this._externals.localStorage.getItem(this._prefixKey(key));
        if (!item) {return null;}
        return JSON.parse(item);
       // return this.getItemSync(key);
    }

    private async _keys(): Promise<string[]> {
        return 'keys' in this._externals.localStorage
            ? this._externals.localStorage.keys() // could be async
            : Object.keys(this._externals.localStorage);
    }

    public async clean() {
        await Promise.all(
            (await this._keys()).map(async key => {
                if (key.startsWith(this._prefix)) {
                    await this._externals.localStorage.removeItem(key);
                }
            }),
        );

        return this;
    }

    private _prefixKey(key: string) {
        return this._prefix + key;
    }
}
