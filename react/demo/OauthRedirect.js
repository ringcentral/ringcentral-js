import React from 'react';
import {withAuthGate} from '../lib'; // change to @ringcentral/react
import {sdk} from './lib';

class OauthRedirect extends React.PureComponent {
    async componentDidMount() {
        const {
            location: {hash},
            parseRedirect
        } = this.props;
        await parseRedirect(hash);
    }

    render() {
        return <div>Redirecting...</div>;
    }
}

export default withAuthGate({sdk})(OauthRedirect);
