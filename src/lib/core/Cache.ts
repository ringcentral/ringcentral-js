/// <reference path="../../typings/externals.d.ts" />

import context = require('./Context');

export class Cache {

    private context:context.Context;
    private storage:Storage;
    private prefix:string;

    constructor(context:context.Context) {
        this.setPrefix();
        this.context = context;
        this.storage = context.getLocalStorage(); // storage must be defined from outside
    }

    setPrefix(prefix?:string) {
        this.prefix = prefix || 'rc-';
        return this;
    }

    prefixKey(key) {
        return this.prefix + key;
    }

    setItem(key, data) {
        this.storage.setItem(this.prefixKey(key), JSON.stringify(data));
        return this;
    }

    removeItem(key) {
        this.storage.removeItem(this.prefixKey(key));
        return this;
    }

    getItem(key) {
        var item = this.storage.getItem(this.prefixKey(key));
        if (!item) return null;
        return JSON.parse(item);
    }

    clean() {

        for (var key in this.storage) {
            if (!this.storage.hasOwnProperty(key)) continue;
            if (key.indexOf(this.prefix) === 0) {
                this.storage.removeItem(key);
                delete this.storage[key];
            }
        }

        return this;

    }

}

export function $get(context:context.Context):Cache {
    return context.createSingleton('Cache', ()=> {
        return new Cache(context);
    });
}