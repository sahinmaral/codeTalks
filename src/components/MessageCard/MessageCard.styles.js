import {StyleSheet} from 'react-native';

const styles = StyleSheet.create({
  text: {color: colors.black, fontSize: 15},
  container: {
    borderRadius: 10,
    marginVertical: 10,
    backgroundColor: colors.white,
    padding: 10,
    gap: 15,
  },
  top: {
    container: {flexDirection: 'row', justifyContent: 'space-between'},
  },
  bottom: {
    container: {alignContent: 'space-between'},
    text: {fontSize: 17, fontWeight: 'bold'},
  },
});

export default styles