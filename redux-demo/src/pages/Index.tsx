import React, {Component} from 'react';
import {connect} from 'react-redux';
import {sdk, storeConnector} from '../lib';

const {logout} = storeConnector.actions;

export interface IndexState {
    user: any;
    error: any;
}

class Index extends Component<any, IndexState> {
    public constructor(props) {
        super(props);
        this.state = {user: null, error: null};
    }

    /**
     * Here we can make an authorized request since this page is opened only when user is authorized
     * This can be wrapped in Redux Action
     */
    public async componentDidMount() {
        try {
            const user = await (await sdk.get('/restapi/v1.0/account/~/extension/~')).json();
            this.setState({user});
        } catch (error) {
            this.setState({error});
        }
    }

    public render() {
        const {error, user} = this.state;

        if (error) {return <div>Error: {error.toString()}</div>;}

        if (!user) {return <div>Loading...</div>;}

        return (
            <div>
                <h1>Logged in as {user.name}</h1>
                <button type="button" onClick={e => logout()}>
                    Logout
                </button>
            </div>
        );
    }
}

export default connect(
    null,
    {logout},
)(Index);
