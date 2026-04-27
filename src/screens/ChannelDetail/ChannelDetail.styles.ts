import { StyleSheet } from 'react-native';
import colors from '../../styles/colors';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.orange[400],
    padding: 15,
  },
  photoContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
});

export default styles;
