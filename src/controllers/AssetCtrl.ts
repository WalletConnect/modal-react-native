import { proxy } from 'valtio';

// -- Types --------------------------------------------- //
export interface AssetCtrlState {
  walletImages: Record<string, string>;
}

// -- State --------------------------------------------- //
const state = proxy<AssetCtrlState>({
  walletImages: {},
});

// -- Controller ---------------------------------------- //
export const AssetCtrl = {
  state,

  setWalletImage(key: string, value: string) {
    state.walletImages[key] = value;
  },
};
