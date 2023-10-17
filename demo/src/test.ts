import {SDK} from '@ringcentral/sdk';
import {Subscriptions} from '@ringcentral/subscriptions';

const sdk = new SDK({
    clientId: 'foo',
    clientSecret: 'foo',
    server: SDK.server.production,
});

const subscriptions = new Subscriptions({sdk});

const sub = subscriptions.createSubscription();
