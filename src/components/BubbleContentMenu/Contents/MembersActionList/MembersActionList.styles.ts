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
  },
  avatarProfilePhoto: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  rolePillContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
  },
  pillIconBadge: {
    width: 18,
    height: 18,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionListContainer: {
    gap: 12,
    paddingVertical: 10,
  },
  blockHelperText: {
    textAlign: 'center',
  },
});

export default styles;
