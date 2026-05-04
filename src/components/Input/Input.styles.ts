import { StyleSheet } from 'react-native';
import colors from '../../styles/colors';

const styles = StyleSheet.create({
  container: {
    gap: 10,
  },
  label: {
    fontSize: 16,
    color: colors.black,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 10,
    paddingHorizontal: 10,
    borderColor: colors.stone[300],
    borderWidth: 1,
    gap: 8,
  },
  inputContainerFocused: {
    borderColor: colors.gray[500],
  },
  input: {
    flex: 1,
    paddingVertical: 10,
    fontFamily: 'Montserrat_400',
    color: colors.gray[500],
  },
});

export default styles;
