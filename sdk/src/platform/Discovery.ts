import {EventEmitter} from 'events';

import Cache from '../core/Cache';
import Client from '../http/Client';

import {delay} from './utils';

export interface DiscoveryOptions {
    cache: Cache;
    cacheId: string;
    initialEndpoint: string;
    fetchGet: (url: string, query?, options?) => Promise<Response>;
    clientId: string;
    brandId?: string;
    refreshHandicapMs?: number;
    refreshDelayMs?: number;
    retryCount?: number;
    retryInterval?: number;
}

export interface ExternalDisconveryAuthApiData {
    authorizationUri: string;
    oidcDiscoveryUri: string;
    baseUri: string;
    tokenUri: string;
}

export interface InitialDisconveryAuthApiData {
    authorizationUri: string;
    oidcDiscoveryUri: string;
    defaultTokenUri: string;
}

export interface DiscoveryCoreApiData {
    baseUri: string;
}

export interface ExternalDiscoveryApiData {
    externalUri: string;
    initialUri: string;
}

export interface InitialDiscoveryApiData {
    defaultExternalUri: string;
}

export interface DisconveryGlipData {
    discovery: string;
    entry: string;
}

export interface DiscoveryRcvData {
    baseWebUri: string;
    baseApiUri: string;
    pubnubOrigin: string;
}

export interface DiscoveryRcmData {
    baseWebUri: string;
    sdkDomain: string;
}

export interface DiscoveryEdcData {
    baseUri: string;
}

export interface InitialDiscoveryData {
    version: string;
    retryCount: number;
    retryInterval: number;
    discoveryApi: InitialDiscoveryApiData;
    authApi: InitialDisconveryAuthApiData;
    coreApi: DiscoveryCoreApiData;
    rcm: DiscoveryRcmData;
    rcv: DiscoveryRcvData;
    edc?: DiscoveryEdcData;
    glip?: DisconveryGlipData;
}

export interface ExternalDisconveryData {
    version: string;
    tag?: string;
    expiresIn: number;
    expireTime: number;
    retryCount: number;
    retryInterval: number;
    retryCycleDelay: number;
    discoveryApi: ExternalDiscoveryApiData;
    authApi: ExternalDisconveryAuthApiData;
    coreApi: DiscoveryCoreApiData;
    rcm: DiscoveryRcmData;
    rcv: DiscoveryRcvData;
    edc?: DiscoveryEdcData;
    glip?: DisconveryGlipData;
}

export enum events {
    initialized = 'initialized',
    externalDataUpdated = 'externalDataUpdated',
    externalRefreshError = 'externalRefreshError',
    initialFetchError = 'initialFetchError',
}

export const DEFAULT_RETRY_COUNT = 3;
export const DEFAULT_RETRY_Interval = 3;

export const DEFAULT_RENEW_HANDICAP_MS = 60 * 1000; // 1 minute

export default class Discovery extends EventEmitter {
    public events = events;

    private _cache: Cache;

    private _initialCacheId: string;
    private _externalCacheId: string;

    private _fetchGet: (url: string, query?, options?) => Promise<Response>;
    private _initialEndpoint: string;
    private _clientId: string;
    private _defaultBrandId?: string;
    private _initialPromise?: Promise<void>;
    private _initialFetchPromise?: Promise<InitialDiscoveryData>;

    private _externalFetchPromise?: Promise<ExternalDisconveryData>;
    private _externalRefreshPromise?: Promise<void>;

    private _initialized: boolean = false;

    private _refreshHandicapMs: number;
    private _refreshDelayMs: number;

    private _initialRetryCount: number = 0;
    private _initialRetryMaxCount: number;
    private _initialRetryInterval: number;

    private _externalRetryCount: number = 0;
    private _externalRetryMaxCount: number;
    private _externalRetryInterval: number;
    private _externalRetryCycleTimeout?: ReturnType<typeof setTimeout> = null;

