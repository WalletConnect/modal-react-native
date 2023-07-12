// https://github.com/expo/expo/issues/17270#issuecomment-1445149952
// Polyfill for expo-crypto until issue with react-native-get-random-values is solved
// Apply only with Expo SDK 48
// For Expo SDK >= 49, install react-native-get-random-values@1.9.0 and copy expo config "exclude" in package.json

import { getRandomValues as expoCryptoGetRandomValues } from 'expo-crypto';

class Crypto {
  getRandomValues = expoCryptoGetRandomValues;
}

// eslint-disable-next-line no-undef
const webCrypto = typeof crypto !== 'undefined' ? crypto : new Crypto();

(() => {
  if (typeof crypto === 'undefined') {
    Object.defineProperty(window, 'crypto', {
      configurable: true,
      enumerable: true,
      get: () => webCrypto,
    });
  }
})();
