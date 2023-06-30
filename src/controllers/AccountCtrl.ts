import { proxy } from 'valtio';

import type { AccountCtrlState } from '../types/controllerTypes';
import { ClientCtrl } from './ClientCtrl';

// -- initial state ------------------------------------------------ //
const state = proxy<AccountCtrlState>({
  address: undefined,
  isConnected: false,
});

// -- controller --------------------------------------------------- //
export const AccountCtrl = {
  state,

  async getAccount() {
    const provider = ClientCtrl.state.provider;
    const accounts: string[] | undefined = await provider?.request({
      method: 'eth_accounts',
    });

    if (accounts) {
      state.address = accounts[0];
      state.isConnected = true;
    }
  },

  setAddress(address: AccountCtrlState['address']) {
    state.address = address;
  },

  setIsConnected(isConnected: AccountCtrlState['isConnected']) {
    state.isConnected = isConnected;
  },

  resetAccount() {
    state.address = undefined;
    state.isConnected = false;
  },
};
