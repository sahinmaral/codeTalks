import {Dimensions, StyleSheet} from 'react-native';
import colors from '../../../styles/colors';

const styles = StyleSheet.create({
  modal: {
    container: {
      justifyContent: 'space-between',
      backgroundColor: colors.stone[100],
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      padding: 20,
      height: Dimensions.get('window').height / 3,
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 4,
      elevation: 5,
    },
    input: {
      width: Dimensions.get('window').width - 40,
    },
    inputError: {color: colors.red[500], fontWeight: '600'},
    button: {
      width: Dimensions.get('window').width - 40,
    },
  },
});

export default styles;
