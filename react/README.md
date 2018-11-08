# Installation

```bash
$ npm install --save @ringcentral/react @ringcentral/sdk
```

# Usage

This example is using React Router.

```bash
$ npm install react-router-dom --save
```

First, you need to configure SDK:

```js
// lib.js
import SDK from "@ringcentral/sdk";

const redirectUri = `${window.location.origin}/api/redirect`; // make sure you have this configured in Dev Portal

export const sdk = new SDK({
    appName: 'AppName',
    appVersion: '1.0.0',
    server: 'xxx',
    clientId: 'xxx',
    redirectUri
});
```

Next, configure the router:

```js
// Router.js
import React from "react";
import {BrowserRouter as Router, Redirect, Route, Switch} from "react-router-dom";
import LoggedInWrapper from "./LoggedInWrapper";
import LoggedOutWrapper from "./LoggedOutWrapper";

export default () => (
    <Router>
        <Switch>
            <Route path="/app" component={LoggedInWrapper}/>
            <Route path="/api" component={LoggedOutWrapper}/>
            <Redirect from="/" to="/app"/>
        </Switch>
    </Router>
);
```

Next, configure the wrapper for non-authorized pages:

```js
// LoggedOutWrapper.js
import React from 'react';
import {Redirect, Route, Switch} from 'react-router-dom';
import {withAuthGate} from '../lib'; // change to @ringcentral/react
import OauthRedirect from './OauthRedirect';
import Login from './Login';
import {sdk} from './lib';

const LoggedOutWrapper = ({isAuthorized, authorizing, authError, match, location}) => {
    if (authorizing) {
        return <div>Loading</div>;
    }

    if (isAuthorized) {
        const {from} = location.state || {from: {pathname: '/'}};
        console.log('Redirecting to', from);
        return <Redirect to={from} />;
    }

    return (
        <Switch>
            <Route path={`${match.url}/login`} exact component={Login} />
            <Route path={`${match.url}/oauth2Callback`} exact component={OauthRedirect} />
        </Switch>
    );
};

export default withAuthGate({sdk, ensure: true})(LoggedOutWrapper);
```

Login page:

```js
// Login.js
import React from 'react';
import {withAuthGate} from '../lib'; // change to @ringcentral/react
import {sdk} from './lib';

const Login = ({authError, loginUrl, authorizing}) => {
    if (authorizing) return <div>Loading...</div>;

    const login = () => window.location.assign(loginUrl({implicit: true}));

    return (
        <div>
            {authError && <p>Auth error: {authError}</p>}
            <button type="button" onClick={login}>
                Log in with RingCentral
            </button>
        </div>
    );
};

export default withAuthGate({sdk})(Login);
```

Redirect landing page:

```js
// OauthRedirect.js
import React from 'react';
import {withAuthGate} from '../lib'; // change to @ringcentral/react
import {sdk} from './lib';

class OauthRedirect extends React.PureComponent {
    async componentDidMount() {
        const {
            location: {hash},
            parseRedirect
        } = this.props;
        await parseRedirect(hash);
    }

    render() {
        return <div>Redirecting...</div>;
    }
}

export default withAuthGate({sdk})(OauthRedirect);
```

Now let's configure what happens when user is logged in:

```js
// LoggedInWrapper.js
import React from 'react';
import {Redirect, Route, Switch} from 'react-router-dom';
import {withAuthGate} from '../lib'; // change to @ringcentral/react
import Dashboard from './Dashboard';
import {sdk} from './lib';

const LoggedInWrapper = ({isAuthorized, authorizing, logout, match, location}) => {
    if (authorizing) {
        return <div>Loading...</div>;
    }

    if (!isAuthorized) {
        return (
            <Redirect
                to={{
                    pathname: '/api/login',
                    state: {
                        from: location
                    }
                }}
            />
        );
    }

    return (
        <div className="layout">
            <button type="button" onClick={logout}>
                Log out
            </button>
            <Switch>
                {/*<Route path={`${match.url}/profile/:userId`} exact component={Profile}/>*/}
                <Route component={Dashboard} />
            </Switch>
        </div>
    );
};

export default withAuthGate({sdk, ensure: true})(LoggedInWrapper);
```

And the actual proteceted page:

```js
// Dashboard.js
import React from 'react';
import {sdk} from './lib';

export default class Dashboard extends React.Component {
    constructor(props) {
        super(props);
        this.state = {user: null, error: null};
    }

    async componentWillMount() {
        try {
            this.setState({
                // we can send requests here since we're guarded by LoggedInWrapper
                user: await (await sdk.get('/restapi/v1.0/account/~/extension/~')).json()
            });
        } catch (error) {
            this.setState({error});
        }
    }

    render() {
        const {error, user} = this.state;
        if (error) return <div>{error.message}</div>;
        if (!user) return <div>Loading</div>;
        return <pre>{JSON.stringify(user, null, 2)}</pre>;
    }
}
```