import { Dimensions, StyleSheet } from 'react-native';
import colors from '../../../styles/colors';

const styles = StyleSheet.create({
  modalContainer: {
    justifyContent: 'space-between',
    backgroundColor: colors.stone[100],
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    height: Dimensions.get('window').height / 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  inputContainer: { flex: 6 / 10 },
  inputItem: { width: Dimensions.get('window').width - 40, paddingLeft: 0 },
  inputError: { color: colors.red[500], fontWeight: '600' },
  button: { flex: 2 / 10, width: Dimensions.get('window').width - 40 },
  headerContainer: { flex: 2 / 10 },
  headerText: { fontSize: 20, fontWeight: 'bold' },
});

export default styles;
