import {StyleSheet} from 'react-native';
import colors from '../../styles/colors';

const base_styles = {
  button: {
    container: {
      flexDirection:"row",
      gap:10,
      justifyContent:"center",
      alignItems: 'center',
      paddingVertical: 5,
      borderRadius: 5,
    },
    text: {
      fontWeight: 'bold',
      fontSize: 20,
    }
  },
};

const styles = StyleSheet.create({
  button: {
    primary: {
      container: {
        ...base_styles.button.container,
        backgroundColor: colors.orange['400'],
      },
      text: {
        ...base_styles.button.text,
        color: colors['white'],
      },
    },
    secondary: {
      container: {
        ...base_styles.button.container,
        backgroundColor: colors['white'],
      },
      text: {
        ...base_styles.button.text,
        color: colors.orange['400'],
      },
    },
  },
});

export default styles;
