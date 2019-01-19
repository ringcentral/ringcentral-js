import React from 'react';
import {Provider} from 'react-redux';
import {BrowserRouter, Route, Switch} from 'react-router-dom';
import AuthGate from '@ringcentral/redux/lib/AuthGate';
import {redirectPath, authenticated, notAuthenticated} from './lib';

import Index from './pages/Index';
import Login from './pages/Login';

const Router = ({store, storeConnector}: any) => (
    <Provider store={store}>
        <AuthGate storeConnector={storeConnector}>
            {({loading}) =>
                loading ? (
                    <div>Loading auth...</div>
                ) : (
                    <BrowserRouter>
                        <Switch>
                            <Route path="/" exact component={authenticated(Index)} />
                            <Route path={redirectPath} exact component={notAuthenticated(Login)} />
                        </Switch>
                    </BrowserRouter>
                )
            }
        </AuthGate>
    </Provider>
);

export default Router;
