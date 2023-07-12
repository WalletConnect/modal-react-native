import { proxy } from 'valtio';

import type { ConfigCtrlState } from '../types/controllerTypes';

// -- initial state ------------------------------------------------ //
const state = proxy<ConfigCtrlState>({
  projectId: '',
  sessionParams: undefined,
  recentWalletDeepLink: undefined,
  providerMetadata: undefined,
  explorerRecommendedWalletIds: undefined,
  explorerExcludedWalletIds: undefined,
});

// -- controller --------------------------------------------------- //
export const ConfigCtrl = {
  state,

  setRecentWalletDeepLink(deepLink?: string) {
    state.recentWalletDeepLink = deepLink;
  },

  getRecentWalletDeepLink() {
    return state.recentWalletDeepLink;
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

  resetConfig() {
    state.recentWalletDeepLink = undefined;
  },
};
