/// <reference path="../src/externals.d.ts" />
declare module RingCentral.sdk.core {
    class Cache {
        private _storage;
        private _prefix;
        constructor(storage: Storage | any, prefix?: string);
        setPrefix(prefix?: string): Cache;
        setItem(key: any, data: any): Cache;
        removeItem(key: any): Cache;
        getItem(key: any): any;
        clean(): Cache;
        protected _prefixKey(key: any): string;
    }
}
declare module RingCentral.sdk.core {
    /**
     * TODO Fix public vars
     */
    class Log {
        _console: Console;
        logDebug: boolean;
        logInfo: boolean;
        logWarnings: boolean;
        logErrors: boolean;
        addTimestamps: boolean;
        constructor(console?: Console);
        disableAll(): void;
        enableAll(): void;
        debug(...args: any[]): void;
        info(...args: any[]): void;
        warn(...args: any[]): void;
        error(...args: any[]): void;
        stack(): any;
        protected _parseArguments(args: any): any;
    }
    var log: Log;
}
declare module RingCentral.sdk.core.utils {
    /**
     * Ported from jQuery.fn.extend
     * Optional first parameter makes deep copy
     */
    function extend(targetObject: any, sourceObject: any, ...args: any[]): any;
    function forEach(object: any, cb: any): void;
    /**
     * TODO Replace with something better
     * @see https://github.com/joyent/node/blob/master/lib/querystring.js
     * @param {object} parameters
     * @returns {string}
     */
    function queryStringify(parameters: any): string;
    /**
     * TODO Replace with something better
     * @see https://github.com/joyent/node/blob/master/lib/querystring.js
     * @param {string} queryString
     * @returns {object}
     */
    function parseQueryString(queryString: string): any;
    /**
     * Returns true if the passed value is valid email address.
     * Checks multiple comma separated emails according to RFC 2822 if parameter `multiple` is `true`
     */
    function isEmail(v: string, multiple: boolean): boolean;
    function isPhoneNumber(v: string): boolean;
    /**
     * @param args
     * @returns {Array}
     */
    function argumentsToArray(args: any): any;
    function isDate(obj: any): boolean;
    function isFunction(obj: any): boolean;
    function isArray(obj: any): boolean;
    function isWindow(obj: any): boolean;
    function isNan(obj: any): boolean;
    function type(obj: any): string;
    function isPlainObject(obj: any): boolean;
    function getProperty(obj: any, property: string): any;
    function poll(fn: any, interval?: number, timeout?: any): any;
    function stopPolling(timeout: any): void;
    function parseString(s: any): string;
    function parseNumber(n: any): number;
    function isNodeJS(): boolean;
    function isBrowser(): boolean;
}
declare module RingCentral.sdk.core {
    /**
     * @see https://github.com/Microsoft/TypeScript/issues/275
     */
    class Observable<T extends Observable<any>> {
        private _listeners;
        constructor();
        hasListeners(event: any): boolean;
        on(events: any, callback: (...args) => any): T;
        emit(event: string, ...args: any[]): any;
        off(event?: string, callback?: any): T;
        destroy(): T;
    }
}
declare module RingCentral.sdk.core {
    class PageVisibility extends Observable<PageVisibility> {
        events: {
            change: string;
        };
        protected _visible: boolean;
        constructor();
        visible(): boolean;
    }
}
declare module RingCentral.sdk.mocks {
    class Mock {
        protected _method: string;
        protected _path: string;
        protected _delay: number;
        protected _json: any;
        protected _status: number;
        protected _statusText: string;
        constructor(method: string, path: string, json?: any, status?: number, statusText?: string, delay?: number);
        path(): string;
        method(): string;
        test(request: Request): boolean;
        getResponse(request: Request): Response | Promise<Response>;
        createResponse(json?: any, init?: ResponseInit | any): Response;
    }
}
declare module RingCentral.sdk.mocks {
    class Registry {
        protected _mocks: Mock[];
        constructor();
        add(mock: Mock): Registry;
        clear(): Registry;
        find(request: Request): Mock;
        apiCall(method: string, path: string, response: any, status?: number, statusText?: string): Registry;
        authentication(): Registry;
        logout(): Registry;
        presenceLoad(id: any): Registry;
        subscribeGeneric(expiresIn?: number): Registry;
        subscribeOnPresence(id?: string, detailed?: boolean): Registry;
        tokenRefresh(failure?: boolean): Registry;
    }
}
declare module RingCentral.sdk.externals {
    var _Promise: typeof Promise;
    var _fetch: Fetch;
    var _Response: typeof Response;
    var _Request: typeof Request;
    var _Headers: typeof Headers;
    var _PUBNUB: PUBNUB;
    function get(): typeof externals;
}
declare module RingCentral.sdk.http {
    /**
     * @TODO Bring back tests
     */
    class ApiResponse {
        static contentType: string;
        static jsonContentType: string;
        static multipartContentType: string;
        static urlencodedContentType: string;
        static headerSeparator: string;
        static bodySeparator: string;
        static boundarySeparator: string;
        protected _json: any;
        protected _text: string;
        protected _request: Request;
        protected _response: Response;
        protected _multipartTransactions: ApiResponse[];
        constructor(request?: Request, response?: Response, responseText?: string);
        response(): Response;
        request(): Request;
        ok(): boolean;
        text(): string;
        json(): any;
        error(skipOKCheck?: boolean): string;
        multipart(): ApiResponse[];
        /**
         * Short-hand method to get only JSON content of responses
         */
        multipartJson(): any[];
        protected _isContentType(contentType: string): boolean;
        protected _getContentType(): string;
        protected _isMultipart(): boolean;
        protected _isUrlEncoded(): boolean;
        protected _isJson(): boolean;
        /**
         * Method is used to create Transaction objects from string parts of multipart/mixed response
         * @param text
         * @param status
         * @param statusText
         * @return {ApiResponse}
         */
        static create(text?: string, status?: number, statusText?: string): ApiResponse;
    }
}
declare module RingCentral.sdk.http {
    class Client extends core.Observable<Client> {
        events: {
            beforeRequest: string;
            requestSuccess: string;
            requestError: string;
        };
        sendRequest(request: Request): Promise<ApiResponse>;
        protected _loadResponse(request: Request): Promise<Response>;
        /**
         * Wraps the JS Error object with transaction information
         * @param {Error} e
         * @param {ApiResponse} apiResponse
         * @return {IApiError}
         */
        static makeError(e: Error, apiResponse?: ApiResponse): IApiError;
        /**
         * TODO Wait for
         *   - https://github.com/github/fetch/issues/185
         *   - https://github.com/bitinn/node-fetch/issues/34
         * @param {Response} response
         * @return {Response}
         */
        static cloneResponse(response: Response): Response;
        /**
         * Creates a response
         * @param stringBody
         * @param init
         * @return {Response}
         */
        static createResponse(stringBody?: string, init?: ResponseInit): Response;
        static createRequest(input: string | Request, init?: IClientRequestInit): Request;
    }
    interface IApiError extends Error {
        stack?: string;
        originalMessage: string;
        apiResponse: ApiResponse;
    }
    interface IClientRequestInit extends RequestInit {
        query?: string;
    }
}
declare module RingCentral.sdk.platform {
    class Queue {
        protected _cacheId: string;
        protected _pollInterval: number;
        protected _releaseTimeout: number;
        protected _cache: core.Cache;
        protected _promise: Promise<any>;
        constructor(cache: core.Cache, cacheId: string);
        isPaused(): boolean;
        pause(): Queue;
        resume(): Queue;
        poll(): Promise<any>;
        releaseTimeout(): number;
        pollInterval(): number;
        setReleaseTimeout(releaseTimeout: number): Queue;
        setPollInterval(pollInterval: number): Queue;
    }
}
declare module RingCentral.sdk.platform {
    class Platform extends core.Observable<Platform> {
        protected static _urlPrefix: string;
        protected static _apiVersion: string;
        protected static _accessTokenTtl: number;
        protected static _refreshTokenTtl: number;
        protected static _refreshTokenTtlRemember: number;
        protected static _tokenEndpoint: string;
        protected static _revokeEndpoint: string;
        protected static _authorizeEndpoint: string;
        protected _server: string;
        protected _appKey: string;
        protected _appSecret: string;
        protected _refreshDelayMs: number;
        protected _clearCacheOnRefreshError: boolean;
        protected _cacheId: string;
        protected _queue: Queue;
        protected _cache: core.Cache;
        protected _client: http.Client;
        protected _auth: Auth;
        events: {
            accessViolation: string;
            logoutSuccess: string;
            logoutError: string;
            authorizeSuccess: string;
            authorizeError: string;
            refreshSuccess: string;
            refreshError: string;
        };
        constructor(client: http.Client, cache: core.Cache, server: string, appKey: string, appSecret: string);
        auth(): Auth;
        createUrl(path: any, options?: {
            addMethod?: string;
            addToken?: boolean;
            addServer?: boolean;
        }): string;
        authUrl(options: {
            redirectUri: string;
            display?: string;
            prompt?: string;
            state?: string;
            brandId?: string | number;
        }): string;
        parseAuthRedirectUrl(url: string): any;
        loggedIn(): Promise<boolean>;
        login(options?: {
            username?: string;
            password?: string;
            extension?: string;
            endpointId?: string;
            code?: string;
            redirectUri?: string;
            clientId?: string;
            remember?: boolean;
        }): Promise<http.ApiResponse>;
        refresh(): Promise<http.ApiResponse>;
        /**
         * @returns {Promise}
         */
        logout(): Promise<http.ApiResponse>;
        inflateRequest(request: Request, options?: IPlatformOptions): Promise<Request>;
        sendRequest(request: Request, options?: IPlatformOptions): Promise<http.ApiResponse>;
        /**
         * General purpose function to send anything to server
         */
        send(url: string, options?: IPlatformCombinedOptions): Promise<http.ApiResponse>;
        get(url: string, options?: IPlatformCombinedOptions): Promise<http.ApiResponse>;
        post(url: string, options: IPlatformCombinedOptions): Promise<http.ApiResponse>;
        put(url: string, options: IPlatformCombinedOptions): Promise<http.ApiResponse>;
        'delete'(url: string, options?: IPlatformCombinedOptions): Promise<http.ApiResponse>;
        protected _tokenRequest(path: string, body: any): Promise<http.ApiResponse>;
        protected _ensureAuthentication(): Promise<any>;
        protected _isAccessTokenValid(): boolean;
        protected _refreshPolling(): Promise<any>;
        protected _apiKey(): string;
        protected _authHeader(): string;
    }
    interface IAuthError extends Error {
        error?: string;
    }
    interface IPlatformOptions {
        skipAuthCheck?: boolean;
    }
    interface IPlatformCombinedOptions extends IPlatformOptions, http.IClientRequestInit {
    }
}
declare module RingCentral.sdk.subscription {
    class Subscription extends core.Observable<Subscription> {
        protected _renewHandicapMs: number;
        protected _subscription: ISubscription | any;
        protected _timeout: any;
        protected _eventFilters: string[];
        protected _pubnub: PUBNUBInstance;
        protected _platform: platform.Platform;
        protected _pubnubFactory: pubnub.PubnubFactory;
        events: {
            notification: string;
            removeSuccess: string;
            removeError: string;
            renewSuccess: string;
            renewError: string;
            subscribeSuccess: string;
            subscribeError: string;
        };
        constructor(pubnubFactory: pubnub.PubnubFactory, platform: platform.Platform);
        alive(): any;
        setSubscription(subscription: any): Subscription;
        subscription(): ISubscription;
        /**
         * Creates or updates subscription if there is an active one
         * @param {{events?:string[]}} [options] New array of events
         * @returns {Promise}
         */
        register(options?: {
            events?: string[];
        }): Promise<http.ApiResponse>;
        addEvents(events: string[]): Subscription;
        setEvents(events: string[]): Subscription;
        subscribe(options?: {
            events?: string[];
        }): Promise<http.ApiResponse>;
        renew(options?: {
            events?: string[];
        }): Promise<http.ApiResponse>;
        remove(): Promise<http.ApiResponse>;
        /**
         * Remove subscription and disconnect from PUBNUB
         * This method resets subscription at client side but backend is not notified
         */
        reset(): Subscription;
        destroy(): Subscription;
        protected _getFullEventFilters(): string[];
        protected _setTimeout(): Subscription;
        protected _clearTimeout(): Subscription;
        protected _decrypt(message: any): any;
        protected _notify(message: any): Subscription;
        protected _subscribeAtPubnub(): Subscription;
    }
    interface ISubscription {
        id?: string;
        uri?: string;
        eventFilters?: string[];
        expirationTime?: string;
        expiresIn?: number;
        deliveryMode?: {
            transportType?: string;
            encryption?: boolean;
            address?: string;
            subscriberKey?: string;
            encryptionKey?: string;
            secretKey?: string;
        };
        creationTime?: string;
        status?: string;
    }
}
declare module RingCentral.sdk.pubnub {
    class PubnubMock extends core.Observable<PubnubMock> implements PUBNUBInstance {
        private options;
        crypto_obj: PUBNUBCryptoObj;
        constructor(options: PUBNUBInitOptions);
        ready(): void;
        subscribe(options: PUBNUBSubscribeOptions): void;
        unsubscribe(options: PUBNUBUnsubscribeOptions): void;
        receiveMessage(msg: any, channel: any): void;
    }
    class PubnubMockFactory implements PUBNUB {
        crypto_obj: PUBNUBCryptoObj;
        constructor();
        init(options: PUBNUBInitOptions): PubnubMock;
    }
}
declare module RingCentral.sdk.pubnub {
    class PubnubFactory {
        private _useMock;
        private _mock;
        constructor(flag: boolean);
        getPubnub(): PUBNUB;
    }
}
declare module RingCentral.sdk {
    class SDK {
        static version: string;
        static server: {
            sandbox: string;
            production: string;
        };
        private _platform;
        private _cache;
        private _queue;
        private _client;
        private _pubnubFactory;
        private _mockRegistry;
        constructor(options?: {
            server: string;
            appKey: string;
            appSecret: string;
            appName?: string;
            appVersion?: string;
            cachePrefix?: string;
            useHttpMock?: boolean;
            usePubnubMock?: boolean;
        });
        platform(): platform.Platform;
        cache(): core.Cache;
        createSubscription(): subscription.Subscription;
        createPageVisibility(): core.PageVisibility;
        createObservable(): core.Observable<core.Observable<any>>;
        log(): core.Log;
        utils(): typeof core.utils;
        mockRegistry(): mocks.Registry;
    }
}
declare var e: typeof RingCentral.sdk.externals;
declare module RingCentral.sdk.http {
    class ClientMock extends Client {
        private _registry;
        constructor(registry: mocks.Registry);
        protected _loadResponse(request: Request): Promise<Response>;
    }
}
declare module RingCentral.sdk.platform {
    class Auth {
        static refreshHandicapMs: number;
        static forcedTokenType: string;
        protected _cacheId: string;
        protected _cache: core.Cache;
        constructor(cache: core.Cache, cacheId: string);
        accessToken(): string;
        refreshToken(): string;
        tokenType(): string;
        data(): IAuthData;
        setData(authData: IAuthData): Auth;
        /**
         * Check if there is a valid (not expired) access token
         */
        accessTokenValid(): boolean;
        /**
         * Check if there is a valid (not expired) access token
         */
        refreshTokenValid(): boolean;
        cancelAccessToken(): Auth;
        /**
         * This method sets a special authentication mode used in Service Web
         * @return {Platform}
         */
        forceAuthentication(): Auth;
        setRemember(remember?: boolean): Auth;
        remember(): boolean;
    }
    interface IAuthData {
        remember?: boolean;
        token_type?: string;
        access_token?: string;
        expires_in?: number;
        expire_time?: number;
        refresh_token?: string;
        refresh_token_expires_in?: number;
        refresh_token_expire_time?: number;
        scope?: string;
    }
}
declare module "ringcentral" {
    export = RingCentral;
}