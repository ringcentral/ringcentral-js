import {SDK} from '@ringcentral/sdk';
import {combineReducers, Store} from 'redux';

import Actions, {ActionsOptions} from './actions';
import {status, error, loading} from './reducer';

export interface StoreConnectorOptions extends ActionsOptions {
    root?: string;
}

export default class StoreConnector {
    private sdk: SDK;

    private store: Store;

    public root: string;

    public actions: Actions;

    constructor({sdk, root = 'rcAuth'}: StoreConnectorOptions) {
        this.sdk = sdk;
        this.root = root;
        this.actions = new Actions({sdk});
    }

    connectToStore = async (store: Store) => {
        this.store = store;
        const {dispatch} = store;
        const platform = this.sdk.platform();

        platform.on(platform.events.loginError, e => dispatch(this.actions.authError(e)));
        platform.on(platform.events.refreshError, e => dispatch(this.actions.authError(e)));
        platform.on(platform.events.logoutError, e => dispatch(this.actions.authError(e)));

        platform.on(platform.events.loginSuccess, () => dispatch(this.actions.loginSuccess()));
        platform.on(platform.events.logoutSuccess, () => dispatch(this.actions.logoutSuccess()));

        try {
            if (await platform.auth().accessTokenValid()) {
                dispatch(this.actions.loginSuccess()); // manual dispatch
            } else {
                await platform.refresh();
            }
        } catch (e) {} // can be empty because error is caught by event listener
    };

    reducer = combineReducers({
        status,
        error,
        loading
    });

    getAuth = state => state[this.root];

    getAuthStatus = state => this.getAuth(state).status;

    getAuthError = state => this.getAuth(state).error;

    getAuthLoading = state => this.getAuth(state).loading;
}
