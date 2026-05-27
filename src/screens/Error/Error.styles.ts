import colors from '@/styles/colors';
import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 80,
  },
  main: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: 110,
    height: 110,
  },
  appName: {
    letterSpacing: 1,
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.black,
    marginTop: 14,
  },
  errorSection: {
    width: '100%',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 30,
  },
  errorTextDescription: {
    color: colors.gray[500],
    textAlign: 'center',
  },
  buttonGroup: {
    marginTop: 20,
    width: '80%',
    gap: 15,
  },
  button: { paddingVertical: 10 },
  version: {
    fontSize: 13,
    color: colors.stone[300],
    marginTop: 40,
  },
});

export default styles;
