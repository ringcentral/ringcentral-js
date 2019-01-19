import React, {PureComponent} from 'react';
import {RouteComponentProps} from 'react-router-dom';
import {withAuthGate, AuthGateRenderProps} from '@ringcentral/react';
import {sdk} from './lib';

interface OauthRedirectProps extends RouteComponentProps, AuthGateRenderProps {}

class OauthRedirect extends PureComponent<OauthRedirectProps> {
    public async componentDidMount() {
        const {
            location: {hash},
            parseRedirect,
        } = this.props;
        await parseRedirect(hash);
    }

    public render() {
        return <div>Redirecting...</div>;
    }
}

export default withAuthGate({sdk})(OauthRedirect);
