import React from 'react';
import {SDK} from '@ringcentral/sdk';

interface AuthGateState {
    isAuthorized: boolean;
    authorizing: boolean;
    authError?: Error;
}

export default ({sdk, ensure = false}: {sdk: SDK; ensure: boolean}) => Cmp => {
    const platform = sdk.platform();

    return class extends React.Component<any, AuthGateState> {
        state = {
            isAuthorized: false,
            authorizing: true,
            authError: null
        };

        async componentWillMount() {
            try {
                this.before();
                this.setState({
                    isAuthorized: await platform.auth().accessTokenValid()
                });

                platform.on(platform.events.beforeRefresh, this.before);
                platform.on(platform.events.beforeLogin, this.before);
                platform.on(platform.events.refreshError, this.error);
                platform.on(platform.events.loginError, this.error);
                platform.on(platform.events.logoutSuccess, this.success);
                platform.on(platform.events.loginSuccess, this.success);
                platform.on(platform.events.refreshSuccess, this.success);

                if (ensure) await platform.ensureLoggedIn();

                await this.updateState();
            } catch (e) {
                await this.updateState(e);
            }
        }

        componentWillUnmount() {
            platform.removeListener(platform.events.beforeRefresh, this.before);
            platform.removeListener(platform.events.beforeLogin, this.before);
            platform.removeListener(platform.events.refreshError, this.error);
            platform.removeListener(platform.events.loginError, this.error);
            platform.removeListener(platform.events.logoutSuccess, this.success);
            platform.removeListener(platform.events.loginSuccess, this.success);
            platform.removeListener(platform.events.refreshSuccess, this.success);
        }

        before() {
            return this.setState({authorizing: true});
        }

        async error(e) {
            return this.updateState(e);
        }

        async success() {
            return this.updateState(null);
        }

        loginUrl = async options => {
            return platform.loginUrl(options);
        };

        logout = async () => {
            return platform.logout();
        };

        async parseRedirect(search) {
            try {
                const loginOptions = platform.parseLoginRedirect(search);
                if (!loginOptions.code && !loginOptions.access_token) throw new Error('No authorization information');
                return platform.login(loginOptions);
            } catch (e) {
                this.error(e);
                throw e;
            }
        }

        async updateState(authError = null) {
            return this.setState({
                isAuthorized: await platform.auth().accessTokenValid(),
                authorizing: false,
                authError
            });
        }

        render() {
            return (
                <Cmp
                    {...this.state}
                    {...this.props}
                    loginUrl={this.loginUrl}
                    parseRedirect={this.parseRedirect}
                    logout={this.logout}
                />
            );
        }
    };
};
