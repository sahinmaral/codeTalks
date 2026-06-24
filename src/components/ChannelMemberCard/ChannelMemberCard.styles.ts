import { Theme } from '@/styles/themes';
import { StyleSheet } from 'react-native';

const makeStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      padding: 10,
      backgroundColor: theme.surface,
      flexDirection: 'row',
      alignItems: 'center',
      overflow: 'hidden',
    },
    lockOverlay: {
      ...StyleSheet.absoluteFillObject,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'rgba(255, 255, 255, 0.6)',
    },
    infoContainer: { flex: 1, marginLeft: 10 },
    actionsContainer: { marginRight: 10, justifyContent: 'center' },
    rolePill: {
      paddingHorizontal: 10,
      flexDirection: 'row',
      alignSelf: 'flex-start',
      alignItems: 'center',
      borderRadius: 20,
      gap: 6,
    },
    pillIconBadge: {
      width: 18,
      height: 18,
      borderRadius: 9,
      alignItems: 'center',
      justifyContent: 'center',
    },
  });

export default makeStyles;
