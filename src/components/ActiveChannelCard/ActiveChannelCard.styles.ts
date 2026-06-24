import colors from '@/styles/colors';
import { Theme } from '@/styles/themes';
import { StyleSheet } from 'react-native';

const makeStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      borderRadius: 30,
      borderWidth: 1,
      borderColor: theme.border,
      flexDirection: 'column',
      padding: 20,
      gap: 10,
      backgroundColor: theme.surface,
      shadowColor: colors.gray[700],
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.08,
      shadowRadius: 8,
      elevation: 2,
    },
    firstSection: { flex: 8 / 10, flexDirection: 'row', justifyContent: 'space-between' },
    description: { flex: 2 / 10 },
    headerContainer: {
      flex: 9 / 10,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 15,
    },
    titleContainer: { flexDirection: 'column' },
    memberContainer: { flexDirection: 'row', alignItems: 'center', gap: 5 },
    unreadMessageContainer: { flex: 1 / 10 },
    unreadMessageBadge: {
      width: 30,
      height: 30,
      borderRadius: 15,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: colors.orange[500],
    },
    thumbnailPhoto: {
      width: 40,
      height: 40,
      borderRadius: 20,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: colors.orange[100],
    },
  });

export default makeStyles;
