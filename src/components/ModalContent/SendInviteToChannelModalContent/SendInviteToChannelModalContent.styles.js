import {Dimensions, StyleSheet} from 'react-native';
import colors from '../../../styles/colors';

const styles = StyleSheet.create({
  modalContainer: {
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
  submitButton:{
    width: Dimensions.get('window').width - 40,
  },
  modalInput:{
    width: Dimensions.get('window').width - 40,
  },
  modalInputError: {color: colors.red[500], fontWeight: '600'},
  headerContainer:{
    gap:10,
    paddingBottom:10
  },
  headerText: { fontSize: 20, textAlign: "center", color: "black", fontWeight:"bold" },
});

export default styles;
