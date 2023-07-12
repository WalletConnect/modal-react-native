import { proxy } from 'valtio/vanilla';
import type { WcConnectionCtrlState } from '../types/controllerTypes';

// -- initial state ------------------------------------------------ //
const state = proxy<WcConnectionCtrlState>({
  pairingUri: '',
  pairingEnabled: false,
  pairingError: false,
});

// -- controller --------------------------------------------------- //
export const WcConnectionCtrl = {
  state,

  setPairingUri(pairingUri: WcConnectionCtrlState['pairingUri']) {
    state.pairingUri = pairingUri;
  },

  setPairingError(pairingError: WcConnectionCtrlState['pairingError']) {
    state.pairingError = pairingError;
  },

  setPairingEnabled(enabled: WcConnectionCtrlState['pairingEnabled']) {
    state.pairingEnabled = enabled;
  },

  resetConnection() {
    state.pairingUri = '';
    state.pairingError = false;
    state.pairingEnabled = false;
  },
};
