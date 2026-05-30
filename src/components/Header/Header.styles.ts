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
    height: 100,
    gap: 5,
    paddingHorizontal: 20,
  },
  firstSection: {
    flex: 0.7,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  secondSection: {
    flex: 0.3,
    gap: 5,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
    paddingBottom: 16,
  },
  backButtonContainer: {
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
