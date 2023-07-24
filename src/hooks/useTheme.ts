import { useSnapshot } from 'valtio';
import { DarkTheme, LightTheme } from '../constants/Colors';
import { ThemeCtrl } from '../controllers/ThemeCtrl';

function useTheme() {
  const { themeMode, themeVariables } = useSnapshot(ThemeCtrl.state);
  const Theme = themeMode === 'dark' ? DarkTheme : LightTheme;
  if (themeVariables) return Object.assign(Theme, themeVariables);

  return themeMode === 'dark' ? DarkTheme : LightTheme;
}

export default useTheme;
