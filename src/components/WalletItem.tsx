import { Image, Text, StyleSheet, StyleProp, ViewStyle } from 'react-native';

import type { Listing } from '../types/controllerTypes';
import { ExplorerUtil } from '../utils/ExplorerUtil';
import useTheme from '../hooks/useTheme';
import { ExplorerCtrl } from '../controllers/ExplorerCtrl';
import { DataUtil } from '../utils/DataUtil';
import { UiUtil } from '../utils/UiUtil';
import Touchable from './Touchable';

interface Props {
  currentWCURI?: string;
  walletInfo: Listing;
  style?: StyleProp<ViewStyle>;
  isRecent?: boolean;
}

export const WALLET_MARGIN = 8;
export const WALLET_WIDTH = 80;
export const WALLET_HEIGHT = 98;
export const WALLET_FULL_HEIGHT = WALLET_HEIGHT + WALLET_MARGIN * 2;

function WalletItem({ currentWCURI, walletInfo, style, isRecent }: Props) {
  const Theme = useTheme();

  const onPress = () => {
    if (currentWCURI) {
      DataUtil.setRecentWallet(walletInfo);
      ExplorerUtil.navigateDeepLink(
        walletInfo.mobile.universal,
        walletInfo.mobile.native,
        currentWCURI
      );
    }
  };

  return (
    <Touchable
      onPress={onPress}
      key={walletInfo.id}
      style={[styles.container, style]}
    >
      <Image
        style={[styles.icon, { borderColor: Theme.overlayThin }]}
        source={{
          uri: ExplorerCtrl.getWalletImageUrl(walletInfo.image_id),
        }}
      />

      <Text
        style={[styles.name, { color: Theme.foreground1 }]}
        numberOfLines={1}
      >
        {UiUtil.getWalletName(walletInfo.name, true)}
      </Text>
      {isRecent && (
        <Text style={[styles.recent, { color: Theme.foreground3 }]}>
          RECENT
        </Text>
      )}
    </Touchable>
  );
}

const styles = StyleSheet.create({
  container: {
    width: WALLET_WIDTH,
    height: WALLET_HEIGHT,
    alignItems: 'center',
    marginVertical: WALLET_MARGIN,
  },
  icon: {
    height: 60,
    width: 60,
    borderRadius: 16,
    borderWidth: 1,
  },
  name: {
    marginTop: 5,
    maxWidth: 100,
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 2,
  },
  recent: {
    fontSize: 10,
    fontWeight: '700',
    textAlign: 'center',
  },
});

export default WalletItem;
