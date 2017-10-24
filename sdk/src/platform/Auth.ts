import Cache from "../core/Cache";

export interface AuthOptions {
    refreshHandicapMs?: number;
}

export interface AuthOptionsConstructor extends AuthOptions{
    cache: Cache;
    cacheId: string;
}

export default class Auth {

    private _cache: Cache;
    private _cacheId: string;
    private _refreshHandicapMs: number;

    constructor({cache, cacheId, refreshHandicapMs = 60 * 1000}: AuthOptionsConstructor) { // 1 minute

        this._cache = cache;
        this._cacheId = cacheId;
        this._refreshHandicapMs = refreshHandicapMs;

    }

    accessToken() {
        return this.data().access_token;
    }

    refreshToken() {
        return this.data().refresh_token;
    }

    tokenType() {
        return this.data().token_type;
    }

    data():AuthData {

        return this._cache.getItem(this._cacheId) || {
            token_type: '',
            access_token: '',
            expires_in: 0,
            refresh_token: '',
            refresh_token_expires_in: 0
        };

    }

    setData(newData = {}) {

        var data = this.data();

        Object.keys(newData).forEach(function(key) {
            data[key] = newData[key];
        });

        data.expire_time = Date.now() + (data.expires_in * 1000);
        data.refresh_token_expire_time = Date.now() + (data.refresh_token_expires_in * 1000);

        this._cache.setItem(this._cacheId, data);

        return this;

    }

    /**
     * Check if there is a valid (not expired) access token
     */
    accessTokenValid() {

        var authData = this.data();
        return (authData.expire_time - this._refreshHandicapMs > Date.now());

    }

    /**
     * Check if there is a valid (not expired) access token
     */
    refreshTokenValid() {

        return (this.data().refresh_token_expire_time > Date.now());

    }

    cancelAccessToken() {

        return this.setData({
            access_token: '',
            expires_in: 0
        });

    }

}

export interface AuthData {
    remember?: boolean;
    token_type?: string;
    access_token?: string;
    expires_in?: number; // actually it's string
    expire_time?: number;
    refresh_token?: string;
    refresh_token_expires_in?: number; // actually it's string
    refresh_token_expire_time?: number;
    scope?: string;
}
