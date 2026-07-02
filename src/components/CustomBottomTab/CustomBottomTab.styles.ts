import colors from '@/styles/colors';
import { Theme } from '@/styles/themes';
import { StyleSheet } from 'react-native';

const makeStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      flexDirection: 'row',
      backgroundColor: theme.surface,
      borderTopWidth: 1,
      borderColor: theme.border,
    },
    tab: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 10,
      gap: 4,
    },
    label: {
      fontSize: 11,
      fontFamily: 'Montserrat_600',
    },
    badge: {
      position: 'absolute',
      top: -4,
      right: -8,
      backgroundColor: colors.orange[500],
      borderRadius: 10,
      minWidth: 18,
      height: 18,
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: 4,
    },
    badgeText: {
      color: colors.white,
      fontSize: 10,
      fontFamily: 'Montserrat_700Bold',
    },
  });

export default makeStyles;
