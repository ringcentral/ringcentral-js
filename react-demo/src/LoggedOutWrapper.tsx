import React, {FunctionComponent} from 'react';
import {Redirect, Route, Switch, RouteComponentProps} from 'react-router-dom';
import {withAuthGate, AuthGateRenderProps} from '@ringcentral/react';
import OauthRedirect from './OauthRedirect';
import Login from './Login';
import {sdk} from './lib';

interface LoggedOutWrapperProps extends RouteComponentProps, AuthGateRenderProps {}

const LoggedOutWrapper: FunctionComponent<LoggedOutWrapperProps> = ({
    isAuthorized,
    authorizing,
    authError,
    match,
    location,
}) => {
    if (authorizing) {
        return <div>Loading</div>;
    }

    if (isAuthorized) {
        const {from} = (location.state as any) || {from: {pathname: '/'}};
        console.log('Redirecting to', from); //eslint-disable-line
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
