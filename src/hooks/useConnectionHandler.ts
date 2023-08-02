import { useCallback, useEffect, useRef } from 'react';
import { useSnapshot } from 'valtio';

import { AccountCtrl } from '../controllers/AccountCtrl';
import { WcConnectionCtrl } from '../controllers/WcConnectionCtrl';
import { ClientCtrl } from '../controllers/ClientCtrl';
import { defaultSessionParams } from '../constants/Config';
import { ConfigCtrl } from '../controllers/ConfigCtrl';
import type { ISessionParams } from '../types/coreTypes';
import type { SessionTypes } from '@walletconnect/types';
import { StorageUtil } from '../utils/StorageUtil';
import { ModalCtrl } from '../controllers/ModalCtrl';
import { RouterCtrl } from '../controllers/RouterCtrl';

const FOUR_MIN_MS = 240000;

export function useConnectionHandler() {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const { isConnected } = useSnapshot(AccountCtrl.state);
  const { pairingEnabled, pairingUri } = useSnapshot(WcConnectionCtrl.state);
  const { provider } = useSnapshot(ClientCtrl.state);
  const { sessionParams } = useSnapshot(ConfigCtrl.state);

  const onSessionCreated = async (session: SessionTypes.Struct) => {
    WcConnectionCtrl.setPairingError(false);
    WcConnectionCtrl.setPairingEnabled(false);
    ClientCtrl.setSessionTopic(session.topic);
    const saveDeepLink = RouterCtrl.state.view !== 'Qrcode';
    try {
      const recentWallet = ConfigCtrl.getRecentWallet();
      if (saveDeepLink && recentWallet?.mobile) {
        await StorageUtil.setDeepLinkWallet(
          recentWallet.mobile.native || recentWallet.mobile.universal
        );
      }
      AccountCtrl.getAccount();
      ModalCtrl.close();
    } catch (error) {
      console.info('Unable to save deeplink');
    }
  };

  const connectAndWait = useCallback(async () => {
    try {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);

      if (!isConnected && pairingEnabled) {
        timeoutRef.current = setTimeout(connectAndWait, FOUR_MIN_MS);
        const session = await provider!.connect(
          (sessionParams as ISessionParams) ?? defaultSessionParams
        );

        if (session) {
          onSessionCreated(session);
        }
      }
    } catch (error) {
      WcConnectionCtrl.setPairingUri('');
      WcConnectionCtrl.setPairingError(true);
    }
  }, [isConnected, provider, sessionParams, pairingEnabled]);

  useEffect(() => {
    if (provider && !isConnected && pairingEnabled && !pairingUri) {
      connectAndWait();
    }
  }, [provider, connectAndWait, isConnected, pairingEnabled, pairingUri]);

  return null;
}
