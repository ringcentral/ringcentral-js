(function() {

    var soap = require('soap'),
        Promise = require('es6-promise').Promise;

    /**
     * @name AccountGenerator
     * @param {string} server
     * @constructor
     */
    function AccountGenerator(server) {
        if (!server) throw new Error('Server is not defined');
        this.server = server;
        this.client = null;
        this.connectionPromise = null;
    }

    /**
     * @private
     * @returns {AccountGenerator}
     */
    AccountGenerator.prototype.ensureClient = function() {
        if (!this.client) throw new Error('Client is not connected');
        return this;
    };

    /**
     * @returns {Promise}
     */
    AccountGenerator.prototype.connect = function() {

        var self = this;

        if (this.client) {
            console.info('AccountGenerator: Client already has connection');
            return this.connectionPromise;
        }

        this.connectionPromise = new Promise(function(resolve, reject) {

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

    };

    /**
     * @param {string} config.dbName
     * @param {string} config.scenario
     * @param {string} config.accountCount
     * @returns {Promise}
     */
    AccountGenerator.prototype.getAndLock = function(config) {

        var self = this;

        return new Promise(function(resolve, reject) {

            self.ensureClient();

            if (!config.dbName) throw new Error('No dbName specified');
            if (!config.scenario) throw new Error('No scenario specified');
            if (!config.accountCount) throw new Error('No accountCount specified');

            self.client.getAndLock(config, function(e, result) {
                if (e) throw e;
                var accounts = result.accounts.account.length ? result.accounts.account : [result.accounts.account];
                resolve(accounts);
            });

        });

    };

    /**
     * @param {string} config.dbName
     * @param {string} config.rcUserIds
     * @param {string} config.modified
     * @returns {Promise}
     */
    AccountGenerator.prototype.release = function(config) {

        var self = this;

        return new Promise(function(resolve, reject) {

            self.ensureClient();

            if (!config.dbName) throw new Error('No dbName specified');
            if (!config.rcUserIds) throw new Error('No scenario specified');

            if (Array.isArray(config.rcUserIds)) config.rcUserIds = config.rcUserIds.join(','); //TODO This may not work

            self.client.release(config, function(e, result) {
                if (e) throw e;
                resolve(result);
            });

        });

    };

    module.exports = AccountGenerator;

    /**
     * @typedef {Object} IAccount
     * @property {string} userId
     * @property {string} mainPhoneNumber
     * @property {string} password
     */

})();