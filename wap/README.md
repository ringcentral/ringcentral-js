# Installation

```bash
$ npm install --save @ringcentral/wap @ringcentral/sdk
```

# Usage

This example is using React Router.

```js
// lib.js
import SDK from "@ringcentral/sdk";
import WAP from "@ringcentral/wap";

const sdk = new SDK({
    authProxy: true,
    urlPrefix: '/api',
    authorizeEndpoint: '/wap/authorize',
    clientId: 'XXX', // use HOST clientId here
});

const wap = new WAP({sdk: SDK});

wap.bootstrapApp('http://example.com', 'XXX');
```

Host should be able to handle `/web/success`.

# WAP Authentication Process

- On Host:
    1. Initiate regular 3-legged OAuth from Host by opening the URL: `wap.ringcentral.com/wap/authorize?client_id=%HOST_CLIENT_ID%`
    2. On success CLW will redirect to a pre-defined 3-legged Redirect URI: `wap.ringcentral.com/oauth-callback?code=%CODE%&state=%STATE%`
    3. Using the auth get the code via interop endpoint: `POST` to `wap.ringcentral.com/restapi/v1.0/interop/generate-code` with body `{clientId: %APP_CLIENT_ID%}`
    4. Using the code from interop endpoint use launch endpoint to open the app in IFrame: `wap.ringcentral.com/apps/%APP_CLIENT_ID%/api/wap/launch?code=%CODE%&landing_page_uri=%APP_URL%`
- In IFrame
    1. Launch endpoint redirect IFrame to `%APP_URL%?endpoint_url=service.ringcentral.com/apps/%APP_CLIENT_ID%/api`
    2. Use following URL to access API inside the IFrame: `wap.ringcentral.com/apps/%APP_CLIENT_ID%/api/restapi/v1.0/client-info`

# IFrame part

```js
import SDK from "@ringcentral/sdk";

const apiEntryPointKey = 'apiEntryPoint';

// this will remove the apiEntryPoint from URL
if (window.location.search.includes(apiEntryPointKey)) {
    const search = new URLSearchParams(window.location.search);
    localStorage.apiEntryPoint = search.get(apiEntryPointKey); // this will preserve entry point between HMR
    search.delete(apiEntryPointKey);
    const newUrl = new URL(window.location);
    newUrl.search = search;
    window.history.replaceState(null, null, newUrl.toString());
}

if (!localStorage.apiEntryPoint) throw new Error('No API entry point was provided!');

const apiEntryPoint = decodeURIComponent(localStorage.apiEntryPoint); // we don't need to use ENV here as everything is provided by host

const {pathname, protocol, host} = new URL(apiEntryPoint);

export const sdk = new SDK({
    server: `${protocol}//${host}`,
    urlPrefix: pathname,
    authProxy: true,
});
```