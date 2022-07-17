import { useEffect } from 'react';
import { getBalancesV2 } from '../../../../lib/zapper';

import { ListGroup } from '../../../components';
import {
    useAppDispatch,
    useAppSelector,
} from '../../../store';
import { getAssets } from '../../../store/assets/actions';
import { useWalletProvider } from '../../../store/hooks';
import AssetItem from './AssetItem';

const AssetsList = (): React.ReactElement => {
    const dispatch = useAppDispatch();
    const provider = useWalletProvider();
    const address = useAppSelector((state) => state.wallet.walletInstance?.address || '');
    const walletChainId = useAppSelector((state) => state.wallet.walletChainId);
    // useEffect(() => {
    //     if (provider && address) {
    //         dispatch(getAssets({ alchemyProvider: provider, address }));
    //     }
    // }, [provider, address]);

    useEffect(() => {
        getBalancesV2(address, walletChainId)
    }, [provider, address])

    //const assetsList = useAppSelector((state) => state.assets.assets);
    const balances = useAppSelector((state) => state.balances.assets);
 
    return (
        <ListGroup>
            {balances.map((assetAmount) => (
                <AssetItem
                    key={assetAmount.asset.symbol}
                    assetItem={assetAmount} />
            ))} 
        </ListGroup>
    );
};

export default AssetsList;
