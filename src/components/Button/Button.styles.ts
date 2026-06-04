import { ViewStyle, TextStyle } from 'react-native';
import colors from '../../styles/colors';

type ButtonThemeStyle = {
  container: ViewStyle;
  text: TextStyle;
};

type ButtonStyles = {
  button: {
    primary: ButtonThemeStyle;
    'primary-outline': ButtonThemeStyle;
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
  },
};

export default styles;
