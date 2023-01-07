# RingCentral Subscriptions SDK

This package allows to listen to server side events via push notifications.

**Attention! This package is intended to be used on client side where `SDK.Cache` has synchronous interface.**

On NodeJS it is preferred to have Web Hooks instead of PubNub subscriptions.

If you plan to use this package on NodeJS make sure that if you supply a custom `SDK.Cache` it has synchronous interface.

# Installation

Follow all instructions from [SDK package](../sdk).

## Set things up in NodeJS

1. Install the NPM package:

    ```sh
    npm install @ringcentral/sdk @ringcentral/subscriptions --save
    ```

2. Require the SDK:

    ```js
    import {SDK} from "@ringcentral/sdk";
    import {Subscriptions} from "@ringcentral/subscriptions";
    // or
    const SDK = require('ringcentral').SDK;
    const Subscriptions = require('@ringcentral/subscriptions').Subscriptions;

    const sdk = new SDK({
        server: SDK.server.sandbox,
        appKey: 'yourAppKey',
        appSecret: 'yourAppSecret',
        redirectUri: '' // optional, but is required for Implicit Grant and Authorization Code OAuth Flows (see below)
    });
    const subscriptions = new Subscriptions({
       sdk: sdk
    });
    ```

## Set things up for Browserify or Webpack

Follow installation steps for NodeJS. Don't forget to add `target: 'web'` to your `webpack.config.js` to tell Webpack to
pick proper `PubNub` implementation.

## Set things up in Browser

### Get the code

Pick the option that works best for you:

- Use CDN **Attention! Versions listed here may be outdated**:
    - ... all SDK dependencies
    - https://unpkg.com/@ringcentral/sdk@latest/dist/ringcentral.js
    - https://unpkg.com/browse/@ringcentral/subscriptions@latest/dist/ringcentral-subscriptions.js
    - https://unpkg.com/pubnub@latest/dist/web/pubnub.js

- Download everything manually:
    - ... all SDK dependencies
    - [Subscriptions SDK](https://github.com/ringcentral/ringcentral-js/releases/download/latest)
    - [PUBNUB](https://github.com/pubnub/javascript)

### Add scripts to HTML page (if you are not using any module loaders)

The SDK is represented by the global RingCentral constructor. Your application must create an instance of this object:

Add the following to your HTML:

```html
<script type="text/javascript" src="path-to-scripts/promise.auto.js"></script>
<script type="text/javascript" src="path-to-scripts/fetch.umd.js"></script>
<script type="text/javascript" src="path-to-scripts/pubnub.js"></script>
<script type="text/javascript" src="path-to-scripts/ringcentral.js"></script>
<script type="text/javascript" src="path-to-scripts/ringcentral-subscriptions.js"></script>
<script type="text/javascript">

    var sdk = new RingCentral.SDK({
        server: RingCentral.SDK.server.sandbox,
        appKey: 'yourAppKey',
        appSecret: 'yourAppSecret',
        redirectUri: '' // optional, but is required for Implicit Grant and Authorization Code OAuth Flows (see below)
    });

    var subscriptions = new RingCentral.Subscriptions({
       sdk: sdk
    });

</script>
```

### If you use RequireJS in your project

```js
// Add this to your RequireJS configuration file
require.config({
    paths: {
        'pubnub': 'path-to-scripts/pubnub',
        'ringcentral': 'path-to-scripts/ringcentral',
        'ringcentral-subscriptions': 'path-to-scripts/ringcentral-subscriptions'
    }
});

// Then you can use the SDK like any other AMD component
require(['ringcentral', 'ringcentral-subscriptions'], function(sdkNs, subscriptionsNs) {
    var sdk = new sdkNs.SDK({
        server: sdkNs.SDK.server.sandbox,
        appKey: 'yourAppKey',
        appSecret: 'yourAppSecret',
        redirectUri: '' // optional, but is required for Implicit Grant and Authorization Code OAuth Flows (see below)
    });
    var subscriptions = new subscriptionsNs.Subscriptions({
       sdk: sdk
    });
});
```

# Server-side Subscriptions

Subscriptions are a convenient way to receive updates on server-side events, such as new messages or presence changes.

Subscriptions are created by calling the `getSubscription` method of the RingCentral instance created earlier on.

```js
var subscription = subscriptions.createSubscription();

subscription.on(subscription.events.notification, function(msg) {
    console.log(msg, msg.body);
});

subscription
    .setEventFilters(['/restapi/v1.0/account/~/extension/~/presence']) // a list of server-side events
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
subscription.setEventFilters(['/restapi/v1.0/account/~/extension/111/presence']).register();
subscription.addEventFilters(['/restapi/v1.0/account/~/extension/222/presence']).register();
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
const cacheKey = 'some-custom-key';
const subscription = subscriptions.createSubscription();
const cachedSubscriptionData = await sdk.cache().getItem(cacheKey);

if (cachedSubscriptionData) {
    try { // if subscription is already expired an error will be thrown so we need to capture it
        subscription.setSubscription(cachedSubscriptionData); // use the cache
    } catch (e) {
        console.error('Cannot set subscription data', e);
    }
} else {
    subscription.setEventFilters(['/restapi/v1.0/account/~/extension/~/presence']); // explicitly set required events
}

subscription.on([subscription.events.subscribeSuccess, subscription.events.renewSuccess], async function() {
    await sdk.cache().setItem(cacheKey, subscription.subscription());
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
        .register()
        .catch(...);
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
var subscription = await subscriptions.createCachedSubscription('cache-key');
subscription.restore(['/restapi/v1.0/account/~/extension/~/presence']);

// use it as usual
subscription.register().catch(...);
```
