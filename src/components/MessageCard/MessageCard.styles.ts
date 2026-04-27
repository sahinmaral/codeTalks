import { StyleSheet } from 'react-native';
import colors from '../../styles/colors';

const styles = StyleSheet.create({
  text: { color: colors.black, fontSize: 15 },
  container: {
    borderRadius: 10,
    marginVertical: 10,
    backgroundColor: colors.white,
    padding: 10,
    gap: 15,
  },
  topContainer: { flexDirection: 'row', justifyContent: 'space-between' },
  bottomContainer: { alignContent: 'space-between' },
  bottomText: { fontSize: 17, fontWeight: 'bold' },
});

export default styles;
