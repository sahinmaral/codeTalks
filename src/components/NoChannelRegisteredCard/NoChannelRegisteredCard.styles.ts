import { StyleSheet } from 'react-native';
import colors from '@/styles/colors';

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
    padding: 30,
    flex: 1,
  },
  logoContainer: {
    backgroundColor: colors.orange[200],
    width: 70,
    height: 70,
    borderRadius: 35,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textContainer: {
    gap: 8,
    marginTop: 10,
  },
  buttonGroupContainer: { width: '100%', gap: 10, marginTop: 20 },
  button: { paddingVertical: 10 },
});

export default styles;
