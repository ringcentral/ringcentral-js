# Table of contents

1. [Key Benefits](#key-benefits)
2. [Installation](#installation)
3. [Core Module](#core-module)
4. [Helpers](#helpers)
5. [Performing a RingOut](#performing-a-ringout)
6. [Call Management Using JavaScript](#call-management-using-javascript)
7. [SMS](#sms)
8. [Page Visibility](#page-visibility)
9. [Tracking Ajax Requests](#tracking-ajax-requests)
10. [Model Relations](#model-relations)

***

# Key Benefits

- Automatically handles token lifecycle procedures in multi-tab environment
- Re-issues non-authorized requests
- Decrypts PUBNUB notification messages
- Parses multipart API responses
- Provides a broad variety of helper functions to work with API requests and responses

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
    bower install rcsdk --save
    ```
    
- Download the bundle version, which includes PUBNUB and ES6 Promise (choose which works best for you):
    - [ZIP file with source code](https://github.com/ringcentral/js-sdk/archive/master.zip) or
    - [Non-minified version](https://raw.githubusercontent.com/ringcentral/js-sdk/master/build/rc-sdk-bundle.js) or
    - [Minified version](https://raw.githubusercontent.com/ringcentral/js-sdk/master/build/rc-sdk-bundle.js)
    
- Donwload everything manually *(not recommended)*:
    - [ZIP file with source code](https://github.com/ringcentral/js-sdk/archive/master.zip)
    - [ES6 Promise](https://github.com/jakearchibald/es6-promise)
    - [PUBNUB](https://github.com/pubnub/javascript)

## 1.2.a. Add scripts to HTML page

You can use bundle version (with PUBNUB and ES6 Promise included in main file).

Add this to your HTML:

```html
<script type="text/javascript" src="path-to-scripts/rcsdk/build/rc-sdk-bundle.js"></script>
```

Another option is to add dependencies and SDK separately.

Add this to your HTML (order should be preserved):

```html
<script type="text/javascript" src="path-to-scripts/es6-promise-polyfill/promise.js"></script>
<script type="text/javascript" src="path-to-scripts/pubnub/web/pubnub.js"></script>
<script type="text/javascript" src="path-to-scripts/rcsdk/build/rc-sdk.js"></script><!-- or rc-sdk.min.js -->
```

Preferred way is to use RequireJS or bundle version of SDK.

## 1.2.b. Set things up in Browser (if you use RequireJS in your project)

```js
// Add this to your RequireJS configuration file
require.config({
    paths: {
        'rcsdk': 'path-to-scripts/rcsdk/build/rc-sdk', // or rc-sdk.min
        'es6-promise': 'path-to-scripts/es6-promise-polyfill/promise',
        'pubnub': 'path-to-scripts/pubnub/web/pubnub'
    },
    shim: {
        'pubnub': {
            exports: 'PUBNUB'
        }
    }
});

// Then you can use the SDK like any other AMD component
require(['rcsdk'], function(RCSDK) {
    // your code here
});
```

## 2. Set things up in NodeJS

1. Install the NPM package:

    ```sh
    npm install rcsdk --save
    ```

2. Require the SDK:

    ```js
    var RCSDK = require('rcsdk');
    ```

## 3. Set things up for Browserify or Webpack (experimental)

***This is an experimental support, things may change in 1.3.0***

1. Install the NPM package:

    ```sh
    npm install rcsdk --save
    ```

2. Require the SDK:

    ```js
    var RCSDK = require('rcsdk');
    ```

3. Add the following to your `webpack.config.js`, path should be relative to Webpack configuration file:
    
    ```js
    {
        externals: {
            'xhr2': 'XMLHttpRequest',
            'dom-storage': 'localStorage'
        },
        resolve: {
            alias: {
                'pubnub': path.resolve('./bower_components/pubnub/web/pubnub.js')
            }
        }
    }
    ```

To reduce the size of your Webpack bundle it's better to use browser version of PUBNUB (instead of the one that is
installed via NPM along with the SDK). You can get PUBNUB via Bower or directly download the the source.
More information can be found in [installation for browser](#1-set-things-up-in-browser). Also it's not needed to use
NPM's `xhr2` and `dom-storage` packages since both objects  exist in browser by default, so they can be externalized.

***

# Core Module

## Instantiate the RCSDK object

The SDK is represented by the global RCSDK constructor. Your application must create an instance of this object:

In order to bootstrap the RingCentral JavaScript SDK, you have to first get a reference to the Platform singleton and
then configure it. Before you can do anything using the Platform singleton, you need to configure it with the server URL 
(this tells the SDK which server to connect to) and your unique API key (this is provided by RingCentral's developer 
relations team).

```js
var rcsdk = new RCSDK({
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
platform.authorize({
    username: '18001234567', // phone number in full format
    extension: '', // leave blank if direct number is used
    password: 'yourpassword'
}).then(function(response) {
      // your code here
}).catch(function(e) {
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
platform.isAuthorized().then(function(){ ... }).catch(function(e){ ... });
```

The SDK takes care of the token lifecycle. It will refresh tokens for you automatically. It will also automatically
pause and queue all new API requests while the token is being refreshed in order to prevent data loss or inconsistency
between SDK instances in different tabs. Paused / queued API requests will then be automatically processed once the
token has been refreshed. All apropriate events will be emitted during this process.

If you just need to check whether the user has a valid token, you can call the `isTokenValid` method:

```js
platform.isTokenValid(); // returns boolean
```

## Performing API calls

To perform an authenticated API call, you should use the `apiCall` method of the platform singleton:

```js
platform.apiCall({
    url: '/account/~/extension/~',
    async: true,
    method: 'GET', // GET | POST | PUT | DELETE
    headers: {},
    query: {},
    body: 'POSTDATA',
}).then(function(response){

    alert(response.data.name);
    
}).catch(function(e){

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
platform.get('/account/~/extension/~', {...options...}).then(function(response){ ... });
platform.post('/account/~/extension/~', {...options...}).then(function(response){ ... });
platform.put('/account/~/extension/~', {...options...}).then(function(response){ ... });
platform.delete('/account/~/extension/~', {...options...}).then(function(response){ ... });
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
platform.on(platform.events.accessViolation, function(e){
    // do something
});
```

The `on` method accepts an event type as its first argument and a handler function as its second argument.

## Subscriptions

Subscriptions are a convenient way to receive updates on server-side events, such as new messages or presence changes.

Subscriptions are created by calling the `getSubscription` method of the RCSDK instance created earlier on.

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

It is recommended to use appropriate Helpers.

## Subscriptions Lifecycle

The number of active subscriptions is limited per account (about 20). This means that the application should dispose of
unused subscriptions in the following situations:

- the user navigates away from the page or particular view
- the `Platform` instance emits `logoutSuccess` or `accessViolation` events
- a subscription becomes unused by the application, based upon the application's business logic

Following is an Angular-specific example, showing controller code that listens to subscriptions:

```js
var platform = rcsdk.getPlatform();

function destroy() {

    // In order to release a subscription, you need to remove it at the server
    // A simple token check will not result in a refresh process, as opposed to platform.isAuthorized()
    if (platform.isTokenValid()) subscription.remove({async: false});

    // Detach event listeners
    subscription.destroy();

}

window.addEventListener('beforeunload', destroy); // listener has to be SYNCHRONOUS

platform.on([platform.events.accessViolation], destroy);

// This occurs when user navigates away from the controller
$scope.$on('$destroy', function() {

    window.removeEventListener('beforeunload', destroy);
    platform.off([platform.events.accessViolation, platform.events.beforeLogout], destroy);
    
    destroy();
    
});
```

***

# Helpers

## Abstract

The SDK provides a variety of different helpers to make it easier to alter, save, load, and delete data objects and
otherwise interact with the features of the API. Helpers are plain JavaScript objects that contain functions and useful
properties (e.g. constants).

## Basic Functionality

All helpers are extensions to the base `Helper` object and have all of its functions, plus some overrides and extra
functionality. See the documentation for each particular helper for information on available options and methods.

Following is a deeper look at the `CallHelper` object.

### Create a URL

```js
rcsdk.getCallHelper().createUrl(options, id);
```

Creates a URL that can be provided to the `Platform#apiCall()` method. Creation algorithm is based on options:

* `{personal: true}` - Call log of the currently logged in extension
* `{extensionId: '12345'}` - Call log of extension with the id `12345` (the logged in user must have admin permissions)

Following are some example calls, along with the URLs that they would return:

```js
rcsdk.getCallHelper().createUrl(); // '/account/~/extension/~/call-log'
rcsdk.getCallHelper().createUrl({personal: true}); // '/account/~/extension/~/call-log'
rcsdk.getCallHelper().createUrl({extensionId: '12345'}); // '/account/~/extension/12345/call-log'
rcsdk.getCallHelper().createUrl({extensionId: '12345'}, '67890'); // '/account/~/extension/12345/call-log/67890'
```

### Check if an object exists on the server

```js
rcsdk.getCallHelper().isNew(object);
```

If the object exists on the server, then the `isNew` method will return false. The object is considered not new if it
has both ID and URI properties - this usually means that the object was returned from the server.

```js
rcsdk.getCallHelper().isNew({}); // false
rcsdk.getCallHelper().isNew({id: '67890'}); // false
rcsdk.getCallHelper().isNew({uri: '/account/~/extension/12345/call-log/67890'}); // false
rcsdk.getCallHelper().isNew({id: '67890', uri: '/account/~/extension/12345/call-log/67890'}); // true
```

### Filter an array of objects

```js
rcsdk.getCallHelper().filter(options);
```

`CallHelper#filter(options)` returns a preconfigured function that can be used for the `fn` argument when calling the
`filter` method (`Array.prototype.filter(fn)`) on an array of calls. The behavior of the filter may vary depending on
the `options` argument.

```js
// calls in an array of Call Log calls
var callsFilteredByDirection = calls.filter(Call.filter({direction: 'Inbound'}));
var callsFilteredByType = calls.filter(Call.filter({type: 'Voice'}));
```

### Sort an array of objects

```js
rcsdk.getCallHelper().comparator(options);
```

`CallHelper#comparator(options)` returns a preconfigured function that can be used for the `fn` argument when calling
the `sort` method (`Array.prototype.sort(fn)`) on an array of calls. The behavior of the filter may vary depending on
the `options` argument. By default, values are extracted simply as `item[options.sortBy]` as strings and sorted as
strings. Custom `options.extractFn` and `options.compareFn` functions may be specified.

```js
// calls in an array of Call Log calls
var callsSortedByStartTime = calls.sort(Call.comparator({sortBy: 'startTime'})); // or any other property
var callsSortedByDuration = calls.sort(Call.comparator({
    compareFn: rcsdk.getList().numberComparator // compare as numbers
})); // or any other property

// filter and sort can be combined
var inboundCallsSortedByStartTime = calls
    .filter(Call.filter({direction: 'Inbound'}))
    .sort(Call.comparator({sortBy: 'startTime'}));
```

### Special methods - Get pre-configured Subscription objects for endpoints

These methods will provide `Subscription` objects with pre-bound events.

```js
var subscription = rcsdk.getPresenceHelper().getSubscription({detailed: true}, '~');
```

```js
var subscription = rcsdk.getMessageHelper().getSubscription();
```

Once you have a `Subscription` object, all you need to do next is register it by calling its `register` method:

```js
subscription.register();
```

### Special methods - Convert ActiveCalls array of Presence into regular Calls

Assume that `presence` is an object returned by one of Presence endpoints.

```js
var calls = rcsdk.getCallHelper().parsePresenceCalls(presence.activeCalls);
```

### Full Example

For this example, AngularJS will be used.

```js
var platform = rcsdk.getPlatform(),
    Call = rcsdk.getCallHelper();

$scope.calls = [];
$scope.nextPageExists = true;
$scope.queryParams = {page: 1, perPage: 'max'}; // page and perPage may be set from template

$scope.requestNextPage = function() { // can be called from template to request next page
    $scope.queryParams.page++;
    loadCalls();
};

function loadCalls() {

    platform.apiCall(Call.loadRequest(null, {
        query: $scope.queryParams,
    })).then(function(response) {

        $scope.calls = response.data.records
            .filter(Call.filter({direction: 'Inbound'}))
            .sort(Call.comparator({sortBy: 'startTime'}));

        $scope.nextPageExists = Call.nextPageExists(response.data); // feed raw data from server to helper function

    }).catch(function(e) {
        alert('Error', e.message);
    });

}

loadCalls();
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
    Ringout = rcsdk.getRingoutHelper(), // this is the helper
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
        .apiCall(Ringout.saveRequest(unsavedRingout))
        .then(function(response) {
    
            Utils.extend(ringout, response.data);
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

    if (!Ringout.isInProgress(ringout)) return;

    platform
        .apiCall(Ringout.loadRequest(ringout))
        .then(function(response) {
    
            Utils.extend(ringout, response.data);
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

    if (Ringout.isInProgress(ringout)) {

        platform
            .apiCall(Ringout.deleteRequest(ringout))
            .catch(handleError);

    }
    
    // Clean
    Ringout.resetAsNew(ringout);

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
var platform = rcsdk.getPlatform(),
    Presence = rcsdk.getPresenceHelper(),
    accountPresence = {};

platform.apiCall(Presence.loadRequest()).then(function(response) {
    rcsdk.getUtils().extend(accountPresence, response.data);
}).catch(function(e) {
    alert('Load Presence Error: ' + e.message);
    });
```

In the meantime, you can also set up Subscriptions:

```js
var subscription = Presence.getSubscription();

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
var activeCalls = [],
    Call = rcsdk.getCallHelper();

// This call may be repeated when needed, for example as a response to incoming Subscription
platform.apiCall(Call.loadRequest(null, {
    url: Call.createUrl({active: true}),
    query: { // this can be omitted
        page: 1,
        perPage: 10
    }
})).then(function(response) {
    activeCalls = Call.merge(activeCalls, response.data.records); // safely merge existing active calls with new ones
}.catch(function(e) {
    alert('Active Calls Error: ' + e.message);
});
```

## View the list of recent calls

```js
var calls = [],
    Call = rcsdk.getCallHelper();

// This call may be repeated when needed, for example as a response to incoming Subscription
platform.apiCall(Call.loadRequest(null, {
    query: { // this can be omitted
        page: 1,
        perPage: 10
    },
})).then(function(response) {
    calls = Call.merge(calls, response.data.records); // safely merge existing active calls with new ones
}).catch(function(e) {
    alert('Recent Calls Error: ' + e.message);
});
```
    
By default, the load request returns calls that were made during the last week. To alter the time frame, provide custom
`query.dateTo` and `query.dateFrom` properties.

# SMS

In order to send an SMS using the API, simply make a POST request to `/account/~/extension/~/sms`:

```js
var platform = rcsdk.getPlatform();
platform.post('/account/~/extension/~/sms', {
    body: {
        from: {phoneNumber:'+12223334444'}, // Your sms-enabled phone number
        to: [
            {phoneNumber:'+15556667777'} // Second party's phone number
        ],
        text: 'Message content'
    }
}).then(function(response) {
    alert('Success: ' + response.data.id);
}).catch(function(e) {
    alert('Error: ' + e.message);
});
```

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
var observer = rcsdk.getAjaxObserver();
observer.on(observer.events.beforeRequest, function(request) {});
observer.on(observer.events.requestSuccess, function(response, request) {});
observer.on(observer.events.requestError, function(e) {});
```

Observer functions are passed a reference to the Ajax for which the event has occurred. Every Ajax object offers a
number of accessor methods and properties:

- `options` &mdash; request that was given to transport
- `response` &mdash; raw text response from server *(if any)*
- `status` &mdash; HTTP status code *(if any)*
- `headers` &mdash; HTTP response headers *(if any)*

***

# Model Relations

## Abstract

The SDK allows easy establishment of relationships between objects, such as between a Message object and its associated
Contact objects, or a Presence object and its associated Extension object. How the relationship is resolved varies
across different types of objects. The resolving function is provided by helper objects of a certain type.

## Relationship

Models have relationships to other models.

In many cases, model relationships are merely through properties of a model that identify other models. The data for the
associated child models is not contained inside the data for the model and would need to be loaded with separate
requests to the server. This type of relationship is considered a weak relationship. To use an example, both the Message
and Call models have relationships to the Contact model. Associated models should be loaded separately and may be
assigned to appropriate properties dynamically on the client based upon some criteria through helpers.

In some cases, models may actually contain other models. In such cases, the data for the associated child models will be
contained inside the model's data in the form of a property. The server returns the data for the model and its contained
child models within the same API call. As examples of this, the Presence model contains an `extension` property and the
Account model contains an `operator` property, and these properties are both references to contained models of type
`IExtensionShort`.

## Examples

### Abstract CallerInfo types and Contacts

```js
var contacts = [{homePhone: '+(1)foo'}, ...], // homePhone may be formatted
    callerInfos = [{phoneNumber: '1foo'}, ...]; // phoneNumber is not formatted

rcsdk.getContactHelper().attachToCallerInfos(callerInfos, contacts);
```

Each `callerInfo` object will get the new properties:
 
1. `contact` &mdash; matching contact
2. `contactPhone` &mdash; entry from `contact` that matched `phoneNumber` 

### Messages / Calls and Contacts

For Messages and Calls, optimized helper functions may be used: 

```js
rcsdk.getMessageHelper().attachContacts(contacts, messages);
rcsdk.getCallHelper().attachContacts(contacts, calls);
```

This will internally fetch a list of `callerInfos` and attach appropriate contacts to them.

### Presence and Extensions

`Presence` information may be attached to `extensions`, for example, when the application has loaded a list of
extensions and a list of their associated presence. Each `extension` will be given a new `presence` property, which will
link to the presence object for the extension.

```js
rcsdk.getPresenceHelper().attachToExtensions(extensions, presences);
```

