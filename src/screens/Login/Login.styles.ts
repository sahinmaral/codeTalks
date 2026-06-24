import { StyleSheet } from 'react-native';
import { Theme } from '../../styles/themes';
import colors from '../../styles/colors';

const makeStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.orange[500],
    },
    scrollContent: {
      flexGrow: 1,
    },
    headerContainer: {
      height: 200,
      justifyContent: 'flex-end',
      alignItems: 'center',
    },
    logoContainer: {
      width: 80,
      height: 80,
      marginBottom: 20,
      borderRadius: 20,
      backgroundColor: colors.white,
      justifyContent: 'center',
      alignItems: 'center',
    },
    logo: {
      width: 80,
      height: 80,
    },
    formContainer: {
      flexGrow: 1,
      backgroundColor: theme.background.primary,
      borderTopStartRadius: 20,
      borderTopEndRadius: 20,
      paddingTop: 20,
      paddingHorizontal: 20,
      paddingBottom: 20,
      gap: 20,
    },
    description: {
      gap: 5,
    },
    formInputsContainer: {
      flex: 1,
      justifyContent: 'space-between',
      gap: 32,
    },
    inputGroup: {
      gap: 20,
    },
    additionalOptionsContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    buttonGroup: {
      gap: 12,
    },
  });

export default makeStyles;
