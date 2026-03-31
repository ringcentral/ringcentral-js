import { SDK } from "@ringcentral/sdk";
import EventEmitter from "events";
import RingCentral from "@rc-ex/core";
import RcSdkExtension from "@rc-ex/rcsdk";
import WebSocketExtension, { Events as WsEvents } from "@rc-ex/ws";
import waitFor from "wait-for-async";
import WsSubscription from "@rc-ex/ws/subscription";

export class Subscription extends EventEmitter {
  private subscriptions: Subscriptions;
  public events = {
    notification: "notification",
  };
  public eventFilters!: string[];

  public constructor(options: { subscriptions: Subscriptions }) {
    super();
    this.subscriptions = options.subscriptions;
  }

  public setEventFilters(eventFilters: string[]) {
    this.eventFilters = eventFilters;
    return this;
  }

  private isWsOpen(wsExtension: WebSocketExtension): boolean {
    return Boolean(wsExtension.ws && wsExtension.ws.readyState === 1);
  }

  private async waitForWsReady(wsExtension: WebSocketExtension, timeoutMs = 30000): Promise<void> {
    if (this.isWsOpen(wsExtension)) {
      return;
    }

    await new Promise<void>((resolve, reject) => {
      let timeoutHandle: ReturnType<typeof setTimeout>;

      const onReady = () => {
        cleanup();
        resolve();
      };

      const onError = (err: Error) => {
        cleanup();
        reject(err);
      };

      const onTimeout = () => {
        cleanup();
        reject(new Error(`WebSocket connection timeout after ${timeoutMs}ms`));
      };

      const cleanup = () => {
        clearTimeout(timeoutHandle);
        wsExtension.eventEmitter.off(WsEvents.connectionReady, onReady);
        wsExtension.eventEmitter.off(WsEvents.autoRecoverError, onError);
      };

      wsExtension.eventEmitter.once(WsEvents.connectionReady, onReady);
      wsExtension.eventEmitter.once(WsEvents.autoRecoverError, onError);

      if (this.isWsOpen(wsExtension)) {
        onReady();
        return;
      }

      timeoutHandle = setTimeout(onTimeout, timeoutMs);
    });
  }

  public async register(): Promise<WsSubscription> {
    await this.subscriptions.init();
    const wsExtension = await this.subscriptions.newWsExtension();
    await this.waitForWsReady(wsExtension);
    return await wsExtension.subscribe(this.eventFilters, (event) => {
      this.emit(this.events.notification, event);
    });
  }
}

export class Subscriptions {
  private status = "new"; // new, in-progress, ready
  public rc: RingCentral;
  public rcSdkExtension: RcSdkExtension;

  public constructor(options: { sdk: SDK }) {
    this.rc = new RingCentral();
    this.rcSdkExtension = new RcSdkExtension({ rcSdk: options.sdk });
  }

  public async init() {
    if (this.status === "ready") {
      return;
    }
    if (this.status === "in-progress") {
      await waitFor({
        condition: () => this.status === "ready",
      });
      return;
    }
    this.status = "in-progress";
    await this.rc.installExtension(this.rcSdkExtension);
    this.status = "ready";
  }

  public async newWsExtension() {
    const wsExtension = new WebSocketExtension();
    await this.rc.installExtension(wsExtension);
    return wsExtension;
  }

  public createSubscription(): Subscription {
    return new Subscription({ subscriptions: this });
  }
}

export default Subscriptions;
