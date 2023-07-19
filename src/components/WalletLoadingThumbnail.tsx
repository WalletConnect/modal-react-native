import { useEffect, useRef } from 'react';
import { Animated, Easing, StyleSheet, View } from 'react-native';
import Svg, { Rect } from 'react-native-svg';

import useTheme from '../hooks/useTheme';

const AnimatedRect = Animated.createAnimatedComponent(Rect);

interface Props {
  children?: React.ReactNode;
  imageSize?: number;
  showError?: boolean;
}

function WalletLoadingThumbnail({ children, showError }: Props) {
  const Theme = useTheme();
  const spinValue = useRef(new Animated.Value(0));

  useEffect(() => {
    const animation = Animated.timing(spinValue.current, {
      toValue: 1,
      duration: 1150,
      useNativeDriver: true,
      easing: Easing.linear,
    });

    const loop = Animated.loop(animation);
    loop.start();

    return () => {
      loop.stop();
    };
  }, [spinValue]);

  const spin = spinValue.current.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -371],
  });

  return (
    <View style={styles.container}>
      <Svg width={110} height={110} viewBox="0 0 110 110" style={styles.loader}>
        <AnimatedRect
          x="2"
          y="2"
          width={106}
          height={106}
          rx={31}
          stroke={showError ? 'transparent' : Theme.accent}
          strokeWidth={2}
          fill="transparent"
          strokeDasharray={'116 255'}
          strokeDashoffset={spin}
        />
      </Svg>
      {showError && (
        <View
          style={[
            styles.error,
            {
              borderColor: Theme.negative,
            },
          ]}
        />
      )}
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  loader: {
    position: 'absolute',
  },
  error: {
    position: 'absolute',
    borderWidth: 2,
    height: 106,
    width: 106,
    borderRadius: 31,
  },
});

export default WalletLoadingThumbnail;
