import { StyleSheet } from 'react-native';
import Modal from 'react-native-modal';
import { useSnapshot } from 'valtio';

import ModalBackcard from '../../components/ModalBackcard';
import { ModalRouter } from '../wcm-modal-router';
import { ModalCtrl } from '../../controllers/ModalCtrl';
import { RouterCtrl } from '../../controllers/RouterCtrl';
import { useConnectionHandler } from '../../hooks/useConnectionHandler';
import type { ConfigCtrlState } from '../../controllers/ConfigCtrl';
import type { IProviderMetadata, ISessionParams } from '../../types/coreTypes';
import { useConfigure } from '../../hooks/useConfigure';
import Toast from '../../components/Toast';
import type { ThemeCtrlState } from '../../controllers/ThemeCtrl';

export type Props = Omit<ConfigCtrlState, 'recentWallet'> &
  ThemeCtrlState & {
    providerMetadata: IProviderMetadata;
    sessionParams?: ISessionParams;
    relayUrl?: string;
    onCopyClipboard?: (value: string) => void;
  };

export function WalletConnectModal(config: Props) {
  useConfigure(config);
  useConnectionHandler();
  const { open } = useSnapshot(ModalCtrl.state);
  const { history } = useSnapshot(RouterCtrl.state);

  const onBackButtonPress = () => {
    if (history.length > 1) {
      return RouterCtrl.goBack();
    }
    return ModalCtrl.close();
  };

  return (
    <Modal
      isVisible={open}
      style={styles.modal}
      propagateSwipe
      hideModalContentWhileAnimating
      onBackdropPress={ModalCtrl.close}
      onBackButtonPress={onBackButtonPress}
      useNativeDriver
      statusBarTranslucent
    >
      <ModalBackcard onClose={ModalCtrl.close} />
      <ModalRouter onCopyClipboard={config.onCopyClipboard} />
      <Toast />
    </Modal>
  );
}

const styles = StyleSheet.create({
  modal: {
    margin: 0,
    justifyContent: 'flex-end',
  },
});
