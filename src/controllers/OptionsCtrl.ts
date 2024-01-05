import { proxy } from 'valtio';

// -- Types ---------------------------------------- //
export interface OptionsCtrlState {
  isDataLoaded: boolean;
}

// -- State ---------------------------------------- //
const state = proxy<OptionsCtrlState>({
  isDataLoaded: false,
});

// -- Controller ---------------------------------------- //
export const OptionsCtrl = {
  state,

  setIsDataLoaded(isDataLoaded: OptionsCtrlState['isDataLoaded']) {
    state.isDataLoaded = isDataLoaded;
  },
};
