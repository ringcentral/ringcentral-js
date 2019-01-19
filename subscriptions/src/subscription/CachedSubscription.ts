import Subscription, {SubscriptionOptions, SubscriptionOptionsConstructor} from './Subscription';

export default class CachedSubscription extends Subscription {
    protected _cacheKey: string;

    public constructor({sdk, PubNub, cacheKey, pollInterval, renewHandicapMs}: CachedSubscriptionOptionsConstructor) {
        super({sdk, PubNub, pollInterval, renewHandicapMs});

        if (!cacheKey) throw new Error('Cached Subscription requires cacheKey parameter to be defined');

        this._cacheKey = cacheKey;
    }

    public subscription() {
        return this._sdk.cache().getItemSync(this._cacheKey) || {};
    }

    protected _setSubscription(subscription) {
        this._sdk.cache().setItemSync(this._cacheKey, subscription);
        return this;
    }

    /**
     * This function checks whether there are any pre-defined eventFilters in cache and if not -- uses provided as defaults
     */
    public restore(events: string[]) {
        if (!this.eventFilters().length) {
            this.setEventFilters(events);
        }

        return this;
    }
}

export interface CachedSubscriptionOptions extends SubscriptionOptions {
    cacheKey: string;
}

export interface CachedSubscriptionOptionsConstructor
    extends SubscriptionOptionsConstructor,
        CachedSubscriptionOptions {}
