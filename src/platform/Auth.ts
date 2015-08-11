/// <reference path="../externals.d.ts" />
/// <reference path="../core/Utils.ts" />
/// <reference path="../core/Observable.ts" />
/// <reference path="../core/Cache.ts" />
/// <reference path="../core/Log" />
/// <reference path="../http/Client.ts" />
/// <reference path="../http/ApiResponse.ts" />
/// <reference path="../externals/Externals.ts" />
/// <reference path="./Queue.ts" />

module RingCentral.sdk.platform {

    export class Auth {

        static refreshHandicapMs:number = 60 * 1000; // 1 minute
        static forcedTokenType = 'forced';

        protected _cacheId:string;
        protected _cache:core.Cache;

        constructor(cache:core.Cache, cacheId:string) {

            this._cache = cache;
            this._cacheId = cacheId;

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

        data():IAuthData {

            return this._cache.getItem(this._cacheId) || {
                    token_type: '',
                    access_token: '',
                    expires_in: 0,
                    refresh_token: '',
                    refresh_token_expires_in: 0
                };

        }

        setData(authData:IAuthData) {

            var oldAuthData = this.data();

            authData = core.utils.extend({}, oldAuthData, authData);

            authData.expire_time = Date.now() + (authData.expires_in * 1000);
            authData.refresh_token_expire_time = Date.now() + (authData.refresh_token_expires_in * 1000);

            core.log.info('Auth.setData(): Tokens were updated, new:', authData, ', old:', oldAuthData);

            this._cache.setItem(this._cacheId, authData);

            return this;

        }

        /**
         * Check if there is a valid (not expired) access token
         */
        accessTokenValid():boolean {

            var authData = this.data();
            return (authData.token_type === Auth.forcedTokenType || (authData.expire_time - Auth.refreshHandicapMs > Date.now()));

        }

        /**
         * Check if there is a valid (not expired) access token
         */
        refreshTokenValid():boolean {

            return (this.data().refresh_token_expire_time > Date.now());

        }

        cancelAccessToken() {

            return this.setData({
                access_token: '',
                expires_in: 0
            });

        }

        /**
         * This method sets a special authentication mode used in Service Web
         * @return {Platform}
         */
        forceAuthentication() {

            this.setData(<IAuthData>{
                token_type: Auth.forcedTokenType,
                access_token: '',
                expires_in: 0,
                refresh_token: '',
                refresh_token_expires_in: 0
            });

            return this;

        }

        setRemember(remember?:boolean):Auth {

            return this.setData({remember: remember});

        }

        remember():boolean {

            return !!this.data().remember;

        }

    }


    export interface IAuthData {
        remember?:boolean;
        token_type?:string;
        access_token?:string;
        expires_in?:number; // actually it's string
        expire_time?:number;
        refresh_token?:string;
        refresh_token_expires_in?:number; // actually it's string
        refresh_token_expire_time?:number;
        scope?:string;
    }

}