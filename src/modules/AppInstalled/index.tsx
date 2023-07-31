import { NativeModules, Platform, Linking } from 'react-native';

const LINKING_ERROR =
  `The package 'react-native-installed-app' doesn't seem to be linked. Make sure: \n\n` +
  '- You rebuilt the app after installing the package\n' +
  '- You are not using Expo\n';

// @ts-expect-error
const isTurboModuleEnabled = global.__turboModuleProxy != null;

const InstalledAppModule = isTurboModuleEnabled
  ? Platform.OS === 'android'
    ? require('./NativeInstalledApp').default
    : undefined
  : NativeModules.InstalledApp;

const InstalledApp = InstalledAppModule
  ? InstalledAppModule
  : new Proxy(
      {},
      {
        get() {
          throw new Error(LINKING_ERROR);
        },
      }
    );

async function isAppInstalledIos(deepLink?: string): Promise<boolean> {
  try {
    return deepLink ? Linking.canOpenURL(deepLink) : Promise.resolve(false);
  } catch (error) {
    return Promise.resolve(false);
  }
}

async function isAppInstalledAndroid(packageName?: string): Promise<boolean> {
  try {
    return packageName
      ? InstalledApp.isAppInstalled(packageName)
      : Promise.resolve(false);
  } catch (error) {
    return Promise.resolve(false);
  }
}

export async function isAppInstalled(
  deepLink?: string,
  packageName?: string
): Promise<boolean> {
  try {
    return Platform.select({
      ios: isAppInstalledIos(deepLink),
      android: isAppInstalledAndroid(packageName),
      default: Promise.resolve(false),
    });
  } catch (error) {
    Promise.resolve(false);
  }
  return Promise.resolve(false);
}
