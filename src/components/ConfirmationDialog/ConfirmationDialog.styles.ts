import { StyleSheet, ViewStyle } from 'react-native';
import colors from '../../styles/colors';

export type ConfirmationDialogTheme = 'danger' | 'warning' | 'primary' | 'success';

type ThemeStyle = {
  accent: string;
  iconBackground: string;
  confirmButtonTheme: 'danger' | 'warning' | 'primary' | 'success';
};

export const dialogThemes: Record<ConfirmationDialogTheme, ThemeStyle> = {
  danger: {
    accent: colors.red[500],
    iconBackground: '#fee2e2',
    confirmButtonTheme: 'danger',
  },
  warning: {
    accent: colors.orange[500],
    iconBackground: colors.orange[100],
    confirmButtonTheme: 'primary',
  },
  primary: {
    accent: colors.orange[500],
    iconBackground: colors.orange[100],
    confirmButtonTheme: 'primary',
  },
  success: {
    accent: colors.green[500],
    iconBackground: colors.green[100],
    confirmButtonTheme: 'success',
  },
};

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
    zIndex: 1000,
    elevation: 1000,
  },
  card: {
    width: '100%',
    backgroundColor: colors.white,
    borderRadius: 20,
    paddingVertical: 28,
    paddingHorizontal: 20,
    alignItems: 'center',
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 6,
  },
  iconCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    textAlign: 'center',
    marginBottom: 8,
  },
  description: {
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 20,
  },
  actions: {
    width: '100%',
    gap: 10,
  },
  confirmButton: {
    paddingVertical: 12,
  } as ViewStyle,
  cancelButton: {
    paddingVertical: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.gray[200],
    backgroundColor: colors.white,
    justifyContent: 'center',
    alignItems: 'center',
  } as ViewStyle,
});

export default styles;
