import colors from '@/styles/colors';
import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: { flex: 1 },
  searchContainer: { paddingHorizontal: 15, paddingTop: 15 },
  descriptionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginHorizontal: 15,
    marginTop: 15,
    padding: 12,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: colors.orange[500],
    backgroundColor: colors.orange[50],
  },
  descriptionText: { flex: 1, fontWeight: '600' },
  scrollView: { flex: 1, marginVertical: 15 },
  scrollContent: { gap: 20 },
  membersHeader: { borderTopWidth: 1, borderTopColor: colors.gray[200], padding: 10 },
  membersList: { gap: 10, paddingHorizontal: 10 },
});

export default styles;
