import { useRef } from 'react';
import {
  Animated,
  Image as NativeImage,
  ImageProps as NativeProps,
  Platform,
} from 'react-native';

export type ImageProps = Omit<NativeProps, 'source'> & {
  source: string;
  headers?: Record<string, string>;
};

function Image({ source, headers, style, ...rest }: ImageProps) {
  const opacity = useRef(new Animated.Value(0));
  const isIOS = Platform.OS === 'ios';

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
      source={{ uri: source, headers }}
      onLoadEnd={onLoadEnd}
      style={[{ opacity: opacity.current }, style]}
      {...rest}
    />
  ) : (
    <NativeImage source={{ uri: source, headers }} style={style} {...rest} />
  );
}

export default Image;
