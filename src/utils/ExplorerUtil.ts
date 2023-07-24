import { Linking, Platform } from 'react-native';
import { version } from '../../package.json';
import { version as providerVersion } from '@walletconnect/universal-provider/package.json';

import type { ListingParams, ListingResponse } from '../types/controllerTypes';
import { CoreUtil } from './CoreUtil';
import { ConfigCtrl } from '../controllers/ConfigCtrl';
import { ToastCtrl } from '../controllers/ToastCtrl';

// -- Helpers -------------------------------------------------------
const W3M_API = 'https://explorer-api.walletconnect.com';

function getSdkVersion() {
  return `rn-${version}`;
}

function getUserAgent() {
  return `wcm-rn-${version}/js-${providerVersion}/${Platform.OS}-${Platform.Version}`;
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
};
