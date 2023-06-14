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

  async getRecomendedWallets() {
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
      const params = { recommendedIds, version: 2 };
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
        version: 2,
        excludedIds: isExcluded
          ? explorerExcludedWalletIds.join(',')
          : undefined,
      };
      const { listings } = await ExplorerUtil.getListings(params);
      state.recommendedWallets = Object.values(listings);
    }

    return state.recommendedWallets;
  },

  async getMobileWallets(params: ListingParams) {
    const { listings, total } = await ExplorerUtil.getListings(params);
    state.wallets = { listings: Object.values(listings), page: 1, total };
  },

  getWalletImageUrl(imageId: string) {
    return ExplorerUtil.getWalletImageUrl(imageId);
  },

  getAssetImageUrl(imageId: string) {
    return ExplorerUtil.getAssetImageUrl(imageId);
  },
};
