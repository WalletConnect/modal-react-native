import { proxy } from 'valtio';

import { UiUtil } from '../utils/UiUtil';
import type { WcWallet } from '../types/controllerTypes';

// -- Types ---------------------------------------- //
export type RouterView =
  | 'ConnectWallet'
  | 'Qrcode'
  | 'WalletExplorer'
  | 'Connecting';

export interface RouterCtrlState {
  history: RouterView[];
  view: RouterView;
  data?: {
    wallet?: WcWallet;
  };
}

// -- State ---------------------------------------- //
const state = proxy<RouterCtrlState>({
  history: ['ConnectWallet'],
  view: 'ConnectWallet',
  data: undefined,
});

// -- Controller ---------------------------------------- //
export const RouterCtrl = {
  state,

  push(view: RouterCtrlState['view'], data?: RouterCtrlState['data']) {
    if (view !== state.view) {
      UiUtil.layoutAnimation();
      state.view = view;
      if (data) {
        state.data = data;
      }
      state.history.push(view);
    }
  },

  replace(view: RouterCtrlState['view']) {
    state.view = view;
    state.history = [view];
  },

  goBack() {
    if (state.history.length > 1) {
      UiUtil.layoutAnimation();
      state.history.pop();
      const [last] = state.history.slice(-1);
      state.view = last || 'ConnectWallet';
    }
  },
};
