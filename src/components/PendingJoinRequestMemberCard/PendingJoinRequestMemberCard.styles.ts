import colors from '@/styles/colors';
import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    padding: 10,
    backgroundColor: 'white',
    flexDirection: 'column',
    borderWidth: 1,
    borderColor: colors.gray[300],
    borderRadius: 10,
    gap: 10,
  },
  userInformationsContainer: {
    flexDirection: 'row',
    gap: 10,
  },
  userInformationContainer: { flex: 7 / 10 },
  actionsContainer: {
    flexDirection: 'row',
    gap: 10,
    justifyContent: 'flex-start',
  },
  statusCreateAtContainer: {
    flex: 3 / 10,
    alignItems: 'flex-end',
  },
});

export default styles;
