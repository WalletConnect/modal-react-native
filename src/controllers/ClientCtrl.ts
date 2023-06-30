import { proxy, ref } from 'valtio';

import type { ClientCtrlState } from '../types/controllerTypes';

// -- initial state ------------------------------------------------ //
const state = proxy<ClientCtrlState>({
  initialized: false,
  provider: undefined,
  sessionTopic: undefined,
});

// -- controller -------------------------------------------------- //
export const ClientCtrl = {
  state,

  setProvider(provider: ClientCtrlState['provider']) {
    if (!state.initialized && provider) {
      state.provider = ref(provider);
    }
  },

  setInitialized(initialized: ClientCtrlState['initialized']) {
    state.initialized = initialized;
  },

  setSessionTopic(topic: ClientCtrlState['sessionTopic']) {
    if (topic && state.provider) {
      state.sessionTopic = topic;
    }
  },

  provider() {
    return state.provider;
  },

  sessionTopic() {
    return state.sessionTopic;
  },

  resetSession() {
    state.sessionTopic = undefined;
  },
};
