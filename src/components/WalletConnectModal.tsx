import { StyleSheet, View } from 'react-native';
import Modal from 'react-native-modal';
import { useSnapshot } from 'valtio';

import ModalHeader from './ModalHeader';
import { ModalRouter } from './ModalRouter';
import { ModalCtrl } from '../controllers/ModalCtrl';
import { RouterCtrl } from '../controllers/RouterCtrl';
import { useConnectionHandler } from '../hooks/useConnectionHandler';
import { useOrientation } from '../hooks/useOrientation';
import type { ConfigCtrlState, ThemeCtrlState } from '../types/controllerTypes';
import type { IProviderMetadata, ISessionParams } from '../types/coreTypes';
import { useConfigure } from '../hooks/useConfigure';
import useTheme from '../hooks/useTheme';
import Toast from './Toast';

export type Props = Omit<ConfigCtrlState, 'recentWalletDeepLink'> &
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
  const { width } = useOrientation();
  const Theme = useTheme();

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
      <View
        style={[styles.container, { width, backgroundColor: Theme.accent }]}
      >
        <ModalHeader onClose={ModalCtrl.close} />
        <View
          style={[
            styles.connectWalletContainer,
            { backgroundColor: Theme.background1 },
          ]}
        >
          <ModalRouter onCopyClipboard={config.onCopyClipboard} />
          <Toast />
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modal: {
    margin: 0,
    justifyContent: 'flex-end',
  },
  container: {
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  connectWalletContainer: {
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
  },
});
