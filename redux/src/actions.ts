import {SDK} from '@ringcentral/sdk';
import {AUTH_ERROR, LOGIN, LOGIN_SUCCESS, LOGOUT, LOGOUT_SUCCESS} from './constants';

export interface ActionsOptions {
    sdk: SDK;
}

export default class Actions {
    sdk: SDK;

    constructor({sdk}: ActionsOptions) {
        this.sdk = sdk;
    }

    login = query => {
        if (query.error_description) return this.authError(new Error(query.error_description));
        this.sdk.login(query); // we ignore promise result because we listen to all events already
        return {type: LOGIN};
    };

    logout = () => {
        this.sdk.logout(); // we ignore promise result because we listen to all events already
        return {type: LOGOUT};
    };

    loginSuccess = () => ({
        type: LOGIN_SUCCESS
    });

    authError = error => ({
        type: AUTH_ERROR,
        payload: error,
        error: true
    });

    logoutSuccess = () => ({
        type: LOGOUT_SUCCESS
    });
}
