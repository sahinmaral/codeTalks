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
    // Asymmetric on purpose. The container already adds the bottom safe-area inset (~34pt on a
    // home-indicator device), which is all the clearance the labels need below them — padding there
    // would stack on top of it. Above the icons there is no such inset, so the breathing room has to
    // come from paddingTop, or the content sits flush against the top border.
    tab: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      paddingTop: 10,
      paddingBottom: 0,
      gap: 2,
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