    public constructor({
        cache,
        cacheId,
        fetchGet,
        clientId,
        initialEndpoint,
        refreshHandicapMs = DEFAULT_RENEW_HANDICAP_MS,
        refreshDelayMs = 100,
        retryCount = DEFAULT_RETRY_COUNT,
        retryInterval = DEFAULT_RETRY_Interval,
        brandId,
    }: DiscoveryOptions) {
        super();

        this._cache = cache;
        this._initialCacheId = `${cacheId}-initial`;
        this._externalCacheId = `${cacheId}-external`;
        this._refreshHandicapMs = refreshHandicapMs;
        this._refreshDelayMs = refreshDelayMs;
        this._initialEndpoint = initialEndpoint;
        this._fetchGet = fetchGet;
        this._clientId = clientId;
        this._defaultBrandId = brandId;

        this._initialRetryMaxCount = retryCount;
        this._initialRetryInterval = retryInterval;

        this._externalRetryMaxCount = retryCount;
        this._externalRetryInterval = retryInterval;
    }

    public async init() {
        if (!this._clientId) {
            throw new Error('Client Id is required for discovery');
        }
        if (!this._initialPromise) {
            this._initialPromise = this._init();
        }
        try {
            await this._initialPromise;
            this._initialPromise = null;
        } catch (e) {
            this._initialPromise = null;
            throw e;
        }
    }

    private async _init() {
        let initialData = await this.initialData();
        if (!initialData) {
            initialData = await this.fetchInitialData();
        } else {
            this._initialRetryMaxCount = initialData.retryCount;
            this._initialRetryInterval = initialData.retryInterval;
            this._externalRetryMaxCount = initialData.retryCount;
            this._externalRetryInterval = initialData.retryInterval;
        }
        this._initialized = true;
        this.emit(events.initialized, initialData);
    }

    public async fetchInitialData() {
        try {
            if (!this._initialFetchPromise) {
                this._initialFetchPromise = this._fetchInitialData();
            }
            const initialData = await this._initialFetchPromise;
            this._initialRetryMaxCount = initialData.retryCount;
            this._initialRetryInterval = initialData.retryInterval;
            this._externalRetryMaxCount = initialData.retryCount;
            this._externalRetryInterval = initialData.retryInterval;
            this._initialFetchPromise = null;
            return initialData;
        } catch (e) {
            this._initialFetchPromise = null;
            this.emit(events.initialFetchError, e);
            throw e;
        }
    }

    private async _fetchInitialData() {
        try {
            const initialParams = {clientId: this._clientId};
            if (this._defaultBrandId) {
                initialParams['brandId'] = this._defaultBrandId;
            }
            const response = await this._fetchGet(this._initialEndpoint, initialParams, {
                skipAuthCheck: true,
                skipDiscoveryCheck: true,
            });
            const initialData = await response.json();
            await this._setInitialData(initialData);
            this._initialRetryCount = 0;
            return initialData;
        } catch (e) {
            this._initialRetryCount += 1;
            if (this._initialRetryCount < this._initialRetryMaxCount) {
                await delay(this._initialRetryInterval * 1000);
                return this._fetchInitialData();
            }
            this._initialRetryCount = 0;
            throw e;
        }
    }

    private async _fetchExternalData(externalEndoint: string) {
        try {
            const response = await this._fetchGet(externalEndoint, null, {skipDiscoveryCheck: true});
            const externalData = await response.json();
            const discoveryTag = response.headers.get('discovery-tag');
            if (discoveryTag) {
                externalData.tag = discoveryTag;
            }
            return externalData;
        } catch (e) {
            if (e.response && e.response.status === Client._unauthorizedStatus) {
                throw e;
            }
            this._externalRetryCount += 1;
            if (this._externalRetryCount < this._externalRetryMaxCount) {
                await delay(this._externalRetryInterval * 1000);
                return this._fetchExternalData(externalEndoint);
            }
            this._externalRetryCount = 0;
            throw e;
        }
    }

