import { useMemo } from 'react';
import { StyleSheet, View, ActivityIndicator } from 'react-native';
import { useSnapshot } from 'valtio';

import WalletItem, { ITEM_HEIGHT } from '../components/WalletItem';
import ViewAllBox from '../components/ViewAllBox';
import QRIcon from '../assets/QRCode';
import NavHeader from '../components/NavHeader';
import type { Listing } from '../types/controllerTypes';
import { RouterCtrl } from '../controllers/RouterCtrl';
import { ExplorerCtrl } from '../controllers/ExplorerCtrl';
import { OptionsCtrl } from '../controllers/OptionsCtrl';
import { WcConnectionCtrl } from '../controllers/WcConnectionCtrl';
import type { RouterProps } from '../types/routerTypes';
import useTheme from '../hooks/useTheme';

function InitialExplorer({ isPortrait }: RouterProps) {
  const Theme = useTheme();
  const { isDataLoaded } = useSnapshot(OptionsCtrl.state);
  const { pairingUri } = useSnapshot(WcConnectionCtrl.state);
  const { recommendedWallets } = useSnapshot(ExplorerCtrl.state);
  const loading = !isDataLoaded || !pairingUri;

  const wallets = useMemo(() => {
    return recommendedWallets.slice(0, 7);
  }, [recommendedWallets]);

  const viewAllButtonWallets = useMemo(() => {
    return recommendedWallets.slice(-4);
  }, [recommendedWallets]);

  return (
    <>
      <NavHeader
        title="Connect your wallet"
        onActionPress={() => RouterCtrl.push('Qrcode')}
        actionIcon={<QRIcon width={22} height={22} fill={Theme.accent} />}
      />
      {loading ? (
        <ActivityIndicator
          style={styles.loadingContainer}
          color={Theme.accent}
        />
      ) : (
        <View style={styles.explorerContainer}>
          {wallets.map((item: Listing) => (
            <WalletItem
              walletInfo={item}
              key={item.id}
              currentWCURI={pairingUri}
              style={isPortrait && styles.wallet}
            />
          ))}
          <ViewAllBox
            onPress={() => RouterCtrl.push('WalletExplorer')}
            wallets={viewAllButtonWallets}
            style={isPortrait && styles.wallet}
          />
        </View>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  explorerContainer: {
    height: ITEM_HEIGHT * 2,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingContainer: {
    height: ITEM_HEIGHT * 2,
  },
  wallet: {
    width: '25%',
  },
});

export default InitialExplorer;
