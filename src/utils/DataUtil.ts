import { ConfigCtrl } from '../controllers/ConfigCtrl';
import { ExplorerCtrl } from '../controllers/ExplorerCtrl';
import { StorageUtil } from './StorageUtil';
import type { WcWallet } from '../types/controllerTypes';
import { ApiCtrl } from '../controllers/ApiCtrl';

export const DataUtil = {
  setRecentWallet(wallet: WcWallet) {
    ConfigCtrl.setRecentWallet(wallet);
    StorageUtil.setRecentWallet(wallet);
  },

  getRecentWallet() {
    return ConfigCtrl.getRecentWallet();
  },

  getInitialWallets() {
    const { recommended } = ApiCtrl.state;
    const { recentWallet } = ConfigCtrl.state;
    const _wallets = [...recommended];
    if (recentWallet) {
      const recentWalletIndex = _wallets.findIndex(
        (wallet) => wallet.id === recentWallet.id
      );
      if (recentWalletIndex > -1) {
        _wallets.splice(recentWalletIndex, 1);
      }

      _wallets.unshift(recentWallet);
    }
    return _wallets;
  },

  getAllWallets({ search }: { search?: string }) {
    const { wallets } = ExplorerCtrl.state;
    const { recentWallet } = ConfigCtrl.state;
    const _wallets = [...wallets.listings];
    if (recentWallet) {
      const recentWalletIndex = _wallets.findIndex(
        (wallet) => wallet.id === recentWallet.id
      );
      if (recentWalletIndex > -1) {
        _wallets.splice(recentWalletIndex, 1);
        _wallets.unshift(recentWallet);
      }
    }

    if (search) {
      return _wallets.filter((wallet) => {
        return wallet.name.toLowerCase().includes(search.toLowerCase());
      });
    }
    return _wallets;
  },
};
