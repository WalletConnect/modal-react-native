import {
  Image,
  StyleSheet,
  View,
  Text,
  StyleProp,
  ViewStyle,
} from 'react-native';

import { ExplorerCtrl } from '../controllers/ExplorerCtrl';
import useTheme from '../hooks/useTheme';
import type { Listing } from '../types/controllerTypes';
import Touchable from './Touchable';
import WalletIcon from '../assets/WalletIcon';

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
            <Image
              key={wallet.id}
              source={{
                uri: ExplorerCtrl.getWalletImageUrl(wallet.image_id),
              }}
              style={[styles.icon, { borderColor: Theme.overlayThin }]}
            />
          ))}
          {_emptyBoxes.map((_, i) => (
            <View
              key={i}
              style={[
                styles.icon,
                styles.placeholderIcon,
                {
                  borderColor: Theme.overlayThin,
                  backgroundColor: Theme.background2,
                },
              ]}
            >
              <WalletIcon height={15} width={15} />
            </View>
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
    width: 80,
    height: 80,
    alignItems: 'center',
    marginVertical: 16,
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
    height: 23,
    width: 23,
    borderRadius: 8,
    margin: 1,
    borderWidth: 1,
  },
  placeholderIcon: {
    alignItems: 'center',
    justifyContent: 'center',
    borderStyle: 'dashed',
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
