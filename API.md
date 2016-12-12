
## Classes

<dl>
<dt><a href="#Externals">Externals</a></dt>
<dd></dd>
<dt><a href="#Auth">Auth</a></dt>
<dd></dd>
<dt><a href="#Platform">Platform</a></dt>
<dd></dd>
<dt><a href="#SDK">SDK</a></dt>
<dd></dd>
<dt><a href="#CachedSubscription">CachedSubscription</a> ⇐ <code><a href="#Subscription">Subscription</a></code></dt>
<dd></dd>
<dt><a href="#Subscription">Subscription</a></dt>
<dd></dd>
</dl>

## Members

<dl>
<dt><a href="#IApiError">IApiError</a></dt>
<dd></dd>
</dl>

## Objects

<dl>
<dt><a href="#RingCentral">RingCentral</a> : <code>object</code></dt>
<dd></dd>
</dl>

## Functions

<dl>
<dt><a href="#Cache">Cache()</a></dt>
<dd></dd>
<dt><a href="#ApiResponse">ApiResponse()</a></dt>
<dd></dd>
<dt><a href="#Client">Client(externals)</a></dt>
<dd></dd>
<dt><a href="#asyncTest">asyncTest(fn)</a> ⇒ <code>function</code></dt>
<dd></dd>
</dl>

## Typedefs

<dl>
<dt><a href="#ISubscription">ISubscription</a> : <code>Object</code></dt>
<dd><p>The complete Triforce, or one or more components of the Triforce.</p>
</dd>
</dl>

<a name="Externals"></a>

## Externals
**Kind**: global class  
**Properties**

| Name | Type |
| --- | --- |
| PUBNUB | <code>PUBNUB</code> | 
| localStorage | <code>Storage</code> | 
| Promise | <code>function</code> | 
| fetch | <code>fetch</code> | 
| Request | <code>function</code> | 
| Response | <code>function</code> | 
| Headers | <code>function</code> | 


-

<a name="new_Externals_new"></a>

### new Externals()

| Param | Type |
| --- | --- |
| [options.PUBNUB] | <code>PUBNUB</code> | 
| [options.Promise] | <code>function</code> | 
| [options.localStorage] | <code>Storage</code> | 
| [options.fetch] | <code>fetch</code> | 
| [options.Request] | <code>function</code> | 
| [options.Response] | <code>function</code> | 
| [options.Headers] | <code>function</code> | 


-

<a name="Auth"></a>

## Auth
**Kind**: global class  
**Properties**

