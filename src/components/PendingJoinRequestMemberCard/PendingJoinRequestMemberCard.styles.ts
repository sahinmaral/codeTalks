import { Theme } from '@/styles/themes';
import { StyleSheet } from 'react-native';

const makeStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      padding: 10,
      backgroundColor: theme.surface,
      flexDirection: 'column',
      borderWidth: 1,
      borderColor: theme.border,
      borderRadius: 10,
      gap: 10,
    },
    userInformationsContainer: {
      flexDirection: 'row',
      gap: 10,
    },
    userInformationContainer: { flex: 7 / 10 },
    actionsContainer: {
      flexDirection: 'row',
      gap: 10,
      justifyContent: 'flex-start',
    },
    statusCreateAtContainer: {
      flex: 3 / 10,
      alignItems: 'flex-end',
    },
  });

export default makeStyles;
