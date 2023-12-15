import { Image, Linking, Platform } from 'react-native';

import type {
  Listing,
  ListingParams,
  ListingResponse,
} from '../types/controllerTypes';
import { CoreUtil } from './CoreUtil';
import { ConfigCtrl } from '../controllers/ConfigCtrl';
import { ToastCtrl } from '../controllers/ToastCtrl';
import { StorageUtil } from './StorageUtil';
import { CORE_VERSION, SDK_VERSION } from '../constants/Config';

// -- Helpers -------------------------------------------------------
const W3M_API = 'https://explorer-api.walletconnect.com';

function getSdkVersion() {
  return `rn-${SDK_VERSION}`;
}

function getUserAgent() {
  return `wcm-rn-${SDK_VERSION}/js-${CORE_VERSION}/${Platform.OS}-${Platform.Version}`;
}

async function fetchListings(
  endpoint: string,
  params: ListingParams,
  headers: HeadersInit_
): Promise<ListingResponse> {
  const url = new URL(endpoint, W3M_API);
  url.searchParams.append('projectId', ConfigCtrl.state.projectId);
  url.searchParams.append('sdkType', 'wcm');
  url.searchParams.append('sdkVersion', getSdkVersion());

  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value) {
        url.searchParams.append(key, String(value));
      }
    });
  }

  const request = await fetch(url.toString(), { headers });

  return request.json() as Promise<ListingResponse>;
}

// -- Utility -------------------------------------------------------
export const ExplorerUtil = {
  async getListings(params?: ListingParams) {
    const headers = this.getCustomHeaders();
    const extendedParams: ListingParams = {
      ...params,
      version: 2,
    };
    const platform = Platform.select({
      ios: 'iOS',
      android: 'Android',
      default: 'Mobile',
    });

    return fetchListings(
      `/w3m/v1/get${platform}Listings`,
      extendedParams,
      headers
    );
  },

  getWalletImageUrl(imageId?: string) {
    if (!imageId) return undefined;

    return `${W3M_API}/w3m/v1/getWalletImage/${imageId}?projectId=${ConfigCtrl.state.projectId}`;
  },

  async navigateDeepLink(
    universalLink: string | undefined,
    deepLink: string | undefined,
    wcURI: string
  ) {
    try {
      const nativeUrl = CoreUtil.formatNativeUrl(deepLink, wcURI);
      const universalUrl = CoreUtil.formatUniversalUrl(universalLink, wcURI);
      if (nativeUrl) {
        StorageUtil.setDeepLinkWallet(deepLink!);
        await Linking.openURL(nativeUrl).catch(() => {
          // Fallback to universal link
          if (universalUrl && universalLink) {
            Linking.openURL(universalUrl);
            StorageUtil.setDeepLinkWallet(universalLink);
          } else {
            ToastCtrl.openToast('Unable to open the wallet', 'error');
          }
        });
      } else if (universalUrl) {
        Linking.openURL(universalUrl);
        StorageUtil.setDeepLinkWallet(universalLink!);
      } else {
        ToastCtrl.openToast('Unable to open the wallet', 'error');
      }
    } catch (error) {
      StorageUtil.removeDeepLinkWallet();
      ToastCtrl.openToast('Unable to open the wallet', 'error');
    }
  },

  getCustomHeaders() {
    const referer = ConfigCtrl.getMetadata().name.trim().replace(' ', '');
    return {
      'User-Agent': getUserAgent(),
      'Referer': referer,
    };
  },

  async sortInstalled(array: Listing[]) {
    const promises = array.map(async (item) => {
      return {
        ...item,
        isInstalled: await CoreUtil.checkInstalled(item),
      };
    });

    const results = await Promise.all(promises);

    results.sort((a, b) => {
      if (a.isInstalled && b.isInstalled) return 0;
      if (a.isInstalled) return -1;
      if (b.isInstalled) return 1;
      return 0;
    });

    return results;
  },

  async prefetchWalletImages(wallets: Listing[]) {
    const urls = wallets
      .filter((wallet) => wallet.image_id)
      .map((wallet) => this.getWalletImageUrl(wallet.image_id) as string);

    const cachedUrls = await Image.queryCache?.(urls);

    wallets.forEach((wallet) => {
      try {
        if (wallet.image_id) {
          const walletImage = this.getWalletImageUrl(wallet.image_id);
          if (!walletImage || cachedUrls?.[walletImage]) return;
          Image.prefetch(this.getWalletImageUrl(wallet.image_id)!);
        }
      } catch (error) {}
    });
  },
};
