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

  async getRecommendedWallets() {
    const { explorerRecommendedWalletIds, explorerExcludedWalletIds } =
      ConfigCtrl.state;

    // Don't fetch recomended wallets
    if (
      explorerRecommendedWalletIds === 'NONE' ||
      (explorerExcludedWalletIds === 'ALL' && !explorerRecommendedWalletIds)
    ) {
      return state.recommendedWallets;
    }

    // Fetch only recomended wallets defined in config
    if (CoreUtil.isArray(explorerRecommendedWalletIds)) {
      const recommendedIds = explorerRecommendedWalletIds.join(',');
      const params = { recommendedIds };
      const { listings } = await ExplorerUtil.getListings(params);
      const listingsArr = Object.values(listings);
      listingsArr.sort((a, b) => {
        const aIndex = explorerRecommendedWalletIds.indexOf(a.id);
        const bIndex = explorerRecommendedWalletIds.indexOf(b.id);

        return aIndex - bIndex;
      });
      state.recommendedWallets = listingsArr;
    }

    // Fetch default recomended wallets based on user's device and excluded config
    else {
      const isExcluded = CoreUtil.isArray(explorerExcludedWalletIds);
      const params = {
        page: 1,
        entries: CoreUtil.RECOMMENDED_WALLET_AMOUNT,
        excludedIds: isExcluded
          ? explorerExcludedWalletIds.join(',')
          : undefined,
      };
      const { listings } = await ExplorerUtil.getListings(params);
      state.recommendedWallets = Object.values(listings);
    }

    return state.recommendedWallets;
  },

  async getWallets(params?: ListingParams) {
    const extendedParams: ListingParams = { ...params };
    const { explorerRecommendedWalletIds, explorerExcludedWalletIds } =
      ConfigCtrl.state;
    const { recommendedWallets } = state;

    // Don't fetch any wallets if all are excluded
    if (explorerExcludedWalletIds === 'ALL') {
      return state.wallets;
    }

    // Don't fetch recommended wallets, as we already have these
    if (recommendedWallets.length) {
      extendedParams.excludedIds = recommendedWallets
        .map((wallet) => wallet.id)
        .join(',');
    } else if (CoreUtil.isArray(explorerRecommendedWalletIds)) {
      extendedParams.excludedIds = explorerRecommendedWalletIds.join(',');
    }

    // Don't fetch user defined excluded wallets
    if (CoreUtil.isArray(explorerExcludedWalletIds)) {
      extendedParams.excludedIds = [
        extendedParams.excludedIds,
        explorerExcludedWalletIds,
      ]
        .filter(Boolean)
        .join(',');
    }

    const { listings, total } = await ExplorerUtil.getListings(extendedParams);
    const _listings = Object.values(listings);
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
