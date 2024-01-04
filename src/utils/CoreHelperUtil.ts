import { Linking, Platform } from 'react-native';
import { ConstantsUtil } from './ConstantsUtil';
import type { CaipAddress, DataWallet } from '../types/controllerTypes';

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

export const CoreHelperUtil = {
  isPairingExpired(expiry?: number) {
    return expiry ? expiry - Date.now() <= ConstantsUtil.TEN_SEC_MS : true;
  },

  isAllowedRetry(lastRetry: number) {
    return Date.now() - lastRetry >= ConstantsUtil.ONE_SEC_MS;
  },

  getPairingExpiry() {
    return Date.now() + ConstantsUtil.FOUR_MINUTES_MS;
  },

  getPlainAddress(caipAddress: CaipAddress) {
    return caipAddress.split(':')[2];
  },

  async wait(milliseconds: number) {
    return new Promise((resolve) => {
      setTimeout(resolve, milliseconds);
    });
  },

  debounce(func: (...args: any[]) => unknown, timeout = 500) {
    let timer: ReturnType<typeof setTimeout> | undefined;

    return (...args: unknown[]) => {
      function next() {
        func(...args);
      }
      if (timer) {
        clearTimeout(timer);
      }
      timer = setTimeout(next, timeout);
    };
  },

  isHttpUrl(url: string) {
    return url.startsWith('http://') || url.startsWith('https://');
  },

  formatNativeUrl(appUrl: string, wcUri: string): string {
    if (CoreHelperUtil.isHttpUrl(appUrl)) {
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

  formatUniversalUrl(appUrl: string, wcUri: string): string {
    if (!CoreHelperUtil.isHttpUrl(appUrl)) {
      return this.formatNativeUrl(appUrl, wcUri);
    }
    let safeAppUrl = appUrl;
    if (!safeAppUrl.endsWith('/')) {
      safeAppUrl = `${safeAppUrl}/`;
    }
    const encodedWcUrl = encodeURIComponent(wcUri);

    return `${safeAppUrl}wc?uri=${encodedWcUrl}`;
  },

  openLink(url: string) {
    return Linking.openURL(url);
  },

  formatBalance(
    balance: string | undefined,
    symbol: string | undefined,
    decimals = 3
  ) {
    let formattedBalance;

    if (balance === '0') {
      formattedBalance = '0.000';
    } else if (typeof balance === 'string') {
      const number = Number(balance);
      if (number) {
        const regex = new RegExp(`^-?\\d+(?:\\.\\d{0,${decimals}})?`, 'u');
        formattedBalance = number.toString().match(regex)?.[0];
      }
    }

    return formattedBalance ? `${formattedBalance} ${symbol}` : '0.000';
  },

  isRestrictedRegion() {
    try {
      const { timeZone } = new Intl.DateTimeFormat().resolvedOptions();
      const capTimeZone = timeZone.toUpperCase();

      return ConstantsUtil.RESTRICTED_TIMEZONES.includes(capTimeZone);
    } catch {
      return false;
    }
  },

  getApiUrl() {
    return CoreHelperUtil.isRestrictedRegion()
      ? 'https://api.web3modal.org'
      : 'https://api.web3modal.com';
  },

  getBlockchainApiUrl() {
    return CoreHelperUtil.isRestrictedRegion()
      ? 'https://rpc.walletconnect.org'
      : 'https://rpc.walletconnect.com';
  },

  async checkInstalled(wallet: DataWallet): Promise<boolean> {
    let isInstalled = false;
    const scheme = wallet.ios_schema;
    const appId = wallet.android_app_id;
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

  isArray<T>(data?: T | T[]): data is T[] {
    return Array.isArray(data) && data.length > 0;
  },
};
