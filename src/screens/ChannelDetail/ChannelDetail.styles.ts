import { StyleSheet } from 'react-native';
import colors from '@/styles/colors';

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.light },
  scrollView: { flex: 1 },
  scrollContent: { padding: 20, gap: 20 },
  card: {
    backgroundColor: colors.white,
    borderTopColor: colors.gray[300],
    borderRightColor: colors.gray[300],
    borderBottomColor: colors.gray[300],
    borderLeftColor: colors.gray[300],
    borderWidth: 1,
    borderRadius: 10,
  },
  adminCard: {
    borderLeftColor: colors.orange[400],
    borderLeftWidth: 4,
  },
  infoCard: { gap: 20, padding: 20 },
  identitySection: { gap: 10 },
  thumbnailContainer: {
    alignItems: 'center',
  },
  thumbnailRing: {
    height: 100,
    width: 100,
    borderRadius: 50,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 5,
  },
  thumbnail: {
    width: '100%',
    height: '100%',
    borderRadius: 50,
    backgroundColor: colors.orange[500],
    alignItems: 'center',
    justifyContent: 'center',
  },
  nameSection: {
    gap: 10,
  },
  centerText: {
    textAlign: 'center',
  },
  metaSection: {
    gap: 10,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  rowBordered: {
    borderBottomColor: colors.gray[300],
    borderBottomWidth: 1,
  },
  rowLeading: {
    flexDirection: 'row',
    gap: 10,
  },
});

export default styles;
