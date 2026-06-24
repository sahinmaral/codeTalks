import { StyleSheet } from 'react-native';
import { Theme } from '@/styles/themes';
import colors from '@/styles/colors';

const makeStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background.secondary,
      justifyContent: 'center',
      alignItems: 'center',
      gap: 20,
    },
    logoContainer: {
      width: 70,
      height: 70,
      borderRadius: 35,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: colors.orange[200],
    },
    contentContainer: { gap: 20 },
    header: { alignItems: 'center' },
    description: { alignItems: 'center' },
    channelCreatedAtContainer: {
      alignItems: 'center',
      justifyContent: 'center',
    },
    channelCreatedAtPillContainer: {
      padding: 10,
      borderRadius: 20,
      backgroundColor: theme.background.tertiary,
      borderWidth: 1,
      borderColor: colors.orange[200],
      flexDirection: 'row',
      gap: 10,
      justifyContent: 'center',
      alignItems: 'center',
    },
    text: { textAlign: 'center' },
  });

export default makeStyles;
