import {AUTH_ERROR, LOGIN_SUCCESS, LOGOUT_SUCCESS} from './constants';

export const status = (state = false, {type}) => {
    switch (type) {
        case LOGIN_SUCCESS:
            return true;
        case AUTH_ERROR:
        case LOGOUT_SUCCESS:
            return false;
        default:
            return state;
    }
};

export const error = (state = null, {type, payload}) => {
    switch (type) {
        case LOGIN_SUCCESS:
        case LOGOUT_SUCCESS:
            return null;
        case AUTH_ERROR:
            return payload;
        default:
            return state;
    }
};

export const loading = (state = true, {type}) => {
    switch (type) {
        case LOGIN_SUCCESS:
        case AUTH_ERROR:
            return false;
        default:
            return state;
    }
};
