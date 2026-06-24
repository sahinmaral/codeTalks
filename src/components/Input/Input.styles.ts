import { StyleSheet } from 'react-native';
import { Theme } from '../../styles/themes';

const makeStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      gap: 10,
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
    inputContainerFocused: {
      borderColor: theme.input.focusedBorder,
    },
    input: {
      flex: 1,
      paddingVertical: 10,
      fontFamily: 'Montserrat_400',
      color: theme.text.primary,
    },
  });

export default makeStyles;
