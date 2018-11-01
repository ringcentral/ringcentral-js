import {SDK} from "@ringcentral/sdk";
import {Subscriptions} from "@ringcentral/subscriptions";

const sdk = new SDK({
    appKey: 'foo',
    appSecret: 'foo',
    server: SDK.server.production
});

const subscriptions = new Subscriptions({sdk});

const sub = subscriptions.createSubscription({});