import colors from '@/styles/colors';
import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.light },
  searchContainer: { backgroundColor: colors.white, paddingHorizontal: 15, paddingVertical: 10 },
  scrollView: { flex: 1 },
  scrollContent: { gap: 20 },
  adminMembersHeader: { borderTopWidth: 1, borderTopColor: colors.gray[200], padding: 10 },
  adminMembersList: { gap: 10 },
});

export default styles;
