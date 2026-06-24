import { Theme } from '@/styles/themes';
import colors from '@/styles/colors';
import { StyleSheet } from 'react-native';

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
    segmentContainer: {
      flexDirection: 'row',
      backgroundColor: theme.background.tertiary,
      borderRadius: 14,
      padding: 4,
      gap: 4,
    },
    segment: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 6,
      paddingVertical: 10,
      borderRadius: 10,
    },
    segmentActive: {
      backgroundColor: theme.surface,
      shadowColor: colors.black,
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.1,
      shadowRadius: 2,
      elevation: 2,
    },
    button: {},
  });
};

export default makeStyles;
