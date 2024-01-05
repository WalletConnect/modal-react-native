import { Appearance } from 'react-native';
import { proxy } from 'valtio';

// -- Types ---------------------------------------- //
export interface ThemeCtrlState {
  themeMode?: 'dark' | 'light';
  accentColor?: string;
}

// -- State ---------------------------------------- //
const state = proxy<ThemeCtrlState>({
  themeMode: Appearance.getColorScheme() ?? 'light',
  accentColor: undefined,
});

// -- Controller ---------------------------------------- //
export const ThemeCtrl = {
  state,

  setThemeMode(themeMode?: ThemeCtrlState['themeMode'] | null) {
    state.themeMode = themeMode ?? Appearance.getColorScheme() ?? 'light';
  },

  setAccentColor(accentColor?: ThemeCtrlState['accentColor']) {
    state.accentColor = accentColor;
  },
};
