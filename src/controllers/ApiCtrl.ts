import { Platform } from 'react-native';
import { subscribeKey as subKey } from 'valtio/utils';
import { proxy } from 'valtio/vanilla';
import { CoreHelperUtil } from '../utils/CoreHelperUtil';
import { FetchUtil } from '../utils/FetchUtil';
import { StorageUtil } from '../utils/StorageUtil';
import type {
  ApiGetDataWalletsResponse,
  ApiGetWalletsRequest,
  ApiGetWalletsResponse,
  WcWallet,
} from '../types/controllerTypes';
import { ConfigCtrl } from './ConfigCtrl';
import { AssetCtrl } from './AssetCtrl';
import { SDK_VERSION } from '../constants/Config';

// -- Helpers ------------------------------------------- //
const baseUrl = CoreHelperUtil.getApiUrl();
const api = new FetchUtil({ baseUrl });
const defaultEntries = '48';
const recommendedEntries = '8';
const sdkType = 'wcm';

// -- Types --------------------------------------------- //
export interface ApiCtrlState {
  prefetchPromise?: Promise<unknown>;
  sdkVersion: `modal-react-native-${string}`;
  page: number;
  count: number;
  recommended: WcWallet[];
  installed: WcWallet[];
  wallets: WcWallet[];
  search: WcWallet[];
}

type StateKey = keyof ApiCtrlState;

// -- State --------------------------------------------- //
const state = proxy<ApiCtrlState>({
  sdkVersion: `modal-react-native-${SDK_VERSION}`,
  page: 1,
  count: 0,
  recommended: [],
  wallets: [],
  search: [],
  installed: [],
});

// -- Controller ---------------------------------------- //
export const ApiCtrl = {
  state,

  platform() {
    return Platform.select({ default: 'ios', android: 'android' });
  },

  subscribeKey<K extends StateKey>(
    key: K,
    callback: (value: ApiCtrlState[K]) => void
  ) {
    return subKey(state, key, callback);
  },

  setSdkVersion(sdkVersion: ApiCtrlState['sdkVersion']) {
    state.sdkVersion = sdkVersion;
  },

  _getApiHeaders() {
    return {
      'x-project-id': ConfigCtrl.state.projectId,
      'x-sdk-type': sdkType,
      'x-sdk-version': state.sdkVersion,
    };
  },

  async _fetchWalletImage(imageId: string) {
    const imageUrl = `${api.baseUrl}/getWalletImage/${imageId}`;
    AssetCtrl.setWalletImage(imageId, imageUrl);
  },

  async fetchInstalledWallets() {
    const path = Platform.select({
      default: 'getIosData',
      android: 'getAndroidData',
    });
    const { data: walletData } = await api.get<ApiGetDataWalletsResponse>({
      path,
      headers: ApiCtrl._getApiHeaders(),
    });

    const promises = walletData.map(async (item) => {
      return {
        id: item.id,
        isInstalled: await CoreHelperUtil.checkInstalled(item),
      };
    });

    const results = await Promise.all(promises);
    const installed = results
      .filter(({ isInstalled }) => isInstalled)
      .map(({ id }) => id);

    const { explorerExcludedWalletIds } = ConfigCtrl.state;
    const excludeWalletIds = CoreHelperUtil.isArray(explorerExcludedWalletIds)
      ? explorerExcludedWalletIds
      : [];

    if (installed.length > 0) {
      const { data } = await api.get<ApiGetWalletsResponse>({
        path: '/getWallets',
        headers: ApiCtrl._getApiHeaders(),
        params: {
          page: '1',
          platform: this.platform(),
          entries: installed?.length.toString(),
          include: installed?.join(','),
          exclude: excludeWalletIds?.join(','),
        },
      });

      const walletImages = data.map((d) => d.image_id).filter(Boolean);
      await Promise.allSettled(
        (walletImages as string[]).map((id) => ApiCtrl._fetchWalletImage(id))
      );

      state.installed = data;
    }
  },

  async fetchRecommendedWallets() {
    const { installed } = ApiCtrl.state;
    const { explorerRecommendedWalletIds, explorerExcludedWalletIds } =
      ConfigCtrl.state;
    const excludeWalletIds = CoreHelperUtil.isArray(explorerExcludedWalletIds)
      ? explorerExcludedWalletIds
      : [];

    const includeWalletIds = CoreHelperUtil.isArray(
      explorerRecommendedWalletIds
    )
      ? explorerRecommendedWalletIds
      : [];

    const exclude = [
      ...installed.map(({ id }) => id),
      ...(excludeWalletIds ?? []),
    ].filter(Boolean);

    const { data, count } = await api.get<ApiGetWalletsResponse>({
      path: '/getWallets',
      headers: ApiCtrl._getApiHeaders(),
      params: {
        page: '1',
        platform: this.platform(),
        entries: recommendedEntries,
        include: includeWalletIds?.join(','),
        exclude: exclude?.join(','),
      },
    });

    const recent = await StorageUtil.getRecentWallet();
    const recommendedImages = data.map((d) => d.image_id).filter(Boolean);
    await Promise.allSettled(
      (
        [...recommendedImages, recent ? recent.image_id : undefined] as string[]
      ).map((id) => ApiCtrl._fetchWalletImage(id))
    );
    state.recommended = data;
    state.count = count ?? 0;
  },

  async fetchWallets({ page }: Pick<ApiGetWalletsRequest, 'page'>) {
    const { explorerExcludedWalletIds } = ConfigCtrl.state;
    const excludedIds = CoreHelperUtil.isArray(explorerExcludedWalletIds)
      ? explorerExcludedWalletIds
      : [];

    const exclude = [
      ...state.installed.map(({ id }) => id),
      ...state.recommended.map(({ id }) => id),
      ...(excludedIds ?? []),
    ].filter(Boolean);
    const { data, count } = await api.get<ApiGetWalletsResponse>({
      path: '/getWallets',
      headers: ApiCtrl._getApiHeaders(),
      params: {
        page: String(page),
        platform: this.platform(),
        entries: String(defaultEntries),

        exclude: exclude.join(','),
      },
    });

    const images = data.map((w) => w.image_id).filter(Boolean);
    await Promise.allSettled([
      ...(images as string[]).map((id) => ApiCtrl._fetchWalletImage(id)),
      CoreHelperUtil.wait(300),
    ]);
    state.wallets = [...state.wallets, ...data];
    state.count = count > state.count ? count : state.count;
    state.page = page;
  },

  async searchWallet({ search }: Pick<ApiGetWalletsRequest, 'search'>) {
    const { explorerExcludedWalletIds } = ConfigCtrl.state;
    const excludeWalletIds = CoreHelperUtil.isArray(explorerExcludedWalletIds)
      ? explorerExcludedWalletIds
      : [];
    state.search = [];
    const { data } = await api.get<ApiGetWalletsResponse>({
      path: '/getWallets',
      headers: ApiCtrl._getApiHeaders(),
      params: {
        page: '1',
        platform: this.platform(),
        entries: String(defaultEntries),
        search,
        exclude: excludeWalletIds?.join(','),
      },
    });
    const images = data.map((w) => w.image_id).filter(Boolean);
    await Promise.allSettled([
      ...(images as string[]).map((id) => ApiCtrl._fetchWalletImage(id)),
      CoreHelperUtil.wait(300),
    ]);
    state.search = data;
  },

  async prefetch() {
    await ApiCtrl.fetchInstalledWallets();

    state.prefetchPromise = Promise.race([
      Promise.allSettled([ApiCtrl.fetchRecommendedWallets()]),
      CoreHelperUtil.wait(3000),
    ]);
  },
};
