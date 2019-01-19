import {connect} from 'react-redux';
import StoreConnector from './index';

interface LoginGateProps {
    storeConnector: StoreConnector;
    children: any;
}

const AuthGate = ({loading, error, status, children}) => children({loading, error, status});

// import {SFC} from 'react';
// const ConnectedLoginGate: SFC<LoginGateProps> = connect((state, {storeConnector}) => ({

const ConnectedAuthGate = connect((state, {storeConnector}: LoginGateProps) => ({
    loading: storeConnector.getAuthLoading(state),
    error: storeConnector.getAuthError(state),
    status: storeConnector.getAuthStatus(state),
}))(AuthGate);

export default ConnectedAuthGate;
