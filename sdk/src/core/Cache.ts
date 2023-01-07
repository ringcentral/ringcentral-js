import Externals from './Externals';

export interface CacheOptions {
    prefix?: string;
    externals: Externals;
}

export default class Cache {
    public static defaultPrefix = 'rc-';

    private readonly _prefix: string | null = null;

    private _externals = null;

    public constructor({prefix = Cache.defaultPrefix, externals}: CacheOptions) {
        this._prefix = prefix;
        this._externals = externals;
    }

    public async setItem(key: string, data: object) {
        await this._externals.localStorage.setItem(this._prefixKey(key), JSON.stringify(data));
        return this;
    }

    public async removeItem(key: string) {
        await this._externals.localStorage.removeItem(this._prefixKey(key));
    }

    public async getItem<T = any>(key: string): Promise<T> {
        const item = await this._externals.localStorage.getItem(this._prefixKey(key));
        if (!item) return null;
        return JSON.parse(item);
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
