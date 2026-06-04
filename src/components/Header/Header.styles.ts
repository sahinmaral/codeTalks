import colors from '@/styles/colors';
import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: { backgroundColor: colors.light },
  headerContainer: {
    backgroundColor: colors.orange[500],
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  content: {
    flexDirection: 'column',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 16,
  },
  firstSection: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  secondSection: {
    gap: 5,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
  },
  backButtonContainer: {
    backgroundColor: colors.orange[400],
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconButtonContainer: {
    backgroundColor: colors.orange[400],
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 40,
    height: 40,
  },
});

export default styles;
