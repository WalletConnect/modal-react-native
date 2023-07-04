import { ExplorerCtrl } from '../controllers/ExplorerCtrl';

export default {
  getAllWallets({ search }: { search?: string }) {
    const { wallets, recommendedWallets } = ExplorerCtrl.state;
    const _wallets = [...recommendedWallets, ...wallets.listings];

    if (search) {
      return _wallets.filter((wallet) => {
        return wallet.name.toLowerCase().includes(search.toLowerCase());
      });
    }
    return _wallets;
  },
};
