import AsyncStorage from '@react-native-async-storage/async-storage';
import type { WcWallet } from '../types/controllerTypes';

export const StorageUtil = {
  WALLETCONNECT_DEEPLINK_CHOICE: 'WALLETCONNECT_DEEPLINK_CHOICE',
  W3M_RECENT_WALLET_INFO: 'W3M_RECENT_WALLET_INFO',

  setDeepLinkWallet(link: string) {
    return AsyncStorage.setItem(
      StorageUtil.WALLETCONNECT_DEEPLINK_CHOICE,
      JSON.stringify({ href: link })
    );
  },

  removeDeepLinkWallet() {
    return AsyncStorage.removeItem(StorageUtil.WALLETCONNECT_DEEPLINK_CHOICE);
  },

  setRecentWallet(wallet: WcWallet) {
    try {
      AsyncStorage.setItem(
        StorageUtil.W3M_RECENT_WALLET_INFO,
        JSON.stringify(wallet)
      );
    } catch (error) {
      console.info('Unable to set recent wallet');
    }
  },

  async getRecentWallet(): Promise<WcWallet | undefined> {
    try {
      const wallet = await AsyncStorage.getItem(
        StorageUtil.W3M_RECENT_WALLET_INFO
      );

      if (wallet) {
        const parsedWallet = JSON.parse(wallet);
        if (typeof parsedWallet.app === 'object') {
          // Wallet from old api. Discard it
          await AsyncStorage.removeItem(StorageUtil.W3M_RECENT_WALLET_INFO);
          return undefined;
        }
        return parsedWallet;
      }

      return undefined;
    } catch (error) {
      console.info('Unable to get recent wallet');
    }
    return undefined;
  },
};
