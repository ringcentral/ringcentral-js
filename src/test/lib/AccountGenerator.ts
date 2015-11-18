/// <reference path="../../typings/externals.d.ts" />

declare var require:(name:string)=>any;

import promise = require('es6-promise');

var soap = require('soap');
var Promise = promise.Promise;

export class AccountGenerator {

    private server:string;
    private client:any;
    private connectionPromise:Promise<any>;

    /**
     * @name AccountGenerator
     * @param {string} server
     * @constructor
     */
    constructor(server) {
        if (!server) throw new Error('Server is not defined');
        this.server = server;
        this.client = null;
        this.connectionPromise = null;
    }

    private ensureClient() {
        if (!this.client) throw new Error('Client is not connected');
        return this;
    }

    connect():Promise<any> {

        var self = this;

        if (this.client) {
            console.info('AccountGenerator: Client already has connection');
            return this.connectionPromise;
        }

        this.connectionPromise = new Promise<any>(function(resolve, reject) {

            var url = self.server + '/ags/ws?wsdl';

            console.log('Connecting to', url);

            soap.createClient(url, function(e, cl) {
                console.info('AccountGenerator: SOAP has been connected', e && e.message || '');
                if (e) throw e;
                self.client = cl;
                resolve(self.client);
            });

        });

        return this.connectionPromise;

    }

    getAndLock(config:{dbName:string; scenario:string; accountCount:any}) {

        return new Promise<any>((resolve, reject) => {

            this.ensureClient();

            if (!config.dbName) throw new Error('No dbName specified');
            if (!config.scenario) throw new Error('No scenario specified');
            if (!config.accountCount) throw new Error('No accountCount specified');

            config.accountCount = config.accountCount.toString();

            this.client.getAndLock(config, function(e, result) {
                if (e) throw e;
                var accounts = result.accounts.account.length ? result.accounts.account : [result.accounts.account];
                resolve(accounts);
            });

        });

    }

    release(config:{dbName:string; rcUserIds:string; modified?:boolean});
    release(config:{dbName:string; rcUserIds:string[]; modified?:boolean});
    release(config:{dbName:string; rcUserIds:any; modified?:any}) {

        return new promise.Promise<any>((resolve, reject) => {

            this.ensureClient();

            if (!config.dbName) throw new Error('No dbName specified');
            if (!config.rcUserIds) throw new Error('No scenario specified');

            config.modified = config.modified ? 'true' : 'false';

            if (Array.isArray(config.rcUserIds)) config.rcUserIds = config.rcUserIds.join(','); //TODO This may not work

            this.client.release(config, function(e, result) {
                if (e) throw e;
                resolve(result);
            });

        });

    }

}

export interface IAccount {
    userId:string;
    mainPhoneNumber:string;
    password:string;
}