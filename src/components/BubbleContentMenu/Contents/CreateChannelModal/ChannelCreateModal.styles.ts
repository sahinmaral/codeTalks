import colors from '@/styles/colors';
import { StyleSheet } from 'react-native';

const inputBase = {
  borderRadius: 20,
  borderWidth: 1,
  borderColor: colors.gray[100],
  padding: 10,
  fontFamily: 'Montserrat_400',
};

const styles = StyleSheet.create({
  formContainer: {
    gap: 20,
  },
  formGroup: {},
  input: inputBase,
  textArea: {
    ...inputBase,
    backgroundColor: colors.stone[100],
    borderRadius: 10,
    height: 100,
    textAlignVertical: 'top',
  },
  inputError: { color: colors.red[500], fontWeight: '600' },
  button: {},
});

export default styles;
