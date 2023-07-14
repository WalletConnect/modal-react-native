import { useMemo } from 'react';
import { useSnapshot } from 'valtio';

import { useOrientation } from '../hooks/useOrientation';
import QRCodeView from '../views/QRCodeView';
import ViewAllExplorer from '../views/ViewAllExplorer';
import { RouterCtrl } from '../controllers/RouterCtrl';
import InitialExplorer from '../views/InitialExplorer';
import ConnectingView from '../views/ConnectingView';

interface Props {
  onCopyClipboard?: (value: string) => void;
}

export function ModalRouter(props: Props) {
  const routerState = useSnapshot(RouterCtrl.state);
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
    <ViewComponent
      windowHeight={height}
      windowWidth={width}
      isPortrait={isPortrait}
      {...props}
    />
  );
}
