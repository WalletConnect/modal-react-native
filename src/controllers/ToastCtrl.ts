import { proxy } from 'valtio';

// -- Types ---------------------------------------- //
export interface ToastCtrlState {
  open: boolean;
  message: string;
  variant: 'error' | 'success';
}

// -- State ---------------------------------------- //
const state = proxy<ToastCtrlState>({
  open: false,
  message: '',
  variant: 'success',
});

// -- Controller ---------------------------------------- //
export const ToastCtrl = {
  state,

  openToast(
    message: ToastCtrlState['message'],
    variant: ToastCtrlState['variant']
  ) {
    state.open = true;
    state.message = message;
    state.variant = variant;
  },

  closeToast() {
    state.open = false;
  },
};
