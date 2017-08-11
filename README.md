[![TravisCI Status](https://travis-ci.org/ringcentral/ringcentral-js.svg?branch=master)](https://travis-ci.org/ringcentral/ringcentral-js)
[![Coverage Status](https://coveralls.io/repos/github/ringcentral/ringcentral-js/badge.svg?branch=master)](https://coveralls.io/github/ringcentral/ringcentral-js)
[![Chat](https://img.shields.io/badge/chat-on%20glip-orange.svg)](https://glipped.herokuapp.com/)

# Table of contents

- [Key Benefits](#key-benefits)
- [Installation](#installation)
- [Getting Started](#getting-started)
- [API Calls](#api-calls)
- [Server-side Subscriptions](#server-side-subscriptions)
- [Advanced SDK Configuration & Polyfills](#advanced-sdk-configuration--polyfills)
- [Making telephony calls](#making-telephony-calls)
- [Call management using JavaScript](#call-management-using-javascript)
- [SMS](#sms)
- [MMS](#mms)
- [Fax](#fax)
- [Page visibility](#page-visibility)
- [Tracking network Requests And Responses](#tracking-network-requests-and-responses)
- [Migration from previous releases](#migration-from-previous-releases)

***

# Key Benefits

- Automatically handles token lifecycle procedures in multi-tab environment
- Re-issues non-authorized requests
- Decrypts PUBNUB notification messages
- Parses multipart API responses
- Restores subscriptions from cache
- Automatically re-subscribes in case of subscription renewal errors
- Compatible with latest WhatWG `fetch()` spec (DOM Requests and Responses)

***

# Installation

You will need to configure SDK instance with your unique application key & secret this is provided by RingCentral's
developer relations team.

This instance will be used later on to perform calls to API.

You can also supply optional polyfills and dependency injections, please read the [polyfills](#advanced-sdk-configuration--polyfills)
section of this readme.

SDK can be used in 3 environments:

1. [NodeJS](#set-things-up-in-nodejs)
2. [Browserify or Webpack](#set-things-up-for-browserify-or-webpack)
3. [Browser](#set-things-up-in-browser)

## Set things up in NodeJS

1. Install the NPM package:

    ```sh
    npm install ringcentral --save
    ```

2. Require the SDK:

    ```js
    var SDK = require('ringcentral');
    var rcsdk = new SDK({ 
        server: SDK.server.sandbox, 
        appKey: 'yourAppKey',
        appSecret: 'yourAppSecret',
        redirectUri: '' // optional, but is required for Implicit Grant and Authorization Code OAuth Flows (see below)
    });
    ```

## Set things up for Browserify or Webpack

Follow installation steps for NodeJS. Don't forget to add `target: 'web'` to your `webpack.config.js` to tell Webpack to
pick proper `PUNBUB` and `fetch` implementations.

## Set things up in Browser

### Get the code

Pick the option that works best for you:

- Use CDN **Attention! Versions listed here may be outdated**:
    - https://cdn.rawgit.com/ringcentral/ringcentral-js/master/build/ringcentral.js
    - https://cdnjs.cloudflare.com/ajax/libs/fetch/0.11.1/fetch.js
    - https://cdnjs.cloudflare.com/ajax/libs/es6-promise/3.2.2/es6-promise.js
    - https://cdn.pubnub.com/pubnub-3.15.2.js

- Download everything manually:
    - [ZIP file with source code](https://github.com/ringcentral/ringcentral-js/archive/master.zip)
    - [Fetch](https://github.com/github/fetch), direct download: [fetch.js](https://raw.githubusercontent.com/github/fetch/master/fetch.js)
    - [ES6 Promise](https://github.com/jakearchibald/es6-promise), direct download: [es6-promise.js](https://raw.githubusercontent.com/jakearchibald/es6-promise/master/dist/es6-promise.js)
    - [PUBNUB](https://github.com/pubnub/javascript), direct download: [pubnub.js](https://raw.githubusercontent.com/pubnub/javascript/master/web/pubnub.js)

- Use Bower, all dependencies will be downloaded to `bower_components` directory:

    ```sh
    bower install ringcentral --save
    ```

### Add scripts to HTML page (if you are not using any module loaders)

The SDK is represented by the global RingCentral constructor. Your application must create an instance of this object:

Add the following to your HTML:

```html
<script type="text/javascript" src="path-to-scripts/es6-promise/promise.js"></script>
<script type="text/javascript" src="path-to-scripts/fetch/fetch.js"></script>
<script type="text/javascript" src="path-to-scripts/pubnub/web/pubnub.js"></script>
<script type="text/javascript" src="path-to-scripts/ringcentral/build/ringcentral.js"></script><!-- or ringcentral.min.js -->
<script type="text/javascript">

    var rcsdk = new RingCentral.SDK({
        server: RingCentral.SDK.server.sandbox, 
        appKey: 'yourAppKey',
        appSecret: 'yourAppSecret',
        redirectUri: '' // optional, but is required for Implicit Grant and Authorization Code OAuth Flows (see below)
    });

</script>
```

### If you use RequireJS in your project

```js
// Add this to your RequireJS configuration file
require.config({
    paths: {
        'pubnub': 'path-to-scripts/pubnub/web/pubnub',
        'ringcentral': 'path-to-scripts/ringcentral/build/ringcentral' // or ringcentral.min
    }
});

// Then you can use the SDK like any other AMD component
require(['ringcentral'], function(SDK) {
    var rcsdk = new SDK({
        server: SDK.server.sandbox, 
        appKey: 'yourAppKey',
        appSecret: 'yourAppSecret',
        redirectUri: '' // optional, but is required for Implicit Grant and Authorization Code OAuth Flows (see below)
    });
});
```

Make sure that [polyfills](#advanced-sdk-configuration--polyfills) are added to the page before or together with the SDK.
Make sure SDK is [configured](#advanced-sdk-configuration--polyfills) to use polyfills.

***

# Getting Started

Read [API documentation](API.md) for more information.

## Get the Platform object

```js
var platform = rcsdk.platform();
```

Now that you have your platform object and the SDK has been configured with the correct server URL and API key, your
application can now log in and access the features of this API.

## Login

Login is accomplished by calling the `platform.login()` method of the Platform object with certain parameters depending
on the type of auth flow. A `Promise` instance is returned, resolved with an AJAX `Response` object.

### 3-legged OAuth 2.0 Flows

SDK provides a set of helper functions to assist with 3-legged OAuth flow.

You can pick one of two available setups:

1. Top Frame &mdash; user temporarily navigates away from the app to RingCentral login pages
2. Popup &mdash; RingCentral login pages are opened in a popup

Both setups support Authorization Code and Implicit Grant flows.

#### Top Frame Setup

This setup is good when your app uses the entire browser window.

When login is required for your application, the app's login page needs to open a URL that can be generated by SDK:

```js
var loginUrl = rcsdk.platform().loginUrl({implicit: true}); // implicit parameter is optional, default false
window.location.assign(loginUrl); // or .replace()
```

Your application need to have a special landing page to handle OAuth Redirect URI. On this page you need to resume
the flow:

```js
var loginOptions = rcsdk.platform().parseLoginRedirect(window.location.hash || window.location.search);
rcsdk.platform().login(loginOptions).then(...);
```

The above mentioned flow assumes that login page will be rendered in the top frame, e.g. user will temporarily navigate
away from the app to RingCentral login pages.

#### Popup Setup

This setup is good when your app is rendered as a widget on a third-party sites.

If you would like to simply open RingCentral login pages in a popup, you may use the following short-hand in your app's
login page:

```js
var platform = rcsdk.platform();
var loginUrl = platform.loginUrl({implicit: true}); // implicit parameter is optional, default false
platform
    .loginWindow({url: loginUrl}) // this method also allows to supply more options to control window position
    .then(function (loginOptions){
        return platform.login(loginOptions);
    })
    .then(...)
    .catch(...);
```

In this case your landing page (the one to which Redirect URI points) need to call the following code:

```js
RingCentral.SDK.handleLoginRedirect();
```

#### Difference between Authorization Code and Implicit Grant flows

If your app uses Implicit Grant you should not provide `appSecret` when creating SDK instance. The resulting login
information will not have `refresh_token`, which means that every time when `access_token` expires, app should navigate
users to app login page and re-initiate login flow. Also your app will need to handle situations with `refreshError`
events properly, for instance, enter auth flow automatically without user intervention.

For dynamic apps with subscriptions Authorization Code should work better because it provides an ability to refresh
tokens automatically without affecting the state of the app, but it requires to expose `appSecret`.

### Password Flow

This flow to be used only for private backend apps that can protect user credentials. Client-side apps are not allowed
to use this flow.

Login is accomplished by calling the `platform.login()` method of the Platform object with username, extension
(optional), and password as parameters.

```js
rcsdk.platform()
    .login({
        username: '18001234567', // phone number in full format
        extension: '', // leave blank if direct number is used
        password: 'yourpassword'
    })
    .then(function(response) {
          // your code here
    })
    .catch(function(e) {
        alert(e.message  || 'Server cannot authorize user');
    });
```

## Handling login success

Because the login process is asynchronous, you need to call the promise's `then` method and pass your success handler as
the continuation function.

This function will be called once login has succeeded, which allows the application to then perform updates to
the user interface, and then perform the next actions using the API to load account details for the user's account
and such.

## Handling login failure

Login can, of course, fail - a user can enter the incorrect password or mistype their user name.

To handle cases where login fails, you can provide an error handler function in a call to the Promise's `catch` method.
To keep this example simple, a simple JavaScript alert is being used. In a real application, you will want to provide
a good UX in your login form UI.

## Checking login state

To check in your Application if the user is authenticated, you can call the `loggedIn` method of the platform
object:

```js
rcsdk.platform().loggedIn().then(function(status){ if (status) { ... } else { ... } });
```

Or you can call `ensureLogedIn` method which works the same way as `loggedIn` but rejects promise on failure:

```js
rcsdk.platform().ensureLogedIn().then(function(){ ... }).catch(function(){ ... });
```

The SDK takes care of the token lifecycle. It will refresh tokens for you automatically. It will also automatically
pause and queue all new API requests while the token is being refreshed in order to prevent data loss or inconsistency
between SDK instances in different tabs. Paused / queued API requests will then be automatically processed once the
token has been refreshed. All apropriate events will be emitted during this process.

If you just need to check whether the user has a valid token, you can call the `accessTokenValid` method:

```js
rcsdk.platform().auth().accessTokenValid(); // returns boolean
```

## Retrieving and setting auth information

You can retrieve save and set back the auth information:

```js
var authData = rcsdk.platform().auth().data();
rcsdk.platform().auth().setData(authData);
```

It can be useful on the server if SDK instances are created and disposed for every HTTP request.

## Logout

Logging the user out is trivial - just call the `logout` method on the platform object:

```js
rcsdk.platform().logout().then(...).catch(...);
```

## Events

The platform provides the following events:

- `loginSuccess`
- `loginError`
- `logoutSuccess`
- `logoutError`
- `refreshSuccess`
- `refreshError` &mdash; application may listen to this error and show login page
- `rateLimitError`

To listen on platform events, you should call the `on` method of the platform object:

```js
var platform = rcsdk.platform();

platform.on(platform.events.refreshError, function(e){
    // do something, usually open a login page
});
```

The `on` method accepts an event type as its first argument and a handler function as its second argument.

# API calls

To perform an authenticated API call, you should use the one of the methods of the platform object:

```js
rcsdk.platform()
    .send({
        method: 'PUT',
        url: '/account/~/extension/~',
        query: {...},
        headers: {...},
        body: {...}
    })
    .then(function(apiResponse){

        alert(apiResponse.json().name);

    })
    .catch(function(e){

        alert(e.message);

        // please note that ajax property may not be accessible if error occurred before AJAX send
        if (e.apiResponse && e.apiResponse()) {

            var request = e.apiResponse().request();

            alert('Ajax error ' + e.message + ' for URL' + request.url + ' ' + e.apiResponse().error());

        }

    });

```

If your `Promise` library supports global error handler it might be useful to log Requests and Responses there.

## HTTP Verb shorthands

```js
rcsdk.platform().get('/account/~/extension/~', {...query}).then(...);
rcsdk.platform().post('/account/~/extension/~', {...body}, {...query}).then(...);
rcsdk.platform().put('/account/~/extension/~', {...body}, {...query}).then(...);
rcsdk.platform().delete('/account/~/extension/~', {...query}).then(...);
```

## Available API response methods

- `json()` &mdash; if response type is JSON returns a plain JS object
- `text()` &mdash; returns text representation
- `multipart()` &mdash; for `Content-Type: multipart/mixed` responses returns an array of `ApiResponse`
- `toMultipart()` &mdash; same as `multipart()` but when response is not `Content-Type: multipart/mixed` it will return an array with one item instead of error
- `ok()` &mdash; `true` for all `2xx` responses, `false` otherwise
- `error()` &mdash; error string if any
- `request()` &mdash; low-level `Request` object
- `response()` &mdash; low-level `Response` object

## Binary downloads

If you need to download a binary file from API (call recording, fax attachment), you can do it as follows:

### On NodeJS

```js
var fs = require('fs');

// read as buffer
rcsdk.platform().get('/account/~/messages/foo/content').then(function(res) {
    
    return res.response().buffer(); // we are accessing Node Fetch's Response
    
}).then(function(buffer) {
    
    fs.writeFileSync('./octocat.png', buffer);
    
});

// read as stream
rcsdk.platform().get('/account/~/messages/foo/content').then(function(res) {
    
    res.response().body.pipe(fs.createWriteStream('./octocat.png')); // we are accessing Node Fetch's Response
    
});
```

See more here [https://github.com/bitinn/node-fetch#usage](https://github.com/bitinn/node-fetch#usage).

### In browser
 
```js
rcsdk.platform().get('/account/~/messages/foo/content').then(function(res) {

    return res.response().blob(); // or arrayBuffer(), we are accessing WhatWG Fetch's Response

}).then(function(blob ){
    
    var img = document.createElement('img');
    img.src = URL.createObjectURL(blob);
    document.getElementById('container').appendChild(img);
    
});
```

See more here [https://developer.mozilla.org/en-US/docs/Web/API/Response](https://developer.mozilla.org/en-US/docs/Web/API/Response).

### Generic

In any case you always can just add token to known URL of resource and download it using whatever library you want or
use directly as `<img src="..."/>`:

```js
var url = rcsdk.platform().createUrl('/account/~/messages/foo/content', {addServer: true, addToken: true});
```

## Rate Limiting

Platform class emits `rateLimitError` if server returns `429` status. You may supply an option `handleRateLimit` and
SDK will re-execute the failed request. Please keep in mind that your application should somehow delay/throttle other
subsequent requests in this case because otherwise all those requests will be postponed too.

# Server-side Subscriptions

Subscriptions are a convenient way to receive updates on server-side events, such as new messages or presence changes.

Subscriptions are created by calling the `getSubscription` method of the RingCentral instance created earlier on.

```js
var subscription = rcsdk.createSubscription();

subscription.on(subscription.events.notification, function(msg) {
    console.log(msg, msg.body);
});

subscription
    .setEventFilters(['/account/~/extension/~/presence']) // a list of server-side events
    .register()
    .then(...);
```

## Removing Subscriptions from server

Once a subscription has been created, the SDK takes care of renewing it automatically. To cancel a subscription, you can
call the subscription instance's `remove()` method:

```js
subscription.remove().then(...).catch(...);
```

## Updating Subscriptions

You can add more or replace event filters in the existing subscription at any time, by calling the subscription methods
and then calling the `register()` method to update it on the server:

```js
subscription.setEventFilters(['/account/~/extension/111/presence']).register();
subscription.addEventFilters(['/account/~/extension/222/presence']).register();
```

## Subscription reset

To revert subscription instance to it's prestine state you can use its `reset()` and `off()` methods, this will close
PUBNUB channel, remove all timers, subscription data and all bindings:

```js
subscription.reset().off();
```

## Subscriptions lifecycle

The number of active subscriptions is limited per account (about 20). This means that the application should dispose
unused subscriptions in the following situations:

- Application should `reset()` subscriptions (on the server they are dead already):
    - the `Platform` instance emits `logoutSuccess` or `accessViolation` events so the app should `reset()` all subscriptions
- Application should `remove()` subscriptions or remove no longer needed event filters from them:
    - the user navigates away from the page or particular view
    - a subscription becomes unused by the application, based upon the application's business logic

One of very useful techniques to limit the number of active subscriptions is to store subscription data in cache and
share this data across Subscription instances in multiple tabs:

```js
var cacheKey = 'some-custom-key';
var subscription = rcsdk.createSubscription();
var cachedSubscriptionData = rcsdk.cache().getItem(cacheKey);

if (cachedSubscriptionData) {
    try { // if subscription is already expired an error will be thrown so we need to capture it
        subscription.setSubscription(cachedSubscriptionData); // use the cache
    } catch (e) {
        console.error('Cannot set subscription data', e);
    }
} else {
    subscription.setEventFilters(['/account/~/extension/~/presence']); // explicitly set required events
}

subscription.on([subscription.events.subscribeSuccess, subscription.events.renewSuccess], function() {
    rcsdk.cache().setItem(cacheKey, subscription.subscription());
});

subscription.register().catch(...);
```

With this technique subscription remove request on window/tab closing is no longer needed.

In any case if application logic dictates that subscription is not used anymore by any of it's instances, subscription
can be removed from the server to make sure application stays within limits.

## Stale Subscriptions

There is a known bug when user awakes the computer: subscription tries to renew itself but fails because the
expiration time has passed (JS was halted while computer was sleeping).

Recommendation is to listen to `subscription.events.renewError` event and when it occurs reset and re-subscribe:

```js
subscription.on(subscription.events.renewError, function() {
    subscription
        .reset()
        .setEventFilters('...') // some default set of event filters
        .register().catch(...);
});
```

This has to be done in all tabs, application must handle potential race conditions.

When SDK cannot automatically renew subscription it will fire an event `automaticRenewError` so that application can do
some actions in order to have active subscription again:

```js
subscription.on(subscription.events.automaticRenewError, function() {
    subscription.resubscribe().catch(...); // or do manual reset with default event filters as in code snippet before
});
```

## Multiple event filters in one Subscription

The best practice is to have only one subscription object with multiple event filters of different types (messages,
presence, etc.) instead of having a separate subscription for each individual event filter.

In the notification event handler application may have a bunch of if's that will execute appropriate action based on
`event` property of the incoming message:

```js
subscription.on(subscription.events.notification, function(msg) {
    if (msg.event.indexOf('/presence') > -1) { ... }
    else if (msg.event.indexOf('/message-store') > -1) { ... }
    else { ... }
});
```

## Shorthand

The above mentioned things are put together into `CachedSubscription` class and its `restore(cacheKey)` method:

```js
var subscription = rcsdk.createCachedSubscription('cache-key').restore(['/account/~/extension/~/presence']);

// use it as usual
subscription.register().catch(...);
```

***

# Advanced SDK Configuration & Polyfills

You can use any of your favourite `fetch()` and `Promise` polyfills. SDK tries to get them from global scope every
time new instance is created.

In rare case when SDK will not detect globals automatically you can set them as follows:

```js
window.Promise = whatever;
window.fetch = whatever;
window.Headers = whatever;
window.Request = whatever;
window.Response = whatever;
```

Also you can manually define SDK properties:

```js
var rcsdk = new SDK({
    localStorage: whatever,
    PUBNUB: whatever,
    Promise: whatever,
    fetch: whatever,
    Headers: whatever,
    Request: whatever,
    Response: whatever
});
```

But taking into account the nature of polyfills, it's better to keep them global as described before.

In the NodeJS it might be useful to replace simple built-in storage with something persistent:

```js
var sdk = new SDK({
    localStorage: whatever
});
```

SDK works with `localStorage` as with a simple object.

If you need to use 2 or more RingCentral accounts simultaneously, you need to create an instance of SDK for each account
and provide some unique `cachePrefix` to SDK constructor (otherwise instances will share authentication).

```js
var rcsdk1 = new SDK({
    cachePrefix: 'foo-'
});

var rcsdk2 = new SDK({
    cachePrefix: 'bar-'
});
```

***

# Making telephony calls

In RingCentral terminology, making telephony calls is named "RingOut".

This example demonstrates a way to create a flexible RingOut tracking procedure. This is the most complex example with
maximum fine-tuning - it could be simplified to suit the business requirements.

The sequence of RingOut is as follows:

1. Perform a POST with the RingOut data
2. Poll the RingOut status (GET requests) every second or so

Please refer to the following example:

```js
var platform = rcsdk.platform(),
    timeout = null, // reference to timeout object
    ringout = {}; // this is the status object (lowercase)

/**
 * @param {Error} e
 */
function handleError(e) {

    console.error(e);
    alert(e.message);

}

function create(unsavedRingout) {

    platform
        .post('/account/~/extension/~/ringout', unsavedRingout)
        .then(function(response) {

            ringout = response.json();
            console.info('First status:', ringout.status.callStatus);
            update();

        })
        .catch(handleError);

}

/**
 * @param {function(number?)} next - callback that will be used to continue polling
 * @param {number} delay - last used delay
 */
function update() {

    clearTimeout(timeout);

    setTimeout(function() {

        if (ringout.status && ringout.status.callStatus !== 'InProgress') return;

        platform
            .get(ringout.uri)
            .then(function(response) {

                ringout = response.json();
                console.info('Current status:', ringout.status.callStatus);
                update();

            })
            .catch(handleError);

    }, 500);

}

/**
 * To stop polling, call this at any time
 */
function hangUp() {

    clearTimeout(timeout);

    if (ringout.status && ringout.status.callStatus !== 'InProgress') {

        platform
            .delete(ringout.uri)
            .catch(handleError);

    }

    // Clean
    ringout = {
        from: {phoneNumber: ''},
        to: {phoneNumber: ''},
        callerId: {phoneNumber: ''}, // optional,
        playPrompt: true // optional
    };

}

/**
 * Start the ringout procedure (may be called multiple times with different settings)
 */
create({
    from: {phoneNumber: '16501111111'},
    to: {phoneNumber: '18882222222'},
    callerId: {phoneNumber: '18882222222'}, // optional,
    playPrompt: true // optional
});
```

***

# Call management using JavaScript

If you are integrating with a CRM or ERP system, use of the JavaScript SDK is highly recommended. Following is an
example of a call management integration that includes monitoring of incoming calls and performing of RingOuts.

A call management integration usually consists of the following tasks:

1. Track the telephony status
2. View the list of active calls
3. View the recent calls

## Track the telephony status

First, you need to load the initial Presence status (you can use Underscore or Lodash to simplify things):

```js
var accountPresence = {};

rcsdk.platform()
    .get('/account/~/extension/~/presence?detailedTelephonyState=true').then(function(response) {
        _.extend(accountPresence, response.json());
    })
    .catch(function(e) {
        alert('Load Presence Error: ' + e.message);
    });
```

In the meantime, you can also set up Subscriptions (you can use Underscore or Lodash to simplify things):

```js
var subscription = rcsdk.createSubscription().addEvents(['/account/~/extension/~/presence?detailedTelephonyState=true']);

subscription.on(subscription.events.notification, function(msg) {
    _.extend(accountPresence, msg);
});

subscription.register().then(function(response) {
    alert('Success: Subscription is listening');
}).catch(function(e) {
    alert('Subscription Error: ' + e.message);
});

return subscription;
```

## View the list of active calls

```js
rcsdk.platform()
    .get('/account/~/extension/~/active-calls', {query: {page: 1, perPage: 10}})
    .then(function(response) {
        activeCalls = response.json().records;
    })
    .catch(function(e) {
        alert('Active Calls Error: ' + e.message);
    });
```

## View the list of recent calls

```js
rcsdk.platform()
    .get('/account/~/extension/~/call-log', {query: {page: 1, perPage: 10}})
    .then(function(response) {
        calls = response.json().records;
    })
    .catch(function(e) {
        alert('Recent Calls Error: ' + e.message);
    });
```

By default, the load request returns calls that were made during the last week. To alter the time frame, provide custom
`query.dateTo` and `query.dateFrom` properties.

# SMS

In order to send an SMS using the API, simply make a POST request to `/account/~/extension/~/sms`:

```js
rcsdk.platform()
    .post('/account/~/extension/~/sms', {
        from: {phoneNumber:'+12223334444'}, // Your sms-enabled phone number
        to: [
            {phoneNumber:'+15556667777'} // Second party's phone number
        ],
        text: 'Message content'
    })
    .then(function(response) {
        alert('Success: ' + response.json().id);
    })
    .catch(function(e) {
        alert('Error: ' + e.message);
    });
```

# Fax

Fax endpoint understands `multipart/form-data` requests. First part must always be JSON-encoded information about the
fax. Other parts should have `filename` defined in order to be correctly presented in Service Web.

## Browser

Modern browsers have `FormData` class which could be used for sending faxes.

```js
var body = {
        to: [{phoneNumber: '123'}], // see all available options on Developer Portal
        faxResolution: 'High'
    },
    formData = new FormData();

// This is the mandatory part, the name and type should always be as follows
formData.append('json', new File([JSON.stringify(body)], 'request.json', {type: 'application/json'}));

// Find the input[type=file] field on the page
var fileField = document.getElementById('input-type-file-field');

// Iterate through all currently selected files
for (var i = 0, file; file = fileField.files[i]; ++i) {
    formData.append('attachment', file); // you can also use file.name instead of 'attachment'
}

// To send a plain text
formData.append('attachment', new File(['some plain text'], 'text.txt', {type: 'application/octet-stream'}));

// Send the fax
rcsdk.platform().post('/account/~/extension/~/fax', formData);
```

# MMS

As similar to the fax endpoint, `MMS` understands `multipart/form-data` requests. In order to send an MMS using the API, simply make a POST request to `/account/~/extension/~/sms`:

```js
var body = {
        from: {phoneNumber: '+12223334444'}, //// Your mms-enabled phone number
        to: [{phoneNumber: '123'}], // see all available options on Developer Portal
        faxResolution: 'High'
    },
    formData = new FormData();

// This is the mandatory part, the name and type should always be as follows
formData.append('json', new File([JSON.stringify(body)], 'request.json', {type: 'application/json'}));

// Find the input[type=file] field on the page
var fileField = document.getElementById('input-type-file-field');

// Iterate through all currently selected files
for (var i = 0, file; file = fileField.files[i]; ++i) {
    formData.append('attachment', file); // you can also use file.name instead of 'attachment'
}

// Send the mms
rcsdk.platform().post('/account/~/extension/~/sms', formData);
```

## MMS-Enabled Phone Number

In order to identify the MMS-Enabled phone numbers on an extension, simply make a GET request to `/account/~/extension/~/phone-number`

```js
var mmsEnabledNumbers = [];
    platform
        .get('/account/~/extension/~/phone-number', {'perPage': 'max'})
        .then(function(res) {
            var phoneNumbers = res.json().records;
            for (var i = 0; i < phoneNumbers.length; i++ ) {
                if (phoneNumbers[i].features.indexOf("MmsSender") != -1 ) {
                    mmsEnabledNumbers.push(phoneNumbers[i].phoneNumber);
                }
            }
        })
        .catch(function(e) {
            alert('MMS Enabled Phone Number Population Error:\n\n' + e.message);
        });
```


Further reading:

- [FormData](https://developer.mozilla.org/en-US/docs/Web/API/FormData)
- [File](https://developer.mozilla.org/en-US/docs/Web/API/File)

## NodeJS

SDK is capable of sending `FormData` objects created by [form-data](https://github.com/form-data/form-data) module.

First, you will need to install it:

```sh
npm install form-data
```

Then you can build your fax, but keep in mind that FormData API in NodeJS is slightly different from the browser:

```js
var FormData = require('form-data'),
    body = {
        to: [{phoneNumber: '123'}], // see all available options on Developer Portal
        faxResolution: 'High'
    },
    formData = new FormData();

// This is the mandatory part, the name and type should always be as follows
formData.append('json', new Buffer(JSON.stringify(body)), {filename: 'request.json', contentType: 'application/json'});

// To send a plain text
formData.append('attachment', new Buffer('some plain text'), {filename: 'text.txt', contentType: 'text/plain'});

// To send a file from file system
formData.append('attachment', require('fs').createReadStream('/foo/bar.jpg'));

// Send the fax
rcsdk.platform().post('/account/~/extension/~/fax', formData);
```

Further reading:

- [form-data](https://github.com/form-data/form-data#usage)

***

# Page visibility

You can use any of the libraries that work with the [Page Visibility API](http://www.w3.org/TR/page-visibility/),
such as [visibility.js](https://github.com/ai/visibilityjs).

This allows tracking the visibility of the page/tab/window/frame so that the application can react accordingly.
Following are some actions that the application may wish to take whenever it becomes visible:

- Check authentication
- Reload/resync time-sensitive information from the server
- Send heartbeats to the server

Another usage is to reduce the number of Call Log or Messages reloads when the application is not visible. The SDK does
not require that any such optimizations be implemented in the application, but it is considered good practice.

***

# Tracking network Requests And Responses

You can set up tracking for all network requests (for instance, to log them somewhere) by obtaining a `Client` object
and registering observers on its various events:

```js
var client = rcsdk.platform().client();
client.on(client.events.beforeRequest, function(apiResponse) {}); // apiResponse does not have response at this point
client.on(client.events.requestSuccess, function(apiResponse) {});
client.on(client.events.requestError, function(apiError) {});
```

***

# Migration from previous releases

**!!! Attention !!!**

**In SDK version 2.0 Helpers were moved to separate repository: [ringcentral-js-helpers](https://github.com/ringcentral/ringcentral-js-helpers).**

A lot of code improvements were implemented in order to make SDK compatible with WhatWG Fetch, DOM Requests &
DOM Responses: see [full list of migration instructions](CHANGELOG.md).
