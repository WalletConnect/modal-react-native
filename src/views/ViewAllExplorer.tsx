import { useCallback, useEffect, useState } from 'react';
import { StyleSheet, FlatList, View } from 'react-native';
import { useSnapshot } from 'valtio';

import WalletItem, {
  WALLET_FULL_HEIGHT,
  WALLET_MARGIN,
} from '../components/WalletItem';
import ModalHeader from '../components/ModalHeader';
import SearchBar from '../components/SearchBar';
import Text from '../components/Text';
import { OptionsCtrl } from '../controllers/OptionsCtrl';
import { WcConnectionCtrl } from '../controllers/WcConnectionCtrl';
import { ThemeCtrl } from '../controllers/ThemeCtrl';
import { RouterCtrl } from '../controllers/RouterCtrl';
import { ApiCtrl } from '../controllers/ApiCtrl';
import type { RouterProps } from '../types/routerTypes';
import useTheme from '../hooks/useTheme';
import { useDebounceCallback } from '../hooks/useDebounceCallback';
import { AssetUtil } from '../utils/AssetUtil';
import { ConfigCtrl } from '../controllers/ConfigCtrl';
import type { WcWallet } from '../types/controllerTypes';
import { WalletItemLoader } from '../components/WalletItemLoader';

function ViewAllExplorer({
  isPortrait,
  windowHeight,
  windowWidth,
}: RouterProps) {
  const Theme = useTheme();
  const { isDataLoaded } = useSnapshot(OptionsCtrl.state);
  const { pairingUri } = useSnapshot(WcConnectionCtrl.state);
  const { themeMode } = useSnapshot(ThemeCtrl.state);
  const { recentWallet } = useSnapshot(ConfigCtrl.state);
  const { wallets, recommended, installed, search, count, page } = useSnapshot(
    ApiCtrl.state
  );
  const shouldLoadWallets = wallets.length === 0;
  const [walletsLoading, setWalletsLoading] = useState(false);
  const loading = !isDataLoaded || !pairingUri || walletsLoading;
  const [searchValue, setSearch] = useState('');
  const [pageLoading, setPageLoading] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const itemWidth = isPortrait
    ? Math.trunc(windowWidth / 4)
    : Math.trunc(windowWidth / 7);

  const filterOutRecentWallet = (list: WcWallet[]): WcWallet[] => {
    if (!recentWallet) return list;

    const filtered = list.filter((wallet) => wallet.id !== recentWallet.id);
    return filtered;
  };

  const walletList = recentWallet
    ? [
        recentWallet,
        ...filterOutRecentWallet([...installed, ...recommended, ...wallets]),
      ]
    : filterOutRecentWallet([...installed, ...recommended, ...wallets]);

  const searchWallets = useCallback(async (value: string) => {
    setSearch(value);
    if (value.length > 0) {
      setSearchLoading(true);
      await ApiCtrl.searchWallet({ search: value });
      setSearchLoading(false);
    }
  }, []);

  const fetchNextPage = async () => {
    if (walletList.length < count && !pageLoading) {
      setPageLoading(true);
      await ApiCtrl.fetchWallets({ page: page + 1 });
      setPageLoading(false);
    }
  };

  const loadingTemplate = (items: number) => {
    return (
      <View
        style={[
          styles.loaderContainer,
          { height: Math.round(windowHeight * 0.6) },
        ]}
      >
        {Array.from({ length: items }).map((_, index) => (
          <WalletItemLoader
            key={index}
            style={{
              marginBottom: WALLET_MARGIN * 2,
              width: itemWidth,
            }}
          />
        ))}
      </View>
    );
  };

  const emptyTemplate = () => {
    return (
      <View
        style={[
          styles.emptyContainer,
          { height: Math.round(windowHeight * 0.6) },
        ]}
      >
        <Text style={[styles.emptyText, { color: Theme.foreground2 }]}>
          No results found
        </Text>
      </View>
    );
  };

  const renderWallet = ({ item }: { item: WcWallet }) => {
    return (
      <WalletItem
        currentWCURI={pairingUri}
        id={item.id}
        name={item.name}
        isRecent={item.id === recentWallet?.id}
        onPress={() => RouterCtrl.push('Connecting', { wallet: item })}
        imageUrl={AssetUtil.getWalletImage(item)}
        style={{ width: itemWidth }}
      />
    );
  };

  const onChangeText = useDebounceCallback({ callback: searchWallets });

  useEffect(() => {
    async function getWallets() {
      if (shouldLoadWallets) {
        setWalletsLoading(true);
        await ApiCtrl.fetchWallets({ page: 1 });
        setWalletsLoading(false);
      }
    }
    getWallets();
  }, [shouldLoadWallets]);

  return (
    <>
      <ModalHeader shadow>
        <SearchBar onChangeText={onChangeText} style={styles.searchbar} />
      </ModalHeader>
      {loading || searchLoading ? (
        loadingTemplate(20)
      ) : (
        <FlatList
          data={searchValue.length ? search : walletList}
          style={{
            height: Math.round(windowHeight * 0.6),
            backgroundColor: Theme.background1,
          }}
          contentContainerStyle={styles.listContentContainer}
          indicatorStyle={themeMode === 'dark' ? 'white' : 'black'}
          showsVerticalScrollIndicator
          numColumns={isPortrait ? 4 : 7}
          fadingEdgeLength={20}
          onEndReached={fetchNextPage}
          onEndReachedThreshold={2}
          ListEmptyComponent={emptyTemplate()}
          key={isPortrait ? 'portrait' : 'landscape'}
          getItemLayout={(_data, index) => ({
            length: WALLET_FULL_HEIGHT,
            offset: WALLET_FULL_HEIGHT * index,
            index,
          })}
          renderItem={renderWallet}
        />
      )}
    </>
  );
}

const styles = StyleSheet.create({
  listContentContainer: { paddingBottom: 12 },
  searchbar: { marginLeft: 16 },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '600',
  },
  loaderContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
});

export default ViewAllExplorer;
