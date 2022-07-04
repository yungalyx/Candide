/* eslint-disable max-len */
import axios from 'axios';

import { HexString } from '../accounts';
import { getEthereumNetwork } from '../helpers';
import {
    ZapperResponse,
    ZapperAccountAddress,
} from './types';

const ZAPPER_PUBLIC_API_KEY = '96e0cc51-a62e-42ca-acee-910ea7d2a241';
const ZAPPER_PUBLIC_API_URL = 'https://api.zapper.fi/v1/';
const ZAPPER_PUBLIC_API_URL_V2 = 'https://api.zapper.fi/v2/';

const inst = axios.create({
    baseURL: ZAPPER_PUBLIC_API_URL,
    timeout: 5000,
});

/**
 * Get balances for a given address and network using zapper public API
 * @param address
 * @param network
 * @returns {Promise<{ contractAddress: string; amount: number }[]>} TokenBalance for the given addresse
 */
export async function getBalances(accountAddress: HexString, chainId: number): Promise<{ contractAddress: string; amount: number }[]> {
    const zapperEvmNetworkName = getEthereumNetwork(chainId).name.toLowerCase();
    const response: ZapperResponse<ZapperAccountAddress> = await inst.get(
        `protocols/tokens/balances?addresses[]=${accountAddress}&network=${zapperEvmNetworkName}&api_key=${ZAPPER_PUBLIC_API_KEY}`,
    );

    // for now, we will only accept one address to fetch at a time
    const zapperAccountAddress = response.data[accountAddress.toLowerCase()];

    if (zapperAccountAddress) {
        if (Object.keys(zapperAccountAddress.products).length) {
            const { assets } = zapperAccountAddress.products[0];

            // map each contract asset with its balance to return an array of object with the following structure:
            // { contractAddress: string, amount: number }
            return assets.map(({ address, balance }) => ({
                contractAddress: address,
                amount: balance,
            }));
        }
    }

    return [];
}

/**
 * Get balances for a given address and network using Zapper's new v2 api
 * TODO: change this to support multiple networks and addresses
 * @param address
 * @param network
 * @returns {Promise<{ contractAddress: string; amount: number }[]>} TokenBalance for the given addresse
 */
export async function getBalancesV2(address, network) {

    const evtSource = new EventSource(ZAPPER_PUBLIC_API_URL_V2 + `balances?networks[]=ethereum&addresses[]=0xf2DAf90Dd0Cf2EB5e095775630F0F6F3f8A2b463&useNewBalancesFormat=true&bundled=false&api_key=5f977ae3-8998-47f6-aa45-eefacd7f9f6e`, )

    evtSource.addEventListener('balance', function(e) {
        console.log(JSON.parse(e.data))
    })

    evtSource.addEventListener('end', function(e) {
        evtSource.close()
    })

    // const response = await instV2.get(`balances?addresses[]=0xf2DAf90Dd0Cf2EB5e095775630F0F6F3f8A2b463&networks[]=ethereum&bundled=true&api_key=5f977ae3-8998-47f6-aa45-eefacd7f9f6e`);
    // const stream = await response.data;
    //console.log(stream)

  
}
