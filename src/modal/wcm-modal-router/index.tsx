import { useMemo } from 'react';
import { useSnapshot } from 'valtio';

import { useOrientation } from '../../hooks/useOrientation';
import QRCodeView from '../../views/wcm-qr-code-view';
import AllWalletsView from '../../views/wcm-all-wallets-view';
import { RouterCtrl } from '../../controllers/RouterCtrl';
import ConnectView from '../../views/wcm-connect-view';
import ConnectingView from '../../views/wcm-connecting-view';
import useTheme from '../../hooks/useTheme';
import { StyleSheet, View } from 'react-native';

interface Props {
  onCopyClipboard?: (value: string) => void;
}

export function ModalRouter(props: Props) {
  const routerState = useSnapshot(RouterCtrl.state);
  const Theme = useTheme();
  const { height, width, isPortrait } = useOrientation();

  const ViewComponent = useMemo(() => {
    switch (routerState.view) {
      case 'ConnectWallet':
        return ConnectView;
      case 'WalletExplorer':
        return AllWalletsView;
      case 'Qrcode':
        return QRCodeView;
      case 'Connecting':
        return ConnectingView;
      default:
        return ConnectView;
    }
  }, [routerState.view]);

  return (
    <View style={[styles.wrapper, { backgroundColor: Theme.background1 }]}>
      <ViewComponent
        windowHeight={height}
        windowWidth={width}
        isPortrait={isPortrait}
        {...props}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
  },
});
