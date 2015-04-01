var define = typeof define === 'function' && define.amd ? define : function (factory) {
    factory(require, exports, module);
};
define(function (require, exports, module) {
    var promise = require('es6-promise');
    var soap = require('soap');
    var Promise = promise.Promise;
    var AccountGenerator = function () {
        /**
     * @name AccountGenerator
     * @param {string} server
     * @constructor
     */
        function AccountGenerator(server) {
            if (!server)
                throw new Error('Server is not defined');
            this.server = server;
            this.client = null;
            this.connectionPromise = null;
        }
        AccountGenerator.prototype.ensureClient = function () {
            if (!this.client)
                throw new Error('Client is not connected');
            return this;
        };
        AccountGenerator.prototype.connect = function () {
            var self = this;
            if (this.client) {
                console.info('AccountGenerator: Client already has connection');
                return this.connectionPromise;
            }
            this.connectionPromise = new Promise(function (resolve, reject) {
                var url = self.server + '/ags/ws?wsdl';
                console.log('Connecting to', url);
                soap.createClient(url, function (e, cl) {
                    console.info('AccountGenerator: SOAP has been connected', e && e.message || '');
                    if (e)
                        throw e;
                    self.client = cl;
                    resolve(self.client);
                });
            });
            return this.connectionPromise;
        };
        AccountGenerator.prototype.getAndLock = function (config) {
            var _this = this;
            return new Promise(function (resolve, reject) {
                _this.ensureClient();
                if (!config.dbName)
                    throw new Error('No dbName specified');
                if (!config.scenario)
                    throw new Error('No scenario specified');
                if (!config.accountCount)
                    throw new Error('No accountCount specified');
                config.accountCount = config.accountCount.toString();
                _this.client.getAndLock(config, function (e, result) {
                    if (e)
                        throw e;
                    var accounts = result.accounts.account.length ? result.accounts.account : [result.accounts.account];
                    resolve(accounts);
                });
            });
        };
        AccountGenerator.prototype.release = function (config) {
            var _this = this;
            return new promise.Promise(function (resolve, reject) {
                _this.ensureClient();
                if (!config.dbName)
                    throw new Error('No dbName specified');
                if (!config.rcUserIds)
                    throw new Error('No scenario specified');
                config.modified = config.modified ? 'true' : 'false';
                if (Array.isArray(config.rcUserIds))
                    config.rcUserIds = config.rcUserIds.join(',');
                //TODO This may not work
                _this.client.release(config, function (e, result) {
                    if (e)
                        throw e;
                    resolve(result);
                });
            });
        };
        return AccountGenerator;
    }();
    exports.AccountGenerator = AccountGenerator;
});