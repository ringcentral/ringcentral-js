/// <reference path="../externals.d.ts" />
/// <reference path="../core/Utils.ts" />
/// <reference path="../core/Utils.ts" />
/// <reference path="../externals/Externals.ts" />

module RingCentral.sdk.platform {

    export class Queue {

        protected _cacheId:string;
        protected _pollInterval:number;
        protected _releaseTimeout:number;

        protected _cache:core.Cache;
        protected _promise:Promise<any>;

        constructor(cache:core.Cache, cacheId:string) {

            this._cache = cache;
            this._cacheId = cacheId;

            this.setPollInterval(250);
            this.setReleaseTimeout(5000); // If queue was not released then force it to do so after some timeout

        }

        isPaused() {

            var storage = this._cache,
                cacheId = this._cacheId,
                time = storage.getItem(cacheId);

            return !!time && Date.now() - parseInt(time) < this._releaseTimeout;
        }

        pause() {
            this._cache.setItem(this._cacheId, Date.now());
            return this;
        }

        resume() {
            this._cache.removeItem(this._cacheId);
            return this;
        }

        poll() {

            if (this._promise) return this._promise;

            this._promise = new externals._Promise((resolve, reject) => {

                core.utils.poll((next) => {

                    if (this.isPaused()) return next();

                    this._promise = null;

                    this.resume(); // this is actually not needed but why not

                    resolve(null);

                }, this._pollInterval);

            });

            return this._promise;

        }

        releaseTimeout() {
            return this._releaseTimeout;
        }

        pollInterval() {
            return this._pollInterval;
        }

        setReleaseTimeout(releaseTimeout:number) {
            this._releaseTimeout = releaseTimeout;
            return this;
        }

        setPollInterval(pollInterval:number) {
            this._pollInterval = pollInterval;
            return this;
        }

    }

}