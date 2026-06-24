import { StyleSheet } from 'react-native';
import { Theme } from '@/styles/themes';

const makeStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      flexDirection: 'row',
      backgroundColor: theme.surface,
      borderTopWidth: 1,
      borderColor: theme.border,
    },
    tab: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 10,
      gap: 4,
    },
    label: {
      fontSize: 11,
      fontFamily: 'Montserrat_600',
    },
  });

export default makeStyles;
