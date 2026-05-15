import colors from '@/styles/colors';
import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  headerContainer: {
    paddingTop: 10,
    gap: 5,
    alignItems: 'center',
  },
  optionListContainer: { gap: 10, paddingVertical: 30 },
  optionItemContainer: {
    borderWidth: 1,
    borderRadius: 10,
    padding: 20,
    gap: 20,
    borderColor: colors.gray[300],
    flexDirection: 'row',
    alignItems: 'center',
  },
  optionIconContainer: { flex: 0.2, marginRight: 10 },
  optionTextContainer: { flex: 0.7 },
  optionArrowContainer: { flex: 0.1 },
  optionIconBackground: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.orange[100],
  },
});

export default styles;
