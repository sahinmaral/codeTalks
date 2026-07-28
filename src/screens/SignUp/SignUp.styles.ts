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
    // Absorbs the leftover vertical space rather than being a fixed height, so the form sheet below
    // can hug its content instead of stretching and leaving white space under the buttons. This
    // form is the tallest of the three auth screens, so minHeight is low: on a short device the
    // header gives up its space to the sheet rather than pushing content off-screen.
    headerContainer: {
      flex: 1,
      minHeight: 100,
      justifyContent: 'flex-end',
      alignItems: 'center',
      backgroundColor: colors.orange[500],
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
      gap: 32,
    },
    inputGroup: {
      gap: 20,
    },
    buttonGroup: {
      gap: 12,
    },
    signInOptionContainer: {
      flexDirection: 'row',
      justifyContent: 'center',
      gap: 5,
    },
  });

export default makeStyles;
