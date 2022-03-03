import { PayloadAction } from '@reduxjs/toolkit';
import WalletConnect from '@walletconnect/client';

import { MAINNET } from '../../../lib/constants/networks';
import {
    RequestSessionPayload,
    IConnector,
} from '../../../lib/walletconnect/types';
import { EthereumWallet } from '../../model/wallet';
import {
    createWallet,
    createPendingSession,
    CHANGE_NETWORK,
    WalletPayloadAction,
    SEND_REQUEST_SESSION_WITH_DAPP,
    confirmRequestSession,
    DENY_REQUEST_SESSION_WITH_DAPP,
} from './actions';

const initialState: WalletState = {
    sessions: null,
    pendingRequest: null,
    connector: null,
    currentSessionApproved: false,
    walletInstance: null,
    currentNetworkChainId: MAINNET.chainID,
    loading: false,
    error: null,
};

export const walletReducer = (
    state = initialState,
    action: PayloadAction<WalletPayloadAction>,
): WalletState => {
    switch (action.type) {
        case createWallet.TRIGGER:
            return { ...state, loading: true };
        case createWallet.SUCCESS:
            return {
                ...state,
                walletInstance: action.payload,
            };
        case createWallet.FAILURE:
            return {
                ...state,
                error: action.payload,
            };
        case createWallet.FULFILL:
            return {
                ...state,
                loading: false,
            };
        case CHANGE_NETWORK:
            return {
                ...state,
                currentNetworkChainId: action.payload,
            };
        case createPendingSession.TRIGGER:
            return { ...state, loading: true };
        case createPendingSession.SUCCESS:
            return {
                ...state,
                connector: action.payload,
            };
        case createPendingSession.FAILURE:
            return {
                ...state,
                connector: null,
                error: action.payload,
            };
        case createPendingSession.FULFILL:
            return {
                ...state,
                loading: false,
            };
        case SEND_REQUEST_SESSION_WITH_DAPP:
            return {
                ...state,
                pendingRequest: action.payload,
            };
        case confirmRequestSession.TRIGGER:
            return {
                ...state,
                pendingRequest: null,
            };
        case confirmRequestSession.REQUEST:
            return {
                ...state,
                loading: true,
            };
        case confirmRequestSession.SUCCESS:
            return {
                ...state,
                sessions: {
                    ...state.sessions,
                    [action.payload.key]: action.payload.session,
                },
            };
        case confirmRequestSession.FAILURE:
            return {
                ...state,
                connector: null,
                error: action.payload,
            };
        case confirmRequestSession.FULFILL:
            return {
                ...state,
                loading: false,
            };
        case DENY_REQUEST_SESSION_WITH_DAPP:
            return {
                ...state,
                pendingRequest: null,
                currentSessionApproved: false,
                connector: null,
            };
        default:
            return state;
    }
};

export type WalletConnectSessions = {
    [peerId: string]: IConnector['session'];
}

export interface WalletState {
    sessions: WalletConnectSessions | null;
    pendingRequest: RequestSessionPayload | null;
    connector: WalletConnect | null;
    currentSessionApproved: boolean;
    walletInstance: EthereumWallet | null;
    currentNetworkChainId: number;
    loading: boolean;
    error: Error | null;
}

export default walletReducer;
