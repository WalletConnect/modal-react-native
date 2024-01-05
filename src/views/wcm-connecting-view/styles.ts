import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  walletContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  image: {
    height: 96,
    width: 96,
    borderRadius: 28,
  },
  continueText: {
    marginTop: 20,
    fontSize: 16,
    fontWeight: '600',
  },
  retryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
  },
  retryIcon: {
    marginLeft: 4,
  },
  text: {
    color: 'white',
    fontWeight: '500',
    fontSize: 14,
  },
  alternateText: {
    marginTop: 16,
  },
  getText: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  storeText: {
    fontSize: 14,
    fontWeight: '600',
  },
  footer: {
    width: '100%',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  upperFooter: {
    alignItems: 'center',
    paddingVertical: 16,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  lowerFooter: {
    paddingHorizontal: 20,
    paddingTop: 14,
    paddingBottom: 24,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  storeIcon: {
    marginLeft: 4,
  },
});
