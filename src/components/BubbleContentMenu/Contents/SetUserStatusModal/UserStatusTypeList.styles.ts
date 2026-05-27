import colors from '@/styles/colors';
import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: { borderWidth: 1, borderColor: colors.gray[300], borderRadius: 20 },
  cardContainer: {
    gap: 10,
    padding: 10,
    borderBottomColor: colors.gray[300],
    flexDirection: 'row',
  },
  cardPillContainer: { flex: 1 / 10, justifyContent: 'center', alignItems: 'center' },
  contentContainer: { flex: 8 / 10 },
  checkContainer: { flex: 1 / 10, justifyContent: 'center', alignItems: 'center' },
});

export default styles;
