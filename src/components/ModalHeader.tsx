import { useState, type ReactNode, useEffect } from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';
import { useSnapshot } from 'valtio';

import useTheme from '../hooks/useTheme';
import Backward from '../assets/Backward';
import { RouterCtrl } from '../controllers/RouterCtrl';
import Touchable from './Touchable';

interface Props {
  title?: string;
  onActionPress?: () => void;
  actionIcon?: ReactNode;
  actionDisabled?: boolean;
  shadow?: boolean;
  children?: ReactNode;
}

function ModalHeader({
  title,
  onActionPress,
  actionIcon,
  actionDisabled,
  shadow,
  children,
}: Props) {
  const Theme = useTheme();
  const { history } = useSnapshot(RouterCtrl.state);
  const [showBack, setShowBack] = useState(false);

  useEffect(() => {
    setShowBack(history.length > 1);
  }, [history]);

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: Theme.background1 },
        shadow &&
          StyleSheet.flatten([
            styles.shadow,
            {
              shadowColor: Theme.background1,
            },
          ]),
      ]}
    >
      {showBack ? (
        <Touchable
          style={styles.button}
          onPress={RouterCtrl.goBack}
          disabled={actionDisabled}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Backward height={18} width={10} fill={Theme.accent} />
        </Touchable>
      ) : (
        <View style={styles.button} />
      )}
      {children}
      {title && (
        <Text style={[styles.title, { color: Theme.foreground1 }]}>
          {title}
        </Text>
      )}
      {actionIcon && onActionPress ? (
        <Touchable
          style={styles.button}
          onPress={onActionPress}
          disabled={actionDisabled}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          {actionIcon}
        </Touchable>
      ) : (
        <View style={styles.button} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    height: 56,
  },
  shadow: {
    zIndex: 1,
    ...Platform.select({
      ios: {
        shadowOpacity: 1,
        shadowOffset: { width: 0, height: 6 },
      },
    }),
  },
  button: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontWeight: '600',
    fontSize: 20,
    lineHeight: 24,
  },
});

export default ModalHeader;
