import {Dimensions, StyleSheet} from 'react-native';

const styles = StyleSheet.create({
  modal: {
    overlay: {
      flex: 1,
      backgroundColor:'rgba(0, 0, 0, 0.5)',
      justifyContent: 'flex-end',
    },
    container: {
      justifyContent: 'space-between',
      backgroundColor: colors.stone[100],
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      padding: 20,
      height: Dimensions.get('window').height / 3,
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 4,
      elevation: 5,
    },
  },
});

export default styles;
