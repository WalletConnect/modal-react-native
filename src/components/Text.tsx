import { StyleProp, Text as RNText, TextStyle, TextProps } from 'react-native';
import useTheme from '../hooks/useTheme';

interface Props extends TextProps {
  children: React.ReactNode;
  style?: StyleProp<TextStyle>;
}

function Text({ children, style, ...props }: Props) {
  const Theme = useTheme();
  return (
    <RNText style={[{ color: Theme.foreground1 }, style]} {...props}>
      {children}
    </RNText>
  );
}

export default Text;
