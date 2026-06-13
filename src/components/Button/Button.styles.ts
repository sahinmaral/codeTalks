import { TextStyle, ViewStyle } from 'react-native';
import colors from '../../styles/colors';

type ButtonThemeStyle = {
  container: ViewStyle;
  text: TextStyle;
};

type ButtonStyles = {
  button: {
    primary: ButtonThemeStyle;
    'primary-outline': ButtonThemeStyle;
    success: ButtonThemeStyle;
    'success-outline': ButtonThemeStyle;
    danger: ButtonThemeStyle;
    'danger-outline': ButtonThemeStyle;
    warning: ButtonThemeStyle;
    'warning-outline': ButtonThemeStyle;
  };
};

const baseContainer: ViewStyle = {
  flexDirection: 'row',
  gap: 10,
  justifyContent: 'center',
  alignItems: 'center',
  paddingVertical: 5,
  borderRadius: 10,
};

const styles: ButtonStyles = {
  button: {
    primary: {
      container: { ...baseContainer, backgroundColor: colors.orange[500] },
      text: { color: colors.white },
    },
    'primary-outline': {
      container: {
        ...baseContainer,
        backgroundColor: colors.white,
        borderWidth: 1,
        borderColor: colors.orange[500],
      },
      text: { color: colors.orange[500] },
    },
    success: {
      container: { ...baseContainer, backgroundColor: colors.green[500] },
      text: { color: colors.white },
    },
    'success-outline': {
      container: {
        ...baseContainer,
        backgroundColor: colors.white,
        borderWidth: 1,
        borderColor: colors.green[500],
      },
      text: { color: colors.green[500] },
    },
    danger: {
      container: { ...baseContainer, backgroundColor: colors.red[500] },
      text: { color: colors.white },
    },
    'danger-outline': {
      container: {
        ...baseContainer,
        backgroundColor: colors.white,
        borderWidth: 1,
        borderColor: colors.red[500],
      },
      text: { color: colors.red[500] },
    },
    warning: {
      container: { ...baseContainer, backgroundColor: colors.yellow[500] },
      text: { color: colors.white },
    },
    'warning-outline': {
      container: {
        ...baseContainer,
        backgroundColor: colors.white,
        borderWidth: 1,
        borderColor: colors.yellow[500],
      },
      text: { color: colors.yellow[500] },
    },
  },
};

export default styles;
