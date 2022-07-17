import { PayloadAction } from '@reduxjs/toolkit';
import { AnyAssetAmount } from '../../../lib/assets';
import { ETH, MATIC } from '../../../lib/constants/currencies';


const initialState: AssetState = {
    assets: [
        {
            asset: ETH,
            amount: 0,
        },
        {
            asset: MATIC,
            amount: 2
        }
    ],
    loading: false,
    error: null,
};

export const balanceReducer = (
    state = initialState,
    action: PayloadAction<AnyAssetAmount & Error>,
): AssetState => {
    switch (action.type) {
        case 'APPEND_BALANCE':
            return {
                ...state,
                assets: [...state.assets, action.payload]
            };
        default:
            return state;
    }
};

export type AssetState = {
    assets: AnyAssetAmount[];
    loading: boolean;
    error: Error | null;
}

export default balanceReducer;