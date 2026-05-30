import { StyleSheet } from 'react-native';
import colors from '@/styles/colors';

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.light },
  textInputContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  textInput: {
    backgroundColor: colors.gray[200],
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 10,
    fontFamily: 'Montserrat_400',
    minHeight: 44,
    maxHeight: 120,
    textAlignVertical: 'center',
  },
  sendMessageButtonContainer: {
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  sendMessageButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.orange[400],
  },
  sendMessageButtonDisabled: {
    backgroundColor: colors.gray[400],
  },
  dateSeparatorContainer: {
    alignItems: 'center',
    marginVertical: 4,
  },
  dateSeparatorPill: {
    backgroundColor: colors.gray[200],
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  dateSeparatorText: {
    fontFamily: 'Montserrat_400',
    fontSize: 12,
    color: colors.gray[700],
  },
});

export default styles;
