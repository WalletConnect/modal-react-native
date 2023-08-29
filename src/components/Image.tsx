import { useRef } from 'react';
import {
  Animated,
  Image as NativeImage,
  ImageProps as NativeProps,
} from 'react-native';
import { isIOS } from '../constants/Platform';

export type ImageProps = Omit<NativeProps, 'source'> & {
  source: string;
};

function Image({ source, style }: ImageProps) {
  const opacity = useRef(new Animated.Value(0));

  // Fade in image on load for iOS. Android does this by default.
  const onLoadEnd = () => {
    Animated.timing(opacity.current, {
      toValue: 1,
      duration: 200,
      useNativeDriver: true,
    }).start();
  };

  return isIOS ? (
    <Animated.Image
      source={{ uri: source }}
      onLoadEnd={onLoadEnd}
      style={[{ opacity: opacity.current }, style]}
    />
  ) : (
    <NativeImage source={{ uri: source }} style={style} />
  );
}

export default Image;
