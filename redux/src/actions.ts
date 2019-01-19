import {SDK} from '@ringcentral/sdk';
import {AUTH_ERROR, LOGIN, LOGIN_SUCCESS, LOGOUT, LOGOUT_SUCCESS} from './constants';

export interface ActionsOptions {
    sdk: SDK;
}

export default class Actions {
    public sdk: SDK;

    public constructor({sdk}: ActionsOptions) {
        this.sdk = sdk;
    }

    public login = query => {
        if (query.error_description) return this.authError(new Error(query.error_description));
        this.sdk.login(query); // we ignore promise result because we listen to all events already
        return {type: LOGIN};
    };

    public logout = () => {
        this.sdk.logout(); // we ignore promise result because we listen to all events already
        return {type: LOGOUT};
    };

    public loginSuccess = () => ({
        type: LOGIN_SUCCESS,
    });

    public authError = error => ({
        type: AUTH_ERROR,
        payload: error,
        error: true,
    });

    public logoutSuccess = () => ({
        type: LOGOUT_SUCCESS,
    });
}
