(function() {

    if (!process.env.RCSDK_API_SERVER) throw new Error('Process.env.RCSDK_API_SERVER is undefined');
    if (!process.env.RCSDK_API_KEY) throw new Error('Process.env.RCSDK_API_KEY is undefined');

    var AccountGenerator = require('./lib/AccountGenerator'),
        AccountGeneratorHelper = require('./lib/AccountGeneratorHelper'),
        accountGenerator = new AccountGenerator(process.env.RCSDK_AGS_SERVER),
        accountGeneratorHelper = new AccountGeneratorHelper(accountGenerator, process.env.RCSDK_AGS_DBNAME),
        chai = require('chai'),
        expect = chai.expect,
        spies = require('chai-spies'),
        SDK = require('../lib/index'),
        /** @type {RCSDK} */
        rcsdk = new SDK(),
        platform = rcsdk.getPlatform();

    chai.use(spies);

    platform.server = process.env.RCSDK_API_SERVER;
    platform.apiKey = process.env.RCSDK_API_KEY;

    global.chai = chai;
    global.expect = expect;
    global.accountGenerator = accountGenerator;
    global.accountGeneratorHelper = accountGeneratorHelper;
    global.rcsdk = rcsdk;
    global.RCSDK = SDK;

})();