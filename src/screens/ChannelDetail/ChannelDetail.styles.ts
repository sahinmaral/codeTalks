import colors from '@/styles/colors';
import { Theme } from '@/styles/themes';
import { StyleSheet } from 'react-native';

const makeStyles = (theme: Theme) =>
  StyleSheet.create({
    container: { flex: 1, backgroundColor: theme.background.secondary },
    scrollView: { flex: 1 },
    scrollContent: { padding: 20, gap: 20 },
    card: {
      backgroundColor: theme.surface,
      borderTopColor: theme.border,
      borderRightColor: theme.border,
      borderBottomColor: theme.border,
      borderLeftColor: theme.border,
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
      backgroundColor: colors.orange[100],
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
      borderBottomColor: theme.border,
      borderBottomWidth: 1,
    },
    rowLeading: {
      flexDirection: 'row',
      gap: 10,
    },
  });

export default makeStyles;
