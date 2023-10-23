import React, {Component} from 'react';

import {SDK} from '@ringcentral/sdk';

function getDisplayName(WrappedComponent) {
    return WrappedComponent.displayName || WrappedComponent.name || 'Component';
}

const delay = () => new Promise(res => setImmediate(res));

export interface AuthGateState {
    isAuthorized: boolean;
    authorizing: boolean;
    authError: null | Error;
}

export interface AuthGateRenderProps extends AuthGateState {
    loginUrl: (options: any) => string;
    parseRedirect: (search: string) => Promise<any>;
    logout: () => Promise<any>;
}

export interface AuthGateProps {
    sdk: SDK;
    ensure?: boolean;
    children: (props: AuthGateRenderProps) => any;
}

export class AuthGate extends Component<AuthGateProps, AuthGateState> {
    public state = {
        isAuthorized: false,
        authorizing: true,
        authError: null,
    };

    // default props
    public static defaultProps = {
        ensure: false,
    };

    /**
     * purposely going through antipattern because we can't cancel promises for now
     * we still cancel subscriptions etc., but we can't guarantee when storage promises will resolve
     * @type {boolean}
     */
    public mounted = false;

    public async componentDidMount() {
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

    public componentWillUnmount() {
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

    public before = () => this.mounted && this.setState({authorizing: true});

    public error = async e => this.updateState(e);

    public success = async () => this.updateState(null);

    public loginUrl = options => this.props.sdk.platform().loginUrl(options);

    public logout = async () => {
        const platform = this.props.sdk.platform();
        return platform.logout();
    };

    public parseRedirect = async search => {
        try {
            const platform = this.props.sdk.platform();
            const loginOptions = platform.parseLoginRedirect(search);
            if (!loginOptions.code && !loginOptions.access_token) {throw new Error('No authorization information');}
            return platform.login(loginOptions);
        } catch (e) {
            await this.error(e);
            throw e;
        }
    };

    public updateState = async (authError = null) => {
        await delay();
        this.mounted &&
            this.setState({
                isAuthorized: await this.props.sdk
                    .platform()
                    .auth()
                    .accessTokenValid(),
                authorizing: false,
                authError,
            });
    };

    public render() {
        const {sdk, ensure, children, ...props} = this.props;
        return children({
            ...this.state,
            ...props,
            loginUrl: this.loginUrl,
            parseRedirect: this.parseRedirect,
            logout: this.logout,
        });
    }
}

//TODO Definition
export const withAuthGate = ({sdk, ensure = false}: {sdk: SDK; ensure?: boolean}) => Cmp => {
    const WrappedCmp = props => (
        <AuthGate sdk={sdk} ensure={ensure}>
            {renderProps => <Cmp {...props} {...renderProps} />}
        </AuthGate>
    );
    WrappedCmp.displayName = `withAuthGate(${getDisplayName(Cmp)})`;
    return WrappedCmp;
};
