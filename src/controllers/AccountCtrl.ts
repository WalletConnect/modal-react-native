import { proxy } from 'valtio';

import { ClientCtrl } from './ClientCtrl';

// -- Types --------------------------------------------- //
export interface AccountCtrlState {
  address?: string;
  isConnected: boolean;
}

// -- State --------------------------------------------- //
const state = proxy<AccountCtrlState>({
  address: undefined,
  isConnected: false,
});

// -- Controller ---------------------------------------- //
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
