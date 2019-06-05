import React, {FunctionComponent} from 'react';
import {Redirect, Route, Switch, RouteComponentProps} from 'react-router-dom';
import {withAuthGate, AuthGateRenderProps} from '@ringcentral/react';
import Dashboard from './Dashboard';
import {sdk} from './lib';

interface LoggedInWrapperProps extends RouteComponentProps, AuthGateRenderProps {}

const LoggedInWrapper: FunctionComponent<LoggedInWrapperProps> = ({
    isAuthorized,
    authorizing,
    logout,
    match,
    location,
}) => {
    if (authorizing) {
        return <div>Loading...</div>;
    }

    if (!isAuthorized) {
        return (
            <Redirect
                to={{
                    pathname: '/api/login',
                    state: {
                        from: location,
                    },
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
