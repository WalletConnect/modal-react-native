import type { IProvider } from './coreTypes';

export type CaipAddress = `${string}:${string}:${string}`;

// -- ClientCtrl ------------------------------------------- //
export interface ClientCtrlState {
  initialized: boolean;
  provider?: IProvider;
  sessionTopic?: string;
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
  pairingEnabled: boolean;
  pairingError: boolean;
}

// -- ThemeCtrl --------------------------------------------- //
export interface ThemeCtrlState {
  themeMode?: 'dark' | 'light';
  accentColor?: string;
}

// -- ToastCtrl ------------------------------------------ //
export interface ToastCtrlState {
  open: boolean;
  message: string;
  variant: 'error' | 'success';
}

// -- RouterCtrl --------------------------------------------- //
export type RouterView =
  | 'ConnectWallet'
  | 'Qrcode'
  | 'WalletExplorer'
  | 'Connecting';

export interface RouterCtrlState {
  history: RouterView[];
  view: RouterView;
  data?: {
    wallet?: WcWallet;
  };
}

// -- ApiCtrl Types -------------------------------------------------------
export interface WcWallet {
  id: string;
  name: string;
  homepage?: string;
  image_id?: string;
  image_url?: string;
  order?: number;
  mobile_link?: string | null;
  desktop_link?: string | null;
  webapp_link?: string | null;
  app_store?: string | null;
  play_store?: string | null;
}

export interface DataWallet {
  id: string;
  ios_schema?: string;
  android_app_id?: string;
}

export interface ApiGetWalletsRequest {
  page: number;
  entries: number;
  search?: string;
  include?: string[];
  exclude?: string[];
}

export interface ApiGetWalletsResponse {
  data: WcWallet[];
  count: number;
}

export interface ApiGetDataWalletsResponse {
  data: DataWallet[];
  count: number;
}
