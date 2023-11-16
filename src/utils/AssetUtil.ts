import { AssetCtrl } from '../controllers/AssetCtrl';
import type { WcWallet } from '../types/controllerTypes';

export const AssetUtil = {
  getWalletImage(wallet?: WcWallet) {
    if (wallet?.image_url) {
      return wallet?.image_url;
    }

    if (wallet?.image_id) {
      return AssetCtrl.state.walletImages[wallet.image_id];
    }

    return undefined;
  },
};
