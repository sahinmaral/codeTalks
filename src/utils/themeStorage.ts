import AsyncStorage from '@react-native-async-storage/async-storage';
import { ThemeMode } from '../styles/themes';

const THEME_MODE_KEY = '@codetalks/themeMode';

const isThemeMode = (value: string | null): value is ThemeMode =>
  value === 'light' || value === 'dark' || value === 'system';

export const loadThemeMode = async (): Promise<ThemeMode | null> => {
  try {
    const stored = await AsyncStorage.getItem(THEME_MODE_KEY);
    return isThemeMode(stored) ? stored : null;
  } catch {
    return null;
  }
};

export const saveThemeMode = async (mode: ThemeMode): Promise<void> => {
  try {
    await AsyncStorage.setItem(THEME_MODE_KEY, mode);
  } catch {
    // ignore persistence errors
  }
};
