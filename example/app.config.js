export default () => ({
  expo: {
    name: 'walletconnect-modal-react-native-example',
    slug: 'walletconnect-modal-react-native-example',
    version: '1.0.0',
    orientation: 'default',
    icon: './assets/icon.png',
    scheme: 'rnwalletconnectmodalexpo',
    userInterfaceStyle: 'automatic',
    splash: {
      image: './assets/splash.png',
      resizeMode: 'contain',
      backgroundColor: '#ffffff',
    },
    assetBundlePatterns: ['**/*'],
    ios: {
      bundleIdentifier: 'com.walletconnect.modal.rnexample',
      supportsTablet: true,
      infoPlist: {
        LSApplicationQueriesSchemes: [
          'trust',
          'rainbow',
          'awallet',
          'uniswap',
          'zerion',
          'metamask',
        ],
      },
    },
    android: {
      package: 'com.walletconnect.modal.rnexample',
      adaptiveIcon: {
        foregroundImage: './assets/adaptive-icon.png',
        backgroundColor: '#ffffff',
      },
    },
    web: {
      favicon: './assets/favicon.png',
    },
    extra: {
      eas: {
        projectId: 'f477ced2-c06e-470c-adcc-2c997a90cc4e',
      },
    },
    updates: {
      url: 'https://u.expo.dev/f477ced2-c06e-470c-adcc-2c997a90cc4e',
    },
    runtimeVersion: {
      policy: 'sdkVersion',
    },
    owner: 'nacho.walletconnect',
  },
});
