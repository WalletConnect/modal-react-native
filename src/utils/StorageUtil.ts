import AsyncStorage from '@react-native-async-storage/async-storage';
import type { Listing } from 'src/types/controllerTypes';

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

  setRecentWallet(wallet: Listing) {
    try {
      AsyncStorage.setItem(
        StorageUtil.W3M_RECENT_WALLET_INFO,
        JSON.stringify(wallet)
      );
    } catch (error) {
      console.info('Unable to set recent wallet');
    }
  },

  async getRecentWallet() {
    try {
      const wallet = await AsyncStorage.getItem(
        StorageUtil.W3M_RECENT_WALLET_INFO
      );
      return wallet ? JSON.parse(wallet) : undefined;
    } catch (error) {
      console.info('Unable to get recent wallet');
    }
    return undefined;
  },
};
