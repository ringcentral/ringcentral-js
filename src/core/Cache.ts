module RingCentral.sdk.core {

    export class Cache {

        private _storage:Storage;
        private _prefix:string;

        constructor(storage:Storage|any, prefix?:string) {
            this.setPrefix(prefix);
            this._storage = storage;
        }

        setPrefix(prefix?:string) {
            this._prefix = prefix || 'rc-';
            return this;
        }

        setItem(key, data) {
            this._storage[this._prefixKey(key)] = JSON.stringify(data);
            return this;
        }

        removeItem(key) {
            delete this._storage[this._prefixKey(key)];
            return this;
        }

        getItem(key) {
            var item = this._storage[this._prefixKey(key)];
            if (!item) return null;
            return JSON.parse(item);
        }

        clean() {

            for (var key in this._storage) {

                if (!this._storage.hasOwnProperty(key)) continue;

                if (key.indexOf(this._prefix) === 0) {
                    delete this._storage[key];
                }

            }

            return this;

        }

        protected _prefixKey(key) {
            return this._prefix + key;
        }

    }

}

