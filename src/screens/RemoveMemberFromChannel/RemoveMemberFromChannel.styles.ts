import { Theme } from '@/styles/themes';
import { StyleSheet } from 'react-native';

const makeStyles = (theme: Theme) =>
  StyleSheet.create({
    container: { flex: 1, backgroundColor: theme.background.secondary },
    searchContainer: { backgroundColor: theme.surface, paddingHorizontal: 15, paddingVertical: 10 },
    scrollView: { flex: 1 },
    scrollContent: { gap: 20 },
    adminMembersHeader: { borderTopWidth: 1, borderTopColor: theme.border, padding: 10 },
    adminMembersList: { gap: 10 },
  });

export default makeStyles;
