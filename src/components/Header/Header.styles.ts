import { Theme } from '@/styles/themes';
import { StyleSheet } from 'react-native';

const makeStyles = (theme: Theme) =>
  StyleSheet.create({
    container: { backgroundColor: theme.background.secondary },
    headerContainer: {
      borderBottomLeftRadius: 30,
      borderBottomRightRadius: 30,
    },
    content: {
      flexDirection: 'column',
      alignItems: 'center',
      gap: 5,
      paddingHorizontal: 20,
      paddingTop: 12,
      paddingBottom: 16,
    },
    firstSection: {
      width: '100%',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    secondSection: {
      gap: 5,
      width: '100%',
      justifyContent: 'center',
      alignItems: 'center',
      flexDirection: 'column',
    },
    backButtonContainer: {
      width: 50,
      height: 50,
      borderRadius: 25,
      justifyContent: 'center',
      alignItems: 'center',
    },
    iconButtonContainer: {
      width: 50,
      height: 50,
      borderRadius: 25,
      justifyContent: 'center',
      alignItems: 'center',
    },
    logo: {
      width: 40,
      height: 40,
    },
  });

export default makeStyles;
