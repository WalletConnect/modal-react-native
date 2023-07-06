import { useSnapshot } from 'valtio';
import { useEffect } from 'react';

import { ClientCtrl } from '../controllers/ClientCtrl';
import { AccountCtrl } from '../controllers/AccountCtrl';
import { ExplorerUtil } from '../utils/ExplorerUtil';
import { ConfigCtrl } from '../controllers/ConfigCtrl';
import type { Listing, ConfigCtrlState } from '../types/controllerTypes';
import { ExplorerCtrl } from '../controllers/ExplorerCtrl';
import type { IProviderMetadata, ISessionParams } from '../types/coreTypes';
import { useConfigure } from '../hooks/useConfigure';
import { defaultSessionParams } from '../constants/Config';
import { setDeepLinkWallet } from '../utils/StorageUtil';
import type { SessionTypes } from '@walletconnect/types';
import { WcConnectionCtrl } from '../controllers/WcConnectionCtrl';

const makeDeepLink =
  (currentWCURI: string | undefined, walletInfo: Listing) => () => {
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

const getImageURL = (walletInfo: Listing) =>
  ExplorerCtrl.getWalletImageUrl(walletInfo.image_id);

export type Config = Omit<ConfigCtrlState, 'recentWalletDeepLink'> & {
  providerMetadata: IProviderMetadata;
  sessionParams?: ISessionParams;
};

const onSessionCreated = async (session: SessionTypes.Struct) => {
  ClientCtrl.setSessionTopic(session.topic);
  const recentDeepLink = ConfigCtrl.getRecentWalletDeepLink();
  try {
    if (recentDeepLink) {
      await setDeepLinkWallet(recentDeepLink);
      ConfigCtrl.setRecentWalletDeepLink(undefined);
    }
    AccountCtrl.getAccount();
  } catch (error) {}
};

const onSessionError = async () => {
  ConfigCtrl.setRecentWalletDeepLink(undefined);
};

const connectToProvider = async (sessionParams: ISessionParams | undefined) => {
  const provider = ClientCtrl.provider();
  try {
    if (!provider) throw new Error('Provider not initialized');

    const session = await provider.connect(
      sessionParams || defaultSessionParams
    );
    if (session) {
      onSessionCreated(session);
    }
    return ClientCtrl.state.web3Provider?.getSigner().getAddress();
  } catch (error) {
    onSessionError();
    return Promise.reject(error);
  }
};

export function useWalletConnectModal(config: Config) {
  const { resetApp } = useConfigure(config);
  const accountState = useSnapshot(AccountCtrl.state);
  const clientState = useSnapshot(ClientCtrl.state);
  const { pairingUri } = useSnapshot(WcConnectionCtrl.state);
  const { recommendedWallets } = useSnapshot(ExplorerCtrl.state);

  useEffect(() => {
    if (!config.projectId) {
      throw new Error('projectId not found');
    }
  }, [config.projectId]);

  return {
    connectToProvider: () => connectToProvider(config.sessionParams),
    provider: clientState.initialized ? ClientCtrl.provider() : undefined,
    isConnected: accountState.isConnected,
    address: accountState.address,
    recommendedWallets: recommendedWallets.map((wallet) => ({
      imageURL: getImageURL(wallet),
      deepLink: makeDeepLink(pairingUri, wallet),
      ...wallet,
    })),
    reset: resetApp,
    uri: pairingUri,
  };
}
