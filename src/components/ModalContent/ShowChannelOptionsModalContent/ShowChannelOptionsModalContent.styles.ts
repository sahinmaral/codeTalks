import { Dimensions, StyleSheet } from 'react-native';
import colors from '../../../styles/colors';

const styles = StyleSheet.create({
  modalContainer: {
    justifyContent: 'space-between',
    backgroundColor: colors.stone[100],
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    height: Dimensions.get('window').height / 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  headerContainer: { gap: 6, paddingBottom: 10 },
  headerText: { fontSize: 20, textAlign: 'center', color: 'black', fontWeight: 'bold' },
  description: { fontSize: 14, textAlign: 'center', color: colors.gray[500] },
  tooltipContainer: { gap: 8 },
  menuItemContainer: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: colors.stone[100],
  },
  menuItemText: { fontSize: 16, color: 'black' },
});

export default styles;
