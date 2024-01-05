import { memo } from 'react';
import { Text, StyleSheet, StyleProp, ViewStyle } from 'react-native';

import useTheme from '../hooks/useTheme';
import { UiUtil } from '../utils/UiUtil';
import Touchable from './Touchable';
import WalletImage from './WalletImage';
import { useSnapshot } from 'valtio';
import { ApiCtrl } from '../controllers/ApiCtrl';

interface Props {
  id: string;
  name: string;
  imageUrl?: string;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
  isRecent?: boolean;
}

export const WALLET_MARGIN = 8;
export const WALLET_WIDTH = 80;
export const WALLET_HEIGHT = 98;
export const WALLET_FULL_HEIGHT = WALLET_HEIGHT + WALLET_MARGIN * 2;

function _WalletItem({ id, name, imageUrl, style, isRecent, onPress }: Props) {
  const Theme = useTheme();
  const imageHeaders = ApiCtrl._getApiHeaders();

  const { installed } = useSnapshot(ApiCtrl.state);
  const isInstalled = !!installed?.find((wallet) => wallet.id === id);

  return (
    <Touchable onPress={onPress} key={id} style={[styles.container, style]}>
      <WalletImage size="md" url={imageUrl} imageHeaders={imageHeaders} />
      <Text
        style={[styles.name, { color: Theme.foreground1 }]}
        numberOfLines={1}
      >
        {UiUtil.getWalletName(name, true)}
      </Text>
      {(isRecent || isInstalled) && (
        <Text style={[styles.status, { color: Theme.foreground3 }]}>
          {isRecent ? 'RECENT' : 'INSTALLED'}
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
  name: {
    marginTop: 5,
    maxWidth: 100,
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 2,
  },
  status: {
    fontSize: 10,
    fontWeight: '700',
    textAlign: 'center',
  },
});

export const WalletItem = memo(_WalletItem, (prevProps, nextProps) => {
  return prevProps.name === nextProps.name;
});

export default WalletItem;
