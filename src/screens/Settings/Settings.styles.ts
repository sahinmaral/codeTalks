import colors from '@/styles/colors';
import { StyleSheet } from 'react-native';

const baseListItemContainer = {
  gap: 10,
  padding: 10,
  flexDirection: 'row',
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.light },
  cardListContainer: { padding: 20 },
  listContainer: { borderWidth: 1, borderColor: colors.gray[300], borderRadius: 20, marginTop: 10 },
  listItemContainer: {
    ...baseListItemContainer,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray[300],
  },
  listTopItemContainer: {
    ...baseListItemContainer,
    borderBottomColor: colors.gray[300],
    borderBottomWidth: 1,
  },
  listBottomItemContainer: {
    ...baseListItemContainer,
  },
  listItemContentContainer: { flex: 8 / 10, paddingLeft: 10, justifyContent: 'center' },
  listItemOptionContainer: { flex: 2 / 10, alignItems: 'center' },
  listItemIconContainer: { flex: 1, alignItems: 'center' },
});

export default styles;
