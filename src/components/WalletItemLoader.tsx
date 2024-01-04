import { StyleSheet, type StyleProp, type ViewStyle, View } from 'react-native';

import { Shimmer } from './Shimmer';
import { WALLET_HEIGHT, WALLET_WIDTH } from './WalletItem';

export const WalletItemLoaderHeight = 98;

export interface WalletItemLoaderProps {
  style?: StyleProp<ViewStyle>;
}

export function WalletItemLoader({ style }: WalletItemLoaderProps) {
  return (
    <View style={[styles.container, style]}>
      <Shimmer height={60} width={60} borderRadius={17} />
      <Shimmer height={14} width={52} borderRadius={6} style={styles.text} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: WALLET_HEIGHT,
    alignItems: 'center',
    justifyContent: 'center',
    width: WALLET_WIDTH,
    borderRadius: 16,
  },
  text: {
    marginTop: 8,
  },
});
