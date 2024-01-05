import { Platform, StyleSheet } from 'react-native';

export default StyleSheet.create({
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
