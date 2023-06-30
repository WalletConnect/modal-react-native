import type { IProviderMetadata, IProvider } from './coreTypes';

// -- ClientCtrl ------------------------------------------- //
export interface ClientCtrlState {
  initialized: boolean;
  provider?: IProvider;
  sessionTopic?: string;
}

// -- ConfigCtrl ------------------------------------------- //
export interface ConfigCtrlState {
  projectId: string;
  recentWalletDeepLink?: string;
  providerMetadata?: IProviderMetadata;
  explorerRecommendedWalletIds?: string[] | 'NONE';
  explorerExcludedWalletIds?: string[] | 'ALL';
}

// -- ModalCtrl --------------------------------------- //
export interface ModalCtrlState {
  open: boolean;
}

// -- OptionsCtrl --------------------------------------- //
export interface OptionsCtrlState {
  isDataLoaded: boolean;
}

// -- AccountCtrl --------------------------------------- //
export interface AccountCtrlState {
  address?: string;
  isConnected: boolean;
}

// -- WcConnectionCtrl ------------------------------------- //
export interface WcConnectionCtrlState {
  pairingUri: string;
  pairingError: boolean;
}

// -- ThemeCtrl --------------------------------------------- //
export interface ThemeCtrlState {
  themeMode?: 'dark' | 'light';
}

// -- ToastCtrl ------------------------------------------ //
export interface ToastCtrlState {
  open: boolean;
  message: string;
  variant: 'error' | 'success';
}

// -- ExplorerCtrl ------------------------------------------- //
export interface ExplorerCtrlState {
  wallets: ListingResponse & { page: number };
  recommendedWallets: Listing[];
}

export interface ListingParams {
  page?: number;
  search?: string;
  entries?: number;
  version?: number;
  chains?: string;
  recommendedIds?: string;
  excludedIds?: string;
}

export interface PlatformInfo {
  native: string;
  universal: string;
}

export interface Listing {
  id: string;
  name: string;
  homepage: string;
  image_id: string;
  app: {
    browser: string;
    ios: string;
    android: string;
    mac: string;
    window: string;
    linux: string;
  };
  mobile: PlatformInfo;
  desktop: PlatformInfo;
}

export interface ListingResponse {
  listings: Listing[];
  total: number;
}

// -- RouterCtrl --------------------------------------------- //
export type RouterView = 'ConnectWallet' | 'Qrcode' | 'WalletExplorer';

export interface RouterCtrlState {
  history: RouterView[];
  view: RouterView;
}
