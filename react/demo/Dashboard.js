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
