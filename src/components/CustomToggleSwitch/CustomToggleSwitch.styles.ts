import { StyleSheet } from 'react-native';
import colors from '@/styles/colors';

export const TRACK_WIDTH = 50;
export const TRACK_HEIGHT = 28;
export const THUMB_SIZE = 22;
export const THUMB_PADDING = 3;
export const TRAVEL = TRACK_WIDTH - THUMB_SIZE - THUMB_PADDING * 2;

const styles = StyleSheet.create({
  track: {
    width: TRACK_WIDTH,
    height: TRACK_HEIGHT,
    borderRadius: TRACK_HEIGHT / 2,
    justifyContent: 'center',
    paddingHorizontal: THUMB_PADDING,
  },
  thumb: {
    width: THUMB_SIZE,
    height: THUMB_SIZE,
    borderRadius: THUMB_SIZE / 2,
    backgroundColor: colors.white,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
});

export default styles;
