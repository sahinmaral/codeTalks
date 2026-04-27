import { StyleSheet } from 'react-native';
import colors from '../../styles/colors';

const styles = StyleSheet.create({
  container: {
    borderStyle: 'dotted',
    borderWidth: 1,
    alignItems: 'center',
    borderRadius: 10,
    justifyContent: 'center',
    borderColor: colors.white,
    padding: 10,
  },
  text: { fontSize: 17, color: colors.white },
});

export default styles;
