import colors from '@/styles/colors';
import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.white },
  scrollView: { flex: 1 },
  scrollContent: { padding: 20, gap: 20 },
  description: { marginBottom: 5 },
  passwordRequirementsContainer: {
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.gray[100],
    padding: 10,
    gap: 5,
  },
  requirementItemContainer: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  requirementCompletionIconContainer: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default styles;
