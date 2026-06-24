import { StyleSheet } from 'react-native';
import { Theme } from '@/styles/themes';
import colors from '@/styles/colors';

const makeStyles = (theme: Theme) =>
  StyleSheet.create({
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
    },
    box: {
      width: 24,
      height: 24,
      borderRadius: 4,
      borderWidth: 1.5,
      borderColor: theme.border,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: theme.input.background,
    },
    boxChecked: {
      backgroundColor: colors.orange[500],
      borderColor: colors.orange[500],
    },
    boxDisabled: {
      backgroundColor: theme.background.tertiary,
      borderColor: theme.border,
    },
    labelDisabled: {
      color: theme.text.secondary,
    },
  });

export default makeStyles;
