import React from 'react';
import {SDK} from '@ringcentral/sdk';

function getDisplayName(WrappedComponent) {
    return WrappedComponent.displayName || WrappedComponent.name || 'Component';
}

const delay = () => new Promise(res => setImmediate(res));

export interface AuthGateState {
    isAuthorized: boolean;
    authorizing: boolean;
    authError?: Error;
}

export interface AuthGateProps {
    sdk: SDK;
    ensure?: boolean;
    children?: any;
}

export class AuthGate extends React.Component<AuthGateProps, AuthGateState> {
    state = {
        isAuthorized: false,
        authorizing: true,
        authError: null
    };

    /**
     * purposely going through antipattern because we can't cancel promises for now
     * we still cancel subscriptions etc., but we can't guarantee when storage promises will resolve
     * @type {boolean}
     */
    mounted = false;

    async componentDidMount() {
        this.mounted = true;
        try {
            const {sdk, ensure} = this.props;
            const platform = sdk.platform();

            platform.on(platform.events.beforeRefresh, this.before);
            platform.on(platform.events.beforeLogin, this.before);
            platform.on(platform.events.refreshError, this.error);
            platform.on(platform.events.loginError, this.error);
            platform.on(platform.events.logoutSuccess, this.success);
            platform.on(platform.events.loginSuccess, this.success);
            platform.on(platform.events.refreshSuccess, this.success);

            if (ensure) {
                await platform.ensureLoggedIn();
            }

            await this.updateState();
        } catch (e) {
            await this.updateState(e);
        }
    }

    componentWillUnmount() {
        this.mounted = false;
        const {sdk} = this.props;
        const platform = sdk.platform();
        platform.removeListener(platform.events.beforeRefresh, this.before);
        platform.removeListener(platform.events.beforeLogin, this.before);
        platform.removeListener(platform.events.refreshError, this.error);
        platform.removeListener(platform.events.loginError, this.error);
        platform.removeListener(platform.events.logoutSuccess, this.success);
        platform.removeListener(platform.events.loginSuccess, this.success);
        platform.removeListener(platform.events.refreshSuccess, this.success);
    }

    before = () => this.mounted && this.setState({authorizing: true});

    error = async e => this.updateState(e);

    success = async () => this.updateState(null);

    loginUrl = options => this.props.sdk.platform().loginUrl(options);

    logout = async () => {
        const platform = this.props.sdk.platform();
        return platform.logout();
    };

    parseRedirect = async search => {
        try {
            const platform = this.props.sdk.platform();
            const loginOptions = platform.parseLoginRedirect(search);
            if (!loginOptions.code && !loginOptions.access_token) throw new Error('No authorization information');
            return platform.login(loginOptions);
        } catch (e) {
            await this.error(e);
            throw e;
        }
    };

    updateState = async (authError = null) => {
        await delay();
        this.mounted &&
            this.setState({
                isAuthorized: await this.props.sdk
                    .platform()
                    .auth()
                    .accessTokenValid(),
                authorizing: false,
                authError
            });
    };

    render() {
        const {sdk, ensure, children, ...props} = this.props;
        return children({
            ...this.state,
            ...props,
            loginUrl: this.loginUrl,
            parseRedirect: this.parseRedirect,
            logout: this.logout
        });
    }
}

export const withAuthGate = ({sdk, ensure = false}: {sdk: SDK; ensure?: boolean}) => Cmp => {
    const WrappedCmp = props => (
        <AuthGate sdk={sdk} ensure={ensure}>
            {renderProps => <Cmp {...props} {...renderProps} />}
        </AuthGate>
    );
    WrappedCmp.displayName = `withAuthGate(${getDisplayName(Cmp)})`;
    return WrappedCmp;
};
