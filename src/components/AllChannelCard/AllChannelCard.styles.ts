import colors from '@/styles/colors';
import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    borderRadius: 30,
    borderWidth: 1,
    borderColor: colors.stone[300],
    flexDirection: 'column',
    padding: 20,
    gap: 12,
    backgroundColor: colors.white,
    shadowColor: colors.gray[700],
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
  },
  titleContainer: { flex: 1, flexDirection: 'column' },
  memberContainer: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  description: {},
  thumbnailPhoto: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.orange[100],
  },
  joinButton: {
    marginTop: 4,
  },
});

export default styles;
