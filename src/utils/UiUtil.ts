import { LayoutAnimation } from 'react-native';

export const UiUtil = {
  layoutAnimation() {
    return LayoutAnimation.configureNext(
      LayoutAnimation.create(200, 'easeInEaseOut', 'opacity')
    );
  },
  getWalletName(name: string, short = false) {
    return short ? name.split(' ')[0] : name;
  },
};
