import { useMemo } from 'react';
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

function ViewAllExplorer({
  isPortrait,
  windowHeight,
  windowWidth,
}: RouterProps) {
  const Theme = useTheme();
  const optionsState = useSnapshot(OptionsCtrl.state);
  const wcConnectionState = useSnapshot(WcConnectionCtrl.state);
  const themeState = useSnapshot(ThemeCtrl.state);
  const loading = !optionsState.isDataLoaded || !wcConnectionState.pairingUri;
  const wallets = useMemo(() => {
    return ExplorerCtrl.state.wallets.listings;
  }, []);

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
          data={wallets || []}
          style={{
            maxHeight:
              Math.round(windowHeight * 0.6) - (StatusBar.currentHeight || 0),
          }}
          contentContainerStyle={styles.listContentContainer}
          indicatorStyle={themeState.themeMode === 'dark' ? 'white' : 'black'}
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
              currentWCURI={wcConnectionState.pairingUri}
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
