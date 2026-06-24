import { Theme } from '@/styles/themes';
import { StyleSheet } from 'react-native';

const makeStyles = (theme: Theme) =>
  StyleSheet.create({
    headerContainer: {
      paddingTop: 10,
      gap: 8,
      alignItems: 'center',
    },
    avatarContainer: {
      width: 60,
      height: 60,
      borderRadius: 30,
      backgroundColor: theme.background.tertiary,
    },
    avatarProfilePhoto: {
      width: 60,
      height: 60,
      borderRadius: 30,
    },
    requestedAtPill: {
      paddingVertical: 6,
      paddingHorizontal: 12,
      borderRadius: 20,
      backgroundColor: theme.background.tertiary,
    },
    actionListContainer: {
      gap: 12,
      paddingVertical: 30,
    },
    blockHelperText: {
      textAlign: 'center',
    },
  });

export default makeStyles;
