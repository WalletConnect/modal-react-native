import { Image, ImageStyle, StyleProp, StyleSheet, View } from 'react-native';
import useTheme from '../hooks/useTheme';
import WalletIcon from '../assets/WalletIcon';

interface Props {
  url?: string;
  size: number;
  style?: StyleProp<ImageStyle>;
}

function WalletImage({ url, size, style }: Props) {
  const Theme = useTheme();
  return url ? (
    <Image
      style={[
        styles.icon,
        {
          borderColor: Theme.overlayThin,
          height: size,
          width: size,
          borderRadius: size / 3.5,
        },
        style,
      ]}
      source={{
        uri: url,
      }}
    />
  ) : (
    <View
      style={[
        styles.icon,
        styles.placeholderIcon,
        {
          backgroundColor: Theme.background2,
          borderColor: Theme.overlayThin,
          height: size,
          width: size,
          borderRadius: size / 3.5,
        },
        style,
      ]}
    >
      <WalletIcon height={size / 2} width={size / 2} />
    </View>
  );
}

const styles = StyleSheet.create({
  icon: {
    borderWidth: 1,
  },
  placeholderIcon: {
    alignItems: 'center',
    justifyContent: 'center',
    borderStyle: 'dashed',
    borderWidth: 1,
  },
});

export default WalletImage;
