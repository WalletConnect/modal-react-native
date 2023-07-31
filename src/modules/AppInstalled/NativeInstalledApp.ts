import { TurboModule, TurboModuleRegistry } from 'react-native';

export interface Spec extends TurboModule {
  isAppInstalled(deepLink?: string, packageName?: string): Promise<boolean>;
}

export default TurboModuleRegistry.getEnforcing<Spec>('InstalledApp');