| Name | Type |
| --- | --- |
| _cache | <code>[Cache](#Cache)</code> | 
| _refreshHandicapMs | <code>int</code> | 
| _cacheId | <code>string</code> | 


* [Auth](#Auth)
    * [new Auth()](#new_Auth_new)
    * [.data()](#Auth+data) ⇒ <code>Object</code>
    * [.setData(newData)](#Auth+setData) ⇒ <code>[Auth](#Auth)</code>
    * [.accessTokenValid()](#Auth+accessTokenValid) ⇒ <code>boolean</code>
    * [.refreshTokenValid()](#Auth+refreshTokenValid) ⇒ <code>boolean</code>
    * [.cancelAccessToken()](#Auth+cancelAccessToken) ⇒ <code>[Auth](#Auth)</code>


-

<a name="new_Auth_new"></a>

### new Auth()

| Param | Type |
| --- | --- |
| options.cache | <code>[Cache](#Cache)</code> | 
| options.cacheId | <code>string</code> | 
| [options.refreshHandicapMs] | <code>int</code> | 


-

<a name="Auth+data"></a>

### auth.data() ⇒ <code>Object</code>
**Kind**: instance method of <code>[Auth](#Auth)</code>  

-

<a name="Auth+setData"></a>

### auth.setData(newData) ⇒ <code>[Auth](#Auth)</code>
**Kind**: instance method of <code>[Auth](#Auth)</code>  

| Param | Type |
| --- | --- |
| newData | <code>object</code> | 


-

<a name="Auth+accessTokenValid"></a>

### auth.accessTokenValid() ⇒ <code>boolean</code>
Check if there is a valid (not expired) access token

**Kind**: instance method of <code>[Auth](#Auth)</code>  

-

<a name="Auth+refreshTokenValid"></a>

### auth.refreshTokenValid() ⇒ <code>boolean</code>
Check if there is a valid (not expired) access token

**Kind**: instance method of <code>[Auth](#Auth)</code>  

-

<a name="Auth+cancelAccessToken"></a>

### auth.cancelAccessToken() ⇒ <code>[Auth](#Auth)</code>
**Kind**: instance method of <code>[Auth](#Auth)</code>  

-

<a name="Platform"></a>

## Platform
**Kind**: global class  
**Properties**

| Name | Type |
| --- | --- |
| _externals | <code>[Externals](#Externals)</code> | 
| _cache | <code>[Cache](#Cache)</code> | 
| _client | <code>[Client](#Client)</code> | 
| _refreshPromise | <code>[Promise.&lt;ApiResponse&gt;](#ApiResponse)</code> | 
| _auth | <code>[Auth](#Auth)</code> | 


* [Platform](#Platform)
    * [new Platform()](#new_Platform_new)
    * [.auth()](#Platform+auth) ⇒ <code>[Auth](#Auth)</code>
    * [.client()](#Platform+client) ⇒ <code>[Client](#Client)</code>
    * [.createUrl(path, [options])](#Platform+createUrl) ⇒ <code>string</code>
    * [.loginUrl()](#Platform+loginUrl) ⇒ <code>string</code>
    * [.parseLoginRedirect(url)](#Platform+parseLoginRedirect) ⇒ <code>Object</code>
    * [.loginWindow()](#Platform+loginWindow) ⇒ <code>Promise</code>
    * [.loggedIn()](#Platform+loggedIn) ⇒ <code>Promise.&lt;boolean&gt;</code>
    * [.login()](#Platform+login) ⇒ <code>[Promise.&lt;ApiResponse&gt;](#ApiResponse)</code>
    * [.refresh()](#Platform+refresh) ⇒ <code>[Promise.&lt;ApiResponse&gt;](#ApiResponse)</code>
    * [.logout()](#Platform+logout) ⇒ <code>[Promise.&lt;ApiResponse&gt;](#ApiResponse)</code>
    * [.inflateRequest(request, [options])](#Platform+inflateRequest) ⇒ <code>Promise.&lt;Request&gt;</code>
    * [.sendRequest(request, [options])](#Platform+sendRequest) ⇒ <code>[Promise.&lt;ApiResponse&gt;](#ApiResponse)</code>
    * [.send()](#Platform+send) ⇒ <code>[Promise.&lt;ApiResponse&gt;](#ApiResponse)</code>
    * [.get(url, [query], [options])](#Platform+get) ⇒ <code>[Promise.&lt;ApiResponse&gt;](#ApiResponse)</code>
    * [.post(url, body, [query], [options])](#Platform+post) ⇒ <code>[Promise.&lt;ApiResponse&gt;](#ApiResponse)</code>
    * [.put(url, [body], [query], [options])](#Platform+put) ⇒ <code>[Promise.&lt;ApiResponse&gt;](#ApiResponse)</code>
    * [.delete(url, [query], [options])](#Platform+delete) ⇒ <code>[Promise.&lt;ApiResponse&gt;](#ApiResponse)</code>


-

<a name="new_Platform_new"></a>

### new Platform()

| Param | Type |
| --- | --- |
| options.server | <code>string</code> | 
| options.appSecret | <code>string</code> | 
| options.appKey | <code>string</code> | 
| [options.appName] | <code>string</code> | 
| [options.appVersion] | <code>string</code> | 
| [options.redirectUri] | <code>string</code> | 
| [options.refreshDelayMs] | <code>int</code> | 
| [options.refreshHandicapMs] | <code>int</code> | 
| [options.clearCacheOnRefreshError] | <code>boolean</code> | 
| options.externals | <code>[Externals](#Externals)</code> | 
| options.cache | <code>[Cache](#Cache)</code> | 
| options.client | <code>[Client](#Client)</code> | 


-

<a name="Platform+auth"></a>

### platform.auth() ⇒ <code>[Auth](#Auth)</code>
**Kind**: instance method of <code>[Platform](#Platform)</code>  

-

<a name="Platform+client"></a>

### platform.client() ⇒ <code>[Client](#Client)</code>
**Kind**: instance method of <code>[Platform](#Platform)</code>  

-

<a name="Platform+createUrl"></a>

### platform.createUrl(path, [options]) ⇒ <code>string</code>
**Kind**: instance method of <code>[Platform](#Platform)</code>  

| Param | Type |
| --- | --- |
| path | <code>string</code> | 
| [options] | <code>object</code> | 
| [options.addServer] | <code>boolean</code> | 
| [options.addMethod] | <code>string</code> | 
| [options.addToken] | <code>boolean</code> | 


-

<a name="Platform+loginUrl"></a>

### platform.loginUrl() ⇒ <code>string</code>
**Kind**: instance method of <code>[Platform](#Platform)</code>  

| Param | Type | Description |
| --- | --- | --- |
| [options.redirectUri] | <code>string</code> | Overrides default RedirectURI |
| [options.state] | <code>string</code> |  |
| [options.brandId] | <code>string</code> |  |
| [options.display] | <code>string</code> |  |
| [options.prompt] | <code>string</code> |  |
| [options.implicit] | <code>boolean</code> | Use Implicit Grant flow |


-

<a name="Platform+parseLoginRedirect"></a>

### platform.parseLoginRedirect(url) ⇒ <code>Object</code>
**Kind**: instance method of <code>[Platform](#Platform)</code>  

| Param | Type |
| --- | --- |
| url | <code>string</code> | 


-

<a name="Platform+loginWindow"></a>

### platform.loginWindow() ⇒ <code>Promise</code>
Convenience method to handle 3-legged OAuth

Attention! This is an experimental method and it's signature and behavior may change without notice.

**Kind**: instance method of <code>[Platform](#Platform)</code>  
**Experimental**:   

| Param | Type | Description |
| --- | --- | --- |
| options.url | <code>string</code> |  |
| [options.width] | <code>number</code> |  |
| [options.height] | <code>number</code> |  |
| [options.login] | <code>object</code> | additional options for login() |
| [options.origin] | <code>string</code> |  |
| [options.property] | <code>string</code> | name of window.postMessage's event data property |
| [options.target] | <code>string</code> | target for window.open() |


-

<a name="Platform+loggedIn"></a>

### platform.loggedIn() ⇒ <code>Promise.&lt;boolean&gt;</code>
**Kind**: instance method of <code>[Platform](#Platform)</code>  

-

<a name="Platform+login"></a>

### platform.login() ⇒ <code>[Promise.&lt;ApiResponse&gt;](#ApiResponse)</code>
**Kind**: instance method of <code>[Platform](#Platform)</code>  

| Param | Type |
| --- | --- |
| options.username | <code>string</code> | 
| options.password | <code>string</code> | 
| [options.extension] | <code>string</code> | 
| [options.code] | <code>string</code> | 
| [options.redirectUri] | <code>string</code> | 
| [options.endpointId] | <code>string</code> | 
| [options.accessTokenTtl] | <code>string</code> | 
| [options.refreshTokenTtl] | <code>string</code> | 
| [options.access_token] | <code>string</code> | 


-

<a name="Platform+refresh"></a>

### platform.refresh() ⇒ <code>[Promise.&lt;ApiResponse&gt;](#ApiResponse)</code>
**Kind**: instance method of <code>[Platform](#Platform)</code>  

-

<a name="Platform+logout"></a>

### platform.logout() ⇒ <code>[Promise.&lt;ApiResponse&gt;](#ApiResponse)</code>
**Kind**: instance method of <code>[Platform](#Platform)</code>  

-

<a name="Platform+inflateRequest"></a>

### platform.inflateRequest(request, [options]) ⇒ <code>Promise.&lt;Request&gt;</code>
**Kind**: instance method of <code>[Platform](#Platform)</code>  

| Param | Type |
| --- | --- |
| request | <code>Request</code> | 
| [options] | <code>object</code> | 
| [options.skipAuthCheck] | <code>boolean</code> | 


-

<a name="Platform+sendRequest"></a>

### platform.sendRequest(request, [options]) ⇒ <code>[Promise.&lt;ApiResponse&gt;](#ApiResponse)</code>
**Kind**: instance method of <code>[Platform](#Platform)</code>  

| Param | Type | Description |
| --- | --- | --- |
| request | <code>Request</code> |  |
| [options] | <code>object</code> |  |
| [options.skipAuthCheck] | <code>boolean</code> |  |
| [options.retry] | <code>boolean</code> | Will be set by this method if SDK makes second request |


-

<a name="Platform+send"></a>

### platform.send() ⇒ <code>[Promise.&lt;ApiResponse&gt;](#ApiResponse)</code>
General purpose function to send anything to server

**Kind**: instance method of <code>[Platform](#Platform)</code>  

| Param | Type |
| --- | --- |
| options.url | <code>string</code> | 
| [options.body] | <code>object</code> | 
| [options.method] | <code>string</code> | 
| [options.query] | <code>object</code> | 
| [options.headers] | <code>object</code> | 
| [options.skipAuthCheck] | <code>boolean</code> | 


-

<a name="Platform+get"></a>

### platform.get(url, [query], [options]) ⇒ <code>[Promise.&lt;ApiResponse&gt;](#ApiResponse)</code>
**Kind**: instance method of <code>[Platform](#Platform)</code>  

| Param | Type |
| --- | --- |
| url | <code>string</code> | 
| [query] | <code>object</code> | 
| [options] | <code>object</code> | 
| [options.headers] | <code>object</code> | 
| [options.skipAuthCheck] | <code>boolean</code> | 


-

<a name="Platform+post"></a>

### platform.post(url, body, [query], [options]) ⇒ <code>[Promise.&lt;ApiResponse&gt;](#ApiResponse)</code>
**Kind**: instance method of <code>[Platform](#Platform)</code>  

| Param | Type |
| --- | --- |
| url | <code>string</code> | 
| body | <code>object</code> | 
| [query] | <code>object</code> | 
| [options] | <code>object</code> | 
| [options.headers] | <code>object</code> | 
| [options.skipAuthCheck] | <code>boolean</code> | 


-

<a name="Platform+put"></a>

### platform.put(url, [body], [query], [options]) ⇒ <code>[Promise.&lt;ApiResponse&gt;](#ApiResponse)</code>
**Kind**: instance method of <code>[Platform](#Platform)</code>  

| Param | Type |
| --- | --- |
| url | <code>string</code> | 
| [body] | <code>object</code> | 
| [query] | <code>object</code> | 
| [options] | <code>object</code> | 
| [options.headers] | <code>object</code> | 
| [options.skipAuthCheck] | <code>boolean</code> | 


-

<a name="Platform+delete"></a>

### platform.delete(url, [query], [options]) ⇒ <code>[Promise.&lt;ApiResponse&gt;](#ApiResponse)</code>
**Kind**: instance method of <code>[Platform](#Platform)</code>  

| Param | Type |
| --- | --- |
| url | <code>string</code> | 
| [query] | <code>string</code> | 
| [options] | <code>object</code> | 
| [options.headers] | <code>object</code> | 
| [options.skipAuthCheck] | <code>boolean</code> | 


-

<a name="SDK"></a>

## SDK
**Kind**: global class  
**Properties**

| Name | Type |
| --- | --- |
| _externals | <code>[Externals](#Externals)</code> | 
| _cache | <code>[Cache](#Cache)</code> | 
| _client | <code>[Client](#Client)</code> | 
| _platform | <code>[Platform](#Platform)</code> | 


* [SDK](#SDK)
    * [new SDK()](#new_SDK_new)
    * [.platform()](#SDK+platform) ⇒ <code>[Platform](#Platform)</code>
    * [.cache()](#SDK+cache) ⇒ <code>[Cache](#Cache)</code>
    * [.createSubscription()](#SDK+createSubscription) ⇒ <code>[Subscription](#Subscription)</code>
    * [.createCachedSubscription()](#SDK+createCachedSubscription) ⇒ <code>[CachedSubscription](#CachedSubscription)</code>


-

<a name="new_SDK_new"></a>

### new SDK()

| Param | Type |
| --- | --- |
| options.server | <code>string</code> | 
| options.appSecret | <code>string</code> | 
| options.appKey | <code>string</code> | 
| [options.cachePrefix] | <code>string</code> | 
| [options.appName] | <code>string</code> | 
| [options.appVersion] | <code>string</code> | 
| [options.redirectUri] | <code>string</code> | 
| [options.PUBNUB] | <code>PUBNUB</code> | 
| [options.Promise] | <code>function</code> | 
| [options.localStorage] | <code>Storage</code> | 
| [options.fetch] | <code>fetch</code> | 
| [options.Request] | <code>function</code> | 
| [options.Response] | <code>function</code> | 
| [options.Headers] | <code>function</code> | 
| [options.refreshDelayMs] | <code>int</code> | 
| [options.refreshHandicapMs] | <code>int</code> | 
| [options.clearCacheOnRefreshError] | <code>boolean</code> | 


-

<a name="SDK+platform"></a>

### sdK.platform() ⇒ <code>[Platform](#Platform)</code>
**Kind**: instance method of <code>[SDK](#SDK)</code>  

-

<a name="SDK+cache"></a>

### sdK.cache() ⇒ <code>[Cache](#Cache)</code>
**Kind**: instance method of <code>[SDK](#SDK)</code>  

-

<a name="SDK+createSubscription"></a>

### sdK.createSubscription() ⇒ <code>[Subscription](#Subscription)</code>
**Kind**: instance method of <code>[SDK](#SDK)</code>  

| Param | Type |
| --- | --- |
| [options.pollInterval] | <code>int</code> | 
| [options.renewHandicapMs] | <code>int</code> | 


-

<a name="SDK+createCachedSubscription"></a>

### sdK.createCachedSubscription() ⇒ <code>[CachedSubscription](#CachedSubscription)</code>
**Kind**: instance method of <code>[SDK](#SDK)</code>  

| Param | Type |
| --- | --- |
| options.cacheKey | <code>string</code> | 
| [options.pollInterval] | <code>int</code> | 
| [options.renewHandicapMs] | <code>int</code> | 


-

<a name="CachedSubscription"></a>

## CachedSubscription ⇐ <code>[Subscription](#Subscription)</code>
**Kind**: global class  
**Extends:** <code>[Subscription](#Subscription)</code>  
**Properties**

| Name | Type |
| --- | --- |
| _cache | <code>[Cache](#Cache)</code> | 


* [CachedSubscription](#CachedSubscription) ⇐ <code>[Subscription](#Subscription)</code>
    * [new CachedSubscription()](#new_CachedSubscription_new)
    * [.restore(events)](#CachedSubscription+restore) ⇒ <code>[CachedSubscription](#CachedSubscription)</code>
    * [.alive()](#Subscription+alive) ⇒ <code>boolean</code>
    * [.expired()](#Subscription+expired) ⇒ <code>boolean</code>
    * [.setSubscription(subscription)](#Subscription+setSubscription) ⇒ <code>[Subscription](#Subscription)</code>
    * [.subscription()](#Subscription+subscription) ⇒ <code>[ISubscription](#ISubscription)</code>
    * [.register()](#Subscription+register) ⇒ <code>[Promise.&lt;ApiResponse&gt;](#ApiResponse)</code>
    * [.eventFilters()](#Subscription+eventFilters) ⇒ <code>Array.&lt;string&gt;</code>
    * [.addEventFilters(events)](#Subscription+addEventFilters) ⇒ <code>[Subscription](#Subscription)</code>
    * [.setEventFilters(events)](#Subscription+setEventFilters) ⇒ <code>[Subscription](#Subscription)</code>
    * [.subscribe()](#Subscription+subscribe) ⇒ <code>[Promise.&lt;ApiResponse&gt;](#ApiResponse)</code>
    * [.renew()](#Subscription+renew) ⇒ <code>[Promise.&lt;ApiResponse&gt;](#ApiResponse)</code>
    * [.remove()](#Subscription+remove) ⇒ <code>[Promise.&lt;ApiResponse&gt;](#ApiResponse)</code>
    * [.resubscribe()](#Subscription+resubscribe) ⇒ <code>[Promise.&lt;ApiResponse&gt;](#ApiResponse)</code>
    * [.reset()](#Subscription+reset) ⇒ <code>[Subscription](#Subscription)</code>


-

<a name="new_CachedSubscription_new"></a>

### new CachedSubscription()

| Param | Type |
| --- | --- |
| options.platform | <code>[Platform](#Platform)</code> | 
| options.externals | <code>[Externals](#Externals)</code> | 
| options.cache | <code>[Cache](#Cache)</code> | 
| options.cacheKey | <code>string</code> | 
| [options.pollInterval] | <code>int</code> | 
| [options.renewHandicapMs] | <code>int</code> | 


-

<a name="CachedSubscription+restore"></a>

### cachedSubscription.restore(events) ⇒ <code>[CachedSubscription](#CachedSubscription)</code>
This function checks whether there are any pre-defined eventFilters in cache and if not -- uses provided as defaults

**Kind**: instance method of <code>[CachedSubscription](#CachedSubscription)</code>  

| Param | Type |
| --- | --- |
| events | <code>Array.&lt;string&gt;</code> | 


-

<a name="Subscription+alive"></a>

### cachedSubscription.alive() ⇒ <code>boolean</code>
**Kind**: instance method of <code>[CachedSubscription](#CachedSubscription)</code>  

-

<a name="Subscription+expired"></a>

### cachedSubscription.expired() ⇒ <code>boolean</code>
**Kind**: instance method of <code>[CachedSubscription](#CachedSubscription)</code>  

-

<a name="Subscription+setSubscription"></a>

### cachedSubscription.setSubscription(subscription) ⇒ <code>[Subscription](#Subscription)</code>
**Kind**: instance method of <code>[CachedSubscription](#CachedSubscription)</code>  

| Param | Type |
| --- | --- |
| subscription | <code>[ISubscription](#ISubscription)</code> | 


-

<a name="Subscription+subscription"></a>

### cachedSubscription.subscription() ⇒ <code>[ISubscription](#ISubscription)</code>
**Kind**: instance method of <code>[CachedSubscription](#CachedSubscription)</code>  
**Overrides:** <code>[subscription](#Subscription+subscription)</code>  

-

<a name="Subscription+register"></a>

### cachedSubscription.register() ⇒ <code>[Promise.&lt;ApiResponse&gt;](#ApiResponse)</code>
Creates or updates subscription if there is an active one

**Kind**: instance method of <code>[CachedSubscription](#CachedSubscription)</code>  

-

<a name="Subscription+eventFilters"></a>

### cachedSubscription.eventFilters() ⇒ <code>Array.&lt;string&gt;</code>
**Kind**: instance method of <code>[CachedSubscription](#CachedSubscription)</code>  

-

<a name="Subscription+addEventFilters"></a>

### cachedSubscription.addEventFilters(events) ⇒ <code>[Subscription](#Subscription)</code>
**Kind**: instance method of <code>[CachedSubscription](#CachedSubscription)</code>  

| Param | Type |
| --- | --- |
| events | <code>Array.&lt;string&gt;</code> | 


-

<a name="Subscription+setEventFilters"></a>

### cachedSubscription.setEventFilters(events) ⇒ <code>[Subscription](#Subscription)</code>
**Kind**: instance method of <code>[CachedSubscription](#CachedSubscription)</code>  

| Param | Type |
| --- | --- |
| events | <code>Array.&lt;string&gt;</code> | 


-

<a name="Subscription+subscribe"></a>

### cachedSubscription.subscribe() ⇒ <code>[Promise.&lt;ApiResponse&gt;](#ApiResponse)</code>
**Kind**: instance method of <code>[CachedSubscription](#CachedSubscription)</code>  

-

<a name="Subscription+renew"></a>

### cachedSubscription.renew() ⇒ <code>[Promise.&lt;ApiResponse&gt;](#ApiResponse)</code>
**Kind**: instance method of <code>[CachedSubscription](#CachedSubscription)</code>  

-

<a name="Subscription+remove"></a>

### cachedSubscription.remove() ⇒ <code>[Promise.&lt;ApiResponse&gt;](#ApiResponse)</code>
**Kind**: instance method of <code>[CachedSubscription](#CachedSubscription)</code>  

-

<a name="Subscription+resubscribe"></a>

### cachedSubscription.resubscribe() ⇒ <code>[Promise.&lt;ApiResponse&gt;](#ApiResponse)</code>
**Kind**: instance method of <code>[CachedSubscription](#CachedSubscription)</code>  

-

<a name="Subscription+reset"></a>

### cachedSubscription.reset() ⇒ <code>[Subscription](#Subscription)</code>
Remove subscription and disconnect from PUBNUB
This method resets subscription at client side but backend is not notified

**Kind**: instance method of <code>[CachedSubscription](#CachedSubscription)</code>  

-

<a name="Subscription"></a>

## Subscription
**Kind**: global class  
**Properties**

| Name | Type |
| --- | --- |
| _externals | <code>[Externals](#Externals)</code> | 
| _platform | <code>[Platform](#Platform)</code> | 
| _pollInterval | <code>int</code> | 
| _renewHandicapMs | <code>int</code> | 
| _pubnub | <code>PUBNUB</code> | 
| _pubnubLastChannel | <code>string</code> | 
| _timeout | <code>int</code> | 
| _subscription | <code>[ISubscription](#ISubscription)</code> | 


* [Subscription](#Subscription)
    * [new Subscription()](#new_Subscription_new)
    * [.alive()](#Subscription+alive) ⇒ <code>boolean</code>
    * [.expired()](#Subscription+expired) ⇒ <code>boolean</code>
    * [.setSubscription(subscription)](#Subscription+setSubscription) ⇒ <code>[Subscription](#Subscription)</code>
    * [.subscription()](#Subscription+subscription) ⇒ <code>[ISubscription](#ISubscription)</code>
    * [.register()](#Subscription+register) ⇒ <code>[Promise.&lt;ApiResponse&gt;](#ApiResponse)</code>
    * [.eventFilters()](#Subscription+eventFilters) ⇒ <code>Array.&lt;string&gt;</code>
    * [.addEventFilters(events)](#Subscription+addEventFilters) ⇒ <code>[Subscription](#Subscription)</code>
    * [.setEventFilters(events)](#Subscription+setEventFilters) ⇒ <code>[Subscription](#Subscription)</code>
    * [.subscribe()](#Subscription+subscribe) ⇒ <code>[Promise.&lt;ApiResponse&gt;](#ApiResponse)</code>
    * [.renew()](#Subscription+renew) ⇒ <code>[Promise.&lt;ApiResponse&gt;](#ApiResponse)</code>
    * [.remove()](#Subscription+remove) ⇒ <code>[Promise.&lt;ApiResponse&gt;](#ApiResponse)</code>
    * [.resubscribe()](#Subscription+resubscribe) ⇒ <code>[Promise.&lt;ApiResponse&gt;](#ApiResponse)</code>
    * [.reset()](#Subscription+reset) ⇒ <code>[Subscription](#Subscription)</code>


-

<a name="new_Subscription_new"></a>

### new Subscription()

| Param | Type |
| --- | --- |
| options.platform | <code>[Platform](#Platform)</code> | 
| options.externals | <code>[Externals](#Externals)</code> | 
| [options.pollInterval] | <code>int</code> | 
| [options.renewHandicapMs] | <code>int</code> | 


-

<a name="Subscription+alive"></a>

### subscription.alive() ⇒ <code>boolean</code>
**Kind**: instance method of <code>[Subscription](#Subscription)</code>  

-

<a name="Subscription+expired"></a>

### subscription.expired() ⇒ <code>boolean</code>
**Kind**: instance method of <code>[Subscription](#Subscription)</code>  

-

<a name="Subscription+setSubscription"></a>

### subscription.setSubscription(subscription) ⇒ <code>[Subscription](#Subscription)</code>
**Kind**: instance method of <code>[Subscription](#Subscription)</code>  

| Param | Type |
| --- | --- |
| subscription | <code>[ISubscription](#ISubscription)</code> | 


-

<a name="Subscription+subscription"></a>

### subscription.subscription() ⇒ <code>[ISubscription](#ISubscription)</code>
**Kind**: instance method of <code>[Subscription](#Subscription)</code>  

-

<a name="Subscription+register"></a>

### subscription.register() ⇒ <code>[Promise.&lt;ApiResponse&gt;](#ApiResponse)</code>
Creates or updates subscription if there is an active one

**Kind**: instance method of <code>[Subscription](#Subscription)</code>  

-

<a name="Subscription+eventFilters"></a>

### subscription.eventFilters() ⇒ <code>Array.&lt;string&gt;</code>
**Kind**: instance method of <code>[Subscription](#Subscription)</code>  

-

<a name="Subscription+addEventFilters"></a>

### subscription.addEventFilters(events) ⇒ <code>[Subscription](#Subscription)</code>
**Kind**: instance method of <code>[Subscription](#Subscription)</code>  

| Param | Type |
| --- | --- |
| events | <code>Array.&lt;string&gt;</code> | 


-

<a name="Subscription+setEventFilters"></a>

### subscription.setEventFilters(events) ⇒ <code>[Subscription](#Subscription)</code>
**Kind**: instance method of <code>[Subscription](#Subscription)</code>  

| Param | Type |
| --- | --- |
| events | <code>Array.&lt;string&gt;</code> | 


-

<a name="Subscription+subscribe"></a>

### subscription.subscribe() ⇒ <code>[Promise.&lt;ApiResponse&gt;](#ApiResponse)</code>
**Kind**: instance method of <code>[Subscription](#Subscription)</code>  

-

<a name="Subscription+renew"></a>

### subscription.renew() ⇒ <code>[Promise.&lt;ApiResponse&gt;](#ApiResponse)</code>
**Kind**: instance method of <code>[Subscription](#Subscription)</code>  

-

<a name="Subscription+remove"></a>

### subscription.remove() ⇒ <code>[Promise.&lt;ApiResponse&gt;](#ApiResponse)</code>
**Kind**: instance method of <code>[Subscription](#Subscription)</code>  

-

<a name="Subscription+resubscribe"></a>

### subscription.resubscribe() ⇒ <code>[Promise.&lt;ApiResponse&gt;](#ApiResponse)</code>
**Kind**: instance method of <code>[Subscription](#Subscription)</code>  

-

<a name="Subscription+reset"></a>

### subscription.reset() ⇒ <code>[Subscription](#Subscription)</code>
Remove subscription and disconnect from PUBNUB
This method resets subscription at client side but backend is not notified

**Kind**: instance method of <code>[Subscription](#Subscription)</code>  

-

<a name="IApiError"></a>

## IApiError
**Kind**: global variable  
**Properties**

| Name | Type |
| --- | --- |
| stack | <code>string</code> | 
| originalMessage | <code>string</code> | 
| apiResponse | <code>[ApiResponse](#ApiResponse)</code> | 


-

<a name="RingCentral"></a>

## RingCentral : <code>object</code>
**Kind**: global namespace  

-

<a name="Cache"></a>

## Cache()
**Kind**: global function  

| Param | Type |
| --- | --- |
| options.externals | <code>[Externals](#Externals)</code> | 
| [options.prefix] | <code>string</code> | 

**Properties**

| Name | Type |
| --- | --- |
| _externals | <code>[Externals](#Externals)</code> | 


-

<a name="ApiResponse"></a>

## ApiResponse()
**Kind**: global function  

| Param | Type |
| --- | --- |
| options.externals | <code>[Externals](#Externals)</code> | 
| [options.request] | <code>Request</code> | 
| [options.response] | <code>Response</code> | 
| [options.responseText] | <code>string</code> | 

**Properties**

| Name | Type |
| --- | --- |
| _externals | <code>[Externals](#Externals)</code> | 
| _request | <code>Request</code> | 
| _response | <code>Response</code> | 
| _text | <code>string</code> | 
| _json | <code>object</code> | 
| _multipart | <code>[Array.&lt;ApiResponse&gt;](#ApiResponse)</code> | 


* [ApiResponse()](#ApiResponse)
    * [.receiveResponse(response)](#ApiResponse+receiveResponse) ⇒ <code>[Promise.&lt;ApiResponse&gt;](#ApiResponse)</code>
    * [.response()](#ApiResponse+response) ⇒ <code>Response</code>
    * [.request()](#ApiResponse+request) ⇒ <code>Request</code>
    * [.ok()](#ApiResponse+ok) ⇒ <code>boolean</code>
    * [.text()](#ApiResponse+text) ⇒ <code>string</code>
    * [.json()](#ApiResponse+json) ⇒ <code>object</code>
    * [.error([skipOKCheck])](#ApiResponse+error) ⇒ <code>string</code>
    * [.toMultipart()](#ApiResponse+toMultipart) ⇒ <code>[Array.&lt;ApiResponse&gt;](#ApiResponse)</code>
    * [.multipart()](#ApiResponse+multipart) ⇒ <code>[Array.&lt;ApiResponse&gt;](#ApiResponse)</code>


-

<a name="ApiResponse+receiveResponse"></a>

### apiResponse.receiveResponse(response) ⇒ <code>[Promise.&lt;ApiResponse&gt;](#ApiResponse)</code>
**Kind**: instance method of <code>[ApiResponse](#ApiResponse)</code>  

| Param | Type |
| --- | --- |
| response | <code>Response</code> | 


-

<a name="ApiResponse+response"></a>

### apiResponse.response() ⇒ <code>Response</code>
**Kind**: instance method of <code>[ApiResponse](#ApiResponse)</code>  

-

<a name="ApiResponse+request"></a>

### apiResponse.request() ⇒ <code>Request</code>
**Kind**: instance method of <code>[ApiResponse](#ApiResponse)</code>  

-

<a name="ApiResponse+ok"></a>

### apiResponse.ok() ⇒ <code>boolean</code>
**Kind**: instance method of <code>[ApiResponse](#ApiResponse)</code>  

-

<a name="ApiResponse+text"></a>

### apiResponse.text() ⇒ <code>string</code>
**Kind**: instance method of <code>[ApiResponse](#ApiResponse)</code>  

-

<a name="ApiResponse+json"></a>

### apiResponse.json() ⇒ <code>object</code>
**Kind**: instance method of <code>[ApiResponse](#ApiResponse)</code>  

-

<a name="ApiResponse+error"></a>

### apiResponse.error([skipOKCheck]) ⇒ <code>string</code>
**Kind**: instance method of <code>[ApiResponse](#ApiResponse)</code>  

| Param |
| --- |
| [skipOKCheck] | 


-

<a name="ApiResponse+toMultipart"></a>

### apiResponse.toMultipart() ⇒ <code>[Array.&lt;ApiResponse&gt;](#ApiResponse)</code>
If it is not known upfront what would be the response, client code can treat any response as multipart

**Kind**: instance method of <code>[ApiResponse](#ApiResponse)</code>  

-

<a name="ApiResponse+multipart"></a>

### apiResponse.multipart() ⇒ <code>[Array.&lt;ApiResponse&gt;](#ApiResponse)</code>
**Kind**: instance method of <code>[ApiResponse](#ApiResponse)</code>  

-

<a name="Client"></a>

## Client(externals)
**Kind**: global function  

| Param | Type |
| --- | --- |
| externals | <code>[Externals](#Externals)</code> | 

**Properties**

| Name | Type |
| --- | --- |
| _externals | <code>[Externals](#Externals)</code> | 


* [Client(externals)](#Client)
    * [.sendRequest(request)](#Client+sendRequest) ⇒ <code>[Promise.&lt;ApiResponse&gt;](#ApiResponse)</code>
    * [.makeError(e, apiResponse)](#Client+makeError) ⇒ <code>[IApiError](#IApiError)</code>
    * [.createRequest(init)](#Client+createRequest) ⇒ <code>Request</code>


-

<a name="Client+sendRequest"></a>

### client.sendRequest(request) ⇒ <code>[Promise.&lt;ApiResponse&gt;](#ApiResponse)</code>
**Kind**: instance method of <code>[Client](#Client)</code>  

| Param | Type |
| --- | --- |
| request | <code>Request</code> | 


-

<a name="Client+makeError"></a>

### client.makeError(e, apiResponse) ⇒ <code>[IApiError](#IApiError)</code>
Wraps the JS Error object with transaction information

**Kind**: instance method of <code>[Client](#Client)</code>  

| Param | Type |
| --- | --- |
| e | <code>Error</code> &#124; <code>[IApiError](#IApiError)</code> | 
| apiResponse | <code>[ApiResponse](#ApiResponse)</code> | 


-

<a name="Client+createRequest"></a>

### client.createRequest(init) ⇒ <code>Request</code>
**Kind**: instance method of <code>[Client](#Client)</code>  

| Param | Type |
| --- | --- |
| init | <code>object</code> | 
| [init.url] | <code>object</code> | 
| [init.body] | <code>object</code> | 
| [init.method] | <code>string</code> | 
| [init.query] | <code>object</code> | 
| [init.headers] | <code>object</code> | 
| [init.credentials] | <code>object</code> | 
| [init.mode] | <code>object</code> | 


-

<a name="asyncTest"></a>

## asyncTest(fn) ⇒ <code>function</code>
**Kind**: global function  

| Param | Type |
| --- | --- |
| fn | <code>function</code> | 


-

<a name="ISubscription"></a>

## ISubscription : <code>Object</code>
The complete Triforce, or one or more components of the Triforce.

**Kind**: global typedef  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| id | <code>string</code> |  |
| uri | <code>string</code> |  |
| eventFilters | <code>Array.&lt;string&gt;</code> |  |
| expirationTime | <code>string</code> | Format: 2014-03-12T19:54:35.613Z |
| expiresIn | <code>int</code> |  |
| deliveryMode.transportType | <code>string</code> |  |
| deliveryMode.encryption | <code>boolean</code> |  |
| deliveryMode.address | <code>string</code> |  |
| deliveryMode.subscriberKey | <code>string</code> |  |
| deliveryMode.encryptionKey | <code>string</code> |  |
| deliveryMode.secretKey | <code>string</code> |  |
| creationTime | <code>string</code> |  |
| status | <code>string</code> | Active |


-

