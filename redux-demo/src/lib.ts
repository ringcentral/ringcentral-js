import {createLogger} from 'redux-logger';
import {applyMiddleware, createStore as createReduxStore, combineReducers, Store} from 'redux';
import locationHelperBuilder from 'redux-auth-wrapper/history4/locationHelper';
import {connectedRouterRedirect} from 'redux-auth-wrapper/history4/redirect';
import SDK from '@ringcentral/sdk';
import StoreConnector from '@ringcentral/redux';
import {version} from '../package.json';

const locationHelper = locationHelperBuilder({});

export const redirectPath = '/api/oauth2Callback';

export const redirectUri = window.location.origin + redirectPath;

export const sdk = new SDK({
    appName: 'ReduxDemo',
    appVersion: version,
    server: process.env.REACT_APP_API_SERVER,
    clientId: process.env.REACT_APP_API_CLIENT_ID,
    redirectUri,
});

export const storeConnector = new StoreConnector({sdk});

export const createStore = () => {
    const store = createReduxStore(
        combineReducers({
            [storeConnector.root]: storeConnector.reducer,
        }),
        undefined,
        applyMiddleware(
            createLogger({
                level: process.env.NODE_ENV !== 'production' ? 'log' : 'error',
                collapsed: (getState, action, logEntry) => !logEntry.error,
                diff: true,
            }),
        ),
    );

    storeConnector.connectToStore(store);

    return store;
};

export const openLogin = pathname => window.location.assign(sdk.loginUrl({state: pathname, implicit: true}));

export const authenticated = connectedRouterRedirect({
    redirectPath,
    authenticatedSelector: storeConnector.getAuthStatus,
    wrapperDisplayName: 'UserIsAuthenticated',
});

export const notAuthenticated = connectedRouterRedirect({
    redirectPath: (state, ownProps) => {
        const {location: {search = '', hash = ''} = {}} = ownProps;
        const query = search ? sdk.parseLoginRedirect(search || hash) : {state: '/'};
        return query.state || locationHelper.getRedirectQueryParam(ownProps) || '/';
    },
    allowRedirectBack: false,
    authenticatedSelector: state => !storeConnector.getAuthStatus(state),
    wrapperDisplayName: 'UserIsNotAuthenticated',
});
