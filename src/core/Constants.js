var version = process.env.RCSDK_VERSION;

// This will become false during the Webpack build, so no traces of package.json will be there
if (!process.env.RCSDK_VERSION) {
    version = require('../../package.json').version;
}

module.exports = {
    version: version,
    authResponseProperty: 'RCAuthorizationResponse'
};