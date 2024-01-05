import { View, FlatList } from 'react-native';
import { useSnapshot } from 'valtio';
import useTheme from '../../hooks/useTheme';
import WalletItem, {
  WALLET_FULL_HEIGHT,
  WALLET_MARGIN,
} from '../../components/WalletItem';
import type { WcWallet } from '../../types/controllerTypes';
import { AssetUtil } from '../../utils/AssetUtil';
import { ConfigCtrl } from '../../controllers/ConfigCtrl';
import styles from './styles';
import { WalletItemLoader } from '../../components/WalletItemLoader';

export interface AllWalletsListProps {
  columns: number;
  itemWidth: number;
  windowHeight: number;
  themeMode?: 'dark' | 'light';
  isPortrait: boolean;
  onWalletPress: (wallet: WcWallet) => void;
  loading: boolean;
  onFetchNextPage: () => void;
  list: WcWallet[];
}

export function AllWalletsList({
  columns,
  itemWidth,
  windowHeight,
  themeMode,
  isPortrait,
  onWalletPress,
  loading,
  onFetchNextPage,
  list,
}: AllWalletsListProps) {
  const { recentWallet } = useSnapshot(ConfigCtrl.state);
  const Theme = useTheme();

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

  const renderWallet = ({ item }: { item: WcWallet }) => {
    return (
      <WalletItem
        id={item.id}
        name={item.name}
        isRecent={item.id === recentWallet?.id}
        onPress={() => onWalletPress(item)}
        imageUrl={AssetUtil.getWalletImage(item)}
        style={{ width: itemWidth }}
      />
    );
  };

  if (loading) {
    return loadingTemplate(20);
  }

  return (
    <FlatList
      data={list}
      style={{
        height: Math.round(windowHeight * 0.6),
        backgroundColor: Theme.background1,
      }}
      contentContainerStyle={styles.listContentContainer}
      indicatorStyle={themeMode === 'dark' ? 'white' : 'black'}
      showsVerticalScrollIndicator
      numColumns={columns}
      fadingEdgeLength={20}
      onEndReached={onFetchNextPage}
      onEndReachedThreshold={2}
      key={isPortrait ? 'portrait' : 'landscape'}
      getItemLayout={(_data, index) => ({
        length: WALLET_FULL_HEIGHT,
        offset: WALLET_FULL_HEIGHT * index,
        index,
      })}
      renderItem={renderWallet}
    />
  );
}
