import { useSnapshot } from 'valtio';
import { DarkTheme, LightTheme } from '../constants/Colors';
import { ThemeCtrl } from '../controllers/ThemeCtrl';

function useTheme() {
  const { themeMode, accentColor } = useSnapshot(ThemeCtrl.state);
  const Theme = themeMode === 'dark' ? DarkTheme : LightTheme;
  if (accentColor) return Object.assign(Theme, { accent: accentColor });

  return themeMode === 'dark' ? DarkTheme : LightTheme;
}

export default useTheme;
