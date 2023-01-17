import {asyncTest} from '@ringcentral/sdk/lib/test/test';
import {Subscriptions} from './Subscriptions';

describe('Subscription', () => {
    describe('init', () => {
        it(
            'can init without exception',
            asyncTest(async sdk => {
                const subscriptions = new Subscriptions({
                    sdk: sdk,
                });
                const subscription = subscriptions.createSubscription();
            }),
        );
    });
});
