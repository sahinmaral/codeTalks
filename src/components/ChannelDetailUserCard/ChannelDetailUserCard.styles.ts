import { StyleSheet, ViewStyle, TextStyle, ImageStyle } from 'react-native';
import colors from '../../styles/colors';

const styles = StyleSheet.create({
  text: { color: colors.black, fontSize: 15 },
  container: {
    borderRadius: 10,
    marginVertical: 10,
    backgroundColor: colors.white,
    padding: 10,
    gap: 15,
    flexDirection: 'row',
  },
  leftContainer: {
    flex: 1.5 / 10,
  },
  photoContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  badgeContainer: {
    backgroundColor: 'gray',
    padding: 5,
    borderRadius: 5,
  },
  badgeText: { color: colors.white, fontSize: 10 },
  rightContainer: {
    flex: 8.5 / 10,
  },
  rightBottomContainer: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  rightBottomText: { color: colors.black, fontSize: 12 },
  rightTopContainer: {
    flex: 1,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});

export default styles;
