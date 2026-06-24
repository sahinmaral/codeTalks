import { StyleSheet } from 'react-native';
import { Theme } from '@/styles/themes';
import colors from '@/styles/colors';

const makeStyles = (theme: Theme) =>
  StyleSheet.create({
    container: { flex: 1, backgroundColor: theme.background.secondary },
    textInputContainer: {
      flex: 1,
      justifyContent: 'center',
    },
    textInput: {
      backgroundColor: theme.input.background,
      color: theme.text.primary,
      borderRadius: 20,
      paddingHorizontal: 20,
      paddingTop: 10,
      paddingBottom: 10,
      fontFamily: 'Montserrat_400',
      minHeight: 44,
      maxHeight: 120,
      textAlignVertical: 'center',
    },
    sendMessageButtonContainer: {
      justifyContent: 'center',
      alignItems: 'flex-end',
    },
    sendMessageButton: {
      width: 50,
      height: 50,
      borderRadius: 25,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: colors.orange[400],
    },
    sendMessageButtonDisabled: {
      backgroundColor: theme.text.tertiary,
    },
    dateSeparatorContainer: {
      alignItems: 'center',
      marginVertical: 4,
    },
    dateSeparatorPill: {
      backgroundColor: theme.background.tertiary,
      paddingHorizontal: 12,
      paddingVertical: 4,
      borderRadius: 12,
    },
    dateSeparatorText: {
      fontFamily: 'Montserrat_400',
      fontSize: 12,
      color: theme.text.secondary,
    },
  });

export default makeStyles;
