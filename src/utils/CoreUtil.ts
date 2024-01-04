import { Linking, Platform } from 'react-native';
import type { Listing } from '../types/controllerTypes';
import { PLAYSTORE_REGEX } from '../constants/Platform';

// -- Helpers -----------------------------------------------------------------
async function isAppInstalledIos(deepLink?: string): Promise<boolean> {
  try {
    return deepLink ? Linking.canOpenURL(deepLink) : Promise.resolve(false);
  } catch (error) {
    return Promise.resolve(false);
  }
}

async function isAppInstalledAndroid(packageName?: string): Promise<boolean> {
  try {
    if (
      !packageName ||
      //@ts-ignore
      typeof global?.Application?.isAppInstalled !== 'function'
    ) {
      return Promise.resolve(false);
    }

    //@ts-ignore
    return global?.Application?.isAppInstalled(packageName);
  } catch (error) {
    return Promise.resolve(false);
  }
}

function getUrlParams(url: string | null): { [key: string]: string } {
  if (!url) {
    return {};
  }
  const regex = /[?&]([^=#]+)=([^&#]*)/g;
  const params: { [key: string]: string } = {};
  let match: RegExpExecArray | null;

  while ((match = regex.exec(url)) !== null) {
    params[match[1] as string] = decodeURIComponent(match[2] as string);
  }

  return params;
}

function getAppId(playstoreLink?: string | null): string | undefined {
  if (!playstoreLink || !playstoreLink.match(PLAYSTORE_REGEX)) {
    return undefined;
  }

  // eslint-disable-next-line dot-notation
  const applicationId = getUrlParams(playstoreLink)?.['id'];
  return applicationId;
}

// -- Utility -------------------------------------------------------
export const CoreUtil = {
  RECOMMENDED_WALLET_AMOUNT: 11,

  isHttpUrl(url: string) {
    return url.startsWith('http://') || url.startsWith('https://');
  },

  formatNativeUrl(
    appUrl: string | undefined,
    wcUri: string
  ): string | undefined {
    if (!appUrl) return undefined;

    if (CoreUtil.isHttpUrl(appUrl)) {
      return this.formatUniversalUrl(appUrl, wcUri);
    }
    let safeAppUrl = appUrl;
    if (!safeAppUrl.includes('://')) {
      safeAppUrl = appUrl.replaceAll('/', '').replaceAll(':', '');
      safeAppUrl = `${safeAppUrl}://`;
    }
    if (!safeAppUrl.endsWith('/')) {
      safeAppUrl = `${safeAppUrl}/`;
    }

    const encodedWcUrl = encodeURIComponent(wcUri);

    return `${safeAppUrl}wc?uri=${encodedWcUrl}`;
  },

  formatUniversalUrl(
    appUrl: string | undefined,
    wcUri: string
  ): string | undefined {
    if (!appUrl) return undefined;

    if (!CoreUtil.isHttpUrl(appUrl)) {
      return this.formatNativeUrl(appUrl, wcUri);
    }
    let plainAppUrl = appUrl;
    if (appUrl.endsWith('/')) {
      plainAppUrl = appUrl.slice(0, -1);
    }

    const encodedWcUrl = encodeURIComponent(wcUri);

    return `${plainAppUrl}/wc?uri=${encodedWcUrl}`;
  },

  isArray<T>(data?: T | T[]): data is T[] {
    return Array.isArray(data) && data.length > 0;
  },

  async checkInstalled(wallet: Listing): Promise<boolean> {
    let isInstalled = false;
    const scheme = wallet.mobile.native;
    const appId = getAppId(wallet.app.android);
    try {
      isInstalled = await Platform.select({
        ios: isAppInstalledIos(scheme),
        android: isAppInstalledAndroid(appId),
        default: Promise.resolve(false),
      });
    } catch {
      isInstalled = false;
    }

    return isInstalled;
  },
};
