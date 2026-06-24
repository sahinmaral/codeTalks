import { Theme } from '@/styles/themes';
import { StyleSheet } from 'react-native';

const makeStyles = (theme: Theme) =>
  StyleSheet.create({
    dividerContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
    },
    line: {
      flex: 1,
      height: 1,
      borderWidth: 1,
      borderRadius: 10,
      borderColor: theme.border,
      backgroundColor: theme.border,
    },
    text: {
      textAlign: 'center',
      paddingHorizontal: 10,
    },
  });

export default makeStyles;
