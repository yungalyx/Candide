import { createRoutine } from 'redux-saga-routines';
import { AnyAssetAmount } from '../../../lib/assets';

// export const AppendBalance = createRoutine('APPEND_BALANCE');

export const APPEND_BALANCE = 'APPEND_BALANCE';

export const AppendBalance = (obj: AnyAssetAmount): BalanceActionType => ({
    payload: obj,
    type: APPEND_BALANCE
})

type BalanceActionType = {
    payload: AnyAssetAmount;
    type: typeof APPEND_BALANCE;
};

