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
