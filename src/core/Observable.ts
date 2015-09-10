/// <reference path="./Log.ts" />
/// <reference path="./Utils.ts" />

module RingCentral.sdk.core {

    /**
     * @see https://github.com/Microsoft/TypeScript/issues/275
     */
    export class Observable<T extends Observable<any>> {

        private _listeners:any;

        constructor() {
            if (!(this instanceof Observable)) throw new Error('Observable(): New operator was omitted');
            this.off();
        }

        hasListeners(event) {
            return (event in this._listeners);
        }

        on(events:any, callback:(...args)=>any):T {

            if (typeof events == 'string') events = [events];
            if (!events) throw new Error('No events to subscribe to');
            if (typeof callback !== 'function') throw new Error('Callback must be a function');

            events.forEach((event:string) => {

                if (!this.hasListeners(event)) this._listeners[event] = [];

                this._listeners[event].push(callback);

            });

            return <any>this;

        }

        emit(event:string, ...args):any {

            var result = null;

            if (!this.hasListeners(event)) return null;

            this._listeners[event].some((callback:()=>any) => {

                result = callback.apply(this, args);
                return (result === false);

            });

            return result;

        }

        off(event?:string, callback?):T {

            if (!event) {

                this._listeners = {};

            } else {

                if (!callback) {

                    delete this._listeners[event];

                } else {

                    if (!this.hasListeners(event)) return <any>this;

                    this._listeners[event].forEach((cb, i) => {

                        if (cb === callback) delete this._listeners[event][i];

                    });

                }

            }

            return <any>this;

        }

        destroy():T {
            this.off();
            log.debug('Observable.destroy(): Listeners were destroyed');
            return <T>this;
        }

    }

}


