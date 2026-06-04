import colors from '@/styles/colors';
import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    borderRadius: 20,
    borderWidth: 1,
    paddingHorizontal: 20,
    borderBlockColor: colors.gray[300],
  },
  contentContainer: {
    backgroundColor: colors.white,
  },
  buttonsContainer: {
    paddingBottom: 36,
    paddingTop: 8,
  },
  menuItemContainer: {
    paddingVertical: 12,
  },
  menuItemText: {
    fontSize: 16,
    color: colors.black,
  },
});

export default styles;
