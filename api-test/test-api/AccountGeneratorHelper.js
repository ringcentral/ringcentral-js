export default class AccountGeneratorHelper {

    /**
     * @param {AccountGenerator} accountGenerator
     * @param {string} dbName
     */
    constructor(accountGenerator, dbName) {
        if (!accountGenerator) throw new Error('No accountGenerator specified');
        if (!dbName) throw new Error('No dbname specified');
        this.accountGenerator = accountGenerator;
        this.dbName = dbName;
    }

    asyncTest(cb, scenario, count, modified) {

        return async () => {

            if (!count) count = 1;
            if (!scenario) scenario = 'platform_messages';

            await this.accountGenerator.connect();

            /** @type {IAccount[]} */
            var accounts = await this.accountGenerator.getAndLock({
                dbName: this.dbName,
                scenario: scenario,
                accountCount: count
            });

            console.info('Accounts acquired', phoneNumbers(accounts));

            var error = null;

            try {
                await cb(accounts);
            } catch (e) {
                error = e;
            }

            if (accounts.length == 0) {
                console.info('Nothing to release');
                return;
            }

            console.info('Releasing', phoneNumbers(accounts), 'modified', modified);

            await this.accountGenerator.release({
                dbName: this.dbName,
                rcUserIds: accounts.map((account) => {
                    return account.userId;
                }),
                modified: modified
            });

            if (error) throw error;

        }

    };

}

function phoneNumbers(accounts) {
    return accounts.map((account) => {
        return account.mainPhoneNumber; // + ':' + account.password;
    }).join(', ')
}