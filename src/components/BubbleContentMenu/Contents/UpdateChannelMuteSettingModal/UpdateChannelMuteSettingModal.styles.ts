import colors from '@/styles/colors';
import { Theme } from '@/styles/themes';
import { StyleSheet } from 'react-native';

const makeStyles = (theme: Theme) => {
  return StyleSheet.create({
    container: {
      gap: 20,
    },
    header: {
      gap: 6,
    },
    description: {
      lineHeight: 20,
    },
    optionList: {
      borderRadius: 14,
      borderWidth: 1,
      borderColor: theme.border,
      overflow: 'hidden',
    },
    option: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingVertical: 16,
      paddingHorizontal: 16,
      backgroundColor: theme.surface,
    },
    optionBordered: {
      borderBottomWidth: 1,
      borderBottomColor: theme.border,
    },
    optionActive: {
      backgroundColor: theme.mode === 'dark' ? 'rgba(255,122,0,0.12)' : colors.orange[50],
    },
    infoBox: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
      padding: 12,
      borderRadius: 12,
      backgroundColor: theme.background.tertiary,
    },
    infoText: {
      flex: 1,
      lineHeight: 18,
    },
    actions: {
      gap: 10,
    },
    cancelButton: {
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 5,
      borderRadius: 10,
      backgroundColor: 'transparent',
      borderWidth: 1,
      borderColor: theme.border,
    },
  });
};

export default makeStyles;
