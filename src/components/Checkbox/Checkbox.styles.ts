import { StyleSheet } from 'react-native';
import colors from '@/styles/colors';

const styles = StyleSheet.create({
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    box: {
        width: 24,
        height: 24,
        borderRadius: 4,
        borderWidth: 1.5,
        borderColor: colors.gray[100],
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: colors.white,
    },
    boxChecked: {
        backgroundColor: colors.orange[500],
        borderColor: colors.orange[500],
    },
    boxDisabled: {
        backgroundColor: colors.gray[100],
        borderColor: colors.gray[100],
    },
    labelDisabled: {
        color: colors.gray[500],
    },
});

export default styles;
