import { StyleSheet } from 'react-native';
import colors from '../../styles/colors';

const styles = StyleSheet.create({
  container: { flex: 1 },
  channelListContainer: {
    flex: 1,
    padding: 20,
    backgroundColor: colors.light,
  },
  channelListContainerContent: {
    rowGap: 15,
    paddingBottom: 40,
  },
  searchContainer: {
    paddingHorizontal: 20,
    paddingTop: 20,
    backgroundColor: colors.light,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
    backgroundColor: colors.light,
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

export default styles;
