import { StyleSheet } from 'react-native';
import { Theme } from '../../styles/themes';
import colors from '../../styles/colors';

const makeStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.orange[500],
    },
    scrollView: {
      flex: 1,
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
    },
    inputGroup: {
      gap: 20,
    },
    buttonGroup: {
      gap: 12,
      marginTop: 24,
    },
    signInOptionContainer: {
      flexDirection: 'row',
      justifyContent: 'center',
      gap: 5,
    },
    footerContainer: {
      backgroundColor: theme.background.primary,
      paddingHorizontal: 20,
    },
    phoneLabel: {
      fontSize: 16,
      color: theme.text.primary,
      marginBottom: 10,
    },
    phoneContainer: {
      width: '100%',
      backgroundColor: theme.background.primary,
      flexDirection: 'row',
      gap: 8,
    },
    phoneFlagButton: {
      borderRadius: 10,
      borderWidth: 1,
      borderColor: theme.input.border,
      paddingHorizontal: 10,
    },
    phoneTextContainer: {
      flex: 1,
      borderRadius: 10,
      borderWidth: 1,
      borderColor: theme.input.border,
      backgroundColor: theme.input.background,
      paddingVertical: 0,
    },
    phoneTextInput: {
      fontFamily: 'Montserrat_400',
      color: theme.text.primary,
      height: 44,
      fontSize: 14,
    },
    phoneCodeText: {
      fontFamily: 'Montserrat_400',
      color: theme.text.primary,
      fontSize: 14,
    },
  });

export default makeStyles;
