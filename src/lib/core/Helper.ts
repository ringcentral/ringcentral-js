/// <reference path="../../typings/externals.d.ts" />

import utils = require('./Utils');
import context = require('./Context');
import request = require('./http/Request');
import response = require('./http/Response');

export class Helper {

    protected defaultProperty:string = 'id';

    protected context:context.Context;
    protected utils:utils.Utils;

    constructor(context:context.Context) {

        this.context = context;
        this.utils = utils.$get(context);

    }

    getContext() {
        return this.context;
    }

    createUrl(options?:any, id?:string) {
        return '';
    }

    getId(object:IHelperObject) {
        return object && object[this.defaultProperty];
    }

    isNew(object:IHelperObject) {
        return !this.getId(object) || !this.getUri(object);
    }

    resetAsNew(object:IHelperObject) {
        if (object) {
            delete object.id;
            delete object.uri;
        }
        return object;
    }

    getUri(object:IHelperObject) {
        return object && object.uri;
    }

    parseMultipartResponse(ajax:response.Response) {

        if (ajax.isMultipart()) {

            // ajax.data has full array, leave only successful
            return ajax.data.filter((result) => {
                return (!result.error);
            }).map((result:response.Response) => {
                return result.data;
            });

        } else { // Single ID

            return [ajax.data];

        }

    }

    /**
     * Options have higher priority, if object.url and options.url were provided, options.url will be returned
     * If no URL was provided, default will be returned
     */
    loadRequest(object?, options?:request.IAjaxOptions):request.IAjaxOptions {

        return this.utils.extend(options || {}, {
            url: (options && options.url) || (object && this.getUri(object)) || this.createUrl(),
            method: (options && options.method) || 'GET'
        });

    }

    /**
     * Options have higher priority, if object.url and options.url were provided, options.url will be returned
     * If no URL was provided, default will be returned
     */
    saveRequest(object?, options?:request.IAjaxOptions):request.IAjaxOptions {

        if (!object && !(options && (options.post || options.body))) throw new Error('No Object');

        return this.utils.extend(options || {}, {
            method: (options && options.method) || (this.isNew(object) ? 'POST' : 'PUT'),
            url: (options && options.url) || this.getUri(object) || this.createUrl(),
            body: (options && (options.body || options.post)) || object
        });

    }

    /**
     * Options have higher priority, if object.url and options.url were provided, options.url will be returned
     * If no URL was provided exception will be thrown
     */
    deleteRequest(object?, options?:request.IAjaxOptions):request.IAjaxOptions {

        options = options || {};

        if (!this.getUri(object) && !(options && options.url)) throw new Error('Object has to be not new or URL must be provided');

        return this.utils.extend(options || {}, {
            method: (options && options.method) || 'DELETE',
            url: (options && options.url) || this.getUri(object)
        });

    }

    /**
     * If no url was provided, default SYNC url will be returned
     */
    syncRequest(options?:request.IAjaxOptions):request.IAjaxOptions {

        options = options || {};

        options.url = options.url || this.createUrl({sync: true});
        options.query = options.query || options.get || {};

        if (!!options.query.syncToken) {
            options.query = {
                syncType: 'ISync',
                syncToken: options.get.syncToken
            };
        } else {
            options.query.syncType = 'FSync';
        }

        return options;

    }

    nextPageExists(data):boolean {

        return (data && data.navigation && ('nextPage' in data.navigation));

    }

    /**
     * array - an array to be indexed
     * getIdFn - must return an ID for each array item
     * gather - if true, then each index will have an array of items, that has same ID, otherwise the first indexed
     * item wins
     */
    index(array:IHelperObject[], getIdFn?:(obj:IHelperObject)=>string, gather?:boolean):any {

        getIdFn = getIdFn || this.getId.bind(this);
        array = array || [];

        return array.reduce((index, item) => {

            var id = getIdFn(item);

            if (!id || (index[id] && !gather)) return index;

            if (gather) {
                if (!index[id]) index[id] = [];
                index[id].push(item);
            } else {
                index[id] = item;
            }

            return index;

        }, {});

    }

    /**
     * Returns a shallow copy of merged _target_ array plus _supplement_ array
     * mergeItems
     * - if true, properties of _supplement_ item will be applied to _target_ item,
     * - otherwise _target_ item will be replaced
     */
    merge(target:IHelperObject[],
          supplement:IHelperObject[],
          getIdFn?:(obj:IHelperObject)=>string, mergeItems?:boolean):any {

        getIdFn = getIdFn || this.getId.bind(this);
        target = target || [];
        supplement = supplement || [];

        var supplementIndex = this.index(supplement, getIdFn),
            updatedIDs = [],
            result = <IHelperObject[]>target.map((item) => {

                var id = getIdFn(item),
                    newItem = supplementIndex[id];

                if (newItem) updatedIDs.push(id);

                return newItem ? (mergeItems ? this.utils.extend(item, newItem) : newItem) : item;

            });

        supplement.forEach((item) => {

            if (updatedIDs.indexOf(getIdFn(item)) == -1) result.push(item);

        });

        return result;

    }


}

export function $get(context:context.Context):Helper {
    return new Helper(context);
}

export interface IHelperObject {
    id?:string;
    uri?:string;
}