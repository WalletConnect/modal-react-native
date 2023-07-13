import { proxy } from 'valtio';

import type { ConfigCtrlState, Listing } from '../types/controllerTypes';
import { StorageUtil } from '../utils/StorageUtil';

// -- initial state ------------------------------------------------ //
const state = proxy<ConfigCtrlState>({
  projectId: '',
  sessionParams: undefined,
  recentWallet: undefined,
  providerMetadata: undefined,
  explorerRecommendedWalletIds: undefined,
  explorerExcludedWalletIds: undefined,
});

// -- controller --------------------------------------------------- //
export const ConfigCtrl = {
  state,

  setRecentWallet(wallet?: Listing) {
    state.recentWallet = wallet;
  },

  getRecentWallet() {
    return state.recentWallet;
  },

  getMetadata() {
    if (!state.providerMetadata) {
      throw new Error('Metadata not set');
    }
    return state.providerMetadata;
  },

  setConfig(config: Partial<ConfigCtrlState>) {
    const { projectId, providerMetadata, sessionParams } = config;
    if (projectId && projectId !== state.projectId) {
      state.projectId = projectId;
    }

    if (providerMetadata && state.providerMetadata !== providerMetadata) {
      state.providerMetadata = providerMetadata;
    }

    if (sessionParams && sessionParams !== state.sessionParams) {
      state.sessionParams = sessionParams;
    }

    state.explorerRecommendedWalletIds = config.explorerRecommendedWalletIds;
    state.explorerExcludedWalletIds = config.explorerExcludedWalletIds;
  },

  async loadRecentWallet() {
    state.recentWallet = await StorageUtil.getRecentWallet();
  },
};
