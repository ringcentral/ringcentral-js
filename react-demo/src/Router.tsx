import React from 'react';
import {BrowserRouter, Redirect, Route, Switch} from 'react-router-dom';
import LoggedInWrapper from './LoggedInWrapper';
import LoggedOutWrapper from './LoggedOutWrapper';

const Router = () => (
    <BrowserRouter>
        <Switch>
            <Route path="/app" component={LoggedInWrapper} />
            <Route path="/api" component={LoggedOutWrapper} />
            <Redirect from="/" to="/app" />
        </Switch>
    </BrowserRouter>
);

export default Router;