    public async fetchExternalData(externalEndoint: string) {
        try {
            if (!this._externalFetchPromise) {
                this._externalFetchPromise = this._fetchExternalData(externalEndoint);
            }
            const externalData = await this._externalFetchPromise;
            await this._setExternalData(externalData);
            this._externalFetchPromise = null;
            this.emit(events.externalDataUpdated, externalData);
            return externalData;
        } catch (e) {
            this._externalFetchPromise = null;
            throw e;
        }
    }

    private async _refreshExternalData() {
        if (this.externalRetryCycleScheduled) {
            return;
        }
        await delay(this._refreshDelayMs);
        const oldExternalData = await this.externalData();
        let externalEndoint;
        if (oldExternalData) {
            externalEndoint = oldExternalData.discoveryApi.externalUri;
        } else {
            const initialData = await this.initialData();
            externalEndoint = initialData.discoveryApi.defaultExternalUri;
        }
        try {
            await this.fetchExternalData(externalEndoint);
        } catch (e) {
            this._externalRetryCycleTimeout = setTimeout(() => {
                this._externalRetryCycleTimeout = null;
                this._refreshExternalData();
            }, oldExternalData.retryCycleDelay * 1000);
            this.emit(events.externalRefreshError, {
                error: e,
                message: `Fetch External Discovery data error, will retry after ${oldExternalData.retryCycleDelay}s.`,
            });
        }
    }

    public async refreshExternalData() {
        if (!this._externalRefreshPromise) {
            this._externalRefreshPromise = this._refreshExternalData();
        }
        try {
            await this._externalRefreshPromise;
            this._externalRefreshPromise = null;
        } catch (e) {
            this._externalRefreshPromise = null;
            throw e;
        }
    }

    public async initialData(): Promise<InitialDiscoveryData | null> {
        const data = await this._cache.getItem(this._initialCacheId);
        return data || null;
    }

    public async externalData(): Promise<ExternalDisconveryData | null> {
        const data = await this._cache.getItem(this._externalCacheId);
        return data || null;
    }

    private async _setInitialData(newData: InitialDiscoveryData) {
        await this._cache.setItem(this._initialCacheId, newData);
    }

    private async _setExternalData(newData: ExternalDisconveryData) {
        let expireTime;
        if (newData.expiresIn) {
            expireTime = Date.now() + newData.expiresIn * 1000;
        }
        await this._cache.setItem(this._externalCacheId, {
            ...newData,
            expireTime: expireTime,
        });
    }

    public async removeExternalData() {
        await this._cache.removeItem(this._externalCacheId);
    }

    public async removeInitialData() {
        await this._cache.removeItem(this._initialCacheId);
    }

    /**
     * Check if there is expired
     */
    public async externalDataExpired() {
        const data = await this.externalData();
        if (!data) {
            return true;
        }
        if (!data.expireTime) {
            return false;
        }
        return data.expireTime - this._refreshHandicapMs < Date.now();
    }

    public get initialized() {
        return this._initialized;
    }

    public get refreshingExternalData() {
        return !!this._externalRefreshPromise;
    }

    public get externalRetryCycleScheduled() {
        return this._externalRetryCycleTimeout !== null;
    }

    public cancelExternalRetryCycleTimeout() {
        if (this._externalRetryCycleTimeout !== null) {
            clearTimeout(this._externalRetryCycleTimeout);
        }
    }

    public on(event: events.initialized, listener: (discoveryData: InitialDiscoveryData) => void);
    public on(event: events.externalDataUpdated, listener: (discoveryData: ExternalDisconveryData) => void);
    public on(event: events.initialFetchError, listener: (e: Error) => void);
    public on(event: events.externalRefreshError, listener: (e: Error) => void);
    public on(event: string, listener: (...args) => void) {
        return super.on(event, listener);
    }
}
