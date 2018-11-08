import React from 'react';
import {BrowserRouter as Router, Redirect, Route, Switch} from 'react-router-dom';
import LoggedInWrapper from './LoggedInWrapper';
import LoggedOutWrapper from './LoggedOutWrapper';

export default () => (
    <Router>
        <Switch>
            <Route path="/app" component={LoggedInWrapper} />
            <Route path="/api" component={LoggedOutWrapper} />
            <Redirect from="/" to="/app" />
        </Switch>
    </Router>
);
