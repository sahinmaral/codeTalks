import { Theme } from '@/styles/themes';
import { StyleSheet } from 'react-native';

const baseListItemContainer = {
  gap: 10,
  padding: 10,
  flexDirection: 'row' as const,
};

const makeStyles = (theme: Theme) =>
  StyleSheet.create({
    container: { flex: 1, backgroundColor: theme.background.secondary },
    cardListContainer: { padding: 20 },
    listContainer: {
      borderWidth: 1,
      borderColor: theme.border,
      borderRadius: 20,
      marginTop: 10,
      backgroundColor: theme.surface,
    },
    listItemContainer: {
      ...baseListItemContainer,
      borderBottomWidth: 1,
      borderBottomColor: theme.border,
    },
    listTopItemContainer: {
      ...baseListItemContainer,
      borderBottomColor: theme.border,
      borderBottomWidth: 1,
    },
    listBottomItemContainer: {
      ...baseListItemContainer,
    },
    listItemContentContainer: { flex: 8 / 10, paddingLeft: 10, justifyContent: 'center' },
    listItemOptionContainer: { flex: 2 / 10, alignItems: 'center' },
    listItemIconContainer: { flex: 1, alignItems: 'center' },
  });

export default makeStyles;
