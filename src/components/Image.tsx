import { useRef } from 'react';
import { Animated, ImageProps as NativeProps } from 'react-native';

export type ImageProps = Omit<NativeProps, 'source'> & {
  source: string;
};

function Image({ source, style }: ImageProps) {
  const opacity = useRef(new Animated.Value(0));

  const onLoadEnd = () => {
    Animated.timing(opacity.current, {
      toValue: 1,
      duration: 200,
      useNativeDriver: true,
    }).start();
  };

  return (
    <Animated.Image
      source={{ uri: source }}
      onLoadEnd={onLoadEnd}
      style={[{ opacity: opacity.current }, style]}
    />
  );
}

export default Image;
