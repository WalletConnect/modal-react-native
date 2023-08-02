import { proxy } from 'valtio';

import type {
  ExplorerCtrlState,
  ListingParams,
} from '../types/controllerTypes';
import { ExplorerUtil } from '../utils/ExplorerUtil';
import { CoreUtil } from '../utils/CoreUtil';
import { ConfigCtrl } from './ConfigCtrl';

// -- initial state ------------------------------------------------ //
const state = proxy<ExplorerCtrlState>({
  wallets: { listings: [], total: 0, page: 1 },
  recommendedWallets: [],
});

// -- controller --------------------------------------------------- //
export const ExplorerCtrl = {
  state,

  async getWallets(params?: ListingParams) {
    const extendedParams: ListingParams = { ...params };
    const { explorerRecommendedWalletIds, explorerExcludedWalletIds } =
      ConfigCtrl.state;

    // Don't fetch any wallets if all are excluded
    if (explorerExcludedWalletIds === 'ALL') {
      return state.wallets;
    }

    // Don't fetch user defined excluded wallets
    if (CoreUtil.isArray(explorerExcludedWalletIds)) {
      extendedParams.excludedIds = explorerExcludedWalletIds.join(',');
    }

    const { listings, total } = await ExplorerUtil.getListings(extendedParams);

    // Sort by explorerRecommendedWalletIds
    let _listings = Object.values(listings);
    if (CoreUtil.isArray(explorerRecommendedWalletIds)) {
      _listings.sort((a, b) => {
        const aRecommended = explorerRecommendedWalletIds.includes(a.id);
        const bRecommended = explorerRecommendedWalletIds.includes(b.id);

        if (aRecommended && bRecommended) return 0;
        if (aRecommended) return -1;
        if (bRecommended) return 1;
        return 0;
      });
    }

    // Sort by installed wallets
    _listings = await ExplorerUtil.sortInstalled(_listings);

    // Set recommended wallets
    if (CoreUtil.isArray(explorerRecommendedWalletIds)) {
      state.recommendedWallets = _listings
        .filter((wallet) => explorerRecommendedWalletIds.includes(wallet.id))
        .slice(0, 11);
    } else {
      state.recommendedWallets = _listings.slice(0, 11);
    }

    state.wallets = { listings: _listings, page: 1, total };
    return _listings;
  },

  getWalletImageUrl(imageId: string) {
    return ExplorerUtil.getWalletImageUrl(imageId);
  },

  getAssetImageUrl(imageId: string) {
    return ExplorerUtil.getAssetImageUrl(imageId);
  },
};
