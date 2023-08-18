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

    // Don't fetch any wallets if explorer is disabled or if they are all excluded
    if (
      explorerRecommendedWalletIds === 'NONE' ||
      (explorerExcludedWalletIds === 'ALL' &&
        !CoreUtil.isArray(explorerRecommendedWalletIds))
    ) {
      return state.wallets;
    }

    // Fetch only user recommended wallets if the rest is excluded
    if (
      explorerExcludedWalletIds === 'ALL' &&
      CoreUtil.isArray(explorerRecommendedWalletIds)
    ) {
      extendedParams.recommendedIds = explorerRecommendedWalletIds.join(',');
    }

    // Don't fetch user defined excluded wallets
    if (CoreUtil.isArray(explorerExcludedWalletIds)) {
      extendedParams.excludedIds = explorerExcludedWalletIds.join(',');
    }

    const { listings, total } = await ExplorerUtil.getListings(extendedParams);
    let _listings = Object.values(listings);

    // Sort by explorerRecommendedWalletIds
    if (CoreUtil.isArray(explorerRecommendedWalletIds)) {
      _listings.sort((a, b) => {
        const aIndex = explorerRecommendedWalletIds.indexOf(a.id);
        const bIndex = explorerRecommendedWalletIds.indexOf(b.id);

        // Don't sort if both wallets are not recommended
        if (aIndex === -1 && bIndex === -1) return 0;

        // if a is not recommended, b is first
        if (aIndex === -1) return 1;

        // if b is not recommended, a is first
        if (bIndex === -1) return -1;

        return aIndex - bIndex;
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

    // Prefetch some wallet images
    ExplorerUtil.prefetchWalletImages(_listings.slice(0, 20));

    state.wallets = { listings: _listings, page: 1, total };
    return _listings;
  },

  getWalletImageUrl(imageId: string) {
    return ExplorerUtil.getWalletImageUrl(imageId);
  },
};
