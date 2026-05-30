import colors from '@/styles/colors';
import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.light,
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
  loadingSection: {
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 30,
  },
  loadingText: {
    fontSize: 16,
    color: colors.gray[500],
    textAlign: 'center',
  },
  dotsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.orange[500],
  },
  version: {
    fontSize: 13,
    color: colors.stone[300],
    marginTop: 40,
  },
});

export default styles;
