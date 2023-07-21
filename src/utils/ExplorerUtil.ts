import { Linking, Platform } from 'react-native';
import { version } from '../../package.json';
import { version as providerVersion } from '@walletconnect/universal-provider/package.json';

import type {
  Listing,
  ListingParams,
  ListingResponse,
} from '../types/controllerTypes';
import { CoreUtil } from './CoreUtil';
import { ConfigCtrl } from '../controllers/ConfigCtrl';
import { ToastCtrl } from '../controllers/ToastCtrl';
import { isIOS } from '../constants/Platform';

// -- Helpers -------------------------------------------------------
const W3M_API = 'https://explorer-api.walletconnect.com';

function getUserAgent() {
  return `w3m-rn-${version}/js-${providerVersion}/${Platform.OS}-${Platform.Version}`;
}

async function fetchListings(
  endpoint: string,
  params: ListingParams,
  headers: HeadersInit_
): Promise<ListingResponse> {
  const url = new URL(endpoint, W3M_API);
  url.searchParams.append('projectId', ConfigCtrl.state.projectId);

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
    const extendedParams: ListingParams = { ...params, version: 2 };
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

  getAssetImageUrl(imageId: string) {
    return `${W3M_API}/w3m/v1/getAssetImage/${imageId}?projectId=${ConfigCtrl.state.projectId}`;
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
        await Linking.openURL(nativeUrl).catch(() => {
          // Fallback to universal link
          if (universalUrl) {
            Linking.openURL(universalUrl);
          } else {
            ToastCtrl.openToast('Unable to open the wallet', 'error');
          }
        });
      } else if (universalUrl) {
        await Linking.openURL(universalUrl);
      } else {
        ToastCtrl.openToast('Unable to open the wallet', 'error');
      }
    } catch (error) {
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

  async isAppInstalled(scheme: string | undefined): Promise<boolean> {
    let isAppInstalled = false;
    try {
      isAppInstalled =
        scheme && isIOS ? await Linking.canOpenURL(scheme) : false;
    } catch {
      isAppInstalled = false;
    }
    return isAppInstalled;
  },

  async sortArrayAsync(array: Listing[]) {
    const promises = array.map(async (item) => {
      return {
        item,
        isInstalled: await ExplorerUtil.isAppInstalled(item.mobile.native),
      };
    });

    const results = await Promise.all(promises);

    results.sort((a, b) => {
      console.log(a.item.name, a.isInstalled, b.item.name, b.isInstalled);
      if (a.isInstalled && b.isInstalled) return 0;
      if (a.isInstalled && !b.isInstalled) return -1;
      if (!a.isInstalled && b.isInstalled) return 1;
      return 0;
    });

    return results.map((item) => {
      return { ...item.item, isInstalled: item.isInstalled };
    });
  },
};
