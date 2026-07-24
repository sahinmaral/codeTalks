import { StyleSheet } from 'react-native';
import { Theme } from '../../styles/themes';

const makeStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      gap: 10,
    },
    labelRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    label: {
      fontSize: 16,
      color: theme.text.primary,
    },
    inputContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      borderRadius: 10,
      paddingHorizontal: 10,
      borderColor: theme.input.border,
      backgroundColor: theme.input.background,
      borderWidth: 1,
      gap: 8,
    },
    inputContainerMultiline: {
      alignItems: 'flex-start',
    },
    inputContainerFocused: {
      borderColor: theme.input.focusedBorder,
    },
    input: {
      flex: 1,
      paddingVertical: 10,
      fontFamily: 'Montserrat_400',
      color: theme.text.primary,
    },
    inputMultiline: {
      minHeight: 100,
      textAlignVertical: 'top',
    },
    footerRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    helperText: {
      flex: 1,
    },
  });

export default makeStyles;
