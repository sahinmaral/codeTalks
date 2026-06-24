import { Theme } from '@/styles/themes';
import { StyleSheet } from 'react-native';

const makeStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background.primary,
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
    errorSection: {
      width: '100%',
      alignItems: 'center',
      gap: 12,
      paddingHorizontal: 30,
    },
    errorText: {
      color: theme.text.primary,
      textAlign: 'center',
    },
    errorTextDescription: {
      color: theme.text.secondary,
      textAlign: 'center',
    },
    buttonGroup: {
      marginTop: 20,
      width: '80%',
      gap: 15,
    },
    button: { paddingVertical: 10 },
    version: {
      fontSize: 13,
      color: theme.text.tertiary,
      marginTop: 40,
    },
  });

export default makeStyles;
