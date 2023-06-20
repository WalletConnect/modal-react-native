export default () => ({
  expo: {
    name: 'walletconnect-modal-rn-example',
    slug: 'walletconnect-modal-rn-example',
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
      supportsTablet: true,
    },
    android: {
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
        projectId: 'c731a682-cac7-4f3b-838d-bd79ae66b994',
      },
      PROJECT_ID: process.env.PROJECT_ID || null,
    },
    updates: {
      url: 'https://u.expo.dev/c731a682-cac7-4f3b-838d-bd79ae66b994',
    },
    runtimeVersion: {
      policy: 'sdkVersion',
    },
    owner: 'nachinn.s',
  },
});
