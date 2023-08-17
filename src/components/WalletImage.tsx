import { ImageStyle, StyleProp, StyleSheet, View } from 'react-native';
import useTheme from '../hooks/useTheme';
import WalletIcon from '../assets/WalletIcon';
import Image from './Image';

interface Props {
  size: 'xs' | 'sm' | 'md' | 'lg';
  url?: string;
  style?: StyleProp<ImageStyle>;
}

const sizeMap = {
  xs: 23,
  sm: 30,
  md: 60,
  lg: 90,
};

function WalletImage({ url, size, style }: Props) {
  const Theme = useTheme();
  const sizeNum = sizeMap[size];

  return url ? (
    <Image
      style={[
        styles.icon,
        {
          borderColor: Theme.overlayThin,
          height: sizeNum,
          width: sizeNum,
          borderRadius: sizeNum / 3.5,
        },
        style,
      ]}
      source={url}
    />
  ) : (
    <View
      style={[
        styles.icon,
        styles.placeholderIcon,
        {
          backgroundColor: Theme.background2,
          borderColor: Theme.overlayThin,
          height: sizeNum,
          width: sizeNum,
          borderRadius: sizeNum / 3.5,
        },
        style,
      ]}
    >
      <WalletIcon height={sizeNum / 2} width={sizeNum / 2} />
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
