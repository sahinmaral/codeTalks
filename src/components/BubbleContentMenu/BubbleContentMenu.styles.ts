import { Theme } from '@/styles/themes';
import { StyleSheet } from 'react-native';

const makeStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      borderRadius: 20,
      borderWidth: 1,
      paddingHorizontal: 20,
      borderBlockColor: theme.border,
    },
    sheetBackground: {
      backgroundColor: theme.surface,
    },
    handleIndicator: {
      backgroundColor: theme.text.tertiary,
    },
    contentContainer: {
      backgroundColor: theme.surface,
    },
    buttonsContainer: {
      paddingBottom: 36,
      paddingTop: 8,
    },
    menuItemContainer: {
      paddingVertical: 12,
    },
    menuItemText: {
      fontSize: 16,
      color: theme.text.primary,
    },
  });

export default makeStyles;
