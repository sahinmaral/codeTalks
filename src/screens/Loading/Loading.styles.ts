import colors from '@/styles/colors';
import { Theme } from '@/styles/themes';
import { StyleSheet } from 'react-native';

const makeStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background.secondary,
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingVertical: 80,
    },
    main: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
    logo: {
      width: 110,
      height: 110,
    },
    appName: {
      letterSpacing: 1,
      fontSize: 28,
      fontWeight: 'bold',
      color: theme.text.primary,
      marginTop: 14,
    },
    loadingSection: {
      alignItems: 'center',
      gap: 12,
      paddingHorizontal: 30,
    },
    loadingText: {
      fontSize: 16,
      color: theme.text.secondary,
      textAlign: 'center',
    },
    dotsRow: {
      flexDirection: 'row',
      gap: 8,
    },
    dot: {
      width: 10,
      height: 10,
      borderRadius: 5,
      backgroundColor: colors.orange[500],
    },
    version: {
      fontSize: 13,
      color: theme.text.tertiary,
      marginTop: 40,
    },
  });

export default makeStyles;
