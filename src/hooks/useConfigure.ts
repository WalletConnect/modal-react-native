import { useCallback, useEffect } from 'react';
import { useColorScheme } from 'react-native';
import { SUBSCRIBER_EVENTS } from '@walletconnect/core';
import { ExplorerCtrl } from '../controllers/ExplorerCtrl';
import { OptionsCtrl } from '../controllers/OptionsCtrl';
import { ConfigCtrl } from '../controllers/ConfigCtrl';
import { ClientCtrl } from '../controllers/ClientCtrl';
import { AccountCtrl } from '../controllers/AccountCtrl';
import { WcConnectionCtrl } from '../controllers/WcConnectionCtrl';
import type { IProviderMetadata } from '../types/coreTypes';
import { createUniversalProvider } from '../utils/ProviderUtil';
import { StorageUtil } from '../utils/StorageUtil';
import { ThemeCtrl } from '../controllers/ThemeCtrl';
import { ToastCtrl } from '../controllers/ToastCtrl';
import type { ThemeCtrlState } from '../types/controllerTypes';

interface Props {
  projectId: string;
  providerMetadata: IProviderMetadata;
  relayUrl?: string;
  themeMode?: ThemeCtrlState['themeMode'];
  accentColor?: ThemeCtrlState['accentColor'];
}

export function useConfigure(config: Props) {
  const colorScheme = useColorScheme();
  const { projectId, providerMetadata, relayUrl } = config;

  const resetApp = useCallback(() => {
    ClientCtrl.resetSession();
    AccountCtrl.resetAccount();
    WcConnectionCtrl.resetConnection();
    StorageUtil.removeDeepLinkWallet();
  }, []);

  const onSessionDelete = useCallback(
    ({ topic }: { topic: string }) => {
      const sessionTopic = ClientCtrl.sessionTopic();
      if (topic === sessionTopic) {
        resetApp();
      }
    },
    [resetApp]
  );

  const onDisplayUri = useCallback(async (uri: string) => {
    WcConnectionCtrl.setPairingUri(uri);
  }, []);

  useEffect(() => {
    if (!projectId) {
      console.error('projectId not found');
    }
  }, [projectId]);

  /**
   * Set theme mode
   */
  useEffect(() => {
    ThemeCtrl.setThemeMode(config.themeMode || colorScheme);
    ThemeCtrl.setAccentColor(config.accentColor);
  }, [config.themeMode, config.accentColor, colorScheme]);

  /**
   * Set config
   */
  useEffect(() => {
    ConfigCtrl.setConfig(config);
    ConfigCtrl.loadRecentWallet();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /**
   * Fetch wallet list
   */
  useEffect(() => {
    async function fetchWallets() {
      try {
        if (!ExplorerCtrl.state.wallets.total) {
          await ExplorerCtrl.getWallets();
          OptionsCtrl.setIsDataLoaded(true);
        }
      } catch (error) {
        ToastCtrl.openToast('Network error', 'error');
      }
    }
    fetchWallets();
  }, []);

  /**
   * Initialize provider
   */
  useEffect(() => {
    async function initProvider() {
      try {
        const provider = await createUniversalProvider({
          projectId,
          relayUrl,
          metadata: providerMetadata,
        });
        if (provider) {
          ClientCtrl.setProvider(provider);
          provider.on('display_uri', onDisplayUri);
          provider.client.core.relayer.subscriber.on(
            SUBSCRIBER_EVENTS.deleted,
            onSessionDelete
          );

          // Check if there is an active session
          if (provider.session) {
            ClientCtrl.setSessionTopic(provider.session.topic);
            await AccountCtrl.getAccount();
          }
          ClientCtrl.setInitialized(true);
        }
      } catch (error) {
        console.error('Error initializing WalletConnect SDK', error);
      }
    }
    if (!ClientCtrl.provider() && projectId && providerMetadata) {
      initProvider();
    }
  }, [projectId, providerMetadata, relayUrl, onDisplayUri, onSessionDelete]);
}
