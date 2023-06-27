import { useEffect, useState } from 'react';
import {
  StyleSheet,
  FlatList,
  ActivityIndicator,
  StatusBar,
} from 'react-native';
import { useSnapshot } from 'valtio';

import WalletItem, { ITEM_HEIGHT } from '../components/WalletItem';
import NavHeader from '../components/NavHeader';
import { RouterCtrl } from '../controllers/RouterCtrl';
import { ExplorerCtrl } from '../controllers/ExplorerCtrl';
import { OptionsCtrl } from '../controllers/OptionsCtrl';
import { WcConnectionCtrl } from '../controllers/WcConnectionCtrl';
import type { RouterProps } from '../types/routerTypes';
import useTheme from '../hooks/useTheme';
import { ThemeCtrl } from '../controllers/ThemeCtrl';
import { UiUtil } from '../utils/UiUtil';

function ViewAllExplorer({
  isPortrait,
  windowHeight,
  windowWidth,
}: RouterProps) {
  const Theme = useTheme();
  const { isDataLoaded } = useSnapshot(OptionsCtrl.state);
  const { pairingUri } = useSnapshot(WcConnectionCtrl.state);
  const { themeMode } = useSnapshot(ThemeCtrl.state);
  const { wallets, recommendedWallets } = useSnapshot(ExplorerCtrl.state);
  const shouldLoadWallets = wallets.listings.length === 0;
  const [walletsLoading, setWalletsLoading] = useState(false);
  const loading = !isDataLoaded || !pairingUri || walletsLoading;
  const _wallets = [...recommendedWallets, ...wallets.listings];

  useEffect(() => {
    if (!loading) {
      UiUtil.layoutAnimation();
    }
  }, [loading]);

  useEffect(() => {
    async function getWallets() {
      if (shouldLoadWallets) {
        setWalletsLoading(true);
        await ExplorerCtrl.getWallets();
        setWalletsLoading(false);
      }
    }
    getWallets();
  }, [shouldLoadWallets]);

  return (
    <>
      <NavHeader
        title="Connect your wallet"
        onBackPress={RouterCtrl.goBack}
        shadow
      />
      {loading ? (
        <ActivityIndicator
          style={{ height: Math.round(windowHeight * 0.6) }}
          color={Theme.accent}
        />
      ) : (
        <FlatList
          data={_wallets}
          style={{
            maxHeight:
              Math.round(windowHeight * 0.6) - (StatusBar.currentHeight || 0),
          }}
          contentContainerStyle={styles.listContentContainer}
          indicatorStyle={themeMode === 'dark' ? 'white' : 'black'}
          showsVerticalScrollIndicator
          numColumns={isPortrait ? 4 : 6}
          key={isPortrait ? 'portrait' : 'landscape'}
          getItemLayout={(_data, index) => ({
            length: ITEM_HEIGHT,
            offset: ITEM_HEIGHT * index,
            index,
          })}
          renderItem={({ item }) => (
            <WalletItem
              currentWCURI={pairingUri}
              walletInfo={item}
              style={{
                width: isPortrait
                  ? Math.round(windowWidth / 4)
                  : Math.round(windowWidth / 7),
              }}
            />
          )}
        />
      )}
    </>
  );
}

const styles = StyleSheet.create({
  listContentContainer: {
    paddingBottom: 12,
    alignItems: 'center',
  },
});

export default ViewAllExplorer;
