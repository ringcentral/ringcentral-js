import React, {Component} from 'react';
import {sdk} from './lib';

export interface DashboardState {
    user?: any;
    error?: any;
}

export default class Dashboard extends Component<any, DashboardState> {
    public state = {user: null, error: null};

    public async componentWillMount() {
        try {
            this.setState({
                // we can send requests here since we're guarded by LoggedInWrapper
                user: await (await sdk.get('/restapi/v1.0/account/~/extension/~')).json(),
            });
        } catch (error) {
            this.setState({error});
        }
    }

    public render() {
        const {error, user} = this.state;
        if (error) return <div>{error}</div>;
        if (!user) return <div>Loading</div>;
        return <pre>{JSON.stringify(user, null, 2)}</pre>;
    }
}
