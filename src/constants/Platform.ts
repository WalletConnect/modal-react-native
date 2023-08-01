import { Platform } from 'react-native';

export const isAndroid = Platform.OS === 'android';
export const isIOS = Platform.OS === 'ios';

export const PLAYSTORE_REGEX =
  /^https?:\/\/(www\.)?play\.google\.com\/store\/apps\/details\?id=[\w\.]+(&[\w-]+(=[\w%-]*)?)*/;
