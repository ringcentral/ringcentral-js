# RingCentral Subscriptions SDK

This project is a proxy project to the [WebSocket Extension](https://github.com/ringcentral/ringcentral-extensible/tree/master/packages/extensions/ws) of the [RingCentral Extensible](https://github.com/ringcentral/ringcentral-extensible) project.

For new users, you are recommended to use [this project](https://github.com/ringcentral/ringcentral-extensible/tree/master/packages/extensions/ws) directly.

Please do read this article: [Create WebSocket subscriptions using RingCentral JavaScript SDKs](https://medium.com/@tylerlong/create-websocket-subscriptions-using-ringcentral-javascript-sdks-1204ce5843b8).


## App permissions required

Your RingCentral app needs to have the "WebSocket Subscriptions" permission. If you don't know how to enabled it, please contact [dev support](https://developers.ringcentral.com/support/create-case).


## Installation

```sh
yarn add @ringcentral/sdk @ringcentral/subscriptions
```

## Usage sample

```ts
import {SDK} from '@ringcentral/sdk';
import {Subscriptions} from '@ringcentral/subscriptions';

// init
const sdk = new SDK({
  server: process.env.RINGCENTRAL_SERVER_URL,
  clientId: process.env.RINGCENTRAL_CLIENT_ID,
  clientSecret: process.env.RINGCENTRAL_CLIENT_SECRET,
});
const platform = sdk.platform();
const subscriptions = new Subscriptions({
  sdk: sdk,
});

const main = async () => {
  // login
  await platform.login({
    username: process.env.RINGCENTRAL_USERNAME,
    extension: process.env.RINGCENTRAL_EXTENSION,
    password: process.env.RINGCENTRAL_PASSWORD,
  });

  // subscribe
  const subscription = subscriptions.createSubscription();
  subscription.on(subscription.events.notification, evt => {
    console.log(JSON.stringify(evt, null, 2));
  });
  await subscription
    .setEventFilters(['/restapi/v1.0/account/~/extension/~/message-store'])
    .register();

  // trigger events
  const r = await platform.get('/restapi/v1.0/account/~/extension/~');
  const ext = await r.json();
  platform.post('/restapi/v1.0/account/~/extension/~/company-pager', {
    from: {extensionId: ext.id},
    to: [{extensionId: ext.id}],
    text: 'Hello world!',
  });
};

main();
```


## Traditional way

Let's say you just want to use plain HTML and JavaScript without any fancy technology such as webpack/parcel/TypeScript...etc.

Please refer to the [RingCentral SPA Demo](https://github.com/tylerlong/rc-spa-demo).

Simply put:

```
<script type="text/javascript" src="https://unpkg.com/@ringcentral/sdk@latest/dist/ringcentral.js"></script>
<script type="text/javascript" src="https://unpkg.com/@ringcentral/subscriptions@0.0.1-master.4079103221.135.0/dist/ringcentral-subscriptions.js"></script>

...


const rc = new RingCentral.SDK({
  server,
  clientId,
});

...

const subscriptions = new RingCentral.Subscriptions({
  sdk: rc
});
const subscription = subscriptions.createSubscription();

...
```


`@ringcentral/subscriptions@0.0.1-master.4079103221.135.0` was the latest nightly build when I was writing this documentation.
Please choose a proper version yourself.
