import colors from '@/styles/colors';
import { Theme } from '@/styles/themes';
import { StyleSheet } from 'react-native';

const makeStyles = (theme: Theme) =>
  StyleSheet.create({
    container: { flex: 1, backgroundColor: theme.background.secondary },
    scrollView: { flex: 1 },
    scrollContent: { padding: 20, gap: 20 },
    avatarSection: {
      alignItems: 'center',
      gap: 8,
    },
    avatarWrapper: {
      position: 'relative',
    },
    cameraBadge: {
      position: 'absolute',
      bottom: 0,
      right: 0,
      width: 30,
      height: 30,
      borderRadius: 15,
      backgroundColor: colors.orange[500],
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 2,
      borderColor: theme.background.secondary,
    },
    sectionLabel: {
      marginTop: 5,
    },
    card: {
      backgroundColor: theme.surface,
      borderRadius: 15,
      padding: 20,
      gap: 20,
      shadowColor: colors.gray[700],
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.08,
      shadowRadius: 8,
      elevation: 2,
    },
    optionalBadge: {
      backgroundColor: theme.background.tertiary,
      borderRadius: 8,
      paddingHorizontal: 8,
      paddingVertical: 2,
    },
  });

export default makeStyles;
