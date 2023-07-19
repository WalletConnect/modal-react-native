import { useMemo } from 'react';
import { useSnapshot } from 'valtio';

import { useOrientation } from '../hooks/useOrientation';
import QRCodeView from '../views/QRCodeView';
import ViewAllExplorer from '../views/ViewAllExplorer';
import { RouterCtrl } from '../controllers/RouterCtrl';
import InitialExplorer from '../views/InitialExplorer';
import ConnectingView from '../views/ConnectingView';
import useTheme from '../hooks/useTheme';
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
        return InitialExplorer;
      case 'WalletExplorer':
        return ViewAllExplorer;
      case 'Qrcode':
        return QRCodeView;
      case 'Connecting':
        return ConnectingView;
      default:
        return InitialExplorer;
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
