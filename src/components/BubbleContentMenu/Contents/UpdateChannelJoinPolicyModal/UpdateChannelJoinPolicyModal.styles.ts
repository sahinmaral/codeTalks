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
  header: { paddingVertical: 10 },
  description: {
    paddingBottom: 15,
  },
  input: inputBase,
  inputFocused: {
    borderColor: colors.orange[400],
  },
  textArea: {
    ...inputBase,
    backgroundColor: colors.stone[100],
    borderRadius: 10,
    height: 100,
    textAlignVertical: 'top',
  },
  inputError: { color: colors.red[500], fontWeight: '600' },
  formGroup: { gap: 10 },
  segmentContainer: {
    flexDirection: 'row',
    backgroundColor: colors.stone[100],
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
    backgroundColor: colors.white,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  button: {},
});

export default styles;
