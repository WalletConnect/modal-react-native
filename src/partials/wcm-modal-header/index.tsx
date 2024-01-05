import { useState, type ReactNode, useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useSnapshot } from 'valtio';

import useTheme from '../../hooks/useTheme';
import Backward from '../../assets/Backward';
import { RouterCtrl } from '../../controllers/RouterCtrl';
import Touchable from '../../components/Touchable';
import styles from './styles';

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

export default ModalHeader;
