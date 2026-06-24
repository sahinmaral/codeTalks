import colors from './colors';

export type ThemeMode = 'light' | 'dark' | 'system';

export interface Theme {
  mode: 'light' | 'dark';
  background: {
    primary: string;
    secondary: string;
    tertiary: string;
  };
  surface: string;
  border: string;
  text: {
    primary: string;
    secondary: string;
    tertiary: string;
  };
  primary: string;
  success: string;
  danger: string;
  input: {
    background: string;
    border: string;
    focusedBorder: string;
  };
}

export const lightTheme: Theme = {
  mode: 'light',
  background: {
    primary: colors.white,
    secondary: colors.light,
    tertiary: colors.gray[100],
  },
  surface: colors.white,
  border: colors.gray[300],
  text: {
    primary: colors.black,
    secondary: colors.gray[500],
    tertiary: colors.gray[400],
  },
  primary: colors.orange[500],
  success: colors.success,
  danger: colors.danger,
  input: {
    background: colors.white,
    border: colors.stone[300],
    focusedBorder: colors.orange[500],
  },
};

export const darkTheme: Theme = {
  mode: 'dark',
  background: {
    primary: '#121212',
    secondary: '#1E1E1E',
    tertiary: '#2D2D2D',
  },
  surface: '#1E1E1E',
  border: '#2D2D2D',
  text: {
    primary: '#FFFFFF',
    secondary: '#9E9E9E',
    tertiary: '#757575',
  },
  primary: '#FF8C00',
  success: '#4CAF50',
  danger: '#F44336',
  input: {
    background: '#2D2D2D',
    border: '#3D3D3D',
    focusedBorder: '#FF8C00',
  },
};
