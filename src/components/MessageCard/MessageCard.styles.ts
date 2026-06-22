import { StyleSheet } from 'react-native';
import colors from '../../styles/colors';

const styles = StyleSheet.create({
  container: { flexDirection: 'row' },
  senderContainer: { flexDirection: 'row', justifyContent: 'flex-end' },
  userProfilePhotoContainer: { flex: 0.2 },
  contentContainer: { flex: 0.8 },
  senderContentContainer: { flex: 1, alignItems: 'flex-end' },
  messageContainer: {
    width: '90%',
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.gray[300],
    padding: 15,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    borderTopEndRadius: 20,
  },
  senderMessageContainer: {
    width: '70%',
    backgroundColor: colors.orange[400],
    padding: 15,
    borderBottomLeftRadius: 20,
    borderTopLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
});

export default styles;
