import { StyleSheet, View, Text, StyleProp, ViewStyle } from 'react-native';

import { ExplorerCtrl } from '../controllers/ExplorerCtrl';
import useTheme from '../hooks/useTheme';
import type { Listing } from '../types/controllerTypes';
import Touchable from './Touchable';
import { WALLET_HEIGHT, WALLET_WIDTH, WALLET_MARGIN } from './WalletItem';
import WalletImage from './WalletImage';

interface Props {
  onPress: any;
  wallets: Listing[];
  style?: StyleProp<ViewStyle>;
}

function ViewAllBox({ onPress, wallets, style }: Props) {
  const Theme = useTheme();
  const _wallets = wallets.slice(0, 4);
  const _emptyBoxes = Array.from(Array(4 - _wallets.length).keys());

  return (
    <Touchable onPress={onPress} style={[styles.container, style]}>
      <View style={[styles.icons, { borderColor: Theme.overlayThin }]}>
        <View style={styles.row}>
          {_wallets.map((wallet) => (
            <WalletImage
              key={wallet.id}
              size="xs"
              url={ExplorerCtrl.getWalletImageUrl(wallet.image_id)}
              style={styles.icon}
            />
          ))}
          {_emptyBoxes.map((_, i) => (
            <WalletImage key={i} size="xs" style={styles.icon} />
          ))}
        </View>
      </View>
      <View>
        <Text
          style={[styles.text, { color: Theme.foreground1 }]}
          numberOfLines={1}
        >
          View All
        </Text>
      </View>
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
  icons: {
    height: 60,
    width: 60,
    borderRadius: 16,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    margin: 1,
  },
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    marginTop: 5,
    maxWidth: 100,
    fontWeight: '600',
    fontSize: 12,
    textAlign: 'center',
  },
});

export default ViewAllBox;
