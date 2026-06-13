import colors from '@/styles/colors';
import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  headerContainer: {
    paddingTop: 10,
    gap: 8,
    alignItems: 'center',
  },
  avatarContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.gray[300],
  },
  avatarProfilePhoto: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  requestedAtPill: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    backgroundColor: colors.light,
  },
  actionListContainer: {
    gap: 12,
    paddingVertical: 30,
  },
  blockHelperText: {
    textAlign: 'center',
  },
});

export default styles;
