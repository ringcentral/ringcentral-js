/**
 * @param {Cache} options.cache
 * @param {string} options.cacheId
 * @param {int} [options.refreshHandicapMs]
 * @constructor
 * @property {Cache} _cache
 * @property {int} _refreshHandicapMs
 * @property {string} _cacheId
 */
function Auth(options) {

    /** @private */
    this._cache = options.cache;

    /** @private */
    this._cacheId = options.cacheId;

    /** @private */
    this._refreshHandicapMs = options.refreshHandicapMs || 60 * 1000; // 1 minute

}

Auth.prototype.accessToken = function() {
    return this.data().access_token;
};

Auth.prototype.refreshToken = function() {
    return this.data().refresh_token;
};

Auth.prototype.tokenType = function() {
    return this.data().token_type;
};

/**
 * @return {{token_type: string, access_token: string, expires_in: number, refresh_token: string, refresh_token_expires_in: number}}
 */
Auth.prototype.data = function() {

    return this._cache.getItem(this._cacheId) || {
            token_type: '',
            access_token: '',
            expires_in: 0,
            refresh_token: '',
            refresh_token_expires_in: 0
        };

};

/**
 * @param {object} newData
 * @return {Auth}
 */
Auth.prototype.setData = function(newData) {

    newData = newData || {};

    var data = this.data();

    Object.keys(newData).forEach(function(key) {
        data[key] = newData[key];
    });

    data.expire_time = Date.now() + (data.expires_in * 1000);
    data.refresh_token_expire_time = Date.now() + (data.refresh_token_expires_in * 1000);

    this._cache.setItem(this._cacheId, data);

    return this;

};

/**
 * Check if there is a valid (not expired) access token
 * @return {boolean}
 */
Auth.prototype.accessTokenValid = function() {

    var authData = this.data();
    return (authData.expire_time - this._refreshHandicapMs > Date.now());

};

/**
 * Check if there is a valid (not expired) access token
 * @return {boolean}
 */
Auth.prototype.refreshTokenValid = function() {

    return (this.data().refresh_token_expire_time > Date.now());

};

/**
 * @return {Auth}
 */
Auth.prototype.cancelAccessToken = function() {

    return this.setData({
        access_token: '',
        expires_in: 0
    });

};

module.exports = Auth;

//export interface IAuthData {
//    remember?:boolean;
//    token_type?:string;
//    access_token?:string;
//    expires_in?:number; // actually it's string
//    expire_time?:number;
//    refresh_token?:string;
//    refresh_token_expires_in?:number; // actually it's string
//    refresh_token_expire_time?:number;
//    scope?:string;
//}
