import { ViewStyle, TextStyle } from 'react-native';
import colors from '../../styles/colors';

type ButtonThemeStyle = {
  container: ViewStyle;
  text: TextStyle;
};

type ButtonStyles = {
  button: {
    primary: ButtonThemeStyle;
    secondary: ButtonThemeStyle;
  };
};

const baseContainer: ViewStyle = {
  flexDirection: 'row',
  gap: 10,
  justifyContent: 'center',
  alignItems: 'center',
  paddingVertical: 5,
  borderRadius: 5,
};

const baseText: TextStyle = {
  fontWeight: 'bold',
  fontSize: 20,
};

const styles: ButtonStyles = {
  button: {
    primary: {
      container: { ...baseContainer, backgroundColor: colors.orange[400] },
      text: { ...baseText, color: colors.white },
    },
    secondary: {
      container: { ...baseContainer, backgroundColor: colors.white },
      text: { ...baseText, color: colors.orange[400] },
    },
  },
};

export default styles;
