import colors from '@/styles/colors';
import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    padding: 10,
    backgroundColor: colors.white,
    flexDirection: 'row',
    alignItems: 'center',
    overflow: 'hidden',
  },
  lockOverlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
  },
  avatarContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  infoContainer: { flex: 1, marginLeft: 10 },
  actionsContainer: { marginRight: 10, justifyContent: 'center' },
  rolePill: {
    paddingHorizontal: 10,
    alignSelf: 'flex-start',
    alignItems: 'center',
    borderRadius: 20,
  },
  avatarProfilePhoto: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default styles;
