import { Theme } from '@/styles/themes';
import { StyleSheet } from 'react-native';

const makeStyles = (theme: Theme) =>
  StyleSheet.create({
    container: { borderWidth: 1, borderColor: theme.border, borderRadius: 20 },
    cardContainer: {
      gap: 10,
      padding: 10,
      borderBottomColor: theme.border,
      flexDirection: 'row',
    },
    cardPillContainer: { flex: 1 / 10, justifyContent: 'center', alignItems: 'center' },
    contentContainer: { flex: 8 / 10 },
    checkContainer: { flex: 1 / 10, justifyContent: 'center', alignItems: 'center' },
  });

export default makeStyles;
