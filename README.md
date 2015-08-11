# Table of contents

1. [Key Benefits](#key-benefits)
2. [Installation](#installation)
3. [Migration from previous releases](#migration-from-previous-releases)
4. [Core Module](#core-module)
5. [Performing a RingOut](#performing-a-ringout)
6. [Call Management Using JavaScript](#call-management-using-javascript)
7. [SMS](#sms)
8. [Fax](#fax)
9. [Page Visibility](#page-visibility)
10. [Tracking Ajax Requests](#tracking-ajax-requests)

***

# Key Benefits

- Automatically handles token lifecycle procedures in multi-tab environment
- Re-issues non-authorized requests
- Decrypts PUBNUB notification messages
- Parses multipart API responses
- Creates Request bodies for FaxOut
- Compatible with latest WhatWG `fetch()` spec (DOM Requests & DOM Responses)

***

# Installation

SDK can be used in 3 environments:

1. [Browser](#1-set-things-up-in-browser)
2. [NodeJS](#1-set-things-up-in-nodejs)
3. [Browserify or Webpack](#3-set-things-up-for-browserify-or-webpack)

## 1. Set things up in Browser

### 1.1. Get the code

Pick the option that works best for you:

- **Preferred way to install SDK is to use Bower**, all dependencies will be downloaded to `bower_components` directory:

    ```sh
    bower install ringcentral --save
    ```Bower
    
- Donwload everything manually *(not recommended)*:
    - [ZIP file with source code](https://github.com/ringcentral/ringcentral-js/archive/master.zip)
    - [Fetch](https://github.com/github/fetch), direct download: [fetch.js](https://raw.githubusercontent.com/github/fetch/master/fetch.js)
    - [ES6 Promise](https://github.com/jakearchibald/es6-promise), direct download: [es6-promise.js](https://raw.githubusercontent.com/jakearchibald/es6-promise/master/dist/es6-promise.js)
    - [PUBNUB](https://github.com/pubnub/javascript), direct download: [pubnub.js](https://raw.githubusercontent.com/pubnub/javascript/master/web/pubnub.js)

## 1.2.a. Add scripts to HTML page

Add the following to your HTML:

```html
<script type="text/javascript" src="path-to-scripts/es6-promise/promise.js"></script>
<script type="text/javascript" src="path-to-scripts/fetch/fetch.js"></script>
<script type="text/javascript" src="path-to-scripts/pubnub/web/pubnub.js"></script>
<script type="text/javascript" src="path-to-scripts/ringcentral/build/ringcentral.js"></script><!-- or ringcentral.min.js -->
<script type="text/javascript">

    var sdk = new RingCentral.sdk.SDK(...);

</script>
```

**Not recommended!** If you are in a hurry, you can use bundled version with all dependencies:

```html
<script type="text/javascript" src="path-to-scripts/ringcentral/build/ringcentral-bundle.js"></script><!-- or ringcentral-bundle.min.js -->
<script type="text/javascript">

    var sdk = new RingCentral.sdk.SDK(...);

</script>
```

Keep in mind that this is for quick start only and for production you should add each dependency separately to have
full control over the process.

## 1.2.b. Set things up in Browser (if you use RequireJS in your project)

```js
// Add this to your RequireJS configuration file
require.config({
    paths: {
        'es6-promise': 'path-to-scripts/es6-promise-polyfill/promise',
        'fetch': 'path-to-scripts/fetch/fetch',
        'pubnub': 'path-to-scripts/pubnub/web/pubnub'
        'ringcentral': 'path-to-scripts/ringcentral/build/ringcentral', // or ringcentral.min
    }
});

// Then you can use the SDK like any other AMD component
require(['ringcentral', 'es6-promise', 'fetch'], function(SDK, Promise) {
    
    Promise.polyfill();
    // or
    SDK.externals._Promise = Promise;
    
    var sdk = new SDK(...);
    
});
```

Make sure that polyfills are loaded before or together with SDK.

## 2. Set things up in NodeJS

1. Install the NPM package:

    ```sh
    npm install ringcentral --save
    ```

2. Require the SDK:

    ```js
    var RingCentral = require('ringcentral');
    ```

## 3. Set things up for Browserify or Webpack (experimental)

**!!! This is experimental !!!**

1. Install the NPM package:

    ```sh
    npm install ringcentral --save
    ```

2. Require the SDK:

    ```js
    var RingCentral = require('ringcentral');
    ```

3. Add the following to your `webpack.config.js`, path should be relative to Webpack configuration file:
    
    ```json
    {
        resolve: {
            alias: {
                'node-fetch': path.resolve('./bower_components/fetch/fetch.js'),
                'es6-promise': path.resolve('./bower_components/es6-promise/promise.js'),
                'pubnub': path.resolve('./bower_components/pubnub/web/pubnub.js')
            }
        }
    }
    ```

To reduce the size of your Webpack bundle it's better to use browser version of dependencies (instead of the ones that
are installed via NPM along with the SDK). You can get them via Bower or directly download the the source.
More information can be found in [installation for browser](#1-set-things-up-in-browser).

## 4. Polyfills for old browsers

You can use any of your favourite `fetch()` and `Promise` polyfills. SDK tries to get them from global scope every
time new instance is created.

In case SDK will not detect globals automatically you can set them as follows:

```js
window.Promise = {Promise: $q.Promise, resolve: q.resolve, reject: q.reject, all: q.all};
window.fetch = whatever;
window.Headers = whatever;
window.Request = whatever;
window.Response = whatever;
```

Also you can manually define SDK internal variables:

```js
RingCentral.sdk.externals._Promise = {Promise: $q.Promise, resolve: q.resolve, reject: q.reject, all: q.all};
RingCentral.sdk.externals._fetch = whatever;
RingCentral.sdk.externals._Headers = whatever;
RingCentral.sdk.externals._Request = whatever;
RingCentral.sdk.externals._Response = whatever;
```

But taking into account the nature of polyfills, it's better to keep them global as described before.

***

# Migration from previous releases

**!!! Attention !!!**

**In SDK version 2.0 Helpers were moved to separate repository: [ringcentral-js-helpers](https://github.com/ringcentral/ringcentral-js-helpers).**

A lot of code improvements were implemented in order to make SDK compatible with WhatWG Fetch, DOM Requests & DOM Responses.

Full list of migration instructions:

- [0.13 to 0.14](docs/migration-0.13-0.14.md)
- [1.1 to 1.2](docs/migration-1.1-1.2.md)
- [1.x to 2.0](docs/migration-1.x-2.0.md)

***

# Core Module

## Instantiate the RingCentral object

The SDK is represented by the global RingCentral constructor. Your application must create an instance of this object:

In order to bootstrap the RingCentral JavaScript SDK, you have to first get a reference to the Platform singleton and
then configure it. Before you can do anything using the Platform singleton, you need to configure it with the server URL 
(this tells the SDK which server to connect to) and your unique API key (this is provided by RingCentral's developer 
relations team).

```js
var rcsdk = new RingCentral.sdk.SDK({
    server: 'https://platform.devtest.ringcentral.com', // SANDBOX
    //server: 'https://platform.ringcentral.com', // PRODUCTION
    appKey: 'yourAppKey',
    appSecret: 'yourAppSecret'
});
```

This instance will be used later on to perform calls to API.

## Get the Platform Singleton

```js
var platform = rcsdk.getPlatform();
```

Now that you have your platform singleton and SDK has been configured with the correct server URL and API key, your
application can log in so that it can access the features of the API.

## Login

Login is accomplished by calling the `platform.authorize()` method of the Platform singleton with username, extension
(optional), and password as parameters. A `Promise` instance is returned, resolved with an AJAX `Response` object.

```js
rcsdk.getPlatform()
    .authorize({
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

### Handling Login Success

Because the login process is asynchronous, you need to call the promise's `then` method and pass your success handler as
the continuation function.

This function will be called once login has succeeded, which allows the application to then perform updates to
the user interface, and then perform the next actions using the API to load account details for the user's account
and such.

### Handling Login Failure

Login can, of course, fail - a user can enter the incorrect password or mistype their user name.

To handle cases where login fails, you can provide an error handler function in a call to the promise's `catch` method.
To keep this example simple, a simple JavaScript alert is being used. In a real application, you will want to provide
a good UX in your login form UI.

### Checking Authentication State

To check in your Application if the user is authenticated, you can call the `isAuthorized` method of the platform
singleton:

```js
rcsdk.getPlatform().isAuthorized().then(function(){ ... }).catch(function(e){ ... });
```

The SDK takes care of the token lifecycle. It will refresh tokens for you automatically. It will also automatically
pause and queue all new API requests while the token is being refreshed in order to prevent data loss or inconsistency
between SDK instances in different tabs. Paused / queued API requests will then be automatically processed once the
token has been refreshed. All apropriate events will be emitted during this process.

If you just need to check whether the user has a valid token, you can call the `isTokenValid` method:

```js
rcsdk.getPlatform().isTokenValid(); // returns boolean
```

## Performing API calls

To perform an authenticated API call, you should use the `apiCall` method of the platform singleton:

```js
rcsdk.getPlatform()
    .apiCall('/account/~/extension/~', {
        method: 'GET', // GET | POST | PUT | DELETE
        headers: {},
        query: {},
        body: 'POSTDATA',
    })
    .then(function(response){
    
        alert(response.getJson().name);
        
    })
    .catch(function(e){
    
        alert(e.message);
        
        // please note that ajax property may not be accessible if error occurred before AJAX send
        if ('response' in e && 'request' in e) {
        
            var response = e.response, // or e.ajax for backward compatibility
                request = e.request;
            
            alert('Ajax error ' + e.message + ' for URL' + request.url + ' ' + response.getError());
            
        }
        
    });
```

You can also use short-hand methods:

```js
rcsdk.getPlatform().get('/account/~/extension/~', {...options...}).then(function(response){ ... });
rcsdk.getPlatform().post('/account/~/extension/~', {...options...}).then(function(response){ ... });
rcsdk.getPlatform().put('/account/~/extension/~', {...options...}).then(function(response){ ... });
rcsdk.getPlatform().delete('/account/~/extension/~', {...options...}).then(function(response){ ... });
```

Take a look on [sms example](#sms) to see how POST request can be sent.

### Important note for users of versions prior to **1.2.0**:

AjaxOptions now has `body` and `query` properties instead of `post` and `get` respectively. You can continue to use old
`post` and `get` properties, backwards compatibility is maintained, but they both were deprecated since **1.2.0**.

If application send both `body` and `post` or `query` and `get` at the same time then `post` and `get` will be ignored.

### Sending things other than JSON

You can set `headers['Content-Type']` property of AJAX options to `false` in order to let XHR library to figure out
appropriate `Content-Type` header automatically.

Important notes:

- Automatic guessing of `Content-Type` is unreliable, if you know `Content-Type` then set it explicitly
- NodeJS cannot set `multipart/mixed` header with appropriate boundary automatically when sending `Buffer` object
    so your application must take care of that

## Logout

Logging the user out is trivial - just call the `logout` method on the platform singleton:

```js
platform.logout().then(...).catch(...);
```

## Events

The platform provides the following events:

- `accessViolation` - emitted when the application attempts to make an API call when there is no valid access token or
the refresh process has failed, which may occur when the user switches tabs in the browser.
- `logoutSuccess`
- `logoutError`
- `authorizeSuccess`
- `authorizeError`
- `refreshSuccess`
- `refreshError`

To listen on platform events, you should call the `on` method of the platform singleton:

```js
var platform = rcsdk.getPlatform();

platform.on(platform.events.accessViolation, function(e){
    // do something
});
```

The `on` method accepts an event type as its first argument and a handler function as its second argument.

## Subscriptions

Subscriptions are a convenient way to receive updates on server-side events, such as new messages or presence changes.

Subscriptions are created by calling the `getSubscription` method of the RingCentral instance created earlier on.

```js
var subscription = rcsdk.getSubscription();

subscription.on(subscription.events.notification, function(msg) {
    console.log(msg, msg.body);
});

subscription.register({
    events: ['/account/~/extension/~/presence'], // a list of server-side events
}).then(...);
```

Once a subscription has been created, the SDK takes care of renewing it automatically. To cancel a subscription, you can
call the subscription instance's `destroy` method:

```js
subscription.destroy();
```

You can add more events to the same subscription at any time, by calling the subscription's `addEvents` method:

```js
subscription.addEvents(['/account/~/extension/222/presence']).register();
subscription.setEvents(['/account/~/extension/222/presence']).register();
```

## Subscriptions Lifecycle

The number of active subscriptions is limited per account (about 20). This means that the application should dispose of
unused subscriptions in the following situations:

- the user navigates away from the page or particular view
- the `Platform` instance emits `logoutSuccess` or `accessViolation` events
- a subscription becomes unused by the application, based upon the application's business logic

**Keep track of the amount of used subscriptions. It might be a good idea to have a central storage for them.**

Following is an Angular-specific example, showing controller code that listens to subscriptions:

```js
var platform = rcsdk.getPlatform();

function destroy() {

    // In order to release a subscription, you need to remove it at the server
    // A simple token check will not lead to a refresh process, as opposed to platform.isAuthorized()
    if (platform.isTokenValid()) subscription.remove();

    // Detach event listeners
    subscription.destroy();

}

// listener has to be SYNCHRONOUS for that, manually send a synchronous request if you need this
window.addEventListener('beforeunload', destroy);

platform.on([platform.events.accessViolation], destroy);

// This occurs when user navigates away from the controller
$scope.$on('$destroy', function() {

    window.removeEventListener('beforeunload', destroy);
    platform.off([platform.events.accessViolation, platform.events.beforeLogout], destroy);
    
    destroy();
    
});
```

***

# Performing a RingOut

This example demonstrates a way to create a flexible RingOut tracking procedure. This is the most complex example with
maximum fine-tuning - it could be simplified to suit the business requirements.

The sequence of RingOut is as follows:

1. Perform a POST with the RingOut data
2. Poll the RingOut status (GET requests) every second or so

Please refer to the following example:

```js
var platform = rcsdk.getPlatform(),
    Utils = rcsdk.getUtils(),
    Log = rcsdk.getLog(),
    timeout = null, // reference to timeout object
    ringout = {}; // this is the status object (lowercase)

/**
 * @param {Error} e
 */
function handleError(e) {

    Log.error(e);
    alert(e.message);

}

function create(unsavedRingout) {

    platform
        .post('/account/~/extension/~/ringout', {body: unsavedRingout})
        .then(function(response) {
    
            Utils.extend(ringout, response.getJson());
            Log.info('First status:', ringout.status.callStatus);
            timeout = Utils.poll(update, 500, timeout);
    
        })
        .catch(handleError);

}

/**
 * @param {function(number?)} next - callback that will be used to continue polling
 * @param {number} delay - last used delay
 */
function update(next, delay) {

    if (ringout.status && ringout.status.callStatus !== 'InProgress') return;

    platform
        .get(ringout.uri)
        .then(function(response) {
    
            Utils.extend(ringout, response.getJson());
            Log.info('Current status:', ringout.status.callStatus);
            timeout = next(delay);
    
        })
        .catch(handleError);

}

/**
 * To stop polling, call this at any time
 */
function hangUp() {

    Utils.stopPolling(timeout);

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

## A deeper look at the `Utils.poll()` and `Utils.stopPolling()` methods

```js
// first, define polling function:
function pollFn(next, delay) {
    if (condition) next(); // uses previous delay, condition can be anything required to keep polling
    // or next(100); -- simply sets a new delay
    // or next(delay * 2); -- this will make delay bigger after every cycle
    // if next() is not called, then next cycle will not happen
}

// then start polling
// pollFn -- (required) is function that will be called to track status
// 500 -- (optional) is a number of milliseconds is to delay the next poll
// previousTimeout -- (optional) can be supplied to automatically cancel any previous timeouts
// newTimeout will be returned
var newTimeout = Utils.poll(pollFn, 500, previousTimeout);

// call this at any time to stop polling
Utils.stopPolling(newTimeout);
```

***

# Call Management Using JavaScript

If you are integrating with a CRM or ERP system, use of the JavaScript SDK is highly recommended. Following is an
example of a call management integration that includes monitoring of incoming calls and performing of RingOuts. 

A call management integration usually consists of the following tasks:

1. Track the telephony status
2. View the list of active calls
3. View the recent calls

## Track the telephony status

First, you need to load the initial Presence status:

```js
var accountPresence = {};

rcsdk.getPlatform()
    .get('/account/~/extension/~/presence?detailedTelephonyState=true').then(function(response) {
        rcsdk.getUtils().extend(accountPresence, response.getJson());
    })
    .catch(function(e) {
        alert('Load Presence Error: ' + e.message);
    });
```

In the meantime, you can also set up Subscriptions:

```js
var subscription = rcsdk.getSubscription().addEvents(['/account/~/extension/~/presence?detailedTelephonyState=true']);

subscription.on(subscription.events.notification, function(msg) {
    rcsdk.getUtils().extend(accountPresence, msg);
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
rcsdk.getPlatform()
    .get('/account/~/extension/~/active-calls', {query: {page: 1, perPage: 10}})
    .then(function(response) {
        activeCalls = response.getJson().records;
    })
    .catch(function(e) {
        alert('Active Calls Error: ' + e.message);
    });
```

## View the list of recent calls

```js
rcsdk.getPlatform()
    .get('/account/~/extension/~/call-log', {query: {page: 1, perPage: 10}})
    .then(function(response) {
        calls = response.getJson().records;
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
rcsdk.getPlatform()
    .post('/account/~/extension/~/sms', {
        body: {
            from: {phoneNumber:'+12223334444'}, // Your sms-enabled phone number
            to: [
                {phoneNumber:'+15556667777'} // Second party's phone number
            ],
            text: 'Message content'
        }
    })
    .then(function(response) {
        alert('Success: ' + response.getJson().id);
    })
    .catch(function(e) {
        alert('Error: ' + e.message);
    });
```

# SMS

In order to send a Fax using the API, simply make a POST request to `/account/~/extension/~/fax`. SDK provides a
convenience functionality to simplify the building of FaxOut requests. Due to difference in available technologies
between Browser and NodeJS your code should be aware of that. 

```js
var request = rcsdk.getMultipartRequest();

request
    .setBody({
        to: [{phoneNumber: '12223334455'}],
        faxResolution": 'Low'
    });

// Browser

request
    .addAttachment(document.querySelector('#file-upload'))
    .addAttachment({contentType: 'text/plain', content: 'Hello, World'})
    .addAttachment({contentType: 'text/plain', content: 'Hello, World', fileName: 'foo.txt'});

// NodeJS

request
    .addAttachment({
        contentType: 'application/octet-stream', 
        content: fs.readFileSync('path-to-file').toString('base64'), 
        fileName: 'foo.txt'
    })
    .addAttachment({contentType: 'text/plain', content: 'Hello, World'})
    .addAttachment({contentType: 'text/plain', content: new Buffer('whatever')})
    .addAttachment({contentType: 'text/plain', content: 'Hello, World', fileName: 'foo.txt'});

// Cross-environment

rcsdk.getPlatform()
    .post('/account/~/extension/~/fax', request.getOptions())
    .then(function(ajax) {
        alert('Success!');
    })
    .catch(function(e) {
        alert('Error: ' + e.message);
    });
```

Optional configuration parameters for attachments `contentType` and `fileName` may be omitted. Defaults are `text/plain`
and `file.txt` respectively.

***

# Fax

Fax endpoint understands `multipart/form-data` requests. First part must always be JSON-encoded information about the
fax. Other parts should have `filename` defined in order to be correctly presented in Service Web.

## Browser

Modern browsers have `FormData` class which could be used for sending faxes.

```js
var body = {to: {phoneNumber: '123'}, faxResolution: 'High'}; // see all available options on Developer Portal

var formData = new FormData();

// This is the mandatory part, the name and type should always be as follows
formData.append('json', new File([JSON.stringify(body)]), 'request.json', {type: 'application/json'});

// Find the input[type=file] field on the page
var fileField = document.getElementById('input-type-file-field');

// Iterate through all currently selected files
for (var i = 0, file; file = fileField.files[i]; ++i) {
    formData.append('attachment', file); // you can also use file.name instead of 'attachment'
}

// To send a plain text
formData.append('attachment', new File(['some plain text']), 'text.txt', {type: 'application/octet-stream'});

// Send the fax
rcsdk.getPlatform().post('/account/~/extension/~/fax', {body: formData});
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
var body = {to: {phoneNumber: '123'}, faxResolution: 'High'}; // see all available options on Developer Portal

var FormData = require('form-data');

var formData = new FormData();

// This is the mandatory part, the name and type should always be as follows
formData.append('json', new Buffer(JSON.stringify(body)), {filename: 'request.json', contentType: 'application/json'});


// To send a plain text
formData.append('attachment', new Buffer('some plain text'), 'text.txt', {type: 'application/octet-stream'});

// To send a file from file system
formData.append('attachment', require('fs').createReadStream('/foo/bar.jpg'));

// Send the fax
rcsdk.getPlatform().post('/account/~/extension/~/fax', {body: formData});
```

Further reading:

- [form-data](https://github.com/form-data/form-data#usage)

***

# Page Visibility

This class is a wrapper for the [Page Visibility API](http://www.w3.org/TR/page-visibility/), which hides vendor
prefixes and provides a short and simple way to observe visibility changes.
 
This allows tracking the visibility of the page/tab/window/frame so that the application can react accordingly.
Following are some actions that the application may wish to take whenever it becomes visible:
    
- Check authentication
- Reload/resync time-sensitinve information from the server
- Send heartbeats to the server

Another usage is to reduce the number of Call Log or Messages reloads when the application is not visible. The SDK does
not require that any such optimizations be implemented in the application, but it is considered good practice.

Using the page visibility wrapper is very straightforward - just register an observer function for the
`visibility.events.change` event:

```js
var visibility = rcsdk.getPageVisibility();

visibility.on(visibility.events.change, function (visible) {
    if (visible) ...
});
```

See also [Core Module: Checking Authentication State](#checking-authentication-state).

## Alternatives

You can use any of the libraties that work with the [Page Visibility API](http://www.w3.org/TR/page-visibility/),
such as [visibility.js](https://github.com/ai/visibilityjs).

***

# Tracking Ajax Requests

You can set up tracking for all Ajax requests (for instance, to log them somewhere) by obtaining an Ajax observer object
and registering observers on its various events:

```js
var client = rcsdk.getClient();
client.on(observer.events.beforeRequest, function(ajax) {});
client.on(observer.events.requestSuccess, function(ajax) {});
client.on(observer.events.requestError, function(e) {});
```

Observer functions are passed a reference of the `Ajax` for which the event has occurred. Every `Ajax` object offers a
number of accessor methods and properties:

- `getRequest()` &mdash; request that was given to transport *(if any)*
    - `url`
    - `headers`
- `getResponse()` &mdash; raw text response from server *(if any)*
    - `status`
    - `statusText`
    - `headers`
- `getJson()` &mdash; JSON-parsed response
- `getText()` &mdash; Textual representation of response
- `getResponses()` &mdash; An array of underlying `Ajax` objects for `Content-Type: multipart/mixed` responses
- `getResponsesAjax()` &mdash; An array of underlying parsed JSONs of `Ajax` objects for `Content-Type: multipart/mixed` responses
