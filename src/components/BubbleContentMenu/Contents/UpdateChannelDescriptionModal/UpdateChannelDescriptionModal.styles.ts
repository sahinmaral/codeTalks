import { StyleSheet } from 'react-native';
import { Theme } from '@/styles/themes';
import colors from '@/styles/colors';

const makeStyles = (theme: Theme) => {
  const inputBase = {
    borderRadius: 20,
    borderWidth: 1,
    borderColor: theme.input.border,
    backgroundColor: theme.input.background,
    color: theme.text.primary,
    padding: 10,
    fontFamily: 'Montserrat_400',
  };

  return StyleSheet.create({
    formContainer: {
      gap: 20,
    },
    header: { paddingVertical: 10 },
    description: {
      paddingBottom: 15,
    },
    input: inputBase,
    inputFocused: {
      borderColor: theme.input.focusedBorder,
    },
    textArea: {
      ...inputBase,
      borderRadius: 10,
      height: 100,
      textAlignVertical: 'top',
    },
    inputError: { color: colors.red[500], fontWeight: '600' },
    formGroup: { gap: 10 },
    button: {},
  });
};

export default makeStyles;
