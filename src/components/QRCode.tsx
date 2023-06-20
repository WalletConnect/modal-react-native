import { memo, useMemo } from 'react';
import { Svg } from 'react-native-svg';
import { View, StyleSheet } from 'react-native';

import { QRCodeUtil } from '../utils/QRCodeUtil';
import WCLogo from '../assets/WCLogo';
import { DarkTheme, LightTheme } from '../constants/Colors';

interface Props {
  uri: string;
  size: number;
  theme?: 'light' | 'dark';
}

function QRCode({ uri, size, theme = 'light' }: Props) {
  const Theme = theme === 'light' ? LightTheme : DarkTheme;

  const dots = useMemo(
    () => QRCodeUtil.generate(uri, size, size / 4, 'light'),
    [uri, size]
  );

  return (
    <View
      style={[styles.container, { backgroundColor: LightTheme.background1 }]}
    >
      <Svg height={size} width={size}>
        {dots}
      </Svg>
      <WCLogo width={size / 4} fill={Theme.accent} style={styles.logo} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 32,
    padding: 16,
    alignSelf: 'center',
  },
  logo: {
    position: 'absolute',
  },
});

export default memo(QRCode);
