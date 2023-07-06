import { useRef, useState } from 'react';
import {
  Pressable,
  StyleProp,
  StyleSheet,
  TextInput,
  ViewStyle,
} from 'react-native';

import useTheme from '../hooks/useTheme';
import SearchIcon from '../assets/Search';

interface Props {
  onChangeText: (text: string) => void;
  style?: StyleProp<ViewStyle>;
}

function SearchBar({ onChangeText, style }: Props) {
  const Theme = useTheme();
  const inputRef = useRef<TextInput>(null);
  const [focused, setFocused] = useState(false);

  return (
    <Pressable
      onPress={() => inputRef.current?.focus()}
      style={[
        styles.container,
        {
          backgroundColor: Theme.background3,
          borderColor: focused ? Theme.accent : Theme.overlayThin,
        },
        style,
      ]}
    >
      <SearchIcon style={styles.icon} />
      <TextInput
        autoCapitalize="none"
        autoComplete="off"
        autoCorrect={false}
        spellCheck={false}
        ref={inputRef}
        placeholder="Search wallets"
        onChangeText={onChangeText}
        returnKeyType="search"
        placeholderTextColor={Theme.foreground2}
        clearButtonMode="while-editing"
        cursorColor={Theme.accent}
        disableFullscreenUI
        style={[styles.input, { color: Theme.foregroundInverse }]}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderRadius: 100,
    height: 28,
    padding: 4,
    borderWidth: 1,
    alignItems: 'center',
    flexDirection: 'row',
  },
  icon: {
    marginHorizontal: 8,
  },
  input: {
    flex: 1,
    padding: 0,
    fontSize: 14,
  },
});

export default SearchBar;
