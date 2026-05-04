import colors from '@/styles/colors';
import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  line: {
    flex: 1,
    height: 1,
    borderWidth: 1,
    borderRadius: 10,
    borderColor: colors.gray[100],
    backgroundColor: colors.gray[100],
  },
  text: {
    textAlign: 'center',
    paddingHorizontal: 10,
  },
});

export default styles;
