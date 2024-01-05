import { useCallback, useEffect, useState } from 'react';
import { useSnapshot } from 'valtio';
import ModalHeader from '../../partials/wcm-modal-header';
import SearchBar from '../../components/SearchBar';
import { OptionsCtrl } from '../../controllers/OptionsCtrl';
import { WcConnectionCtrl } from '../../controllers/WcConnectionCtrl';
import { ThemeCtrl } from '../../controllers/ThemeCtrl';
import { RouterCtrl } from '../../controllers/RouterCtrl';
import { ApiCtrl } from '../../controllers/ApiCtrl';
import type { RouterProps } from '../../types/routerTypes';
import { useDebounceCallback } from '../../hooks/useDebounceCallback';
import { ConfigCtrl } from '../../controllers/ConfigCtrl';
import type { WcWallet } from '../../types/controllerTypes';
import { AllWalletsSearch } from '../../partials/wcm-all-wallets-search';
import { AllWalletsList } from '../../partials/wcm-all-wallets-list';
import styles from './styles';

function AllWalletsView({
  isPortrait,
  windowHeight,
  windowWidth,
}: RouterProps) {
  const { isDataLoaded } = useSnapshot(OptionsCtrl.state);
  const { pairingUri } = useSnapshot(WcConnectionCtrl.state);
  const { themeMode } = useSnapshot(ThemeCtrl.state);
  const { recentWallet } = useSnapshot(ConfigCtrl.state);
  const { wallets, recommended, installed, count, page } = useSnapshot(
    ApiCtrl.state
  );
  const shouldLoadWallets = wallets.length === 0;
  const [walletsLoading, setWalletsLoading] = useState(false);
  const loading = !isDataLoaded || !pairingUri || walletsLoading;
  const [searchValue, setSearch] = useState('');
  const [pageLoading, setPageLoading] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const columns = isPortrait ? 4 : 7;
  const itemWidth = Math.trunc(windowWidth / columns);

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

  const onWalletPress = (wallet: WcWallet) => {
    RouterCtrl.push('Connecting', { wallet });
  };

  const walletListTemplate = () => {
    if (searchValue.length > 0) {
      return (
        <AllWalletsSearch
          loading={searchLoading}
          columns={columns}
          itemWidth={itemWidth}
          windowHeight={windowHeight}
          isPortrait={isPortrait}
          onWalletPress={onWalletPress}
          themeMode={themeMode}
        />
      );
    }

    return (
      <AllWalletsList
        loading={loading}
        columns={columns}
        itemWidth={itemWidth}
        windowHeight={windowHeight}
        isPortrait={isPortrait}
        onWalletPress={onWalletPress}
        themeMode={themeMode}
        onFetchNextPage={fetchNextPage}
        list={walletList}
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
      {walletListTemplate()}
    </>
  );
}

export default AllWalletsView;
