import type { ISessionParams } from '../types/coreTypes';

const DEFAULT_CHAINS = ['eip155:1'];
const REQUIRED_METHODS = ['eth_sendTransaction', 'personal_sign'];
const REQUIRED_EVENTS = ['chainChanged', 'accountsChanged'];

// DO NOT REMOVE, SHOULD MATCH CORE PACKAGE VERSION
export const CORE_VERSION = '2.11.0';

// DO NOT REMOVE, SHOULD MATCH SDK PACKAGE VERSION
export const SDK_VERSION = '1.1.0';

export const defaultSessionParams: ISessionParams = {
  namespaces: {
    eip155: {
      methods: REQUIRED_METHODS,
      chains: DEFAULT_CHAINS,
      events: REQUIRED_EVENTS,
      rpcMap: {},
    },
  },
};
