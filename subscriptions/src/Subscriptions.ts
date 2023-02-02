import {SDK} from '@ringcentral/sdk';
import EventEmitter from 'events';
import RingCentral from '@rc-ex/core';
import RcSdkExtension from '@rc-ex/rcsdk';
import WebSocketExtension from '@rc-ex/ws';
import waitFor from 'wait-for-async';

export class Subscription extends EventEmitter {
    private subscriptions: Subscriptions;
    public events = {
        notification: 'notification',
    };
    public eventFilters!: string[];

    public constructor(options: {subscriptions: Subscriptions}) {
        super();
        this.subscriptions = options.subscriptions;
    }

    public setEventFilters(eventFilters: string[]) {
        this.eventFilters = eventFilters;
        return this;
    }

    public async register() {
        await this.subscriptions.init();
        return await this.subscriptions.wsExtension.subscribe(this.eventFilters, event => {
            this.emit(this.events.notification, event);
        });
    }
}

export class Subscriptions {
    private status = 'new'; // new, in-progress, ready
    public rc: RingCentral;
    public rcSdkExtension: RcSdkExtension;
    public wsExtension: WebSocketExtension;

    public constructor(options: {sdk: SDK}) {
        this.rc = new RingCentral();
        this.rcSdkExtension = new RcSdkExtension({rcSdk: options.sdk});
        this.wsExtension = new WebSocketExtension();
    }

    public async init() {
        if (this.status === 'ready') {
            return;
        }
        if (this.status === 'in-progress') {
            await waitFor({
                condition: () => this.status === 'ready',
            });
            return;
        }
        this.status = 'in-progress';
        await this.rc.installExtension(this.rcSdkExtension);
        await this.rc.installExtension(this.wsExtension);
        this.status = 'ready';
    }

    public createSubscription(): Subscription {
        return new Subscription({subscriptions: this});
    }
}

export default Subscriptions;
