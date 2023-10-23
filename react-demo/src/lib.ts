import SDK from '@ringcentral/sdk';

import packageJson from '../package.json';

const redirectUri = `${window.location.origin}/api/oauth2Callback`; // make sure you have this configured in Dev Portal

export const sdk = new SDK({
    appName: 'ReactDemo',
    appVersion: packageJson.version,
    server: process.env.REACT_APP_API_SERVER,
    clientId: process.env.REACT_APP_API_CLIENT_ID,
    redirectUri,
});
