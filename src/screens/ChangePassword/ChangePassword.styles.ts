import { Theme } from '@/styles/themes';
import { StyleSheet } from 'react-native';

const makeStyles = (theme: Theme) =>
  StyleSheet.create({
    container: { flex: 1, backgroundColor: theme.background.primary },
    scrollView: { flex: 1 },
    scrollContent: { padding: 20, gap: 20 },
    description: { marginBottom: 5 },
    passwordRequirementsContainer: {
      borderRadius: 20,
      borderWidth: 1,
      borderColor: theme.border,
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

export default makeStyles;
