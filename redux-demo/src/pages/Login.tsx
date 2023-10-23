import React, {FunctionComponent} from 'react';
import {withRouter, RouteComponentProps} from 'react-router-dom';
import {connect} from 'react-redux';
import {sdk, storeConnector, openLogin} from '../lib';

const {login} = storeConnector.actions;

export interface LoginProps extends RouteComponentProps {
    error: null | Error;
}

const Login: FunctionComponent<LoginProps> = ({error, location: {pathname, search, hash}}) => {
    const query = sdk.parseLoginRedirect(search || hash);

    // code is defined in redirect from OAuth
    if (query.code || query.access_token) {
        console.log(query); //eslint-disable-line
        login(query); // actually it's async, but it does not matter since we listen to everything
    }

    return (
        <div>
            {error && <div style={{color: 'red'}}>Cannot login: {error.toString()}</div>}
            <button type="button" onClick={e => openLogin(query.redirect)}>
                Login to RingCentral
            </button>
        </div>
    );
};

export default withRouter(
    connect(
        state => ({
            error: storeConnector.getAuthError(state),
        }),
        {
            login,
        },
    )(Login),
);
