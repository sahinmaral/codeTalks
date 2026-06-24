import { StyleSheet } from 'react-native';
import { Theme } from '../../styles/themes';
import colors from '../../styles/colors';

const makeStyles = (theme: Theme) =>
  StyleSheet.create({
    container: { flex: 1 },
    channelListContainer: {
      flex: 1,
      padding: 20,
      backgroundColor: theme.background.secondary,
    },
    channelListContainerContent: {
      rowGap: 15,
      paddingBottom: 40,
    },
    searchContainer: {
      paddingHorizontal: 20,
      paddingTop: 20,
      backgroundColor: theme.background.secondary,
    },
    emptyContainer: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      padding: 40,
      backgroundColor: theme.background.secondary,
      gap: 8,
    },
    showBubbleContentMenuButton: {
      position: 'absolute',
      bottom: 10,
      right: 10,
      width: 50,
      height: 50,
      borderRadius: 25,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: colors.orange[400],
    },
  });

export default makeStyles;
