import { proxy } from 'valtio';

import { ClientCtrl } from './ClientCtrl';
import { OptionsCtrl } from './OptionsCtrl';
import { AccountCtrl } from './AccountCtrl';
import { RouterCtrl } from './RouterCtrl';
import { WcConnectionCtrl } from './WcConnectionCtrl';
import { ConfigCtrl } from './ConfigCtrl';
import { CoreHelperUtil } from '../utils/CoreHelperUtil';

// -- Types ---------------------------------------- //
export interface ModalCtrlState {
  open: boolean;
}

export interface OpenOptions {
  route?: 'ConnectWallet' | 'Qrcode' | 'WalletExplorer';
}

// -- State ---------------------------------------- //
const state = proxy<ModalCtrlState>({
  open: false,
});

// -- Controller ---------------------------------------- //
export const ModalCtrl = {
  state,

  async open(options?: OpenOptions) {
    return new Promise<void>((resolve) => {
      const { isDataLoaded } = OptionsCtrl.state;
      const { isConnected } = AccountCtrl.state;
      const { initialized } = ClientCtrl.state;
      const { explorerRecommendedWalletIds, explorerExcludedWalletIds } =
        ConfigCtrl.state;

      const explorerDisabled =
        explorerRecommendedWalletIds === 'NONE' ||
        (explorerExcludedWalletIds === 'ALL' &&
          !CoreHelperUtil.isArray(explorerRecommendedWalletIds));

      WcConnectionCtrl.setPairingEnabled(true);

      if (isConnected) {
        // If already connected, do nothing
        return;
      } else if (options?.route) {
        RouterCtrl.replace(options.route);
      } else if (explorerDisabled) {
        RouterCtrl.replace('Qrcode');
      } else {
        RouterCtrl.replace('ConnectWallet');
      }

      // Open modal if async data is ready
      if (initialized && isDataLoaded) {
        state.open = true;
        resolve();
      }
      // Otherwise (slow network) re-attempt open checks
      else {
        const interval = setInterval(() => {
          if (ClientCtrl.state.initialized && OptionsCtrl.state.isDataLoaded) {
            clearInterval(interval);
            state.open = true;
            resolve();
          }
        }, 200);
      }
    });
  },

  close() {
    state.open = false;
  },
};
