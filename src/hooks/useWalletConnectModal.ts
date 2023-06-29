import { useSnapshot } from 'valtio';
import { useEffect } from 'react';

import { ClientCtrl } from '../controllers/ClientCtrl';
import { AccountCtrl } from '../controllers/AccountCtrl';
import { ExplorerUtil } from '../utils/ExplorerUtil';
import { ConfigCtrl } from '../controllers/ConfigCtrl';
import type { Listing } from '../types/controllerTypes';
import { ExplorerCtrl } from '../controllers/ExplorerCtrl';
import type { IProviderMetadata, ISessionParams } from '../types/coreTypes';
import type { ConfigCtrlState } from '../types/controllerTypes';
import { useConfigure } from '../hooks/useConfigure';
import { defaultSessionParams } from '../constants/Config';
import { setDeepLinkWallet } from '../utils/StorageUtil';
import { OptionsCtrl } from '@walletconnect/modal-react-native/src/controllers/OptionsCtrl';
import type { SessionTypes } from '@walletconnect/types';
import { WcConnectionCtrl } from '../controllers/WcConnectionCtrl';

export const deepLink = (currentWCURI: string | undefined, walletInfo: Listing) => {
  if (currentWCURI) {
    ConfigCtrl.setRecentWalletDeepLink(
      walletInfo.mobile?.native || walletInfo.mobile?.universal
    );
    ExplorerUtil.navigateDeepLink(
      walletInfo.mobile.universal,
      walletInfo.mobile.native,
      currentWCURI
    );
  }
};

export const getImageURL = (walletInfo:Listing) => ExplorerCtrl.getWalletImageUrl(walletInfo.image_id);

export type Config = Omit<ConfigCtrlState, 'recentWalletDeepLink'> &
  {
    providerMetadata: IProviderMetadata;
    sessionParams?: ISessionParams;
  };


export function useWalletConnectModal(config: Config) {

  useConfigure(config);
  const { isDataLoaded } = useSnapshot(OptionsCtrl.state);
  const { initialized } =useSnapshot(ClientCtrl.state);
  const accountState = useSnapshot(AccountCtrl.state);
  const clientState = useSnapshot(ClientCtrl.state);
  const { pairingUri } = useSnapshot(WcConnectionCtrl.state);
  const { recommendedWallets } = useSnapshot(ExplorerCtrl.state);

  const onSessionCreated = async (session: SessionTypes.Struct) => {
    ClientCtrl.setSessionTopic(session.topic);
    const deepLink = ConfigCtrl.getRecentWalletDeepLink();
    try {
      if (deepLink) {
        await setDeepLinkWallet(deepLink);
        ConfigCtrl.setRecentWalletDeepLink(undefined);
      }
      AccountCtrl.getAccount();
    } catch (error) {
    }
  };

  const onSessionError = async () => {
    ConfigCtrl.setRecentWalletDeepLink(undefined);
  };

  const connectToProvider = async () => {
    const provider = ClientCtrl.provider();
    try {
      if (!provider) throw new Error('Provider not initialized');

      if (!accountState.isConnected) {
        const session = await provider.connect(
          config?.sessionParams || defaultSessionParams
        );
        if (session) {
          onSessionCreated(session);
        }
      }
    } catch (error) {
      onSessionError();
    }
  };

  useEffect(() => {
    if(isDataLoaded && initialized) {
      connectToProvider();
    }
  }, [isDataLoaded, initialized]);


  useEffect(() => {
    if (!config.projectId) {
      console.error('Error', 'projectId not found');
    }
  }, [config.projectId]);

  return {
    provider: clientState.initialized ? ClientCtrl.provider() : undefined,
    isConnected: accountState.isConnected,
    address: accountState.address,
    pairingUri,
    recommendedWallets
  };
}
