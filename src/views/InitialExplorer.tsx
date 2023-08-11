import { StyleSheet, View, ActivityIndicator } from 'react-native';
import { useSnapshot } from 'valtio';

import WalletItem, { WALLET_FULL_HEIGHT } from '../components/WalletItem';
import ViewAllBox from '../components/ViewAllBox';
import QRIcon from '../assets/QRCode';
import ModalHeader from '../components/ModalHeader';
import type { Listing } from '../types/controllerTypes';
import { RouterCtrl } from '../controllers/RouterCtrl';
import { OptionsCtrl } from '../controllers/OptionsCtrl';
import { WcConnectionCtrl } from '../controllers/WcConnectionCtrl';
import { ConfigCtrl } from '../controllers/ConfigCtrl';
import type { RouterProps } from '../types/routerTypes';
import useTheme from '../hooks/useTheme';
import { DataUtil } from '../utils/DataUtil';

function InitialExplorer({ isPortrait }: RouterProps) {
  const Theme = useTheme();
  const { isDataLoaded } = useSnapshot(OptionsCtrl.state);
  const { pairingUri } = useSnapshot(WcConnectionCtrl.state);
  const { explorerExcludedWalletIds } = useSnapshot(ConfigCtrl.state);
  const wallets = DataUtil.getInitialWallets();
  const recentWallet = DataUtil.getRecentWallet();
  const loading = !isDataLoaded || !pairingUri;
  const viewHeight = isPortrait ? WALLET_FULL_HEIGHT * 2 : WALLET_FULL_HEIGHT;

  const showViewAllButton =
    wallets.length > 8 || explorerExcludedWalletIds !== 'ALL';

  return (
    <>
      <ModalHeader
        title="Connect your wallet"
        onActionPress={() => RouterCtrl.push('Qrcode')}
        actionIcon={<QRIcon width={22} height={22} fill={Theme.accent} />}
      />
      {loading ? (
        <ActivityIndicator
          style={{ height: viewHeight }}
          color={Theme.accent}
        />
      ) : (
        <View
          style={[
            styles.explorerContainer,
            { height: viewHeight, backgroundColor: Theme.background1 },
          ]}
        >
          {wallets.slice(0, showViewAllButton ? 7 : 8).map((item: Listing) => (
            <WalletItem
              walletInfo={item}
              key={item.id}
              isRecent={item.id === recentWallet?.id}
              currentWCURI={pairingUri}
              style={isPortrait ? styles.portraitItem : styles.landscapeItem}
            />
          ))}
          {showViewAllButton && (
            <ViewAllBox
              onPress={() => RouterCtrl.push('WalletExplorer')}
              wallets={wallets.slice(-4)}
              style={isPortrait ? styles.portraitItem : styles.landscapeItem}
            />
          )}
        </View>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  explorerContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
  },
  portraitItem: {
    width: '25%',
  },
  landscapeItem: {
    width: '12.5%',
  },
});

export default InitialExplorer;
