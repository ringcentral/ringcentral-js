import {Promise} from 'es6-promise';
import soap from 'soap';

export default class AccountGenerator {

    constructor(server) {
        if (!server) throw new Error('AccountGenerator server is not defined');
        this._server = server;
        this._client = null;
        this._connectionPromise = null;
    }

    _ensureClient() {
        if (!this._client) throw new Error('Client is not connected');
        return this;
    }

    connect() {

        if (this._client) {
            console.info('AccountGenerator: Client already has connection');
            return this._connectionPromise;
        }

        this._connectionPromise = new Promise((resolve, reject) => {

                var url = this._server + '/ags/ws?wsdl';

                console.log('Connecting to', url);

                soap.createClient(url, (e, cl) => {
                    console.info('AccountGenerator: SOAP has been connected', e && e.message || '');
                    if (e) return reject(e);
                    this._client = cl;
                    //this._client.on('request', (xml) => {
                    //    console.log('Account Generator XML Request');
                    //    console.log(xml);
                    //});
                    resolve(this._client);
                });

            });

        return this._connectionPromise;

    }

    /**
     * {dbName:string; scenario:string; accountCount:any}
     * //@param config
     * @return {boolean}
     */
    getAndLock({dbName, scenario, accountCount, ...config}) {

        return new Promise((resolve, reject) => {

                this._ensureClient();

                if (!dbName) throw new Error('No dbName specified');
                if (!scenario) throw new Error('No scenario specified');
                if (!accountCount) throw new Error('No accountCount specified');

                this._client.getAndLock({
                    dbName: dbName,
                    scenario: scenario,
                    accountCount: accountCount.toString()
                }, (e, result) => {
                    if (e) return reject(e);
                    var accounts = result.accounts.account.length ? result.accounts.account : [result.accounts.account];
                    resolve(accounts);
                });

            });

    }

    /**
     * param {dbName:string, rcUserIds:string, modified?:boolean} config
     */
    release({dbName, rcUserIds, modified, ...config}) {

        return new Promise((resolve, reject) => {

                this._ensureClient();

                if (!dbName) throw new Error('No dbName specified');
                if (!rcUserIds) throw new Error('No scenario specified');

                this._client.release({
                    dbName: dbName,
                    rcUserIds: (Array.isArray(rcUserIds)) ? rcUserIds.join(',') : rcUserIds,
                    modified: !!modified ? 'true' : 'false'
                }, (e, result) => {
                    if (e) return reject(e);
                    resolve(result);
                });

            });

    }

}

/**
 * @name IAccount
 * @property {string} userId
 * @property {string} mainPhoneNumber
 * @property {string} password
 */